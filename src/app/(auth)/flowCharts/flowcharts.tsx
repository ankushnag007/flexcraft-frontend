"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Circle, Text, Arrow, Line, Group } from 'react-konva';
import { Html } from 'react-konva-utils';
import { saveAs } from 'file-saver';
import { toPng, toSvg } from 'html-to-image';

type Tool = 'select' | 'rectangle' | 'circle' | 'arrow' | 'text' | 'line' | 'hand';
type ElementType = 'rectangle' | 'circle' | 'arrow' | 'text' | 'line';

interface Element {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width?: number;
  height?: number;
  points?: number[];
  text?: string;
  fill: string;
  stroke: string;
  strokeWidth: number;
  isSelected?: boolean;
  rotation?: number;
}

const COLORS = [
  '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', 
  '#ffff00', '#00ffff', '#ff00ff', '#c0c0c0', '#808080'
];

const DrawingApp = () => {
  // Responsive dimensions for SSR/CSR safety
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight - 48, // Subtract toolbar height
      });
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const [elements, setElements] = useState<Element[]>([]);
  const [selectedTool, setSelectedTool] = useState<Tool>('select');
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentElement, setCurrentElement] = useState<Partial<Element> | null>(null);
  const [fillColor, setFillColor] = useState('#ffffff');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [isTextEditing, setIsTextEditing] = useState(false);
  const [textValue, setTextValue] = useState('');
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const [textElementId, setTextElementId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const stageRef = useRef<any>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  // Handle tool changes
  useEffect(() => {
    if (selectedTool === 'hand') {
      document.body.style.cursor = 'grab';
    } else if (selectedTool === 'select') {
      document.body.style.cursor = 'default';
    } else {
      document.body.style.cursor = 'crosshair';
    }

    return () => {
      document.body.style.cursor = 'default';
    };
  }, [selectedTool]);

  // Focus text input when editing
  useEffect(() => {
    if (isTextEditing && textInputRef.current) {
      textInputRef.current.focus();
    }
  }, [isTextEditing]);

  const handleMouseDown = (e: any) => {
    const stage = e.target.getStage();
    const pointerPos = stage.getPointerPosition();

    if (selectedTool === 'hand') {
      setIsPanning(true);
      setPanStart({ x: pointerPos.x, y: pointerPos.y });
      return;
    }

    if (selectedTool === 'select') {
      // Check if clicked on an element
      const clickedElement = elements.find(el => {
        if (el.type === 'rectangle') {
          return (
            pointerPos.x >= el.x &&
            pointerPos.x <= el.x + (el.width || 0) &&
            pointerPos.y >= el.y &&
            pointerPos.y <= el.y + (el.height || 0)
          );
        } else if (el.type === 'circle') {
          const radius = (el.width || 0) / 2;
          const centerX = el.x + radius;
          const centerY = el.y + radius;
          const distance = Math.sqrt(
            Math.pow(pointerPos.x - centerX, 2) + 
            Math.pow(pointerPos.y - centerY, 2)
          );
          return distance <= radius;
        }
        return false;
      });

      if (clickedElement) {
        setSelectedElement(clickedElement);
        setElements(els => els.map(el => ({
          ...el,
          isSelected: el.id === clickedElement.id
        })));
      } else {
        setSelectedElement(null);
        setElements(els => els.map(el => ({ ...el, isSelected: false })));
      }
      return;
    }

    if (selectedTool === 'text') {
      const id = Date.now().toString();
      setTextPosition({ x: pointerPos.x, y: pointerPos.y });
      setTextElementId(id);
      setIsTextEditing(true);
      setTextValue('');
      return;
    }

    // Start drawing a new element
    setIsDrawing(true);
    const id = Date.now().toString();
    const newElement: Partial<Element> = {
      id,
      type: selectedTool as ElementType,
      x: pointerPos.x,
      y: pointerPos.y,
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth,
    };

    if (selectedTool === 'rectangle' || selectedTool === 'circle') {
      newElement.width = 0;
      newElement.height = 0;
    } else if (selectedTool === 'line' || selectedTool === 'arrow') {
      newElement.points = [pointerPos.x, pointerPos.y, pointerPos.x, pointerPos.y];
    }

    setCurrentElement(newElement);
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing || !currentElement) return;

    const stage = e.target.getStage();
    const pointerPos = stage.getPointerPosition();
    const width = pointerPos.x - currentElement.x!;
    const height = pointerPos.y - currentElement.y!;

    if (selectedTool === 'hand' && isPanning) {
      const dx = pointerPos.x - panStart.x;
      const dy = pointerPos.y - panStart.y;
      setOffset(prev => ({
        x: prev.x + dx,
        y: prev.y + dy
      }));
      setPanStart(pointerPos);
      return;
    }

    if (selectedTool === 'rectangle' || selectedTool === 'circle') {
      setCurrentElement({
        ...currentElement,
        width,
        height
      });
    } else if (selectedTool === 'line' || selectedTool === 'arrow') {
      setCurrentElement({
        ...currentElement,
        points: [currentElement.x!, currentElement.y!, pointerPos.x, pointerPos.y]
      });
    }
  };

  const handleMouseUp = () => {
    if (selectedTool === 'hand') {
      setIsPanning(false);
      return;
    }

    if (!isDrawing || !currentElement) return;

    if (
      (selectedTool === 'rectangle' || selectedTool === 'circle') &&
      currentElement.width && currentElement.height &&
      (Math.abs(currentElement.width) > 5 || Math.abs(currentElement.height) > 5)
    ) {
      setElements([...elements, currentElement as Element]);
    } else if (
      (selectedTool === 'line' || selectedTool === 'arrow') &&
      currentElement.points &&
      (Math.abs(currentElement.points[2] - currentElement.points[0]) > 5 ||
      Math.abs(currentElement.points[3] - currentElement.points[1]) > 5)
    ) {
      setElements([...elements, currentElement as Element]);
    }

    setIsDrawing(false);
    setCurrentElement(null);
  };

  const handleTextComplete = () => {
    if (textValue.trim() && textElementId) {
      setElements([
        ...elements,
        {
          id: textElementId,
          type: 'text',
          x: textPosition.x,
          y: textPosition.y,
          text: textValue,
          fill: strokeColor,
          stroke: strokeColor,
          strokeWidth: 1
        }
      ]);
    }
    setIsTextEditing(false);
    setTextElementId(null);
  };

  const deleteSelected = () => {
    if (selectedElement) {
      setElements(elements.filter(el => el.id !== selectedElement.id));
      setSelectedElement(null);
    }
  };

  const exportImage = async (type: 'png' | 'svg') => {
    if (!stageRef.current) return;

    setIsExporting(true);
    try {
      const stage = stageRef.current;
      const dataUrl = type === 'png' 
        ? await toPng(stage.content)
        : await toSvg(stage.content);

      saveAs(dataUrl, `drawing.${type}`);
    } catch (error) {
      console.error('Error exporting image:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const clearCanvas = () => {
    setElements([]);
    setSelectedElement(null);
  };

  const zoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 3));
  };

  const zoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.5));
  };

  const resetZoom = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  const renderElement = (element: Element) => {
    const commonProps = {
      x: element.x,
      y: element.y,
      fill: element.fill,
      stroke: element.stroke,
      strokeWidth: element.strokeWidth,
      rotation: element.rotation || 0,
      onClick: () => {
        if (selectedTool === 'select') {
          setSelectedElement(element);
          setElements(els => els.map(el => ({
            ...el,
            isSelected: el.id === element.id
          })));
        }
      },
      onDragEnd: (e: any) => {
        setElements(els =>
          els.map(el =>
            el.id === element.id
              ? { ...el, x: e.target.x(), y: e.target.y() }
              : el
          )
        );
      },
      draggable: selectedTool === 'select' && element.isSelected
    };

    switch (element.type) {
      case 'rectangle':
        return (
          <Rect
            key={element.id}
            {...commonProps}
            width={element.width}
            height={element.height}
            cornerRadius={5}
          />
        );
      case 'circle': {
  // Calculate robust circle center and radius
  const rawWidth = typeof element.width === 'number' ? element.width : 0;
  const rawHeight = typeof element.height === 'number' ? element.height : 0;
  const radius = Math.abs(rawWidth) / 2;
  // Only render if radius is finite and >= 1
  if (!Number.isFinite(radius) || radius < 1) return null;
  const circleX = rawWidth < 0 ? element.x + rawWidth / 2 : element.x + radius;
  const circleY = rawHeight < 0 ? element.y + rawHeight / 2 : element.y + radius;
  return (
    <Circle
      key={element.id}
      {...commonProps}
      x={circleX}
      y={circleY}
      radius={radius}
    />
  );
}
      case 'line':
        return (
          <Line
            key={element.id}
            {...commonProps}
            points={element.points}
            stroke={element.stroke}
            strokeWidth={element.strokeWidth}
          />
        );
      case 'arrow':
        return (
          <Arrow
            key={element.id}
            {...commonProps}
            points={element.points}
            pointerLength={10}
            pointerWidth={10}
          />
        );
      case 'text':
        return (
          <Text
            key={element.id}
            {...commonProps}
            text={element.text}
            fontSize={16}
            fill={element.fill}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 p-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* File menu */}
          <div className="relative group">
            <button className="px-3 py-1 rounded hover:bg-gray-100 flex items-center">
              <span>File</span>
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute left-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
              <button 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                onClick={() => document.getElementById('load-file')?.click()}
              >
                Open (Ctrl+O)
              </button>
              <input 
                id="load-file" 
                type="file" 
                accept=".json" 
                className="hidden" 
              />
              <button 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                onClick={() => console.log('Save')}
              >
                Save to...
              </button>
              <button 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                onClick={() => exportImage('png')}
                disabled={isExporting}
              >
                Export image... (Ctrl+Shift+E)
              </button>
            </div>
          </div>

          {/* Tools */}
          <div className="flex items-center space-x-1 bg-gray-200 rounded p-1">
            <button 
              className={`p-1 rounded ${selectedTool === 'select' ? 'bg-white shadow' : 'hover:bg-gray-100'}`}
              onClick={() => setSelectedTool('select')}
              title="Select tool (V)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            </button>
            <button 
              className={`p-1 rounded ${selectedTool === 'rectangle' ? 'bg-white shadow' : 'hover:bg-gray-100'}`}
              onClick={() => setSelectedTool('rectangle')}
              title="Rectangle tool (R)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button 
              className={`p-1 rounded ${selectedTool === 'circle' ? 'bg-white shadow' : 'hover:bg-gray-100'}`}
              onClick={() => setSelectedTool('circle')}
              title="Circle tool (C)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12m-10 0a10 10 0 1 0 20 0a10 10 0 1 0 -20 0" />
              </svg>
            </button>
            <button 
              className={`p-1 rounded ${selectedTool === 'arrow' ? 'bg-white shadow' : 'hover:bg-gray-100'}`}
              onClick={() => setSelectedTool('arrow')}
              title="Arrow tool (A)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
            <button 
              className={`p-1 rounded ${selectedTool === 'line' ? 'bg-white shadow' : 'hover:bg-gray-100'}`}
              onClick={() => setSelectedTool('line')}
              title="Line tool (L)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 20h16" />
              </svg>
            </button>
            <button 
              className={`p-1 rounded ${selectedTool === 'text' ? 'bg-white shadow' : 'hover:bg-gray-100'}`}
              onClick={() => setSelectedTool('text')}
              title="Text tool (T)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
            <button 
              className={`p-1 rounded ${selectedTool === 'hand' ? 'bg-white shadow' : 'hover:bg-gray-100'}`}
              onClick={() => setSelectedTool('hand')}
              title="Hand tool (H)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6m0 0L3 10m4-4.5L7 5m6 2.5v6m0-6v6m0 0l4-4.5m-4 4.5l-4-4.5" />
              </svg>
            </button>
          </div>

          {/* Color pickers */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <label className="text-xs mr-1">Fill:</label>
              <input
                type="color"
                value={fillColor}
                onChange={(e) => setFillColor(e.target.value)}
                className="w-6 h-6 cursor-pointer"
              />
            </div>
            <div className="flex items-center">
              <label className="text-xs mr-1">Stroke:</label>
              <input
                type="color"
                value={strokeColor}
                onChange={(e) => setStrokeColor(e.target.value)}
                className="w-6 h-6 cursor-pointer"
              />
            </div>
            <div className="flex items-center">
              <label className="text-xs mr-1">Width:</label>
              <input
                type="range"
                min="1"
                max="10"
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
                className="w-20"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Zoom controls */}
          <div className="flex items-center space-x-1">
            <button 
              className="p-1 rounded hover:bg-gray-200"
              onClick={zoomOut}
              title="Zoom out"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
              </svg>
            </button>
            <span className="text-sm">{(zoom * 100).toFixed(0)}%</span>
            <button 
              className="p-1 rounded hover:bg-gray-200"
              onClick={zoomIn}
              title="Zoom in"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m0 0v6m0-6h6m-6 0H7" />
              </svg>
            </button>
            <button 
              className="p-1 rounded hover:bg-gray-200"
              onClick={resetZoom}
              title="Reset zoom"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
          </div>

          {/* Grid toggle */}
          <button 
            className={`p-1 rounded ${showGrid ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
            onClick={() => setShowGrid(!showGrid)}
            title="Toggle grid"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>

          {/* Delete */}
          <button 
            className="p-1 rounded hover:bg-gray-200"
            onClick={deleteSelected}
            disabled={!selectedElement}
            title="Delete selected"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>

          {/* Clear */}
          <button 
            className="p-1 rounded hover:bg-gray-200"
            onClick={clearCanvas}
            title="Clear canvas"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 relative overflow-hidden">
        <Stage
          ref={stageRef}
          width={dimensions.width}
          height={dimensions.height} // Responsive, SSR-safe
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          scaleX={zoom}
          scaleY={zoom}
          x={offset.x}
          y={offset.y}
          draggable={selectedTool === 'hand'}
        >
          <Layer>
            {/* Grid */}
            {showGrid && (
              <Group>
                {Array.from({ length: Math.ceil(dimensions.width / (20 * zoom)) }).map((_, i) => (
                  <Line
                    key={`v-${i}`}
                    points={[i * 20 * zoom, 0, i * 20 * zoom, dimensions.height]}
                    stroke="#e5e7eb"
                    strokeWidth={1}
                  />
                ))}
                {Array.from({ length: Math.ceil(dimensions.height / (20 * zoom)) }).map((_, i) => (
                  <Line
                    key={`h-${i}`}
                    points={[0, i * 20 * zoom, dimensions.width, i * 20 * zoom]}
                    stroke="#e5e7eb"
                    strokeWidth={1}
                  />
                ))}
              </Group>
            )}

            {/* Elements */}
            {elements.map(renderElement)}

            {/* Current drawing element */}
            {currentElement && (
              <>
                {currentElement.type === 'rectangle' && (
                  <Rect
                    x={currentElement.x}
                    y={currentElement.y}
                    width={currentElement.width}
                    height={currentElement.height}
                    fill={currentElement.fill}
                    stroke={currentElement.stroke}
                    strokeWidth={currentElement.strokeWidth}
                    cornerRadius={5}
                  />
                )}
                {currentElement.type === 'circle' && (
                  <Circle
                    x={currentElement.x}
                    y={currentElement.y}
                    radius={(currentElement.width || 0) / 2}
                    fill={currentElement.fill}
                    stroke={currentElement.stroke}
                    strokeWidth={currentElement.strokeWidth}
                  />
                )}
                {(currentElement.type === 'line' || currentElement.type === 'arrow') && (
                  currentElement.type === 'arrow' ? (
                    <Arrow
                      points={currentElement.points}
                      fill={currentElement.stroke}
                      stroke={currentElement.stroke}
                      strokeWidth={currentElement.strokeWidth}
                      pointerLength={10}
                      pointerWidth={10}
                    />
                  ) : (
                    <Line
                      points={currentElement.points}
                      stroke={currentElement.stroke}
                      strokeWidth={currentElement.strokeWidth}
                    />
                  )
                )}
              </>
            )}

            {/* Text input overlay */}
            {isTextEditing && (
              <Html>
                <div
                  style={{
                    position: 'absolute',
                    left: `${textPosition.x}px`,
                    top: `${textPosition.y}px`,
                    transform: `scale(${1 / zoom})`,
                    transformOrigin: 'top left'
                  }}
                >
                  <input
                    ref={textInputRef}
                    type="text"
                    value={textValue}
                    onChange={(e) => setTextValue(e.target.value)}
                    onBlur={handleTextComplete}
                    onKeyDown={(e) => e.key === 'Enter' && handleTextComplete()}
                    style={{
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      fontSize: '16px',
                      color: strokeColor,
                      fontFamily: 'sans-serif'
                    }}
                    autoFocus
                  />
                </div>
              </Html>
            )}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default DrawingApp;