"use client";
import React, { useState } from "react";
import {
  Plus,
  Calendar as CalendarIcon,
  Users,
  CheckSquare,
  MoreVertical,
  Search,
  Filter,
  ChevronDown,
  ArrowUpDown,
  List as ListIcon,
  LayoutGrid,
  Settings,
  Bell,
  HelpCircle,
  BarChart2,
  Flag,
  Tag,
  Paperclip,
  Clock,
  AlertCircle,
  GitPullRequest,
  Home,
  Folder,
  Sliders,
  LayoutDashboard,
  Users as TeamIcon,
  CreditCard,
  Grid,
  ClipboardList,
  Clock as TimelineIcon,
  Columns as BoardIcon,
  FileText,
  Target,
  AlertCircle as IssuesIcon,
  Settings as SettingsIcon,
  PieChart,
  GanttChart,
  Table,
  FormInput,
  Trophy,
  Kanban,
  BugIcon,
  LucideToggleLeft,
  DownloadCloud,
  X,
  File,
  FileImage,
  ChevronsUpDown,
} from "lucide-react";
import logo from "../Assets/images/logo.png";
// import BugTracker from "./(auth)/bugsTracker/page";
// import { render } from "react-dom";
import BugTracker from "../bugsTracker/page";
// DocEditor
import DocEditor from "../documents/page";
// Goals
import Goals from "../manageprojects/goals/page"
import List from "../manageprojects/lists/page" 
import Tasks from "../manageprojects/tasks/page" 
// Backlogs
// TeamsComponent
import TeamsComponent from "../manageprojects/teams/page" 
import Calendar from "../manageprojects/calendar/page"

import Backlogs from "../manageprojects/backlogs/page" 
import AuthGuard from "@/app/components/AuthGuard";
import Link from "next/link";
import IssuesManagement from "./issues/page";
import SummaryComponent from "./summary/page";
interface Task {
  id: string;
  title: string;
  description?: string;
  status: "backlog" | "todo" | "in-progress" | "review" | "done";
  assignee: string;
  dueDate: string;
  priority: "low" | "medium" | "high" | "critical";
  type: "task" | "bug" | "story" | "epic";
  labels?: string[];
  attachments?: number;
  comments?: number;
  storyPoints?: number;
}

