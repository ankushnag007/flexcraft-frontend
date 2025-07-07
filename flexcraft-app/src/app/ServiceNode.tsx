// ServiceNode.tsx
import React from 'react';

interface ServiceNodeProps {
  data: {
    label: string;
  };
}

const ServiceNode: React.FC<ServiceNodeProps> = ({ data }) => {
  return (
    <div style={{
      padding: '10px',
      borderRadius: '10px',
      background: '#e3f2fd',
      border: '2px solid #90caf9',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    }}>
      <div style={{ fontWeight: 'bold', color: '#0d47a1' }}>{data.label}</div>
      <div style={{ fontSize: '0.8em', color: '#2196f3' }}>Microservice</div>
    </div>
  );
};

export default ServiceNode;