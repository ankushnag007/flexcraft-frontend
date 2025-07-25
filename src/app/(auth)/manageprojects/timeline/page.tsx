"use client"
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

type TaskColor = 'blue' | 'purple' | 'green' | 'yellow' | 'red' | 'indigo' | 'pink' | 'orange';

interface TimelineTask {
  id: string;
  name: string;
  startDay: number; // 0-6 representing Mon-Sun
  duration: number; // in days
  color: TaskColor;
  completed?: boolean;
}

interface TimelineProps {
  initialTasks?: TimelineTask[];
  initialDate?: Date;
  title?: string;
  editable?: boolean;
  onTasksChange?: (tasks: TimelineTask[]) => void;
}

const Timeline: React.FC<TimelineProps> = ({
  initialTasks = [],
  initialDate = new Date(),
  title = 'Project Timeline',
  editable = true,
  onTasksChange,
}) => {
  const [tasks, setTasks] = useState<TimelineTask[]>(initialTasks);
  const [currentStartDate, setCurrentStartDate] = useState<Date>(initialDate);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState<Omit<TimelineTask, 'id'>>({
    name: '',
    startDay: 0,
    duration: 1,
    color: 'blue',
  });
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const colorClasses: Record<TaskColor, string> = {
    blue: 'bg-blue-100 border-blue-300 text-blue-800',
    purple: 'bg-purple-100 border-purple-300 text-purple-800',
    green: 'bg-green-100 border-green-300 text-green-800',
    yellow: 'bg-yellow-100 border-yellow-300 text-yellow-800',
    red: 'bg-red-100 border-red-300 text-red-800',
    indigo: 'bg-indigo-100 border-indigo-300 text-indigo-800',
    pink: 'bg-pink-100 border-pink-300 text-pink-800',
    orange: 'bg-orange-100 border-orange-300 text-orange-800',
  };

  const colorOptions: TaskColor[] = ['blue', 'purple', 'green', 'yellow', 'red', 'indigo', 'pink', 'orange'];

  useEffect(() => {
    if (onTasksChange) {
      onTasksChange(tasks);
    }
  }, [tasks, onTasksChange]);

  const getWeekRangeString = () => {
    const start = new Date(currentStartDate);
    const end = new Date(currentStartDate);
    end.setDate(end.getDate() + 6);
    
    const startMonth = start.toLocaleString('default', { month: 'short' });
    const endMonth = end.toLocaleString('default', { month: 'short' });
    
    if (startMonth === endMonth) {
      return `Week of ${startMonth} ${start.getDate()} - ${end.getDate()}, ${start.getFullYear()}`;
    }
    return `Week of ${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}, ${start.getFullYear()}`;
  };

  const handlePreviousWeek = () => {
    const newDate = new Date(currentStartDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentStartDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentStartDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentStartDate(newDate);
  };

  const getDayMonth = (dayIndex: number) => {
    const date = new Date(currentStartDate);
    date.setDate(date.getDate() + dayIndex);
    return date.toLocaleString('default', { month: 'short' });
  };

  const getDayDate = (dayIndex: number) => {
    const date = new Date(currentStartDate);
    date.setDate(date.getDate() + dayIndex);
    return date.getDate();
  };

  const handleAddTask = () => {
    if (!newTask.name.trim()) return;
    
    const task: TimelineTask = {
      ...newTask,
      id: uuidv4(),
    };
    
    setTasks([...tasks, task]);
    setNewTask({
      name: '',
      startDay: 0,
      duration: 1,
      color: 'blue',
    });
    setIsAddingTask(false);
  };

  const handleEditTask = (task: TimelineTask) => {
    setTasks(tasks.map(t => t.id === task.id ? task : t));
    setEditingTaskId(null);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleTaskClick = (task: TimelineTask) => {
    if (!editable) return;
    setEditingTaskId(task.id);
  };

  const handleTaskDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleTaskDrop = (e: React.DragEvent, dayIndex: number) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, startDay: dayIndex };
      }
      return task;
    }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleTaskResize = (taskId: string, newDuration: number) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, duration: Math.max(1, newDuration) };
      }
      return task;
    }));
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, completed: !task.completed };
      }
      return task;
    }));
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6 hover:shadow-md transition-all duration-200">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium">{title}</h3>
        <div className="flex space-x-2">
          {editable && (
            <button
              onClick={() => setIsAddingTask(true)}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
            >
              Add Task
            </button>
          )}
          <div className="flex items-center space-x-1">
            <button
              onClick={handleZoomOut}
              className="p-1 text-gray-500 hover:text-gray-700"
              title="Zoom Out"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="text-xs text-gray-500">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={handleZoomIn}
              className="p-1 text-gray-500 hover:text-gray-700"
              title="Zoom In"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg overflow-hidden" style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}>
        {/* Timeline Header */}
        <div className="flex bg-gray-100 border-b border-gray-200">
          <div className="w-48 p-2 font-medium text-sm text-gray-500 border-r border-gray-200">
            Tasks
          </div>
          <div className="flex-1 flex">
            {daysOfWeek.map((day, index) => (
              <div
                key={`${day}-${index}`}
                className="flex-1 p-2 text-center text-sm font-medium text-gray-500 border-r border-gray-200 last:border-r-0"
                onDrop={(e) => handleTaskDrop(e, index)}
                onDragOver={handleDragOver}
              >
                {day}{' '}
                <span className="block text-xs font-normal">
                  {getDayMonth(index)} {getDayDate(index)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Rows */}
        <div className="divide-y divide-gray-200">
          {tasks.map((task) => (
            <div key={task.id} className="flex h-12 relative group">
              <div className="w-48 p-2 flex items-center text-sm font-medium border-r border-gray-200">
                {editingTaskId === task.id ? (
                  <input
                    type="text"
                    value={task.name}
                    onChange={(e) => handleEditTask({ ...task, name: e.target.value })}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    autoFocus
                  />
                ) : (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={!!task.completed}
                      onChange={() => toggleTaskCompletion(task.id)}
                      className="mr-2"
                    />
                    <span
                      className={`${task.completed ? 'line-through text-gray-400' : ''}`}
                      onClick={() => handleTaskClick(task)}
                    >
                      {task.name}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 flex relative">
                <div
                  className={`absolute h-8 top-2 rounded flex items-center justify-center border ${
                    colorClasses[task.color]
                  } ${task.completed ? 'opacity-60' : ''}`}
                  style={{
                    left: `${(task.startDay / 7) * 100}%`,
                    width: `${(task.duration / 7) * 100}%`,
                    cursor: editable ? 'move' : 'default',
                  }}
                  draggable={editable}
                  onDragStart={(e) => handleTaskDragStart(e, task.id)}
                  onClick={() => handleTaskClick(task)}
                >
                  <span className="text-xs px-2 truncate">
                    {getDayMonth(task.startDay)} {getDayDate(task.startDay)}-
                    {getDayDate(task.startDay + task.duration - 1)}
                  </span>
                  {editable && (
                    <div className="absolute right-0 w-2 h-full cursor-e-resize" 
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const startX = e.clientX;
                        const startWidth = task.duration;
                        
                        const handleMouseMove = (moveEvent: MouseEvent) => {
                          const daysWidth = 7;
                          const dayWidth = (moveEvent.clientX - startX) / (document.querySelector('.flex-1')?.clientWidth || 1) * daysWidth;
                          const newDuration = Math.round(startWidth + dayWidth);
                          handleTaskResize(task.id, newDuration);
                        };
                        
                        const handleMouseUp = () => {
                          document.removeEventListener('mousemove', handleMouseMove);
                          document.removeEventListener('mouseup', handleMouseUp);
                        };
                        
                        document.addEventListener('mousemove', handleMouseMove);
                        document.addEventListener('mouseup', handleMouseUp);
                      }}
                    />
                  )}
                </div>
                {editingTaskId === task.id && (
                  <div className="absolute right-0 top-0 mt-1 mr-1 flex space-x-1">
                    <select
                      value={task.color}
                      onChange={(e) => handleEditTask({ ...task, color: e.target.value as TaskColor })}
                      className="border border-gray-300 rounded text-xs"
                    >
                      {colorOptions.map(color => (
                        <option key={color} value={color}>{color}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Add Task Form */}
          {isAddingTask && (
            <div className="flex h-12 relative">
              <div className="w-48 p-2 flex items-center text-sm font-medium border-r border-gray-200">
                <input
                  type="text"
                  placeholder="Task name"
                  value={newTask.name}
                  onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  autoFocus
                />
              </div>
              <div className="flex-1 flex relative">
                <div className="absolute left-0 w-full h-8 top-2 bg-gray-100 border border-gray-300 rounded flex items-center justify-between px-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-600">Start:</span>
                    <select
                      value={newTask.startDay}
                      onChange={(e) => setNewTask({ ...newTask, startDay: parseInt(e.target.value) })}
                      className="text-xs border border-gray-300 rounded"
                    >
                      {daysOfWeek.map((day, index) => (
                        <option key={index} value={index}>{day}</option>
                      ))}
                    </select>
                    <span className="text-xs text-gray-600">Duration:</span>
                    <input
                      type="number"
                      min="1"
                      max="7"
                      value={newTask.duration}
                      onChange={(e) => setNewTask({ ...newTask, duration: parseInt(e.target.value) })}
                      className="w-10 text-xs border border-gray-300 rounded px-1"
                    />
                    <span className="text-xs text-gray-600">Color:</span>
                    <select
                      value={newTask.color}
                      onChange={(e) => setNewTask({ ...newTask, color: e.target.value as TaskColor })}
                      className="text-xs border border-gray-300 rounded"
                    >
                      {colorOptions.map(color => (
                        <option key={color} value={color}>{color}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={handleAddTask}
                      className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsAddingTask(false)}
                      className="text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Timeline Footer */}
        <div className="bg-gray-50 p-2 border-t border-gray-200 flex justify-between items-center">
          <button
            onClick={handlePreviousWeek}
            className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Previous Week
          </button>
          <span className="text-sm text-gray-600">{getWeekRangeString()}</span>
          <button
            onClick={handleNextWeek}
            className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
          >
            Next Week
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Timeline;