const JiraLikeProjectManagement = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      title: "Sample Document",
      content: "<h1>Welcome</h1><p>This is a sample document</p>",
      lastEdited: new Date().toLocaleString(),
      status: "draft",
      tags: ["sample"],
      sharedWith: [],
    },
  ]);

  const handleSave = async (doc: Document) => {
    // In a real app, you would call your API here
    const savedDoc = {
      ...doc,
      id: doc.id || Date.now().toString(),
      lastEdited: new Date().toLocaleString(),
    };

    setDocuments((prev) =>
      doc.id
        ? prev.map((d) => (d.id === doc.id ? savedDoc : d))
        : [savedDoc, ...prev]
    );

    return savedDoc;
  };

  const handleDelete = async (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const handleUpload = async (file: File) => {
    // Simulate file upload
    return {
      id: `file-${Date.now()}`,
      type: file.type.startsWith("image/")
        ? "image"
        : file.type.startsWith("video/")
        ? "video"
        : "file",
      url: URL.createObjectURL(file),
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      uploadedAt: new Date().toLocaleString(),
    };
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
      setSearchQuery(""); // Clear search when closing
    }
  };

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Design System Implementation",
      description: "Create a unified design system for all components",
      status: "in-progress",
      assignee: "John Doe",
      dueDate: "2024-03-20",
      priority: "high",
      type: "story",
      labels: ["design", "ui"],
      attachments: 3,
      comments: 5,
      storyPoints: 5,
    },
    {
      id: "2",
      title: "API Integration",
      description: "Integrate with the new payment gateway API",
      status: "todo",
      assignee: "Jane Smith",
      dueDate: "2024-03-25",
      priority: "medium",
      type: "task",
      labels: ["backend", "api"],
      attachments: 1,
      comments: 2,
      storyPoints: 3,
    },
    {
      id: "3",
      title: "Fix login page bug",
      description: "Users unable to login with Safari browser",
      status: "review",
      assignee: "Mike Johnson",
      dueDate: "2024-03-18",
      priority: "critical",
      type: "bug",
      labels: ["frontend", "urgent"],
      attachments: 0,
      comments: 7,
    },
    {
      id: "4",
      title: "Database optimization",
      description: "Optimize queries for better performance",
      status: "backlog",
      assignee: "Sarah Williams",
      dueDate: "2024-04-01",
      priority: "medium",
      type: "task",
      labels: ["database"],
      storyPoints: 8,
    },
    {
      id: "5",
      title: "User profile page redesign",
      description: "Redesign according to new brand guidelines",
      status: "done",
      assignee: "John Doe",
      dueDate: "2024-03-15",
      priority: "low",
      type: "story",
      labels: ["design", "frontend"],
      storyPoints: 5,
    },
    {
      id: "6",
      title: "Mobile app performance",
      description: "Improve loading times on mobile devices",
      status: "in-progress",
      assignee: "Alex Chen",
      dueDate: "2024-03-22",
      priority: "high",
      type: "epic",
      labels: ["mobile", "performance"],
      storyPoints: 13,
    },
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskType, setNewTaskType] = useState<
    "task" | "bug" | "story" | "epic"
  >("task");
  const [newTaskPriority, setNewTaskPriority] = useState<
    "low" | "medium" | "high" | "critical"
  >("medium");
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [taskIdCounter, setTaskIdCounter] = useState(() => {
    // Find the max numeric ID in the initial tasks array
    const maxId = tasks.reduce(
      (max, task) => Math.max(max, Number(task.id)),
      0
    );
    return maxId + 1;
  });
  const DEMO_MEMBERS: User[] = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike@example.com",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
    {
      id: "4",
      name: "Sarah Williams",
      email: "sarah@example.com",
      avatar: "https://i.pravatar.cc/150?img=4",
    },
    {
      id: "5",
      name: "David Brown",
      email: "david@example.com",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
    {
      id: "6",
      name: "Emily Davis",
      email: "emily@example.com",
      avatar: "https://i.pravatar.cc/150?img=6",
    },
    {
      id: "7",
      name: "Robert Wilson",
      email: "robert@example.com",
      avatar: "https://i.pravatar.cc/150?img=7",
    },
    {
      id: "8",
      name: "Jennifer Lee",
      email: "jennifer@example.com",
      avatar: "https://i.pravatar.cc/150?img=8",
    },
    {
      id: "9",
      name: "Thomas Taylor",
      email: "thomas@example.com",
      avatar: "https://i.pravatar.cc/150?img=9",
    },
    {
      id: "10",
      name: "Lisa Anderson",
      email: "lisa@example.com",
      avatar: "https://i.pravatar.cc/150?img=10",
    },
    {
      id: "11",
      name: "William Martinez",
      email: "william@example.com",
      avatar: "https://i.pravatar.cc/150?img=11",
    },
    {
      id: "12",
      name: "Amanda Thompson",
      email: "amanda@example.com",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
  ];
  const [newTaskStatus, setNewTaskStatus] = useState<Task["status"]>("backlog");
  const [viewMode, setViewMode] = useState<"list" | "board">("board");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  // Drag and drop state and handlers
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const handleDragStart = (taskId: string) => {
    setDraggedTaskId(taskId);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
  };

  const handleDrop = (newStatus: Task["status"]) => {
    if (draggedTaskId) {
      setTasks((tasks) =>
        tasks.map((task) =>
          task.id === draggedTaskId ? { ...task, status: newStatus } : task
        )
      );
      setDraggedTaskId(null);
    }
  };
  const [activeContentTab, setActiveContentTab] = useState("Your work");

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: taskIdCounter.toString(),
      title: newTaskTitle,
      description: newTaskDescription,
      status: "backlog",
      assignee: "Unassigned",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      priority: newTaskPriority,
      type: newTaskType,
      labels: [],
      attachments: 0,
      comments: 0,
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
    setNewTaskDescription("");
    setIsCreatingTask(false);
  };

  const moveTask = (taskId: string, newStatus: Task["status"]) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description &&
        task.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "critical":
        return "bg-red-600 text-white";
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: Task["type"]) => {
    switch (type) {
      case "bug":
        return "bg-red-500";
      case "story":
        return "bg-blue-500";
      case "task":
        return "bg-green-500";
      case "epic":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const openTaskDetails = (task: Task) => {
    setSelectedTask(task);
  };

  const closeTaskDetails = () => {
    setSelectedTask(null);
  };

  const renderContent = () => {
    switch (activeContentTab) {
      case "Your work":
        return (
          <div className="bg-white p-6 rounded-lg shadow min-h-screen">
            <h2 className="text-xl font-bold mb-4">Your Work</h2>
            <div className="bg-white p-6 rounded-lg shadow min-h-screen">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
                  Your Work
                </h2>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search tasks..."
                      className="pl-10 pr-4 py-2 border rounded-lg   focus:border-blue-500 w-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <svg
                      className="w-5 h-5 absolute left-3 top-2.5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      ></path>
                    </svg>
                  </div>

                  <select
                    className="px-4 py-2 border rounded-lg   focus:border-blue-500 w-full sm:w-auto"
                    // value={filter}
                    // onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="all">All Tasks</option>
                    <option value="assigned">Assigned to Me</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-700 mb-1">
                        Assigned to you
                      </h3>
                      {/* <p className="text-2xl font-bold text-gray-800">{assignedCount} tasks</p> */}
                    </div>
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <svg
                        className="w-6 h-6 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-100 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-700 mb-1">
                        Recently viewed
                      </h3>
                      <p className="text-2xl font-bold text-gray-800">
                        3 projects
                      </p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-lg">
                      <svg
                        className="w-6 h-6 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        ></path>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-700 mb-1">
                        Worked on
                      </h3>
                      <p className="text-2xl font-bold text-gray-800">
                        12 tasks this week
                      </p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <svg
                        className="w-6 h-6 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Task List */}
              <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                <div className="grid grid-cols-12 bg-gray-100 px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="col-span-5">Task</div>
                  <div className="col-span-2">Project</div>
                  <div className="col-span-2">Due Date</div>
                  <div className="col-span-3 text-right">Status</div>
                </div>

                <div className="divide-y divide-gray-200">
                  {filteredTasks.length === 0 ? (
                    <div className="text-center py-8">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        ></path>
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No tasks found
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Try changing your filters or search query
                      </p>
                    </div>
                  ) : (
                    filteredTasks.map((task) => (
                      <div
                        key={task.id}
                        className="grid grid-cols-12 px-4 py-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="col-span-5">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 mr-3">
                              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                                <span className="text-white text-sm font-medium">
                                  {task.assignee
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </span>
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {task.title}
                              </div>
                              <div className="text-sm text-gray-500 mt-1 line-clamp-1">
                                {task.description}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-span-2 flex items-center">
                          <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs">
                            {/* {task.project} */}
                          </span>
                        </div>

                        <div className="col-span-2 flex items-center">
                          <div className="flex items-center">
                            <svg
                              className="w-4 h-4 text-gray-400 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              ></path>
                            </svg>
                            {/* <span className="text-sm text-gray-600">{new Date(task.dueDate).toLocaleDateString()}</span> */}
                          </div>
                        </div>

                        <div className="col-span-3 flex items-center justify-end space-x-2">
                          {/* <PriorityBadge priority={task.priority} />
                  <StatusBadge status={task.status} /> */}
                          <button className="text-gray-400 hover:text-gray-600">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                              ></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Stats Section */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Task Distribution
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          To Do
                        </span>
                        <span className="text-sm font-medium text-gray-700">
                          {tasks.filter((t) => t.status === "todo").length}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-gray-500 h-2.5 rounded-full"
                          style={{
                            width: `${
                              (tasks.filter((t) => t.status === "todo").length /
                                tasks.length) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          In Progress
                        </span>
                        {/* <span className="text-sm font-medium text-gray-700">{inProgressCount}</span> */}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-500 h-2.5 rounded-full"
                          // style={{ width: `${(inProgressCount / tasks.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          Completed
                        </span>
                        {/* <span className="text-sm font-medium text-gray-700">{completedCount}</span> */}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-green-500 h-2.5 rounded-full"
                          // style={{ width: `${(completedCount / tasks.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Priority Breakdown
                  </h3>
                  <div className="flex justify-between items-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-500">
                        {tasks.filter((t) => t.priority === "high").length}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        High Priority
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-yellow-500">
                        {tasks.filter((t) => t.priority === "medium").length}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Medium</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-500">
                        {tasks.filter((t) => t.priority === "low").length}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Low</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "Backlogs":
        return (
   <Backlogs />
        );
      case "Tasks":
        return (
          <Tasks />
        );
      case "Filters":
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Filters</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium mb-2">Status</h3>
                <div className="space-y-2">
                  {["backlog", "todo", "in-progress", "review", "done"].map(
                    (status) => (
                      <label key={status} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded text-blue-600"
                        />
                        <span className="ml-2 capitalize">{status}</span>
                      </label>
                    )
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Priority</h3>
                <div className="space-y-2">
                  {["low", "medium", "high", "critical"].map((priority) => (
                    <label key={priority} className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded text-blue-600"
                      />
                      <span className="ml-2 capitalize">{priority}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Type</h3>
                <div className="space-y-2">
                  {["task", "bug", "story", "epic"].map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded text-blue-600"
                      />
                      <span className="ml-2 capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case "Dashboards":
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Dashboards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <BarChart2 className="w-5 h-5 text-blue-500 mr-2" />
                  <h3 className="font-medium">Project Overview</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  High-level metrics and progress
                </p>
              </div>
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <PieChart className="w-5 h-5 text-green-500 mr-2" />
                  <h3 className="font-medium">Work Distribution</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Tasks by status and assignee
                </p>
              </div>
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <GanttChart className="w-5 h-5 text-purple-500 mr-2" />
                  <h3 className="font-medium">Timeline</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Project schedule and milestones
                </p>
              </div>
            </div>
          </div>
        );
      case "Teams":
        return (
         <TeamsComponent />
        );
        // case "Plans":
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Plans</h2>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Free Plan</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Basic features for small teams
                </p>
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  Current Plan
                </button>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Standard Plan</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Advanced features for growing teams
                </p>
                <button className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Upgrade
                </button>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Premium Plan</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Enterprise features for large teams
                </p>
                <button className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Upgrade
                </button>
              </div>
            </div>
          </div>
        );
      case "Apps":
        return (
         <div className="bg-white p-6 rounded-lg shadow">
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-xl font-bold">Integrations</h2>
    <div className="relative w-64">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        placeholder="Search integrations..."
      />
    </div>
  </div>

  {/* Categories */}
  <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
    <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
      All
    </button>
    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200">
      Development
    </button>
    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200">
      Productivity
    </button>
    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200">
      Communication
    </button>
    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200">
      Analytics
    </button>
    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200">
      Design
    </button>
    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200">
      Storage
    </button>
  </div>

  {/* Integration Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {/* Development */}
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow flex flex-col">
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
        <h3 className="font-medium">GitHub</h3>
      </div>
      <p className="text-gray-600 text-sm mb-4 flex-grow">
        Connect repositories, sync commits, and manage pull requests
      </p>
      <button className="mt-auto w-full py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
        Connect
      </button>
    </div>

    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow flex flex-col">
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
          <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
        <h3 className="font-medium">GitLab</h3>
      </div>
      <p className="text-gray-600 text-sm mb-4 flex-grow">
        Sync your GitLab projects and manage merge requests
      </p>
      <button className="mt-auto w-full py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
        Connect
      </button>
    </div>

    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow flex flex-col">
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
        <h3 className="font-medium">Bitbucket</h3>
      </div>
      <p className="text-gray-600 text-sm mb-4 flex-grow">
        Link Bitbucket repositories and track development progress
      </p>
      <button className="mt-auto w-full py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
        Connect
      </button>
    </div>

    {/* Communication */}
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow flex flex-col">
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="font-medium">Slack</h3>
      </div>
      <p className="text-gray-600 text-sm mb-4 flex-grow">
        Get notifications in Slack channels and create tasks from messages
      </p>
      <button className="mt-auto w-full py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
        Connect
      </button>
    </div>

    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow flex flex-col">
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </div>
        <h3 className="font-medium">Microsoft Teams</h3>
      </div>
      <p className="text-gray-600 text-sm mb-4 flex-grow">
        Sync with Teams channels and get task notifications
      </p>
      <button className="mt-auto w-full py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
        Connect
      </button>
    </div>

    {/* Productivity */}
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow flex flex-col">
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="font-medium">Google Docs</h3>
      </div>
      <p className="text-gray-600 text-sm mb-4 flex-grow">
        Attach Google Docs to tasks and sync comments
      </p>
      <button className="mt-auto w-full py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
        Connect
      </button>
    </div>

    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow flex flex-col">
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="font-medium">Notion</h3>
      </div>
      <p className="text-gray-600 text-sm mb-4 flex-grow">
        Sync tasks with Notion databases and pages
      </p>
      <button className="mt-auto w-full py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
        Connect
      </button>
    </div>

    {/* Analytics */}
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow flex flex-col">
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="font-medium">Google Analytics</h3>
      </div>
      <p className="text-gray-600 text-sm mb-4 flex-grow">
        Track project metrics and generate reports
      </p>
      <button className="mt-auto w-full py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
        Connect
      </button>
    </div>

    {/* Design */}
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow flex flex-col">
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center mr-3">
          <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
        </div>
        <h3 className="font-medium">Figma</h3>
      </div>
      <p className="text-gray-600 text-sm mb-4 flex-grow">
        Attach design files and sync comments
      </p>
      <button className="mt-auto w-full py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
        Connect
      </button>
    </div>
  </div>

  {/* View More */}
  <div className="mt-6 text-center">
    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
      View all 25+ integrations →
    </button>
  </div>
</div>
        );
      case "Bugs":
        return <BugTracker />;
      case "Docs":
        return (
          <DocEditor
            //  initialDocuments={documents}
            onSave={handleSave}
            onDelete={handleDelete}
            onUploadFile={handleUpload}
            onShareDocument={undefined}
            onAssignToTask={undefined}
          />
        );
      case "summary":
        return (
          <SummaryComponent />
        );
      case "timeline":
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6 hover:shadow-md transition-all duration-200 transition-all">
            <h3 className="font-medium mb-3">Project Timeline</h3>
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              {/* Timeline Header */}
              <div className="flex bg-gray-100 border-b border-gray-200">
                <div className="w-48 p-2 font-medium text-sm text-gray-500 border-r border-gray-200">
                  Tasks
                </div>
                <div className="flex-1 flex">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (day) => (
                      <div
                        key={day}
                        className="flex-1 p-2 text-center text-sm font-medium text-gray-500 border-r border-gray-200 last:border-r-0"
                      >
                        {day}{" "}
                        <span className="block text-xs font-normal">
                          Jul{" "}
                          {15 +
                            [
                              "Mon",
                              "Tue",
                              "Wed",
                              "Thu",
                              "Fri",
                              "Sat",
                              "Sun",
                            ].indexOf(day)}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Timeline Rows */}
              <div className="divide-y divide-gray-200">
                {/* Task 1 */}
                <div className="flex h-12 relative">
                  <div className="w-48 p-2 flex items-center text-sm font-medium border-r border-gray-200">
                    Research Phase
                  </div>
                  <div className="flex-1 flex relative">
                    <div className="absolute left-1/7 w-2/7 h-8 top-2 bg-blue-100 border border-blue-300 rounded flex items-center justify-center">
                      <span className="text-xs text-blue-800 px-2 truncate">
                        Jul 15-17
                      </span>
                    </div>
                  </div>
                </div>

                {/* Task 2 */}
                <div className="flex h-12 relative">
                  <div className="w-48 p-2 flex items-center text-sm font-medium border-r border-gray-200">
                    Design Mockups
                  </div>
                  <div className="flex-1 flex relative">
                    <div className="absolute left-2/7 w-3/7 h-8 top-2 bg-purple-100 border border-purple-300 rounded flex items-center justify-center">
                      <span className="text-xs text-purple-800 px-2 truncate">
                        Jul 17-20
                      </span>
                    </div>
                  </div>
                </div>

                {/* Task 3 */}
                <div className="flex h-12 relative">
                  <div className="w-48 p-2 flex items-center text-sm font-medium border-r border-gray-200">
                    Development
                  </div>
                  <div className="flex-1 flex relative">
                    <div className="absolute left-3/7 w-3/7 h-8 top-2 bg-green-100 border border-green-300 rounded flex items-center justify-center">
                      <span className="text-xs text-green-800 px-2 truncate">
                        Jul 20-23
                      </span>
                    </div>
                  </div>
                </div>

                {/* Task 4 */}
                <div className="flex h-12 relative">
                  <div className="w-48 p-2 flex items-center text-sm font-medium border-r border-gray-200">
                    Testing
                  </div>
                  <div className="flex-1 flex relative">
                    <div className="absolute left-5/7 w-2/7 h-8 top-2 bg-yellow-100 border border-yellow-300 rounded flex items-center justify-center">
                      <span className="text-xs text-yellow-800 px-2 truncate">
                        Jul 23-25
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline Footer */}
              <div className="bg-gray-50 p-2 border-t border-gray-200 flex justify-between items-center">
                <button className="text-xs text-gray-500 hover:text-gray-700 flex items-center">
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
                <span className="text-sm text-gray-600">
                  Week of July 15 - 21, 2023
                </span>
                <button className="text-xs text-gray-500 hover:text-gray-700 flex items-center">
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
      case "board":
        return (
          <div>
            {/* Project Header */}
            <div className="flex justify-between items-center mb-6 ">
              <div>
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold text-gray-800">
                    Website Redesign
                  </h1>
                  <ChevronDown className="w-5 h-5 ml-2 text-gray-500" />
                </div>
                <div className="flex items-center mt-2 space-x-4">
                  <span className="text-sm text-gray-600">
                    Project Key: WEB
                  </span>
                  <span className="text-sm text-gray-600">Lead: John Doe</span>
                  <span className="text-sm text-gray-600">Version: 2.0</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-100">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </button>
                <button
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  onClick={() => setIsCreatingTask(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create
                </button>
              </div>
            </div>

            {/* View Options */}
            <div className="flex items-center justify-between mb-6 bg-white p-3 rounded-lg border border-gray-200 transition-all">
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

              <div className="flex items-center space-x-3">
                {isSearchOpen ? (
                  <div className="flex items-center bg-gray-100 rounded-full px-3 py-2 transition-all duration-300">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent border-none outline-none w-64 px-2"
                      autoFocus
                    />
                    <button
                      onClick={toggleSearch}
                      className=" text-gray-500 hover:text-gray-700 hover:bg-white rounded-full p-1"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={toggleSearch}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                )}
                <button className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  Sort
                </button>
              </div>
            </div>

            {/* Board View */}
            {viewMode === "board" && (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Backlog Column */}
                <div
                  className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop("backlog")}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-semibold text-gray-700">Backlog</h2>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-2">
                        {
                          filteredTasks.filter((t) => t.status === "backlog")
                            .length
                        }
                      </span>

                      <Plus
                        className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer"
                        onClick={() => {
                          setIsCreatingTask(true);
                          setNewTaskStatus("backlog");
                        }}
                      />
                    </div>
                  </div>
                  {filteredTasks
                    .filter((task) => task.status === "backlog")
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
                          <span
                            className={`w-3 h-3 rounded-full ${getTypeColor(
                              task.type
                            )} ml-2`}
                          ></span>
                          {task.storyPoints && (
                            <span className="ml-2 text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                              {task.storyPoints} pts
                            </span>
                          )}
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

                {/* Other columns (To Do, In Progress, Review, Done) */}
                {/* To Do Column */}
                <div
                  className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop("todo")}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-semibold text-gray-700">To Do</h2>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-2">
                        {
                          filteredTasks.filter((t) => t.status === "todo")
                            .length
                        }
                      </span>
                      <Plus
                        className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer"
                        onClick={() => {
                          setIsCreatingTask(true);
                          setNewTaskStatus("todo");
                        }}
                      />
                    </div>
                  </div>
                  {filteredTasks
                    .filter((task) => task.status === "todo")
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
                          <span
                            className={`w-3 h-3 rounded-full ${getTypeColor(
                              task.type
                            )} ml-2`}
                          ></span>
                          {task.storyPoints && (
                            <span className="ml-2 text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                              {task.storyPoints} pts
                            </span>
                          )}
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

                {/* In Progress Column */}
                <div
                  className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop("in-progress")}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-semibold text-gray-700">In Progress</h2>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-2">
                        {
                          filteredTasks.filter(
                            (t) => t.status === "in-progress"
                          ).length
                        }
                      </span>
                      <Plus
                        className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer"
                        onClick={() => {
                          setIsCreatingTask(true);
                          setNewTaskStatus("in-progress");
                        }}
                      />
                    </div>
                  </div>
                  {filteredTasks
                    .filter((task) => task.status === "in-progress")
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
                          <span
                            className={`w-3 h-3 rounded-full ${getTypeColor(
                              task.type
                            )} ml-2`}
                          ></span>
                          {task.storyPoints && (
                            <span className="ml-2 text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                              {task.storyPoints} pts
                            </span>
                          )}
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

                {/* Review Column */}
                <div
                  className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop("review")}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-semibold text-gray-700">Review</h2>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-2">
                        {
                          filteredTasks.filter((t) => t.status === "review")
                            .length
                        }
                      </span>
                      <Plus
                        className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer"
                        onClick={() => {
                          setIsCreatingTask(true);
                          setNewTaskStatus("review");
                        }}
                      />
                    </div>
                  </div>
                  {filteredTasks
                    .filter((task) => task.status === "review")
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
                          <span
                            className={`w-3 h-3 rounded-full ${getTypeColor(
                              task.type
                            )} ml-2`}
                          ></span>
                          {task.storyPoints && (
                            <span className="ml-2 text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                              {task.storyPoints} pts
                            </span>
                          )}
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

                {/* Done Column */}
                <div
                  className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop("done")}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-semibold text-gray-700">Done</h2>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-2">
                        {
                          filteredTasks.filter((t) => t.status === "done")
                            .length
                        }
                      </span>
                      <Plus
                        className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer"
                        onClick={() => {
                          setIsCreatingTask(true);
                          setNewTaskStatus("done");
                        }}
                      />
                    </div>
                  </div>
                  {filteredTasks
                    .filter((task) => task.status === "done")
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
                          <h3 className="font-medium text-gray-800 line-through">
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
                          <span
                            className={`w-3 h-3 rounded-full ${getTypeColor(
                              task.type
                            )} ml-2`}
                          ></span>
                          {task.storyPoints && (
                            <span className="ml-2 text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                              {task.storyPoints} pts
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                          <div className="flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            <span>{task.assignee}</span>
                          </div>
                          <div className="flex items-center">
                            <CheckSquare className="w-3 h-3 text-green-500" />
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* List View */}
            {viewMode === "list" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Task
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Assignee
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Due Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Priority
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Type
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
                            <span
                              className={`w-3 h-3 rounded-full ${getTypeColor(
                                task.type
                              )} mr-3`}
                            ></span>
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
                            {task.status}
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {task.type}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );

      case "calendar":
        return (
          <Calendar />
        );
      case "list":
        return (
   <List />
        );

      case "goals":
        return (
          <Goals />

        );
      case "issues":
        return (
       <IssuesManagement /> 
        );
     case "documents":
        return (
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200 transition-all">
  {/* Header with title and actions */}
  <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between">
    <h3 className="text-lg font-medium">Download Documents</h3>
    <div className="flex items-center space-x-2">
      <button className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 flex items-center">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download Selected
      </button>
    </div>
  </div>

  {/* Search and filter bar */}
  <div className="border-b border-gray-200 px-4 py-3 bg-gray-50">
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Search documents..."
        />
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-2">
        <div className="relative">
          <select className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-md leading-tight focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm">
            <option>All Projects</option>
            <option>BilliMD</option>
            <option>Marketing Site</option>
            <option>Mobile App</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <div className="relative">
          <select className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-md leading-tight focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm">
            <option>All Tasks</option>
            <option>Design</option>
            <option>Development</option>
            <option>QA</option>
            <option>Documentation</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <div className="relative">
          <select className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-md leading-tight focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm">
            <option>All Users</option>
            <option>John Doe</option>
            <option>Jane Smith</option>
            <option>Alex Johnson</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </button>
      </div>
    </div>
  </div>

  {/* Documents Table */}
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            <input type="checkbox" className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Name
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Project
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Task
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Uploaded By
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Date
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Size
          </th>
          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {/* Document 1 */}
        <tr className="hover:bg-gray-50">
          <td className="px-6 py-4 whitespace-nowrap">
            <input type="checkbox" className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <svg className="flex-shrink-0 h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-900">Project_Specification.pdf</div>
                <div className="text-sm text-gray-500">Document</div>
              </div>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-900">BilliMD</div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
              Requirements
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <img className="h-6 w-6 rounded-full" src="https://i.pravatar.cc/150?img=1" alt="" />
              <div className="ml-2">
                <div className="text-sm font-medium text-gray-900">John Doe</div>
              </div>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            2024-03-15
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            2.4 MB
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <button className="text-blue-600 hover:text-blue-900 mr-3">Preview</button>
            <button className="text-blue-600 hover:text-blue-900">Download</button>
          </td>
        </tr>

        {/* Document 2 */}
        <tr className="hover:bg-gray-50">
          <td className="px-6 py-4 whitespace-nowrap">
            <input type="checkbox" className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <svg className="flex-shrink-0 h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-900">UI_Mockups_Final.sketch</div>
                <div className="text-sm text-gray-500">Design File</div>
              </div>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-900">BilliMD</div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
              UI Design
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <img className="h-6 w-6 rounded-full" src="https://i.pravatar.cc/150?img=2" alt="" />
              <div className="ml-2">
                <div className="text-sm font-medium text-gray-900">Jane Smith</div>
              </div>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            2024-03-20
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            8.7 MB
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <button className="text-blue-600 hover:text-blue-900 mr-3">Preview</button>
            <button className="text-blue-600 hover:text-blue-900">Download</button>
          </td>
        </tr>

        {/* Document 3 */}
        <tr className="hover:bg-gray-50">
          <td className="px-6 py-4 whitespace-nowrap">
            <input type="checkbox" className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <svg className="flex-shrink-0 h-5 w-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-900">Test_Cases.xlsx</div>
                <div className="text-sm text-gray-500">Spreadsheet</div>
              </div>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-900">BilliMD</div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
              QA Testing
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <img className="h-6 w-6 rounded-full" src="https://i.pravatar.cc/150?img=3" alt="" />
              <div className="ml-2">
                <div className="text-sm font-medium text-gray-900">Alex Johnson</div>
              </div>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            2024-04-05
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            1.2 MB
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <button className="text-blue-600 hover:text-blue-900 mr-3">Preview</button>
            <button className="text-blue-600 hover:text-blue-900">Download</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  {/* Pagination */}
  <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
      <div>
        <p className="text-sm text-gray-700">
          Showing <span className="font-medium">1</span> to <span className="font-medium">3</span> of{' '}
          <span className="font-medium">24</span> results
        </p>
      </div>
      <div>
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          <a
            href="#"
            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            <span className="sr-only">Previous</span>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </a>
          <a
            href="#"
            aria-current="page"
            className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
          >
            1
          </a>
          <a
            href="#"
            className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
          >
            2
          </a>
          <a
            href="#"
            className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
          >
            3
          </a>
          <a
            href="#"
            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            <span className="sr-only">Next</span>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </nav>
      </div>
    </div>
  </div>
</div>
        );
        case "settings":
        return (
         <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200 transition-all">
  {/* Header */}
  <div className="border-b border-gray-200 px-6 py-4">
    <h2 className="text-xl font-semibold text-gray-900">Project Settings</h2>
    <p className="text-sm text-gray-500 mt-1">Configure your project details, permissions, and integrations</p>
  </div>

  {/* Sidebar Navigation + Content */}
  <div className="flex">
    {/* Sidebar Navigation */}
    <div className="w-56 border-r border-gray-200 bg-gray-50 p-4">
      <nav className="space-y-1">
        <button className="w-full text-left px-3 py-2 bg-blue-100 text-blue-700 rounded-md text-sm font-medium">
          General
        </button>
        <button className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md text-sm font-medium">
          Members & Permissions
        </button>
        <button className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md text-sm font-medium">
          Workflows
        </button>
        <button className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md text-sm font-medium">
          Custom Fields
        </button>
        <button className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md text-sm font-medium">
          Task Templates
        </button>
        <button className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md text-sm font-medium">
          Integrations
        </button>
        <button className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md text-sm font-medium">
          Automation
        </button>
        <button className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md text-sm font-medium">
          Export/Import
        </button>
        <button className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md text-sm font-medium">
          Notifications
        </button>
        <button className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-md text-sm font-medium mt-4">
          Danger Zone
        </button>
      </nav>
    </div>

    {/* Main Content - General Settings (default view) */}
    <div className="flex-1 p-6">
      {/* Project Information */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Project Information</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="project-name" className="block text-sm font-medium text-gray-700 mb-1">
              Project Name
            </label>
            <input
              type="text"
              id="project-name"
              defaultValue="BilliMD"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            />
          </div>
          <div>
            <label htmlFor="project-key" className="block text-sm font-medium text-gray-700 mb-1">
              Project Key
            </label>
            <input
              type="text"
              id="project-key"
              defaultValue="BMD"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border bg-gray-100"
              disabled
            />
          </div>
          <div>
            <label htmlFor="project-owner" className="block text-sm font-medium text-gray-700 mb-1">
              Project Owner
            </label>
            <select
              id="project-owner"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            >
              <option>John Doe (Product Manager)</option>
              <option>Jane Smith (Engineering Lead)</option>
              <option>Alex Johnson (CTO)</option>
            </select>
          </div>
          <div>
            <label htmlFor="project-category" className="block text-sm font-medium text-gray-700 mb-1">
              Project Category
            </label>
            <select
              id="project-category"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            >
              <option>Software Development</option>
              <option>Marketing</option>
              <option>Operations</option>
              <option>Research</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="project-description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="project-description"
            rows={3}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            defaultValue="Healthcare platform for medical bill management and analytics"
          />
        </div>
      </div>

      {/* Project Visibility */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Visibility & Access</h3>
        <fieldset>
          <legend className="sr-only">Visibility</legend>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                id="visibility-public"
                name="visibility"
                type="radio"
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                defaultChecked
              />
              <label htmlFor="visibility-public" className="ml-3 block text-sm font-medium text-gray-700">
                <span className="flex items-center">
                  <span>Public</span>
                  <span className="ml-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Recommended
                  </span>
                </span>
                <span className="text-gray-500 text-xs">All organization members can view this project</span>
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="visibility-private"
                name="visibility"
                type="radio"
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="visibility-private" className="ml-3 block text-sm font-medium text-gray-700">
                Private
                <span className="text-gray-500 text-xs">Only project members can view this project</span>
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="visibility-secret"
                name="visibility"
                type="radio"
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="visibility-secret" className="ml-3 block text-sm font-medium text-gray-700">
                Secret
                <span className="text-gray-500 text-xs">Only visible to people with the direct link</span>
              </label>
            </div>
          </div>
        </fieldset>
      </div>

      {/* Project Timeline */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Timeline</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              id="start-date"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            />
          </div>
          <div>
            <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
              Target End Date
            </label>
            <input
              type="date"
              id="end-date"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <input
            id="time-tracking"
            name="time-tracking"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="time-tracking" className="ml-2 block text-sm text-gray-700">
            Enable time tracking for this project
          </label>
        </div>
      </div>

      {/* Project Features */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Enabled Features</h3>
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="feature-tasks"
                name="feature-tasks"
                type="checkbox"
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                defaultChecked
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="feature-tasks" className="font-medium text-gray-700">
                Tasks
              </label>
              <p className="text-gray-500">Enable task management for this project</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="feature-milestones"
                name="feature-milestones"
                type="checkbox"
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                defaultChecked
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="feature-milestones" className="font-medium text-gray-700">
                Milestones
              </label>
              <p className="text-gray-500">Track major project milestones</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="feature-docs"
                name="feature-docs"
                type="checkbox"
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                defaultChecked
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="feature-docs" className="font-medium text-gray-700">
                Documentation
              </label>
              <p className="text-gray-500">Enable project wiki and document storage</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="feature-calendar"
                name="feature-calendar"
                type="checkbox"
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="feature-calendar" className="font-medium text-gray-700">
                Calendar
              </label>
              <p className="text-gray-500">Enable project calendar view</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
</div>
        );

      default:
        return <div>Select a tab to view content</div>;
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[var(--theme-background)]  flex">
        {/* Sidebar */}
        <div className="w-16 bg-white shadow-sm flex flex-col items-center py-4">
          {/* Planning Section */}
          <div className="flex flex-col items-center space-y-6">
            <button
              className={`p-2 rounded-lg ${
                activeContentTab === "summary"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
              onClick={() => setActiveContentTab("summary")}
              title="Summary"
            >
              <ClipboardList className="w-5 h-5" />
            </button>
            <button
              className={`p-2 rounded-lg ${
                activeContentTab === "timeline"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
              onClick={() => setActiveContentTab("timeline")}
              title="Timeline"
            >
              <TimelineIcon className="w-5 h-5" />
            </button>
            <button
              className={`p-2 rounded-lg ${
                activeContentTab === "board"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
              onClick={() => setActiveContentTab("board")}
              title="Board"
            >
              <BoardIcon className="w-5 h-5" />
            </button>
            <button
              className={`p-2 rounded-lg ${
                activeContentTab === "calendar"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
              onClick={() => setActiveContentTab("calendar")}
              title="Calendar"
            >
              <CalendarIcon className="w-5 h-5" />
            </button>
            <button
              className={`p-2 rounded-lg ${
                activeContentTab === "list"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
              onClick={() => setActiveContentTab("list")}
              title="List"
            >
              <ListIcon className="w-5 h-5" />
            </button>
          
            <button
              className={`p-2 rounded-lg ${
                activeContentTab === "goals"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
              onClick={() => setActiveContentTab("goals")}
              title="Goals"
            >
              <Trophy className="w-5 h-5" />
            </button>
           
            <button
              className={`p-2 rounded-lg ${
                activeContentTab === "documents"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
              onClick={() => setActiveContentTab("documents")}
              title="Documents"
            >
              <FileImage className="w-5 h-5" />
            </button>
            <button
              className={`p-2 rounded-lg ${
                activeContentTab === "settings"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
              onClick={() => setActiveContentTab("settings")}
              title="Settings"
            >
              <SettingsIcon className="w-5 h-5" />
            </button>
             <button
              className={`p-2 rounded-lg ${
                activeContentTab === "issues"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
              onClick={() => setActiveContentTab("issues")}
              title="Issues"
            >
              <IssuesIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white shadow-sm  sticky top-0 z-0">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-6">
                  <nav className="flex space-x-1">
                    {/* <button
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      activeContentTab === "Dashboards"
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveContentTab("Dashboards")}
                  >
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboards
                  </button> */}

                    {/* <Link href={`/manageprojects/reports/${"flexcraft-workspace"}`}>
  View Post
</Link> */}
                    <button
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                        activeContentTab === "Your work"
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                      } cursor-pointer`}
                      onClick={() => setActiveContentTab("Your work")}
                    >
                      <Home className="w-4 h-4 mr-2" />
                      Your work
                    </button>
                    <button
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                        activeContentTab === "Tasks"
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                      } cursor-pointer`}
                      onClick={() => setActiveContentTab("Tasks")}
                    >
                      <Folder className="w-4 h-4 mr-2" />
                      Tasks
                    </button>
                    <button
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                        activeContentTab === "Backlogs"
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                      } cursor-pointer`}
                      onClick={() => setActiveContentTab("Backlogs")}
                    >
                      <ClipboardList className="w-4 h-4 mr-2" />
                      Backlogs
                    </button>
                    {/* <button
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      activeContentTab === "Filters"
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveContentTab("Filters")}
                  >
                    <Sliders className="w-4 h-4 mr-2" />
                    Filters
                  </button> */}

                    <button
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                        activeContentTab === "Teams"
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                      } cursor-pointer`}
                      onClick={() => setActiveContentTab("Teams")}
                    >
                      <TeamIcon className="w-4 h-4 mr-2" />
                      Teams
                    </button>
                    {/* <button
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      activeContentTab === "Plans"
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveContentTab("Plans")}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Plans
                  </button> */}
                    <button
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                        activeContentTab === "Apps"
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                      } cursor-pointer`}
                      onClick={() => setActiveContentTab("Apps")}
                    >
                      <Grid className="w-4 h-4 mr-2" />
                      Apps
                    </button>
                    <button
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                        activeContentTab === "Bugs"
                          ? "bg-blue-50 text-red-500"
                          : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                      } cursor-pointer`}
                      onClick={() => setActiveContentTab("Bugs")}
                    >
                      <BugIcon className="w-4 h-4 mr-2" />
                      Bugs
                    </button>
                    <button
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                        activeContentTab === "Docs"
                          ? "bg-blue-50 text-blue-500"
                          : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                      }`}
                      onClick={() => setActiveContentTab("Docs")}
                    >
                      <File className="w-4 h-4 mr-2" />
                      Docs
                    </button>
                  </nav>
                </div>

                <div className="ml-4 flex items-center space-x-4">
                  {/* <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full" onClick={toggleSearch}>
                  <Search className="w-5 h-5" /> 
                </button> */}
                  {/* {isSearchOpen && (
                  <input
                    type="text"
                    className="ml-2 p-1 border rounded"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                )} */}
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                    <Bell className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                    <HelpCircle className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                    <Settings className="w-5 h-5" />
                  </button>
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                    JD
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className="overflow-auto p-6 ">
            <div className="flex">
              {/* Main Content */}

              <div
                className={`flex-1 transition-opacity duration-200 ${
                  isCreatingTask ? "opacity-40 pointer-events-none" : ""
                }`}
              >
                {renderContent()}
              </div>
            </div>
          </div>
        </div>

        {/* Task Creation Modal */}
        {isCreatingTask && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ background: "rgba(0,0,0,0.05)" }}
          >
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-medium mb-4">Create New Task</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Task Title
                  </label>
                  <input
                    type="text"
                    placeholder="Task title"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none  "
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
                    placeholder="Task description"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none "
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none "
                      value={newTaskType}
                      onChange={(e) => setNewTaskType(e.target.value as any)}
                    >
                      <option value="task">Task</option>
                      <option value="bug">Bug</option>
                      <option value="story">Story</option>
                      <option value="epic">Epic</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none  "
                      value={newTaskPriority}
                      onChange={(e) =>
                        setNewTaskPriority(e.target.value as any)
                      }
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                  onClick={() => setIsCreatingTask(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  onClick={handleAddTask}
                >
                  Create Task
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Task Detail Modal */}
        {selectedTask && (
          <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span
                    className={`inline-block w-3 h-3 rounded-full ${getTypeColor(
                      selectedTask.type
                    )} mr-2`}
                  ></span>
                  <span className="text-lg font-bold">
                    {selectedTask.title}
                  </span>
                </div>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={closeTaskDetails}
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2">
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Description
                    </h3>
                    <p className="text-gray-800">
                      {selectedTask.description || "No description provided"}
                    </p>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-3">
                      Activity
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-gray-300 mr-3"></div>
                        <div>
                          <p className="text-sm font-medium">John Doe</p>
                          <p className="text-sm text-gray-500">
                            Updated the status to In Progress
                          </p>
                          <p className="text-xs text-gray-400">2 hours ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <span className="text-gray-500 w-24">Status:</span>
                        <span className="font-medium">
                          {selectedTask.status}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-500 w-24">Assignee:</span>
                        <span className="font-medium">
                          {selectedTask.assignee}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-500 w-24">Priority:</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(
                            selectedTask.priority
                          )}`}
                        >
                          {selectedTask.priority}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-500 w-24">Due Date:</span>
                        <span className="font-medium">
                          {selectedTask.dueDate}
                        </span>
                      </div>
                      {selectedTask.storyPoints && (
                        <div className="flex items-center">
                          <span className="text-gray-500 w-24">
                            Story Points:
                          </span>
                          <span className="font-medium">
                            {selectedTask.storyPoints}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Labels
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTask.labels?.map((label) => (
                        <span
                          key={label}
                          className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                        >
                          {label}
                        </span>
                      ))}
                      {(!selectedTask.labels ||
                        selectedTask.labels.length === 0) && (
                        <span className="text-gray-400 text-sm">No labels</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Attachments
                    </h3>
                    {selectedTask.attachments ? (
                      <div className="flex items-center text-sm text-gray-600">
                        <Paperclip className="w-4 h-4 mr-2" />
                        <span>{selectedTask.attachments} files attached</span>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">
                        No attachments
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
};

export default JiraLikeProjectManagement;
