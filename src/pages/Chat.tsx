import React, { useState, useRef, useEffect } from 'react';
import { 
  Video, Send, Mic, MicOff, Camera, CameraOff, 
  Monitor, Maximize, Minimize, X, Smile, Paperclip,
  ChevronDown, MoreVertical, User, Search, Phone, 
  Info, Lock, AtSign, Hash, Star, Pin, Inbox
} from 'lucide-react';
import logo from "../Assets/videos/images/logo.png";

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
  avatar?: string;
  isEdited?: boolean;
  reactions?: { emoji: string; count: number }[];
}

interface User {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'away';
  avatar?: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello team! How is everyone doing?',
      sender: 'John Doe',
      timestamp: new Date(),
      avatar: 'JD',
      reactions: [{ emoji: '👍', count: 2 }]
    },
    {
      id: '2',
      text: 'Working on the new dashboard design. Will share screens soon.',
      sender: 'Jane Smith',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      avatar: 'JS',
      isEdited: true
    },
    {
      id: '3',
      text: 'The API endpoints are ready for testing. Please check the docs.',
      sender: 'Mike Johnson',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      avatar: 'MJ'
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeChannel, setActiveChannel] = useState('general');
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'John Doe', status: 'online', avatar: 'JD' },
    { id: '2', name: 'Jane Smith', status: 'online', avatar: 'JS' },
    { id: '3', name: 'Mike Johnson', status: 'away', avatar: 'MJ' },
    { id: '4', name: 'Sarah Williams', status: 'offline', avatar: 'SW' },
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: Date.now().toString(),
          text: newMessage,
          sender: 'You',
          timestamp: new Date(),
          avatar: 'YO'
        }
      ]);
      setNewMessage('');
    }
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    // In a real app, you would implement actual screen sharing here
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const groupMessagesByDate = () => {
    const grouped: { [key: string]: Message[] } = {};
    
    messages.forEach(message => {
      const dateKey = formatDate(message.timestamp);
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(message);
    });
    
    return grouped;
  };

  const groupedMessages = groupMessagesByDate();

  return (
    <div className="flex h-screen bg-gray-100 text-gray-900">
      {/* Sidebar */}
      <div className="w-16 md:w-60 bg-indigo-900 text-white flex flex-col">
        <div className="p-4 border-b border-indigo-800 flex items-center justify-between">
            <img src={logo} className="h-3  w-auto" />
          <div className="hidden md:block font-bold text-md">  
          Workspace</div>
          <button className="p-1 hover:bg-indigo-800 rounded">
            <MoreVertical size={18} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="p-3">
            <button className="w-full flex items-center p-2 hover:bg-indigo-800 rounded">
              <Hash size={16} className="mr-2" />
              <span className="hidden md:block">Threads</span>
            </button>
            
            <button className="w-full flex items-center p-2 hover:bg-indigo-800 rounded">
              <Inbox size={16} className="mr-2" />
              <span className="hidden md:block">All DMs</span>
            </button>
            
            <button className="w-full flex items-center p-2 hover:bg-indigo-800 rounded">
              <AtSign size={16} className="mr-2" />
              <span className="hidden md:block">Mentions</span>
            </button>
            
            <button className="w-full flex items-center p-2 hover:bg-indigo-800 rounded">
              <Star size={16} className="mr-2" />
              <span className="hidden md:block">Starred</span>
            </button>
          </div>
          
          <div className="px-3 py-2 text-xs text-indigo-300 hidden md:block">Channels</div>
          <div className="px-1">
            <button 
              className={`w-full flex items-center p-2 rounded ${activeChannel === 'general' ? 'bg-indigo-700' : 'hover:bg-indigo-800'}`}
              onClick={() => setActiveChannel('general')}
            >
              <Hash size={16} className="mr-2" />
              <span className="hidden md:block">general</span>
            </button>
            
            <button 
              className={`w-full flex items-center p-2 rounded ${activeChannel === 'design' ? 'bg-indigo-700' : 'hover:bg-indigo-800'}`}
              onClick={() => setActiveChannel('design')}
            >
              <Hash size={16} className="mr-2" />
              <span className="hidden md:block">design</span>
            </button>
            
            <button 
              className={`w-full flex items-center p-2 rounded ${activeChannel === 'development' ? 'bg-indigo-700' : 'hover:bg-indigo-800'}`}
              onClick={() => setActiveChannel('development')}
            >
              <Hash size={16} className="mr-2" />
              <span className="hidden md:block">development</span>
            </button>
          </div>
          
          <div className="px-3 py-2 text-xs text-indigo-300 hidden md:block">Direct Messages</div>
          <div className="px-1">
            {users.map(user => (
              <button key={user.id} className="w-full flex items-center p-2 hover:bg-indigo-800 rounded">
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  user.status === 'online' ? 'bg-green-400' : 
                  user.status === 'away' ? 'bg-yellow-400' : 'bg-gray-400'
                }`}></div>
                <div className="hidden md:block">{user.name}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Channel Header */}
        <div className="p-4 border-b flex items-center justify-between bg-white">
          <div className="flex items-center">
            <Hash size={18} className="text-gray-500 mr-2" />
            <h1 className="font-bold">{activeChannel}</h1>
            <Star size={16} className="ml-2 text-gray-400 hover:text-yellow-400 cursor-pointer" />
            <div className="ml-4 text-sm text-gray-500">
              {users.filter(u => u.status === 'online').length} online
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
              <Search size={18} />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
              <Phone size={18} />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
              <Info size={18} />
            </button>
            <button 
              onClick={() => setIsVideoCall(!isVideoCall)}
              className="flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Video size={16} className="mr-1" />
              <span>Start Call</span>
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-white">
          {Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date} className="mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {date}
                </div>
              </div>
              
              {dateMessages.map(message => (
                <div
                  key={message.id}
                  className={`flex mb-4 hover:bg-gray-50 p-2 rounded ${
                    message.sender === 'You' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.sender !== 'You' && (
                    <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center mr-3">
                      {message.avatar}
                    </div>
                  )}
                  
                  <div className={`max-w-[70%] ${
                    message.sender === 'You' ? 'flex flex-col items-end' : ''
                  }`}>
                    {message.sender !== 'You' && (
                      <div className="flex items-center mb-1">
                        <span className="font-semibold text-sm mr-2">{message.sender}</span>
                        <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                      </div>
                    )}
                    
                    <div
                      className={`rounded-lg p-3 ${
                        message.sender === 'You'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100'
                      }`}
                    >
                      <p>{message.text}</p>
                      
                      {message.isEdited && (
                        <div className="text-xs text-gray-400 mt-1">(edited)</div>
                      )}
                      
                      {message.reactions && message.reactions.length > 0 && (
                        <div className="flex mt-2 space-x-1">
                          {message.reactions.map((reaction, idx) => (
                            <div key={idx} className="bg-gray-200 bg-opacity-50 rounded-full px-2 py-0.5 text-xs">
                              {reaction.emoji} {reaction.count}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {message.sender === 'You' && (
                      <span className="text-xs text-gray-500 mt-1">
                        {formatTime(message.timestamp)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t bg-white">
          <div className="relative">
            <div className="absolute left-3 top-3 flex space-x-2">
              <button className="text-gray-500 hover:text-gray-700">
                <Paperclip size={18} />
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                <Smile size={18} />
              </button>
            </div>
            
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={`Message #${activeChannel}`}
              className="w-full pl-12 pr-16 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <div className="absolute right-3 top-3 flex space-x-2">
              <button className="text-gray-500 hover:text-gray-700">
                <Monitor size={18} />
              </button>
              <button 
                onClick={handleSendMessage}
                className={`p-1 rounded ${newMessage.trim() ? 'text-blue-600' : 'text-gray-400'}`}
                disabled={!newMessage.trim()}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Call Panel */}
      {isVideoCall && (
        <div className={`${isFullScreen ? 'fixed inset-0 z-50 bg-black' : 'w-80 bg-white border-l'}`}>
          <div className={`p-4 border-b flex justify-between items-center ${isFullScreen ? 'bg-gray-900 text-white' : 'bg-white'}`}>
            <h2 className="font-semibold">Video Call</h2>
            <div className="flex space-x-2">
              <button 
                onClick={toggleScreenShare}
                className={`p-2 rounded-full ${isScreenSharing ? 'bg-blue-600 text-white' : isFullScreen ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}
              >
                <Monitor size={16} />
              </button>
              <button 
                onClick={toggleFullScreen}
                className={`p-2 rounded-full ${isFullScreen ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}
              >
                {isFullScreen ? <Minimize size={16} /> : <Maximize size={16} />}
              </button>
              <button 
                onClick={() => setIsVideoCall(false)}
                className={`p-2 rounded-full ${isFullScreen ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
              >
                <X size={16} />
              </button>
            </div>
          </div>
          
          <div className={`${isFullScreen ? 'h-[calc(100vh-56px)]' : 'h-96'} relative`}>
            {/* Main Video (either screen share or user video) */}
            <div className={`${isFullScreen ? 'h-full' : 'h-48'} bg-gray-900 rounded-t-lg overflow-hidden`}>
              {isScreenSharing ? (
                <div className="h-full flex items-center justify-center text-white">
                  <div className="text-center">
                    <Monitor size={48} className="mx-auto mb-2" />
                    <p>Screen Sharing</p>
                  </div>
                </div>
              ) : (
                <video 
                  ref={videoRef}
                  autoPlay
                  muted={isMuted}
                  className={`h-full w-full object-cover ${isVideoOff ? 'hidden' : ''}`}
                />
              )}
              
              {isVideoOff && (
                <div className="h-full flex items-center justify-center bg-gray-800 text-white">
                  <div className="text-center">
                    <CameraOff size={48} className="mx-auto mb-2" />
                    <p>Camera is off</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Participant thumbnails */}
            {!isFullScreen && (
              <div className="grid grid-cols-3 gap-2 p-2 bg-gray-100">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-gray-200 aspect-video rounded flex items-center justify-center">
                    <User size={24} className="text-gray-500" />
                  </div>
                ))}
              </div>
            )}
            
            {/* Controls */}
            <div className={`absolute bottom-4 left-0 right-0 flex justify-center space-x-4 ${
              isFullScreen ? 'bg-transparent' : 'bg-white p-2 rounded-b-lg'
            }`}>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-3 rounded-full ${
                  isMuted ? 'bg-red-600 text-white' : isFullScreen ? 'bg-gray-700 text-white' : 'bg-gray-200'
                }`}
              >
                {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
              
              <button
                onClick={() => setIsVideoOff(!isVideoOff)}
                className={`p-3 rounded-full ${
                  isVideoOff ? 'bg-red-600 text-white' : isFullScreen ? 'bg-gray-700 text-white' : 'bg-gray-200'
                }`}
              >
                {isVideoOff ? <CameraOff size={20} /> : <Camera size={20} />}
              </button>
              
              <button
                onClick={toggleScreenShare}
                className={`p-3 rounded-full ${
                  isScreenSharing ? 'bg-blue-600 text-white' : isFullScreen ? 'bg-gray-700 text-white' : 'bg-gray-200'
                }`}
              >
                <Monitor size={20} />
              </button>
              
              <button className="p-3 rounded-full bg-red-600 text-white">
                <Phone size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;