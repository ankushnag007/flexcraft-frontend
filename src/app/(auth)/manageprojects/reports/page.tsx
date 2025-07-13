"use client"
import { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Star, 
  Circle, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Calendar, 
  Users,
  FileText,
  HardHat,
  Code,
  BarChart4,
  PieChart as PieChartIcon,
  TrendingUpIcon,
  CalendarCheck,
  CalendarDays,
  CalendarCheck2
} from 'lucide-react';
import AuthGuard from '@/app/components/AuthGuard';

interface PerformanceData {
  overallScore: number;
  projects: ProjectData[];
  tasks: TaskData[];
  skills: SkillData[];
  peerReviews: PeerReview[];
  productivityTrend: number;
}

interface ProjectData {
  id: string;
  name: string;
  completion: number;
  contribution: number;
  deadlineMet: boolean;
  rating: number;
  teamMembers: number;
  deadline: string;
}

interface TaskData {
  id: string;
  name: string;
  status: 'completed' | 'in-progress' | 'overdue';
  complexity: 'low' | 'medium' | 'high';
  hoursSpent: number;
  estimatedHours: number;
  project: string;
}

interface SkillData {
  name: string;
  level: number;
  improvement: number;
  category: 'technical' | 'soft' | 'management';
}

interface PeerReview {
  reviewer: string;
  rating: number;
  comment: string;
  date: string;
}

