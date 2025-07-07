// Flowchart.tsx
"use client"
import React, { useCallback, useState, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Background,
  Controls,
  Connection,
  NodeTypes,
  Panel,
  useNodesState,
  useEdgesState,
  MarkerType,
  ReactFlowInstance,
} from 'reactflow';
import 'reactflow/dist/style.css';
import Sidebar from './designFlow/Sidebar';
import CustomNode from './designFlow/CustomNode';
import DecisionNode from './designFlow/DecisionNode';
import DatabaseNode from './designFlow/DatabaseNode';
import ServiceNode from './ServiceNode';

// Define node types
const nodeTypes: NodeTypes = {
  custom: CustomNode,
  decision: DecisionNode,
  database: DatabaseNode,
  service: ServiceNode,
};

// Available node options for sidebar
const nodeOptions = [
  { type: 'input', label: 'Start Node', icon: '▶️' },
  { type: 'default', label: 'Process', icon: '⚙️' },
  { type: 'output', label: 'End Node', icon: '⏹️' },
  { type: 'decision', label: 'Decision', icon: '❓' },
  { type: 'database', label: 'Database', icon: '🗄️' },
  { type: 'service', label: 'Microservice', icon: '🔌' },
  { type: 'custom', label: 'Custom Node', icon: '🛠️' },
];

const Flowchart: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [variant, setVariant] = useState<'cross' | 'dots' | 'lines'>('dots');
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [nodeSize, setNodeSize] = useState<{ width: number; height: number }>({ width: 150, height: 50 });
  const [nodeColor, setNodeColor] = useState('#ffffff');
  const [edgeType, setEdgeType] = useState<'default' | 'step' | 'smoothstep' | 'straight'>('default');
  const [edgeColor, setEdgeColor] = useState('#000000');

  // Handle node selection
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  // Handle drag over event for dropping nodes
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle node drop from sidebar
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowInstance) return;

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: `${Date.now()}`,
        type,
        position,
        data: { label: `${type} node` },
        style: { 
          width: nodeSize.width,
          height: nodeSize.height,
          backgroundColor: nodeColor,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, nodeSize, nodeColor]
  );

  // Handle edge creation
  const onConnect = useCallback(
    (params: Connection) => {
      const edge = {
        ...params,
        id: `${params.source}-${params.target}-${Date.now()}`,
        type: edgeType,
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
        style: { stroke: edgeColor },
      };
      setEdges((eds) => addEdge(edge, eds));
    },
    [edgeType, edgeColor]
  );

  // Delete selected nodes and edges
  const deleteSelected = useCallback(() => {
    setNodes((nds) => nds.filter((node) => !node.selected));
    setEdges((eds) =>
      eds.filter(
        (edge) =>
          !nodes.find((node) => node.selected && node.id === edge.source) &&
          !nodes.find((node) => node.selected && node.id === edge.target)
      )
    );
    setSelectedNode(null);
  }, [nodes, setNodes, setEdges]);

  // Update selected node properties
  const updateNodeProperties = useCallback(() => {
    if (!selectedNode) return;

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            style: {
              ...node.style,
              width: nodeSize.width,
              height: nodeSize.height,
              backgroundColor: nodeColor,
            },
            data: {
              ...node.data,
              label: selectedNode.data.label || `${node.type} node`,
            },
          };
        }
        return node;
      })
    );
  }, [selectedNode, nodeSize, nodeColor, setNodes]);

  // Save flowchart as JSON
  const saveFlow = useCallback(() => {
    const flow = { nodes, edges };
    const blob = new Blob([JSON.stringify(flow)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'flowchart.json';
    link.click();
  }, [nodes, edges]);

  // Load flowchart from JSON
  const loadFlow = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
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
        }
      } catch (error) {
        console.error('Error parsing flow file:', error);
      }
    };
    reader.readAsText(file);
  }, []);

  return (
    <div style={{ display: 'flex', width: '100%', height: '100vh' }}>
      <Sidebar
        nodeOptions={nodeOptions}
        selectedNode={selectedNode}
        nodeSize={nodeSize}
        setNodeSize={setNodeSize}
        nodeColor={nodeColor}
        setNodeColor={setNodeColor}
        edgeType={edgeType}
        setEdgeType={setEdgeType}
        edgeColor={edgeColor}
        setEdgeColor={setEdgeColor}
        updateNodeProperties={updateNodeProperties}
        saveFlow={saveFlow}
        loadFlow={loadFlow}
      />
      
      <div style={{ flexGrow: 1, height: '100%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
        >
          <Controls />
          <Background variant={variant} />
          <Panel position="top-right">
            <select
              value={variant}
              onChange={(e) => setVariant(e.target.value as any)}
              style={{ marginRight: '10px' }}
            >
              <option value="dots">Dots</option>
              <option value="cross">Cross</option>
              <option value="lines">Lines</option>
            </select>
            <button onClick={deleteSelected} style={{ marginRight: '10px' }}>
              Delete Selected
            </button>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
};

export default Flowchart;