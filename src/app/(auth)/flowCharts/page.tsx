
  "use client"
  import React, { useState, useRef, useEffect, useCallback } from 'react';
  import { 
    MousePointer, 
    Square, 
    Circle, 
    ArrowRight, 
    Minus, 
    Type, 
    Pencil, 
    Eraser,
    Hand,
    RotateCcw,
    RotateCw,
    ZoomIn,
    ZoomOut,
    Download,
    Upload,
    Trash2,
    Copy,
    AlignLeft,
    Bold,
    Italic,
    Underline,
    Menu,
    Search,
    Folder,
    File,
    Users,
    Bot,
    BookOpen,
    Github,
    Lock,
    Archive,
    Plus,
    ChevronDown,
    Sparkles,
    Database,
    Server,
    Globe,
    Smartphone,
    Cpu,
    HardDrive,
    Cloud,
    Wifi,
    Shield,
    Settings,
    User,
    Mail,
    Calendar,
    MessageSquare,
    ImageIcon,
    Video,
    Music,
    FileText,
    Code,
    Monitor,
    Laptop,
    Tablet,
    MessageSquareMore,
    Save
  } from 'lucide-react';

  interface Point {
    x: number;
    y: number;
  }

  interface DrawingElement {
    id: string;
    type: 'freehand' | 'rectangle' | 'circle' | 'arrow' | 'line' | 'text' | 'curved-arrow' | 'node' | 'icon' | 'comment';
    points: Point[];
    style: {
      stroke: string;
      strokeWidth: number;
      fill?: string;
      borderRadius?: number;
      fontStyle?: 'normal' | 'bold' | 'italic' | 'bold italic';
      textAlign?: 'left' | 'center' | 'right';
      textDecoration?: 'none' | 'underline';
    };
    text?: string;
    iconType?: string;
    nodeType?: 'rounded' | 'diamond' | 'circle';
    bounds?: { x: number; y: number; width: number; height: number };
    comment?: string;
  }

  type Tool = 'select' | 'rectangle' | 'circle' | 'arrow' | 'curved-arrow' | 'line' | 'pen' | 'eraser' | 'text' | 'hand' | 'node' | 'icon' | 'comment';
  type Tab = 'document' | 'both' | 'canvas';

  const iconLibrary = [
    { name: 'Database', icon: Database },
    { name: 'Server', icon: Server },
    { name: 'Globe', icon: Globe },
    { name: 'Smartphone', icon: Smartphone },
    { name: 'Cpu', icon: Cpu },
    { name: 'HardDrive', icon: HardDrive },
    { name: 'Cloud', icon: Cloud },
    { name: 'Wifi', icon: Wifi },
    { name: 'Shield', icon: Shield },
    { name: 'Settings', icon: Settings },
    { name: 'User', icon: User },
    { name: 'Mail', icon: Mail },
    { name: 'Calendar', icon: Calendar },
    { name: 'MessageSquare', icon: MessageSquare },
    { name: 'ImageIcon', icon: ImageIcon },
    { name: 'Video', icon: Video },
    { name: 'Music', icon: Music },
    { name: 'FileText', icon: FileText },
    { name: 'Code', icon: Code },
    { name: 'Monitor', icon: Monitor },
    { name: 'Laptop', icon: Laptop },
    { name: 'Tablet', icon: Tablet }
  ];

  const EraserWhiteboard: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const documentRef = useRef<HTMLDivElement>(null);
    
    const [currentTool, setCurrentTool] = useState<Tool>('select');
    const [activeTab, setActiveTab] = useState<Tab>('both');
    const [isDrawing, setIsDrawing] = useState(false);
    const [elements, setElements] = useState<DrawingElement[]>([]);
    const [currentElement, setCurrentElement] = useState<DrawingElement | null>(null);
    const [selectedElement, setSelectedElement] = useState<string | null>(null);
    const [zoom, setZoom] = useState(100);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [lastPanPoint, setLastPanPoint] = useState<Point>({ x: 0, y: 0 });
    const [strokeColor, setStrokeColor] = useState('#000000');
    const [strokeWidth, setStrokeWidth] = useState(2);
    const [fillColor, setFillColor] = useState('transparent');
    const [isTextEditing, setIsTextEditing] = useState(false);
    const [textInput, setTextInput] = useState('');
    const [textPosition, setTextPosition] = useState<Point>({ x: 0, y: 0 });
    const [showIconLibrary, setShowIconLibrary] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState('Database');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showAIDialog, setShowAIDialog] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');
    const [documentContent, setDocumentContent] = useState('# Untitled Document\n\nStart typing your document here...');
    const [selectedNodeType, setSelectedNodeType] = useState<'rounded' | 'diamond' | 'circle'>('rounded');
    const [activeFilter, setActiveFilter] = useState('All');
    const [isCommentEditing, setIsCommentEditing] = useState(false);
    const [commentInput, setCommentInput] = useState('');
    const [commentPosition, setCommentPosition] = useState<Point>({ x: 0, y: 0 });
    const [selectedElementForComment, setSelectedElementForComment] = useState<string | null>(null);
    const [fontStyle, setFontStyle] = useState<'normal' | 'bold' | 'italic' | 'bold italic'>('normal');
    const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left');
    const [textDecoration, setTextDecoration] = useState<'none' | 'underline'>('none');
    const [isMovingElement, setIsMovingElement] = useState(false);
    const [moveStartPoint, setMoveStartPoint] = useState<Point>({ x: 0, y: 0 });
    const [selectedElementForMove, setSelectedElementForMove] = useState<DrawingElement | null>(null);

    const tools = [
      { id: 'select', icon: MousePointer, label: 'Select' },
      { id: 'rectangle', icon: Square, label: 'Rectangle' },
      { id: 'circle', icon: Circle, label: 'Circle' },
      { id: 'arrow', icon: ArrowRight, label: 'Arrow' },
      { id: 'curved-arrow', icon: ArrowRight, label: 'Curved Arrow' },
      { id: 'line', icon: Minus, label: 'Line' },
      { id: 'pen', icon: Pencil, label: 'Pen' },
      { id: 'text', icon: Type, label: 'Text' },
      { id: 'node', icon: Square, label: 'Node' },
      { id: 'icon', icon: Database, label: 'Icon' },
      { id: 'comment', icon: MessageSquareMore, label: 'Comment' },
      { id: 'hand', icon: Hand, label: 'Hand' },
    ];

    const sidebarItems = [
      { label: 'All Files', icon: File, shortcut: 'A', count: null },
      { label: 'Team Folders', icon: Folder, shortcut: null, count: null, isHeader: true },
      { label: 'Eraserbot', icon: Bot, shortcut: 'B', count: null, beta: true },
      { label: 'AI References', icon: BookOpen, shortcut: 'C', count: null },
      { label: 'Team Templates', icon: FileText, shortcut: 'T', count: null },
      { label: 'Github Sync', icon: Github, shortcut: 'G', count: null, beta: true },
      { label: 'Private Files', icon: Lock, shortcut: null, count: null, upgrade: true },
      { label: 'Archive', icon: Archive, shortcut: 'E', count: null },
    ];

    const filterTabs = ['All', 'Recents', 'Created by Me', 'Folders', 'Unsorted'];

    const getMousePos = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      
      const rect = canvas.getBoundingClientRect();
      return {
        x: (e.clientX - rect.left - pan.x) / (zoom / 100),
        y: (e.clientY - rect.top - pan.y) / (zoom / 100)
      };
    }, [pan, zoom]);

    const generateId = () => Math.random().toString(36).substr(2, 9);

    const drawCurvedArrow = (ctx: CanvasRenderingContext2D, start: Point, end: Point, strokeStyle: string, lineWidth: number) => {
      const cp1x = start.x + (end.x - start.x) * 0.5;
      const cp1y = start.y;
      const cp2x = start.x + (end.x - start.x) * 0.5;
      const cp2y = end.y;

      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = lineWidth;
      
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, end.x, end.y);
      ctx.stroke();

      // Arrow head
      const headLength = 15;
      const angle = Math.atan2(end.y - cp2y, end.x - cp2x);
      ctx.beginPath();
      ctx.moveTo(end.x, end.y);
      ctx.lineTo(
        end.x - headLength * Math.cos(angle - Math.PI / 6),
        end.y - headLength * Math.sin(angle - Math.PI / 6)
      );
      ctx.moveTo(end.x, end.y);
      ctx.lineTo(
        end.x - headLength * Math.cos(angle + Math.PI / 6),
        end.y - headLength * Math.sin(angle + Math.PI / 6)
      );
      ctx.stroke();
    };

    const drawNode = (ctx: CanvasRenderingContext2D, element: DrawingElement) => {
      if (element.points.length < 2) return;

      const [start, end] = element.points;
      const width = Math.abs(end.x - start.x);
      const height = Math.abs(end.y - start.y);
      const x = Math.min(start.x, end.x);
      const y = Math.min(start.y, end.y);

      ctx.strokeStyle = element.style.stroke;
      ctx.lineWidth = element.style.strokeWidth;
      ctx.fillStyle = element.style.fill || '#f8f9fa';

      switch (element.nodeType) {
        case 'rounded':
          const radius = 10;
          ctx.beginPath();
          ctx.roundRect(x, y, width, height, radius);
          ctx.fill();
          ctx.stroke();
          break;
        
        case 'diamond':
          ctx.beginPath();
          ctx.moveTo(x + width / 2, y);
          ctx.lineTo(x + width, y + height / 2);
          ctx.lineTo(x + width / 2, y + height);
          ctx.lineTo(x, y + height / 2);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          break;
        
        case 'circle':
          const centerX = x + width / 2;
          const centerY = y + height / 2;
          const circleRadius = Math.min(width, height) / 2;
          ctx.beginPath();
          ctx.arc(centerX, centerY, circleRadius, 0, 2 * Math.PI);
          ctx.fill();
          ctx.stroke();
          break;
      }

      // Draw text if present
      if (element.text) {
        ctx.fillStyle = element.style.stroke;
        ctx.font = getFontStyle(element.style);
        ctx.textAlign = element.style.textAlign || 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(element.text, x + width / 2, y + height / 2);
      }
    };

    const getFontStyle = (style: DrawingElement['style']) => {
      let font = '';
      if (style.fontStyle?.includes('bold')) font += 'bold ';
      if (style.fontStyle?.includes('italic')) font += 'italic ';
      font += `${style.strokeWidth * 8}px Arial`;
      return font;
    };

    const drawIcon = (ctx: CanvasRenderingContext2D, element: DrawingElement) => {
      if (element.points.length < 1) return;
      
      const point = element.points[0];
      const size = 32;
      
      // Draw icon background
      ctx.fillStyle = element.style.fill || '#f0f0f0';
      ctx.fillRect(point.x - size/2, point.y - size/2, size, size);
      
      // Draw icon border
      ctx.strokeStyle = element.style.stroke;
      ctx.lineWidth = element.style.strokeWidth;
      ctx.strokeRect(point.x - size/2, point.y - size/2, size, size);
      
      // Draw icon symbol (simplified representation)
      ctx.fillStyle = element.style.stroke;
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(element.iconType?.charAt(0) || 'I', point.x, point.y);
    };

    const drawComment = (ctx: CanvasRenderingContext2D, element: DrawingElement) => {
      if (element.points.length < 1) return;
      
      const point = element.points[0];
      const size = 24;
      
      // Draw comment indicator
      ctx.fillStyle = '#FFD700';
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 1;
      
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
      ctx.lineTo(point.x + size, point.y - size/2);
      ctx.lineTo(point.x + size, point.y - size);
      ctx.lineTo(point.x, point.y - size);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      // Draw comment count if multiple comments
      ctx.fillStyle = '#000';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('1', point.x + size/2, point.y - size/2);
    };

    const drawElement = (ctx: CanvasRenderingContext2D, element: DrawingElement) => {
      ctx.strokeStyle = element.style.stroke;
      ctx.lineWidth = element.style.strokeWidth;
      ctx.fillStyle = element.style.fill || 'transparent';

      // Highlight selected element
      if (element.id === selectedElement) {
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = element.style.strokeWidth + 2;
      }

      switch (element.type) {
        case 'freehand':
          ctx.beginPath();
          element.points.forEach((point, index) => {
            if (index === 0) {
              ctx.moveTo(point.x, point.y);
            } else {
              ctx.lineTo(point.x, point.y);
            }
          });
          ctx.stroke();
          break;

        case 'rectangle':
          if (element.points.length >= 2) {
            const [start, end] = element.points;
            const width = end.x - start.x;
            const height = end.y - start.y;
            ctx.beginPath();
            ctx.rect(start.x, start.y, width, height);
            if (element.style.fill !== 'transparent') ctx.fill();
            ctx.stroke();
          }
          break;

        case 'circle':
          if (element.points.length >= 2) {
            const [start, end] = element.points;
            const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
            ctx.beginPath();
            ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
            if (element.style.fill !== 'transparent') ctx.fill();
            ctx.stroke();
          }
          break;

        case 'line':
          if (element.points.length >= 2) {
            const [start, end] = element.points;
            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
          }
          break;

        case 'arrow':
          if (element.points.length >= 2) {
            const [start, end] = element.points;
            const headLength = 15;
            const angle = Math.atan2(end.y - start.y, end.x - start.x);

            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(end.x, end.y);
            ctx.lineTo(
              end.x - headLength * Math.cos(angle - Math.PI / 6),
              end.y - headLength * Math.sin(angle - Math.PI / 6)
            );
            ctx.moveTo(end.x, end.y);
            ctx.lineTo(
              end.x - headLength * Math.cos(angle + Math.PI / 6),
              end.y - headLength * Math.sin(angle + Math.PI / 6)
            );
            ctx.stroke();
          }
          break;

        case 'curved-arrow':
          if (element.points.length >= 2) {
            const [start, end] = element.points;
            drawCurvedArrow(ctx, start, end, element.style.stroke, element.style.strokeWidth);
          }
          break;

        case 'text':
          if (element.text && element.points.length > 0) {
            ctx.fillStyle = element.style.stroke;
            ctx.font = getFontStyle(element.style);
            ctx.textAlign = element.style.textAlign || 'left';
            ctx.textBaseline = 'top';
            ctx.fillText(element.text, element.points[0].x, element.points[0].y);
            
            if (element.style.textDecoration === 'underline') {
              const textMetrics = ctx.measureText(element.text);
              ctx.beginPath();
              ctx.moveTo(element.points[0].x, element.points[0].y + textMetrics.actualBoundingBoxDescent + 2);
              ctx.lineTo(element.points[0].x + textMetrics.width, element.points[0].y + textMetrics.actualBoundingBoxDescent + 2);
              ctx.stroke();
            }
          }
          break;

        case 'node':
          case 'icon':
          case 'comment':
          case 'freehand':
          case 'rectangle':
          case 'circle':
          case 'line':
          case 'arrow':
          case 'curved-arrow':
          case 'text':
            // These cases are already handled above
            break;
      }

      // Reset line dash for next element
      ctx.setLineDash([]);
    };

    const redraw = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(pan.x, pan.y);
      ctx.scale(zoom / 100, zoom / 100);

      // Draw grid
      ctx.strokeStyle = '#e5e5e5';
      ctx.lineWidth = 0.5;
      const gridSize = 20;
      for (let x = -pan.x / (zoom / 100) % gridSize; x < canvas.width / (zoom / 100); x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, -pan.y / (zoom / 100));
        ctx.lineTo(x, (canvas.height - pan.y) / (zoom / 100));
        ctx.stroke();
      }
      for (let y = -pan.y / (zoom / 100) % gridSize; y < canvas.height / (zoom / 100); y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(-pan.x / (zoom / 100), y);
        ctx.lineTo((canvas.width - pan.x) / (zoom / 100), y);
        ctx.stroke();
      }

      elements.forEach(element => {
        drawElement(ctx, element);
      });

      if (currentElement) {
        drawElement(ctx, currentElement);
      }

      ctx.restore();
    }, [elements, currentElement, pan, zoom]);

    useEffect(() => {
      redraw();
    }, [redraw]);

    const isPointInElement = (point: Point, element: DrawingElement): boolean => {
      switch (element.type) {
        case 'rectangle':
          if (element.points.length >= 2) {
            const [start, end] = element.points;
            const minX = Math.min(start.x, end.x);
            const maxX = Math.max(start.x, end.x);
            const minY = Math.min(start.y, end.y);
            const maxY = Math.max(start.y, end.y);
            return point.x >= minX && point.x <= maxX && point.y >= minY && point.y <= maxY;
          }
          return false;
        
        case 'circle':
          if (element.points.length >= 2) {
            const [start, end] = element.points;
            const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
            const distance = Math.sqrt(Math.pow(point.x - start.x, 2) + Math.pow(point.y - start.y, 2));
            return distance <= radius;
          }
          return false;
        
        case 'text':
          if (element.points.length > 0) {
            // Simple approximation for text selection
            const canvas = canvasRef.current;
            if (!canvas) return false;
            const ctx = canvas.getContext('2d');
            if (!ctx) return false;
            
            ctx.font = getFontStyle(element.style);
            const metrics = ctx.measureText(element.text || '');
            const height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
            
            return point.x >= element.points[0].x && 
                  point.x <= element.points[0].x + metrics.width && 
                  point.y >= element.points[0].y && 
                  point.y <= element.points[0].y + height;
          }
          return false;
        
        case 'node':
          if (element.points.length >= 2) {
            const [start, end] = element.points;
            const minX = Math.min(start.x, end.x);
            const maxX = Math.max(start.x, end.x);
            const minY = Math.min(start.y, end.y);
            const maxY = Math.max(start.y, end.y);
            return point.x >= minX && point.x <= maxX && point.y >= minY && point.y <= maxY;
          }
          return false;
        
        case 'icon':
          if (element.points.length > 0) {
            const size = 32;
            return point.x >= element.points[0].x - size/2 && 
                  point.x <= element.points[0].x + size/2 && 
                  point.y >= element.points[0].y - size/2 && 
                  point.y <= element.points[0].y + size/2;
          }
          return false;
        
        case 'comment':
          if (element.points.length > 0) {
            const size = 24;
            return point.x >= element.points[0].x && 
                  point.x <= element.points[0].x + size && 
                  point.y >= element.points[0].y - size && 
                  point.y <= element.points[0].y;
          }
          return false;
        
        default:
          return false;
      }
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
      const pos = getMousePos(e);

      if (currentTool === 'hand') {
        setIsPanning(true);
        setLastPanPoint(pos);
        return;
      }

      if (currentTool === 'text') {
        setIsTextEditing(true);
        setTextPosition(pos);
        setTextInput('');
        return;
      }

      if (currentTool === 'comment') {
        setIsCommentEditing(true);
        setCommentPosition(pos);
        setCommentInput('');
        return;
      }

      if (currentTool === 'select') {
        // Check if we're clicking on an element to select or move it
        let clickedElement = null;
        for (let i = elements.length - 1; i >= 0; i--) {
          if (isPointInElement(pos, elements[i])) {
            clickedElement = elements[i];
            break;
          }
        }

        if (clickedElement) {
          setSelectedElement(clickedElement.id);
          setSelectedElementForMove(clickedElement);
          setIsMovingElement(true);
          setMoveStartPoint(pos);
          return;
        } else {
          setSelectedElement(null);
        }
      }

      if (currentTool === 'icon') {
        const newElement: DrawingElement = {
          id: generateId(),
          type: 'icon',
          points: [pos],
          style: {
            stroke: strokeColor,
            strokeWidth: strokeWidth,
            fill: fillColor,
          },
          iconType: selectedIcon,
        };
        setElements(prev => [...prev, newElement]);
        return;
      }

      setIsDrawing(true);

      const newElement: DrawingElement = {
        id: generateId(),
        type: currentTool === 'pen' ? 'freehand' : 
              currentTool === 'node' ? 'node' : 
              currentTool === 'comment' ? 'comment' :
              currentTool as any,
        points: [pos],
        style: {
          stroke: strokeColor,
          strokeWidth: strokeWidth,
          fill: fillColor,
          fontStyle: fontStyle,
          textAlign: textAlign,
          textDecoration: textDecoration
        },
        nodeType: currentTool === 'node' ? selectedNodeType : undefined,
      };

      setCurrentElement(newElement);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
      const pos = getMousePos(e);

      if (isPanning && currentTool === 'hand') {
        const deltaX = (pos.x - lastPanPoint.x) * (zoom / 100);
        const deltaY = (pos.y - lastPanPoint.y) * (zoom / 100);
        setPan(prev => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
        setLastPanPoint(pos);
        return;
      }

      if (isMovingElement && selectedElementForMove) {
        const deltaX = pos.x - moveStartPoint.x;
        const deltaY = pos.y - moveStartPoint.y;
        
        setElements(prev => prev.map(el => {
          if (el.id === selectedElementForMove.id) {
            return {
              ...el,
              points: el.points.map(p => ({
                x: p.x + deltaX,
                y: p.y + deltaY
              }))
            };
          }
          return el;
        }));
        
        setMoveStartPoint(pos);
        return;
      }

      if (!isDrawing || !currentElement) return;

      if (currentElement.type === 'freehand') {
        setCurrentElement(prev => prev ? {
          ...prev,
          points: [...prev.points, pos]
        } : null);
      } else {
        setCurrentElement(prev => prev ? {
          ...prev,
          points: [prev.points[0], pos]
        } : null);
      }
    };

    const handleMouseUp = () => {
      if (isPanning) {
        setIsPanning(false);
        return;
      }

      if (isMovingElement) {
        setIsMovingElement(false);
        setSelectedElementForMove(null);
        return;
      }

      if (isDrawing && currentElement) {
        setElements(prev => [...prev, currentElement]);
        setCurrentElement(null);
      }
      
      setIsDrawing(false);
    };

    const handleTextSubmit = () => {
      if (textInput.trim() && isTextEditing) {
        const textElement: DrawingElement = {
          id: generateId(),
          type: 'text',
          points: [textPosition],
          style: {
            stroke: strokeColor,
            strokeWidth: strokeWidth,
            fontStyle: fontStyle,
            textAlign: textAlign,
            textDecoration: textDecoration
          },
          text: textInput,
        };
        setElements(prev => [...prev, textElement]);
      }
      setIsTextEditing(false);
      setTextInput('');
    };

    const handleCommentSubmit = () => {
      if (commentInput.trim() && isCommentEditing) {
        const commentElement: DrawingElement = {
          id: generateId(),
          type: 'comment',
          points: [commentPosition],
          style: {
            stroke: strokeColor,
            strokeWidth: strokeWidth,
            fill: '#FFD700'
          },
          comment: commentInput,
        };
        setElements(prev => [...prev, commentElement]);
      }
      setIsCommentEditing(false);
      setCommentInput('');
    };

    const saveCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const dataURL = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'whiteboard.png';
      link.href = dataURL;
      link.click();
    };

    const saveDocument = () => {
      const blob = new Blob([documentContent], { type: 'text/markdown' });
      const link = document.createElement('a');
      link.download = 'document.md';
      link.href = URL.createObjectURL(blob);
      link.click();
    };

    const generateAIDiagram = async () => {
      if (!aiPrompt.trim()) return;
      
      // Simulate AI diagram generation
      const mockDiagramElements: DrawingElement[] = [
        {
          id: generateId(),
          type: 'node',
          points: [{ x: 100, y: 100 }, { x: 200, y: 150 }],
          style: { stroke: '#3b82f6', strokeWidth: 2, fill: '#dbeafe' },
          nodeType: 'rounded',
          text: 'Start'
        },
        {
          id: generateId(),
          type: 'curved-arrow',
          points: [{ x: 200, y: 125 }, { x: 300, y: 125 }],
          style: { stroke: '#3b82f6', strokeWidth: 2 }
        },
        {
          id: generateId(),
          type: 'node',
          points: [{ x: 300, y: 100 }, { x: 450, y: 150 }],
          style: { stroke: '#10b981', strokeWidth: 2, fill: '#d1fae5' },
          nodeType: 'diamond',
          text: 'Decision'
        },
        {
          id: generateId(),
          type: 'curved-arrow',
          points: [{ x: 450, y: 125 }, { x: 550, y: 125 }],
          style: { stroke: '#10b981', strokeWidth: 2 }
        },
        {
          id: generateId(),
          type: 'node',
          points: [{ x: 550, y: 100 }, { x: 650, y: 150 }],
          style: { stroke: '#f59e0b', strokeWidth: 2, fill: '#fef3c7' },
          nodeType: 'rounded',
          text: 'End'
        }
      ];

      setElements(prev => [...prev, ...mockDiagramElements]);
      setShowAIDialog(false);
      setAiPrompt('');
    };

    const renderTabContent = () => {
      switch (activeTab) {
        case 'document':
          return (
            <div ref={documentRef} className="flex-1 p-8 bg-white">
              <div className="max-w-4xl mx-auto">
                <textarea
                  value={documentContent}
                  onChange={(e) => setDocumentContent(e.target.value)}
                  className="w-full h-full min-h-screen border-none outline-none resize-none font-mono text-sm leading-relaxed"
                  placeholder="Start typing your document..."
                />
              </div>
            </div>
          );
        
        case 'canvas':
          return (
            <div className="flex-1 relative overflow-hidden">
              <canvas
                ref={canvasRef}
                width={window?.innerWidth - (sidebarOpen ? 350 : 100)}
                height={window?.innerHeight - 100}
                className="cursor-crosshair"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              />
              {renderCanvasOverlays()}
            </div>
          );
        
        default: // both
          return (
            <div className="flex-1 flex">
              <div className="w-1/2 border-r border-gray-200">
                <div ref={documentRef} className="h-full p-4 bg-white overflow-auto">
                  <textarea
                    value={documentContent}
                    onChange={(e) => setDocumentContent(e.target.value)}
                    className="w-full h-full border-none outline-none resize-none font-mono text-sm leading-relaxed"
                    placeholder="Start typing your document..."
                  />
                </div>
              </div>
              <div className="w-1/2 relative overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={(window?.innerWidth - (sidebarOpen ? 350 : 100)) / 2}
                  height={window?.innerHeight - 100}
                  className="cursor-crosshair"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                />
                {renderCanvasOverlays()}
              </div>
            </div>
          );
      }
    };

    const renderCanvasOverlays = () => {
      return (
        <>
          {isTextEditing && (
            <div 
              className="absolute bg-white p-2 shadow-lg rounded border border-gray-300"
              style={{
                left: `${textPosition.x * (zoom / 100) + pan.x}px`,
                top: `${textPosition.y * (zoom / 100) + pan.y}px`,
                transform: 'translateY(-100%)'
              }}
            >
              <div className="flex items-center mb-2 space-x-1">
                <button 
                  onClick={() => setFontStyle(fontStyle === 'bold' ? 'normal' : 'bold')}
                  className={`p-1 rounded ${fontStyle.includes('bold') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                  title="Bold"
                >
                  <Bold size={14} />
                </button>
                <button 
                  onClick={() => setFontStyle(fontStyle === 'italic' ? 'normal' : 'italic')}
                  className={`p-1 rounded ${fontStyle.includes('italic') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                  title="Italic"
                >
                  <Italic size={14} />
                </button>
                <button 
                  onClick={() => setTextDecoration(textDecoration === 'underline' ? 'none' : 'underline')}
                  className={`p-1 rounded ${textDecoration === 'underline' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                  title="Underline"
                >
                  <Underline size={14} />
                </button>
                <select
                  value={textAlign}
                  onChange={(e) => setTextAlign(e.target.value as any)}
                  className="ml-2 p-1 border rounded text-xs"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTextSubmit()}
                onBlur={handleTextSubmit}
                autoFocus
                className="w-full p-1 border rounded outline-none"
                placeholder="Type text and press Enter..."
              />
            </div>
          )}

          {isCommentEditing && (
            <div 
              className="absolute bg-white p-2 shadow-lg rounded border border-gray-300"
              style={{
                left: `${commentPosition.x * (zoom / 100) + pan.x}px`,
                top: `${commentPosition.y * (zoom / 100) + pan.y}px`,
                transform: 'translateY(-100%)'
              }}
            >
              <textarea
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleCommentSubmit()}
                onBlur={handleCommentSubmit}
                autoFocus
                className="w-full p-1 border rounded outline-none"
                placeholder="Type comment and press Enter..."
                rows={3}
              />
            </div>
          )}

          {showIconLibrary && (
            <div 
              className="absolute bg-white p-4 shadow-lg rounded border border-gray-300 z-10"
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '300px'
              }}
            >
              <h3 className="text-lg font-medium mb-4">Select Icon</h3>
              <div className="grid grid-cols-4 gap-4">
                {iconLibrary.map((icon) => (
                  <button
                    key={icon.name}
                    onClick={() => {
                      setSelectedIcon(icon.name);
                      setShowIconLibrary(false);
                    }}
                    className={`p-2 rounded flex flex-col items-center ${selectedIcon === icon.name ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                  >
                    <icon.icon size={20} />
                    <span className="text-xs mt-1">{icon.name}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowIconLibrary(false)}
                className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
              >
                Cancel
              </button>
            </div>
          )}

          {showAIDialog && (
            <div 
              className="absolute bg-white p-4 shadow-lg rounded border border-gray-300 z-10"
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '400px'
              }}
            >
              <h3 className="text-lg font-medium mb-4">Generate Diagram with AI</h3>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="w-full p-2 border rounded mb-4"
                placeholder="Describe the diagram you want to generate..."
                rows={4}
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowAIDialog(false)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={generateAIDiagram}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded flex items-center"
                >
                  <Sparkles size={16} className="mr-2" />
                  Generate
                </button>
              </div>
            </div>
          )}
        </>
      );
    };

    const renderToolbar = () => {
      return (
        <div className="flex items-center justify-between p-2 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded hover:bg-gray-100"
              title="Toggle Sidebar"
            >
              <Menu size={18} />
            </button>

            <div className="flex items-center space-x-1 mx-2">
              <button
                onClick={() => setZoom(prev => Math.max(50, prev - 10))}
                className="p-2 rounded hover:bg-gray-100"
                title="Zoom Out"
              >
                <ZoomOut size={18} />
              </button>
              <span className="text-sm">{zoom}%</span>
              <button
                onClick={() => setZoom(prev => Math.min(200, prev + 10))}
                className="p-2 rounded hover:bg-gray-100"
                title="Zoom In"
              >
                <ZoomIn size={18} />
              </button>
            </div>

            <button
              onClick={() => {
                setElements([]);
                setCurrentElement(null);
                setSelectedElement(null);
              }}
              className="p-2 rounded hover:bg-gray-100"
              title="Clear Canvas"
            >
              <Trash2 size={18} />
            </button>

            <button
              onClick={() => setElements(prev => prev.slice(0, -1))}
              className="p-2 rounded hover:bg-gray-100"
              title="Undo"
            >
              <RotateCcw size={18} />
            </button>

            <button
              onClick={saveCanvas}
              className="p-2 rounded hover:bg-gray-100"
              title="Save Canvas"
            >
              <Download size={18} />
            </button>

            <button
              onClick={saveDocument}
              className="p-2 rounded hover:bg-gray-100 ml-2"
              title="Save Document"
            >
              <Save size={18} />
            </button>

            <button
              onClick={() => setShowAIDialog(true)}
              className="p-2 rounded hover:bg-gray-100 ml-2 flex items-center"
              title="AI Assist"
            >
              <Sparkles size={18} className="mr-1" />
              <span className="text-sm">AI</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <label htmlFor="stroke-color" className="text-xs mr-1">Stroke:</label>
              <input
                id="stroke-color"
                type="color"
                value={strokeColor}
                onChange={(e) => setStrokeColor(e.target.value)}
                className="w-6 h-6 cursor-pointer"
              />
            </div>
            <div className="flex items-center">
              <label htmlFor="fill-color" className="text-xs mr-1">Fill:</label>
              <input
                id="fill-color"
                type="color"
                value={fillColor}
                onChange={(e) => setFillColor(e.target.value)}
                className="w-6 h-6 cursor-pointer"
              />
            </div>
            <div className="flex items-center">
              <label htmlFor="stroke-width" className="text-xs mr-1">Width:</label>
              <select
                id="stroke-width"
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                className="text-xs border rounded p-1"
              >
                {[1, 2, 3, 4, 5, 6, 8, 10].map(width => (
                  <option key={width} value={width}>{width}px</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      );
    };

    const renderToolsPanel = () => {
      return (
        <div className="flex flex-col items-center p-2 space-y-2 border-r border-gray-200 bg-gray-50">
          {tools.map(tool => (
            <button
              key={tool.id}
              onClick={() => setCurrentTool(tool.id as Tool)}
              className={`p-2 rounded ${currentTool === tool.id ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
              title={tool.label}
            >
              <tool.icon size={20} />
            </button>
          ))}

          {currentTool === 'node' && (
            <div className="mt-4 p-2 border-t border-gray-200">
              <h4 className="text-xs font-medium mb-2">Node Type</h4>
              <div className="flex flex-col space-y-2">
                {['rounded', 'diamond', 'circle'].map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedNodeType(type as any)}
                    className={`p-2 rounded text-xs flex items-center ${selectedNodeType === type ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
                  >
                    <span className="capitalize">{type}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentTool === 'icon' && (
            <div className="mt-4 p-2 border-t border-gray-200">
              <button
                onClick={() => setShowIconLibrary(true)}
                className="p-2 rounded hover:bg-gray-200 text-sm flex items-center"
              >
                <Database size={16} className="mr-2" />
                <span>Select Icon</span>
                <ChevronDown size={16} className="ml-1" />
              </button>
              <div className="mt-2 text-xs text-gray-500">
                Selected: {selectedIcon}
              </div>
            </div>
          )}
        </div>
      );
    };

    const renderSidebar = () => {
      if (!sidebarOpen) return null;

      return (
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Whiteboard</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 rounded hover:bg-gray-100"
              >
                <ChevronDown size={18} />
              </button>
            </div>
            <div className="mt-2 relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-8 pr-3 py-1 text-sm border rounded"
              />
              <Search size={14} className="absolute left-2 top-2 text-gray-400" />
            </div>
          </div>

          <div className="flex border-b border-gray-200">
            {filterTabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`flex-1 py-2 text-xs ${activeFilter === tab ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">
            <ul className="py-2">
              {sidebarItems.map((item, index) => (
                <li key={index}>
                  <button
                    className={`w-full flex items-center px-4 py-2 text-sm ${index === 0 ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
                  >
                    <item.icon size={16} className="mr-3" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.shortcut && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        ⌘{item.shortcut}
                      </span>
                    )}
                    {item.beta && (
                      <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded ml-2">
                        Beta
                      </span>
                    )}
                    {item.upgrade && (
                      <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded ml-2">
                        Upgrade
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-2">
                <User size={16} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">User Account</div>
                <div className="text-xs text-gray-500">Free Plan</div>
              </div>
              <button className="p-1 rounded hover:bg-gray-100">
                <Settings size={16} />
              </button>
            </div>
          </div>
        </div>
      );
    };

    const renderViewTabs = () => {
      return (
        <div className="flex border-b border-gray-200 bg-white">
          <button
            onClick={() => setActiveTab('document')}
            className={`px-4 py-2 text-sm ${activeTab === 'document' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Document
          </button>
          <button
            onClick={() => setActiveTab('canvas')}
            className={`px-4 py-2 text-sm ${activeTab === 'canvas' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Canvas
          </button>
          <button
            onClick={() => setActiveTab('both')}
            className={`px-4 py-2 text-sm ${activeTab === 'both' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Both
          </button>
        </div>
      );
    };

    return (
      <div className="flex flex-col h-screen bg-gray-100">
        {renderToolbar()}
        {renderViewTabs()}
        <div className="flex flex-1 overflow-hidden">
          {renderSidebar()}
          {renderToolsPanel()}
          {renderTabContent()}
        </div>
      </div>
    );
  };

  export default EraserWhiteboard;