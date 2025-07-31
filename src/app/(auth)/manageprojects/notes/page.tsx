import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  color: string;
  tags: string[];
}

interface NotesComponentProps {
  initialNotes?: Note[];
  onNotesChange?: (notes: Note[]) => void;
  colors?: string[];
  defaultColor?: string;
}

const NotesComponent: React.FC<NotesComponentProps> = ({
  initialNotes = [],
  onNotesChange,
  colors = ['bg-blue-100', 'bg-green-100', 'bg-yellow-100', 'bg-pink-100', 'bg-purple-100'],
  defaultColor = 'bg-blue-100',
}) => {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newTag, setNewTag] = useState('');

  const openDrawerForNewNote = () => {
    setCurrentNote({
      id: uuidv4(),
      title: '',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      color: defaultColor,
      tags: [],
    });
    setIsEditing(true);
    setIsDrawerOpen(true);
  };

  const openDrawerForViewing = (note: Note) => {
    setCurrentNote(note);
    setIsEditing(false);
    setIsDrawerOpen(true);
  };

  const handleSaveNote = () => {
    if (!currentNote?.title.trim()) return;

    const now = new Date();
    let updatedNotes: Note[];

    if (isEditing && notes.some(n => n.id === currentNote.id)) {
      updatedNotes = notes.map(note => 
        note.id === currentNote.id ? { ...currentNote, updatedAt: now } : note
      );
    } else {
      updatedNotes = [...notes, { ...currentNote, createdAt: now, updatedAt: now }];
    }

    setNotes(updatedNotes);
    if (onNotesChange) onNotesChange(updatedNotes);
    setIsDrawerOpen(false);
  };

  const handleDeleteNote = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    if (onNotesChange) onNotesChange(updatedNotes);
    setIsDrawerOpen(false);
  };

  const handleAddTag = () => {
    if (currentNote && newTag.trim() && !currentNote.tags.includes(newTag.trim())) {
      setCurrentNote({
        ...currentNote,
        tags: [...currentNote.tags, newTag.trim()],
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (currentNote) {
      setCurrentNote({
        ...currentNote,
        tags: currentNote.tags.filter(tag => tag !== tagToRemove),
      });
    }
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Prevent drawer from closing when clicking inside
  const handleDrawerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="flex h-full relative">
      {/* Main Content */}
      <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Notes</h2>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            />
            <button
              onClick={openDrawerForNewNote}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
            >
              Add Note
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.length > 0 ? (
            filteredNotes.map(note => (
              <div 
                key={note.id} 
                className={`${note.color} p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
                onClick={() => openDrawerForViewing(note)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-lg truncate">{note.title}</h3>
                </div>
                <p className="text-gray-700 line-clamp-3 mb-3">{note.content}</p>
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {note.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="inline-block px-2 py-1 bg-white bg-opacity-50 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-500">
                  Updated: {formatDate(note.updatedAt)}
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              {searchTerm ? 'No notes match your search' : 'No notes yet. Add your first note!'}
            </div>
          )}
        </div>
      </div>

      {/* Overlay - Only shown when drawer is open */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-[rgba(0,0,0,0.4)]  z-20 transition-opacity duration-300"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Drawer/Sidebar */}
      <div 
        className={`fixed inset-y-0 right-0 w-full overflow-y-auto md:w-2/2 lg:w-4/8 bg-white shadow-lg transform ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out z-30`}
        onClick={handleDrawerClick}
      >
        {currentNote && (
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium">
                {isEditing 
                  ? notes.some(n => n.id === currentNote.id) 
                    ? 'Edit Note' 
                    : 'Add Note'
                  : 'View Note'}
              </h3>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Title"
                    value={currentNote.title}
                    onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded text-lg font-medium"
                    autoFocus
                  />
                  <textarea
                    placeholder="Write your note here..."
                    value={currentNote.content}
                    onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded h-48"
                  />
                  <div className="flex flex-wrap gap-2">
                    {currentNote.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="inline-flex items-center px-2 py-1 bg-gray-200 rounded-full text-xs"
                      >
                        {tag}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveTag(tag);
                          }}
                          className="ml-1 text-gray-500 hover:text-gray-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    <div className="flex">
                      <input
                        type="text"
                        placeholder="Add tag"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                        className="px-2 py-1 border border-gray-300 rounded-l text-xs"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddTag();
                        }}
                        className="px-2 py-1 bg-gray-200 text-gray-700 rounded-r text-xs hover:bg-gray-300"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {colors.map(color => (
                      <button
                        key={color}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentNote({ ...currentNote, color });
                        }}
                        className={`w-6 h-6 rounded-full ${color} border-2 ${
                          currentNote.color === color ? 'border-blue-500' : 'border-transparent'
                        }`}
                        title={color.replace('bg-', '').replace('-100', '')}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold">{currentNote.title}</h2>
                  <div className={`p-4 rounded-lg ${currentNote.color}`}>
                    <p className="whitespace-pre-line">{currentNote.content}</p>
                  </div>
                  {currentNote.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {currentNote.tags.map(tag => (
                        <span 
                          key={tag} 
                          className="inline-block px-2 py-1 bg-gray-200 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="text-sm text-gray-500">
                    <p>Created: {formatDate(currentNote.createdAt)}</p>
                    <p>Last updated: {formatDate(currentNote.updatedAt)}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 flex justify-between">
              {isEditing ? (
                <>
                  {notes.some(n => n.id === currentNote.id) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNote(currentNote.id);
                      }}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSaveNote();
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ml-auto"
                    disabled={!currentNote.title.trim()}
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditing(true);
                      setCurrentNote({ ...currentNote, updatedAt: new Date() });
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDrawerOpen(false);
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  >
                    Close
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesComponent;