import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Stage, Layer, Group, Rect, Circle, Text, Arrow, Line } from 'react-konva';
import { FiSave, FiFolder, FiImage, FiTrash2, FiUsers, FiSearch, FiType, FiSquare, FiCircle, FiMinus, FiMousePointer, FiMove, FiCpu, FiCode } from 'react-icons/fi';
import { HexColorPicker } from 'react-colorful';

// Types
type Position = { x: number; y: number };
type Size = { width: number; height: number };
type Style = {
  fillColor: string;
  borderColor: string;
  borderWidth: number;
  textColor: string;
  fontSize: number;
};

type NodeType = 'process' | 'decision' | 'start' | 'end' | 'document' | 'database' | 'text';
type EdgeType = 'straight' | 'step' | 'smoothstep' | 'bezier';

interface Node {
  id: string;
  type: 'node';
  nodeType: NodeType;
  position: Position;
  size: Size;
  text: string;
  style: Style;
}

interface Edge {
  id: string;
  type: 'edge';
  edgeType: EdgeType;
  source: string;
  target: string;
  label?: string;
  style: Omit<Style, 'fillColor'>;
  points?: number[]; // For bezier curves
}

type FlowchartElement = Node | Edge;

interface Flowchart {
  elements: FlowchartElement[];
  position: Position;
  zoom: number;
}

