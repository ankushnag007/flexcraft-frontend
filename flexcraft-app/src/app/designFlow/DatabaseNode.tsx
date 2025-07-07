// DatabaseNode.tsx
import React from 'react';

interface DatabaseNodeProps {
  data: {
    label: string;
  };
}

const DatabaseNode: React.FC<DatabaseNodeProps> = ({ data }) => {
  return (
    <div style={{
      position: 'relative',
      width: '80px',
      height: '100px',
    }}>
      <div style={{
        position: 'absolute',
        top: '0',
        width: '80px',
        height: '60px',
        borderRadius: '40px 40px 0 0',
        background: '#fff',
        border: '1px solid #1a192b',
        borderBottom: 'none',
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '0',
        width: '80px',
        height: '40px',
        borderRadius: '0 0 20px 20px',
        background: '#fff',
        border: '1px solid #1a192b',
      }}>
        <div style={{
          position: 'absolute',
          top: '-20px',
          width: '80px',
          height: '20px',
          background: '#fff',
          border: '1px solid #1a192b',
          borderTop: 'none',
          borderRadius: '0 0 20px 20px',
        }}></div>
        <div style={{
          position: 'absolute',
          top: '10px',
          width: '100%',
          textAlign: 'center',
          transform: 'translateY(-50%)',
        }}>{data.label}</div>
      </div>
    </div>
  );
};

export default DatabaseNode;