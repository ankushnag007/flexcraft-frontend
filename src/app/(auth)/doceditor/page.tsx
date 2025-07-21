"use client"
import React, { useState, useRef, useEffect } from 'react';
import {
  Bold, Italic, Underline, Strikethrough, List, ListOrdered, 
  Heading1, Heading2, Heading3, Quote, Code, Link2, Image as ImageIcon, 
  FileImage, FileVideo, File, Table, Minus, AlignLeft, AlignCenter, 
  AlignRight, Undo, Redo, Save as SaveIcon, X, Check, ChevronDown, 
  Plus, Trash2, Download, Eye, Paperclip, Search, Users, UserPlus, 
  Tag, CheckCircle, FileText, FileInput, FileSpreadsheet, FileArchive,
  FileCode, Type, Palette, AlignJustify, ListChecks,
  Footprints
} from 'lucide-react';

// Types
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
}

interface Attachment {
  id: string;
  type: 'image' | 'video' | 'file' | 'pdf' | 'doc' | 'excel' | 'ppt' | 'archive' | 'code';
  url: string;
  name: string;
  size?: string;
  uploadedAt: string;
}

interface Document {
  id: string;
  title: string;
  content: string;
  lastEdited: string;
  tags?: string[];
  status?: string;
  sharedWith?: string[];
  attachments?: Attachment[];
  assignedTo?: string;
  createdBy: string;
}

interface DocumentEditorProps {
  initialDocuments?: Document[];
  teamMembers?: User[];
  tasks?: Task[];
  currentUser: User;
  onSave?: (doc: Document) => Promise<Document>;
  onDelete?: (docId: string) => Promise<void>;
  onUploadFile?: (file: File) => Promise<Attachment>;
  onShareDocument?: (docId: string, userIds: string[]) => Promise<void>;
  onAssignToTask?: (docId: string, taskId: string) => Promise<void>;
  className?: string;
}

// Demo Data
const DEMO_MEMBERS: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com', avatar: 'https://i.pravatar.cc/150?img=3' }
];

const DEMO_TASKS: Task[] = [
  { id: '1', title: 'Design Homepage', status: 'in-progress' },
  { id: '2', title: 'Implement API', status: 'todo' },
  { id: '3', title: 'Fix Mobile Layout', status: 'done' }
];

const DEMO_DOCUMENTS: Document[] = [
  {
    id: '1',
    title: 'Project Requirements',
    content: '<h1>Project Requirements</h1><p>This document outlines the key requirements for our new project.</p><ul><li>User authentication</li><li>Dashboard interface</li><li>Reporting system</li></ul>',
    lastEdited: new Date().toLocaleString(),
    tags: ['important', 'backend'],
    status: 'draft',
    sharedWith: ['2'],
    assignedTo: '1',
    createdBy: '1'
  }
];