const FlowchartEditor = () => {
  // State
  const [flowchart, setFlowchart] = useState<Flowchart>({
    elements: [
      {
        id: '1',
        type: 'node',
        nodeType: 'start',
        position: { x: 100, y: 100 },
        size: { width: 100, height: 60 },
        text: 'Start',
        style: {
          fillColor: '#ffffff',
          borderColor: '#000000',
          borderWidth: 2,
          textColor: '#000000',
          fontSize: 16,
        },
      },
    ],
    position: { x: 0, y: 0 },
    zoom: 1,
  });
  
  const [selectedTool, setSelectedTool] = useState<'select' | 'node' | 'edge' | 'text' | 'pan'>('select');
  const [selectedElement, setSelectedElement] = useState<FlowchartElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
  const [currentColor, setCurrentColor] = useState<'fill' | 'border' | 'text'>('fill');
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [currentEdgeType, setCurrentEdgeType] = useState<EdgeType>('straight');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Refs
  const stageRef = useRef<any>(null);
  const edgeStartRef = useRef<string | null>(null);
  
  // Constants
  const NODE_TYPES: { [key in NodeType]: { icon: React.ReactNode; defaultSize: Size } } = {
    process: { icon: <FiSquare />, defaultSize: { width: 120, height: 60 } },
    decision: { icon: <FiCode />, defaultSize: { width: 80, height: 80 } },
    start: { icon: <FiCircle />, defaultSize: { width: 60, height: 60 } },
    end: { icon: <FiCircle />, defaultSize: { width: 60, height: 60 } },
    document: { icon: <FiSquare />, defaultSize: { width: 100, height: 80 } },
    database: { icon: <FiCpu />, defaultSize: { width: 100, height: 60 } },
    text: { icon: <FiType />, defaultSize: { width: 100, height: 40 } },
  };

  // Handlers
  const handleStageClick = (e: any) => {
    if (e.target === e.currentTarget) {
      setSelectedElement(null);
      return;
    }

    if (selectedTool === 'select') {
      const id = e.target.attrs.id;
      const element = flowchart.elements.find(el => el.id === id);
      if (element) setSelectedElement(element);
    } else if (selectedTool === 'node') {
      // Node creation handled in node buttons
    } else if (selectedTool === 'edge') {
      if (!edgeStartRef.current) {
        edgeStartRef.current = e.target.attrs.id;
      } else {
        const sourceId = edgeStartRef.current;
        const targetId = e.target.attrs.id;
        
        if (sourceId !== targetId) {
          const newEdge: Edge = {
            id: `edge-${Date.now()}`,
            type: 'edge',
            edgeType: currentEdgeType,
            source: sourceId,
            target: targetId,
            style: {
              borderColor: '#000000',
              borderWidth: 2,
              textColor: '#000000',
              fontSize: 14,
            }
          };
          
          setFlowchart(prev => ({
            ...prev,
            elements: [...prev.elements, newEdge]
          }));
        }
        
        edgeStartRef.current = null;
      }
    }
  };

  const handleDragStart = (e: any) => {
    if (selectedTool === 'select' || selectedTool === 'pan') {
      setIsDragging(true);
      setDragStart({ x: e.evt.clientX, y: e.evt.clientY });
    }
  };

  const handleDragMove = (e: any) => {
    if (isDragging && selectedTool === 'pan') {
      const dx = e.evt.clientX - dragStart.x;
      const dy = e.evt.clientY - dragStart.y;
      
      setFlowchart(prev => ({
        ...prev,
        position: {
          x: prev.position.x + dx,
          y: prev.position.y + dy,
        }
      }));
      
      setDragStart({ x: e.evt.clientX, y: e.evt.clientY });
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleNodeDragMove = (e: any, id: string) => {
    const newPosition = { x: e.target.x(), y: e.target.y() };
    
    setFlowchart(prev => ({
      ...prev,
      elements: prev.elements.map(el => 
        el.id === id && el.type === 'node' 
          ? { ...el, position: newPosition } 
          : el
      )
    }));
  };

  const addNode = (nodeType: NodeType) => {
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: 'node',
      nodeType,
      position: { x: 200, y: 200 },
      size: NODE_TYPES[nodeType].defaultSize,
      text: nodeType.charAt(0).toUpperCase() + nodeType.slice(1),
      style: {
        fillColor: '#ffffff',
        borderColor: '#000000',
        borderWidth: 2,
        textColor: '#000000',
        fontSize: 16,
      },
    };
    
    setFlowchart(prev => ({
      ...prev,
      elements: [...prev.elements, newNode]
    }));
  };

  const deleteSelected = () => {
    if (!selectedElement) return;
    
    setFlowchart(prev => ({
      ...prev,
      elements: prev.elements.filter(el => el.id !== selectedElement.id)
    }));
    
    setSelectedElement(null);
  };

  const updateElementStyle = (property: keyof Style, value: any) => {
    if (!selectedElement) return;
    
    setFlowchart(prev => ({
      ...prev,
      elements: prev.elements.map(el => 
        el.id === selectedElement.id 
          ? { ...el, style: { ...el.style, [property]: value } } 
          : el
      )
    }));
    
    setSelectedElement({
      ...selectedElement,
      style: {
        ...selectedElement.style,
        [property]: value
      }
    });
  };

  const exportAsImage = () => {
    if (!stageRef.current) return;
    
    const dataURL = stageRef.current.toDataURL({
      mimeType: 'image/png',
      quality: 1,
    });
    
    const link = document.createElement('a');
    link.download = 'flowchart.png';
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Render helpers
  const renderNode = (node: Node) => {
    const commonProps = {
      id: node.id,
      x: node.position.x,
      y: node.position.y,
      width: node.size.width,
      height: node.size.height,
      fill: node.style.fillColor,
      stroke: node.style.borderColor,
      strokeWidth: node.style.borderWidth,
      draggable: selectedTool === 'select',
      onDragMove: (e: any) => handleNodeDragMove(e, node.id),
      onClick: handleStageClick,
    };

    switch (node.nodeType) {
      case 'start':
      case 'end':
        return (
          <Group>
            <Circle
              {...commonProps}
              radius={node.size.width / 2}
            />
            <Text
              text={node.text}
              x={node.position.x}
              y={node.position.y}
              width={node.size.width}
              height={node.size.height}
              fill={node.style.textColor}
              fontSize={node.style.fontSize}
              align="center"
              verticalAlign="middle"
              offsetX={node.size.width / 2}
              offsetY={node.size.height / 2}
            />
          </Group>
        );
      case 'decision':
        return (
          <Group>
            <Line
              {...commonProps}
              points={[
                node.position.x + node.size.width / 2, node.position.y,
                node.position.x + node.size.width, node.position.y + node.size.height / 2,
                node.position.x + node.size.width / 2, node.position.y + node.size.height,
                node.position.x, node.position.y + node.size.height / 2,
                node.position.x + node.size.width / 2, node.position.y
              ]}
              closed
            />
            <Text
              text={node.text}
              x={node.position.x}
              y={node.position.y}
              width={node.size.width}
              height={node.size.height}
              fill={node.style.textColor}
              fontSize={node.style.fontSize}
              align="center"
              verticalAlign="middle"
              offsetX={node.size.width / 2}
              offsetY={node.size.height / 2}
            />
          </Group>
        );
      case 'document':
        return (
          <Group>
            <Rect
              {...commonProps}
              cornerRadius={10}
            />
            <Text
              text={node.text}
              x={node.position.x}
              y={node.position.y}
              width={node.size.width}
              height={node.size.height}
              fill={node.style.textColor}
              fontSize={node.style.fontSize}
              align="center"
              verticalAlign="middle"
              offsetX={node.size.width / 2}
              offsetY={node.size.height / 2}
            />
          </Group>
        );
      case 'database':
        return (
          <Group>
            <Rect
              {...commonProps}
              cornerRadius={[10, 10, 0, 0]}
            />
            <Rect
              {...commonProps}
              y={node.position.y + node.size.height - 10}
              height={10}
              cornerRadius={[0, 0, 10, 10]}
            />
            <Text
              text={node.text}
              x={node.position.x}
              y={node.position.y}
              width={node.size.width}
              height={node.size.height}
              fill={node.style.textColor}
              fontSize={node.style.fontSize}
              align="center"
              verticalAlign="middle"
              offsetX={node.size.width / 2}
              offsetY={node.size.height / 2}
            />
          </Group>
        );
      case 'text':
        return (
          <Group>
            <Text
              {...commonProps}
              text={node.text}
              fill={node.style.textColor}
              fontSize={node.style.fontSize}
              align="center"
              verticalAlign="middle"
            />
          </Group>
        );
      default: // process
        return (
          <Group>
            <Rect
              {...commonProps}
            />
            <Text
              text={node.text}
              x={node.position.x}
              y={node.position.y}
              width={node.size.width}
              height={node.size.height}
              fill={node.style.textColor}
              fontSize={node.style.fontSize}
              align="center"
              verticalAlign="middle"
              offsetX={node.size.width / 2}
              offsetY={node.size.height / 2}
            />
          </Group>
        );
    }
  };

  const renderEdge = (edge: Edge) => {
    const sourceNode = flowchart.elements.find(el => el.id === edge.source) as Node;
    const targetNode = flowchart.elements.find(el => el.id === edge.target) as Node;

    if (!sourceNode || !targetNode) return null;

    const sourceCenter = {
      x: sourceNode.position.x + sourceNode.size.width / 2,
      y: sourceNode.position.y + sourceNode.size.height / 2,
    };

    const targetCenter = {
      x: targetNode.position.x + targetNode.size.width / 2,
      y: targetNode.position.y + targetNode.size.height / 2,
    };

    const points = [sourceCenter.x, sourceCenter.y, targetCenter.x, targetCenter.y];

    return (
      <Group>
        <Arrow
          id={edge.id}
          points={points}
          stroke={edge.style.borderColor}
          strokeWidth={edge.style.borderWidth}
          fill={edge.style.borderColor}
          pointerLength={10}
          pointerWidth={10}
          onClick={handleStageClick}
        />
        {edge.label && (
          <Text
            text={edge.label}
            x={(sourceCenter.x + targetCenter.x) / 2}
            y={(sourceCenter.y + targetCenter.y) / 2}
            fill={edge.style.textColor}
            fontSize={edge.style.fontSize}
            align="center"
          />
        )}
      </Group>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Toolbar */}
      <div className="flex items-center p-2 bg-white border-b border-gray-200">
        <div className="flex space-x-2 mr-4">
          <button
            className={`p-2 rounded ${selectedTool === 'select' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
            onClick={() => setSelectedTool('select')}
            title="Select (V)"
          >
            <FiMousePointer />
          </button>
          <button
            className={`p-2 rounded ${selectedTool === 'pan' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
            onClick={() => setSelectedTool('pan')}
            title="Pan (H)"
          >
            <FiMove />
          </button>
        </div>

        <div className="flex space-x-2 mr-4">
          <button
            className={`p-2 rounded ${selectedTool === 'node' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
            onClick={() => setSelectedTool('node')}
            title="Node (N)"
          >
            <FiSquare />
          </button>
          <button
            className={`p-2 rounded ${selectedTool === 'edge' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
            onClick={() => setSelectedTool('edge')}
            title="Connection (C)"
          >
            <FiMinus />
          </button>
          <button
            className={`p-2 rounded ${selectedTool === 'text' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
            onClick={() => setSelectedTool('text')}
            title="Text (T)"
          >
            <FiType />
          </button>
        </div>

        <div className="flex space-x-2 mr-4">
          <select
            className="p-2 border rounded"
            value={currentEdgeType}
            onChange={(e) => setCurrentEdgeType(e.target.value as EdgeType)}
          >
            <option value="straight">Straight</option>
            <option value="step">Step</option>
            <option value="smoothstep">Smooth Step</option>
            <option value="bezier">Bezier</option>
          </select>
        </div>

        <div className="flex space-x-2 mr-4">
          <button
            className="p-2 rounded hover:bg-gray-100"
            onClick={exportAsImage}
            title="Export as PNG"
          >
            <FiImage />
          </button>
          <button
            className="p-2 rounded hover:bg-gray-100"
            onClick={() => {}}
            title="Save"
          >
            <FiSave />
          </button>
          <button
            className="p-2 rounded hover:bg-gray-100"
            onClick={() => {}}
            title="Open"
          >
            <FiFolder />
          </button>
          <button
            className="p-2 rounded hover:bg-gray-100"
            onClick={deleteSelected}
            disabled={!selectedElement}
            title="Delete"
          >
            <FiTrash2 />
          </button>
        </div>

        <div className="flex space-x-2 ml-auto">
          <div className="relative">
            <button
              className="p-2 rounded hover:bg-gray-100"
              onClick={() => setColorPickerOpen(!colorPickerOpen)}
              title="Color Picker"
            >
              <div 
                className="w-5 h-5 rounded border border-gray-300"
                style={{ 
                  backgroundColor: selectedElement 
                    ? currentColor === 'fill' 
                      ? (selectedElement as Node).style?.fillColor 
                      : selectedElement.style.borderColor 
                    : '#000000' 
                }}
              />
            </button>
            {colorPickerOpen && (
              <div className="absolute z-10 mt-2 p-2 bg-white rounded shadow-lg">
                <div className="flex space-x-2 mb-2">
                  <button
                    className={`p-1 text-xs ${currentColor === 'fill' ? 'bg-blue-100' : ''}`}
                    onClick={() => setCurrentColor('fill')}
                  >
                    Fill
                  </button>
                  <button
                    className={`p-1 text-xs ${currentColor === 'border' ? 'bg-blue-100' : ''}`}
                    onClick={() => setCurrentColor('border')}
                  >
                    Border
                  </button>
                  <button
                    className={`p-1 text-xs ${currentColor === 'text' ? 'bg-blue-100' : ''}`}
                    onClick={() => setCurrentColor('text')}
                  >
                    Text
                  </button>
                </div>
                <HexColorPicker
                  color={
                    selectedElement
                      ? currentColor === 'fill'
                        ? (selectedElement as Node).style?.fillColor || '#ffffff'
                        : currentColor === 'border'
                          ? selectedElement.style.borderColor
                          : selectedElement.style.textColor
                      : '#000000'
                  }
                  onChange={(color) => {
                    if (selectedElement) {
                      updateElementStyle(
                        currentColor === 'fill' 
                          ? 'fillColor' 
                          : currentColor === 'border' 
                            ? 'borderColor' 
                            : 'textColor',
                        color
                      );
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Node Library */}
        <div className="w-48 p-2 bg-white border-r border-gray-200 overflow-y-auto">
          <h3 className="font-medium mb-2">Nodes</h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(NODE_TYPES).map(([type, { icon }]) => (
              <button
                key={type}
                className="flex flex-col items-center p-2 rounded hover:bg-gray-100"
                onClick={() => addNode(type as NodeType)}
                title={type.charAt(0).toUpperCase() + type.slice(1)}
              >
                <span className="text-lg">{icon}</span>
                <span className="text-xs mt-1">{type}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative bg-gray-50 overflow-hidden">
          <Stage
            ref={stageRef}
            width={window.innerWidth - 48 - 240} // Subtract sidebar widths
            height={window.innerHeight - 48} // Subtract toolbar height
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onClick={handleStageClick}
            draggable={selectedTool === 'pan'}
          >
            <Layer>
              <Group
                x={flowchart.position.x}
                y={flowchart.position.y}
                scaleX={flowchart.zoom}
                scaleY={flowchart.zoom}
              >
                {flowchart.elements.map(element => 
                  element.type === 'node' ? renderNode(element) : renderEdge(element)
                )}
              </Group>
            </Layer>
          </Stage>
        </div>

        {/* Right Sidebar - Properties Panel */}
        <div className="w-60 p-4 bg-white border-l border-gray-200 overflow-y-auto">
          <h3 className="font-medium mb-4">Properties</h3>
          
          {selectedElement ? (
            <div className="space-y-4">
              {selectedElement.type === 'node' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      value={selectedElement.text}
                      onChange={(e) => {
                        setFlowchart(prev => ({
                          ...prev,
                          elements: prev.elements.map(el => 
                            el.id === selectedElement.id 
                              ? { ...el, text: e.target.value } 
                              : el
                          )
                        }));
                        setSelectedElement({ ...selectedElement, text: e.target.value });
                      }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Width</label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded"
                      value={selectedElement.size.width}
                      onChange={(e) => {
                        const newSize = { ...selectedElement.size, width: Number(e.target.value) };
                        setFlowchart(prev => ({
                          ...prev,
                          elements: prev.elements.map(el => 
                            el.id === selectedElement.id 
                              ? { ...el, size: newSize } 
                              : el
                          )
                        }));
                        setSelectedElement({ ...selectedElement, size: newSize });
                      }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded"
                      value={selectedElement.size.height}
                      onChange={(e) => {
                        const newSize = { ...selectedElement.size, height: Number(e.target.value) };
                        setFlowchart(prev => ({
                          ...prev,
                          elements: prev.elements.map(el => 
                            el.id === selectedElement.id 
                              ? { ...el, size: newSize } 
                              : el
                          )
                        }));
                        setSelectedElement({ ...selectedElement, size: newSize });
                      }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Font Size</label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded"
                      value={selectedElement.style.fontSize}
                      onChange={(e) => updateElementStyle('fontSize', Number(e.target.value))}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Border Width</label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded"
                      value={selectedElement.style.borderWidth}
                      onChange={(e) => updateElementStyle('borderWidth', Number(e.target.value))}
                    />
                  </div>
                </>
              )}
              
              {selectedElement.type === 'edge' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Edge Type</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={selectedElement.edgeType}
                      onChange={(e) => {
                        setFlowchart(prev => ({
                          ...prev,
                          elements: prev.elements.map(el => 
                            el.id === selectedElement.id 
                              ? { ...el, edgeType: e.target.value as EdgeType } 
                              : el
                          )
                        }));
                        setSelectedElement({ ...selectedElement, edgeType: e.target.value as EdgeType });
                      }}
                    >
                      <option value="straight">Straight</option>
                      <option value="step">Step</option>
                      <option value="smoothstep">Smooth Step</option>
                      <option value="bezier">Bezier</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      value={selectedElement.label || ''}
                      onChange={(e) => {
                        setFlowchart(prev => ({
                          ...prev,
                          elements: prev.elements.map(el => 
                            el.id === selectedElement.id 
                              ? { ...el, label: e.target.value } 
                              : el
                          )
                        }));
                        setSelectedElement({ ...selectedElement, label: e.target.value });
                      }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Border Width</label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded"
                      value={selectedElement.style.borderWidth}
                      onChange={(e) => updateElementStyle('borderWidth', Number(e.target.value))}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Font Size</label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded"
                      value={selectedElement.style.fontSize}
                      onChange={(e) => updateElementStyle('fontSize', Number(e.target.value))}
                    />
                  </div>
                </>
              )}
            </div>
          ) : (
            <p className="text-gray-500">Select an element to edit its properties</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlowchartEditor;