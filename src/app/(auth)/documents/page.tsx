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
  Footprints,
  Text,
  LucideToggleRight
} from 'lucide-react';
import AuthGuard from '@/app/components/AuthGuard';
import FileViewer from 'react-file-viewer'


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
  fileType?: string;
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
  currentUser?: User;
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
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com', avatar: 'https://i.pravatar.cc/150?img=3' },
  { id: '4', name: 'Sarah Williams', email: 'sarah@example.com', avatar: 'https://i.pravatar.cc/150?img=4' },
  { id: '5', name: 'David Brown', email: 'david@example.com', avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: '6', name: 'Emily Davis', email: 'emily@example.com', avatar: 'https://i.pravatar.cc/150?img=6' },
  { id: '7', name: 'Robert Wilson', email: 'robert@example.com', avatar: 'https://i.pravatar.cc/150?img=7' },
  { id: '8', name: 'Jennifer Lee', email: 'jennifer@example.com', avatar: 'https://i.pravatar.cc/150?img=8' },
  { id: '9', name: 'Thomas Taylor', email: 'thomas@example.com', avatar: 'https://i.pravatar.cc/150?img=9' },
  { id: '10', name: 'Lisa Anderson', email: 'lisa@example.com', avatar: 'https://i.pravatar.cc/150?img=10' },
  { id: '11', name: 'William Martinez', email: 'william@example.com', avatar: 'https://i.pravatar.cc/150?img=11' },
  { id: '12', name: 'Amanda Thompson', email: 'amanda@example.com', avatar: 'https://i.pravatar.cc/150?img=12' }
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
    createdBy: '1',
    attachments: [
      {
        id: '1',
        type: 'pdf',
        url: 'https://arxiv.org/pdf/2201.00626.pdf',
        name: 'Project Brief.pdf',
        size: '2.4 MB',
        uploadedAt: new Date().toLocaleString(),
        fileType: 'application/pdf'
      },
      {
        id: '2',
        type: 'doc',
        url: 'https://file-examples.com/wp-content/uploads/2017/02/file-sample_100kB.docx',
        name: 'Requirements.docx',
        size: '1.8 MB',
        uploadedAt: new Date().toLocaleString(),
        fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      },
      {
        id: '3',
        type: 'image',
        url: 'https://picsum.photos/800/600',
        name: 'Wireframe.png',
        size: '450 KB',
        uploadedAt: new Date().toLocaleString(),
        fileType: 'image/png'
      },
      {
        id: '4',
        type: 'excel',
        url: 'https://file-examples.com/wp-content/uploads/2017/02/file_example_XLSX_10.xlsx',
        name: 'Budget.xlsx',
        size: '3.2 MB',
        uploadedAt: new Date().toLocaleString(),
        fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    ]
  }
];

