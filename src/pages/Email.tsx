import { useState, useEffect } from 'react';
import {
  Search, Inbox, Send, FileText, Star, Trash2, Mail, ChevronDown, Menu,
  RefreshCw, MoreVertical, Paperclip, Archive, Clock, Tag, Minus, X,
  ChevronLeft, ChevronRight, MailOpen, Reply, Forward, Filter, Folder
} from 'lucide-react';
import EmailListSkeleton from './EmailSkeleton';

const EmailApp = () => {
  // State for emails
  const [emails, setEmails] = useState([
    { id: 1, from: 'john.doe@example.com', subject: 'Weekly Team Meeting', 
      body: 'Hi team, just a reminder about our weekly sync tomorrow at 10 AM. Please prepare your updates and join on time. We\'ll be discussing the Q2 roadmap and upcoming product launches.', 
      time: '10:30 AM', read: false, starred: true, category: 'Work', labels: ['Important'], attachments: [] },
    { id: 2, from: 'amazon@shopping.com', subject: 'Your order has shipped!', 
      body: 'Your recent order #12345 has been shipped and will arrive in 2-3 business days. You can track your package using the following link: [tracking link]', 
      time: 'Yesterday', read: true, starred: false, category: 'Shopping', labels: [], attachments: ['receipt.pdf'] },
    { id: 3, from: 'linkedin@mail.linkedin.com', subject: 'New connection request', 
      body: 'You have 5 new connection requests waiting for your response. Grow your network by connecting with professionals in your industry.', 
      time: 'Mar 15', read: true, starred: false, category: 'Social', labels: ['Networking'], attachments: [] },
    { id: 4, from: 'support@acme.com', subject: 'Your support ticket #4567', 
      body: 'We\'ve received your support request and assigned it ticket #4567. Our team will get back to you within 24 hours.', 
      time: 'Mar 14', read: false, starred: false, category: 'Support', labels: [], attachments: [] },
    { id: 5, from: 'newsletter@tech.com', subject: 'This Week in Tech: Latest Updates', 
      body: 'Here are the biggest tech stories this week: 1. Apple announces new products 2. Google releases new AI features 3. Microsoft updates Windows security', 
      time: 'Mar 12', read: true, starred: true, category: 'Newsletters', labels: ['Read Later'], attachments: ['tech_news.pdf'] },
  ]);

  // App state
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [currentFolder, setCurrentFolder] = useState('inbox');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [newEmail, setNewEmail] = useState({
    to: '',
    subject: '',
    body: '',
    attachments: []
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New Message',
      message: 'You have received a new message from John Doe',
      time: '2 minutes ago',
      unread: true,
    },
    {
      id: 2,
      title: 'System Update',
      message: 'A new system update is available',
      time: '1 hour ago',
      unread: false,
    },
    {
      id: 3,
      title: 'Reminder',
      message: 'Meeting with the team at 3 PM',
      time: 'Yesterday',
      unread: true,
    },
  ]);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
    
    // Mark notifications as read when opening
    if (!isOpen) {
      setNotifications(notifications.map(notification => ({
        ...notification,
        unread: false
      })));
    }
  };
  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 1500);
  };
  // Filter emails based on current folder and search
  const filteredEmails = emails.filter(email => {
    // Folder filtering
    if (currentFolder === 'inbox') return true;
    if (currentFolder === 'starred') return email.starred;
    if (currentFolder === 'sent') return email.from === 'me@example.com';
    if (currentFolder === 'drafts') return false; // Add draft logic
    if (currentFolder === 'trash') return false; // Add trash logic
    
    // Search filtering
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        email.from.toLowerCase().includes(query) ||
        email.subject.toLowerCase().includes(query) ||
        email.body.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  // Email actions
  const markAsRead = (id) => {
    setEmails(emails.map(email => 
      email.id === id ? { ...email, read: true } : email
    ));
  };

  const toggleStar = (id) => {
    setEmails(emails.map(email => 
      email.id === id ? { ...email, starred: !email.starred } : email
    ));
  };

  const deleteEmail = (id) => {
    // In a real app, you might move to trash instead of deleting
    setEmails(emails.filter(email => email.id !== id));
    if (selectedEmail?.id === id) setSelectedEmail(null);
  };

  const moveToFolder = (id, folder) => {
    // Implement folder logic
    console.log(`Move email ${id} to ${folder}`);
  };

  const handleSendEmail = () => {
    const newSentEmail = {
      id: emails.length + 1,
      from: 'me@example.com',
      subject: newEmail.subject,
      body: newEmail.body,
      time: 'Just now',
      read: true,
      starred: false,
      category: 'Sent',
      labels: [],
      attachments: newEmail.attachments
    };
    
    setEmails([newSentEmail, ...emails]);
    setComposeOpen(false);
    setNewEmail({ to: '', subject: '', body: '', attachments: [] });
  };

  // Handle email selection
  const handleSelectEmail = (email) => {
    setSelectedEmail(email);
    if (!email.read) markAsRead(email.id);
  };

  // Toggle email selection
  const toggleEmailSelection = (id, checked) => {
    if (checked) {
      setSelectedEmails([...selectedEmails, id]);
    } else {
      setSelectedEmails(selectedEmails.filter(emailId => emailId !== id));
    }
  };

  // Select all emails
  const selectAllEmails = (checked) => {
    if (checked) {
      setSelectedEmails(filteredEmails.map(email => email.id));
    } else {
      setSelectedEmails([]);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4">
          <button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg flex items-center justify-center"
            onClick={() => setComposeOpen(true)}
          >
            <Mail className="h-5 w-5 mr-2" />
            New Mail
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto">
          <ul>
            <li className="px-2">
              <button 
                onClick={() => setCurrentFolder('inbox')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${currentFolder === 'inbox' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <Inbox className="h-5 w-5 mr-3" />
                Inbox
                <span className="ml-auto bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {emails.filter(e => !e.read).length}
                </span>
              </button>
            </li>
            <li className="px-2">
              <button 
                onClick={() => setCurrentFolder('starred')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${currentFolder === 'starred' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <Star className="h-5 w-5 mr-3 text-yellow-500" />
                Starred
              </button>
            </li>
            <li className="px-2">
              <button 
                onClick={() => setCurrentFolder('sent')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${currentFolder === 'sent' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <Send className="h-5 w-5 mr-3" />
                Sent
              </button>
            </li>
            <li className="px-2">
              <button 
                onClick={() => setCurrentFolder('drafts')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${currentFolder === 'drafts' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <FileText className="h-5 w-5 mr-3" />
                Drafts
              </button>
            </li>
            <li className="px-2">
              <button 
                onClick={() => setCurrentFolder('trash')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${currentFolder === 'trash' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <Trash2 className="h-5 w-5 mr-3" />
                Trash
              </button>
            </li>
          </ul>

          {/* Labels Section */}
          <div className="px-4 py-2 mt-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Labels</h3>
            <ul className="mt-2">
              {['Work', 'Personal', 'Important', 'Travel'].map(label => (
                <li key={label}>
                  <button className="flex items-center px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded-md w-full">
                    <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 py-2 px-4 flex items-center">
          <div className="flex items-center flex-1">
            <button className="p-2 rounded-full hover:bg-gray-100 mr-2">
              <Menu className="h-5 w-5 text-gray-600" />
            </button>
            <div className="relative flex-1 max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search mail"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
          <div className="flex space-x-3">
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className={`flex items-center px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 ${
              isSyncing ? "opacity-70" : ""
            }`}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isSyncing ? "animate-spin" : ""}`}
            />
            <span>Sync</span>
          </button>
     
        </div>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Filter className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <MoreVertical className="h-5 w-5 text-gray-600" />
            </button>
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
              JD
            </div>
          </div>
        </header>

        {/* Email List and Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Email List */}
          <div className={`${selectedEmail ? 'hidden md:block md:w-2/5' : 'w-full'} border-r border-gray-200 bg-white overflow-y-auto`}>
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-2 flex justify-between items-center">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  className="h-4 w-4 text-blue-600 rounded"
                  checked={selectedEmails.length === filteredEmails.length && filteredEmails.length > 0}
                  onChange={(e) => selectAllEmails(e.target.checked)}
                />
                <button className="ml-3 p-1 rounded hover:bg-gray-100">
                  <ChevronDown className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              <div className="flex space-x-1">
                <button 
                  className="p-1 rounded hover:bg-gray-100"
                  onClick={() => selectedEmails.forEach(id => moveToFolder(id, 'archive'))}
                >
                  <Archive className="h-5 w-5 text-gray-600" />
                </button>
                <button 
                  className="p-1 rounded hover:bg-gray-100"
                  onClick={() => selectedEmails.forEach(id => deleteEmail(id))}
                >
                  <Trash2 className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-1 rounded hover:bg-gray-100">
                  <Tag className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
{
  isSyncing ?
  <EmailListSkeleton />:
            <ul className="divide-y divide-gray-200">
              {filteredEmails.map((email) => (
                <li 
                  key={email.id} 
                  className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${!email.read ? 'bg-blue-50' : ''} ${selectedEmail?.id === email.id ? 'bg-blue-100' : ''}`}
                  onClick={() => handleSelectEmail(email)}
                >
                  <div className="flex items-center mb-1">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 text-blue-600 rounded mr-3"
                      checked={selectedEmails.includes(email.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleEmailSelection(email.id, e.target.checked);
                      }}
                    />
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStar(email.id);
                      }}
                      className="mr-2"
                    >
                      <Star className={`h-5 w-5 ${email.starred ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                    </button>
                    <span className={`font-medium ${!email.read ? 'text-gray-900' : 'text-gray-600'}`}>
                      {email.from.split('@')[0]}
                    </span>
                    <span className="ml-auto text-xs text-gray-500">{email.time}</span>
                  </div>
                  <div className="pl-9">
                    <h3 className={`text-sm ${!email.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                      {email.subject}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">{email.body}</p>
                    {email.labels.length > 0 && (
                      <div className="mt-1 flex items-center space-x-1">
                        {email.labels.map(label => (
                          <span key={label} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            {label}
                          </span>
                        ))}
                      </div>
                    )}
                    {email.attachments.length > 0 && (
                      <div className="mt-1 flex items-center">
                        <Paperclip className="h-3 w-3 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-500">{email.attachments.length} attachment</span>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul> 
}
          </div>

          {/* Email Content */}
          {selectedEmail && (
            <div className="flex-1 overflow-y-auto bg-white">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <button 
                    className="md:hidden p-1 rounded hover:bg-gray-100"
                    onClick={() => setSelectedEmail(null)}
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-600" />
                  </button>
                  <button 
                    className="p-1 rounded hover:bg-gray-100"
                    onClick={() => deleteEmail(selectedEmail.id)}
                  >
                    <Trash2 className="h-5 w-5 text-gray-600" />
                  </button>
                  <button 
                    className="p-1 rounded hover:bg-gray-100"
                    onClick={() => moveToFolder(selectedEmail.id, 'archive')}
                  >
                    <Archive className="h-5 w-5 text-gray-600" />
                  </button>
                  <button 
                    className="p-1 rounded hover:bg-gray-100"
                    onClick={() => toggleStar(selectedEmail.id)}
                  >
                    <Star className={`h-5 w-5 ${selectedEmail.starred ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`} />
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-1 rounded hover:bg-gray-100">
                    <Clock className="h-5 w-5 text-gray-600" />
                  </button>
                  <button className="p-1 rounded hover:bg-gray-100">
                    <Folder className="h-5 w-5 text-gray-600" />
                  </button>
                  <button className="p-1 rounded hover:bg-gray-100">
                    <MoreVertical className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="px-6 py-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">{selectedEmail.subject}</h1>
                
                <div className="flex items-start mb-6">
                  <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center mr-4">
                    {selectedEmail.from.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-gray-900">{selectedEmail.from.split('@')[0]}</span>
                        <span className="text-sm text-gray-500 ml-2">&lt;{selectedEmail.from}&gt;</span>
                      </div>
                      <span className="text-sm text-gray-500">{selectedEmail.time}</span>
                    </div>
                    <div className="text-sm text-gray-500">to me</div>
                  </div>
                </div>

                <div className="prose max-w-none text-gray-800 mb-6">
                  <p>{selectedEmail.body}</p>
                </div>

                {selectedEmail.attachments.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Attachments ({selectedEmail.attachments.length})</h3>
                    <div className="space-y-2">
                      {selectedEmail.attachments.map((file, index) => (
                        <div key={index} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                          <div className="bg-blue-100 p-2 rounded mr-3">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">{file}</div>
                            <div className="text-xs text-gray-500">PDF • 250 KB</div>
                          </div>
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Download
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-8 flex space-x-3">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center">
                    <Reply className="h-5 w-5 mr-2" />
                    Reply
                  </button>
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium flex items-center">
                    <Forward className="h-5 w-5 mr-2" />
                    Forward
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Compose Email Modal */}
      {composeOpen && (
        <div className="fixed bottom-0 right-0 md:right-4 md:bottom-4 w-full md:w-96 bg-white rounded-t-lg md:rounded-lg shadow-xl border border-gray-300 flex flex-col z-10">
          <div className="bg-gray-800 text-white px-4 py-2 rounded-t-lg flex justify-between items-center">
            <h3 className="font-medium">New Message</h3>
            <div className="flex items-center space-x-2">
              <button className="p-1 hover:bg-gray-700 rounded">
                <Minus className="h-4 w-4" />
              </button>
              <button 
                className="p-1 hover:bg-gray-700 rounded"
                onClick={() => setComposeOpen(false)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="p-4 flex-1 flex flex-col">
            <div className="mb-4">
              <input 
                type="text" 
                placeholder="To" 
                className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                value={newEmail.to}
                onChange={(e) => setNewEmail({...newEmail, to: e.target.value})}
              />
            </div>
            <div className="mb-4">
              <input 
                type="text" 
                placeholder="Subject" 
                className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                value={newEmail.subject}
                onChange={(e) => setNewEmail({...newEmail, subject: e.target.value})}
              />
            </div>
            <div className="flex-1">
              <textarea 
                className="w-full h-full px-3 py-2 focus:outline-none resize-none"
                placeholder="Compose your email here..."
                value={newEmail.body}
                onChange={(e) => setNewEmail({...newEmail, body: e.target.value})}
              ></textarea>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <div className="flex space-x-2">
                <button className="p-2 text-gray-500 hover:text-gray-700">
                  <Paperclip className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700">
                  <Tag className="h-5 w-5" />
                </button>
              </div>
              <button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium"
                onClick={handleSendEmail}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailApp;