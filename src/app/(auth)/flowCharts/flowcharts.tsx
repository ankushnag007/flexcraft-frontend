"use client"

import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';

type Node = {
  id: string;
  title: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  connections?: { targetId: string; color: string }[];
  type?: 'process' | 'decision' | 'start' | 'end' | 'input' | 'output';
  color?: string;
};

type FlowChartProps = {
  initialNodes?: Node[];
};

const FlowChart: React.FC<FlowChartProps> = ({ initialNodes = [] }) => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [editingNode, setEditingNode] = useState<string | null>(null);
  const [nodeTitle, setNodeTitle] = useState('');
  const [connectionMode, setConnectionMode] = useState(false);
  const [connectionStart, setConnectionStart] = useState<string | null>(null);
  const [arrowColor, setArrowColor] = useState('#3b82f6'); // Default blue
  const [nodeColor, setNodeColor] = useState('#ffffff'); // Default white
  const [nodeType, setNodeType] = useState<'process' | 'decision' | 'start' | 'end' | 'input' | 'output'>('process');
  const [nodeSize, setNodeSize] = useState<'sm' | 'md' | 'lg'>('md');
  
  const flowChartRef = useRef<HTMLDivElement>(null);

  // Default nodes if none provided
  if (nodes.length === 0 && initialNodes.length === 0) {
    setNodes([
      {
        id: '1',
        title: 'Start',
        x: 100,
        y: 50,
        type: 'start',
        color: '#4ade80',
      },
      {
        id: '2',
        title: 'Process',
        x: 100,
        y: 150,
        type: 'process',
        color: '#93c5fd',
        connections: [{ targetId: '3', color: '#3b82f6' }],
      },
      {
        id: '3',
        title: 'Decision',
        x: 100,
        y: 250,
        type: 'decision',
        color: '#fca5a5',
        connections: [
          { targetId: '4', color: '#3b82f6' },
          { targetId: '5', color: '#3b82f6' },
        ],
      },
      {
        id: '4',
        title: 'Yes',
        x: 0,
        y: 350,
        type: 'process',
        color: '#86efac',
        connections: [{ targetId: '6', color: '#3b82f6' }],
      },
      {
        id: '5',
        title: 'No',
        x: 200,
        y: 350,
        type: 'process',
        color: '#fca5a5',
        connections: [{ targetId: '6', color: '#3b82f6' }],
      },
      {
        id: '6',
        title: 'End',
        x: 100,
        y: 450,
        type: 'end',
        color: '#4ade80',
      },
    ]);
  }

  const handleNodeMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    nodeId: string
  ) => {
    e.stopPropagation();
    setSelectedNode(nodeId);
    const node = nodes.find((n) => n.id === nodeId);
    if (node) {
      setDragOffset({
        x: e.clientX - node.x,
        y: e.clientY - node.y,
      });
    }
    setDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragging && selectedNode) {
      setNodes(
        nodes.map((node) => {
          if (node.id === selectedNode) {
            return {
              ...node,
              x: e.clientX - dragOffset.x,
              y: e.clientY - dragOffset.y,
            };
          }
          return node;
        })
      );
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleBackgroundClick = () => {
    setSelectedNode(null);
    setEditingNode(null);
    if (connectionMode && connectionStart) {
      setConnectionMode(false);
      setConnectionStart(null);
    }
  };

  const handleNodeClick = (e: React.MouseEvent<HTMLDivElement>, nodeId: string) => {
    e.stopPropagation();
    setSelectedNode(nodeId);
    
    if (connectionMode) {
      if (connectionStart) {
        // Complete the connection
        if (connectionStart !== nodeId) {
          setNodes(
            nodes.map((node) => {
              if (node.id === connectionStart) {
                const existingConnections = node.connections || [];
                return {
                  ...node,
                  connections: [...existingConnections, { targetId: nodeId, color: arrowColor }],
                };
              }
              return node;
            })
          );
        }
        setConnectionMode(false);
        setConnectionStart(null);
      } else {
        // Start a new connection
        setConnectionStart(nodeId);
      }
    }
  };

  const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>, nodeId: string) => {
    e.stopPropagation();
    const node = nodes.find((n) => n.id === nodeId);
    if (node) {
      setEditingNode(nodeId);
      setNodeTitle(node.title);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNodeTitle(e.target.value);
  };

  const saveTitle = () => {
    if (editingNode) {
      setNodes(
        nodes.map((node) => {
          if (node.id === editingNode) {
            return {
              ...node,
              title: nodeTitle,
            };
          }
          return node;
        })
      );
      setEditingNode(null);
    }
  };

  const deleteNode = () => {
    if (selectedNode) {
      // Remove the node and any connections to it
      setNodes(
        nodes
          .filter((node) => node.id !== selectedNode)
          .map((node) => ({
            ...node,
            connections: node.connections?.filter(
              (conn) => conn.targetId !== selectedNode
            ),
          }))
      );
      setSelectedNode(null);
    }
  };

  const addNode = () => {
    const newNodeId = (nodes.length + 1).toString();
    const newNode: Node = {
      id: newNodeId,
      title: `Step ${newNodeId}`,
      x: 300,
      y: 100 + nodes.length * 50,
      type: nodeType,
      color: nodeColor,
    };

    // Set default sizes based on type
    if (nodeType === 'decision') {
      newNode.width = nodeSize === 'sm' ? 60 : nodeSize === 'md' ? 80 : 100;
      newNode.height = nodeSize === 'sm' ? 60 : nodeSize === 'md' ? 80 : 100;
    } else {
      newNode.width = nodeSize === 'sm' ? 100 : nodeSize === 'md' ? 120 : 150;
      newNode.height = nodeSize === 'sm' ? 40 : nodeSize === 'md' ? 50 : 60;
    }

    setNodes([...nodes, newNode]);
  };

  const deleteConnection = (nodeId: string, targetId: string) => {
    setNodes(
      nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            connections: node.connections?.filter(
              (conn) => conn.targetId !== targetId
            ),
          };
        }
        return node;
      })
    );
  };

  const getNodeStyle = (node: Node) => {
    const baseStyle = `absolute flex items-center justify-center rounded-md border-2 cursor-move transition-all ${
      node.id === selectedNode ? 'border-blue-500' : 'border-gray-300'
    }`;

    // Different shapes for different node types
    switch (node.type) {
      case 'start':
      case 'end':
        return `${baseStyle} rounded-full w-16 h-16`; // Ellipse shape
      case 'decision':
        return `${baseStyle} w-24 h-24 transform rotate-45`; // Diamond shape
      case 'input':
        return `${baseStyle} w-32 h-12 border-l-8 border-l-blue-500`; // Input shape
      case 'output':
        return `${baseStyle} w-32 h-12 border-r-8 border-r-blue-500`; // Output shape
      default:
        // Process
        return `${baseStyle} w-32 h-12`; // Default rectangle
    }
  };

  const renderConnections = () => {
    return nodes.map((node) => {
      if (!node.connections) return null;

      return node.connections.map((connection, index) => {
        const targetNode = nodes.find((n) => n.id === connection.targetId);
        if (!targetNode) return null;

        // Calculate start and end points
        let startX = node.x + (node.width || 120) / 2;
        let startY = node.y + (node.height || 50) / 2;
        let endX = targetNode.x + (targetNode.width || 120) / 2;
        let endY = targetNode.y + (targetNode.height || 50) / 2;

        // Adjust for different shapes
        if (node.type === 'start' || node.type === 'end') {
          // Ellipse - adjust to edge
          const angle = Math.atan2(endY - startY, endX - startX);
          startX += 30 * Math.cos(angle);
          startY += 30 * Math.sin(angle);
        } else if (node.type === 'decision') {
          // Diamond - adjust to edge
          const angle = Math.atan2(endY - startY, endX - startX);
          const diamondSize = 24;
          startX += diamondSize * Math.max(Math.abs(Math.cos(angle)), Math.abs(Math.sin(angle))) * Math.cos(angle);
          startY += diamondSize * Math.max(Math.abs(Math.cos(angle)), Math.abs(Math.sin(angle))) * Math.sin(angle);
        }

        if (targetNode.type === 'start' || targetNode.type === 'end') {
          // Ellipse - adjust to edge
          const angle = Math.atan2(startY - endY, startX - endX);
          endX += 30 * Math.cos(angle);
          endY += 30 * Math.sin(angle);
        } else if (targetNode.type === 'decision') {
          // Diamond - adjust to edge
          const angle = Math.atan2(startY - endY, startX - endX);
          const diamondSize = 24;
          endX += diamondSize * Math.max(Math.abs(Math.cos(angle)), Math.abs(Math.sin(angle))) * Math.cos(angle);
          endY += diamondSize * Math.max(Math.abs(Math.cos(angle)), Math.abs(Math.sin(angle))) * Math.sin(angle);
        }

        // Arrow head
        const arrowSize = 8;
        const angle = Math.atan2(endY - startY, endX - startX);

        return (
          <svg
            key={`${node.id}-${connection.targetId}-${index}`}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
          >
            <line
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              stroke={connection.color || '#3b82f6'}
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />
            <polygon
              points={`0,${-arrowSize} ${arrowSize * 2},0, 0,${arrowSize}`}
              transform={`translate(${endX},${endY}) rotate(${
                (angle * 180) / Math.PI
              })`}
              fill={connection.color || '#3b82f6'}
            />
          </svg>
        );
      });
    });
  };

  const exportAsImage = () => {
    if (flowChartRef.current) {
      html2canvas(flowChartRef.current).then((canvas) => {
        const link = document.createElement('a');
        link.download = 'flowchart.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }
  };

  const saveFlowchart = () => {
    const data = JSON.stringify(nodes, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'flowchart.json';
    link.href = url;
    link.click();
  };

  const loadFlowchart = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const loadedNodes = JSON.parse(event.target?.result as string);
          if (Array.isArray(loadedNodes)) {
            setNodes(loadedNodes);
          }
        } catch (error) {
          console.error('Error parsing flowchart file', error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-50">
      {/* Toolbar */}
      <div className="absolute top-4 left-4 right-4 bg-white p-4 rounded-lg shadow-md border border-gray-200 z-10 flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
            onClick={addNode}
          >
            Add Node
          </button>
          
          <select
            className="border rounded px-2 py-1 text-sm"
            value={nodeType}
            onChange={(e) => setNodeType(e.target.value as any)}
          >
            <option value="process">Process</option>
            <option value="decision">Decision</option>
            <option value="start">Start</option>
            <option value="end">End</option>
            <option value="input">Input</option>
            <option value="output">Output</option>
          </select>
          
          <select
            className="border rounded px-2 py-1 text-sm"
            value={nodeSize}
            onChange={(e) => setNodeSize(e.target.value as any)}
          >
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
          </select>
          
          <input
            type="color"
            value={nodeColor}
            onChange={(e) => setNodeColor(e.target.value)}
            className="w-8 h-8 cursor-pointer"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <button
            className={`px-3 py-1 rounded text-sm ${
              connectionMode
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
            onClick={() => setConnectionMode(!connectionMode)}
          >
            {connectionMode ? 'Connecting...' : 'Add Connection'}
          </button>
          
          <input
            type="color"
            value={arrowColor}
            onChange={(e) => setArrowColor(e.target.value)}
            className="w-8 h-8 cursor-pointer"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <button
            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 disabled:opacity-50"
            onClick={deleteNode}
            disabled={!selectedNode}
          >
            Delete Node
          </button>
          
          {selectedNode && (
            <button
              className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
              onClick={() => {
                const node = nodes.find((n) => n.id === selectedNode);
                if (node) {
                  setEditingNode(node.id);
                  setNodeTitle(node.title);
                }
              }}
            >
              Edit Node
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-2 ml-auto">
          <button
            className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600"
            onClick={saveFlowchart}
          >
            Save Flowchart
          </button>
          
          <label className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600 cursor-pointer">
            Load Flowchart
            <input
              type="file"
              accept=".json"
              onChange={loadFlowchart}
              className="hidden"
            />
          </label>
          
          <button
            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
            onClick={exportAsImage}
          >
            Export as Image
          </button>
        </div>
      </div>

      {/* Flowchart area */}
      <div
        ref={flowChartRef}
        className="relative w-full h-full pt-20"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleBackgroundClick}
      >
        {/* SVG for connections (behind nodes) */}
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="8"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
            </marker>
          </defs>
          {renderConnections()}
        </svg>

        {/* Nodes (on top of connections) */}
        {nodes.map((node) => (
          <div
            key={node.id}
            className={getNodeStyle(node)}
            style={{
              left: `${node.x}px`,
              top: `${node.y}px`,
              backgroundColor: node.color || '#ffffff',
            }}
            onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
            onClick={(e) => handleNodeClick(e, node.id)}
            onDoubleClick={(e) => handleDoubleClick(e, node.id)}
          >
            {editingNode === node.id ? (
              <input
                type="text"
                value={nodeTitle}
                onChange={handleTitleChange}
                onBlur={saveTitle}
                onKeyDown={(e) => e.key === 'Enter' && saveTitle()}
                className="w-full h-full px-2 text-center bg-transparent outline-none"
                autoFocus
              />
            ) : (
              <span className="text-sm font-medium text-center p-2">
                {node.title}
              </span>
            )}
          </div>
        ))}

        {/* Connection mode indicator */}
        {connectionMode && connectionStart && (
          <div className="absolute top-4 right-4 bg-white p-2 rounded shadow">
            <p className="text-sm">Click on target node</p>
            <button
              className="text-xs text-red-500 mt-1"
              onClick={() => {
                setConnectionMode(false);
                setConnectionStart(null);
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Node properties panel */}
      {selectedNode && (
        <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-md border border-gray-200 w-64">
          <h3 className="font-medium mb-2">Node Properties</h3>
          <div className="space-y-2">
            <div>
              <label className="block text-sm text-gray-600">Type</label>
              <select
                className="border rounded px-2 py-1 text-sm w-full"
                value={nodes.find((n) => n.id === selectedNode)?.type || 'process'}
                onChange={(e) => {
                  setNodes(
                    nodes.map((node) => {
                      if (node.id === selectedNode) {
                        return {
                          ...node,
                          type: e.target.value as any,
                        };
                      }
                      return node;
                    })
                  );
                }}
              >
                <option value="process">Process</option>
                <option value="decision">Decision</option>
                <option value="start">Start</option>
                <option value="end">End</option>
                <option value="input">Input</option>
                <option value="output">Output</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600">Color</label>
              <input
                type="color"
                value={nodes.find((n) => n.id === selectedNode)?.color || '#ffffff'}
                onChange={(e) => {
                  setNodes(
                    nodes.map((node) => {
                      if (node.id === selectedNode) {
                        return {
                          ...node,
                          color: e.target.value,
                        };
                      }
                      return node;
                    })
                  );
                }}
                className="w-full h-8 cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Connections</label>
              <div className="max-h-32 overflow-y-auto">
                {nodes
                  .find((n) => n.id === selectedNode)
                  ?.connections?.map((conn) => (
                    <div key={conn.targetId} className="flex items-center justify-between py-1">
                      <span className="text-sm">
                        → {nodes.find((n) => n.id === conn.targetId)?.title || conn.targetId}
                      </span>
                      <button
                        onClick={() => deleteConnection(selectedNode, conn.targetId)}
                        className="text-red-500 text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                {!nodes.find((n) => n.id === selectedNode)?.connections?.length && (
                  <p className="text-xs text-gray-500">No connections</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlowChart;