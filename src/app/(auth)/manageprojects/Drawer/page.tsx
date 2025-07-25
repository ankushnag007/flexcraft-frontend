"use client";
import { Folder, User, Bell, ChevronDown } from "lucide-react";
import { useState } from "react";

type TabType = 'profile' | 'notifications' | 'team';

const Drawer = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-4 p-4">
            <div className="flex flex-col items-center py-2">
              <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-medium mb-2">
                JD
              </div>
              <h3 className="text-lg font-medium">John Doe</h3>
              <p className="text-gray-500 text-sm">john.doe@example.com</p>
            </div>
            
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg">
                Edit Profile
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg">
                Account Settings
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg">
                Privacy Settings
              </button>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-4 p-4">
            <h3 className="font-medium text-lg">Notifications</h3>
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex justify-between">
                    <span className="font-medium">Notification {item}</span>
                    <span className="text-xs text-gray-500">2h ago</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    This is a sample notification message about something important.
                  </p>
                </div>
              ))}
            </div>
            <button className="w-full text-center text-blue-500 hover:text-blue-700 mt-2">
              View All Notifications
            </button>
          </div>
        );
      case 'team':
        return (
          <div className="space-y-4 p-4">
            <h3 className="font-medium text-lg">Team Members</h3>
            <div className="space-y-3">
              {['Jane Smith', 'Mike Johnson', 'Sarah Williams'].map((name, index) => (
                <div key={index} className="flex items-center p-2 hover:bg-gray-100 rounded-lg">
                  <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-medium mr-3">
                    {name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium">{name}</p>
                    <p className="text-xs text-gray-500">{name.split(' ')[0].toLowerCase()}@example.com</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Invite Team Member
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  const handleTabClick = (tab: TabType) => {
    if (isPanelOpen && activeTab === tab) {
      setIsPanelOpen(false);
    } else {
      setActiveTab(tab);
      setIsPanelOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow p-6">
        <div className="flex flex-col">
          {/* Buttons Row */}
          <div className="flex space-x-4 relative">
            <button
              onClick={() => handleTabClick('profile')}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                isPanelOpen && activeTab === 'profile' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
              }`}
            >
              <User className="w-4 h-4 mr-2" />
              My Profile
              <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${
                isPanelOpen && activeTab === 'profile' ? 'rotate-180' : ''
              }`}/>
            </button>
            <button
              onClick={() => handleTabClick('notifications')}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                isPanelOpen && activeTab === 'notifications' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
              }`}
            >
              <Bell className="h-4 w-4 mr-2" />
              Notifications
              <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${
                isPanelOpen && activeTab === 'notifications' ? 'rotate-180' : ''
              }`}/>
            </button>
            <button
              onClick={() => handleTabClick('team')}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                isPanelOpen && activeTab === 'team' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
              }`}
            >
              <Folder className="h-4 w-4 mr-2" />
              Team
              <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${
                isPanelOpen && activeTab === 'team' ? 'rotate-180' : ''
              }`}/>
            </button>
          </div>

          {/* Content Panel */}
          {isPanelOpen && (
            <div className="mt-2 border rounded-lg shadow-sm bg-white overflow-hidden">
              {renderTabContent()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Drawer;