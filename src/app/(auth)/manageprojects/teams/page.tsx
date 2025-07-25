"use client"
import React, { useState } from 'react';
import {
  Users,
  Plus,
  ChevronRight,
  Settings,
  FileText,
  CheckCircle,
  MoreVertical,
  Search,
  Paperclip,
  MessageSquare,
  Calendar,
  Tag,
  X
} from 'lucide-react';

interface Team {
  id: string;
  name: string;
  icon: string;
  color: string;
  members: Member[];
  tasks: Task[];
  documents: Document[];
}

interface Member {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  email: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  dueDate: Date;
  assignedTo: string; // member id
  priority: 'low' | 'medium' | 'high';
}

interface Document {
  id: string;
  name: string;
  type: string;
  uploadedBy: string; // member id
  uploadedAt: Date;
  size: string;
}

const TeamsManagement: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([
    {
      id: '1',
      name: 'Development',
      icon: '💻',
      color: 'blue',
      members: [
        { id: '1', name: 'John Doe', role: 'Frontend Developer', email: 'john@example.com' },
        { id: '2', name: 'Jane Smith', role: 'Backend Developer', email: 'jane@example.com' },
        { id: '3', name: 'Mike Johnson', role: 'DevOps Engineer', email: 'mike@example.com' },
      ],
      tasks: [
        {
          id: '1',
          title: 'Implement user authentication',
          description: 'Set up JWT authentication for API',
          status: 'in-progress',
          dueDate: new Date('2023-09-30'),
          assignedTo: '1',
          priority: 'high'
        },
        {
          id: '2',
          title: 'Fix mobile layout issues',
          description: 'Address responsive design problems',
          status: 'todo',
          dueDate: new Date('2023-09-25'),
          assignedTo: '2',
          priority: 'medium'
        }
      ],
      documents: [
        {
          id: '1',
          name: 'API Documentation.pdf',
          type: 'pdf',
          uploadedBy: '1',
          uploadedAt: new Date('2023-08-15'),
          size: '2.4 MB'
        }
      ]
    },
    {
      id: '2',
      name: 'Design',
      icon: '🎨',
      color: 'purple',
      members: [
        { id: '4', name: 'Sarah Williams', role: 'UI Designer', email: 'sarah@example.com' },
        { id: '5', name: 'Alex Chen', role: 'UX Designer', email: 'alex@example.com' },
      ],
      tasks: [
        {
          id: '3',
          title: 'Create dashboard mockups',
          description: 'Design new admin dashboard',
          status: 'completed',
          dueDate: new Date('2023-09-20'),
          assignedTo: '4',
          priority: 'high'
        }
      ],
      documents: [
        {
          id: '2',
          name: 'Style Guide.sketch',
          type: 'sketch',
          uploadedBy: '4',
          uploadedAt: new Date('2023-08-10'),
          size: '5.1 MB'
        }
      ]
    },
    {
      id: '3',
      name: 'Product',
      icon: '📊',
      color: 'green',
      members: [
        { id: '6', name: 'Emily Davis', role: 'Product Manager', email: 'emily@example.com' },
        { id: '7', name: 'Robert Brown', role: 'Business Analyst', email: 'robert@example.com' },
      ],
      tasks: [
        {
          id: '4',
          title: 'Competitor analysis',
          description: 'Research competitor features',
          status: 'in-progress',
          dueDate: new Date('2023-10-05'),
          assignedTo: '6',
          priority: 'medium'
        }
      ],
      documents: [
        {
          id: '3',
          name: 'Product Roadmap.xlsx',
          type: 'excel',
          uploadedBy: '6',
          uploadedAt: new Date('2023-08-01'),
          size: '1.8 MB'
        }
      ]
    }
  ]);

  const [activeTab, setActiveTab] = useState<'members' | 'tasks' | 'documents'>('members');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isUploadDocModalOpen, setIsUploadDocModalOpen] = useState(false);
  const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // New team/member/task/document states
  const [newTeam, setNewTeam] = useState({
    name: '',
    color: 'blue',
    icon: '💻'
  });
  const [newMember, setNewMember] = useState<Omit<Member, 'id'>>({ name: '', role: '', email: '' });
  const [newTask, setNewTask] = useState<Omit<Task, 'id'>>({
    title: '',
    description: '',
    status: 'todo',
    dueDate: new Date(),
    assignedTo: '',
    priority: 'medium'
  });
  const [newDocument, setNewDocument] = useState<Omit<Document, 'id' | 'uploadedBy' | 'uploadedAt'>>({
    name: '',
    type: '',
    size: ''
  });

  const colors = [
    { name: 'blue', bg: 'bg-blue-100', text: 'text-blue-800' },
    { name: 'purple', bg: 'bg-purple-100', text: 'text-purple-800' },
    { name: 'green', bg: 'bg-green-100', text: 'text-green-800' },
    { name: 'red', bg: 'bg-red-100', text: 'text-red-800' },
    { name: 'yellow', bg: 'bg-yellow-100', text: 'text-yellow-800' },
    { name: 'indigo', bg: 'bg-indigo-100', text: 'text-indigo-800' },
  ];

  const icons = [
    '💻', '🎨', '📊', '🔧', '📝', '📚', 
    '📱', '🖥️', '🔍', '📈', '🧩', '⚙️'
  ];

  const handleAddTeam = () => {
    if (!newTeam.name) return;

    const team: Team = {
      id: `team-${Date.now()}`,
      name: newTeam.name,
      icon: newTeam.icon,
      color: newTeam.color,
      members: [],
      tasks: [],
      documents: []
    };

    setTeams([...teams, team]);
    setNewTeam({ name: '', color: 'blue', icon: '💻' });
    setIsAddTeamModalOpen(false);
  };

  const handleAddMember = (teamId: string) => {
    const newMemberWithId = { ...newMember, id: `member-${Date.now()}` };
    setTeams(teams.map(team => 
      team.id === teamId 
        ? { ...team, members: [...team.members, newMemberWithId] } 
        : team
    ));
    setIsAddMemberModalOpen(false);
    setNewMember({ name: '', role: '', email: '' });
  };

  const handleAddTask = (teamId: string) => {
    const newTaskWithId = { ...newTask, id: `task-${Date.now()}` };
    setTeams(teams.map(team => 
      team.id === teamId 
        ? { ...team, tasks: [...team.tasks, newTaskWithId] } 
        : team
    ));
    setIsAddTaskModalOpen(false);
    setNewTask({
      title: '',
      description: '',
      status: 'todo',
      dueDate: new Date(),
      assignedTo: '',
      priority: 'medium'
    });
  };

  const handleUploadDocument = (teamId: string) => {
    const newDocWithId = { 
      ...newDocument, 
      id: `doc-${Date.now()}`,
      uploadedBy: 'current-user-id',
      uploadedAt: new Date()
    };
    setTeams(teams.map(team => 
      team.id === teamId 
        ? { ...team, documents: [...team.documents, newDocWithId] } 
        : team
    ));
    setIsUploadDocModalOpen(false);
    setNewDocument({ name: '', type: '', size: '' });
  };

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.members.some(member => member.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Users className="w-6 h-6 text-gray-700 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">Teams Management</h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search teams or members..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsAddTeamModalOpen(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-1" />
            New Team
          </button>
        </div>
      </div>

      {/* Team Cards */}
      {!selectedTeam ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filteredTeams.map((team) => (
            <div 
              key={team.id} 
              className={`border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow duration-200 cursor-pointer`}
              onClick={() => setSelectedTeam(team)}
            >
              <div className="flex items-center mb-4">
                <div className={`w-10 h-10 rounded-lg bg-${team.color}-100 flex items-center justify-center mr-3`}>
                  <span className="text-xl">{team.icon}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{team.name}</h3>
                  <p className="text-sm text-gray-500">{team.members.length} members</p>
                </div>
                <ChevronRight className="ml-auto text-gray-400" />
              </div>
              <div className="flex justify-between text-sm text-gray-500 mb-3">
                <span>{team.tasks.length} tasks</span>
                <span>{team.documents.length} documents</span>
              </div>
              <div className="flex -space-x-2">
                {team.members.slice(0, 5).map((member) => (
                  <div 
                    key={member.id} 
                    className={`w-8 h-8 rounded-full bg-gradient-to-r from-${team.color}-400 to-${team.color}-600 flex items-center justify-center text-white font-medium text-xs`}
                  >
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                ))}
                {team.members.length > 5 && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs">
                    +{team.members.length - 5}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          {/* Team Detail Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <button 
                onClick={() => setSelectedTeam(null)}
                className="mr-4 text-gray-500 hover:text-gray-700"
              >
                <ChevronRight className="transform rotate-180" />
              </button>
              <div className={`w-10 h-10 rounded-lg bg-${selectedTeam.color}-100 flex items-center justify-center mr-3`}>
                <span className="text-xl">{selectedTeam.icon}</span>
              </div>
              <h2 className="text-xl font-bold text-gray-800">{selectedTeam.name} Team</h2>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'members' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                onClick={() => setActiveTab('members')}
              >
                Members
              </button>
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'tasks' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                onClick={() => setActiveTab('tasks')}
              >
                Tasks
              </button>
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'documents' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                onClick={() => setActiveTab('documents')}
              >
                Documents
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === 'members' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-gray-900">Team Members ({selectedTeam.members.length})</h3>
                  <button 
                    onClick={() => setIsAddMemberModalOpen(true)}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Member
                  </button>
                </div>
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <ul className="divide-y divide-gray-200">
                    {selectedTeam.members.map((member) => (
                      <li key={member.id} className="px-6 py-4 hover:bg-gray-50">
                        <div className="flex items-center">
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-r from-${selectedTeam.color}-400 to-${selectedTeam.color}-600 flex items-center justify-center text-white font-medium text-xs mr-4`}>
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
                            <p className="text-sm text-gray-500 truncate">{member.role}</p>
                          </div>
                          <div className="text-sm text-gray-500">{member.email}</div>
                          <button className="ml-4 text-gray-400 hover:text-gray-500">
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'tasks' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-gray-900">Team Tasks ({selectedTeam.tasks.length})</h3>
                  <button 
                    onClick={() => setIsAddTaskModalOpen(true)}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Task
                  </button>
                </div>
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Task
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Assigned To
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
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
                      {selectedTeam.tasks.map((task) => {
                        const assignedMember = selectedTeam.members.find(m => m.id === task.assignedTo);
                        return (
                          <tr key={task.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{task.title}</div>
                              <div className="text-sm text-gray-500">{task.description}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {assignedMember && (
                                <div className="flex items-center">
                                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r from-${selectedTeam.color}-400 to-${selectedTeam.color}-600 flex items-center justify-center text-white font-medium text-xs mr-3`}>
                                    {assignedMember.name.split(' ').map(n => n[0]).join('')}
                                  </div>
                                  <span className="text-sm text-gray-900">{assignedMember.name}</span>
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                task.status === 'completed' ? 'bg-green-100 text-green-800' :
                                task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {task.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {task.dueDate.toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                task.priority === 'high' ? 'bg-red-100 text-red-800' :
                                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {task.priority}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-gray-900">Team Documents ({selectedTeam.documents.length})</h3>
                  <button 
                    onClick={() => setIsUploadDocModalOpen(true)}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Upload Document
                  </button>
                </div>
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <ul className="divide-y divide-gray-200">
                    {selectedTeam.documents.map((doc) => {
                      const uploadedByMember = selectedTeam.members.find(m => m.id === doc.uploadedBy);
                      return (
                        <li key={doc.id} className="px-6 py-4 hover:bg-gray-50">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <Paperclip className="w-5 h-5 text-gray-400" />
                            </div>
                            <div className="ml-4 flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                              <p className="text-sm text-gray-500 flex items-center">
                                <span>{doc.type.toUpperCase()}</span>
                                <span className="mx-1">•</span>
                                <span>{doc.size}</span>
                                <span className="mx-1">•</span>
                                {uploadedByMember && (
                                  <span>Uploaded by {uploadedByMember.name}</span>
                                )}
                              </p>
                            </div>
                            <div className="text-sm text-gray-500">
                              {doc.uploadedAt.toLocaleDateString()}
                            </div>
                            <button className="ml-4 text-gray-400 hover:text-gray-500">
                              <MoreVertical className="w-5 h-5" />
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Team Modal */}
      {isAddTeamModalOpen && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center border-b p-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-medium text-gray-900">Create New Team</h3>
              </div>
              <button 
                onClick={() => setIsAddTeamModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label htmlFor="team-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Team Name*
                </label>
                <input
                  type="text"
                  id="team-name"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newTeam.name}
                  onChange={(e) => setNewTeam({...newTeam, name: e.target.value})}
                  placeholder="e.g. Development Team"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Team Color
                </label>
                <div className="flex space-x-2">
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setNewTeam({...newTeam, color: color.name})}
                      className={`w-8 h-8 rounded-full ${color.bg} flex items-center justify-center border-2 ${newTeam.color === color.name ? 'border-blue-500' : 'border-transparent'}`}
                    >
                      {newTeam.color === color.name && (
                        <div className="w-3 h-3 rounded-full bg-white"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Icon
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {icons.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setNewTeam({...newTeam, icon})}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${newTeam.icon === icon ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100 hover:bg-gray-200'}`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t px-4 py-3 flex justify-end space-x-3">
              <button
                onClick={() => setIsAddTeamModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTeam}
                disabled={!newTeam.name}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                Create Team
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {isAddMemberModalOpen && selectedTeam && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Add New Member</h3>
              <button 
                onClick={() => setIsAddMemberModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  id="name"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={newMember.name}
                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={newMember.email}
                  onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                <input
                  type="text"
                  id="role"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={newMember.role}
                  onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                />
              </div>
            </div>
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                onClick={() => handleAddMember(selectedTeam.id)}
                disabled={!newMember.name || !newMember.email || !newMember.role}
              >
                Add Member
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                onClick={() => setIsAddMemberModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {isAddTaskModalOpen && selectedTeam && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Add New Task</h3>
              <button 
                onClick={() => setIsAddTaskModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="task-title" className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  id="task-title"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                />
              </div>
              <div>
                <label htmlFor="task-description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  id="task-description"
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                />
              </div>
              <div>
                <label htmlFor="task-assignee" className="block text-sm font-medium text-gray-700">Assignee</label>
                <select
                  id="task-assignee"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                >
                  <option value="">Select assignee</option>
                  {selectedTeam.members.map(member => (
                    <option key={member.id} value={member.id}>{member.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="task-due-date" className="block text-sm font-medium text-gray-700">Due Date</label>
                  <input
                    type="date"
                    id="task-due-date"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={newTask.dueDate.toISOString().split('T')[0]}
                    onChange={(e) => setNewTask({...newTask, dueDate: new Date(e.target.value)})}
                  />
                </div>
                <div>
                  <label htmlFor="task-priority" className="block text-sm font-medium text-gray-700">Priority</label>
                  <select
                    id="task-priority"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value as 'low' | 'medium' | 'high'})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                onClick={() => handleAddTask(selectedTeam.id)}
                disabled={!newTask.title}
              >
                Add Task
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                onClick={() => setIsAddTaskModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {isUploadDocModalOpen && selectedTeam && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Upload Document</h3>
              <button 
                onClick={() => setIsUploadDocModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="document-name" className="block text-sm font-medium text-gray-700">Document Name</label>
                <input
                  type="text"
                  id="document-name"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={newDocument.name}
                  onChange={(e) => setNewDocument({...newDocument, name: e.target.value})}
                />
              </div>
              <div>
                <label htmlFor="document-type" className="block text-sm font-medium text-gray-700">Type</label>
                <select
                  id="document-type"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={newDocument.type}
                  onChange={(e) => setNewDocument({...newDocument, type: e.target.value})}
                >
                  <option value="">Select type</option>
                  <option value="pdf">PDF</option>
                  <option value="doc">Word</option>
                  <option value="xls">Excel</option>
                  <option value="ppt">PowerPoint</option>
                  <option value="image">Image</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="document-size" className="block text-sm font-medium text-gray-700">Size (MB)</label>
                <input
                  type="text"
                  id="document-size"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={newDocument.size}
                  onChange={(e) => setNewDocument({...newDocument, size: e.target.value})}
                />
              </div>
              <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF, DOC, XLS up to 10MB</p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                onClick={() => handleUploadDocument(selectedTeam.id)}
                disabled={!newDocument.name || !newDocument.type || !newDocument.size}
              >
                Upload
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                onClick={() => setIsUploadDocModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamsManagement;