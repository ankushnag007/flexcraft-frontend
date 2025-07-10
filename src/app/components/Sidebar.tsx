"use client"
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Terminal, 
  MessageSquare, 
  Github,
  UploadCloud, 
  Blocks, 
  MailCheck,
  Workflow,
  Bot,
  PenLine
} from 'lucide-react';
import AuthGuard from './AuthGuard';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/manageprojects', icon: FolderKanban, label: 'Projects' },
  { path: '/email', icon: MailCheck, label: 'Emails' },
  { path: '/apiworkspace', icon: Terminal, label: 'API Testing' },
  { path: '/chat', icon: MessageSquare, label: 'Chat' },
  { path: '/github', icon: Github, label: 'GitHub' },
  { path: '/aiagent', icon: Bot, label: 'AI-Agent' },
  { path: '/deployment', icon: UploadCloud, label: 'Deployment' },
  { path: '/integrationsapp', icon: Blocks, label: 'Integrations' },
  { path: '/automation', icon: Workflow, label: 'workflow-automation' },
  { path: '/flowcharts', icon: PenLine, label: 'Architect' },
];

const Header = () => {
  const pathname = usePathname();
  const [sliderStyle, setSliderStyle] = useState({ opacity: 0 });
  const navRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef(new Map<string, HTMLAnchorElement>());
  const resizeObserverRef = useRef<ResizeObserver>();
  const lastUpdateTimeRef = useRef(0);
  const animationFrameRef = useRef<number>();

  // Memoized update function with throttling
  const updateSlider = useCallback((immediate = false) => {
    const now = Date.now();
    if (!immediate && now - lastUpdateTimeRef.current < 50) {
      return; // Throttle updates to max once every 50ms
    }
    lastUpdateTimeRef.current = now;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      const activeItem = navItems.find(item => pathname.startsWith(item.path));
      
      if (activeItem) {
        const tabElement = itemsRef.current.get(activeItem.path);
        if (tabElement && navRef.current) {
          const navRect = navRef.current.getBoundingClientRect();
          const tabRect = tabElement.getBoundingClientRect();
          
          setSliderStyle(prev => ({
            ...prev,
            left: tabRect.left - navRect.left,
            width: tabRect.width,
            height: tabRect.height,
            opacity: 1,
            transition: immediate ? 'none' : 'left 300ms cubic-bezier(0.4, 0, 0.2, 1), width 300ms cubic-bezier(0.4, 0, 0.2, 1)'
          }));
        }
      }
    });
  }, [pathname]);

  // Initialize and clean up
  useEffect(() => {
    // Initial immediate render
    updateSlider(true);

    // Use ResizeObserver instead of window resize for better performance
    resizeObserverRef.current = new ResizeObserver(() => {
      updateSlider();
    });

    if (navRef.current) {
      resizeObserverRef.current.observe(navRef.current);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [updateSlider]);

  // Handle tab ref changes
  const handleTabRef = useCallback((el: HTMLAnchorElement | null, path: string) => {
    if (el) {
      itemsRef.current.set(path, el);
      if (pathname.startsWith(path)) {
        updateSlider(true);
      }
    } else {
      itemsRef.current.delete(path);
    }
  }, [pathname, updateSlider]);

  return (
    <AuthGuard>
    <header className="bg-white shadow-sm sticky top-0 z-10 w-full">
      <div className="w-full px-4">
        <div className="flex items-center justify-between h-16 w-full">
          <div className="flex items-center overflow-hidden whitespace-nowrap relative">
            <nav 
              ref={navRef}
              className="flex space-x-1 relative"
            >
              <div 
                className="absolute bg-blue-100 rounded-md"
                style={{
                  ...sliderStyle,
                  pointerEvents: 'none'
                }}
              />
              
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  ref={(el) => handleTabRef(el, item.path)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors relative z-10 ${
                    pathname.startsWith(item.path)
                      ? 'text-blue-600 font-medium' 
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center">
            {/* Placeholder for right-aligned elements */}
          </div>
        </div>
      </div>
    </header>
    </AuthGuard>
  );
};

export default Header;