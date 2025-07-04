import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Settings, Check, Zap, 
  Clock, Users, Database, Server, Code, Shield, Sun, Moon, X, 
  UserPlus, Edit, Trash, ChevronDown, ChevronUp, Search, Filter, 
  Lock, Unlock, Eye, EyeOff, Mail, Phone, Key, Plus, Minus, 
  UserCheck, UserX, RefreshCw, Coffee, Bell, Folder,
  Code2, FileText, Video, CalendarSearch
} from 'lucide-react';
import logo from '../Assets/videos/images/logo.png';
import user from '../Assets/videos/images/user.jpg';
import Reports from './Reports';
import Projects from './Projects';

const FlexCraftDashboard = () => {
  const [timeOfDay, setTimeOfDay] = useState('morning');
  const [currentTime, setCurrentTime] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activePlan, setActivePlan] = useState('pro');
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [teamMembers, setTeamMembers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('all');
  const [expandedUser, setExpandedUser] = useState(null);
  const [newInvite, setNewInvite] = useState({ email: '', role: 'member' });
  const [newRole, setNewRole] = useState({
    name: '',
    permissions: {
      projectCreate: false,
      projectDelete: false,
      userManage: false,
      billingView: false,
      billingManage: false,
      apiManage: false,
      settingsManage: false
    }
  });

  // Meeting scheduler state
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingDescription, setMeetingDescription] = useState('');
  const [scheduledMeetings, setScheduledMeetings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [copiedLink, setCopiedLink] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [filteredMeetings, setFilteredMeetings] = useState([]);

  // Initialize dashboard
  useEffect(() => {
    // Update time and greeting
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      
      if (hours < 12) setTimeOfDay('morning');
      else if (hours < 17) setTimeOfDay('afternoon');
      else setTimeOfDay('evening');
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);

    // Initialize mock data
    const mockTeamMembers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', status: 'active', 
        lastActive: '2023-05-15T10:30:00', avatar: 'JD', twoFactorEnabled: true, joinedDate: '2022-01-10' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'developer', status: 'active', 
        lastActive: '2023-05-14T15:45:00', avatar: 'JS', twoFactorEnabled: false, joinedDate: '2022-03-15' },
      { id: 3, name: 'Robert Johnson', email: 'robert@example.com', role: 'member', status: 'pending', 
        lastActive: '2023-05-10T09:15:00', avatar: 'RJ', twoFactorEnabled: true, joinedDate: '2023-02-20' },
      { id: 4, name: 'Emily Davis', email: 'emily@example.com', role: 'analyst', status: 'suspended', 
        lastActive: '2023-04-28T14:20:00', avatar: 'ED', twoFactorEnabled: false, joinedDate: '2021-11-05' },
      { id: 5, name: 'Michael Wilson', email: 'michael@example.com', role: 'developer', status: 'active', 
        lastActive: '2023-05-15T08:10:00', avatar: 'MW', twoFactorEnabled: true, joinedDate: '2022-09-12' }
    ];

    const mockInvitations = [
      { id: 1, email: 'newuser@example.com', role: 'member', sentAt: '2023-05-12T16:30:00', 
        expiresAt: '2023-06-12T16:30:00', status: 'pending' },
      { id: 2, email: 'contractor@example.com', role: 'contractor', sentAt: '2023-05-10T11:20:00', 
        expiresAt: '2023-06-10T11:20:00', status: 'pending' }
    ];

    const mockRoles = [
      { id: 1, name: 'admin', description: 'Full access to all features and settings', memberCount: 1, 
        permissions: { projectCreate: true, projectDelete: true, userManage: true, billingView: true, 
        billingManage: true, apiManage: true, settingsManage: true } },
      { id: 2, name: 'developer', description: 'Can create and manage projects, access API', memberCount: 2, 
        permissions: { projectCreate: true, projectDelete: false, userManage: false, billingView: false, 
        billingManage: false, apiManage: true, settingsManage: false } },
      { id: 3, name: 'member', description: 'Basic access to view and collaborate on projects', memberCount: 5, 
        permissions: { projectCreate: false, projectDelete: false, userManage: false, billingView: false, 
        billingManage: false, apiManage: false, settingsManage: false } },
      { id: 4, name: 'analyst', description: 'Read-only access to view projects and data', memberCount: 1, 
        permissions: { projectCreate: false, projectDelete: false, userManage: false, billingView: true, 
        billingManage: false, apiManage: false, settingsManage: false } }
    ];

    setTeamMembers(mockTeamMembers);
    setInvitations(mockInvitations);
    setRoles(mockRoles);

    // Load meetings from localStorage
    const savedMeetings = localStorage.getItem('scheduledMeetings');
    if (savedMeetings) setScheduledMeetings(JSON.parse(savedMeetings));

    return () => clearInterval(interval);
  }, []);

  // Meeting scheduler functions
  useEffect(() => {
    generateTimeSlots();
    filterMeetingsByDate();
  }, [selectedDate, scheduledMeetings]);

  useEffect(() => {
    localStorage.setItem('scheduledMeetings', JSON.stringify(scheduledMeetings));
  }, [scheduledMeetings]);

  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 9;
    const endHour = 18;
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const slotDate = new Date(selectedDate);
        slotDate.setHours(hour, minute, 0, 0);
        if (slotDate > new Date()) {
          slots.push({
            time: slotDate,
            formattedTime: slotDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
        }
      }
    }
    
    setAvailableSlots(slots);
    setSelectedSlot(null);
  };

  const filterMeetingsByDate = () => {
    const filtered = scheduledMeetings.filter(meeting => {
      const meetingDate = new Date(meeting.date);
      return (
        meetingDate.getDate() === selectedDate.getDate() &&
        meetingDate.getMonth() === selectedDate.getMonth() &&
        meetingDate.getFullYear() === selectedDate.getFullYear()
      );
    });
    setFilteredMeetings(filtered);
  };

  const generateMeetingLink = () => {
    const randomId = Math.random().toString(36).substring(2, 9);
    return `https://meet.flexcraft.app/join/${randomId}`;
  };

  const handleScheduleMeeting = () => {
    if (!selectedSlot || !meetingTitle) return;
    
    const meetingDate = new Date(selectedSlot.time);
    const meetingLink = generateMeetingLink();
    
    const newMeeting = {
      id: Date.now(),
      title: meetingTitle,
      description: meetingDescription,
      date: meetingDate.toISOString(),
      link: meetingLink,
      formattedDate: meetingDate.toLocaleDateString([], { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      }),
      formattedTime: meetingDate.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
    
    setScheduledMeetings([...scheduledMeetings, newMeeting]);
    setShowForm(false);
    setMeetingTitle('');
    setMeetingDescription('');
    setSelectedSlot(null);
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const deleteMeeting = (id) => {
    setScheduledMeetings(scheduledMeetings.filter(meeting => meeting.id !== id));
  };

  const formatDateHeader = (date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    
    return date.toLocaleDateString([], { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
    const days = [];
    
    // Empty cells for days before first day
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 p-1 border border-gray-200 bg-gray-50"></div>);
    }
    
    // Cells for each day
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const hasMeeting = scheduledMeetings.some(meeting => {
        const meetingDate = new Date(meeting.date);
        return (
          meetingDate.getDate() === day &&
          meetingDate.getMonth() === currentMonth &&
          meetingDate.getFullYear() === currentYear
        );
      });
      
      const isToday = new Date().getDate() === day && 
                     new Date().getMonth() === currentMonth && 
                     new Date().getFullYear() === currentYear;
      
      const isSelected = selectedDate.getDate() === day && 
                         selectedDate.getMonth() === currentMonth && 
                         selectedDate.getFullYear() === currentYear;
      
      days.push(
        <div 
          key={`day-${day}`} 
          className={`h-24 p-1 border border-gray-200 cursor-pointer hover:bg-blue-50 ${
            isSelected ? 'bg-blue-100' : ''
          }`}
          onClick={() => setSelectedDate(new Date(currentYear, currentMonth, day))}
        >
          <div className={`flex justify-between items-start ${
            isToday ? 'bg-blue-500 text-white rounded-full w-6 h-6 items-center justify-center' : ''
          }`}>
            <span className={`text-sm ${
              isToday ? 'text-white' : isSelected ? 'text-blue-600 font-bold' : 'text-gray-700'
            }`}>
              {day}
            </span>
            {hasMeeting && (
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            )}
          </div>
          <div className="mt-1 overflow-y-auto max-h-16 text-xs">
            {scheduledMeetings
              .filter(meeting => {
                const meetingDate = new Date(meeting.date);
                return (
                  meetingDate.getDate() === day &&
                  meetingDate.getMonth() === currentMonth &&
                  meetingDate.getFullYear() === currentYear
                );
              })
              .map(meeting => (
                <div 
                  key={meeting.id} 
                  className="bg-blue-100 text-blue-800 rounded px-1 mb-1 truncate"
                >
                  {meeting.formattedTime} {meeting.title.substring(0, 10)}...
                </div>
              ))}
          </div>
        </div>
      );
    }
    
    return days;
  };

  const changeMonth = (direction) => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const getMonthName = (monthIndex) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthIndex];
  };

  // Dashboard functions
  const getGreetingStyles = () => {
    switch(timeOfDay) {
      case 'morning': return { bg: 'bg-gradient-to-r from-amber-50 to-amber-100', text: 'text-amber-800', 
        icon: <Sun className="h-5 w-5 text-amber-500" />, greeting: 'Good morning' };
      case 'afternoon': return { bg: 'bg-gradient-to-r from-sky-50 to-sky-100', text: 'text-sky-800', 
        icon: <Coffee className="h-5 w-5 text-sky-500" />, greeting: 'Good afternoon' };
      case 'evening': return { bg: 'bg-gradient-to-r from-indigo-50 to-indigo-100', text: 'text-indigo-800', 
        icon: <Moon className="h-5 w-5 text-indigo-500" />, greeting: 'Good evening' };
      default: return { bg: 'bg-gray-50', text: 'text-gray-800', 
        icon: <Bell className="h-5 w-5 text-gray-500" />, greeting: 'Hello' };
    }
  };

  const styles = getGreetingStyles();
  
  const plans = [
    { id: 'starter', name: 'Starter', price: '$29', period: '/month', 
      description: 'Perfect for individuals and small teams', features: [
        '5 projects', '10GB storage', 'Basic API access', 'Email support', 'Up to 5 users'
      ], cta: 'Get Started' },
    { id: 'pro', name: 'Professional', price: '$99', period: '/month', 
      description: 'For growing teams with advanced needs', features: [
        'Unlimited projects', '100GB storage', 'Advanced API access', 'Priority support', 
        'Up to 20 users', 'Webhook integrations'
      ], cta: 'Popular Choice', popular: true },
    { id: 'enterprise', name: 'Enterprise', price: 'Custom', period: '', 
      description: 'For organizations with complex requirements', features: [
        'Unlimited everything', '1TB+ storage', 'Premium API access', '24/7 dedicated support', 
        'Unlimited users', 'Single sign-on (SSO)', 'Custom integrations'
      ], cta: 'Contact Sales' }
  ];

  const usageMetrics = [
    { name: 'API Calls', value: '12,450', limit: '50,000', icon: Code, color: 'text-blue-500' },
    { name: 'Storage Used', value: '45GB', limit: '100GB', icon: Database, color: 'text-green-500' },
    { name: 'Active Users', value: '8', limit: '20', icon: Users, color: 'text-purple-500' },
    { name: 'Uptime', value: '99.98%', limit: 'SLA 99.9%', icon: Server, color: 'text-yellow-500' }
  ];

  // Team management functions
  const handleInviteSubmit = (e) => {
    e.preventDefault();
    const newInvitation = {
      id: invitations.length + 1,
      email: newInvite.email,
      role: newInvite.role,
      sentAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'pending'
    };
    setInvitations([...invitations, newInvitation]);
    setNewInvite({ email: '', role: 'member' });
    setShowInviteModal(false);
  };

  const handleRoleSubmit = (e) => {
    e.preventDefault();
    const newRoleEntry = {
      id: roles.length + 1,
      name: newRole.name,
      description: 'Custom role',
      memberCount: 0,
      permissions: newRole.permissions
    };
    setRoles([...roles, newRoleEntry]);
    setNewRole({
      name: '',
      permissions: {
        projectCreate: false,
        projectDelete: false,
        userManage: false,
        billingView: false,
        billingManage: false,
        apiManage: false,
        settingsManage: false
      }
    });
    setShowRoleModal(false);
  };

  const toggleUserStatus = (userId, currentStatus) => {
    setTeamMembers(teamMembers.map(member => 
      member.id === userId 
        ? { ...member, status: currentStatus === 'active' ? 'suspended' : 'active' } 
        : member
    ));
  };

  const resendInvitation = (invitationId) => {
    alert(`Invitation resent to ${invitations.find(i => i.id === invitationId).email}`);
  };

  const revokeInvitation = (invitationId) => {
    setInvitations(invitations.filter(i => i.id !== invitationId));
  };

  const deleteRole = (roleId) => {
    const roleInUse = teamMembers.some(member => member.role === roles.find(r => r.id === roleId).name);
    if (roleInUse) {
      alert('Cannot delete role that is currently assigned to team members');
      return;
    }
    setRoles(roles.filter(role => role.id !== roleId));
  };

  const updateUserRole = (userId, newRole) => {
    setTeamMembers(teamMembers.map(member => 
      member.id === userId ? { ...member, role: newRole } : member
    ));
  };

  // Filter functions
  const filteredTeamMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRoleFilter === 'all' || member.role === selectedRoleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredInvitations = invitations.filter(invite => 
    invite.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedRoleFilter === 'all' || invite.role === selectedRoleFilter)
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active': return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>;
      case 'pending': return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Pending</span>;
      case 'suspended': return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Suspended</span>;
      default: return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Unknown</span>;
    }
  };

  const getRoleBadge = (role) => {
    const roleColors = {
      admin: 'bg-purple-100 text-purple-800',
      developer: 'bg-blue-100 text-blue-800',
      member: 'bg-green-100 text-green-800',
      analyst: 'bg-yellow-100 text-yellow-800',
      contractor: 'bg-indigo-100 text-indigo-800'
    };
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${roleColors[role] || 'bg-gray-100 text-gray-800'}`}>
        {role}
      </span>
    );
  };

  // Modal components
  const InviteModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
              <img src={logo} className="h-6 w-auto" />
            <h3 className="text-lg font-bold">Invite Team Member</h3>
            <button 
              onClick={() => setShowInviteModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <form onSubmit={handleInviteSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="user@example.com"
                  value={newInvite.email}
                  onChange={(e) => setNewInvite({...newInvite, email: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  id="role"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newInvite.role}
                  onChange={(e) => setNewInvite({...newInvite, role: e.target.value})}
                >
                  {roles.map(role => (
                    <option key={role.id} value={role.name}>{role.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Send Invitation
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  const RoleModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Create New Role</h3>
            <button 
              onClick={() => setShowRoleModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <form onSubmit={handleRoleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="roleName" className="block text-sm font-medium text-gray-700 mb-1">
                  Role Name
                </label>
                <input
                  type="text"
                  id="roleName"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Content Manager"
                  value={newRole.name}
                  onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permissions
                </label>
                <div className="space-y-3">
                  {Object.entries({
                    projectCreate: 'Create Projects',
                    projectDelete: 'Delete Projects',
                    userManage: 'Manage Users',
                    billingView: 'View Billing',
                    billingManage: 'Manage Billing',
                    apiManage: 'Manage API',
                    settingsManage: 'Manage Settings'
                  }).map(([key, label]) => (
                    <div key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        id={key}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={newRole.permissions[key]}
                        onChange={(e) => setNewRole({
                          ...newRole,
                          permissions: {
                            ...newRole.permissions,
                            [key]: e.target.checked
                          }
                        })}
                      />
                      <label htmlFor={key} className="ml-2 text-sm text-gray-700">
                        {label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Role
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <nav className="flex space-x-8">
                  <a href="#" className={`flex items-center space-x-1.5 ${activeTab === 'profile' ? 'text-blue-600' : 'text-gray-500'} hover:text-gray-700 transition-colors`} onClick={() => setActiveTab('profile')}>
                    <Folder className="h-4 w-4" />
                    <span>Profile</span>
                  </a>
                  <a href="#" className={`flex items-center space-x-1.5 ${activeTab === 'projects' ? 'text-blue-600' : 'text-gray-500'} hover:text-gray-700 transition-colors`} onClick={() => setActiveTab('projects')}>
                    <Folder className="h-4 w-4" />
                    <span>Managed Projects</span>
                  </a>
                  <a href="#" className={`flex items-center space-x-1.5 ${activeTab === 'team' ? 'text-blue-600' : 'text-gray-500'} hover:text-gray-700 transition-colors`} onClick={() => setActiveTab('team')}>
                    <Users className="h-4 w-4" />
                    <span>Team</span>
                  </a>
                  <a href="#" className={`flex items-center space-x-1.5 ${activeTab === 'settings' ? 'text-blue-600' : 'text-gray-500'} hover:text-gray-700 transition-colors`} onClick={() => setActiveTab('settings')}>
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </a>
                  <a href="#" className={`flex items-center space-x-1.5 ${activeTab === 'reports' ? 'text-blue-600' : 'text-gray-500'} hover:text-gray-700 transition-colors`} onClick={() => setActiveTab('reports')}>
                    <FileText className="h-4 w-4" />
                    <span>Reports</span>
                  </a>
                  <a href="#" className={`flex items-center space-x-1.5 ${activeTab === 'meetings' ? 'text-blue-600' : 'text-gray-500'} hover:text-gray-700 transition-colors`} onClick={() => setActiveTab('meetings')}>
                    <CalendarSearch className="h-4 w-4" />
                    <span>Schedule Meetings</span>
                  </a>
                </nav>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <Settings className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </button>
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                  JD
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'profile' && (
          <div className="space-y-8">
            {/* Dashboard Header */}
            <div className={`${styles.bg} p-6 rounded-xl shadow-sm`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <img src={user} className='h-24 w-24 rounded-full'/>
                  <div>
                    <h1 className={`text-2xl font-bold ${styles.text}`}>Hello, Alex</h1>
                    <div className="flex items-center space-x-2">
                      <div className={`p-3 rounded-full ${styles.bg} shadow-inner`}>
                        {styles.icon}
                      </div>
                      <p className={`font-medium ${styles.text}`}>{styles.greeting}</p>
                      <span className="text-sm text-gray-500">• {currentTime}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button className={`flex items-center px-4 py-2 rounded-lg transition-all 
                    ${timeOfDay === 'morning' ? 'bg-amber-500 hover:bg-amber-600' : 
                      timeOfDay === 'afternoon' ? 'bg-sky-500 hover:bg-sky-600' : 
                      'bg-indigo-500 hover:bg-indigo-600'} 
                    text-white shadow-md hover:shadow-lg`}>
                    <Zap className="h-4 w-4 mr-2" />
                    Quick Action
                  </button>
                  <button className={`flex items-center px-3 py-2 rounded-lg transition-all 
                    ${timeOfDay === 'morning' ? 'bg-amber-100 hover:bg-amber-200 text-amber-700' : 
                      timeOfDay === 'afternoon' ? 'bg-sky-100 hover:bg-sky-200 text-sky-700' : 
                      'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'}`}>
                    <Plus className="h-4 w-4 mr-1" />
                    New
                  </button>
                </div>
              </div>
            </div>

            {/* Usage Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {usageMetrics.map((metric, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">{metric.name}</p>
                      <p className="text-2xl font-bold mt-1">{metric.value}</p>
                      <p className="text-xs text-gray-400 mt-1">Limit: {metric.limit}</p>
                    </div>
                    <div className={`p-3 rounded-full ${metric.color} bg-opacity-20`}>
                      <metric.icon className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Current Plan */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Your Current Plan</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {plans.map(plan => (
                    <div 
                      key={plan.id} 
                      className={`border rounded-lg p-6 relative ${plan.id === activePlan ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}`}
                    >
                      {plan.popular && (
                        <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs px-2 py-1 rounded-bl-lg rounded-tr-lg">
                          Popular
                        </div>
                      )}
                      <h3 className="text-lg font-bold">{plan.name}</h3>
                      <div className="mt-2">
                        <span className="text-3xl font-bold">{plan.price}</span>
                        {plan.period && <span className="text-gray-500">{plan.period}</span>}
                      </div>
                      <p className="text-gray-500 mt-2">{plan.description}</p>
                      <ul className="mt-4 space-y-2">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <button
                        className={`mt-6 w-full px-4 py-2 rounded-lg ${plan.id === activePlan ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border border-gray-300 hover:bg-gray-50'}`}
                      >
                        {plan.id === activePlan ? 'Current Plan' : plan.cta}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold">Recent Activity</h2>
              </div>
              <div className="divide-y">
                {[1, 2, 3, 4, 5].map((item, index) => (
                  <div key={index} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                        <UserCheck className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Activity {index + 1}</p>
                        <p className="text-sm text-gray-500">Description of activity</p>
                      </div>
                      <div className="text-sm text-gray-400">
                        {new Date().toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Video Tutorial */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Getting Started</h2>
                  <button 
                    className="text-blue-600 hover:text-blue-800 text-sm"
                    onClick={() => setShowVideoModal(true)}
                  >
                    View All Tutorials
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg relative">
                  <button 
                    className="absolute inset-0 flex items-center justify-center"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? (
                      <Pause className="h-12 w-12 text-white bg-black bg-opacity-50 rounded-full p-3" />
                    ) : (
                      <Play className="h-12 w-12 text-white bg-black bg-opacity-50 rounded-full p-3" />
                    )}
                  </button>
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                    <button 
                      className="text-white hover:text-gray-200"
                      onClick={() => setIsMuted(!isMuted)}
                    >
                      {isMuted ? (
                        <VolumeX className="h-5 w-5" />
                      ) : (
                        <Volume2 className="h-5 w-5" />
                      )}
                    </button>
                    <button className="text-white hover:text-gray-200">
                      <Maximize className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="font-medium">Introduction to FlexCraft</h3>
                  <p className="text-sm text-gray-500 mt-1">Learn how to get started with our platform</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="space-y-8">
            {/* Team Management Header */}
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold text-blue-500">Team Management</h1>
              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowInviteModal(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite Team Member
                </button>
                <button 
                  onClick={() => setShowRoleModal(true)}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Role
                </button>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search team members..."
                    className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex space-x-4">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 text-gray-500 mr-2" />
                    <select
                      className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={selectedRoleFilter}
                      onChange={(e) => setSelectedRoleFilter(e.target.value)}
                    >
                      <option value="all">All Roles</option>
                      {roles.map(role => (
                        <option key={role.id} value={role.name}>{role.name}</option>
                      ))}
                    </select>
                  </div>
                  <button className="flex items-center px-3 py-2 border rounded-lg hover:bg-gray-50">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </button>
                </div>
              </div>
            </div>

            {/* Team Members Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="font-semibold flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-600" />
                  Team Members ({filteredTeamMembers.length})
                </h2>
              </div>
              <div className="divide-y">
                {filteredTeamMembers.length > 0 ? (
                  filteredTeamMembers.map(member => (
                    <div key={member.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                            {member.avatar}
                          </div>
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-sm text-gray-500">{member.email}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div>{getRoleBadge(member.role)}</div>
                          <div>{getStatusBadge(member.status)}</div>
                          <button 
                            onClick={() => setExpandedUser(expandedUser === member.id ? null : member.id)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            {expandedUser === member.id ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>
                      
                      {/* Expanded user details */}
                      {expandedUser === member.id && (
                        <div className="mt-4 pl-14 space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1">
                              <div className="text-sm text-gray-500">Status</div>
                              <div className="flex items-center">
                                {getStatusBadge(member.status)}
                                <button 
                                  onClick={() => toggleUserStatus(member.id, member.status)}
                                  className="ml-2 text-sm text-blue-600 hover:text-blue-800"
                                >
                                  {member.status === 'active' ? 'Suspend' : 'Activate'}
                                </button>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-sm text-gray-500">Role</div>
                              <div className="flex items-center">
                                <select
                                  value={member.role}
                                  onChange={(e) => updateUserRole(member.id, e.target.value)}
                                  className="border rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                  {roles.map(role => (
                                    <option key={role.id} value={role.name}>{role.name}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-sm text-gray-500">2FA</div>
                              <div className="flex items-center">
                                {member.twoFactorEnabled ? (
                                  <span className="flex items-center text-green-600">
                                    <Check className="h-4 w-4 mr-1" /> Enabled
                                  </span>
                                ) : (
                                  <span className="flex items-center text-yellow-600">
                                    <X className="h-4 w-4 mr-1" /> Disabled
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-sm text-gray-500">Last Active</div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1 text-gray-400" />
                                {new Date(member.lastActive).toLocaleString()}
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-sm text-gray-500">Joined</div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1 text-gray-400" />
                                {new Date(member.joinedDate).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-3 pt-2">
                            <button className="flex items-center px-3 py-1 border rounded-lg text-sm hover:bg-gray-50">
                              <Mail className="h-4 w-4 mr-2" />
                              Send Message
                            </button>
                            <button className="flex items-center px-3 py-1 border rounded-lg text-sm hover:bg-gray-50">
                              <Key className="h-4 w-4 mr-2" />
                              Reset Password
                            </button>
                            <button className="flex items-center px-3 py-1 border rounded-lg text-sm text-red-600 hover:bg-red-50">
                              <Trash className="h-4 w-4 mr-2" />
                              Remove
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    No team members found matching your criteria
                  </div>
                )}
              </div>
            </div>

            {/* Pending Invitations */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="font-semibold flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-yellow-600" />
                  Pending Invitations ({filteredInvitations.length})
                </h2>
              </div>
              <div className="divide-y">
                {filteredInvitations.length > 0 ? (
                  filteredInvitations.map(invite => (
                    <div key={invite.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                            <UserPlus className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-medium">{invite.email}</div>
                            <div className="text-sm text-gray-500">
                              Invited {new Date(invite.sentAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div>{getRoleBadge(invite.role)}</div>
                          <div className="text-sm text-gray-500">
                            Expires {new Date(invite.expiresAt).toLocaleDateString()}
                          </div>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => resendInvitation(invite.id)}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              Resend
                            </button>
                            <button 
                              onClick={() => revokeInvitation(invite.id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Revoke
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    No pending invitations
                  </div>
                )}
              </div>
            </div>

            {/* Roles and Permissions */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="font-semibold flex items-center">
                  <Lock className="h-5 w-5 mr-2 text-purple-600" />
                  Roles and Permissions ({roles.length})
                </h2>
              </div>
              <div className="divide-y">
                {roles.map(role => (
                  <div key={role.id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold">{role.name}</div>
                        <div className="text-sm text-gray-500">{role.description}</div>
                        <div className="mt-2 text-sm">
                          <span className="font-medium">{role.memberCount}</span> members assigned
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-gray-500 hover:text-blue-600">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => deleteRole(role.id)}
                          className="p-2 text-gray-500 hover:text-red-600"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 pl-2">
                      <div className="text-sm font-medium mb-2">Permissions:</div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries({
                          projectCreate: 'Create Projects',
                          projectDelete: 'Delete Projects',
                          userManage: 'Manage Users',
                          billingManage: 'Manage Billing',
                          apiManage: 'Manage API',
                          settingsManage: 'Manage Settings'
                        }).map(([key, label]) => (
                          <div key={key} className="flex items-center">
                            {role.permissions[key] ? (
                              <Check className="h-4 w-4 text-green-500 mr-2" />
                            ) : (
                              <X className="h-4 w-4 text-red-500 mr-2" />
                            )}
                            <span className="text-sm">{label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'meetings' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center">
                <CalendarSearch className="h-5 w-5 mr-2 text-blue-600" />
                Schedule Meetings
              </h2>
              <button 
                onClick={() => setShowForm(!showForm)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Schedule New Meeting
              </button>
            </div>

            {showForm && (
              <div className="bg-blue-50 rounded-lg p-6 mb-8 transition-all duration-300">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Date Picker */}
                  <div className="bg-white rounded-lg shadow-sm p-4">
                    <h3 className="font-medium mb-3 flex items-center">
                      <CalendarSearch className="h-4 w-4 mr-2 text-blue-500" />
                      Select Date
                    </h3>
                    <div className="flex justify-center">
                      <input 
                        type="date"
                        value={selectedDate.toISOString().split('T')[0]}
                        onChange={(e) => setSelectedDate(new Date(e.target.value))}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-lg font-semibold">
                        {selectedDate.toLocaleDateString([], { 
                          weekday: 'long', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                      <p className="text-gray-500">
                        {selectedDate.toLocaleDateString([], { year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  {/* Time Slots */}
                  <div className="bg-white rounded-lg shadow-sm p-4">
                    <h3 className="font-medium mb-3 flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-blue-500" />
                      Available Time Slots
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
                      {availableSlots.map((slot, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedSlot(slot)}
                          className={`p-2 border rounded-lg text-center ${
                            selectedSlot?.time === slot.time 
                              ? 'bg-blue-100 border-blue-500 text-blue-700' 
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          {slot.formattedTime}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Meeting Details Form */}
                  <div className="bg-white rounded-lg shadow-sm p-4">
                    <h3 className="font-medium mb-3 flex items-center">
                      Meeting Details
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Meeting Title</label>
                        <input
                          type="text"
                          value={meetingTitle}
                          onChange={(e) => setMeetingTitle(e.target.value)}
                          placeholder="Team Sync, Client Meeting, etc."
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Description (Optional)</label>
                        <textarea
                          value={meetingDescription}
                          onChange={(e) => setMeetingDescription(e.target.value)}
                          placeholder="Meeting agenda or notes"
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
                        />
                      </div>
                      <div className="pt-2">
                        <button
                          onClick={handleScheduleMeeting}
                          disabled={!selectedSlot || !meetingTitle}
                          className={`w-full px-4 py-2 rounded-lg ${
                            !selectedSlot || !meetingTitle
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          Schedule Meeting
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Calendar View */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Calendar</h3>
                <div className="flex space-x-2">
                  <button 
                    className="px-3 py-1 border rounded-lg text-sm hover:bg-gray-50"
                    onClick={() => changeMonth('prev')}
                  >
                    Previous
                  </button>
                  <div className="px-4 py-1 bg-blue-100 text-blue-700 rounded-lg font-medium">
                    {getMonthName(currentMonth)} {currentYear}
                  </div>
                  <button 
                    className="px-3 py-1 border rounded-lg text-sm hover:bg-gray-50"
                    onClick={() => changeMonth('next')}
                  >
                    Next
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-0 border border-gray-200 rounded-lg overflow-hidden">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="bg-gray-100 p-2 text-center text-gray-700 font-medium">
                    {day}
                  </div>
                ))}
                {renderCalendarDays()}
              </div>
            </div>

            {/* Selected Date Meetings */}
            <div>
              <h3 className="text-lg font-medium mb-4">
                Meetings on {formatDateHeader(selectedDate)}
              </h3>
              
              {filteredMeetings.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <Video className="h-12 w-12 mx-auto text-gray-400" />
                  <p className="mt-4 text-gray-500">No meetings scheduled for this date</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredMeetings.map((meeting) => (
                    <div 
                      key={meeting.id} 
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{meeting.title}</div>
                          <div className="flex items-center mt-1 text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            {meeting.formattedTime}
                          </div>
                          {meeting.description && (
                            <p className="mt-2 text-gray-600 text-sm">{meeting.description}</p>
                          )}
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => copyToClipboard(meeting.link, meeting.id)}
                            className="flex items-center px-3 py-1 bg-gray-100 rounded-lg text-sm hover:bg-gray-200"
                          >
                            {copiedLink === meeting.id ? (
                              <Check className="h-4 w-4 mr-1 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4 mr-1" />
                            )}
                            Copy Link
                          </button>
                          <button
                            onClick={() => deleteMeeting(meeting.id)}
                            className="flex items-center px-3 py-1 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100"
                          >
                            <Trash className="h-4 w-4 mr-1" />
                            Delete
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm">
                            <Link className="h-4 w-4 mr-1 text-blue-500" />
                            <span className="text-blue-600 font-medium">Meeting Link:</span>
                          </div>
                          <a
                            href={meeting.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 text-sm hover:underline truncate max-w-xs"
                          >
                            {meeting.link}
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'reports' && <Reports />}
        {activeTab === 'projects' && <Projects />}
      </div>

      {/* Modals */}
      {showInviteModal && <InviteModal />}
      {showRoleModal && <RoleModal />}
    </div>
  );
};

export default FlexCraftDashboard;