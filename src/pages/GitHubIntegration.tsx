import React, { useState } from "react";
import {
  GitBranch,
  GitPullRequest,
  GitCommit,
  MessageSquare,
  Star,
  Eye,
  Code,
  AlertCircle,
  CheckCircle,
  Clock,
  GitMerge,
  Settings,
  RefreshCw,
  Plus,
  Filter,
  Search,
  ChevronDown,
  MoreHorizontal,
  GitFork,
} from "lucide-react";

interface Repository {
  id: string;
  name: string;
  description: string;
  stars: number;
  forks: number;
  watchers: number;
  lastUpdated: string;
  language: string;
  openIssues: number;
  isPrivate: boolean;
}

interface PullRequest {
  id: string;
  title: string;
  author: string;
  status: "open" | "merged" | "closed" | "draft";
  updatedAt: string;
  comments: number;
  commits: number;
  checks?: {
    status: "success" | "failure" | "pending";
    count: number;
  };
}

interface Issue {
  id: string;
  title: string;
  author: string;
  status: "open" | "closed";
  labels: string[];
  updatedAt: string;
  comments: number;
}

const GitHubIntegration = () => {
  const [activeTab, setActiveTab] = useState<
    "repos" | "prs" | "issues" | "actions"
  >("repos");
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [repositories] = useState<Repository[]>([
    {
      id: "1",
      name: "enterprise-saas",
      description: "Enterprise SaaS Platform with AI capabilities",
      stars: 25,
      forks: 12,
      watchers: 8,
      lastUpdated: "2024-03-15",
      language: "TypeScript",
      openIssues: 3,
      isPrivate: false,
    },
    {
      id: "2",
      name: "mobile-app",
      description: "React Native mobile application",
      stars: 15,
      forks: 5,
      watchers: 4,
      lastUpdated: "2024-03-10",
      language: "JavaScript",
      openIssues: 2,
      isPrivate: true,
    },
    {
      id: "3",
      name: "docs",
      description: "Project documentation and guides",
      stars: 8,
      forks: 3,
      watchers: 2,
      lastUpdated: "2024-03-18",
      language: "Markdown",
      openIssues: 0,
      isPrivate: false,
    },
    {
      id: "4",
      name: "api-gateway",
      description: "Microservices API gateway",
      stars: 42,
      forks: 18,
      watchers: 15,
      lastUpdated: "2024-03-16",
      language: "Go",
      openIssues: 5,
      isPrivate: true,
    },
  ]);

  const [pullRequests] = useState<PullRequest[]>([
    {
      id: "1",
      title: "Add authentication system",
      author: "johndoe",
      status: "open",
      updatedAt: "2024-03-15",
      comments: 4,
      commits: 3,
      checks: {
        status: "success",
        count: 5,
      },
    },
    {
      id: "2",
      title: "Implement chat feature",
      author: "janesmith",
      status: "merged",
      updatedAt: "2024-03-14",
      comments: 12,
      commits: 8,
    },
    {
      id: "3",
      title: "Update documentation",
      author: "alexjohnson",
      status: "draft",
      updatedAt: "2024-03-16",
      comments: 0,
      commits: 1,
    },
    {
      id: "4",
      title: "Fix database connection leaks",
      author: "dbadmin",
      status: "open",
      updatedAt: "2024-03-17",
      comments: 7,
      commits: 4,
      checks: {
        status: "pending",
        count: 3,
      },
    },
  ]);

  const [issues] = useState<Issue[]>([
    {
      id: "1",
      title: "Fix login page responsive issues",
      author: "design-team",
      status: "open",
      labels: ["bug", "frontend"],
      updatedAt: "2024-03-12",
      comments: 3,
    },
    {
      id: "2",
      title: "Add dark mode support",
      author: "ux-team",
      status: "open",
      labels: ["enhancement"],
      updatedAt: "2024-03-10",
      comments: 8,
    },
    {
      id: "3",
      title: "API timeout under heavy load",
      author: "devops",
      status: "closed",
      labels: ["bug", "backend"],
      updatedAt: "2024-03-05",
      comments: 15,
    },
    {
      id: "4",
      title: "Improve test coverage for authentication",
      author: "qa-team",
      status: "open",
      labels: ["testing", "security"],
      updatedAt: "2024-03-17",
      comments: 2,
    },
  ]);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 1500);
  };

  const renderStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="w-4 h-4 text-green-600" />;
      case "closed":
        return <CheckCircle className="w-4 h-4 text-purple-600" />;
      case "merged":
        return <GitMerge className="w-4 h-4 text-purple-600" />;
      case "draft":
        return <Clock className="w-4 h-4 text-gray-600" />;
      default:
        return null;
    }
  };

  const filteredRepositories = repositories.filter(repo =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    repo.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPullRequests = pullRequests.filter(pr =>
    pr.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pr.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredIssues = issues.filter(issue =>
    issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    issue.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    issue.labels.some(label => label.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-800">GitHub Integration</h1>
            <span className="px-2.5 py-0.5 text-xs rounded-full bg-green-100 text-green-800 flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
              Connected
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className={`flex items-center px-3 py-1.5 rounded-md bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 ${
                isSyncing ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isSyncing ? "animate-spin" : ""}`}
              />
              <span>Sync</span>
            </button>
            <button className="flex items-center px-3 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              <span>Connect Repo</span>
            </button>
            <button className="flex items-center px-3 py-1.5 rounded-md bg-white border border-gray-200 hover:bg-gray-50 text-gray-700">
              <Settings className="w-4 h-4 mr-2" />
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* Connection Alert */}
        {!isConnected && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Your GitHub connection needs attention.{" "}
                  <a
                    href="#"
                    className="font-medium underline text-yellow-700 hover:text-yellow-600"
                  >
                    Reconnect now
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="mb-6">
          <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-200">
            <button
              onClick={() => setActiveTab("repos")}
              className={`py-3 px-4 font-medium text-sm flex items-center whitespace-nowrap ${
                activeTab === "repos"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <GitBranch className="w-4 h-4 mr-2" />
              Repositories
              <span className="ml-2 bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 text-xs">
                {repositories.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("prs")}
              className={`py-3 px-4 font-medium text-sm flex items-center whitespace-nowrap ${
                activeTab === "prs"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <GitPullRequest className="w-4 h-4 mr-2" />
              Pull Requests
              <span className="ml-2 bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 text-xs">
                {pullRequests.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("issues")}
              className={`py-3 px-4 font-medium text-sm flex items-center whitespace-nowrap ${
                activeTab === "issues"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              Issues
              <span className="ml-2 bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 text-xs">
                {issues.filter(i => i.status === "open").length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("actions")}
              className={`py-3 px-4 font-medium text-sm flex items-center whitespace-nowrap ${
                activeTab === "actions"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actions
            </button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button className="flex items-center px-3 py-2 rounded-md bg-white border border-gray-300 hover:bg-gray-50 text-gray-700">
              <Filter className="w-4 h-4 mr-2" />
              <span>Filter</span>
              <ChevronDown className="w-4 h-4 ml-1" />
            </button>
            {selectedRepo && (
              <button
                onClick={() => setSelectedRepo(null)}
                className="px-3 py-2 text-sm rounded-md bg-white border border-gray-300 hover:bg-gray-50 text-gray-700"
              >
                Clear selection
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Repositories Tab */}
          {activeTab === "repos" && (
            <div className="divide-y divide-gray-200">
              {filteredRepositories.length > 0 ? (
                filteredRepositories.map((repo) => (
                  <div
                    key={repo.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      selectedRepo === repo.id ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-medium text-gray-900 truncate">
                            {repo.name}
                          </h3>
                          {repo.isPrivate && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800">
                              Private
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mt-1 text-sm">{repo.description}</p>
                        
                        <div className="flex flex-wrap items-center mt-3 gap-3 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Code className="w-4 h-4 mr-1.5" />
                            {repo.language}
                          </span>
                          <span className="flex items-center">
                            <Star className="w-4 h-4 mr-1.5" />
                            {repo.stars}
                          </span>
                          <span className="flex items-center">
                            <GitFork className="w-4 h-4 mr-1.5" />
                            {repo.forks}
                          </span>
                          <span className="flex items-center">
                            <Eye className="w-4 h-4 mr-1.5" />
                            {repo.watchers}
                          </span>
                          <span className="flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1.5" />
                            {repo.openIssues}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            Updated {formatDate(repo.lastUpdated)}
                          </span>
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                        </div>
                        <button 
                          className="text-sm text-blue-600 hover:text-blue-800 hover:underline whitespace-nowrap"
                          onClick={() => window.open(`https://github.com/your-account/${repo.name}`, '_blank')}
                        >
                          View on GitHub
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No repositories found matching your search.
                </div>
              )}
            </div>
          )}

          {/* Pull Requests Tab */}
          {activeTab === "prs" && (
            <div className="divide-y divide-gray-200">
              {filteredPullRequests.length > 0 ? (
                filteredPullRequests.map((pr) => (
                  <div key={pr.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {renderStatusIcon(pr.status)}
                          <h3 className="font-medium text-gray-900 truncate">
                            {pr.title}
                          </h3>
                        </div>
                        <p className="text-gray-600 mt-1 text-sm">
                          #{pr.id} opened by {pr.author} • Updated {formatDate(pr.updatedAt)}
                        </p>
                        
                        {pr.checks && (
                          <div className="mt-2">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                pr.checks.status === "success"
                                  ? "bg-green-100 text-green-800"
                                  : pr.checks.status === "failure"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {pr.checks.status === "success"
                                ? "All checks passed"
                                : pr.checks.status === "failure"
                                ? "Checks failed"
                                : "Checks pending"}{" "}
                              ({pr.checks.count})
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <span
                          className={`px-2 py-1 text-xs rounded capitalize self-start sm:self-auto ${
                            pr.status === "open"
                              ? "bg-green-100 text-green-800"
                              : pr.status === "merged"
                              ? "bg-purple-100 text-purple-800"
                              : pr.status === "closed"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {pr.status}
                        </span>
                        
                        <div className="flex items-center gap-4 text-sm">
                          <button className="flex items-center text-gray-600 hover:text-gray-900">
                            <GitCommit className="w-4 h-4 mr-1.5" />
                            <span>{pr.commits}</span>
                          </button>
                          <button className="flex items-center text-gray-600 hover:text-gray-900">
                            <MessageSquare className="w-4 h-4 mr-1.5" />
                            <span>{pr.comments}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No pull requests found matching your search.
                </div>
              )}
            </div>
          )}

          {/* Issues Tab */}
          {activeTab === "issues" && (
            <div className="divide-y divide-gray-200">
              {filteredIssues.length > 0 ? (
                filteredIssues.map((issue) => (
                  <div key={issue.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {renderStatusIcon(issue.status)}
                          <h3 className="font-medium text-gray-900 truncate">
                            {issue.title}
                          </h3>
                        </div>
                        
                        <div className="mt-1 flex flex-wrap gap-2">
                          {issue.labels.map((label) => (
                            <span
                              key={label}
                              className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800"
                            >
                              {label}
                            </span>
                          ))}
                        </div>
                        
                        <p className="text-gray-600 mt-1 text-sm">
                          #{issue.id} opened by {issue.author} • Updated {formatDate(issue.updatedAt)}
                        </p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <span
                          className={`px-2 py-1 text-xs rounded capitalize self-start sm:self-auto ${
                            issue.status === "open"
                              ? "bg-green-100 text-green-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {issue.status}
                        </span>
                        
                        <div className="flex items-center gap-4 text-sm">
                          <button className="flex items-center text-gray-600 hover:text-gray-900">
                            <MessageSquare className="w-4 h-4 mr-1.5" />
                            <span>{issue.comments}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No issues found matching your search.
                </div>
              )}
            </div>
          )}

          {/* Actions Tab */}
          {activeTab === "actions" && (
            <div className="p-8 text-center">
              <div className="mx-auto max-w-md">
                <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <RefreshCw className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="mt-3 text-lg font-medium text-gray-900">
                  GitHub Actions
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  View and manage your GitHub Actions workflows. Connect a repository to get started.
                </p>
                <div className="mt-6">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <Plus className="-ml-1 mr-2 h-5 w-5" />
                    Connect Repository
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GitHubIntegration;