const EmployeePerformanceReport = () => {
  const [timeRange, setTimeRange] = useState<'monthly' | 'quarterly' | 'yearly'>('quarterly');
  const [activeTab, setActiveTab] = useState<'summary' | 'projects' | 'tasks' | 'skills' | 'reviews'>('summary');
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  
  // Sample data - replace with API calls
  const [performanceData] = useState<PerformanceData>({
    overallScore: 87,
    productivityTrend: 12,
    projects: [
      {
        id: '1',
        name: 'E-commerce Platform',
        completion: 92,
        contribution: 45,
        deadlineMet: true,
        rating: 4.5,
        teamMembers: 8,
        deadline: '2023-11-30'
      },
      {
        id: '2',
        name: 'Mobile App Redesign',
        completion: 78,
        contribution: 30,
        deadlineMet: false,
        rating: 3.8,
        teamMembers: 5,
        deadline: '2023-12-15'
      },
      {
        id: '3',
        name: 'Data Migration',
        completion: 100,
        contribution: 25,
        deadlineMet: true,
        rating: 4.2,
        teamMembers: 3,
        deadline: '2023-10-01'
      }
    ],
    tasks: [
      {
        id: '1',
        name: 'Implement payment gateway',
        status: 'completed',
        complexity: 'high',
        hoursSpent: 32,
        estimatedHours: 30,
        project: 'E-commerce Platform'
      },
      {
        id: '2',
        name: 'User profile redesign',
        status: 'in-progress',
        complexity: 'medium',
        hoursSpent: 18,
        estimatedHours: 20,
        project: 'Mobile App Redesign'
      },
      {
        id: '3',
        name: 'API documentation',
        status: 'overdue',
        complexity: 'low',
        hoursSpent: 5,
        estimatedHours: 8,
        project: 'Data Migration'
      }
    ],
    skills: [
      {
        name: 'React',
        level: 85,
        improvement: 12,
        category: 'technical'
      },
      {
        name: 'TypeScript',
        level: 78,
        improvement: 20,
        category: 'technical'
      },
      {
        name: 'Project Management',
        level: 65,
        improvement: 8,
        category: 'management'
      },
      {
        name: 'Communication',
        level: 72,
        improvement: 5,
        category: 'soft'
      }
    ],
    peerReviews: [
      {
        reviewer: 'Sarah Johnson',
        rating: 4.5,
        comment: 'Excellent collaboration skills and technical expertise',
        date: '2023-10-15'
      },
      {
        reviewer: 'Michael Chen',
        rating: 4,
        comment: 'Very reliable and produces high quality work',
        date: '2023-09-28'
      }
    ]
  });

  const efficiencyPercentage = Math.round(
    (performanceData.tasks
      .filter(t => t.status === 'completed')
      .reduce((sum, task) => sum + (task.hoursSpent / task.estimatedHours), 0) / 
    performanceData.tasks.length) * 100
  );

  const toggleProjectExpand = (projectId: string) => {
    setExpandedProject(expandedProject === projectId ? null : projectId);
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'on-track': return <CheckCircle2 className="w-4 h-4 mr-1" />;
      case 'at-risk': return <AlertTriangle className="w-4 h-4 mr-1" />;
      case 'delayed': return <Clock className="w-4 h-4 mr-1" />;
      default: return null;
    }
  };

  const getSkillIcon = (category: string) => {
    switch(category) {
      case 'technical': return <Code className="w-4 h-4 mr-2" />;
      case 'soft': return <Users className="w-4 h-4 mr-2" />;
      case 'management': return <HardHat className="w-4 h-4 mr-2" />;
      default: return <FileText className="w-4 h-4 mr-2" />;
    }
  };

  return (
    <AuthGuard>
    <div className="min-h-screen bg-[var(--theme-background)] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-xl md:txl font-bold text-[var(--theme-accent)]">Performance Dashboard</h1>
            <p className="text-[var(--theme-text)] text-sm">John Doe • Senior Software Engineer</p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
  {/* Time Range Tabs */}
  <div className="flex border-b border-[var(--theme-primary)]">
    <button
      onClick={() => setTimeRange('monthly')}
      className={`flex items-center px-4 py-3 text-sm font-medium -mb-px border-b-2 ${
        timeRange === 'monthly'
          ? 'border-[var(--theme-accent)] text-[var(--theme-accent)]'
          : 'border-transparent text-[var(--theme-text)] hover:text-[var(--theme-text)] hover:border-[var(--theme-background)]'
      }`}
    >
      <Calendar className="w-4 h-4 mr-2" />
      Monthly
    </button>
    <button
      onClick={() => setTimeRange('quarterly')}
      className={`flex items-center px-4 py-3 text-sm font-medium -mb-px border-b-2 ${
        timeRange === 'quarterly'
          ? 'border-[var(--theme-accent)] text-[var(--theme-accent)]'
          : 'border-transparent text-[var(--theme-text)] hover:text-[var(--theme-text)] hover:border-[var(--theme-background)]'
      }`}
    >
      <CalendarDays className="w-4 h-4 mr-2" />
      Quarterly
    </button>
    <button
      onClick={() => setTimeRange('yearly')}
      className={`flex items-center px-4 py-3 text-sm font-medium -mb-px border-b-2 ${
        timeRange === 'yearly'
          ? 'border-[var(--theme-accent)] text-[var(--theme-accent)]'
          : 'border-transparent text-[var(--theme-text)] hover:text-[var(--theme-text)] hover:border-[var(--theme-background)]'
      }`}
    >
      <CalendarCheck2 className="w-4 h-4 mr-2" />
      Yearly
    </button>
  </div>

  {/* Productivity Trend Indicator */}
  <div className="flex items-center bg-[color-mix(in_srgb,var(--theme-accent)_10%,var(--theme-background)_90%)] rounded-lg px-4 py-2 border border-[var(--theme-primary)]">
    <TrendingUpIcon className="w-5 h-5 text-[var(--theme-accent)] mr-2" />
    <div>
      <p className="text-xs font-medium text-[var(--theme-text)]">Productivity Trend</p>
      <p className="text-sm font-semibold text-[var(--theme-primary)]">
        {performanceData.productivityTrend}% {performanceData.productivityTrend > 0 ? '↑' : '↓'}
      </p>
    </div>
  </div>
</div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto pb-2 mb-6">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('summary')}
              className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center ${
                activeTab === 'summary' 
                  ? 'bg-[color-mix(in_srgb,var(--theme-accent)_30%,var(--theme-background)_70%)] text-[var(--theme-accent)]' 
                  : 'text-[var(--theme-text)] hover:bg-[color-mix(in_srgb,var(--theme-accent)_10%,var(--theme-background)_90%)]'
              }`}
            >
              <PieChartIcon className="w-4 h-4 mr-2" />
              Summary
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center ${
                activeTab === 'projects' 
                  ? 'bg-[color-mix(in_srgb,var(--theme-accent)_30%,var(--theme-background)_70%)] text-[var(--theme-accent)]' 
                  : 'text-[var(--theme-text)] hover:bg-[color-mix(in_srgb,var(--theme-accent)_10%,var(--theme-background)_90%)]'
              }`}
            >
              <HardHat className="w-4 h-4 mr-2" />
              Projects
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center ${
                activeTab === 'tasks' 
                  ? 'bg-[color-mix(in_srgb,var(--theme-accent)_30%,var(--theme-background)_70%)] text-[var(--theme-accent)]' 
                  : 'text-[var(--theme-text)] hover:bg-[color-mix(in_srgb,var(--theme-accent)_10%,var(--theme-background)_90%)]'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Tasks
            </button>
            <button
              onClick={() => setActiveTab('skills')}
              className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center ${
                activeTab === 'skills' 
                  ? 'bg-[color-mix(in_srgb,var(--theme-accent)_30%,var(--theme-background)_70%)] text-[var(--theme-accent)]' 
                  : 'text-[var(--theme-text)] hover:bg-[color-mix(in_srgb,var(--theme-accent)_10%,var(--theme-background)_90%)]'
              }`}
            >
              <Code className="w-4 h-4 mr-2" />
              Skills
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center ${
                activeTab === 'reviews' 
                  ? 'bg-[color-mix(in_srgb,var(--theme-accent)_30%,var(--theme-background)_70%)] text-[var(--theme-accent)]' 
                  : 'text-[var(--theme-text)] hover:bg-[color-mix(in_srgb,var(--theme-accent)_10%,var(--theme-background)_90%)]'
              }`}
            >
              <FileText className="w-4 h-4 mr-2" />
              Peer Reviews
            </button>
          </div>
        </div>

        {/* Summary Tab */}
        {activeTab === 'summary' && (
          <div className="space-y-6">
            {/* Overall Performance Card */}
            <div className="bg-[var(--theme-background)] rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-bold text-[var(--theme-accent)] mb-6">Overall Performance</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Overall Score */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-[var(--theme-text)]">Overall Score</p>
                      <div className="flex items-end mt-2">
                        <span className="text-3xl font-bold text-gray-800">{performanceData.overallScore}</span>
                        <span className="text-lg text-[var(--theme-text)] ml-1">/100</span>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${
                      performanceData.overallScore >= 80 ? 'bg-green-100 text-[color-mix(in_srgb,var(--theme-accent)_70%,var(--theme-primary)_30%)]' :
                      performanceData.overallScore >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {performanceData.overallScore >= 80 ? 'Excellent' : 
                       performanceData.overallScore >= 60 ? 'Good' : 'Needs Improvement'}
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          performanceData.overallScore >= 80 ? 'bg-[color-mix(in_srgb,var(--theme-accent)_10%,var(--theme-background)_90%)]0' :
                          performanceData.overallScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${performanceData.overallScore}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Project Completion */}
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-5">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm font-medium text-[var(--theme-text)]">Project Completion</p>
                      <div className="flex items-end mt-2">
                        <span className="text-3xl font-bold text-gray-800">
                          {Math.round(
                            performanceData.projects.reduce((sum, p) => sum + p.completion, 0) / 
                            performanceData.projects.length
                          )}
                        </span>
                        <span className="text-lg text-[var(--theme-text)] ml-1">% avg</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-[var(--theme-text)]">Completed</p>
                      <span className="text-xl font-bold text-gray-800">
                        {performanceData.projects.filter(p => p.completion === 100).length}/{performanceData.projects.length}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    {performanceData.projects.map((project, index) => (
                      <div key={index} className="flex-1">
                        <div className="text-xs text-[var(--theme-text)] mb-1 truncate">{project.name}</div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full ${
                              project.completion >= 70 ? 'bg-[color-mix(in_srgb,var(--theme-accent)_10%,var(--theme-background)_90%)]0' :
                              project.completion >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${project.completion}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Task Efficiency */}
                <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-lg p-5">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm font-medium text-[var(--theme-text)]">Task Efficiency</p>
                      <div className="flex items-end mt-2">
                        <span className="text-3xl font-bold text-gray-800">{efficiencyPercentage}</span>
                        <span className="text-lg text-[var(--theme-text)] ml-1">%</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-[var(--theme-text)]">Completed</p>
                      <span className="text-xl font-bold text-gray-800">
                        {performanceData.tasks.filter(t => t.status === 'completed').length}/{performanceData.tasks.length}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-[var(--theme-text)] mb-1">
                      <span>On Time</span>
                      <span>
                        {performanceData.projects.filter(p => p.deadlineMet).length}/{performanceData.projects.length}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${
                          efficiencyPercentage >= 70 ? 'bg-[color-mix(in_srgb,var(--theme-accent)_10%,var(--theme-background)_90%)]0' :
                          efficiencyPercentage >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${efficiencyPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Projects & Tasks Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Projects Overview */}
              <div className="bg-[var(--theme-background)] rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-[var(--theme-accent)] mb-4">Projects Overview</h2>
                <div className="space-y-4">
                  {performanceData.projects.map((project) => (
                    <div key={project.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">{project.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full flex items-center ${
                          project.deadlineMet ? 'bg-green-100 text-[color-mix(in_srgb,var(--theme-accent)_70%,var(--theme-primary)_30%)]' : 'bg-red-100 text-red-800'
                        }`}>
                          {project.deadlineMet ? 'On Time' : 'Delayed'}
                        </span>
                      </div>
                      <div className="mt-2">
                        <div className="flex justify-between text-sm text-[var(--theme-text)] mb-1">
                          <span>Completion</span>
                          <span>{project.completion}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              project.completion >= 70 ? 'bg-[color-mix(in_srgb,var(--theme-accent)_10%,var(--theme-background)_90%)]0' :
                              project.completion >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${project.completion}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
                        <div className="flex items-center text-[var(--theme-text)]">
                          <Users className="w-4 h-4 mr-1 text-[var(--theme-text)]" />
                          <span>{project.teamMembers} team</span>
                        </div>
                        <div className="flex items-center text-[var(--theme-text)]">
                          <Star className="w-4 h-4 mr-1 text-yellow-500" />
                          <span>{project.rating.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center text-[var(--theme-text)]">
                          <Calendar className="w-4 h-4 mr-1 text-[var(--theme-text)]" />
                          <span>{new Date(project.deadline).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tasks Overview */}
              <div className="bg-[var(--theme-background)] rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-[var(--theme-accent)] mb-4">Tasks Overview</h2>
                <div className="space-y-4">
                  {performanceData.tasks.map((task) => (
                    <div key={task.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">{task.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          task.status === 'completed' ? 'bg-green-100 text-[color-mix(in_srgb,var(--theme-accent)_70%,var(--theme-primary)_30%)]' :
                          task.status === 'in-progress' ? 'bg-[color-mix(in_srgb,var(--theme-accent)_30%,var(--theme-background)_70%)] text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {task.status.replace('-', ' ')}
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-[var(--theme-text)]">{task.project}</div>
                      <div className="mt-2">
                        <div className="flex justify-between text-sm text-[var(--theme-text)] mb-1">
                          <span>Progress</span>
                          <span>
                            {Math.round((task.hoursSpent / task.estimatedHours) * 100)}%
                            ({task.hoursSpent}h/{task.estimatedHours}h)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              (task.hoursSpent / task.estimatedHours) <= 1 ? 'bg-[color-mix(in_srgb,var(--theme-accent)_10%,var(--theme-background)_90%)]0' : 'bg-red-500'
                            }`}
                            style={{ 
                              width: `${Math.min(100, (task.hoursSpent / task.estimatedHours) * 100)}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-[var(--theme-text)]">
                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                          task.complexity === 'low' ? 'bg-[color-mix(in_srgb,var(--theme-accent)_10%,var(--theme-background)_90%)]0' :
                          task.complexity === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></span>
                        {task.complexity} complexity
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="bg-[var(--theme-background)] rounded-xl shadow-sm border overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-[var(--theme-accent)] mb-6">Project Performance</h2>
              <div className="space-y-4">
                {performanceData.projects.map((project) => (
                  <div key={project.id} className="border rounded-lg overflow-hidden">
                    <div 
                      className="p-4 cursor-pointer flex justify-between items-center hover:bg-[color-mix(in_srgb,var(--theme-accent)_10%,var(--theme-background)_90%)]"
                      onClick={() => toggleProjectExpand(project.id)}
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-[color-mix(in_srgb,var(--theme-accent)_10%,var(--theme-background)_90%)] flex items-center justify-center mr-3">
                          <HardHat className="w-5 h-5 text-[var(--theme-accent)]" />
                        </div>
                        <div>
                          <h3 className="font-medium">{project.name}</h3>
                          <div className="flex items-center text-sm text-[var(--theme-text)] mt-1">
                            <span className="flex items-center mr-3">
                              <Users className="w-3 h-3 mr-1" /> {project.teamMembers} members
                            </span>
                            <span className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" /> Due {new Date(project.deadline).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="mr-4">
                          <div className="text-sm text-[var(--theme-text)] mb-1">Completion</div>
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-1.5 mr-2">
                              <div 
                                className={`h-1.5 rounded-full ${
                                  project.completion >= 70 ? 'bg-[color-mix(in_srgb,var(--theme-accent)_10%,var(--theme-background)_90%)]0' :
                                  project.completion >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${project.completion}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{project.completion}%</span>
                          </div>
                        </div>
                        {expandedProject === project.id ? (
                          <ChevronUp className="w-5 h-5 text-[var(--theme-text)]" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-[var(--theme-text)]" />
                        )}
                      </div>
                    </div>
                    
                    {expandedProject === project.id && (
                      <div className="border-t p-4 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-[var(--theme-background)] p-3 rounded-lg border">
                            <div className="text-sm text-[var(--theme-text)] mb-2">Contribution</div>
                            <div className="flex items-center">
                              <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                                <div 
                                  className="h-2 rounded-full bg-indigo-500" 
                                  style={{ width: `${project.contribution}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium">{project.contribution}%</span>
                            </div>
                          </div>
                          
                          <div className="bg-[var(--theme-background)] p-3 rounded-lg border">
                            <div className="text-sm text-[var(--theme-text)] mb-2">Rating</div>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < Math.floor(project.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                />
                              ))}
                              <span className="text-sm font-medium ml-1">{project.rating.toFixed(1)}</span>
                            </div>
                          </div>
                          
                          <div className="bg-[var(--theme-background)] p-3 rounded-lg border">
                            <div className="text-sm text-[var(--theme-text)] mb-2">Status</div>
                            <div className="flex items-center">
                              {project.deadlineMet ? (
                                <>
                                  <CheckCircle2 className="w-4 h-4 text-green-500 mr-1" />
                                  <span className="text-sm font-medium">On Track</span>
                                </>
                              ) : (
                                <>
                                  <AlertTriangle className="w-4 h-4 text-yellow-500 mr-1" />
                                  <span className="text-sm font-medium">Delayed</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">Related Tasks</h4>
                          <div className="space-y-2">
                            {performanceData.tasks
                              .filter(task => task.project === project.name)
                              .map(task => (
                                <div key={task.id} className="flex items-center justify-between bg-[var(--theme-background)] p-2 rounded border">
                                  <div className="flex items-center">
                                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                      task.status === 'completed' ? 'bg-[color-mix(in_srgb,var(--theme-accent)_10%,var(--theme-background)_90%)]0' :
                                      task.status === 'in-progress' ? 'bg-[color-mix(in_srgb,var(--theme-accent)_10%,var(--theme-background)_90%)]0' : 'bg-red-500'
                                    }`}></span>
                                    <span className="text-sm">{task.name}</span>
                                  </div>
                                  <div className="text-xs text-[var(--theme-text)]">
                                    {task.hoursSpent}h/{task.estimatedHours}h
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="bg-[var(--theme-background)] rounded-xl shadow-sm border overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-[var(--theme-accent)] mb-6">Task Performance</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[color-mix(in_srgb,var(--theme-accent)_70%,var(--theme-primary)_30%)]">Completed</p>
                      <p className="text-2xl font-bold text-green-900 mt-1">
                        {performanceData.tasks.filter(t => t.status === 'completed').length}
                      </p>
                    </div>
                    <CheckCircle2 className="w-8 h-8 text-green-400 opacity-70" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-800">In Progress</p>
                      <p className="text-2xl font-bold text-blue-900 mt-1">
                        {performanceData.tasks.filter(t => t.status === 'in-progress').length}
                      </p>
                    </div>
                    <Circle className="w-8 h-8 text-blue-400 opacity-70" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border border-red-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-800">Overdue</p>
                      <p className="text-2xl font-bold text-red-900 mt-1">
                        {performanceData.tasks.filter(t => t.status === 'overdue').length}
                      </p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-red-400 opacity-70" />
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--theme-text)] uppercase tracking-wider">Task</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--theme-text)] uppercase tracking-wider">Project</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--theme-text)] uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--theme-text)] uppercase tracking-wider">Complexity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--theme-text)] uppercase tracking-wider">Time Spent</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--theme-text)] uppercase tracking-wider">Efficiency</th>
                    </tr>
                  </thead>
                  <tbody className="bg-[var(--theme-background)] divide-y divide-gray-200">
                    {performanceData.tasks.map((task) => (
                      <tr key={task.id} className="hover:bg-[color-mix(in_srgb,var(--theme-accent)_10%,var(--theme-background)_90%)]">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium">{task.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-[var(--theme-text)]">{task.project}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            task.status === 'completed' ? 'bg-green-100 text-[color-mix(in_srgb,var(--theme-accent)_70%,var(--theme-primary)_30%)]' :
                            task.status === 'in-progress' ? 'bg-[color-mix(in_srgb,var(--theme-accent)_30%,var(--theme-background)_70%)] text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {task.status.replace('-', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            task.complexity === 'low' ? 'bg-green-100 text-[color-mix(in_srgb,var(--theme-accent)_70%,var(--theme-primary)_30%)]' :
                            task.complexity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {task.complexity}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            {task.hoursSpent}h / {task.estimatedHours}h
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-1.5 mr-2">
                              <div 
                                className={`h-1.5 rounded-full ${
                                  (task.hoursSpent / task.estimatedHours) <= 1 ? 'bg-[color-mix(in_srgb,var(--theme-accent)_10%,var(--theme-background)_90%)]0' : 'bg-red-500'
                                }`}
                                style={{ 
                                  width: `${Math.min(100, (task.hoursSpent / task.estimatedHours) * 100)}%` 
                                }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">
                              {Math.round((task.hoursSpent / task.estimatedHours) * 100)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <div className="bg-[var(--theme-background)] rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-[var(--theme-accent)] mb-6">Skills Assessment</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-800">Technical Skills</p>
                      <p className="text-2xl font-bold text-blue-900 mt-1">
                        {Math.round(
                          performanceData.skills
                            .filter(s => s.category === 'technical')
                            .reduce((sum, skill) => sum + skill.level, 0) / 
                          performanceData.skills.filter(s => s.category === 'technical').length
                        )}
                      </p>
                    </div>
                    <Code className="w-8 h-8 text-blue-400 opacity-70" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 rounded-lg border border-purple-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-800">Management Skills</p>
                      <p className="text-2xl font-bold text-purple-900 mt-1">
                        {Math.round(
                          performanceData.skills
                            .filter(s => s.category === 'management')
                            .reduce((sum, skill) => sum + skill.level, 0) / 
                          performanceData.skills.filter(s => s.category === 'management').length
                        )}
                      </p>
                    </div>
                    <HardHat className="w-8 h-8 text-purple-400 opacity-70" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-lg border border-green-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[color-mix(in_srgb,var(--theme-accent)_70%,var(--theme-primary)_30%)]">Soft Skills</p>
                      <p className="text-2xl font-bold text-green-900 mt-1">
                        {Math.round(
                          performanceData.skills
                            .filter(s => s.category === 'soft')
                            .reduce((sum, skill) => sum + skill.level, 0) / 
                          performanceData.skills.filter(s => s.category === 'soft').length
                        )}
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-green-400 opacity-70" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-4 rounded-lg border border-yellow-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-yellow-800">Avg. Improvement</p>
                      </div>
                      <div className="flex items-center">
                      <TrendingUp className="w-8 h-8 text-yellow-400 opacity-70" />
                      <span className="text-2xl font-bold text-yellow-900 ml-2">
                        {Math.round(
                          performanceData.skills.reduce((sum, skill) => sum + skill.improvement, 0) / 
                          performanceData.skills.length
                        )}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {performanceData.skills.map((skill) => (
                  <div key={skill.name} className="bg-[var(--theme-background)] rounded-lg border p-5 hover:shadow-sm transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center">
                        {getSkillIcon(skill.category)}
                        <h3 className="text-lg font-medium">{skill.name}</h3>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        skill.improvement >= 10 ? 'bg-green-100 text-[color-mix(in_srgb,var(--theme-accent)_70%,var(--theme-primary)_30%)]' :
                        skill.improvement >= 5 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {skill.improvement > 0 ? '+' : ''}{skill.improvement}%
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-[var(--theme-text)] mb-2">
                        <span>Current Level</span>
                        <span className="font-medium">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            skill.level >= 80 ? 'bg-[color-mix(in_srgb,var(--theme-accent)_10%,var(--theme-background)_90%)]0' :
                            skill.level >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm text-[var(--theme-text)] mb-2">
                        <span>Improvement Trend</span>
                        <span className="font-medium">+{skill.improvement}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            skill.improvement >= 10 ? 'bg-[color-mix(in_srgb,var(--theme-accent)_10%,var(--theme-background)_90%)]0' :
                            skill.improvement >= 5 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(100, skill.improvement)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between text-xs text-[var(--theme-text)]">
                        <span>Category: {skill.category}</span>
                        <span>
                          {skill.level >= 80 ? 'Expert' :
                           skill.level >= 60 ? 'Proficient' :
                           skill.level >= 40 ? 'Competent' : 'Novice'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Peer Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="bg-[var(--theme-background)] rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-[var(--theme-accent)] mb-6">Peer Feedback</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-800">Avg. Rating</p>
                      <div className="flex items-end mt-1">
                        <span className="text-2xl font-bold text-blue-900">
                          {(
                            performanceData.peerReviews.reduce((sum, review) => sum + review.rating, 0) / 
                            performanceData.peerReviews.length
                          ).toFixed(1)}
                        </span>
                        <span className="text-lg text-[var(--theme-text)] ml-1">/5</span>
                      </div>
                    </div>
                    <Star className="w-8 h-8 text-blue-400 opacity-70 fill-blue-400" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-lg border border-green-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[color-mix(in_srgb,var(--theme-accent)_70%,var(--theme-primary)_30%)]">Positive Feedback</p>
                      <p className="text-2xl font-bold text-green-900 mt-1">
                        {performanceData.peerReviews.filter(r => r.rating >= 4).length}
                      </p>
                    </div>
                    <CheckCircle2 className="w-8 h-8 text-green-400 opacity-70" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 rounded-lg border border-purple-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-800">Total Reviews</p>
                      <p className="text-2xl font-bold text-purple-900 mt-1">
                        {performanceData.peerReviews.length}
                      </p>
                    </div>
                    <FileText className="w-8 h-8 text-purple-400 opacity-70" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {performanceData.peerReviews.map((review, index) => (
                  <div key={index} className="border rounded-lg p-5 hover:shadow-sm transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium">{review.reviewer}</h3>
                        <p className="text-sm text-[var(--theme-text)]">
                          {new Date(review.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(review.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                        <span className="ml-1 text-sm font-medium">{review.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </AuthGuard>
  );
};

export default EmployeePerformanceReport;