"use client"
import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  ChevronDown, 
  Filter, 
  Clock,
  User,
  Check,
  Flag,
  Calendar,
  ChevronRight,
  X,
  List,
  MessageSquare,
  Paperclip,
  Tag,
  Users,
  GanttChart,
  CheckCircle,
  Circle
} from 'lucide-react';

type Priority = 'high' | 'medium' | 'low' | 'none';
type TaskStatus = 'todo' | 'in-progress' | 'completed';

interface User {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
}

interface Comment {
  id: string;
  author: User;
  text: string;
  createdAt: Date;
}

interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  uploadedAt: Date;
}

interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: Date;
  assignees?: User[];
}

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  priority: Priority;
  status: TaskStatus;
  assignees?: User[];
  subTasks?: SubTask[];
  comments?: Comment[];
  attachments?: Attachment[];
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface TaskGroup {
  title: string;
  tasks: Task[];
}

const TaskList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [taskFilter, setTaskFilter] = useState('all');
  const [sortBy, setSortBy] = useState('due-date');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskDrawerOpen, setIsTaskDrawerOpen] = useState(false);
  const [isNewTaskDrawerOpen, setIsNewTaskDrawerOpen] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    status: 'todo',
    priority: 'none',
    createdAt: new Date(),
    updatedAt: new Date()
  });

  // Sample users data
  const users: User[] = [
    { id: '1', name: 'Alex Johnson', avatar: 'https://i.pravatar.cc/150?img=1', email: 'alex@example.com' },
    { id: '2', name: 'Sarah Williams', avatar: 'https://i.pravatar.cc/150?img=2', email: 'sarah@example.com' },
    { id: '3', name: 'Michael Chen', avatar: 'https://i.pravatar.cc/150?img=3', email: 'michael@example.com' },
    { id: '4', name: 'Emily Davis', avatar: 'https://i.pravatar.cc/150?img=4', email: 'emily@example.com' },
    { id: '5', name: 'David Wilson', avatar: 'https://i.pravatar.cc/150?img=5', email: 'david@example.com' }
  ];

  // Sample task data
  const taskGroups: TaskGroup[] = [
    {
      title: "Today's Tasks",
      tasks: [
        {
          id: '1',
          title: 'Complete project proposal draft',
          description: 'Include all requirements and timeline estimates',
          dueDate: new Date(new Date().setHours(15, 0, 0, 0)),
          priority: 'high',
          status: 'todo',
          assignees: [users[0], users[1]],
          subTasks: [
            { id: '1-1', title: 'Research competitors', completed: true },
            { id: '1-2', title: 'Outline proposal structure', completed: true },
            { id: '1-3', title: 'Write executive summary', completed: false }
          ],
          comments: [
            {
              id: 'c1',
              author: users[0],
              text: 'Please review the financial projections section',
              createdAt: new Date(new Date().setHours(10, 30, 0, 0))
            }
          ],
          attachments: [
            {
              id: 'a1',
              name: 'Proposal_Template.docx',
              url: '#',
              type: 'document',
              uploadedAt: new Date(new Date().setDate(new Date().getDate() - 1))
            }
          ],
          tags: ['document', 'urgent'],
          createdAt: new Date(new Date().setDate(new Date().getDate() - 2)),
          updatedAt: new Date(new Date().setDate(new Date().getDate() - 1))
        },
        {
          id: '2',
          title: 'Review UI mockups',
          description: 'Provide feedback to design team',
          priority: 'medium',
          status: 'in-progress',
          assignees: [users[2]],
          subTasks: [
            { id: '2-1', title: 'Review mobile screens', completed: true },
            { id: '2-2', title: 'Check accessibility', completed: false }
          ],
          tags: ['design', 'feedback'],
          createdAt: new Date(new Date().setDate(new Date().getDate() - 3)),
          updatedAt: new Date()
        }
      ]
    },
    {
      title: 'Upcoming Tasks',
      tasks: [
        {
          id: '3',
          title: 'Prepare client presentation',
          description: 'Include project milestones and KPIs',
          dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
          priority: 'none',
          status: 'todo',
          assignees: [users[3], users[4]],
          tags: ['presentation', 'client'],
          createdAt: new Date(new Date().setDate(new Date().getDate() - 5)),
          updatedAt: new Date(new Date().setDate(new Date().getDate() - 2))
        }
      ]
    }
  ];

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: Priority) => {
    switch (priority) {
      case 'high': return <Flag className="h-3 w-3 text-red-500" />;
      case 'medium': return <Flag className="h-3 w-3 text-yellow-500" />;
      case 'low': return <Flag className="h-3 w-3 text-blue-500" />;
      default: return null;
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'todo': return <Circle className="h-3 w-3 text-gray-400" />;
      case 'in-progress': return <GanttChart className="h-3 w-3 text-blue-500" />;
      case 'completed': return <CheckCircle className="h-3 w-3 text-green-500" />;
    }
  };

  const formatDueDate = (date?: Date) => {
    if (!date) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskDrawerOpen(true);
  };

  const handleNewTask = () => {
    setIsNewTaskDrawerOpen(true);
  };

  const handleCreateTask = () => {
    // In a real app, you would add the task to your state or API here
    const completeTask: Task = {
      ...newTask,
      id: `task-${Date.now()}`,
      title: newTask.title || 'New Task',
      status: newTask.status || 'todo',
      priority: newTask.priority || 'none',
      assignees: newTask.assignees || [],
      subTasks: newTask.subTasks || [],
      comments: [],
      attachments: [],
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date()
    } as Task;
    
    console.log('New task created:', completeTask);
    setIsNewTaskDrawerOpen(false);
    setNewTask({
      title: '',
      status: 'todo',
      priority: 'none',
      createdAt: new Date(),
      updatedAt: new Date()
    });
  };

  const toggleSubTask = (taskId: string, subTaskId: string) => {
    // In a real app, you would update your state or API here
    console.log(`Toggled subtask ${subTaskId} for task ${taskId}`);
  };

  const addComment = (taskId: string, commentText: string) => {
    // In a real app, you would update your state or API here
    console.log(`Added comment to task ${taskId}: ${commentText}`);
  };

  const assignUser = (taskId: string, userId: string) => {
    // In a real app, you would update your state or API here
    console.log(`Assigned user ${userId} to task ${taskId}`);
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Main Task List */}
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          {/* List Header with Controls */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Project Tasks</h3>
              <div className="flex space-x-2">
                <button 
                  className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 flex items-center transition-colors"
                  onClick={handleNewTask}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Task
                </button>
              </div>
            </div>
            
            {/* Search and Filter Row */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                  placeholder="Search tasks..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <select 
                    className="appearance-none bg-gray-100 border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-sm"
                    value={taskFilter}
                    onChange={(e) => setTaskFilter(e.target.value)}
                  >
                    <option value="all">All Tasks</option>
                    <option value="my-tasks">My Tasks</option>
                    <option value="unassigned">Unassigned</option>
                    <option value="completed">Completed</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
                
                <div className="relative">
                  <select 
                    className="appearance-none bg-gray-100 border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-sm"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="due-date">Sort by: Due Date</option>
                    <option value="priority">Sort by: Priority</option>
                    <option value="recent">Sort by: Recently Added</option>
                    <option value="alphabetical">Sort by: Alphabetical</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
                
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                  <Filter className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Task List */}
          <div className="divide-y divide-gray-200">
            {taskGroups.map((group) => (
              <React.Fragment key={group.title}>
                {/* Task Group Header */}
                <div className="bg-gray-50 px-4 py-2 text-sm font-medium text-gray-500 flex items-center">
                  <ChevronDown className="w-4 h-4 mr-2" />
                  {group.title} ({group.tasks.length})
                </div>
                
                {/* Task Items */}
                {group.tasks.map((task) => (
                  <div 
                    key={task.id} 
                    className="px-4 py-3 hover:bg-gray-50 flex items-start transition-colors cursor-pointer"
                    onClick={() => handleTaskClick(task)}
                  >
                    <div className="flex items-center mr-3 mt-1">
                      <input 
                        type="checkbox" 
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                        checked={task.status === 'completed'}
                        onChange={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <p className={`text-sm font-medium ${task.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-900'} truncate`}>
                          {task.title}
                        </p>
                        {task.priority !== 'none' && (
                          <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {getPriorityIcon(task.priority)}
                            <span className="ml-1 capitalize">{task.priority} Priority</span>
                          </span>
                        )}
                      </div>
                      {task.description && (
                        <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                      )}
                      {task.dueDate && (
                        <div className="mt-2 flex items-center text-xs text-gray-500">
                          <Clock className="flex-shrink-0 mr-1.5 h-4 w-4" />
                          Due {formatDueDate(task.dueDate)}
                        </div>
                      )}
                    </div>
                    {task.assignees && task.assignees.length > 0 && (
                      <div className="ml-4 flex-shrink-0">
                        <div className="flex -space-x-1">
                          {task.assignees.slice(0, 3).map((assignee) => (
                            <img 
                              key={assignee.id}
                              className="w-6 h-6 rounded-full border-2 border-white"
                              src={assignee.avatar || `https://ui-avatars.com/api/?name=${assignee.name}&background=random`}
                              alt={assignee.name}
                              title={assignee.name}
                            />
                          ))}
                          {task.assignees.length > 3 && (
                            <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                              +{task.assignees.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
          
          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
              View all tasks
              <ChevronRight className="ml-1 w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Task Detail Drawer */}
      {isTaskDrawerOpen && selectedTask && (
        <div className="fixed inset-0 overflow-hidden z-50 bg-[rgba(0,0,0,0.4)] bg-opacity-40">
          <div className="absolute inset-0 overflow-hidden">
            <div 
              className="absolute inset-0 bg-opacity-75 transition-opacity" 
              onClick={() => setIsTaskDrawerOpen(false)}
            ></div>
            <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
              <div className="w-screen max-w-md">
                <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                  <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-lg font-medium text-gray-900">{selectedTask.title}</h2>
                        <div className="flex items-center mt-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(selectedTask.priority)} mr-2`}>
                            {getPriorityIcon(selectedTask.priority)}
                            <span className="ml-1 capitalize">{selectedTask.priority} Priority</span>
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            {getStatusIcon(selectedTask.status)}
                            <span className="ml-1 capitalize">{selectedTask.status.replace('-', ' ')}</span>
                          </span>
                        </div>
                      </div>
                      <div className="ml-3 h-7 flex items-center">
                        <button
                          type="button"
                          className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onClick={() => setIsTaskDrawerOpen(false)}
                        >
                          <span className="sr-only">Close panel</span>
                          <X className="h-6 w-6" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-6">
                      {/* Description */}
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
                        <p className="text-sm text-gray-600">
                          {selectedTask.description || 'No description provided'}
                        </p>
                      </div>

                      {/* Due Date */}
                      {selectedTask.dueDate && (
                        <div className="mb-6">
                          <h3 className="text-sm font-medium text-gray-900 mb-2">Due Date</h3>
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                            {formatDueDate(selectedTask.dueDate)}
                          </div>
                        </div>
                      )}

                      {/* Assignees */}
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-900 mb-2">Assignees</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedTask.assignees?.length ? (
                            selectedTask.assignees.map((assignee) => (
                              <div key={assignee.id} className="flex items-center">
                                <img 
                                  className="w-6 h-6 rounded-full border-2 border-white"
                                  src={assignee.avatar || `https://ui-avatars.com/api/?name=${assignee.name}&background=random`}
                                  alt={assignee.name}
                                />
                                <span className="ml-2 text-sm text-gray-600">{assignee.name}</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500">No assignees</p>
                          )}
                          <button className="text-blue-600 text-sm hover:text-blue-800 flex items-center">
                            <Plus className="w-4 h-4 mr-1" />
                            Add assignee
                          </button>
                        </div>
                      </div>

                      {/* Sub Tasks */}
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-sm font-medium text-gray-900">Sub Tasks</h3>
                          <button 
                            className="text-blue-600 text-sm hover:text-blue-800 flex items-center"
                            onClick={() => {
                              const title = prompt('Enter sub task title:');
                              if (title) {
                                // In a real app, you would update your state or API here
                                console.log(`Added sub task: ${title}`);
                              }
                            }}
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Sub Task
                          </button>
                        </div>
                        {selectedTask.subTasks?.length ? (
                          <div className="space-y-2">
                            {selectedTask.subTasks.map((subTask) => (
                              <div key={subTask.id} className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={subTask.completed}
                                  onChange={() => toggleSubTask(selectedTask.id, subTask.id)}
                                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mr-2"
                                />
                                <span className={`text-sm ${subTask.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                                  {subTask.title}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No sub tasks</p>
                        )}
                      </div>

                      {/* Tags */}
                      {selectedTask.tags?.length ? (
                        <div className="mb-6">
                          <h3 className="text-sm font-medium text-gray-900 mb-2">Tags</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedTask.tags.map((tag) => (
                              <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : null}

                      {/* Attachments */}
                      {selectedTask.attachments?.length ? (
                        <div className="mb-6">
                          <h3 className="text-sm font-medium text-gray-900 mb-2">Attachments</h3>
                          <div className="space-y-2">
                            {selectedTask.attachments.map((attachment) => (
                              <div key={attachment.id} className="flex items-center">
                                <Paperclip className="w-4 h-4 text-gray-400 mr-2" />
                                <a href={attachment.url} className="text-sm text-blue-600 hover:text-blue-800">
                                  {attachment.name}
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}

                      {/* Comments */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-2">Comments</h3>
                        {selectedTask.comments?.length ? (
                          <div className="space-y-4">
                            {selectedTask.comments.map((comment) => (
                              <div key={comment.id} className="flex">
                                <img 
                                  className="w-8 h-8 rounded-full mr-3"
                                  src={comment.author.avatar || `https://ui-avatars.com/api/?name=${comment.author.name}&background=random`}
                                  alt={comment.author.name}
                                />
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {comment.author.name}
                                    <span className="ml-2 text-xs text-gray-500">
                                      {comment.createdAt.toLocaleDateString()} at {comment.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600 mt-1">{comment.text}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No comments</p>
                        )}
                        <div className="mt-4">
                          <textarea
                            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                            rows={3}
                            placeholder="Add a comment..."
                          ></textarea>
                          <button 
                            className="mt-2 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                            onClick={() => {
                              const commentText = (document.querySelector('textarea') as HTMLTextAreaElement)?.value;
                              if (commentText) {
                                addComment(selectedTask.id, commentText);
                                (document.querySelector('textarea') as HTMLTextAreaElement).value = '';
                              }
                            }}
                          >
                            Post Comment
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={() => setIsTaskDrawerOpen(false)}
                      >
                        Close
                      </button>
                      <button
                        type="button"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Task Drawer */}
      {isNewTaskDrawerOpen && (
        <div className="fixed inset-0 overflow-hidden z-50 bg-[rgba(0,0,0,0.4)] bg-opacity-40">
          <div className="absolute inset-0 overflow-hidden">
            <div 
              className="absolute inset-0 bg-opacity-75 transition-opacity" 
              onClick={() => setIsNewTaskDrawerOpen(false)}
            ></div>
            <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
              <div className="w-screen max-w-md">
                <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                  <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <h2 className="text-lg font-medium text-gray-900">Create New Task</h2>
                      <div className="ml-3 h-7 flex items-center">
                        <button
                          type="button"
                          className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onClick={() => setIsNewTaskDrawerOpen(false)}
                        >
                          <span className="sr-only">Close panel</span>
                          <X className="h-6 w-6" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-6 space-y-6">
                      {/* Task Title */}
                      <div>
                        <label htmlFor="task-title" className="block text-sm font-medium text-gray-700">
                          Task Title*
                        </label>
                        <input
                          type="text"
                          id="task-title"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={newTask.title}
                          onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <label htmlFor="task-description" className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <textarea
                          id="task-description"
                          rows={3}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={newTask.description}
                          onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                        ></textarea>
                      </div>

                      {/* Due Date */}
                      <div>
                        <label htmlFor="task-due-date" className="block text-sm font-medium text-gray-700">
                          Due Date
                        </label>
                        <input
                          type="date"
                          id="task-due-date"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={newTask.dueDate ? new Date(newTask.dueDate).toISOString().split('T')[0] : ''}
                          onChange={(e) => setNewTask({...newTask, dueDate: new Date(e.target.value)})}
                        />
                      </div>

                      {/* Priority */}
                      <div>
                        <label htmlFor="task-priority" className="block text-sm font-medium text-gray-700">
                          Priority
                        </label>
                        <select
                          id="task-priority"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={newTask.priority}
                          onChange={(e) => setNewTask({...newTask, priority: e.target.value as Priority})}
                        >
                          <option value="none">None</option>
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>

                      {/* Assignees */}
                      <div>
                        <label htmlFor="task-assignees" className="block text-sm font-medium text-gray-700">
                          Assignees
                        </label>
                        <select
                          id="task-assignees"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          multiple
                          onChange={(e) => {
                            const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
                            const selectedUsers = users.filter(user => selectedOptions.includes(user.id));
                            setNewTask({...newTask, assignees: selectedUsers});
                          }}
                        >
                          {users.map((user) => (
                            <option key={user.id} value={user.id}>{user.name}</option>
                          ))}
                        </select>
                      </div>

                      {/* Tags */}
                      <div>
                        <label htmlFor="task-tags" className="block text-sm font-medium text-gray-700">
                          Tags
                        </label>
                        <input
                          type="text"
                          id="task-tags"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Enter tags separated by commas"
                          onChange={(e) => {
                            const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
                            setNewTask({...newTask, tags});
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={() => setIsNewTaskDrawerOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={handleCreateTask}
                        disabled={!newTask.title}
                      >
                        Create Task
                      </button>
                    </div>
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

export default TaskList;