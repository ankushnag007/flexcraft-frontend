"use client"
import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Panel,
  MarkerType,
  Connection,
  Edge,
  Node,
  NodeTypes,
  useReactFlow
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  Save, Download, Upload, Plus, Minus,
  Type, Square, Circle, Diamond, ArrowRight,
  Image as ImageIcon, Link2, Trash2, Palette,
  LayoutGrid, List, Zap, Moon, Sun
} from 'lucide-react';

// Custom Node Types
const RectangleNode = ({ data }: { data: any }) => (
  <div className="p-3 rounded border bg-white">
    {data.label}
  </div>
);

const CircleNode = ({ data }: { data: any }) => (
  <div className="p-3 rounded-full border bg-white w-20 h-20 flex items-center justify-center">
    {data.label}
  </div>
);

const DiamondNode = ({ data }: { data: any }) => (
  <div className="p-3 w-20 h-20 bg-white transform rotate-45 flex items-center justify-center border">
    <div className="transform -rotate-45">{data.label}</div>
  </div>
);

const nodeTypes: NodeTypes = {
  rectangle: RectangleNode,
  circle: CircleNode,
  diamond: DiamondNode
};

// Theme Definitions
const themes = {
  light: {
    background: '#f8f9fa',
    nodeBg: '#ffffff',
    nodeText: '#000000',
    edge: '#000000'
  },
  dark: {
    background: '#1a202c',
    nodeBg: '#2d3748',
    nodeText: '#e2e8f0',
    edge: '#e2e8f0'
  },
  blue: {
    background: '#ebf8ff',
    nodeBg: '#bee3f8',
    nodeText: '#2b6cb0',
    edge: '#3182ce'
  }
};

const FlowchartComponent = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [theme, setTheme] = useState<'light' | 'dark' | 'blue'>('light');
  const [nodeType, setNodeType] = useState<'rectangle' | 'circle' | 'diamond'>('rectangle');
  const [gridVisible, setGridVisible] = useState(true);
  const { fitView } = useReactFlow();

  // Create a new node
  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      // Check if the dropped element is valid
      if (typeof type === 'undefined' || !type) return;

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { 
          label: `${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
          theme 
        },
        style: {
          backgroundColor: themes[theme].nodeBg,
          color: themes[theme].nodeText,
          borderColor: themes[theme].edge
        }
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, theme]
  );

  // Connect nodes
  const onConnect = useCallback(
    (params: Connection) => {
      // const edge: Edge = {
      //   ...params,
      //   type: 'default',
      //   id: `edge-${params.source}-${params.target}-${Date.now()}`,
      //   markerEnd: {
      //     type: MarkerType.ArrowClosed,
      //     color: themes[theme].edge
      //   },
      //   style: {
      //     stroke: themes[theme].edge
      //   }
      // };
      // setEdges((eds) => addEdge(edge, eds));
    },
    [theme]
  );

  // Delete selected elements
  const deleteSelected = useCallback(() => {
    setNodes((nds) => nds.filter((node) => !node.selected));
    setEdges((eds) => eds.filter((edge) => !edge.selected));
  }, []);

  // Change theme and update all nodes/edges
  const changeTheme = (newTheme: 'light' | 'dark' | 'blue') => {
    setTheme(newTheme);
    
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        style: {
          ...node.style,
          backgroundColor: themes[newTheme].nodeBg,
          color: themes[newTheme].nodeText,
          borderColor: themes[newTheme].edge
        }
      }))
    );

    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        style: {
          stroke: themes[newTheme].edge
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: themes[newTheme].edge
        }
      }))
    );
  };

  // Export flowchart as JSON
  const exportFlowchart = () => {
    const flow = reactFlowInstance?.toObject();
    const data = {
      nodes: flow?.nodes || nodes,
      edges: flow?.edges || edges,
      theme
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flowchart.json';
    a.click();
  };

  // Import flowchart from JSON
  const importFlowchart = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        const flow = JSON.parse(result);
        
        if (flow.nodes && flow.edges) {
          setNodes(flow.nodes);
          setEdges(flow.edges);
          if (flow.theme) changeTheme(flow.theme);
          
          setTimeout(() => {
            fitView({ padding: 0.2 });
          }, 100);
        }
      } catch (err) {
        console.error('Error parsing file:', err);
      }
    };
    reader.readAsText(file);
  };

  // Node types for drag-and-drop
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center p-2 border-b bg-gray-50">
        <div className="flex space-x-2 mr-4">
          <div
            className="p-2 border rounded cursor-grab"
            onDragStart={(event) => onDragStart(event, 'rectangle')}
            draggable
            title="Rectangle Node"
          >
            <Square className="w-4 h-4" />
          </div>
          <div
            className="p-2 border rounded cursor-grab"
            onDragStart={(event) => onDragStart(event, 'circle')}
            draggable
            title="Circle Node"
          >
            <Circle className="w-4 h-4" />
          </div>
          <div
            className="p-2 border rounded cursor-grab"
            onDragStart={(event) => onDragStart(event, 'diamond')}
            draggable
            title="Diamond Node"
          >
            <Diamond className="w-4 h-4" />
          </div>
        </div>

        <div className="flex space-x-2 mr-4">
          <select
            value={theme}
            onChange={(e) => changeTheme(e.target.value as any)}
            className="p-2 border rounded text-sm"
          >
            <option value="light">Light Theme</option>
            <option value="dark">Dark Theme</option>
            <option value="blue">Blue Theme</option>
          </select>
        </div>

        <div className="flex space-x-2 mr-4">
          <button
            onClick={() => setGridVisible(!gridVisible)}
            className={`p-2 rounded ${gridVisible ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
            title="Toggle Grid"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>

        <div className="flex space-x-2 mr-4">
          <button
            onClick={exportFlowchart}
            className="p-2 rounded hover:bg-gray-100"
            title="Export"
          >
            <Download className="w-4 h-4" />
          </button>
          <label className="p-2 rounded hover:bg-gray-100 cursor-pointer">
            <Upload className="w-4 h-4" />
            <input type="file" accept=".json" onChange={importFlowchart} className="hidden" />
          </label>
        </div>

        <button
          onClick={deleteSelected}
          className="p-2 rounded hover:bg-red-100 text-red-600 ml-auto"
          title="Delete Selected"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
          style={{ background: themes[theme].background }}
        >
          <Controls />
          <Background gap={gridVisible ? 20 : 0} color={theme === 'dark' ? '#4a5568' : '#a0aec0'} />
          
          <Panel position="top-right">
            <div className="flex space-x-2">
              <button
                onClick={() => fitView({ padding: 0.2 })}
                className="p-2 bg-white rounded shadow border"
                title="Fit View"
              >
                <Zap className="w-4 h-4" />
              </button>
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
};

const FlowchartWithProvider = () => (
  <ReactFlowProvider>
    <FlowchartComponent />
  </ReactFlowProvider>
);

export default FlowchartWithProvider;