export default function DocumentEditor({
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
}: DocumentEditorProps) {
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
  const [activePreview, setActivePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
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

  // Cursor position helpers
  const saveSelection = (): Range | null => {
    if (typeof window === 'undefined' || !window.getSelection) return null;
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      return selection.getRangeAt(0);
    }
    return null;
  };

  const restoreSelection = (range: Range | null) => {
    if (typeof window === 'undefined' || !range) return;
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

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
    const range = saveSelection();
    document.execCommand(command, false, value);
    updateContent();
    restoreSelection(range);
    focusEditor();
  };

  const handleListButton = (ordered: boolean) => {
    const range = saveSelection();
    
    if (range) {
      // Check if we're already in a list
      const parentElement = range.commonAncestorContainer.parentElement;
      const isInList = parentElement?.tagName === 'LI' || 
                      parentElement?.parentElement?.tagName === 'LI';
      
      if (isInList) {
        document.execCommand(ordered ? 'insertOrderedList' : 'insertUnorderedList');
      } else {
        document.execCommand(ordered ? 'insertOrderedList' : 'insertUnorderedList');
      }
      
      updateContent();
      restoreSelection(range);
      focusEditor();
    }
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

  const getFileMimeType = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch(extension) {
      case 'jpg': case 'jpeg': return 'image/jpeg';
      case 'png': return 'image/png';
      case 'gif': return 'image/gif';
      case 'webp': return 'image/webp';
      case 'mp4': return 'video/mp4';
      case 'mov': return 'video/quicktime';
      case 'avi': return 'video/x-msvideo';
      case 'webm': return 'video/webm';
      case 'pdf': return 'application/pdf';
      case 'doc': return 'application/msword';
      case 'docx': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      case 'xls': return 'application/vnd.ms-excel';
      case 'xlsx': return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      case 'ppt': return 'application/vnd.ms-powerpoint';
      case 'pptx': return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
      case 'zip': return 'application/zip';
      case 'rar': return 'application/x-rar-compressed';
      case '7z': return 'application/x-7z-compressed';
      case 'js': return 'application/javascript';
      case 'ts': return 'application/typescript';
      case 'html': return 'text/html';
      case 'css': return 'text/css';
      case 'json': return 'application/json';
      default: return 'application/octet-stream';
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
        uploadedAt: new Date().toLocaleString(),
        fileType: getFileMimeType(file.name)
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
    const previewStyle = "w-full h-[500px] border rounded-lg bg-gray-50 flex items-center justify-center";
    const downloadButton = (
      <a 
        href={attachment.url} 
        download
        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
      >
        <Download className="w-4 h-4 mr-2" />
        Download
      </a>
    );

    const onError = (e: any) => {
      setError('Failed to load file preview');
      console.error('Error loading file:', e);
    };

    try {
      switch(attachment.type) {
        case 'pdf':
        case 'doc':
        case 'excel':
        case 'ppt':
          return (
            <div className={previewStyle}>
              {typeof window !== 'undefined' && (
                <FileViewer
                  fileType={attachment.fileType || ''}
                  filePath={attachment.url}
                  onError={onError}
                  errorComponent={<div className="text-red-500 p-4">{error || 'Error loading preview'}</div>}
                  unsupportedComponent={
                    <div className="text-center p-6">
                      <FileTypeIcon type={attachment.type} className="w-16 h-16 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900">{attachment.name}</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        {attachment.type === 'pdf' ? 'PDF Document' : 
                         attachment.type === 'doc' ? 'Word Document' : 
                         attachment.type === 'excel' ? 'Excel Spreadsheet' : 'PowerPoint Presentation'}
                      </p>
                      {downloadButton}
                      {attachment.type !== 'pdf' && (
                        <a
                          href={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(attachment.url)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Online
                        </a>
                      )}
                    </div>
                  }
                />
              )}
            </div>
          );

        case 'image':
          return (
            <div className="text-center">
              <img 
                src={attachment.url} 
                alt={attachment.name}
                className="max-w-full max-h-[70vh] mx-auto rounded-lg shadow-sm"
                onError={onError}
              />
              {downloadButton}
            </div>
          );

        case 'video':
          return (
            <div className="text-center">
              <video 
                src={attachment.url}
                className="max-w-full max-h-[70vh] mx-auto rounded-lg"
                controls
                onError={onError}
              />
              {downloadButton}
            </div>
          );

        default:
          return (
            <div className={previewStyle}>
              <div className="text-center p-6">
                <FileTypeIcon type={attachment.type} className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900">{attachment.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{attachment.type.toUpperCase()} File</p>
                {downloadButton}
              </div>
            </div>
          );
      }
    } catch (e) {
      return (
        <div className={previewStyle}>
          <div className="text-center p-6">
            <FileTypeIcon type={attachment.type} className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">{attachment.name}</h3>
            <p className="text-sm text-gray-500 mb-4">Preview not available</p>
            {downloadButton}
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
          <LucideToggleRight className="w-4 h-4 mr-1" />
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
      
      <button onClick={() => handleListButton(false)} className="p-2 rounded hover:bg-gray-100">
        <List className="w-4 h-4" />
      </button>
      <button onClick={() => handleListButton(true)} className="p-2 rounded hover:bg-gray-100">
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
    // <AuthGuard>
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
            <div className="flex-1 overflow-y-auto flex flex-col">
              {/* Document Header */}
              <div className="p-4 border-b">
                {isEditingTitle ? (
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={currentDoc.title}
                      onChange={(e) => setCurrentDoc({ ...currentDoc, title: e.target.value })}
                      className="text-2xl font-bold flex-1 border-b focus:outline-none focus:border-blue-500"
                      autoFocus
                      onBlur={() => setIsEditingTitle(false)}
                      onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                    />
                  </div>
                ) : (
                  <h1
                    className="text-2xl font-bold cursor-pointer hover:bg-gray-50 p-1 rounded"
                    onClick={() => setIsEditingTitle(true)}
                  >
                    {currentDoc.title}
                  </h1>
                )}
                
             
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <span>Last edited: {currentDoc.lastEdited}</span>
                  <span className="mx-2">•</span>
                  <span className="capitalize">{currentDoc.status}</span>
                     <div className='flex flex-1 items-end justify-end'>
                     {currentDoc.sharedWith && currentDoc.sharedWith.length > 0 && (
                  <div className="flex items-center space-x-2 m-2">
  <span className="text-sm text-gray-600">Shared to:</span>
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
</div>
                  )}
                </div>
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap items-center mt-3 gap-2">
                  {currentDoc.tags?.map((tag, i) => (
                    <div key={i} className="flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-xs">
                      {tag}
                      {viewMode === 'edit' && (
                        <button 
                          onClick={() => removeTag(tag)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                  
                  {viewMode === 'edit' && (
                    <div className="relative">
                      <input
                        type="text"
                        ref={tagInputRef}
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addTag()}
                        placeholder="Add tag..."
                        className="text-xs border rounded-full px-3 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      {newTag && (
                        <button 
                          onClick={addTag}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Document Actions */}
                <div className="flex items-center mt-3 gap-2">
                  {currentDoc.sharedWith && currentDoc.sharedWith.length > 0 && (
                    <div className="flex items-center text-xs text-gray-500">
                      <Users className="w-3 h-3 mr-1" />
                      <span>Shared with {currentDoc.sharedWith.length} member(s)</span>
                    </div>
                  )}
                  
                  {currentDoc.assignedTo && (
                    <div className="flex items-center text-xs text-gray-500">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      <span>Assigned to: {getTaskById(currentDoc.assignedTo)?.title || 'Task'}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Document Content */}
              {viewMode === 'edit' ? (
                <>
                  <div
                    ref={editorRef}
                    contentEditable
                    dangerouslySetInnerHTML={{ __html: currentDoc.content }}
                    onInput={updateContent}
                    className="flex-1 p-6 focus:outline-none"
                    style={{ fontFamily, fontSize, color: textColor }}
                  />
                  
                  {/* Attachments Section */}
                  <div className="p-4 border-t">
                    <h3 className="font-medium mb-3 flex items-center">
                      <Paperclip className="w-4 h-4 mr-2" />
                      Attachments ({currentDoc.attachments?.length || 0})
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {currentDoc.attachments?.map(attachment => (
                        <div key={attachment.id} className="border rounded-lg p-3 hover:shadow-sm transition-shadow">
                          <div className="flex items-start">
                            <div className="mr-3">
                              <FileTypeIcon type={attachment.type} className="w-8 h-8 text-blue-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{attachment.name}</p>
                              <p className="text-xs text-gray-500">{attachment.size}</p>
                              <p className="text-xs text-gray-500">{attachment.uploadedAt}</p>
                            </div>
                            <button 
                              onClick={() => removeAttachment(attachment.id)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <button 
                            onClick={() => setActivePreview(attachment.id)}
                            className="mt-2 w-full text-xs text-blue-600 hover:text-blue-800 flex items-center justify-center"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            Preview
                          </button>
                        </div>
                      ))}
                      
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
                      >
                        <Plus className="w-6 h-6 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 text-center">Add attachment</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-6">
                  {activePreview ? (
                    <>
                      <button 
                        onClick={() => setActivePreview(null)}
                        className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <ChevronDown className="w-4 h-4 mr-1 transform rotate-90" />
                        Back to document
                      </button>
                      
                      {currentDoc.attachments?.find(a => a.id === activePreview) && 
                        renderFilePreview(currentDoc.attachments.find(a => a.id === activePreview)!)
                      }
                    </>
                  ) : (
                    <>
                      <div 
                        dangerouslySetInnerHTML={{ __html: currentDoc.content }}
                        className="prose max-w-none"
                      />
                      
                      {currentDoc.attachments && currentDoc.attachments.length > 0 && (
                        <div className="mt-8">
                          <h3 className="font-medium mb-3 flex items-center">
                            <Paperclip className="w-4 h-4 mr-2" />
                            Attachments ({currentDoc.attachments.length})
                          </h3>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {currentDoc.attachments.map(attachment => (
                              <div key={attachment.id} className="border rounded-lg p-3 hover:shadow-sm transition-shadow">
                                <div className="flex items-start">
                                  <div className="mr-3">
                                    <FileTypeIcon type={attachment.type} className="w-8 h-8 text-blue-500" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{attachment.name}</p>
                                    <p className="text-xs text-gray-500">{attachment.size}</p>
                                    <p className="text-xs text-gray-500">{attachment.uploadedAt}</p>
                                  </div>
                                </div>
                                <button 
                                  onClick={() => setActivePreview(attachment.id)}
                                  className="mt-2 w-full text-xs text-blue-600 hover:text-blue-800 flex items-center justify-center"
                                >
                                  <Eye className="w-3 h-3 mr-1" />
                                  Preview
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Share Dialog */}
        {showShareDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-4 border-b">
                <h3 className="font-medium">Share Document</h3>
              </div>
              
              <div className="p-4">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search team members..."
                    className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={memberSearchQuery}
                    onChange={(e) => setMemberSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {filteredMembers.map(member => (
                    <div 
                      key={member.id} 
                      className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                      onClick={() => toggleMemberSelection(member.id)}
                    >
                      <input 
                        type="checkbox" 
                        checked={selectedMembers.includes(member.id)}
                        onChange={() => {}}
                        className="mr-3"
                      />
                      <img 
                        src={member.avatar || `https://ui-avatars.com/api/?name=${member.name}&background=random`} 
                        alt={member.name}
                        className="w-8 h-8 rounded-full mr-3"
                      />
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-xs text-gray-500">{member.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-4 border-t flex justify-end space-x-2">
                <button
                  onClick={toggleShareDialog}
                  className="px-4 py-2 border rounded-md hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={saveSharedMembers}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Task Assignment Dialog */}
        {showTaskDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-4 border-b">
                <h3 className="font-medium">Assign to Task</h3>
              </div>
              
              <div className="p-4 space-y-3">
                {tasks.map(task => (
                  <div 
                    key={task.id} 
                    className={`p-3 border rounded-md cursor-pointer ${currentDoc.assignedTo === task.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}
                    onClick={() => assignToTask(task.id)}
                  >
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        task.status === 'todo' ? 'bg-gray-300' :
                        task.status === 'in-progress' ? 'bg-yellow-400' :
                        'bg-green-500'
                      }`}></div>
                      <p className="font-medium">{task.title}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 capitalize">{task.status.replace('-', ' ')}</p>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t flex justify-end">
                <button
                  onClick={toggleTaskDialog}
                  className="px-4 py-2 border rounded-md hover:bg-gray-100"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    // </AuthGuard>
  );
};
