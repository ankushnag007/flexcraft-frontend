"use client"
import React, { useState } from 'react';
import {
  ChevronDown,
  Plus,
  Filter,
  Search,
  MoreVertical,
  Check,
  Flag,
  Calendar,
  UserCircle,
  BarChart2,
  RefreshCw,
  X,
  ChevronRight,
  List,
  Target,
  Gauge,
  Users,
  Tag,
  Paperclip,
  MessageSquare,
  Clock,
  Star,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

// types.ts
export type GoalStatus = 'on-track' | 'at-risk' | 'off-track' | 'complete' | 'not-started';
export type GoalPriority = 'high' | 'medium' | 'low';
export type GoalType = 'quantitative' | 'boolean' | 'milestone';

export interface SubGoal {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: Date;
  assignee?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  status: GoalStatus;
  priority: GoalPriority;
  type: GoalType;
  dueDate: Date;
  startDate?: Date;
  owner: {
    id: string;
    name: string;
    avatar?: string;
  };
  progress: number;
  subGoals: SubGoal[];
  createdAt: Date;
  updatedAt: Date;
  team?: string;
  tags?: string[];
  followers?: string[];
  attachments?: string[];
  comments?: {
    id: string;
    author: string;
    text: string;
    createdAt: Date;
  }[];
}

const Goals: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>(sampleGoals);
  const [isAddingSubGoal, setIsAddingSubGoal] = useState(false);
  const [subGoalTitle, setSubGoalTitle] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<GoalStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<GoalPriority | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<GoalType | 'all'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isGoalDrawerOpen, setIsGoalDrawerOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [newGoal, setNewGoal] = useState<Partial<Goal>>({
    title: '',
    description: '',
    status: 'not-started',
    priority: 'medium',
    type: 'quantitative',
    dueDate: new Date(),
    progress: 0,
    subGoals: []
  });

  // Filter goals based on search and filters
  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         goal.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || goal.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || goal.priority === priorityFilter;
    const matchesType = typeFilter === 'all' || goal.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesType;
  });

  // Open goal drawer with selected goal
  const openGoalDrawer = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsGoalDrawerOpen(true);
  };

  // Create a new goal
  const handleCreateGoal = () => {
    const completeGoal: Goal = {
      ...newGoal,
      id: `goal-${Date.now()}`,
      owner: {
        id: 'user-1',
        name: 'Current User'
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      subGoals: newGoal.subGoals || [],
      progress: newGoal.progress || 0,
      followers: [],
      attachments: [],
      comments: []
    } as Goal;
    
    setGoals([...goals, completeGoal]);
    setIsCreateModalOpen(false);
    resetNewGoalForm();
  };

  // Update goal status
  const updateGoalStatus = (goalId: string, newStatus: GoalStatus) => {
    setGoals(goals.map(goal => 
      goal.id === goalId ? { ...goal, status: newStatus } : goal
    ));
  };

  // Update goal progress
  const updateGoalProgress = (goalId: string, newProgress: number) => {
    setGoals(goals.map(goal => 
      goal.id === goalId ? { 
        ...goal, 
        progress: newProgress,
        status: calculateStatusBasedOnProgress(newProgress)
      } : goal
    ));
  };

  // Add sub goal to selected goal
  const addSubGoal = (goalId: string, subGoalTitle: string) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        const newSubGoal: SubGoal = {
          id: `subgoal-${Date.now()}`,
          title: subGoalTitle,
          completed: false
        };
        return {
          ...goal,
          subGoals: [...goal.subGoals, newSubGoal]
        };
      }
      return goal;
    }));

    // Update selected goal if it's the one being viewed
    if (selectedGoal && selectedGoal.id === goalId) {
      setSelectedGoal({
        ...selectedGoal,
        subGoals: [
          ...selectedGoal.subGoals,
          {
            id: `subgoal-${Date.now()}`,
            title: subGoalTitle,
            completed: false
          }
        ]
      });
    }
  };

  // Toggle sub goal completion
  const toggleSubGoalCompletion = (goalId: string, subGoalId: string) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        return {
          ...goal,
          subGoals: goal.subGoals.map(subGoal => 
            subGoal.id === subGoalId 
              ? { ...subGoal, completed: !subGoal.completed }
              : subGoal
          )
        };
      }
      return goal;
    }));

    // Update selected goal if it's the one being viewed
    if (selectedGoal && selectedGoal.id === goalId) {
      setSelectedGoal({
        ...selectedGoal,
        subGoals: selectedGoal.subGoals.map(subGoal => 
          subGoal.id === subGoalId 
            ? { ...subGoal, completed: !subGoal.completed }
            : subGoal
        )
      });
    }
  };

  // Calculate status based on progress
  const calculateStatusBasedOnProgress = (progress: number): GoalStatus => {
    if (progress >= 100) return 'complete';
    if (progress >= 75) return 'on-track';
    if (progress >= 50) return 'at-risk';
    return 'off-track';
  };

  // Reset new goal form
  const resetNewGoalForm = () => {
    setNewGoal({
      title: '',
      description: '',
      status: 'not-started',
      priority: 'medium',
      type: 'quantitative',
      dueDate: new Date(),
      progress: 0,
      subGoals: []
    });
  };

  // Get status color class
  const getStatusColor = (status: GoalStatus) => {
    switch (status) {
      case 'on-track': return 'bg-green-100 text-green-800';
      case 'at-risk': return 'bg-yellow-100 text-yellow-800';
      case 'off-track': return 'bg-red-100 text-red-800';
      case 'complete': return 'bg-blue-100 text-blue-800';
      case 'not-started': return 'bg-gray-100 text-gray-800';
    }
  };

  // Get priority color class
  const getPriorityColor = (priority: GoalPriority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
    }
  };

  // Get priority icon
  const getPriorityIcon = (priority: GoalPriority) => {
    switch (priority) {
      case 'high': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'medium': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'low': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    }
  };

  // Get status icon
  const getStatusIcon = (status: GoalStatus) => {
    switch (status) {
      case 'on-track': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'at-risk': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'off-track': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'complete': return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
      case 'not-started': return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50" >
      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Goals</h1>
            <p className="text-sm text-gray-500">Track and manage your team's objectives</p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            <Plus className="h-5 w-5" />
            New Goal
          </button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search goals..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <select
                className="appearance-none bg-white pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as GoalStatus | 'all')}
              >
                <option value="all">All Statuses</option>
                <option value="not-started">Not Started</option>
                <option value="on-track">On Track</option>
                <option value="at-risk">At Risk</option>
                <option value="off-track">Off Track</option>
                <option value="complete">Complete</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            <div className="relative">
              <select
                className="appearance-none bg-white pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as GoalPriority | 'all')}
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            <div className="relative">
              <select
                className="appearance-none bg-white pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as GoalType | 'all')}
              >
                <option value="all">All Types</option>
                <option value="quantitative">Quantitative</option>
                <option value="boolean">Boolean</option>
                <option value="milestone">Milestone</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Goals List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          {/* Table Header */}
          <div className="grid grid-cols-12 bg-gray-50 px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
            <div className="col-span-5">Goal</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Progress</div>
            <div className="col-span-2">Due Date</div>
            <div className="col-span-1"></div>
          </div>

          {/* Goals */}
          {filteredGoals.length === 0 ? (
            <div className="text-center py-12 bg-white">
              <Target className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No goals found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' || typeFilter !== 'all'
                  ? "Try adjusting your search or filters" 
                  : "Create a new goal to get started"}
              </p>
            </div>
          ) : (
            filteredGoals.map((goal) => (
              <div 
                key={goal.id} 
                className="grid grid-cols-12 items-center px-6 py-4 hover:bg-gray-50 border-b border-gray-100 last:border-0 cursor-pointer transition-colors"
                onClick={() => openGoalDrawer(goal)}
              >
                {/* Goal Title and Description */}
                <div className="col-span-5">
                  <div className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full flex-shrink-0 ${
                      goal.priority === 'high' ? 'bg-red-500' :
                      goal.priority === 'medium' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}></div>
                    <div>
                      <h3 className="font-medium text-gray-900 flex items-center gap-2">
                        {goal.title}
                        {goal.type === 'milestone' && <Flag className="h-4 w-4 text-blue-500" />}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">{goal.description}</p>
                      <div className="flex gap-2 mt-2">
                        {goal.tags?.map(tag => (
                          <span key={tag} className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(goal.status)}
                    <span className={`text-xs font-medium ${getStatusColor(goal.status)} px-2 py-1 rounded-full`}>
                      {goal.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>

                {/* Progress */}
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          goal.progress < 50 ? 'bg-red-500' :
                          goal.progress < 75 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`} 
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600">{goal.progress}%</span>
                  </div>
                </div>

                {/* Due Date */}
                <div className="col-span-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {new Date(goal.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    {new Date(goal.dueDate).getFullYear() !== new Date().getFullYear() && (
                      <span>, {new Date(goal.dueDate).getFullYear()}</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="col-span-1 flex justify-end">
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Goal Detail Drawer */}
      {isGoalDrawerOpen && selectedGoal && (
        <div className="fixed inset-0 overflow-hidden z-50 bg-[rgba(0,0,0,0.4)]">
          <div className="absolute inset-0 overflow-hidden">
            <div 
              className="absolute inset-0 " 
              onClick={() => setIsGoalDrawerOpen(false)}
            ></div>
            <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
              <div className="w-screen max-w-2xl">
                <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                  <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <h2 className="text-lg font-medium text-gray-900">{selectedGoal.title}</h2>
                      <div className="ml-3 h-7 flex items-center">
                        <button
                          type="button"
                          className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onClick={() => setIsGoalDrawerOpen(false)}
                        >
                          <span className="sr-only">Close panel</span>
                          <X className="h-6 w-6" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-6">
                      {/* Goal Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`h-4 w-4 rounded-full ${
                            selectedGoal.priority === 'high' ? 'bg-red-500' :
                            selectedGoal.priority === 'medium' ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}></div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(selectedGoal.status)}
                            <span className={`text-xs font-medium ${getStatusColor(selectedGoal.status)} px-2 py-1 rounded-full`}>
                              {selectedGoal.status.replace('-', ' ')}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <UserCircle className="h-4 w-4" />
                          <span>{selectedGoal.owner.name}</span>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="mt-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-700">Progress</span>
                          <span className="text-sm font-medium text-gray-700">{selectedGoal.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${
                              selectedGoal.progress < 50 ? 'bg-red-500' :
                              selectedGoal.progress < 75 ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`} 
                            style={{ width: `${selectedGoal.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Dates */}
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-xs text-gray-500 mb-1">Start Date</div>
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            {selectedGoal.startDate 
                              ? new Date(selectedGoal.startDate).toLocaleDateString() 
                              : 'Not set'}
                          </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-xs text-gray-500 mb-1">Due Date</div>
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            {new Date(selectedGoal.dueDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="mt-6">
                        <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
                        <p className="text-sm text-gray-600">
                          {selectedGoal.description || 'No description provided'}
                        </p>
                      </div>

                      {/* Sub Goals */}
                      <div className="mt-6">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex justify-between items-center mb-3">
                          {/* <h3 className="text-sm font-medium text-gray-900">Sub Goals</h3> */}
                          <button 
                            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                            onClick={() => setIsAddingSubGoal(!isAddingSubGoal)}
                          >
                            <Plus className="h-4 w-4" />
                            {isAddingSubGoal ? 'Cancel' : 'Add Sub Goal'}
                          </button>
                        </div>
                        
                        {isAddingSubGoal && (
                          <div className="flex items-center gap-2 mb-3">
                            <input 
                              type="text" 
                              placeholder="Enter sub goal title"  
                              className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={subGoalTitle}
                              onChange={(e) => setSubGoalTitle(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && subGoalTitle.trim()) {
                                  addSubGoal(selectedGoal.id, subGoalTitle.trim());
                                  setSubGoalTitle('');
                                  setIsAddingSubGoal(false);
                                }
                              }}
                            />
                            <button
                              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                              onClick={() => {
                                if (subGoalTitle.trim()) {
                                  addSubGoal(selectedGoal.id, subGoalTitle.trim());
                                  setSubGoalTitle('');
                                  setIsAddingSubGoal(false);
                                }
                              }}
                              disabled={!subGoalTitle.trim()}
                            >
                              Add
                            </button>
                          </div>
                        )}
                      
                      
                        </div>
                        
                        {selectedGoal.subGoals.length === 0 ? (
                          <div className="text-center py-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-500">No sub goals yet</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {selectedGoal.subGoals.map((subGoal) => (
                              <div 
                                key={subGoal.id} 
                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                              >
                                <input
                                  type="checkbox"
                                  checked={subGoal.completed}
                                  onChange={() => toggleSubGoalCompletion(selectedGoal.id, subGoal.id)}
                                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                />
                                <span className={`text-sm flex-1 ${subGoal.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                                  {subGoal.title}
                                </span>
                                {subGoal.dueDate && (
                                  <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(subGoal.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="mt-6 grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-xs text-gray-500 mb-1">Type</div>
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            {selectedGoal.type === 'quantitative' ? <Gauge className="h-4 w-4" /> : 
                             selectedGoal.type === 'boolean' ? <Check className="h-4 w-4" /> : 
                             <Flag className="h-4 w-4" />}
                            <span className="capitalize">{selectedGoal.type}</span>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-xs text-gray-500 mb-1">Priority</div>
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            {getPriorityIcon(selectedGoal.priority)}
                            <span className="capitalize">{selectedGoal.priority}</span>
                          </div>
                        </div>
                      </div>

                      {/* Tags */}
                      {selectedGoal.tags && selectedGoal.tags.length > 0 && (
                        <div className="mt-6">
                          <h3 className="text-sm font-medium text-gray-900 mb-2">Tags</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedGoal.tags.map(tag => (
                              <span key={tag} className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={() => setIsGoalDrawerOpen(false)}
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

      {/* Create Goal Modal */}
      {isCreateModalOpen && (
  <div className="fixed z-50 inset-0 overflow-y-auto bg-[rgba(0,0,0,0.4)] bg-opacity-40">
    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
 

      {/* Modal container */}
      <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              {/* Modal header */}
              <div className="flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Create New Goal</h3>
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  <span className="sr-only">Close</span>
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              {/* Form content */}
              <div className="mt-6 space-y-6">
                {/* Goal Title */}
                <div>
                  <label htmlFor="goal-title" className="block text-sm font-medium text-gray-700">
                    Goal Title*
                  </label>
                  <input
                    type="text"
                    id="goal-title"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="What do you want to achieve?"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                  />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="goal-description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="goal-description"
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Add more details about your goal..."
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                  />
                </div>

                {/* Settings grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Status */}
                  <div>
                    <label htmlFor="goal-status" className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      id="goal-status"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newGoal.status}
                      onChange={(e) => setNewGoal({...newGoal, status: e.target.value as GoalStatus})}
                    >
                      <option value="not-started">Not Started</option>
                      <option value="on-track">On Track</option>
                      <option value="at-risk">At Risk</option>
                      <option value="off-track">Off Track</option>
                      <option value="complete">Complete</option>
                    </select>
                  </div>

                  {/* Priority */}
                  <div>
                    <label htmlFor="goal-priority" className="block text-sm font-medium text-gray-700">
                      Priority
                    </label>
                    <select
                      id="goal-priority"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newGoal.priority}
                      onChange={(e) => setNewGoal({...newGoal, priority: e.target.value as GoalPriority})}
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>

                  {/* Type */}
                  <div>
                    <label htmlFor="goal-type" className="block text-sm font-medium text-gray-700">
                      Type
                    </label>
                    <select
                      id="goal-type"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newGoal.type}
                      onChange={(e) => setNewGoal({...newGoal, type: e.target.value as GoalType})}
                    >
                      <option value="quantitative">Quantitative</option>
                      <option value="boolean">Boolean</option>
                      <option value="milestone">Milestone</option>
                    </select>
                  </div>

                  {/* Progress */}
                  <div>
                    <label htmlFor="goal-progress" className="block text-sm font-medium text-gray-700">
                      Progress
                    </label>
                    <div className="flex items-center gap-3 mt-1">
                      <input
                        type="range"
                        id="goal-progress"
                        min="0"
                        max="100"
                        className="flex-1"
                        value={newGoal.progress || 0}
                        onChange={(e) => setNewGoal({...newGoal, progress: parseInt(e.target.value)})}
                      />
                      <span className="text-sm font-medium text-gray-700 w-12 text-right">
                        {newGoal.progress || 0}%
                      </span>
                    </div>
                  </div>

                  {/* Start Date */}
                  <div>
                    <label htmlFor="goal-start-date" className="block text-sm font-medium text-gray-700">
                      Start Date
                    </label>
                    <input
                      type="date"
                      id="goal-start-date"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newGoal.startDate ? new Date(newGoal.startDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => setNewGoal({...newGoal, startDate: new Date(e.target.value)})}
                    />
                  </div>

                  {/* Due Date */}
                  <div>
                    <label htmlFor="goal-due-date" className="block text-sm font-medium text-gray-700">
                      Due Date*
                    </label>
                    <input
                      type="date"
                      id="goal-due-date"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newGoal.dueDate ? new Date(newGoal.dueDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => setNewGoal({...newGoal, dueDate: new Date(e.target.value)})}
                      required
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label htmlFor="goal-tags" className="block text-sm font-medium text-gray-700">
                    Tags
                  </label>
                  <input
                    type="text"
                    id="goal-tags"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Add tags separated by commas"
                    onChange={(e) => {
                      const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
                      setNewGoal({...newGoal, tags});
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Modal footer */}
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={handleCreateGoal}
            disabled={!newGoal.title || !newGoal.dueDate}
          >
            Create Goal
          </button>
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={() => setIsCreateModalOpen(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

// Sample data
const sampleGoals: Goal[] = [
  {
    id: 'goal-1',
    title: 'Increase monthly recurring revenue',
    description: 'Grow MRR by 20% through new customer acquisition and expansion',
    status: 'on-track',
    priority: 'high',
    type: 'quantitative',
    dueDate: new Date('2023-12-31'),
    startDate: new Date('2023-01-01'),
    owner: {
      id: 'user-1',
      name: 'Alex Johnson',
      avatar: ''
    },
    progress: 75,
    subGoals: [
      {
        id: 'subgoal-1',
        title: 'Launch new pricing tiers',
        completed: true,
        dueDate: new Date('2023-03-15')
      },
      {
        id: 'subgoal-2',
        title: 'Implement referral program',
        completed: true,
        dueDate: new Date('2023-06-30')
      },
      {
        id: 'subgoal-3',
        title: 'Add 3 new enterprise clients',
        completed: false,
        dueDate: new Date('2023-11-30')
      }
    ],
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-08-20'),
    tags: ['revenue', 'growth'],
    followers: ['user-2', 'user-3'],
    attachments: ['mrr_plan.pdf'],
    comments: [
      {
        id: 'comment-1',
        author: 'Sarah Williams',
        text: 'We should focus on upsell opportunities with existing customers',
        createdAt: new Date('2023-02-15')
      }
    ]
  },
  {
    id: 'goal-2',
    title: 'Redesign mobile app',
    description: 'Complete UI/UX overhaul of mobile application',
    status: 'at-risk',
    priority: 'medium',
    type: 'milestone',
    dueDate: new Date('2023-10-15'),
    startDate: new Date('2023-05-01'),
    owner: {
      id: 'user-2',
      name: 'Sarah Williams',
      avatar: ''
    },
    progress: 60,
    subGoals: [
      {
        id: 'subgoal-4',
        title: 'Complete user research',
        completed: true,
        dueDate: new Date('2023-05-30')
      },
      {
        id: 'subgoal-5',
        title: 'Finalize wireframes',
        completed: true,
        dueDate: new Date('2023-06-15')
      },
      {
        id: 'subgoal-6',
        title: 'Develop beta version',
        completed: false,
        dueDate: new Date('2023-09-30')
      }
    ],
    createdAt: new Date('2023-04-15'),
    updatedAt: new Date('2023-08-18'),
    tags: ['mobile', 'design'],
    followers: ['user-1', 'user-4'],
    attachments: ['wireframes.sketch'],
    comments: [
      {
        id: 'comment-2',
        author: 'Michael Chen',
        text: 'We need to consider dark mode support',
        createdAt: new Date('2023-06-10')
      }
    ]
  },
  {
    id: 'goal-3',
    title: 'Improve customer support metrics',
    description: 'Achieve 90%+ customer satisfaction rating',
    status: 'off-track',
    priority: 'high',
    type: 'quantitative',
    dueDate: new Date('2023-09-30'),
    startDate: new Date('2023-03-01'),
    owner: {
      id: 'user-3',
      name: 'Michael Chen',
      avatar: ''
    },
    progress: 40,
    subGoals: [
      {
        id: 'subgoal-7',
        title: 'Implement new support ticketing system',
        completed: true,
        dueDate: new Date('2023-04-30')
      },
      {
        id: 'subgoal-8',
        title: 'Train support team on new processes',
        completed: false,
        dueDate: new Date('2023-06-15')
      },
      {
        id: 'subgoal-9',
        title: 'Reduce first response time to under 2 hours',
        completed: false,
        dueDate: new Date('2023-08-31')
      }
    ],
    createdAt: new Date('2023-02-28'),
    updatedAt: new Date('2023-08-15'),
    tags: ['support', 'customers'],
    followers: ['user-2', 'user-5'],
    attachments: ['support_metrics.xlsx'],
    comments: [
      {
        id: 'comment-3',
        author: 'Alex Johnson',
        text: 'Have we considered adding chat support?',
        createdAt: new Date('2023-05-22')
      }
    ]
  },
  {
    id: 'goal-4',
    title: 'Launch new marketing campaign',
    description: 'Q4 holiday marketing campaign across all channels',
    status: 'not-started',
    priority: 'medium',
    type: 'milestone',
    dueDate: new Date('2023-11-15'),
    startDate: new Date('2023-09-01'),
    owner: {
      id: 'user-4',
      name: 'Emily Davis',
      avatar: ''
    },
    progress: 0,
    subGoals: [
      {
        id: 'subgoal-10',
        title: 'Develop campaign strategy',
        completed: false,
        dueDate: new Date('2023-08-31')
      },
      {
        id: 'subgoal-11',
        title: 'Create marketing assets',
        completed: false,
        dueDate: new Date('2023-09-30')
      }
    ],
    createdAt: new Date('2023-07-15'),
    updatedAt: new Date('2023-07-15'),
    tags: ['marketing', 'Q4'],
    followers: ['user-1', 'user-3']
  },
  {
    id: 'goal-5',
    title: 'Migrate to new database infrastructure',
    description: 'Complete migration to PostgreSQL with zero downtime',
    status: 'complete',
    priority: 'high',
    type: 'boolean',
    dueDate: new Date('2023-07-31'),
    startDate: new Date('2023-04-01'),
    owner: {
      id: 'user-5',
      name: 'David Wilson',
      avatar: ''
    },
    progress: 100,
    subGoals: [
      {
        id: 'subgoal-12',
        title: 'Set up staging environment',
        completed: true,
        dueDate: new Date('2023-05-15')
      },
      {
        id: 'subgoal-13',
        title: 'Perform load testing',
        completed: true,
        dueDate: new Date('2023-06-30')
      },
      {
        id: 'subgoal-14',
        title: 'Execute production migration',
        completed: true,
        dueDate: new Date('2023-07-15')
      }
    ],
    createdAt: new Date('2023-03-20'),
    updatedAt: new Date('2023-07-20'),
    tags: ['engineering', 'infrastructure'],
    followers: ['user-1', 'user-2', 'user-3'],
    comments: [
      {
        id: 'comment-4',
        author: 'Alex Johnson',
        text: 'Great work on completing this ahead of schedule!',
        createdAt: new Date('2023-07-18')
      }
    ]
  }
];

export default Goals;