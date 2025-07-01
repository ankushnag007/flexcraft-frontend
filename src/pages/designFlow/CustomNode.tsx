// CustomNode.tsx
import React from 'react';

interface CustomNodeProps {
  data: {
    label: string;
  };
}

const CustomNode: React.FC<CustomNodeProps> = ({ data }) => {
  return (
    <div style={{
      padding: '10px',
      borderRadius: '5px',
      background: '#fff',
      border: '1px solid #1a192b',
    }}>
      <div>{data.label}</div>
    </div>
  );
};

export default CustomNode;