import { ArrowUpDown, ChevronDown, Filter, LayoutGrid, ListIcon, Plus, Search, X } from 'lucide-react'
import React,{useState} from 'react'

const header = () => {
     const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
      const [isSearchOpen, setIsSearchOpen] = useState(false);
      const [searchQuery, setSearchQuery] = useState('');
      const [isCreatingTask, setIsCreatingTask] = useState(false);
      const [newTaskStatus, setNewTaskStatus] = useState('');
      const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
        const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) setSearchQuery('');
  };
  return (
          <div className=" bg-white border-b border-gray-200">
            <div className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                {/* Left side - Title and details */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div className="flex items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Website Redesignee</h1>
                    <ChevronDown className="w-5 h-5 ml-2 text-gray-500" />
                  </div>
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                    <span>Project Key: WEB</span>
                    <span>Lead: John Doe</span>
                    <span>Version: 2.0</span>
                  </div>
                </div>
    
                {/* Right side - Buttons */}
                <div className="flex items-center gap-2">
                  <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-100 whitespace-nowrap">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </button>
                  <button
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 whitespace-nowrap"
                    onClick={() => setIsCreatingTask(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create
                  </button>
                </div>
              </div>
            </div>
    
            {/* View Options */}
            <div className="px-6 pb-4">
              <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
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
            </div>
          </div>
  )
}

export default header