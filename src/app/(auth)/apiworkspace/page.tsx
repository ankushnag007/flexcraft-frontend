"use client"
import React, { useState, useEffect } from 'react';
import { 
  Send, Play, Plus, Minus, ChevronDown, ChevronRight, 
  Code, Settings, Save, Folder, History, Trash2, 
  Copy, RefreshCw, Download, Upload, Key, Eye, EyeOff,
  Terminal, Globe, Clock, Layers, Bookmark, User, 
  Lock, Sliders, Zap, Hash, Bell, Star, Tag, Menu,
  X, Search, MoreVertical, Edit3, FolderPlus, Import,
  Share2, BookOpen, Maximize2, Minimize2, Filter,
  ArrowUpRight, Activity, Database, Shield
} from 'lucide-react';

interface FormDataField {
  key: string;
  value: string;
  type: 'text' | 'file';
  file?: File;
  enabled: boolean;
}

interface Param {
  id: number;
  key: string;
  value: string;
  enabled: boolean;
}

interface SavedRequest {
  id: number;
  name: string;
  method: string;
  url: string;
  headers?: string;
  body?: string;
  folder?: string;
}

interface Environment {
  id: number;
  name: string;
  variables: Record<string, string>;
  active?: boolean;
}

const ApiWorkspace = () => {
  // Core request state
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/posts');
  const [headers, setHeaders] = useState(JSON.stringify({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-token-here'
  }, null, 2));
  const [body, setBody] = useState(JSON.stringify({
    title: 'foo',
    body: 'bar',
    userId: 1
  }, null, 2));
  const [response, setResponse] = useState('');
  
  // UI state
  const [activeTab, setActiveTab] = useState('headers');
  const [responseView, setResponseView] = useState('body');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [requestName, setRequestName] = useState('New Request');
  const [loading, setLoading] = useState(false);
  
  // Sidebar sections state
  const [collectionsOpen, setCollectionsOpen] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(true);
  const [environmentsOpen, setEnvironmentsOpen] = useState(false);
  
  // Form data and parameters
  const [params, setParams] = useState<Param[]>([
    { id: 1, key: 'page', value: '1', enabled: true },
    { id: 2, key: 'limit', value: '10', enabled: true }
  ]);
  const [formData, setFormData] = useState<FormDataField[]>([]);
  
  // Auth state
  const [showAuth, setShowAuth] = useState(false);
  const [authType, setAuthType] = useState('bearer');
  const [bearerToken, setBearerToken] = useState('your-token-here');
  const [basicUsername, setBasicUsername] = useState('');
  const [basicPassword, setBasicPassword] = useState('');
  
  // Response state
  const [responseTime, setResponseTime] = useState(0);
  const [responseSize, setResponseSize] = useState(0);
  const [responseStatus, setResponseStatus] = useState(0);
  const [responseHeaders, setResponseHeaders] = useState({});
  
  // Collections and environments
  const [savedRequests, setSavedRequests] = useState<SavedRequest[]>([
    { id: 1, name: 'Get Posts', method: 'GET', url: 'https://jsonplaceholder.typicode.com/posts', folder: 'JSONPlaceholder' },
    { id: 2, name: 'Create Post', method: 'POST', url: 'https://jsonplaceholder.typicode.com/posts', folder: 'JSONPlaceholder' },
    { id: 3, name: 'Update Post', method: 'PUT', url: 'https://jsonplaceholder.typicode.com/posts/1', folder: 'JSONPlaceholder' },
    { id: 4, name: 'Delete Post', method: 'DELETE', url: 'https://jsonplaceholder.typicode.com/posts/1', folder: 'JSONPlaceholder' }
  ]);
  
  const [environments, setEnvironments] = useState<Environment[]>([
    { id: 1, name: 'Development', variables: { baseUrl: 'http://dev.example.com', apiKey: 'dev-key' }, active: false },
    { id: 2, name: 'Production', variables: { baseUrl: 'https://api.example.com', apiKey: 'prod-key' }, active: true },
    { id: 3, name: 'Local', variables: { baseUrl: 'http://localhost:3000', apiKey: 'local-key' }, active: false }
  ]);

  // cURL and import state
  const [curlImport, setCurlImport] = useState('');
  
  // History
  const [requestHistory, setRequestHistory] = useState([
    { id: 1, method: 'GET', url: 'https://api.example.com/users', timestamp: new Date() },
    { id: 2, method: 'POST', url: 'https://api.example.com/posts', timestamp: new Date() },
    { id: 3, method: 'PUT', url: 'https://api.example.com/users/1', timestamp: new Date() }
  ]);

  // Folders
  const [folders] = useState([
    { id: 1, name: 'JSONPlaceholder', requests: [1, 2, 3, 4] },
    { id: 2, name: 'Auth Tests', requests: [] },
    { id: 3, name: 'User Management', requests: [] }
  ]);

  const handleSend = async () => {
    setLoading(true);
    try {
      const requestHeaders: Record<string, string> = headers ? JSON.parse(headers) : {};
      
      // Add auth headers
      if (authType === 'bearer' && bearerToken) {
        requestHeaders['Authorization'] = `Bearer ${bearerToken}`;
      } else if (authType === 'basic' && basicUsername && basicPassword) {
        const credentials = btoa(`${basicUsername}:${basicPassword}`);
        requestHeaders['Authorization'] = `Basic ${credentials}`;
      }

      const options: RequestInit = {
        method,
        headers: requestHeaders,
        body: ['GET', 'HEAD'].includes(method) ? undefined : body
      };

      const startTime = performance.now();
      const res = await fetch(url, options);
      const endTime = performance.now();
      
      const responseText = await res.text();
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch {
        responseData = responseText;
      }
      
      const responseSize = responseText.length;
      
      setResponseTime(Number((endTime - startTime).toFixed(2)));
      setResponseSize(responseSize);
      setResponseStatus(res.status);
      setResponseHeaders(Object.fromEntries(res.headers.entries()));
      
      setResponse(JSON.stringify({
        status: res.status,
        statusText: res.statusText,
        time: `${(endTime - startTime).toFixed(2)}ms`,
        size: `${(responseSize / 1024).toFixed(2)}KB`,
        headers: Object.fromEntries(res.headers.entries()),
        data: responseData
      }, null, 2));

      // Add to history
      const historyItem = {
        id: Date.now(),
        method,
        url,
        timestamp: new Date()
      };
      setRequestHistory(prev => [historyItem, ...prev.slice(0, 9)]); // Keep last 10
      
    } catch (error) {
      setResponse(JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error'
      }, null, 2));
      setResponseStatus(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRequest = () => {
    const newRequest = {
      id: Date.now(),
      name: requestName,
      method,
      url,
      headers,
      body,
      folder: 'Saved Requests'
    };
    setSavedRequests([...savedRequests, newRequest]);
  };

  const loadRequest = (request: SavedRequest) => {
    setMethod(request.method);
    setUrl(request.url);
    setRequestName(request.name);
    if (request.headers) setHeaders(request.headers);
    if (request.body) setBody(request.body);
  };

  const addNewParam = () => {
    setParams([...params, { id: Date.now(), key: '', value: '', enabled: true }]);
  };

  const updateParam = (id: number, field: string, value: string) => {
    setParams(params.map(param => 
      param.id === id ? { ...param, [field]: value } : param
    ));
  };

  const removeParam = (id: number) => {
    setParams(params.filter(param => param.id !== id));
  };

  const toggleParam = (id: number) => {
    setParams(params.map(param => 
      param.id === id ? { ...param, enabled: !param.enabled } : param
    ));
  };

  const addFormDataField = () => {
    setFormData([...formData, { key: '', value: '', type: 'text', enabled: true }]);
  };

  const updateFormData = (index: number, field: keyof FormDataField, value: string) => {
    const newFormData = [...formData];
    if (field === 'type' && (value === 'text' || value === 'file')) {
      newFormData[index][field] = value;
    } else if (field !== 'type') {
      (newFormData[index] as any)[field] = value;
    }
    setFormData(newFormData);
  };

  const removeFormDataField = (index: number) => {
    setFormData(formData.filter((_, i) => i !== index));
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'bg-green-100 text-green-800 border-green-200';
    if (status >= 300 && status < 400) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (status >= 400 && status < 500) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (status >= 500) return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getMethodColor = (method: string) => {
    const colors = {
      GET: 'bg-green-600 text-white',
      POST: 'bg-yellow-600 text-white',
      PUT: 'bg-blue-600 text-white',
      PATCH: 'bg-purple-600 text-white',
      DELETE: 'bg-red-600 text-white'
    };
    return colors[method as keyof typeof colors] || 'bg-gray-600 text-white';
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const prettifyJson = () => {
    try {
      const parsed = JSON.parse(response);
      setResponse(JSON.stringify(parsed, null, 2));
    } catch (e) {
      // Not valid JSON
    }
  };

  const generateCurlCommand = () => {
    let curl = `curl -X ${method}`;
    
    if (headers) {
      try {
        const headerObj = JSON.parse(headers);
        Object.entries(headerObj).forEach(([key, value]) => {
          curl += ` \\\n  -H "${key}: ${value}"`;
        });
      } catch (e) {
        // Invalid JSON headers
      }
    }
    
    if (body && !['GET', 'HEAD'].includes(method)) {
      curl += ` \\\n  -d '${body}'`;
    }
    
    curl += ` \\\n  "${url}"`;
    
    return curl;
  };

  const setActiveEnvironment = (id: number) => {
    setEnvironments(environments.map(env => ({ ...env, active: env.id === id })));
  };

  const groupedRequests = folders.map(folder => ({
    ...folder,
    requests: savedRequests.filter(req => req.folder === folder.name)
  }));

  return (
    <div className="flex h-screen bg-white text-gray-900 overflow-hidden">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-80'} bg-gray-50 border-r border-gray-200 flex flex-col transition-all duration-300`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 hover:bg-gray-100 rounded-lg mr-2"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              {!sidebarCollapsed && (
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">API Workspace</h1>
                  <p className="text-xs text-gray-500">Professional API Testing</p>
                </div>
              )}
            </div>
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-1">
                <button className="p-2 hover:bg-gray-100 rounded-lg" title="Import">
                  <Import className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg" title="Settings">
                  <Settings className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            )}
          </div>
        </div>

        {!sidebarCollapsed && (
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search requests..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Environment Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Environment</label>
              <select
                value={environments.find(env => env.active)?.id || 1}
                onChange={(e) => setActiveEnvironment(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {environments.map(env => (
                  <option key={env.id} value={env.id}>{env.name}</option>
                ))}
              </select>
            </div>

            {/* Collections */}
            <div>
              <div 
                className="flex items-center justify-between cursor-pointer mb-3 group"
                onClick={() => setCollectionsOpen(!collectionsOpen)}
              >
                <div className="flex items-center">
                  <Folder className="w-5 h-5 mr-2 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Collections</h3>
                </div>
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1 hover:bg-gray-200 rounded">
                    <FolderPlus className="w-4 h-4 text-gray-500" />
                  </button>
                  {collectionsOpen ? <ChevronDown className="w-4 h-4 ml-1" /> : <ChevronRight className="w-4 h-4 ml-1" />}
                </div>
              </div>
              
              {collectionsOpen && (
                <div className="space-y-2">
                  {groupedRequests.map(folder => (
                    <div key={folder.id}>
                      <div className="flex items-center justify-between py-1 px-2 rounded hover:bg-gray-100 group">
                        <div className="flex items-center">
                          <ChevronRight className="w-3 h-3 text-gray-400 mr-1" />
                          <Folder className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="text-sm font-medium">{folder.name}</span>
                        </div>
                        <span className="text-xs text-gray-400">{folder.requests.length}</span>
                      </div>
                      
                      <div className="ml-6 space-y-1">
                        {folder.requests.map(request => (
                          <div 
                            key={request.id} 
                            className="flex items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer group"
                            onClick={() => loadRequest(request)}
                          >
                            <span className={`text-xs font-bold mr-3 px-2 py-1 rounded ${getMethodColor(request.method)}`}>
                              {request.method}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{request.name}</p>
                              <p className="text-xs text-gray-500 truncate">{request.url}</p>
                            </div>
                            <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded">
                              <MoreVertical className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* History */}
            <div>
              <div 
                className="flex items-center justify-between cursor-pointer mb-3 group"
                onClick={() => setHistoryOpen(!historyOpen)}
              >
                <div className="flex items-center">
                  <History className="w-5 h-5 mr-2 text-purple-600" />
                  <h3 className="font-semibold text-gray-900">History</h3>
                </div>
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1 hover:bg-gray-200 rounded">
                    <Trash2 className="w-4 h-4 text-gray-500" />
                  </button>
                  {historyOpen ? <ChevronDown className="w-4 h-4 ml-1" /> : <ChevronRight className="w-4 h-4 ml-1" />}
                </div>
              </div>
              
              {historyOpen && (
                <div className="space-y-1">
                  {requestHistory.slice(0, 5).map(item => (
                    <div 
                      key={item.id} 
                      className="flex items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                    >
                      <span className={`text-xs font-bold mr-3 px-2 py-1 rounded ${getMethodColor(item.method)}`}>
                        {item.method}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 truncate">{item.url}</p>
                        <p className="text-xs text-gray-500">{item.timestamp.toLocaleTimeString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Request Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-stretch gap-0 mb-4">
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="h-12 px-4 border border-r-0 border-gray-200 rounded-l-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:z-10 font-medium"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
              <option value="PATCH">PATCH</option>
              <option value="HEAD">HEAD</option>
              <option value="OPTIONS">OPTIONS</option>
            </select>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter request URL"
              className="flex-1 h-12 px-4 border-t border-b border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:z-10"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="h-12 px-6 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-semibold transition-colors"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={requestName}
                onChange={(e) => setRequestName(e.target.value)}
                placeholder="Request name"
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
              />
              <button
                onClick={handleSaveRequest}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center font-medium"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center">
                <Code className="w-4 h-4 mr-1" />
                Code
              </button>
              <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center">
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </button>
              <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Request/Response Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Request Configuration */}
          <div className="w-1/2 border-r border-gray-200 flex flex-col">
            {/* Tabs */}
            <div className="bg-gray-50 border-b border-gray-200 px-4">
              <div className="flex space-x-8 overflow-x-auto">
                {[
                  { id: 'params', label: 'Params', icon: Hash },
                  { id: 'headers', label: 'Headers', icon: Key },
                  { id: 'body', label: 'Body', icon: Database },
                  { id: 'auth', label: 'Auth', icon: Shield },
                  { id: 'formdata', label: 'Form', icon: Edit3 },
                  { id: 'curl', label: 'cURL', icon: Terminal }
                ].map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      className={`flex items-center py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Params Tab */}
              {activeTab === 'params' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Query Parameters</h3>
                    <button 
                      className="flex items-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      onClick={addNewParam}
                    >
                      <Plus className="w-4 h-4 mr-1" /> Add Parameter
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {params.map(param => (
                      <div key={param.id} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                        <input
                          type="checkbox"
                          checked={param.enabled}
                          onChange={() => toggleParam(param.id)}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          value={param.key}
                          onChange={(e) => updateParam(param.id, 'key', e.target.value)}
                          placeholder="Key"
                          className="flex-1 px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          value={param.value}
                          onChange={(e) => updateParam(param.id, 'value', e.target.value)}
                          placeholder="Value"
                          className="flex-1 px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button 
                          onClick={() => removeParam(param.id)}
                          className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Headers Tab */}
              {activeTab === 'headers' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Request Headers</h3>
                    <div className="flex items-center space-x-2">
                      <button className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        Bulk Edit
                      </button>
                      <button 
                        className="px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg"
                        onClick={prettifyJson}
                      >
                        Format JSON
                      </button>
                    </div>
                  </div>
                  <textarea
                    value={headers}
                    onChange={(e) => setHeaders(e.target.value)}
                    className="w-full h-96 p-4 border border-gray-200 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    spellCheck="false"
                    placeholder="Enter request headers in JSON format"
                  />
                </div>
              )}

              {/* Body Tab */}
              {activeTab === 'body' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Request Body</h3>
                    <div className="flex items-center space-x-2">
                      <select className="px-3 py-2 border border-gray-200 rounded-lg">
                        <option>JSON</option>
                        <option>Text</option>
                        <option>JavaScript</option>
                        <option>HTML</option>
                        <option>XML</option>
                      </select>
                      <button 
                        className="px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg"
                        onClick={prettifyJson}
                      >
                        Beautify
                      </button>
                    </div>
                  </div>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="w-full h-96 p-4 border border-gray-200 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    spellCheck="false"
                    placeholder="Enter request body"
                  />
                </div>
              )}

              {/* Auth Tab */}
              {activeTab === 'auth' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Authorization</h3>
                    <button 
                      className="flex items-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      onClick={() => setShowAuth(!showAuth)}
                    >
                      {showAuth ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                      {showAuth ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Auth Type</label>
                      <select
                        value={authType}
                        onChange={(e) => setAuthType(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="none">No Auth</option>
                        <option value="bearer">Bearer Token</option>
                        <option value="basic">Basic Auth</option>
                        <option value="apiKey">API Key</option>
                        <option value="oauth2">OAuth 2.0</option>
                      </select>
                    </div>
                    
                    {authType === 'bearer' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bearer Token</label>
                        <input
                          type={showAuth ? "text" : "password"}
                          value={bearerToken}
                          onChange={(e) => setBearerToken(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter your bearer token"
                        />
                      </div>
                    )}

                    {authType === 'basic' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                          <input
                            type="text"
                            value={basicUsername}
                            onChange={(e) => setBasicUsername(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter username"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                          <input
                            type={showAuth ? "text" : "password"}
                            value={basicPassword}
                            onChange={(e) => setBasicPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter password"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Form Data Tab */}
              {activeTab === 'formdata' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Form Data</h3>
                    <button 
                      className="flex items-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      onClick={addFormDataField}
                    >
                      <Plus className="w-4 h-4 mr-1" /> Add Field
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {formData.map((field, index) => (
                      <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                        <input
                          type="checkbox"
                          checked={field.enabled}
                          onChange={() => {
                            const newFormData = [...formData];
                            newFormData[index].enabled = !newFormData[index].enabled;
                            setFormData(newFormData);
                          }}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          value={field.key}
                          onChange={(e) => updateFormData(index, 'key', e.target.value)}
                          placeholder="Field name"
                          className="flex-1 px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {field.type === 'text' ? (
                          <input
                            type="text"
                            value={field.value}
                            onChange={(e) => updateFormData(index, 'value', e.target.value)}
                            placeholder="Field value"
                            className="flex-1 px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <input
                            type="file"
                            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        )}
                        <select
                          value={field.type}
                          onChange={(e) => updateFormData(index, 'type', e.target.value)}
                          className="px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="text">Text</option>
                          <option value="file">File</option>
                        </select>
                        <button 
                          onClick={() => removeFormDataField(index)}
                          className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* cURL Tab */}
              {activeTab === 'curl' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">cURL Command</h3>
                    <button 
                      className="flex items-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      onClick={() => copyToClipboard(generateCurlCommand())}
                    >
                      <Copy className="w-4 h-4 mr-1" /> Copy
                    </button>
                  </div>
                  
                  <div className="relative mb-6">
                    <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono whitespace-pre-wrap">
                      {generateCurlCommand()}
                    </pre>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Import cURL</h4>
                    <div className="flex">
                      <textarea
                        value={curlImport}
                        onChange={(e) => setCurlImport(e.target.value)}
                        className="flex-1 p-3 border border-gray-200 rounded-l-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Paste cURL command here"
                        rows={3}
                      />
                      <button
                        onClick={() => alert('cURL import functionality would be implemented here')}
                        className="px-4 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 focus:outline-none"
                      >
                        Import
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          

          {/* Response Panel */}
          <div className="w-1/2 flex flex-col bg-gray-50">
            {/* Response Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">Response</h2>
                <div className="flex items-center space-x-4">
                  {responseTime > 0 && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-1" />
                      <span className="font-medium">{responseTime}ms</span>
                    </div>
                  )}
                  {responseSize > 0 && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Activity className="w-4 h-4 mr-1" />
                      <span className="font-medium">{(responseSize / 1024).toFixed(2)}KB</span>
                    </div>
                  )}
                </div>
              </div>

              {responseStatus > 0 && (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-2">Status:</span>
                    <span className={`text-sm px-3 py-1 rounded-full border font-medium ${getStatusColor(responseStatus)}`}>
                      {responseStatus} {responseStatus === 200 ? 'OK' : responseStatus === 404 ? 'Not Found' : responseStatus >= 500 ? 'Server Error' : ''}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Response Tabs */}
            <div className="bg-white border-b border-gray-200 px-4">
              <div className="flex space-x-8">
                {[
                  { id: 'body', label: 'Body', icon: Database },
                  { id: 'headers', label: 'Headers', icon: Key },
                  { id: 'cookies', label: 'Cookies', icon: Cookie }
                ].map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      className={`flex items-center py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                        responseView === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                      onClick={() => setResponseView(tab.id)}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Response Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {responseView === 'body' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                        onClick={prettifyJson}
                      >
                        Pretty
                      </button>
                      <button 
                        className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                        onClick={() => {
                          try {
                            setResponse(JSON.stringify(JSON.parse(response)));
                          } catch (e) {
                            // Not valid JSON
                          }
                        }}
                      >
                        Raw
                      </button>
                    </div>
                    <button 
                      className="flex items-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      onClick={() => copyToClipboard(response)}
                    >
                      <Copy className="w-4 h-4 mr-1" /> Copy
                    </button>
                  </div>

                  <div className="relative">
                    <pre className="bg-white p-4 rounded-lg border border-gray-200 overflow-auto text-sm font-mono whitespace-pre-wrap max-h-96">
                      {response || (
                        <div className="text-center text-gray-400 py-12">
                          <Send className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p className="text-lg">Send a request to see the response</p>
                          <p className="text-sm mt-2">Configure your request and click Send</p>
                        </div>
                      )}
                    </pre>
                  </div>
                </div>
              )}

              {responseView === 'headers' && (
                <div className="bg-white rounded-lg border border-gray-200">
                  {Object.keys(responseHeaders).length > 0 ? (
                    <div className="divide-y divide-gray-200">
                      {Object.entries(responseHeaders).map(([key, value]) => (
                        <div key={key} className="flex py-3 px-4">
                          <div className="w-1/3 font-mono text-sm font-medium text-gray-900">{key}</div>
                          <div className="w-2/3 font-mono text-sm text-gray-600 break-all">{String(value)}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-400 py-12">
                      <Key className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No response headers yet</p>
                    </div>
                  )}
                </div>
              )}

              {responseView === 'cookies' && (
                <div className="bg-white rounded-lg border border-gray-200">
                  <div className="text-center text-gray-400 py-12">
                    <div className="w-12 h-12 mx-auto mb-4 opacity-50 rounded-full bg-gray-100 flex items-center justify-center">
                      🍪
                    </div>
                    <p>No cookies received</p>
                  </div>
                </div>
              )}
            </div>

            {/* Code Generation */}
            <div className="border-t border-gray-200 p-4 bg-white">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">Generate Code</h3>
                <div className="flex items-center space-x-2">
                  <select className="px-3 py-1 text-sm border border-gray-200 rounded">
                    <option>JavaScript</option>
                    <option>Python</option>
                    <option>cURL</option>
                    <option>Node.js</option>
                  </select>
                  <button 
                    className="flex items-center px-3 py-1 text-blue-600 hover:bg-blue-50 rounded text-sm"
                    onClick={() => copyToClipboard(`fetch('${url}', {
  method: '${method}',
  headers: ${headers},
  body: ${['GET', 'HEAD'].includes(method) ? 'undefined' : body}
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`)}
                  >
                    <Copy className="w-4 h-4 mr-1" /> Copy
                  </button>
                </div>
              </div>
              <pre className="bg-gray-900 text-green-400 p-3 rounded-lg text-xs font-mono overflow-x-auto">
{`fetch('${url}', {
  method: '${method}',
  headers: ${headers},
  body: ${['GET', 'HEAD'].includes(method) ? 'undefined' : body}
})`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add a placeholder Cookie component since it's not in lucide-react
const Cookie = ({ className }: { className?: string }) => (
  <div className={className} style={{ width: '1rem', height: '1rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
    🍪
  </div>
);

export default ApiWorkspace;