"use client"
import React, { useState } from 'react';
import {
  ChevronDown,
  Filter,
  Plus,
  LayoutGrid,
  List as ListIcon,
  Search,
  X,
  ArrowUpDown,
  MoreVertical,
  Users,
  Calendar as CalendarIcon,
  CheckSquare,
  FileIcon,
  FileTextIcon,
  Columns,
  AlertTriangle,
  User,
  Tag,
  GitBranch,
  Tags,
  Paperclip,
  File,
  MessageSquare,
  FileText,
  AlignLeft
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  assignee: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  type: string;
  labels?: string[];
  attachments?: number;
  comments?: number;
  storyPoints?: number;
}

interface Section {
  id: string;
  title: string;
  count: number;
}

const ProjectBoard = () => {
  // State for view mode and search
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [newTaskStatus, setNewTaskStatus] = useState('today');
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newTaskLabels, setNewTaskLabels] = useState<string[]>([]);
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');

  // State for sections/columns
  const [sections, setSections] = useState<Section[]>([
    { id: 'recently-assigned', title: 'Recently assigned', count: 2 },
    { id: 'today', title: 'Do today', count: 1 },
    { id: 'next-week', title: 'Do next week', count: 0 },
    { id: 'later', title: 'Do later', count: 0 }
  ]);

  // State for tasks
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Design System Implementation",
      description: "Create a unified design system for all components",
      status: "recently-assigned",
      assignee: "John Doe",
      dueDate: "Jul 29 - 31",
      priority: "high",
      type: "story",
      labels: ["design", "ui"],
    },
    {
      id: "2",
      title: "API Integration",
      description: "Integrate with the new payment gateway API",
      status: "recently-assigned",
      assignee: "Jane Smith",
      dueDate: "Jul 28 - 30",
      priority: "medium",
      type: "task",
      labels: ["backend", "api"],
    },
    {
      id: "3",
      title: "Fix login page bug",
      description: "Users unable to login with Safari browser",
      status: "today",
      assignee: "Mike Johnson",
      dueDate: "Today",
      priority: "high",
      type: "bug",
      labels: ["frontend", "urgent"],
    },
    {
      id: "4",
      title: "Database optimization",
      description: "Optimize queries for better performance",
      status: "next-week",
      assignee: "Sarah Williams",
      dueDate: "Aug 5",
      priority: "medium",
      type: "task",
      labels: ["database"],
    },
    {
      id: "5",
      title: "User profile page redesign",
      description: "Redesign according to new brand guidelines",
      status: "later",
      assignee: "John Doe",
      dueDate: "Aug 15",
      priority: "low",
      type: "story",
      labels: ["design", "frontend"],
    },
  ]);

  // Filter tasks based on search query
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Helper functions for styling
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'story': return 'bg-purple-500';
      case 'task': return 'bg-blue-500';
      case 'bug': return 'bg-red-500';
      case 'epic': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  // Drag and drop handlers
  const handleDragStart = (taskId: string) => {
    setDraggedTaskId(taskId);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
  };

  const handleDrop = (status: string) => {
    if (!draggedTaskId) return;
    
    setTasks(tasks.map(task =>
      task.id === draggedTaskId ? { ...task, status } : task
    ));
    setDraggedTaskId(null);
  };

  // Task details drawer
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const openTaskDetails = (task: Task) => {
    setSelectedTask(task);
  };

  // Toggle search
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) setSearchQuery('');
  };

  // Add new section
  const handleAddSection = () => {
    if (!newSectionName.trim()) return;
    
    const newSection = {
      id: newSectionName.toLowerCase().replace(/\s+/g, '-'),
      title: newSectionName.trim(),
      count: 0
    };
    
    setSections([...sections, newSection]);
    setNewSectionName('');
    setIsAddingSection(false);
  };

  return (
    <div className="p-6 h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
        <div className="flex items-center gap-2">
          {isSearchOpen ? (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-64 pl-10 pr-10 py-2 border border-gray-300 rounded-full bg-white shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  onClick={toggleSearch}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={toggleSearch}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
            >
              <Search className="w-5 h-5" />
            </button>
          )}
          <button
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => setIsCreatingTask(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </button>
        </div>
      </div>

      {/* View Options */}
      <div className="flex items-center justify-between mb-6 bg-white p-3 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-4">
          <button
            className={`flex items-center px-3 py-1 rounded ${
              viewMode === "board"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setViewMode("board")}
          >
            <LayoutGrid className="w-4 h-4 mr-2" />
            Board
          </button>
          <button
            className={`flex items-center px-3 py-1 rounded ${
              viewMode === "list"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setViewMode("list")}
          >
            <ListIcon className="w-4 h-4 mr-2" />
            List
          </button>
        </div>
      </div>

      {/* Board View */}
      {viewMode === "board" && (
        <div className="flex-1 overflow-hidden">
          <div className="flex h-full overflow-x-auto pb-4">
            {/* Existing Sections */}
            {sections.map((section) => (
              <div
                key={section.id}
                className="bg-gray-50 p-4 rounded-lg border border-gray-200 min-w-[280px] mr-4 flex-shrink-0 h-full flex flex-col"
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(section.id)}
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="font-semibold text-gray-700">{section.title}</h2>
                    <span className="text-sm text-gray-500">
                      {filteredTasks.filter((t) => t.status === section.id).length} tasks
                    </span>
                  </div>
                  <Plus
                    className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer"
                    onClick={() => {
                      setIsCreatingTask(true);
                      setNewTaskStatus(section.id);
                    }}
                  />
                </div>
                <div className="flex-1 overflow-y-auto">
                  {filteredTasks
                    .filter((task) => task.status === section.id)
                    .map((task) => (
                      <div
                        key={task.id}
                        className={`bg-white p-3 rounded-lg shadow-sm border border-gray-200 mb-3 hover:shadow-md transition-shadow cursor-pointer ${
                          draggedTaskId === task.id ? "opacity-50" : ""
                        }`}
                        draggable
                        onDragStart={() => handleDragStart(task.id)}
                        onDragEnd={handleDragEnd}
                        onClick={() => openTaskDetails(task)}
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-gray-800">
                            {task.title}
                          </h3>
                          <MoreVertical className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                        </div>
                        <div className="flex items-center mt-2">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(
                              task.priority
                            )}`}
                          >
                            {task.priority}
                          </span>
                          {task.labels && task.labels.map((label, index) => (
                            <span 
                              key={index}
                              className="ml-2 text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded"
                            >
                              {label}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                          <div className="flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            <span>{task.assignee}</span>
                          </div>
                          <div className="flex items-center">
                            <CalendarIcon className="w-3 h-3 mr-1" />
                            <span>{task.dueDate}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                <button
                  className="w-full flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded mt-2"
                  onClick={() => {
                    setIsCreatingTask(true);
                    setNewTaskStatus(section.id);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </button>
              </div>
            ))}

            {/* Add Section Button */}
            <div className="min-w-[280px] mr-4 flex-shrink-0">
              {isAddingSection ? (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 border-dashed h-full flex flex-col">
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded mb-2"
                    placeholder="Section name"
                    value={newSectionName}
                    onChange={(e) => setNewSectionName(e.target.value)}
                    autoFocus
                  />
                  <div className="flex justify-end space-x-2 mt-auto">
                    <button
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded"
                      onClick={() => setIsAddingSection(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      onClick={handleAddSection}
                    >
                      Add
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className="w-full h-full flex items-center justify-center bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 border-dashed text-gray-500 p-4"
                  onClick={() => setIsAddingSection(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Section
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="flex-1 overflow-hidden">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
            <div className="overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Task
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assignee
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTasks.map((task) => (
                    <tr
                      key={task.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => openTaskDetails(task)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="font-medium text-gray-900">
                              {task.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {task.description?.substring(0, 50)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {sections.find(s => s.id === task.status)?.title}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {task.assignee}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {task.dueDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(
                            task.priority
                          )}`}
                        >
                          {task.priority}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {isCreatingTask && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div 
            className="absolute inset-0 bg-[rgba(0,0,0,0.4)] bg-opacity-40 transition-opacity duration-300"
            onClick={() => setIsCreatingTask(false)}
          ></div>
          
          <div className="fixed inset-y-0 right-0 w-full max-w-md flex">
            <div className="relative w-full h-full">
              <div className="h-full flex flex-col bg-white shadow-xl transform transition-transform duration-300 ease-in-out translate-x-0">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Add Task</h2>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={() => setIsCreatingTask(false)}
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Task Title
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter task title"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        autoFocus
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                        placeholder="Task description"
                        value={newTaskDescription}
                        onChange={(e) => setNewTaskDescription(e.target.value)}
                      ></textarea>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={newTaskStatus}
                        onChange={(e) => setNewTaskStatus(e.target.value)}
                      >
                        {sections.map(section => (
                          <option key={section.id} value={section.id}>{section.title}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Assignee
                      </label>
                      <select
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={newTaskAssignee}
                        onChange={(e) => setNewTaskAssignee(e.target.value)}
                      >
                        <option value="">Select assignee</option>
                        <option value="John Doe">John Doe</option>
                        <option value="Jane Smith">Jane Smith</option>
                        <option value="Mike Johnson">Mike Johnson</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Due Date
                      </label>
                      <input
                        type="date"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={newTaskDueDate}
                        onChange={(e) => setNewTaskDueDate(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priority
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          className={`py-2 px-3 rounded-md text-sm ${
                            newTaskPriority === 'high' 
                              ? 'bg-red-100 text-red-800 border-red-300' 
                              : 'bg-gray-100 text-gray-800 border-gray-300'
                          } border`}
                          onClick={() => setNewTaskPriority('high')}
                        >
                          High
                        </button>
                        <button
                          type="button"
                          className={`py-2 px-3 rounded-md text-sm ${
                            newTaskPriority === 'medium' 
                              ? 'bg-yellow-100 text-yellow-800 border-yellow-300' 
                              : 'bg-gray-100 text-gray-800 border-gray-300'
                          } border`}
                          onClick={() => setNewTaskPriority('medium')}
                        >
                          Medium
                        </button>
                        <button
                          type="button"
                          className={`py-2 px-3 rounded-md text-sm ${
                            newTaskPriority === 'low' 
                              ? 'bg-green-100 text-green-800 border-green-300' 
                              : 'bg-gray-100 text-gray-800 border-gray-300'
                          } border`}
                          onClick={() => setNewTaskPriority('low')}
                        >
                          Low
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex-shrink-0 px-4 py-4 border-t border-gray-200 flex justify-end gap-3">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsCreatingTask(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    onClick={() => {
                      const newTask: Task = {
                        id: Math.random().toString(36).substring(2, 9),
                        title: newTaskTitle,
                        description: newTaskDescription,
                        status: newTaskStatus,
                        assignee: newTaskAssignee,
                        dueDate: newTaskDueDate,
                        priority: newTaskPriority,
                        type: "task",
                        labels: newTaskLabels,
                      };
                      setTasks([...tasks, newTask]);
                      setIsCreatingTask(false);
                      setNewTaskTitle('');
                      setNewTaskDescription('');
                      setNewTaskAssignee('');
                      setNewTaskDueDate('');
                      setNewTaskPriority('medium');
                      setNewTaskLabels([]);
                    }}
                  >
                    Add Task
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Details Drawer */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div 
            className="absolute inset-0 bg-[rgba(0,0,0,0.4)] bg-opacity-40 transition-opacity duration-300 ease-in-out"
            onClick={() => setSelectedTask(null)}
          ></div>
          
          <div className="fixed inset-y-0 right-0 w-full max-w-[60%] flex">
            <div className="relative w-full h-full">
              <div className="h-full flex flex-col bg-white shadow-xl transform transition-transform duration-300 ease-in-out translate-x-0">
                <div className="flex items-start justify-between p-6 border-b border-gray-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${getTypeColor(selectedTask.type)}`}></span>
                      <h2 className="text-xl font-semibold text-gray-900">{selectedTask.title}</h2>
                    </div>
                    <div className="flex items-center mt-2 gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {selectedTask.assignee}
                      </span>
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" />
                        {selectedTask.dueDate}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={() => setSelectedTask(null)}
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="space-y-6">
                    {/* Description */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                        <FileTextIcon className="w-4 h-4" />
                        Description
                      </h3>
                      <p className="mt-2 text-sm text-gray-900 p-3 bg-gray-50 rounded">
                        {selectedTask.description || "No description provided"}
                      </p>
                    </div>
                    
                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Status */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                          <Columns className="w-4 h-4" />
                          Status
                        </h3>
                        <p className="mt-1 text-sm text-gray-900">
                          {sections.find(s => s.id === selectedTask.status)?.title || selectedTask.status}
                        </p>
                      </div>
                      
                      {/* Priority */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          Priority
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`w-3 h-3 rounded-full ${
                            selectedTask.priority === 'high' ? 'bg-red-500' :
                            selectedTask.priority === 'medium' ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}></span>
                          <span className="text-sm text-gray-900 capitalize">
                            {selectedTask.priority}
                          </span>
                        </div>
                      </div>
                      
                      {/* Assignee with Email */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Assignee
                        </h3>
                        <div className="mt-1">
                          <p className="text-sm text-gray-900">{selectedTask.assignee}</p>
                          <p className="text-xs text-gray-500">
                            {selectedTask.assignee.toLowerCase().replace(/\s+/g, '.')}@company.com
                          </p>
                        </div>
                      </div>
                      
                      {/* Due Date */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4" />
                          Due Date
                        </h3>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedTask.dueDate}
                        </p>
                      </div>
                    </div>
                    
                    {/* Labels */}
                    {selectedTask.labels && selectedTask.labels.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                          <Tags className="w-4 h-4" />
                          Labels
                        </h3>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {selectedTask.labels.map((label, index) => (
                            <span 
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {label}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex-shrink-0 px-4 py-4 border-t border-gray-200 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>Created: Today</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      onClick={() => setSelectedTask(null)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectBoard;