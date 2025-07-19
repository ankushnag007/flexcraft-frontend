// "use client";
// import { useState, useCallback } from 'react';
// import {
//   Settings, GitBranch, Globe, Lock, Server, CreditCard, Clock, 
//   UploadCloud, GitPullRequest, Cpu, Zap, Box, Layers, Code, 
//   Database, Network, HardDrive, Cloud, CloudRain, CloudSun, 
//   CloudSnow, ChevronDown, ChevronRight, Plus, Minus, AlertCircle,
//   ArrowRight, ArrowDown, GitCommit, Circle, Square, Diamond, 
//   MousePointer, Move, Type, Link2, Trash2, Copy, Share2, Save
// } from 'lucide-react';
// import ReactFlow, {
//   Background,
//   Controls,
//   useNodesState,
//   useEdgesState,
//   addEdge,
//   Connection,
//   Edge,
//   Node,
//   NodeTypes,
//   Panel,
//   MarkerType
// } from 'reactflow';
// import 'reactflow/dist/style.css';
// import AuthGuard from '@/app/components/AuthGuard';

// type FlowchartNodeType = 'start' | 'end' | 'process' | 'decision' | 'io' | 'deployment';

// interface FlowchartNodeData {
//   label: string;
//   description?: string;
//   icon?: React.ReactNode;
//   type: FlowchartNodeType;
// }

// const nodeTypes: Record<FlowchartNodeType, React.ReactNode> = {
//   start: <Circle className="w-5 h-5 text-green-500" />,
//   end: <Circle className="w-5 h-5 text-red-500" />,
//   process: <Square className="w-5 h-5 text-blue-500" />,
//   decision: <Diamond className="w-5 h-5 text-yellow-500" />,
//   io: <HardDrive className="w-5 h-5 text-purple-500" />,
//   deployment: <Cloud className="w-5 h-5 text-orange-500" />
// };

// const FlowchartUI = () => {
//   const [nodes, setNodes, onNodesChange] = useNodesState([]);
//   const [edges, setEdges, onEdgesChange] = useEdgesState([]);
//   const [selectedTool, setSelectedTool] = useState<FlowchartNodeType | 'select' | 'edge'>('select');
//   const [nodeName, setNodeName] = useState('');
//   const [nodeDescription, setNodeDescription] = useState('');
//   const [selectedNode, setSelectedNode] = useState<Node<FlowchartNodeData> | null>(null);
//   const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

//   // Add a new node to the flowchart
//   const addNode = useCallback((type: FlowchartNodeType) => {
//     const newNode = {
//       id: `node-${Date.now()}`,
//       type: 'custom',
//       position: { x: Math.random() * 500, y: Math.random() * 500 },
//       data: {
//         label: nodeName || `New ${type}`,
//         description: nodeDescription,
//         type,
//         icon: nodeTypes[type]
//       }
//     };
//     setNodes((nds) => nds.concat(newNode));
//     setNodeName('');
//     setNodeDescription('');
//   }, [nodeName, nodeDescription, setNodes]);

//   // Connect nodes
//   const onConnect = useCallback(
//     (params: Connection) => {
//       const edge = {
//         ...params,
//         id: `edge-${params.source}-${params.target}`,
//         markerEnd: {
//           type: MarkerType.ArrowClosed,
//         },
//       };
//       setEdges((eds) => addEdge(edge, eds));
//     },
//     [setEdges]
//   );

//   // Handle node click
//   const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
//     setSelectedNode(node);
//   }, []);

//   // Handle pane click
//   const onPaneClick = useCallback(() => {
//     setSelectedNode(null);
//   }, []);

//   // Handle drag over
//   const onDragOver = useCallback((event: React.DragEvent) => {
//     event.preventDefault();
//     event.dataTransfer.dropEffect = 'move';
//   }, []);

//   // Handle drop
//   const onDrop = useCallback(
//     (event: React.DragEvent) => {
//       event.preventDefault();

