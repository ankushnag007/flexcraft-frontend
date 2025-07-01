// DecisionNode.tsx
import React from 'react';
import { Handle, Position } from 'reactflow';

interface DecisionNodeProps {
  data: {
    label: string;
  };
  selected?: boolean;
}

const DecisionNode: React.FC<DecisionNodeProps> = ({ data, selected }) => {
  return (
    <div 
      style={{
        width: '100px',
        height: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: 'rotate(45deg)',
        background: '#fff',
        border: selected ? '2px solid #6366f1' : '1px solid #1a192b',
        borderRadius: '4px',
      }}
    >
      <div style={{ transform: 'rotate(-45deg)', width: '80px', textAlign: 'center' }}>
        {data.label}
      </div>
      
      {/* Handles for connections */}
      <Handle 
        type="source" 
        position={Position.Right} 
        style={{ transform: 'rotate(-45deg)', right: '-8px' }}
      />
      <Handle 
        type="target" 
        position={Position.Left} 
        style={{ transform: 'rotate(-45deg)', left: '-8px' }}
      />
      <Handle 
        type="source" 
        position={Position.Top} 
        style={{ transform: 'rotate(-45deg)', top: '-8px' }}
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        style={{ transform: 'rotate(-45deg)', bottom: '-8px' }}
      />
    </div>
  );
};

export default DecisionNode;