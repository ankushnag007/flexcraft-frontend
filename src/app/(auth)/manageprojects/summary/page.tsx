"use client"
import { AlignEndVertical, BarChart2, MoreHorizontal } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from 'recharts';

const DEMO_MEMBERS = [
  { id: 1, name: 'John Doe', email: 'john@example.com', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', avatar: 'https://i.pravatar.cc/150?img=3' },
  { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', avatar: 'https://i.pravatar.cc/150?img=4' },
  { id: 5, name: 'David Brown', email: 'david@example.com', avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: 6, name: 'Emily Davis', email: 'emily@example.com', avatar: 'https://i.pravatar.cc/150?img=6' },
  { id: 7, name: 'Robert Wilson', email: 'robert@example.com', avatar: 'https://i.pravatar.cc/150?img=7' },
];

const TASK_STATUSES = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  done: 'Completed'
};

const tasks = [
  { id: 1, title: 'Design Homepage', status: 'done', project: 'Website Redesign', dueDate: '2023-06-15' },
  { id: 2, title: 'API Integration', status: 'in-progress', project: 'Mobile App', dueDate: '2023-06-20' },
  { id: 3, title: 'User Testing', status: 'todo', project: 'Website Redesign', dueDate: '2023-06-25' },
  { id: 4, title: 'Content Migration', status: 'in-progress', project: 'CMS Update', dueDate: '2023-06-18' },
  { id: 5, title: 'SEO Optimization', status: 'done', project: 'Website Redesign', dueDate: '2023-06-10' },
  { id: 6, title: 'Bug Fixes', status: 'in-progress', project: 'Mobile App', dueDate: '2023-06-22' },
  { id: 7, title: 'Performance Testing', status: 'todo', project: 'Mobile App', dueDate: '2023-06-28' },
];

const ACTIVITIES = [
  {
    id: 1,
    type: 'update',
    user: DEMO_MEMBERS[1],
    target: 'Document',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    details: 'Updated project requirements document'
  },
  {
    id: 2,
    type: 'complete',
    user: DEMO_MEMBERS[3],
    target: 'Task: Design Homepage',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    details: 'Marked task as completed'
  },
  {
    id: 3,
    type: 'comment',
    user: DEMO_MEMBERS[0],
    target: 'Task: API Integration',
    timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000), // 26 hours ago
    details: 'Added comment: "Need clarification on endpoint specs"'
  },
  {
    id: 4,
    type: 'create',
    user: DEMO_MEMBERS[2],
    target: 'Task: Performance Testing',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    details: 'Created new task'
  },
  {
    id: 5,
    type: 'status',
    user: DEMO_MEMBERS[4],
    target: 'Task: Content Migration',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    details: 'Changed status from "To Do" to "In Progress"'
  }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const SummaryComponent = () => {
   const [date, setDate] = useState('');

  useEffect(() => {
    setDate(new Date().toLocaleDateString());
  }, []);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeReport, setActiveReport] = useState('overview');
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [editTimeline, setEditTimeline] = useState(false);
  const [timelineData, setTimelineData] = useState({
    startDate: '2023-05-15',
    dueDate: '2023-08-30'
  });

  // Data for charts
  const taskStatusData = [
    { name: 'Completed', value: tasks.filter(t => t.status === 'done').length },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'in-progress').length },
    { name: 'To Do', value: tasks.filter(t => t.status === 'todo').length },
  ];

  const projectDistributionData = tasks.reduce((acc, task) => {
    const existing = acc.find(item => item.name === task.project);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: task.project, value: 1 });
    }
    return acc;
  }, []);

  const weeklyTimelineData = [
    { name: 'Week 1', completed: 2, inProgress: 1 },
    { name: 'Week 2', completed: 3, inProgress: 2 },
    { name: 'Week 3', completed: 5, inProgress: 3 },
    { name: 'Week 4', completed: 7, inProgress: 2 },
    { name: 'Week 5', completed: 8, inProgress: 1 },
  ];

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleTimelineChange = (e) => {
    const { name, value } = e.target;
    setTimelineData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveTimelineChanges = () => {
    setEditTimeline(false);
    // In a real app, you would save to API here
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
      }
    }
    
    return 'Just now';
  };

  const getActivityIcon = (type) => {
    switch(type) {
      case 'update':
        return (
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        );
      case 'complete':
        return (
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'comment':
        return (
          <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      case 'create':
        return (
          <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        );
      case 'status':
        return (
          <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const renderReportContent = () => {
    switch (activeReport) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Task Completion Overview</h3>
              <div className="bg-white p-4 rounded-lg border border-gray-100 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyTimelineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completed" fill="#4ade80" name="Completed" />
                    <Bar dataKey="inProgress" fill="#fbbf24" name="In Progress" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Task Status Distribution</h3>
                <div className="bg-white p-4 rounded-lg border border-gray-100 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={taskStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {taskStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Project Task Distribution</h3>
                <div className="bg-white p-4 rounded-lg border border-gray-100 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={projectDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {projectDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        );
      case 'performance':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Team Performance</h3>
              <div className="bg-white p-4 rounded-lg border border-gray-100 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'John', completed: 12, inProgress: 3 },
                      { name: 'Jane', completed: 8, inProgress: 2 },
                      { name: 'Mike', completed: 6, inProgress: 4 },
                      { name: 'Sarah', completed: 9, inProgress: 1 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completed" fill="#4ade80" name="Completed" />
                    <Bar dataKey="inProgress" fill="#fbbf24" name="In Progress" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Completion Trend</h3>
              <div className="bg-white p-4 rounded-lg border border-gray-100 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyTimelineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="completed" stroke="#4ade80" name="Completed" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
      default:
        return <div>Select a report</div>;
    }
  };

  return (
    <div className="relative">
      {/* Main Summary Component */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6 hover:shadow-md transition-all duration-200">
        {/* Header with icon and action button */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
              <div>
                <h3 className="font-medium text-lg text-gray-800">
                  Project Dashboard
                </h3>
                <p className="text-sm text-gray-500">
                  Last updated: {date}
                </p>
              </div>
          </div>
      
                  <div className="mt-6 flex justify-end gap-2">
      <button 
            onClick={toggleDrawer}
            className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md flex items-center transition-colors"
          >
            <BarChart2 className="w-4 h-4 mr-1" />
            View Report
          </button>
          <button className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md flex items-center transition-colors">
           <MoreHorizontal className="w-4 h-4 mr-1" />
            More
          </button>
        </div>
        </div>

        {/* Main metrics grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Task Status Cards */}
          <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-xs hover:shadow-sm transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Total Tasks</p>
              <div className="w-3 h-3 rounded-full bg-blue-400"></div>
            </div>
            <p className="text-2xl font-semibold text-gray-800 mb-1">
              {tasks.length}
            </p>
            <p className="text-xs text-gray-400">Across all projects</p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-xs hover:shadow-sm transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Completed</p>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <p className="text-2xl font-semibold text-gray-800 mb-1">
              {tasks.filter((t) => t.status === "done").length}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-green-500 h-1.5 rounded-full"
                style={{
                  width: `${Math.round(
                    (tasks.filter((t) => t.status === "done").length /
                      tasks.length) *
                      100
                  )}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-xs hover:shadow-sm transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">In Progress</p>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            </div>
            <p className="text-2xl font-semibold text-gray-800 mb-1">
              {tasks.filter((t) => t.status === "in-progress").length}
            </p>
            <p className="text-xs text-gray-400">
              {tasks.filter((t) => t.status === "in-progress").length}{" "}
              active tasks
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-xs hover:shadow-sm transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Overdue</p>
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
            </div>
            <p className="text-2xl font-semibold text-gray-800 mb-1">2</p>
            <p className="text-xs text-gray-400">2 days past deadline</p>
          </div>
        </div>

        {/* Additional project details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Project Members */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-700">Team Members</h4>
              <button 
                onClick={() => setShowAllMembers(!showAllMembers)}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                {showAllMembers ? 'Show less' : 'View all'}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(showAllMembers ? DEMO_MEMBERS : DEMO_MEMBERS.slice(0, 6)).map((member) => (
                <div
                  key={member.id}
                  className="flex items-center bg-white p-1 pr-2 rounded-full border border-gray-200 shadow-xs hover:border-blue-200 transition-all"
                  title={`${member.name} (${member.email})`}
                >
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-6 h-6 rounded-full mr-1"
                  />
                  <span className="text-xs text-gray-700 truncate max-w-[80px]">
                    {member.name.split(' ')[0]}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 text-xs text-gray-500">
              {DEMO_MEMBERS.length} people working on this project
            </div>
          </div>

          {/* Project Timeline */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-700">
                Project Timeline
              </h4>
              {editTimeline ? (
                <button 
                  onClick={saveTimelineChanges}
                  className="text-xs text-green-600 hover:text-green-800"
                >
                  Save
                </button>
              ) : (
                <button 
                  onClick={() => setEditTimeline(true)}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>
                <div>
                  <p className="text-sm text-gray-700">Start Date</p>
                  {editTimeline ? (
                    <input
                      type="date"
                      name="startDate"
                      value={timelineData.startDate}
                      onChange={handleTimelineChange}
                      className="text-xs border border-gray-300 rounded p-1"
                    />
                  ) : (
                    <p className="text-xs text-gray-500">
                      {formatDate(timelineData.startDate)}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-purple-400 mr-2"></div>
                <div>
                  <p className="text-sm text-gray-700">Due Date</p>
                  {editTimeline ? (
                    <input
                      type="date"
                      name="dueDate"
                      value={timelineData.dueDate}
                      onChange={handleTimelineChange}
                      className="text-xs border border-gray-300 rounded p-1"
                    />
                  ) : (
                    <p className="text-xs text-gray-500">
                      {formatDate(timelineData.dueDate)}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
                <div>
                  <p className="text-sm text-gray-700">Days Remaining</p>
                  <p className="text-xs text-gray-500">
                    42 days (23% completed)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-700">Recent Activity</h4>
              <button 
                onClick={() => setShowAllActivities(!showAllActivities)}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                {showAllActivities ? 'Show less' : 'View all'}
              </button>
            </div>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {(showAllActivities ? ACTIVITIES : ACTIVITIES.slice(0, 2)).map(activity => (
                <div key={activity.id} className="flex items-start">
                  <div className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center mr-2 flex-shrink-0">
                    <img 
                      src={activity.user.avatar} 
                      alt={activity.user.name} 
                      className="w-5 h-5 rounded-full"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-700">{activity.user.name}</p>
                      <p className="text-xs text-gray-500">{formatTimeAgo(activity.timestamp)}</p>
                    </div>
                    <div className="flex items-start mt-1">
                      <div className="mt-1 mr-2">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">
                          <span className="font-medium">{activity.target}</span> - {activity.details}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to action */}

      </div>

      {/* Report Drawer */}
      <div className={`fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col">
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Project Analytics Report</h2>
            <button 
              onClick={toggleDrawer}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Report Navigation */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveReport('overview')}
              className={`px-6 py-3 text-sm font-medium ${activeReport === 'overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveReport('performance')}
              className={`px-6 py-3 text-sm font-medium ${activeReport === 'performance' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
            >
              Team Performance
            </button>
          </div>
          
          {/* Report Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {renderReportContent()}
          </div>
          
          {/* Drawer Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
            <button
              onClick={toggleDrawer}
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-gray-100"
            >
              Close
            </button>
          </div>
        </div>
      </div>
      
      {/* Overlay */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-[rgba(0,0,0,0.4)] bg-opacity-40 z-40"
          onClick={toggleDrawer}
        ></div>
      )}
    </div>
  );
};

export default SummaryComponent;