export const DocumentEditor: React.FC<DocumentEditorProps> = ({
  initialDocuments = DEMO_DOCUMENTS,
  teamMembers = DEMO_MEMBERS,
  tasks = DEMO_TASKS,
  currentUser = DEMO_MEMBERS[0],
  onSave,
  onDelete,
  onUploadFile,
  onShareDocument,
  onAssignToTask,
  className = ''
}) => {
  // State
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [currentDoc, setCurrentDoc] = useState<Document>(createNewDocument());
  const [viewMode, setViewMode] = useState<'list' | 'edit' | 'view'>('list');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<string[]>(['']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [newTag, setNewTag] = useState('');
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontSize, setFontSize] = useState('16px');
  const [textColor, setTextColor] = useState('#000000');
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  // Refs
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);

  // Helper functions
  function createNewDocument(): Document {
    return {
      id: '',
      title: 'Untitled Document',
      content: '',
      lastEdited: new Date().toLocaleString(),
      tags: [],
      status: 'draft',
      sharedWith: [],
      attachments: [],
      createdBy: currentUser.id
    };
  }

  // Fix for tag input typing backwards
  useEffect(() => {
    if (tagInputRef.current) {
      tagInputRef.current.selectionStart = tagInputRef.current.selectionEnd = newTag.length;
    }
  }, [newTag]);

  // Document operations
  const createDocument = () => {
    setCurrentDoc(createNewDocument());
    setHistory(['']);
    setHistoryIndex(0);
    setIsEditingTitle(true);
    setViewMode('edit');
  };

  const openDocument = (doc: Document) => {
    setCurrentDoc(doc);
    setViewMode('view');
  };

  const editDocument = (doc: Document) => {
    setCurrentDoc(doc);
    setHistory([doc.content]);
    setHistoryIndex(0);
    setViewMode('edit');
  };

  const saveDocument = async () => {
    setIsLoading(true);
    try {
      const docToSave = {
        ...currentDoc,
        lastEdited: new Date().toLocaleString()
      };

      const savedDoc = onSave ? await onSave(docToSave) : docToSave;

      setDocuments(prev => {
        if (savedDoc.id && prev.some(d => d.id === savedDoc.id)) {
          return prev.map(d => d.id === savedDoc.id ? savedDoc : d);
        }
        return [savedDoc, ...prev];
      });

      setViewMode('list');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDocument = async (id: string) => {
    if (!id || !onDelete) return;
    
    setIsLoading(true);
    try {
      await onDelete(id);
      setDocuments(prev => prev.filter(doc => doc.id !== id));
      if (currentDoc.id === id) {
        setViewMode('list');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Editor operations
  const updateContent = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      if (newContent !== currentDoc.content) {
        setCurrentDoc(prev => ({ ...prev, content: newContent }));
        addToHistory(newContent);
      }
    }
  };

  const addToHistory = (content: string) => {
    const newHistory = [...history.slice(0, historyIndex + 1), content];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentDoc(prev => ({ ...prev, content: history[newIndex] }));
      if (editorRef.current) {
        editorRef.current.innerHTML = history[newIndex];
      }
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentDoc(prev => ({ ...prev, content: history[newIndex] }));
      if (editorRef.current) {
        editorRef.current.innerHTML = history[newIndex];
      }
    }
  };

  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    updateContent();
    focusEditor();
  };

  const insertTable = () => {
    const rows = prompt('Number of rows:', '3');
    const cols = prompt('Number of columns:', '3');
    
    if (rows && cols) {
      let tableHtml = '<table border="1" style="width:100%; border-collapse:collapse;">';
      for (let i = 0; i < parseInt(rows); i++) {
        tableHtml += '<tr>';
        for (let j = 0; j < parseInt(cols); j++) {
          tableHtml += `<td style="padding:8px; border:1px solid #ddd;">&nbsp;</td>`;
        }
        tableHtml += '</tr>';
      }
      tableHtml += '</table>';
      
      formatText('insertHTML', tableHtml);
    }
  };

  // File type handling
  const getFileType = (fileName: string): Attachment['type'] => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch(extension) {
      case 'jpg': case 'jpeg': case 'png': case 'gif': case 'webp': return 'image';
      case 'mp4': case 'mov': case 'avi': case 'webm': return 'video';
      case 'pdf': return 'pdf';
      case 'doc': case 'docx': return 'doc';
      case 'xls': case 'xlsx': return 'excel';
      case 'ppt': case 'pptx': return 'ppt';
      case 'zip': case 'rar': case '7z': return 'archive';
      case 'js': case 'ts': case 'html': case 'css': case 'json': return 'code';
      default: return 'file';
    }
  };

  const FileTypeIcon = ({ type, className = '' }: { type: Attachment['type'], className?: string }) => {
    switch(type) {
      case 'pdf': return <FileText className={className} />;
      case 'doc': return <FileInput className={className} />;
      case 'excel': return <FileSpreadsheet className={className} />;
      case 'ppt': return <FileImage className={className} />;
      case 'code': return <FileCode className={className} />;
      case 'archive': return <FileArchive className={className} />;
      default: return <File className={className} />;
    }
  };

  // File operations
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files.length) return;
    
    const file = e.target.files[0];
    setIsLoading(true);
    try {
      const attachment = onUploadFile ? await onUploadFile(file) : {
        id: Date.now().toString(),
        type: getFileType(file.name),
        url: URL.createObjectURL(file),
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        uploadedAt: new Date().toLocaleString()
      };

      setCurrentDoc(prev => ({
        ...prev,
        attachments: [...(prev.attachments || []), attachment]
      }));
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeAttachment = (id: string) => {
    setCurrentDoc(prev => ({
      ...prev,
      attachments: prev.attachments?.filter(att => att.id !== id) || []
    }));
  };

  // File preview handling
  const renderFilePreview = (attachment: Attachment) => {
    switch(attachment.type) {
      case 'pdf':
        return (
          <iframe 
            src={attachment.url} 
            className="w-full h-[500px] border"
            title={attachment.name}
          />
        );
      case 'image':
        return (
          <img 
            src={attachment.url} 
            alt={attachment.name}
            className="w-full max-h-96 object-contain"
          />
        );
      case 'video':
        return (
          <video 
            src={attachment.url}
            className="w-full max-h-96"
            controls
          />
        );
      default:
        return (
          <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
            <div className="text-center">
              <FileTypeIcon type={attachment.type} className="w-12 h-12 mx-auto text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">Preview not available for {attachment.type} files</p>
              <a 
                href={attachment.url} 
                download
                className="mt-2 inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </a>
            </div>
          </div>
        );
    }
  };

  // Tag operations
  const addTag = () => {
    if (newTag.trim() && !currentDoc.tags?.includes(newTag.trim())) {
      setCurrentDoc(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
    if (tagInputRef.current) {
      tagInputRef.current.focus();
    }
  };

  const removeTag = (tagToRemove: string) => {
    setCurrentDoc(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  // Team sharing operations
  const toggleShareDialog = () => {
    setShowShareDialog(!showShareDialog);
    if (!showShareDialog) {
      setSelectedMembers(currentDoc.sharedWith || []);
      setMemberSearchQuery('');
    }
  };

  const toggleTaskDialog = () => {
    setShowTaskDialog(!showTaskDialog);
  };

  const toggleMemberSelection = (userId: string) => {
    setSelectedMembers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };

  const saveSharedMembers = async () => {
    if (!currentDoc.id) return;
    
    setIsLoading(true);
    try {
      if (onShareDocument) {
        await onShareDocument(currentDoc.id, selectedMembers);
      }
      setCurrentDoc(prev => ({
        ...prev,
        sharedWith: selectedMembers
      }));
      setShowShareDialog(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Task assignment
  const assignToTask = async (taskId: string) => {
    if (!currentDoc.id) return;
    
    setIsLoading(true);
    try {
      if (onAssignToTask) {
        await onAssignToTask(currentDoc.id, taskId);
      }
      setCurrentDoc(prev => ({
        ...prev,
        assignedTo: taskId
      }));
      setShowTaskDialog(false);
    } finally {
      setIsLoading(false);
    }
  };

  // UI helpers
  const focusEditor = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(memberSearchQuery.toLowerCase())
  );

  const getMemberById = (id: string) => teamMembers.find(member => member.id === id);
  const getTaskById = (id?: string) => tasks.find(task => task.id === id);

  // Toolbar component
  const renderToolbar = () => (
    <div className="flex flex-wrap gap-1 p-2 border-b">
      <button onClick={undo} disabled={historyIndex === 0} className="p-2 rounded hover:bg-gray-100 disabled:opacity-50">
        <Undo className="w-4 h-4" />
      </button>
      <button onClick={redo} disabled={historyIndex === history.length - 1} className="p-2 rounded hover:bg-gray-100 disabled:opacity-50">
        <Redo className="w-4 h-4" />
      </button>
      
      <div className="border-l h-6 mx-1"></div>
      
      <div className="relative">
        <button onClick={() => setShowFontMenu(!showFontMenu)} className="p-2 rounded hover:bg-gray-100 flex items-center">
          <Footprints className="w-4 h-4 mr-1" />
          <span className="text-xs">{fontFamily}</span>
        </button>
        {showFontMenu && (
          <div className="absolute z-10 mt-1 w-40 bg-white shadow-lg rounded border p-2">
            {['Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana'].map(font => (
              <div 
                key={font}
                onClick={() => { formatText('fontName', font); setFontFamily(font); setShowFontMenu(false); }}
                className="p-1 hover:bg-gray-100 cursor-pointer"
                style={{ fontFamily: font }}
              >
                {font}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="relative">
        <button onClick={() => setShowColorPicker(!showColorPicker)} className="p-2 rounded hover:bg-gray-100">
          <Palette className="w-4 h-4" />
        </button>
        {showColorPicker && (
          <div className="absolute z-10 mt-1 bg-white shadow-lg rounded border p-2">
            <input 
              type="color" 
              value={textColor}
              onChange={(e) => { formatText('foreColor', e.target.value); setTextColor(e.target.value); }}
            />
          </div>
        )}
      </div>
      
      <div className="border-l h-6 mx-1"></div>
      
      <button onClick={() => formatText('bold')} className="p-2 rounded hover:bg-gray-100">
        <Bold className="w-4 h-4" />
      </button>
      <button onClick={() => formatText('italic')} className="p-2 rounded hover:bg-gray-100">
        <Italic className="w-4 h-4" />
      </button>
      <button onClick={() => formatText('underline')} className="p-2 rounded hover:bg-gray-100">
        <Underline className="w-4 h-4" />
      </button>
      <button onClick={() => formatText('strikeThrough')} className="p-2 rounded hover:bg-gray-100">
        <Strikethrough className="w-4 h-4" />
      </button>
      
      <div className="border-l h-6 mx-1"></div>
      
      <button onClick={() => formatText('formatBlock', '<h1>')} className="p-2 rounded hover:bg-gray-100">
        <Heading1 className="w-4 h-4" />
      </button>
      <button onClick={() => formatText('formatBlock', '<h2>')} className="p-2 rounded hover:bg-gray-100">
        <Heading2 className="w-4 h-4" />
      </button>
      <button onClick={() => formatText('formatBlock', '<p>')} className="p-2 rounded hover:bg-gray-100">
        <Type className="w-4 h-4" />
      </button>
      
      <div className="border-l h-6 mx-1"></div>
      
      <button onClick={() => formatText('insertUnorderedList')} className="p-2 rounded hover:bg-gray-100">
        <List className="w-4 h-4" />
      </button>
      <button onClick={() => formatText('insertOrderedList')} className="p-2 rounded hover:bg-gray-100">
        <ListOrdered className="w-4 h-4" />
      </button>
      <button onClick={() => formatText('insertHorizontalRule')} className="p-2 rounded hover:bg-gray-100">
        <Minus className="w-4 h-4" />
      </button>
      
      <div className="border-l h-6 mx-1"></div>
      
      <button onClick={insertTable} className="p-2 rounded hover:bg-gray-100">
        <Table className="w-4 h-4" />
      </button>
      <button onClick={() => fileInputRef.current?.click()} className="p-2 rounded hover:bg-gray-100">
        <FileImage className="w-4 h-4" />
      </button>
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="*" className="hidden" />
      
      <div className="border-l h-6 mx-1"></div>
      
      <button onClick={toggleShareDialog} className="p-2 rounded hover:bg-gray-100">
        <UserPlus className="w-4 h-4" />
      </button>
      <button onClick={toggleTaskDialog} className="p-2 rounded hover:bg-gray-100">
        <CheckCircle className="w-4 h-4" />
      </button>
    </div>
  );

  // Render
  return (
    <div className={`flex flex-col h-full bg-white rounded-lg shadow ${className}`}>
      {/* Toolbar */}
      <div className="border-b p-2 flex items-center justify-between">
        <div className="flex items-center space-x-1">
          {viewMode === 'list' ? (
            <button
              onClick={createDocument}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              <Plus className="w-4 h-4 mr-1" />
              New Document
            </button>
          ) : (
            <>
              <button
                onClick={() => setViewMode('list')}
                className="p-2 rounded hover:bg-gray-100"
                title="Back to list"
              >
                <ChevronDown className="w-4 h-4 transform rotate-90" />
              </button>
              {viewMode === 'edit' && renderToolbar()}
            </>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {viewMode === 'list' && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents..."
                className="pl-10 pr-4 py-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}

          {viewMode === 'edit' && (
            <>
              <button
                onClick={() => setViewMode('list')}
                className="px-3 py-1 text-sm border rounded-md hover:bg-gray-100 flex items-center"
              >
                <X className="w-4 h-4 mr-1" />
                Cancel
              </button>
              <button
                onClick={saveDocument}
                disabled={isLoading}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center disabled:opacity-50"
              >
                {isLoading ? (
                  'Saving...'
                ) : (
                  <>
                    <SaveIcon className="w-4 h-4 mr-1" />
                    Save
                  </>
                )}
              </button>
            </>
          )}

          {viewMode === 'view' && (
            <>
              <button
                onClick={() => editDocument(currentDoc)}
                className="px-3 py-1 text-sm border rounded-md hover:bg-gray-100 flex items-center"
              >
                <File className="w-4 h-4 mr-1" />
                Edit
              </button>
              <button
                onClick={() => deleteDocument(currentDoc.id)}
                disabled={isLoading}
                className="px-3 py-1 text-sm border rounded-md hover:bg-gray-100 flex items-center text-red-600 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Document List View */}
        {viewMode === 'list' && (
          <div className="flex-1 overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Documents</h2>
            
            {filteredDocuments.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <File className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>{searchQuery ? 'No matching documents found' : 'No documents yet'}</p>
                <button
                  onClick={createDocument}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create New Document
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocuments.map(document => (
                  <div 
                    key={document.id} 
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => openDocument(document)}
                  >
                    <div className="flex items-center mb-3">
                      <File className="w-5 h-5 mr-2 text-blue-500" />
                      <h3 className="font-medium truncate">{document.title || 'Untitled Document'}</h3>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      Last edited: {document.lastEdited}
                    </p>
                    {document.attachments && document.attachments.length > 0 && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Paperclip className="w-4 h-4 mr-1" />
                        <span>{document.attachments.length} attachment(s)</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded capitalize">
                        {document.status}
                      </span>
                      <div className="flex space-x-2">
                        {document.tags?.map((tag, i) => (
                          <span key={i} className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    {document.assignedTo && (
                      <div className="mt-2 flex items-center text-xs text-gray-500">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        <span>Assigned to: {getTaskById(document.assignedTo)?.title || 'Task'}</span>
                      </div>
                    )}
                    {document.sharedWith && document.sharedWith.length > 0 && (
                      <div className="mt-2 flex items-center text-xs text-gray-500">
                        <Users className="w-3 h-3 mr-1" />
                        <span>Shared with {document.sharedWith.length} member(s)</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Document Editor/Viewer */}
        {(viewMode === 'edit' || viewMode === 'view') && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Document Header */}
            <div className="border-b p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  {viewMode === 'edit' && isEditingTitle ? (
                    <input
                      type="text"
                      value={currentDoc.title}
                      onChange={(e) => setCurrentDoc({ ...currentDoc, title: e.target.value })}
                      onBlur={() => setIsEditingTitle(false)}
                      onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                      className="text-3xl font-bold mb-2 p-2 border-b focus:outline-none focus:border-blue-500 w-full"
                      placeholder="Document Title"
                      autoFocus
                    />
                  ) : (
                    <h1
                      onClick={() => viewMode === 'edit' && setIsEditingTitle(true)}
                      className={`text-3xl font-bold mb-2 ${viewMode === 'edit' ? 'cursor-text hover:bg-gray-50 p-2 rounded' : 'p-2'}`}
                    >
                      {currentDoc.title || 'Untitled Document'}
                    </h1>
                  )}
                  <div className="text-sm text-gray-500">
                    Last edited: {currentDoc.lastEdited}
                  </div>
                </div>

                <div className="flex space-x-2">
                  {currentDoc.sharedWith && currentDoc.sharedWith.length > 0 && (
                    <div className="flex -space-x-2">
                      {currentDoc.sharedWith.slice(0, 3).map(userId => {
                        const member = getMemberById(userId);
                        return member ? (
                          <div 
                            key={member.id}
                            className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium"
                            title={`${member.name} (${member.email})`}
                          >
                            {member.avatar ? (
                              <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full" />
                            ) : (
                              member.name.charAt(0).toUpperCase()
                            )}
                          </div>
                        ) : null;
                      })}
                      {currentDoc.sharedWith.length > 3 && (
                        <div 
                          className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium"
                          title={`Shared with ${currentDoc.sharedWith.length} members`}
                        >
                          +{currentDoc.sharedWith.length - 3}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {viewMode === 'edit' ? (
                  <>
                    {currentDoc.tags?.map(tag => (
                      <div key={tag} className="flex items-center text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                        {tag}
                        <button 
                          onClick={() => removeTag(tag)}
                          className="ml-1 text-blue-500 hover:text-blue-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <div className="relative">
                      <input
                        type="text"
                        ref={tagInputRef}
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addTag()}
                        placeholder="Add tag..."
                        className="text-xs px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 w-24"
                      />
                      {newTag && (
                        <button
                          onClick={addTag}
                          className="absolute right-1 top-1/2 transform -translate-y-1/2 text-blue-500"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  currentDoc.tags?.map((tag, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {tag}
                    </span>
                  ))
                )}
              </div>

              {/* Task assignment */}
              {currentDoc.assignedTo && (
                <div className="mt-2 flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                  <span>Assigned to: </span>
                  <span className="font-medium ml-1">
                    {getTaskById(currentDoc.assignedTo)?.title || 'Task'}
                  </span>
                </div>
              )}
            </div>

            {/* Document Content */}
            <div className="flex-1 overflow-auto p-6">
              {viewMode === 'edit' ? (
                <>
                  <div
                    ref={editorRef}
                    contentEditable
                    dangerouslySetInnerHTML={{ __html: currentDoc.content }}
                    onInput={updateContent}
                    onBlur={updateContent}
                    className="flex-1 focus:outline-none cursor-text min-h-[200px]"
                    style={{ fontFamily, color: textColor }}
                  />

                  {/* Attachments */}
                  {currentDoc.attachments && currentDoc.attachments.length > 0 && (
                    <div className="mt-8 border-t pt-6">
                      <h3 className="text-lg font-medium mb-4 flex items-center">
                        <Paperclip className="w-5 h-5 mr-2" />
                        Attachments ({currentDoc.attachments.length})
                      </h3>
                      <div className="grid grid-cols-1 gap-4">
                        {currentDoc.attachments.map(attachment => (
                          <div key={attachment.id} className="border rounded-lg overflow-hidden">
                            <div className="p-4 bg-gray-50 border-b flex items-center">
                              <FileTypeIcon type={attachment.type} className="w-6 h-6 mr-3 text-gray-500" />
                              <div className="flex-1">
                                <div className="font-medium">{attachment.name}</div>
                                <div className="text-sm text-gray-500">
                                  {attachment.size} • {attachment.uploadedAt}
                                </div>
                              </div>
                              <button
                                onClick={() => removeAttachment(attachment.id)}
                                className="p-2 text-gray-500 hover:text-red-500"
                                title="Remove"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                            <div className="p-4">
                              {renderFilePreview(attachment)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div 
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: currentDoc.content }}
                  />

                  {/* View Attachments */}
                  {currentDoc.attachments && currentDoc.attachments.length > 0 && (
                    <div className="mt-8 border-t pt-6">
                      <h3 className="text-lg font-medium mb-4 flex items-center">
                        <Paperclip className="w-5 h-5 mr-2" />
                        Attachments ({currentDoc.attachments.length})
                      </h3>
                      <div className="grid grid-cols-1 gap-4">
                        {currentDoc.attachments.map(attachment => (
                          <div key={attachment.id} className="border rounded-lg overflow-hidden">
                            <div className="p-4 bg-gray-50 border-b flex items-center">
                              <FileTypeIcon type={attachment.type} className="w-6 h-6 mr-3 text-gray-500" />
                              <div className="flex-1">
                                <div className="font-medium">{attachment.name}</div>
                                <div className="text-sm text-gray-500">
                                  {attachment.size} • {attachment.uploadedAt}
                                </div>
                              </div>
                              <a 
                                href={attachment.url} 
                                download
                                className="p-2 text-gray-500 hover:text-blue-500"
                                title="Download"
                              >
                                <Download className="w-5 h-5" />
                              </a>
                            </div>
                            <div className="p-4">
                              {renderFilePreview(attachment)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Share Dialog */}
      {showShareDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium">Share Document</h3>
            </div>
            
            <div className="p-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search team members..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={memberSearchQuery}
                  onChange={(e) => setMemberSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="max-h-64 overflow-y-auto border rounded-lg">
                {filteredMembers.length > 0 ? (
                  filteredMembers.map(member => (
                    <div
                      key={member.id}
                      className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer ${selectedMembers.includes(member.id) ? 'bg-blue-50' : ''}`}
                      onClick={() => toggleMemberSelection(member.id)}
                    >
                      <div className="flex-shrink-0">
                        <img 
                          src={member.avatar} 
                          alt={member.name}
                          className="w-10 h-10 rounded-full"
                        />
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">{member.name}</p>
                        <p className="text-sm text-gray-500">{member.email}</p>
                      </div>
                      <div className="ml-2">
                        <input
                          type="checkbox"
                          checked={selectedMembers.includes(member.id)}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          readOnly
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No members found
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4 border-t flex justify-end space-x-3">
              <button
                onClick={() => setShowShareDialog(false)}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={saveSharedMembers}
                disabled={isLoading}
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Share'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Dialog */}
      {showTaskDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium">Assign to Task</h3>
            </div>
            
            <div className="p-4">
              <div className="max-h-64 overflow-y-auto">
                {tasks.map(task => (
                  <div
                    key={task.id}
                    className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer ${currentDoc.assignedTo === task.id ? 'bg-blue-50' : ''}`}
                    onClick={() => assignToTask(task.id)}
                  >
                    <div className={`w-2 h-2 rounded-full mr-3 ${
                      task.status === 'todo' ? 'bg-gray-400' :
                      task.status === 'in-progress' ? 'bg-yellow-400' :
                      'bg-green-400'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{task.title}</p>
                      <p className="text-xs text-gray-500 capitalize">{task.status}</p>
                    </div>
                    {currentDoc.assignedTo === task.id && (
                      <Check className="w-5 h-5 text-blue-500" />
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4 border-t flex justify-end">
              <button
                onClick={() => setShowTaskDialog(false)}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentEditor;