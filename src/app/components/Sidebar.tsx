"use client"
import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Terminal, 
  MessageSquare, 
  Github,
  UploadCloudIcon, 
  Blocks, 
  MailCheckIcon,
  Workflow,
  BotIcon,
  PenLine
} from 'lucide-react';

const Header = () => {
  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/manageprojects', icon: FolderKanban, label: 'Projects' },
    { path: '/email', icon: MailCheckIcon, label: 'Emails' },
    { path: '/api-testing', icon: Terminal, label: 'API Testing' },
    { path: '/chat', icon: MessageSquare, label: 'Chat' },
    { path: '/github', icon: Github, label: 'GitHub' },
    { path: '/ai-agent', icon: BotIcon, label: 'AI-Agent' },
    { path: '/deployment', icon: UploadCloudIcon, label: 'Deployment' },
    { path: '/integrations', icon: Blocks, label: 'Integrations' },
    { path: '/workflow-automation', icon: Workflow, label: 'workflow-automation' },
    { path: '/designArchitecture', icon: PenLine, label: 'Architect' },
  ];

  const location = useLocation();
  const [sliderStyle, setSliderStyle] = useState({});
  const navRef = useRef(null);
  const itemsRef = useRef(new Map());

  useEffect(() => {
    const updateSlider = () => {
      const currentPath = location.pathname;
      const navItem = navItems.find(item => item.path === currentPath);
      
      if (navItem) {
        const tabElement = itemsRef.current.get(navItem.path);
        if (tabElement && navRef.current) {
          const navRect = navRef.current.getBoundingClientRect();
          const tabRect = tabElement.getBoundingClientRect();
          
          setSliderStyle({
            left: tabRect.left - navRect.left,
            width: tabRect.width,
            height: tabRect.height,
            opacity: 1,
            transition: 'left 300ms cubic-bezier(0.4, 0, 0.2, 1), width 300ms cubic-bezier(0.4, 0, 0.2, 1)'
          });
        }
      }
    };

    updateSlider();
    window.addEventListener('resize', updateSlider);
    
    return () => {
      window.removeEventListener('resize', updateSlider);
    };
  }, [location]);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10 w-full">
      <div className="w-full px-4">
        <div className="flex items-center justify-between h-16 w-full">
          <div className="flex items-center overflow-hidden whitespace-nowrap relative">
            <nav 
              ref={navRef}
              className="flex space-x-1 relative"
            >
              {/* Sliding background element */}
              <div 
                className="absolute bg-blue-100 rounded-md"
                style={{
                  ...sliderStyle,
                  pointerEvents: 'none'
                }}
              />
              
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  ref={(el) => el && itemsRef.current.set(item.path, el)}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors relative z-10 ${
                      isActive 
                        ? 'text-blue-600 font-medium' 
                        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                    }`
                  }
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center">
            {/* Placeholder for right-aligned elements */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;