//       if (!reactFlowInstance) return;

//       const type = event.dataTransfer.getData('application/reactflow') as FlowchartNodeType;
//       if (!type) return;

//       const position = reactFlowInstance.project({
//         x: event.clientX,
//         y: event.clientY,
//       });

//       const newNode = {
//         id: `node-${Date.now()}`,
//         type: 'custom',
//         position,
//         data: {
//           label: `New ${type}`,
//           type,
//           icon: nodeTypes[type]
//         },
//       };

//       setNodes((nds) => nds.concat(newNode));
//     },
//     [reactFlowInstance, setNodes]
//   );

//   // Delete selected node
//   const deleteSelectedNode = useCallback(() => {
//     if (selectedNode) {
//       setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
//       setEdges((eds) => eds.filter((edge) => 
//         edge.source !== selectedNode.id && edge.target !== selectedNode.id
//       ));
//       setSelectedNode(null);
//     }
//   }, [selectedNode, setNodes, setEdges]);

//   // Delete selected edge
//   const deleteSelectedEdge = useCallback(() => {
//     // You would implement this based on your edge selection logic
//   }, []);

//   // Custom node component
//   const CustomNode = ({ data, selected }: { data: FlowchartNodeData; selected: boolean }) => {
//     return (
//       <div className={`p-3 rounded-md border-2 ${selected ? 'border-blue-500' : 'border-gray-300'} bg-white`}>
//         <div className="flex items-center">
//           {data.icon}
//           <div className="ml-2">
//             <div className="font-medium">{data.label}</div>
//             {data.description && (
//               <div className="text-xs text-gray-500">{data.description}</div>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const nodeTypes: NodeTypes = {
//     custom: CustomNode,
//   };

//   return (
//     <AuthGuard>
//       <div className="flex flex-col h-screen">
//         {/* Toolbar */}
//         <div className="bg-gray-100 p-2 border-b flex items-center justify-between">
//           <div className="flex space-x-2">
//             <button
//               onClick={() => setSelectedTool('select')}
//               className={`p-2 rounded ${selectedTool === 'select' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-200'}`}
//               title="Select tool"
//             >
//               <MousePointer className="w-5 h-5" />
//             </button>
//             <button
//               onClick={() => setSelectedTool('edge')}
//               className={`p-2 rounded ${selectedTool === 'edge' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-200'}`}
//               title="Connect nodes"
//             >
//               <Link2 className="w-5 h-5" />
//             </button>
//             <div className="h-6 border-l border-gray-300 mx-1"></div>
//             {Object.entries(nodeTypes).map(([type, icon]) => (
//               <button
//                 key={type}
//                 onClick={() => setSelectedTool(type as FlowchartNodeType)}
//                 className={`p-2 rounded ${selectedTool === type ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-200'}`}
//                 title={`Add ${type} node`}
//                 draggable
//                 onDragStart={(event) => {
//                   event.dataTransfer.setData('application/reactflow', type);
//                   event.dataTransfer.effectAllowed = 'move';
//                 }}
//               >
//                 {icon}
//               </button>
//             ))}
//           </div>
//           <div className="flex space-x-2">
//             <button className="p-2 rounded text-gray-600 hover:bg-gray-200" title="Save flowchart">
//               <Save className="w-5 h-5" />
//             </button>
//             <button className="p-2 rounded text-gray-600 hover:bg-gray-200" title="Share flowchart">
//               <Share2 className="w-5 h-5" />
//             </button>
//           </div>
//         </div>

//         {/* Main content */}
//         <div className="flex flex-1 overflow-hidden">
//           {/* Sidebar */}
//           <div className="w-64 bg-white border-r p-4 overflow-y-auto">
//             <h2 className="font-bold text-lg mb-4">Flowchart Elements</h2>
            
