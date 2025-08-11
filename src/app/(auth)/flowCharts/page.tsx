'use client'
import { useState, useRef, useEffect } from 'react';
import { marked } from 'marked';

type EditorMode = 'document' | 'both' | 'canvas';
type ToolMode = 'select' | 'node' | 'text' | 'shape' | 'connection' | 'icon';
type ShapeType = 'rectangle' | 'circle' | 'diamond' | 'triangle' | 'hexagon';
type Theme = 'light' | 'dark' | 'system';

interface DiagramElement {
  id: string;
  type: 'node' | 'text' | 'shape' | 'icon' | 'connection';
  shape?: ShapeType;
  icon?: string;
  content?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  from?: string;
  to?: string;
}

const ErasorEditor = () => {
  const [title, setTitle] = useState<string>('Untitled File');
  const [content, setContent] = useState<string>('Type your notes or document here — style with markdown or shortcuts (Ctrl/i)');
  const [mode, setMode] = useState<EditorMode>('document');
  const [zoom, setZoom] = useState<number>(100);
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [toolMode, setToolMode] = useState<ToolMode>('select');
  const [selectedShape, setSelectedShape] = useState<ShapeType>('rectangle');
  const [selectedIcon, setSelectedIcon] = useState<string>('📝');
  const [diagramElements, setDiagramElements] = useState<DiagramElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>('light');
  const [connectionStart, setConnectionStart] = useState<string | null>(null);
  const [showShortcuts, setShowShortcuts] = useState<boolean>(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  // Available icons for the icon tool
  const availableIcons = ['📝', '🔗', '⭐', '🔄', '📊', '📌', '🔵', '🟢', '🔴', '❓', '💡', '⚠️'];
  const availableColors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

  // Apply theme
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme === 'system' ? 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : 
      theme);
  }, [theme]);

  // Handle markdown parsing
  const getMarkdownText = () => {
    return { __html: marked(content) };
  };

  // Handle canvas click to add elements
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (mode !== 'canvas') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Handle connection creation
    if (toolMode === 'connection' && connectionStart) {
      const elementUnderCursor = findElementAtPosition(x, y);
      if (elementUnderCursor && elementUnderCursor.id !== connectionStart) {
        const newConnection: DiagramElement = {
          id: `conn-${Date.now()}`,
          type: 'connection',
          from: connectionStart,
          to: elementUnderCursor.id,
          x: 0,
          y: 0,
          width: 0,
          height: 0,
          color: availableColors[Math.floor(Math.random() * availableColors.length)]
        };
        setDiagramElements([...diagramElements, newConnection]);
      }
      setConnectionStart(null);
      return;
    }

    if (toolMode === 'select') return;

    const newElement: DiagramElement = {
      id: `element-${Date.now()}`,
      type: toolMode === 'shape' ? 'shape' : 
            toolMode === 'node' ? 'node' : 
            toolMode === 'text' ? 'text' : 
            toolMode === 'connection' ? 'node' : 'icon',
      shape: toolMode === 'shape' ? selectedShape : undefined,
      icon: toolMode === 'icon' ? selectedIcon : undefined,
      content: toolMode === 'text' ? 'Double click to edit' : undefined,
      x,
      y,
      width: toolMode === 'text' ? 150 : 100,
      height: toolMode === 'text' ? 40 : 60,
      color: availableColors[Math.floor(Math.random() * availableColors.length)]
    };

    // If in connection mode and clicked on an element, start connection
    if (toolMode === 'connection' && !connectionStart) {
      const elementUnderCursor = findElementAtPosition(x, y);
      if (elementUnderCursor) {
        setConnectionStart(elementUnderCursor.id);
        return;
      }
    }

    setDiagramElements([...diagramElements, newElement]);
  };

  // Find element at position
  const findElementAtPosition = (x: number, y: number) => {
    return diagramElements.find(el => {
      return x >= el.x && x <= el.x + el.width &&
             y >= el.y && y <= el.y + el.height;
    });
  };

  // Handle element selection
  const handleElementClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedElementId(id);
  };

  // Handle element movement
  const handleElementDrag = (e: React.MouseEvent, id: string) => {
    if (toolMode !== 'select') return;

    const element = diagramElements.find(el => el.id === id);
    if (!element) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const startLeft = element.x;
    const startTop = element.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newX = startLeft + (moveEvent.clientX - startX);
      const newY = startTop + (moveEvent.clientY - startY);
      
      setDiagramElements(diagramElements.map(el => 
        el.id === id ? { ...el, x: newX, y: newY } : el
      ));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Handle text editing
  const handleTextEdit = (e: React.MouseEvent, id: string) => {
    if (e.detail !== 2) return; // Only on double click
    const element = diagramElements.find(el => el.id === id);
    if (!element || (element.type !== 'text' && element.type !== 'node')) return;

    const newContent = prompt('Edit text:', element.content || '');
    if (newContent !== null) {
      setDiagramElements(diagramElements.map(el => 
        el.id === id ? { ...el, content: newContent } : el
      ));
    }
  };

  // Render shape based on type
  const renderShape = (shape: ShapeType, color: string = '#3b82f6') => {
    switch (shape) {
      case 'circle':
        return <div className={`rounded-full border-2 bg-opacity-20 w-full h-full`} style={{ borderColor: color, backgroundColor: `${color}20` }}></div>;
      case 'diamond':
        return <div className={`transform rotate-45 border-2 bg-opacity-20 w-3/4 h-3/4`} style={{ borderColor: color, backgroundColor: `${color}20` }}></div>;
      case 'triangle':
        return (
          <div className="relative w-full h-full">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <polygon points="50,0 100,100 0,100" fill={`${color}20`} stroke={color} strokeWidth="2" />
            </svg>
          </div>
        );
      case 'hexagon':
        return (
          <div className="relative w-full h-full">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <polygon points="25,0 75,0 100,50 75,100 25,100 0,50" fill={`${color}20`} stroke={color} strokeWidth="2" />
            </svg>
          </div>
        );
      default: // rectangle
        return <div className={`border-2 bg-opacity-20 w-full h-full`} style={{ borderColor: color, backgroundColor: `${color}20` }}></div>;
    }
  };

  // Render connection
  const renderConnection = (conn: DiagramElement) => {
    const fromElement = diagramElements.find(el => el.id === conn.from);
    const toElement = diagramElements.find(el => el.id === conn.to);
    
    if (!fromElement || !toElement) return null;

    const fromX = fromElement.x + fromElement.width / 2;
    const fromY = fromElement.y + fromElement.height / 2;
    const toX = toElement.x + toElement.width / 2;
    const toY = toElement.y + toElement.height / 2;

    return (
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
        <line 
          x1={fromX} 
          y1={fromY} 
          x2={toX} 
          y2={toY} 
          stroke={conn.color || '#3b82f6'} 
          strokeWidth="2" 
          markerEnd="url(#arrowhead)"
        />
      </svg>
    );
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case 'o':
            e.preventDefault();
            generateOutline();
            break;
          case 'j':
            e.preventDefault();
            generateDiagram();
            break;
          case 'i':
            e.preventDefault();
            togglePreview();
            break;
          case 'x':
            e.preventDefault();
            if (selectedElementId) {
              setDiagramElements(diagramElements.filter(el => el.id !== selectedElementId));
              setSelectedElementId(null);
            }
            break;
          case 'k':
            e.preventDefault();
            setShowShortcuts(!showShortcuts);
            break;
          case 'd':
            e.preventDefault();
            if (selectedElementId) {
              const element = diagramElements.find(el => el.id === selectedElementId);
              if (element) {
                const newElement = {
                  ...element,
                  id: `element-${Date.now()}`,
                  x: element.x + 20,
                  y: element.y + 20
                };
                setDiagramElements([...diagramElements, newElement]);
                setSelectedElementId(newElement.id);
              }
            }
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, diagramElements, showShortcuts]);

  const generateOutline = () => {
    const headings = content.split('\n').filter(line => line.startsWith('#'));
    alert(`Generated Outline:\n\n${headings.join('\n')}`);
  };

  const generateDiagram = () => {
    // Auto-generate a simple diagram based on headings
    const headings = content.split('\n').filter(line => line.startsWith('#'));
    const newElements: DiagramElement[] = headings.map((heading, index) => ({
      id: `auto-${index}`,
      type: 'node',
      content: heading.replace(/^#+\s*/, ''),
      x: 100 + (index % 3) * 200,
      y: 100 + Math.floor(index / 3) * 120,
      width: 120,
      height: 60,
      color: availableColors[index % availableColors.length]
    }));

    setDiagramElements([...diagramElements, ...newElements]);
    setMode('canvas');
  };

  const togglePreview = () => {
    setIsPreview(!isPreview);
  };

  const handleShare = () => {
    alert('Share functionality would go here');
  };

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZoom(parseInt(e.target.value));
  };

  const resetCanvas = () => {
    if (confirm('Are you sure you want to clear the canvas?')) {
      setDiagramElements([]);
      setSelectedElementId(null);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-2xl font-bold outline-none w-full max-w-md bg-transparent dark:text-white"
        />
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-md p-1">
            <button
              onClick={() => setMode('document')}
              className={`px-3 py-1 rounded ${mode === 'document' ? 'bg-white dark:bg-gray-600 shadow' : 'dark:text-gray-300'}`}
            >
              Document
            </button>
            <button
              onClick={() => setMode('both')}
              className={`px-3 py-1 rounded ${mode === 'both' ? 'bg-white dark:bg-gray-600 shadow' : 'dark:text-gray-300'}`}
            >
              Both
            </button>
            <button
              onClick={() => setMode('canvas')}
              className={`px-3 py-1 rounded ${mode === 'canvas' ? 'bg-white dark:bg-gray-600 shadow' : 'dark:text-gray-300'}`}
            >
              Canvas
            </button>
          </div>
          
          {mode === 'canvas' && (
            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-md p-1">
              <button
                onClick={() => setToolMode('select')}
                className={`p-2 rounded ${toolMode === 'select' ? 'bg-white dark:bg-gray-600 shadow' : 'dark:text-gray-300'}`}
                title="Select tool (S)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => setToolMode('node')}
                className={`p-2 rounded ${toolMode === 'node' ? 'bg-white dark:bg-gray-600 shadow' : 'dark:text-gray-300'}`}
                title="Node tool (N)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setToolMode('text')}
                className={`p-2 rounded ${toolMode === 'text' ? 'bg-white dark:bg-gray-600 shadow' : 'dark:text-gray-300'}`}
                title="Text tool (T)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M7 7h6v2H7V7zm0 4h6v2H7v-2z" clipRule="evenodd" />
                </svg>
              </button>
              <div className="relative group">
                <button
                  onClick={() => setToolMode('shape')}
                  className={`p-2 rounded ${toolMode === 'shape' ? 'bg-white dark:bg-gray-600 shadow' : 'dark:text-gray-300'}`}
                  title="Shape tool (H)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" clipRule="evenodd" />
                  </svg>
                </button>
                {toolMode === 'shape' && (
                  <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10">
                    <div className="p-2 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setSelectedShape('rectangle')}
                        className={`p-2 rounded ${selectedShape === 'rectangle' ? 'bg-blue-100 dark:bg-gray-600' : ''}`}
                      >
                        <div className="w-6 h-6 border-2 border-blue-500 mx-auto"></div>
                      </button>
                      <button
                        onClick={() => setSelectedShape('circle')}
                        className={`p-2 rounded ${selectedShape === 'circle' ? 'bg-blue-100 dark:bg-gray-600' : ''}`}
                      >
                        <div className="w-6 h-6 border-2 border-blue-500 rounded-full mx-auto"></div>
                      </button>
                      <button
                        onClick={() => setSelectedShape('diamond')}
                        className={`p-2 rounded ${selectedShape === 'diamond' ? 'bg-blue-100 dark:bg-gray-600' : ''}`}
                      >
                        <div className="w-6 h-6 border-2 border-blue-500 transform rotate-45 mx-auto"></div>
                      </button>
                      <button
                        onClick={() => setSelectedShape('triangle')}
                        className={`p-2 rounded ${selectedShape === 'triangle' ? 'bg-blue-100 dark:bg-gray-600' : ''}`}
                      >
                        <div className="w-6 h-6 mx-auto">
                          <svg viewBox="0 0 24 24" className="w-6 h-6">
                            <polygon points="12,2 22,22 2,22" fill="none" stroke="#3b82f6" strokeWidth="2" />
                          </svg>
                        </div>
                      </button>
                      <button
                        onClick={() => setSelectedShape('hexagon')}
                        className={`p-2 rounded ${selectedShape === 'hexagon' ? 'bg-blue-100 dark:bg-gray-600' : ''}`}
                      >
                        <div className="w-6 h-6 mx-auto">
                          <svg viewBox="0 0 24 24" className="w-6 h-6">
                            <polygon points="12,2 18,6 18,16 12,20 6,16 6,6" fill="none" stroke="#3b82f6" strokeWidth="2" />
                          </svg>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="relative group">
                <button
                  onClick={() => setToolMode('icon')}
                  className={`p-2 rounded ${toolMode === 'icon' ? 'bg-white dark:bg-gray-600 shadow' : 'dark:text-gray-300'}`}
                  title="Icon tool (I)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z" clipRule="evenodd" />
                  </svg>
                </button>
                {toolMode === 'icon' && (
                  <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10">
                    <div className="p-2 grid grid-cols-3 gap-2">
                      {availableIcons.map(icon => (
                        <button
                          key={icon}
                          onClick={() => setSelectedIcon(icon)}
                          className={`p-2 rounded text-2xl ${selectedIcon === icon ? 'bg-blue-100 dark:bg-gray-600' : ''}`}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={() => setToolMode('connection')}
                className={`p-2 rounded ${toolMode === 'connection' ? 'bg-white dark:bg-gray-600 shadow' : 'dark:text-gray-300'}`}
                title="Connection tool (C)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={resetCanvas}
                className="p-2 rounded text-red-500 hover:bg-red-100 dark:hover:bg-gray-600"
                title="Clear canvas"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            <button
              onClick={handleShare}
              className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Share
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setZoom(Math.max(30, zoom - 10))} 
              className="px-2 dark:text-gray-300"
            >
              -
            </button>
            <input
              type="range"
              min="30"
              max="150"
              value={zoom}
              onChange={handleZoomChange}
              className="w-20"
            />
            <span className="w-12 text-center dark:text-gray-300">{zoom}%</span>
            <button 
              onClick={() => setZoom(Math.min(150, zoom + 10))} 
              className="px-2 dark:text-gray-300"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto" style={{ zoom: `${zoom}%` }}>
        {mode === 'document' && (
          <div className="max-w-4xl mx-auto p-8">
            {isPreview ? (
              <div
                className="prose max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={getMarkdownText()}
              />
            ) : (
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                className="min-h-[60vh] p-4 outline-none prose max-w-none dark:prose-invert dark:text-white"
                onInput={(e) => setContent(e.currentTarget.textContent || '')}
              >
                {content}
              </div>
            )}
          </div>
        )}

        {mode === 'both' && (
          <div className="grid grid-cols-2 gap-8 max-w-6xl mx-auto p-8">
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              className="min-h-[60vh] p-4 outline-none prose max-w-none border rounded dark:border-gray-700 dark:prose-invert dark:text-white"
              onInput={(e) => setContent(e.currentTarget.textContent || '')}
            >
              {content}
            </div>
            <div
              className="prose max-w-none border rounded p-4 dark:border-gray-700 dark:prose-invert"
              dangerouslySetInnerHTML={getMarkdownText()}
            />
          </div>
        )}

        {mode === 'canvas' && (
          <div 
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="relative w-full h-full min-h-[60vh] bg-gray-50 dark:bg-gray-800 border rounded dark:border-gray-700"
          >
            {/* Arrowhead marker for connections */}
            <svg className="absolute" width="0" height="0">
              <defs>
                <marker 
                  id="arrowhead" 
                  markerWidth="10" 
                  markerHeight="7" 
                  refX="9" 
                  refY="3.5" 
                  orient="auto"
                >
                  <polygon points="0 0, 10 3.5, 0 7" />
                </marker>
              </defs>
            </svg>

            {connectionStart && (
              <div className="absolute inset-0 pointer-events-none">
                <svg className="w-full h-full">
                  <line 
                    x1={diagramElements.find(el => el.id === connectionStart)?.x || 0} 
                    y1={diagramElements.find(el => el.id === connectionStart)?.y || 0} 
                    x2={0} 
                    y2={0} 
                    stroke="#3b82f6" 
                    strokeWidth="2" 
                    strokeDasharray="5,5"
                  />
                </svg>
              </div>
            )}

            {diagramElements.filter(el => el.type === 'connection').map(conn => (
              renderConnection(conn)
            ))}

            {diagramElements.filter(el => el.type !== 'connection').map(element => (
              <div
                key={element.id}
                onClick={(e) => handleElementClick(e, element.id)}
                onMouseDown={(e) => handleElementDrag(e, element.id)}
                onDoubleClick={(e) => handleTextEdit(e, element.id)}
                className={`absolute ${selectedElementId === element.id ? 'ring-2 ring-blue-500' : ''}`}
                style={{
                  left: `${element.x}px`,
                  top: `${element.y}px`,
                  width: `${element.width}px`,
                  height: `${element.height}px`,
                  cursor: toolMode === 'select' ? 'move' : 'default',
                  zIndex: 1,
                }}
              >
                {element.type === 'shape' && element.shape && (
                  <div className="w-full h-full flex items-center justify-center">
                    {renderShape(element.shape, element.color)}
                    {element.content && (
                      <div className="absolute inset-0 flex items-center justify-center text-sm p-2">
                        {element.content}
                      </div>
                    )}
                  </div>
                )}
                {element.type === 'node' && (
                  <div 
                    className="w-full h-full border-2 rounded flex items-center justify-center"
                    style={{ 
                      borderColor: element.color || '#3b82f6',
                      backgroundColor: `${element.color || '#3b82f6'}20`
                    }}
                  >
                    <div className="text-center p-2 dark:text-white">{element.content || 'Node'}</div>
                  </div>
                )}
                {element.type === 'text' && (
                  <div 
                    className="w-full h-full border rounded p-2 dark:border-gray-600 dark:text-white"
                    style={{ backgroundColor: element.color ? `${element.color}20` : 'white' }}
                  >
                    {element.content}
                  </div>
                )}
                {element.type === 'icon' && element.icon && (
                  <div 
                    className="w-full h-full flex items-center justify-center text-4xl"
                    style={{ color: element.color }}
                  >
                    {element.icon}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-500 dark:text-gray-400 flex justify-between">
        <div className="flex space-x-4">
          <button onClick={generateOutline} className="hover:text-gray-700 dark:hover:text-gray-300">
            Generate Outline (Ctrl+O)
          </button>
          <button onClick={generateDiagram} className="hover:text-gray-700 dark:hover:text-gray-300">
            Generate Diagram (Ctrl+J)
          </button>
          <button onClick={togglePreview} className="hover:text-gray-700 dark:hover:text-gray-300">
            Toggle Preview (Ctrl+I)
          </button>
          {mode === 'canvas' && selectedElementId && (
            <button 
              onClick={() => {
                setDiagramElements(diagramElements.filter(el => el.id !== selectedElementId));
                setSelectedElementId(null);
              }}
              className="hover:text-gray-700 dark:hover:text-gray-300"
            >
              Delete (Ctrl+X)
            </button>
          )}
        </div>
        <div>
          <span className="hidden md:inline">Some random ID: +98f38f8f</span>
        </div>
      </div>
    </div>
  );
};

export default ErasorEditor;
            