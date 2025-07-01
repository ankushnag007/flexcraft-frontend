// Sidebar.tsx
import React from 'react';

interface SidebarProps {
  nodeOptions: Array<{ type: string; label: string; icon: string }>;
  selectedNode: any;
  nodeSize: { width: number; height: number };
  setNodeSize: React.Dispatch<React.SetStateAction<{ width: number; height: number }>>;
  nodeColor: string;
  setNodeColor: React.Dispatch<React.SetStateAction<string>>;
  edgeType: string;
  setEdgeType: React.Dispatch<React.SetStateAction<string>>;
  edgeColor: string;
  setEdgeColor: React.Dispatch<React.SetStateAction<string>>;
  updateNodeProperties: () => void;
  saveFlow: () => void;
  loadFlow: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  nodeOptions,
  selectedNode,
  nodeSize,
  setNodeSize,
  nodeColor,
  setNodeColor,
  edgeType,
  setEdgeType,
  edgeColor,
  setEdgeColor,
  updateNodeProperties,
  saveFlow,
  loadFlow,
}) => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div style={{
      width: '250px',
      height: '100%',
      backgroundColor: '#f8f9fa',
      padding: '15px',
      borderRight: '1px solid #ddd',
      overflowY: 'auto',
    }}>
      <h3>System Architecture Designer</h3>
      
      <div className="sidebar-section">
        <h4>Nodes</h4>
        {nodeOptions.map((node) => (
          <div
            key={node.type}
            className="dndnode"
            draggable
            onDragStart={(event) => onDragStart(event, node.type)}
            style={{
              padding: '8px',
              margin: '5px 0',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'grab',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span style={{ marginRight: '8px' }}>{node.icon}</span>
            {node.label}
          </div>
        ))}
      </div>

      {selectedNode && (
        <div className="sidebar-section" style={{ marginTop: '20px' }}>
          <h4>Node Properties</h4>
          <div style={{ marginBottom: '10px' }}>
            <label>Label:</label>
            <input
              type="text"
              value={selectedNode.data?.label || ''}
              onChange={(e) => {
                setSelectedNode({
                  ...selectedNode,
                  data: { ...selectedNode.data, label: e.target.value },
                });
              }}
              style={{ width: '100%', padding: '5px' }}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>Width:</label>
            <input
              type="number"
              value={nodeSize.width}
              onChange={(e) => setNodeSize({ ...nodeSize, width: parseInt(e.target.value) || 150 })}
              style={{ width: '100%', padding: '5px' }}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>Height:</label>
            <input
              type="number"
              value={nodeSize.height}
              onChange={(e) => setNodeSize({ ...nodeSize, height: parseInt(e.target.value) || 50 })}
              style={{ width: '100%', padding: '5px' }}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>Color:</label>
            <input
              type="color"
              value={nodeColor}
              onChange={(e) => setNodeColor(e.target.value)}
              style={{ width: '100%', padding: '2px' }}
            />
          </div>

          <button
            onClick={updateNodeProperties}
            style={{ width: '100%', padding: '8px', marginTop: '10px' }}
          >
            Apply Changes
          </button>
        </div>
      )}

      <div className="sidebar-section" style={{ marginTop: '20px' }}>
        <h4>Edge Properties</h4>
        <div style={{ marginBottom: '10px' }}>
          <label>Edge Type:</label>
          <select
            value={edgeType}
            onChange={(e) => setEdgeType(e.target.value)}
            style={{ width: '100%', padding: '5px' }}
          >
            <option value="default">Default</option>
            <option value="straight">Straight</option>
            <option value="step">Step</option>
            <option value="smoothstep">Smooth Step</option>
          </select>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Edge Color:</label>
          <input
            type="color"
            value={edgeColor}
            onChange={(e) => setEdgeColor(e.target.value)}
            style={{ width: '100%', padding: '2px' }}
          />
        </div>
      </div>

      <div className="sidebar-section" style={{ marginTop: '20px' }}>
        <h4>Flow Actions</h4>
        <button
          onClick={saveFlow}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        >
          Save Flow
        </button>
        
        <div style={{ position: 'relative', width: '100%' }}>
          <button
            style={{ width: '100%', padding: '8px' }}
            onClick={() => document.getElementById('flow-upload')?.click()}
          >
            Load Flow
          </button>
          <input
            id="flow-upload"
            type="file"
            accept=".json"
            onChange={loadFlow}
            style={{ display: 'none' }}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;