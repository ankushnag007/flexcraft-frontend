import React, { useState, useEffect } from 'react';
import logo from "../Assets/videos/images/logo.png";

import { 
  Send, Play, Plus, Minus, ChevronDown, ChevronRight, 
  Code, Settings, Save, Folder, History, Trash2, 
  Copy, RefreshCw, Download, Upload, Key, Eye, EyeOff,
  Terminal, Globe, Clock, Layers, Bookmark, User, 
  Lock, Sliders, Zap, Hash, Bell, Star, Tag
} from 'lucide-react';

const ApiTesting = () => {
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
  const [activeTab, setActiveTab] = useState('headers');
  const [responseView, setResponseView] = useState('pretty');
  const [collectionsOpen, setCollectionsOpen] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(true);
  const [environmentsOpen, setEnvironmentsOpen] = useState(false);
  const [requestName, setRequestName] = useState('New Request');
  const [savedRequests, setSavedRequests] = useState([
    { id: 1, name: 'Get Posts', method: 'GET', url: 'https://jsonplaceholder.typicode.com/posts' },
    { id: 2, name: 'Create Post', method: 'POST', url: 'https://jsonplaceholder.typicode.com/posts' },
    { id: 3, name: 'Update Post', method: 'PUT', url: 'https://jsonplaceholder.typicode.com/posts/1' },
    { id: 4, name: 'Delete Post', method: 'DELETE', url: 'https://jsonplaceholder.typicode.com/posts/1' }
  ]);
  const [environments, setEnvironments] = useState([
    { id: 1, name: 'Development', variables: { baseUrl: 'http://dev.example.com' } },
    { id: 2, name: 'Production', variables: { baseUrl: 'https://api.example.com' } }
  ]);
  const [activeEnvironment, setActiveEnvironment] = useState(1);
  const [params, setParams] = useState([
    { id: 1, key: 'page', value: '1', enabled: true },
    { id: 2, key: 'limit', value: '10', enabled: true }
  ]);
  const [isUrlEncoded, setIsUrlEncoded] = useState(false);
  const [responseTime, setResponseTime] = useState(0);
  const [responseSize, setResponseSize] = useState(0);
  const [responseStatus, setResponseStatus] = useState(0);
  const [showAuth, setShowAuth] = useState(false);
  const [authType, setAuthType] = useState('bearer');
  const [bearerToken, setBearerToken] = useState('your-token-here');


  interface FormDataField {
    key: string;
    value: string;
    type: 'text' | 'file';
    file?: File;
  }
  
  const [formData, setFormData] = useState<FormDataField[]>([]);
  const [curlImport, setCurlImport] = useState('');
  const addFormDataField = () => {
    setFormData([...formData, { key: '', value: '', type: 'text' }]);
  };
  
  const updateFormData = (index: number, field: 'key' | 'value' | 'type', value: string) => {
    const newFormData = [...formData];
    newFormData[index][field] = value;
    setFormData(newFormData);
  };
  
  const removeFormDataField = (index: number) => {
    setFormData(formData.filter((_, i) => i !== index));
  };
  
  const handleFileUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newFormData = [...formData];
      newFormData[index] = {
        ...newFormData[index],
        type: 'file',
        file: e.target.files[0],
        value: e.target.files[0].name
      };
      setFormData(newFormData);
    }
  };
  
  const generateCurlCommand = () => {
    // Implement your cURL generation logic here
    return 'curl -X GET https://api.example.com';
  };
  
  const copyCurlCommand = () => {
    navigator.clipboard.writeText(generateCurlCommand());
  };
  
  const importCurl = () => {
    // Implement your cURL import parsing logic here
    alert('Importing cURL: ' + curlImport);
  };
  const handleSend = async () => {
    try {
      const options: RequestInit = {
        method,
        headers: headers ? JSON.parse(headers) : {},
        body: method !== 'GET' ? body : undefined
      };

      const startTime = performance.now();
      const res = await fetch(url, options);
      const endTime = performance.now();
      
      const data = await res.json();
      const responseSize = JSON.stringify(data).length;
      
      setResponseTime(Number((endTime - startTime).toFixed(2)));
      setResponseSize(responseSize);
      setResponseStatus(res.status);
      
      setResponse(JSON.stringify({
        status: res.status,
        statusText: res.statusText,
        time: `${(endTime - startTime).toFixed(2)}ms`,
        size: `${(responseSize / 1024).toFixed(2)}KB`,
        headers: Object.fromEntries(res.headers.entries()),
        data
      }, null, 2));
    } catch (error) {
      setResponse(JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error'
      }, null, 2));
    }
  };

  const handleSaveRequest = () => {
    const newRequest = {
      id: Date.now(),
      name: requestName,
      method,
      url,
      headers,
      body
    };
    setSavedRequests([...savedRequests, newRequest]);
  };

  const loadRequest = (request) => {
    setMethod(request.method);
    setUrl(request.url);
    setRequestName(request.name);
    if (request.headers) setHeaders(request.headers);
    if (request.body) setBody(request.body);
  };

  const addNewParam = () => {
    setParams([...params, { id: Date.now(), key: '', value: '', enabled: true }]);
  };

  const updateParam = (id, field, value) => {
    setParams(params.map(param => 
      param.id === id ? { ...param, [field]: value } : param
    ));
  };

  const removeParam = (id) => {
    setParams(params.filter(param => param.id !== id));
  };

  const toggleParam = (id) => {
    setParams(params.map(param => 
      param.id === id ? { ...param, enabled: !param.enabled } : param
    ));
  };

  const getStatusColor = (status) => {
    if (status >= 200 && status < 300) return 'bg-green-100 text-green-800';
    if (status >= 300 && status < 400) return 'bg-blue-100 text-blue-800';
    if (status >= 400 && status < 500) return 'bg-yellow-100 text-yellow-800';
    if (status >= 500) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const prettifyJson = () => {
    try {
      setResponse(JSON.stringify(JSON.parse(response), null, 2));
    } catch (e) {
      // Not valid JSON
    }
  };

  const minifyJson = () => {
    try {
      setResponse(JSON.stringify(JSON.parse(response)));
    } catch (e) {
      // Not valid JSON
    }
  };

  const generateCodeSnippet = () => {
    const snippet = `fetch('${url}', {
  method: '${method}',
  headers: ${headers},
  body: ${method !== 'GET' ? body : 'undefined'}
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`;
    
    return snippet;
  };

  return (
    <div className="flex h-screen bg-gray-50 text-blue-900">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-gray-200 p-4 flex flex-col border-r border-gray-700">
        <div className="flex items-center justify-between mb-6">
            <img src={logo} className="h-3 w-auto" /> API Client
          <h2 className="text-lg font-bold flex items-center">
            {/* <Globe className="w-5 h-5 mr-2 text-blue-400" /> */}
          </h2>
          <button className="p-1 rounded hover:bg-gray-700">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Collections */}
          <div className="mb-6">
            <div 
              className="flex items-center justify-between cursor-pointer mb-2 p-1 hover:bg-gray-700 rounded"
              onClick={() => setCollectionsOpen(!collectionsOpen)}
            >
              <div className="flex items-center">
                <Folder className="w-4 h-4 mr-2 text-blue-400" />
                <h3 className="font-semibold">Collections</h3>
              </div>
              {collectionsOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </div>
            {collectionsOpen && (
              <div className="ml-6 space-y-1">
                {savedRequests.map(request => (
                  <div 
                    key={request.id} 
                    className="flex items-center p-1 rounded hover:bg-gray-700 cursor-pointer"
                    onClick={() => loadRequest(request)}
                  >
                    <span className={`text-xs font-mono mr-2 px-1 py-0.5 rounded ${
                      request.method === 'GET' ? 'bg-green-600' :
                      request.method === 'POST' ? 'bg-yellow-600' :
                      request.method === 'PUT' ? 'bg-blue-600' :
                      request.method === 'DELETE' ? 'bg-red-600' :
                      'bg-purple-600'
                    }`}>
                      {request.method}
                    </span>
                    <span className="truncate">{request.name}</span>
                  </div>
                ))}
                <button className="flex items-center text-sm text-gray-400 p-1 rounded hover:bg-gray-700 w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  New Collection
                </button>
              </div>
            )}
          </div>

          {/* Environments */}
          <div className="mb-6">
            <div 
              className="flex items-center justify-between cursor-pointer mb-2 p-1 hover:bg-gray-700 rounded"
              onClick={() => setEnvironmentsOpen(!environmentsOpen)}
            >
              <div className="flex items-center">
                <Layers className="w-4 h-4 mr-2 text-green-400" />
                <h3 className="font-semibold">Environments</h3>
              </div>
              {environmentsOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </div>
            {environmentsOpen && (
              <div className="ml-6 space-y-1">
                {environments.map(env => (
                  <div 
                    key={env.id} 
                    className={`flex items-center p-1 rounded cursor-pointer ${
                      activeEnvironment === env.id ? 'bg-gray-700' : 'hover:bg-gray-700'
                    }`}
                    onClick={() => setActiveEnvironment(env.id)}
                  >
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      activeEnvironment === env.id ? 'bg-green-400' : 'bg-gray-500'
                    }`}></div>
                    <span>{env.name}</span>
                  </div>
                ))}
                <button className="flex items-center text-sm text-gray-400 p-1 rounded hover:bg-gray-700 w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  New Environment
                </button>
              </div>
            )}
          </div>

          {/* History */}
          <div>
            <div 
              className="flex items-center justify-between cursor-pointer mb-2 p-1 hover:bg-gray-700 rounded"
              onClick={() => setHistoryOpen(!historyOpen)}
            >
              <div className="flex items-center">
                <History className="w-4 h-4 mr-2 text-purple-400" />
                <h3 className="font-semibold">History</h3>
              </div>
              {historyOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </div>
            {historyOpen && (
              <div className="ml-6 space-y-1">
                <div className="flex items-center p-1 rounded hover:bg-gray-700 cursor-pointer">
                  <span className="text-xs font-mono mr-2 px-1 py-0.5 rounded bg-green-600">GET</span>
                  <span className="truncate">https://api.example.com/users</span>
                </div>
                <div className="flex items-center p-1 rounded hover:bg-gray-700 cursor-pointer">
                  <span className="text-xs font-mono mr-2 px-1 py-0.5 rounded bg-yellow-600">POST</span>
                  <span className="truncate">https://api.example.com/posts</span>
                </div>
                <button className="flex items-center text-sm text-gray-400 p-1 rounded hover:bg-gray-700 w-full">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Request Bar */}
        <div className="bg-white border-b p-4">
          <div className="flex items-center">
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="px-3 py-2 border rounded-l-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="GET" className="text-green-600">GET</option>
              <option value="POST" className="text-yellow-600">POST</option>
              <option value="PUT" className="text-blue-600">PUT</option>
              <option value="DELETE" className="text-red-600">DELETE</option>
              <option value="PATCH" className="text-purple-600">PATCH</option>
            </select>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter request URL"
              className="flex-1 px-3 py-2 border-t border-b focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSend}
              className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Play className="w-4 h-4 mr-2" />
              Send
            </button>
            <input
              type="text"
              value={requestName}
              onChange={(e) => setRequestName(e.target.value)}
              placeholder="Request name"
              className="ml-4 px-3 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSaveRequest}
              className="ml-2 px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </button>
          </div>
        </div>

        {/* Request Body */}
        <div className="flex-1 flex overflow-hidden">
          <div className="w-1/2 p-4 overflow-y-auto">
            <div className="flex border-b mb-4">
              <button
                className={`px-4 py-2 ${activeTab === 'params' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
                onClick={() => setActiveTab('params')}
              >
                Params
              </button>
              <button
                className={`px-4 py-2 ${activeTab === 'headers' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
                onClick={() => setActiveTab('headers')}
              >
                Headers
              </button>
              <button
                className={`px-4 py-2 ${activeTab === 'body' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
                onClick={() => setActiveTab('body')}
              >
                Body
              </button>
              <button
                className={`px-4 py-2 ${activeTab === 'auth' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
                onClick={() => setActiveTab('auth')}
              >
                Auth
              </button>
              <button
        className={`px-4 py-2 ${activeTab === 'formdata' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
        onClick={() => setActiveTab('formdata')}
      >
        Form Data
      </button>
      <button
        className={`px-4 py-2 ${activeTab === 'curl' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
        onClick={() => setActiveTab('curl')}
      >
        cURL
      </button>
            </div>

            {activeTab === 'params' && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Query Parameters</h3>
                  <div className="flex items-center">
                    <button 
                      className="text-blue-600 text-sm mr-3"
                      onClick={() => setIsUrlEncoded(!isUrlEncoded)}
                    >
                      {isUrlEncoded ? 'Formatted' : 'URL Encoded'}
                    </button>
                    <button 
                      className="text-blue-600 text-sm flex items-center"
                      onClick={addNewParam}
                    >
                      <Plus className="w-4 h-4 mr-1" /> Add
                    </button>
                  </div>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-3 py-2 text-left text-sm font-medium text-gray-500">Key</th>
                        <th className="px-3 py-2 text-left text-sm font-medium text-gray-500">Value</th>
                        <th className="px-3 py-2 text-left text-sm font-medium text-gray-500 w-8"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {params.map(param => (
                        <tr key={param.id} className="border-t">
                          <td className="px-3 py-2">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={param.enabled}
                                onChange={() => toggleParam(param.id)}
                                className="mr-2"
                              />
                              <input
                                type="text"
                                value={param.key}
                                onChange={(e) => updateParam(param.id, 'key', e.target.value)}
                                className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={param.value}
                              onChange={(e) => updateParam(param.id, 'value', e.target.value)}
                              className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-3 py-2 text-center">
                            <button 
                              onClick={() => removeParam(param.id)}
                              className="text-gray-500 hover:text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'headers' && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Request Headers</h3>
                  <div className="flex items-center">
                    <button className="text-blue-600 text-sm mr-3">Bulk Edit</button>
                    <button className="text-blue-600 text-sm flex items-center">
                      <Plus className="w-4 h-4 mr-1" /> Add
                    </button>
                  </div>
                </div>
                <textarea
                  value={headers}
                  onChange={(e) => setHeaders(e.target.value)}
                  className="w-full h-64 p-3 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  spellCheck="false"
                />
              </div>
            )}

            {activeTab === 'body' && (
              <div>
                <div className="flex mb-2">
                  <button className={`px-3 py-1 rounded-l ${activeTab === 'body' ? 'bg-gray-200' : 'bg-gray-100'}`}>
                    raw
                  </button>
                  <button className={`px-3 py-1 border-l border-r ${activeTab === 'body' ? 'bg-gray-100' : 'bg-gray-200'}`}>
                    form-data
                  </button>
                  <button className={`px-3 py-1 rounded-r ${activeTab === 'body' ? 'bg-gray-100' : 'bg-gray-200'}`}>
                    binary
                  </button>
                </div>
                <div className="flex items-center mb-2">
                  <select className="px-3 py-1 border rounded-l bg-gray-100">
                    <option>JSON</option>
                    <option>Text</option>
                    <option>JavaScript</option>
                    <option>HTML</option>
                    <option>XML</option>
                  </select>
                  <button className="px-3 py-1 border-t border-b border-r bg-gray-100">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button 
                    className="px-3 py-1 border rounded-r bg-gray-100"
                    onClick={prettifyJson}
                  >
                    Beautify
                  </button>
                </div>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full h-64 p-3 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  spellCheck="false"
                />
              </div>
            )}

            {activeTab === 'auth' && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Authorization</h3>
                  <div className="flex items-center">
                    <button 
                      className="text-blue-600 text-sm flex items-center"
                      onClick={() => setShowAuth(!showAuth)}
                    >
                      {showAuth ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                      {showAuth ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
                <div className="mb-4">
                  <select
                    value={authType}
                    onChange={(e) => setAuthType(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bearer Token</label>
                    <input
                      type={showAuth ? "text" : "password"}
                      value={bearerToken}
                      onChange={(e) => setBearerToken(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your bearer token"
                    />
                  </div>
                )}

                {authType === 'basic' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter username"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <input
                        type={showAuth ? "text" : "password"}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter password"
                      />
                    </div>
                  </div>
                )}

                {authType === 'apiKey' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Key</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter key"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                      <input
                        type={showAuth ? "text" : "password"}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter value"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Add to</label>
                      <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Header</option>
                        <option>Query Params</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            )}

{activeTab === 'formdata' && (
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">Form Data</h3>
          <div className="flex items-center">
            <button 
              className="text-blue-600 text-sm flex items-center"
              onClick={addFormDataField}
            >
              <Plus className="w-4 h-4 mr-1" /> Add Field
            </button>
          </div>
        </div>
        
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left text-sm font-medium text-gray-500">Key</th>
                <th className="px-3 py-2 text-left text-sm font-medium text-gray-500">Value</th>
                <th className="px-3 py-2 text-left text-sm font-medium text-gray-500">Type</th>
                <th className="px-3 py-2 text-left text-sm font-medium text-gray-500 w-8"></th>
              </tr>
            </thead>
            <tbody>
              {formData.map((field, index) => (
                <tr key={index} className="border-t">
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={field.key}
                      onChange={(e) => updateFormData(index, 'key', e.target.value)}
                      className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Field name"
                    />
                  </td>
                  <td className="px-3 py-2">
                    {field.type === 'text' ? (
                      <input
                        type="text"
                        value={field.value}
                        onChange={(e) => updateFormData(index, 'value', e.target.value)}
                        className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Field value"
                      />
                    ) : (
                      <div className="flex items-center">
                        <input
                          type="file"
                          onChange={(e) => handleFileUpload(index, e)}
                          className="w-full px-2 py-1 text-sm"
                        />
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <select
                      value={field.type}
                      onChange={(e) => updateFormData(index, 'type', e.target.value)}
                      className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="text">Text</option>
                      <option value="file">File</option>
                    </select>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <button 
                      onClick={() => removeFormDataField(index)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}

    {/* cURL Tab */}
    {activeTab === 'curl' && (
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">cURL Command</h3>
          <div className="flex items-center">
            <button 
              className="text-blue-600 text-sm flex items-center"
              onClick={copyCurlCommand}
            >
              <Copy className="w-4 h-4 mr-1" /> Copy
            </button>
          </div>
        </div>
        
        <div className="relative">
          <div className="absolute top-2 right-2">
            <button 
              className="p-1 bg-gray-200 rounded hover:bg-gray-300"
              onClick={copyCurlCommand}
              title="Copy to clipboard"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          <pre className="bg-gray-100 p-4 rounded-lg border overflow-x-auto text-sm font-mono whitespace-pre-wrap">
            {generateCurlCommand() || (
              <div className="text-gray-400">Configure your request to generate cURL command</div>
            )}
          </pre>
        </div>
        
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Import cURL</h4>
          <div className="flex">
            <textarea
              value={curlImport}
              onChange={(e) => setCurlImport(e.target.value)}
              className="flex-1 p-3 border rounded-l-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Paste cURL command here"
              rows={3}
            />
            <button
              onClick={importCurl}
              className="px-4 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Import
            </button>
          </div>
        </div>
      </div>
    )}
          </div>
          

          {/* Response */}
          <div className="w-1/2 border-l p-4 overflow-y-auto bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Response</h2>
              <div className="flex items-center">
                {responseTime > 0 && (
                  <span className="text-sm text-gray-500 mr-4">
                    <Clock className="inline w-4 h-4 mr-1" />
                    {responseTime}ms
                  </span>
                )}
                {responseSize > 0 && (
                  <span className="text-sm text-gray-500">
                    <Zap className="inline w-4 h-4 mr-1" />
                    {(responseSize / 1024).toFixed(2)}KB
                  </span>
                )}
              </div>
            </div>

            {responseStatus > 0 && (
              <div className="flex items-center mb-4">
                <span className="text-sm font-medium mr-2">Status:</span>
                <span className={`text-sm px-2 py-1 rounded ${getStatusColor(responseStatus)}`}>
                  {responseStatus} {responseStatus === 200 ? 'OK' : ''}
                </span>
              </div>
            )}

            <div className="flex border-b mb-4">
              <button
                className={`px-4 py-2 ${responseView === 'body' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
                onClick={() => setResponseView('body')}
              >
                Body
              </button>
              <button
                className={`px-4 py-2 ${responseView === 'headers' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
                onClick={() => setResponseView('headers')}
              >
                Headers
              </button>
              <button
                className={`px-4 py-2 ${responseView === 'cookies' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
                onClick={() => setResponseView('cookies')}
              >
                Cookies
              </button>
            </div>

            {responseView === 'body' && (
              <div>
                <div className="flex mb-4">
                  <button 
                    className={`px-3 py-1 rounded-l ${responseView === 'body' ? 'bg-gray-200' : 'bg-gray-100'}`}
                    onClick={() => prettifyJson()}
                  >
                    Pretty
                  </button>
                  <button 
                    className={`px-3 py-1 border-l border-r ${responseView === 'body' ? 'bg-gray-100' : 'bg-gray-200'}`}
                    onClick={() => minifyJson()}
                  >
                    Raw
                  </button>
                  <button 
                    className={`px-3 py-1 rounded-r ${responseView === 'body' ? 'bg-gray-100' : 'bg-gray-200'}`}
                  >
                    Preview
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button 
                      className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                      onClick={() => copyToClipboard(response)}
                      title="Copy to clipboard"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button 
                      className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                      onClick={prettifyJson}
                      title="Prettify JSON"
                    >
                      <Sliders className="w-4 h-4" />
                    </button>
                  </div>
                  <pre className="bg-white p-4 rounded-lg border overflow-x-auto text-sm font-mono whitespace-pre-wrap">
                    {response || (
                      <div className="text-center text-gray-400 py-8">
                        <Send className="w-8 h-8 mx-auto mb-2" />
                        <p>Click "Send" to get a response</p>
                      </div>
                    )}
                  </pre>
                </div>
              </div>
            )}

            {responseView === 'headers' && (
              <div className="bg-white p-4 rounded-lg border">
                {response ? (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Header</th>
                        <th className="text-left py-2">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {response && JSON.parse(response).headers && Object.entries(JSON.parse(response).headers).map(([key, value]) => (
                        <tr key={key} className="border-b">
                          <td className="py-2 font-mono text-sm">{key}</td>
                          <td className="py-2 font-mono text-sm">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    <Send className="w-8 h-8 mx-auto mb-2" />
                    <p>Click "Send" to get headers</p>
                  </div>
                )}
              </div>
            )}

            {responseView === 'cookies' && (
              <div className="bg-white p-4 rounded-lg border">
                {response ? (
                  <div className="text-sm">
                    <p>No cookies received</p>
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    <Send className="w-8 h-8 mx-auto mb-2" />
                    <p>Click "Send" to check for cookies</p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Code Snippet</h3>
                <button 
                  className="text-blue-600 text-sm flex items-center"
                  onClick={() => copyToClipboard(generateCodeSnippet())}
                >
                  <Copy className="w-4 h-4 mr-1" /> Copy
                </button>
              </div>
              <div className="bg-gray-800 text-gray-200 p-4 rounded-lg overflow-x-auto">
                <pre className="font-mono text-sm">
                  {generateCodeSnippet()}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiTesting;