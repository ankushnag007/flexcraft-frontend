'use client';


type ToolbarProps = {
  onAddNode: () => void;
};

const Toolbar: React.FC<ToolbarProps> = ({ onAddNode }) => {
  return (
    <div className="p-4 bg-white shadow-md flex gap-3 z-50">
      <button onClick={onAddNode}>Add Node</button>
    </div>
  );
};

export default Toolbar;