//             <div className="mb-6">
//               <h3 className="font-medium text-sm text-gray-500 uppercase mb-2">Basic Nodes</h3>
//               <div className="space-y-2">
//                 {(['start', 'end', 'process', 'decision', 'io'] as FlowchartNodeType[]).map((type) => (
//                   <div
//                     key={type}
//                     className="flex items-center p-2 border rounded cursor-move hover:bg-gray-50"
//                     draggable
//                     onDragStart={(event) => {
//                       event.dataTransfer.setData('application/reactflow', type);
//                       event.dataTransfer.effectAllowed = 'move';
//                     }}
//                   >
//                     {nodeTypes[type]}
//                     <span className="ml-2 capitalize">{type}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="mb-6">
//               <h3 className="font-medium text-sm text-gray-500 uppercase mb-2">Deployment Nodes</h3>
//               <div className="space-y-2">
//                 {(['deployment'] as FlowchartNodeType[]).map((type) => (
//                   <div
//                     key={type}
//                     className="flex items-center p-2 border rounded cursor-move hover:bg-gray-50"
//                     draggable
//                     onDragStart={(event) => {
//                       event.dataTransfer.setData('application/reactflow', type);
//                       event.dataTransfer.effectAllowed = 'move';
//                     }}
//                   >
//                     {nodeTypes[type]}
//                     <span className="ml-2 capitalize">{type}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {selectedNode && (
//               <div className="mt-6 border-t pt-4">
//                 <h3 className="font-medium mb-2">Node Properties</h3>
//                 <div className="space-y-3">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
//                     <input
//                       type="text"
//                       className="w-full px-2 py-1 border rounded text-sm"
//                       value={selectedNode.data.label}
//                       onChange={(e) => {
//                         setNodes((nds) =>
//                           nds.map((node) => {
//                             if (node.id === selectedNode.id) {
//                               node.data = {
//                                 ...node.data,
//                                 label: e.target.value
//                               };
//                             }
//                             return node;
//                           })
//                         );
//                       }}
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//                     <textarea
//                       className="w-full px-2 py-1 border rounded text-sm"
//                       rows={3}
//                       value={selectedNode.data.description || ''}
//                       onChange={(e) => {
//                         setNodes((nds) =>
//                           nds.map((node) => {
//                             if (node.id === selectedNode.id) {
//                               node.data = {
//                                 ...node.data,
//                                 description: e.target.value
//                               };
//                             }
//                             return node;
//                           })
//                         );
//                       }}
//                     />
//                   </div>
//                   <button
//                     onClick={deleteSelectedNode}
//                     className="w-full py-1 bg-red-50 text-red-600 rounded text-sm flex items-center justify-center"
//                   >
//                     <Trash2 className="w-4 h-4 mr-1" /> Delete Node
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Flowchart canvas */}
//           <div className="flex-1">
//             <ReactFlow
//               nodes={nodes}
//               edges={edges}
//               onNodesChange={onNodesChange}
//               onEdgesChange={onEdgesChange}
//               onConnect={onConnect}
//               onNodeClick={onNodeClick}
//               onPaneClick={onPaneClick}
//               onInit={setReactFlowInstance}
//               onDrop={onDrop}
//               onDragOver={onDragOver}
//               nodeTypes={nodeTypes}
//               fitView
//             >
//               <Background />
//               <Controls />
//               <Panel position="top-right">
//                 <div className="bg-white p-2 rounded shadow-sm border flex space-x-1">
//                   <button className="p-1 rounded hover:bg-gray-100" title="Zoom in">
//                     <Plus className="w-4 h-4" />
//                   </button>
//                   <button className="p-1 rounded hover:bg-gray-100" title="Zoom out">
//                     <Minus className="w-4 h-4" />
//                   </button>
//                 </div>
//               </Panel>
//             </ReactFlow>
//           </div>
//         </div>
//       </div>
//     </AuthGuard>
//   );
// };

// export default FlowchartUI;


const flowchart =()=>{
    return(
      <div>
        <h1>Flowchart</h1>
      </div>
    )
}

export default flowchart;
