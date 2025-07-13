"use client"
import React, { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
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
  PenLine,
  X,
  ArrowRight,
  ArrowLeft,
  HelpCircle
} from 'lucide-react'
import AuthGuard from './AuthGuard'
import { themes, defaultTheme, Theme } from '@/app/themes'

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
]

const Header = () => {
  const pathname = usePathname()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<string | null>(null)
  const [showTour, setShowTour] = useState(false)
  const [hasCompletedTour, setHasCompletedTour] = useState(false)
  const [currentTourStep, setCurrentTourStep] = useState(0)
  
  const navRef = useRef<HTMLDivElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<Map<string, HTMLAnchorElement>>(new Map())
  const resizeObserverRef = useRef<ResizeObserver | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const tourTooltipRef = useRef<HTMLDivElement>(null)

  const updateSlider = useCallback((immediate = false) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  
    animationFrameRef.current = requestAnimationFrame(() => {
      const currentPath = navItems.find(item => pathname.startsWith(item.path))?.path || activeTab;
      if (!currentPath) return;
  
      const tabElement = itemsRef.current.get(currentPath);
      if (!tabElement || !navRef.current || !sliderRef.current) return;
  
      const navRect = navRef.current.getBoundingClientRect();
      const tabRect = tabElement.getBoundingClientRect();
  
      const left = tabRect.left - navRect.left;
      const width = tabRect.width;
  
      // Store sliderRef.current in a variable to avoid repeated null checks
      const sliderElement = sliderRef.current;
      
      if (immediate) {
        sliderElement.style.transition = 'none';
        sliderElement.style.transform = `translateX(${left}px)`;
        sliderElement.style.width = `${width}px`;
      } else {
        // First frame - set the transition
        sliderElement.style.transition = 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)';
        
        // Next frame - apply the transform
        requestAnimationFrame(() => {
          // Check again in case the element was unmounted
          if (sliderRef.current) {
            sliderRef.current.style.transform = `translateX(${left}px)`;
            sliderRef.current.style.width = `${width}px`;
          }
        });
      }
    });
  }, [pathname, activeTab]);
  

  useEffect(() => {
    const initialTab = navItems.find(item => pathname.startsWith(item.path))
    if (initialTab) {
      setActiveTab(initialTab.path)
      // Set initial tour step to match current path
      const initialStep = navItems.findIndex(item => item.path === initialTab.path)
      
      setCurrentTourStep(initialStep >= 0 ? initialStep : 0)
    }

    const tourCompleted = localStorage.getItem('navTourCompleted')
    if (tourCompleted !== 'true') {
      setTimeout(() => setShowTour(true), 1500)
    }

    resizeObserverRef.current = new ResizeObserver(() => {
      // Debounce the resize updates
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      animationFrameRef.current = requestAnimationFrame(() => {
        updateSlider();
      });
    });

    if (navRef.current) {
      resizeObserverRef.current.observe(navRef.current)
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
      }
    }
  }, [updateSlider, pathname])

  const handleTabRef = useCallback((el: HTMLAnchorElement | null, path: string) => {
    if (el) {
      itemsRef.current.set(path, el)
      if (pathname.startsWith(path)) {
        setActiveTab(path)
        updateSlider(true)
      }
    } else {
      itemsRef.current.delete(path)
    }
  }, [pathname, updateSlider])

  const handleNextTourStep = () => {
    if (currentTourStep < navItems.length - 1) {
      const nextStep = currentTourStep + 1
      setCurrentTourStep(nextStep)
      router.push(navItems[nextStep].path)
    } else {
      handleCompleteTour()
    }
  }

  const handlePrevTourStep = () => {
    if (currentTourStep > 0) {
      const prevStep = currentTourStep - 1
      setCurrentTourStep(prevStep)
      router.push(navItems[prevStep].path)
    }
  }

  const handleCompleteTour = () => {
    setShowTour(false)
    setHasCompletedTour(true)
    localStorage.setItem('navTourCompleted', 'true')
  }

  const positionTourTooltip = useCallback(() => {
    if (!showTour || !tourTooltipRef.current) return

    const currentItem = navItems[currentTourStep]
    if (!currentItem) return

    const element = itemsRef.current.get(currentItem.path)
    if (!element || !navRef.current) return

    const navRect = navRef.current.getBoundingClientRect()
    const itemRect = element.getBoundingClientRect()

    const tooltip = tourTooltipRef.current
    const tooltipWidth = tooltip.offsetWidth
    const viewportWidth = window.innerWidth

    let left = itemRect.left + itemRect.width / 2 - tooltipWidth / 2
    left = Math.max(20, Math.min(left, viewportWidth - tooltipWidth - 20))

    const top = itemRect.bottom + 10

    tooltip.style.left = `${left}px`
    tooltip.style.top = `${top}px`
  }, [currentTourStep, showTour])

  useEffect(() => {
    if (!showTour) return

    const currentItem = navItems[currentTourStep]
    if (!currentItem) return

    const element = itemsRef.current.get(currentItem.path)
    if (!element) return

    element.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'nearest', 
      inline: 'center' 
    })

    element.classList.add('tour-highlight')
    positionTourTooltip()

    const handleResize = () => positionTourTooltip()
    window.addEventListener('resize', handleResize)

    return () => {
      element.classList.remove('tour-highlight')
      window.removeEventListener('resize', handleResize)
    }
  }, [currentTourStep, showTour, positionTourTooltip])

  const getTourDescription = (path: string): string => {
    const descriptions: Record<string, string> = {
      '/dashboard': 'This is your main dashboard where you can see an overview of all your projects and activities.',
      '/manageprojects': 'Manage all your projects here. Create new ones, track progress, and organize your work.',
      '/email': 'Access your email integration. View sent emails and create new email campaigns.',
      '/apiworkspace': 'Test and debug your APIs in this workspace. Make requests and inspect responses.',
      '/chat': 'Collaborate with your team through our chat interface. Start new conversations here.',
      '/github': 'Connect and manage your GitHub repositories. View commits and pull requests.',
      '/aiagent': 'Interact with our AI assistant to get help with your work and automate tasks.',
      '/deployment': 'Deploy your applications and manage your deployment pipelines from this section.',
      '/integrationsapp': 'Configure and manage all your third-party integrations in one place.',
      '/automation': 'Create and manage workflow automations to streamline your processes.',
      '/flowcharts': 'Design system architectures and flowcharts with our visual editor.',
    }
    return descriptions[path] || 'This section helps you manage important aspects of your work.'
  }

  const handleNavClick = (path: string, e: React.MouseEvent) => {
    if (!showTour) return
    
    const clickedIndex = navItems.findIndex(item => item.path === path)
    if (clickedIndex >= 0) {
      setCurrentTourStep(clickedIndex)
    }
  }

  return (
    <AuthGuard>
      <header className="bg-[var(--theme-background)] shadow-sm sticky top-0 z-10 w-full">
        <div className="w-full px-4">
          <div className="flex items-center justify-between h-16 w-full">
            <div className="flex items-center overflow-hidden whitespace-nowrap relative">
              <nav 
                ref={navRef}
                className="flex space-x-1 relative"
              >
            <div 
  ref={sliderRef}
  className="absolute bg-[color-mix(in_srgb,var(--theme-accent)_30%,var(--theme-background)_70%)] rounded-md h-8 top-1/2 -translate-y-1/2 origin-left"
  style={{
    pointerEvents: 'none',
    willChange: 'transform',
    transition: 'all 250ms ease', // Set default transition here
    left: 0 // Initial position
  }}
/>
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    ref={(el) => handleTabRef(el, item.path)}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors relative z-10 ${
                      pathname.startsWith(item.path)
                        ? 'text-[var(--theme-accent)] font-medium' 
                        : 'text-[var(--theme-text)] hover:bg-[color-mix(in_srgb,var(--theme-accent)_10%,var(--theme-background)_90%)]  hover:bg-[color-mix(in_srgb,var(--theme-accent)_10%,var(--theme-background)_90%)]  hover:text-[var(--theme-text)]'
                    }`}
                    onMouseEnter={() => setActiveTab(item.path)}
                    onMouseLeave={() => setActiveTab(navItems.find(i => pathname.startsWith(i.path))?.path || null)}
                    onClick={(e) => showTour && handleNavClick(item.path, e)}
                  >
                    <item.icon className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
            
            <div className="flex items-center">
              {!hasCompletedTour && (
                <button
                  onClick={() => setShowTour(!showTour)}
                  className="p-2 text-[var(--theme-text)] hover:text-[var(--theme-accent)] transition-colors"
                  aria-label="Show navigation tour"
                >
                  <HelpCircle size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {showTour && (
        <div
          ref={tourTooltipRef}
          className="fixed z-50 bg-[var(--theme-background)] p-6 rounded-lg shadow-xl w-80"
          style={{
            transition: 'all 0.3s ease',
            pointerEvents: 'auto',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold">
              {navItems[currentTourStep].label}
            </h3>
            <button 
              onClick={handleCompleteTour}
              className="text-[var(--theme-text)] hover:text-[var(--theme-text)]"
            >
              <X size={20} />
            </button>
          </div>
          
          <p className="mb-6 text-gray-600">
            {getTourDescription(navItems[currentTourStep].path)}
          </p>
          
          <div className="flex justify-between items-center">
            <div>
              {currentTourStep > 0 && (
                <button
                  onClick={handlePrevTourStep}
                  className="flex items-center text-[var(--theme-accent)] hover:text-[var(--theme-accent)] mr-4"
                >
                  <ArrowLeft size={16} className="mr-1" />
                  Previous
                </button>
              )}
            </div>
            
            <button
              onClick={handleNextTourStep}
              className="flex items-center bg-[var(--theme-accent)] text-[var(--theme-primary)] px-4 py-2 rounded-md hover:bg-[color-mix(in_srgb,var(--theme-accent)_80%,var(--theme-background)_20%)] transition-colors"
            >
              {currentTourStep === navItems.length - 1 ? 'Finish' : 'Next'}
              {currentTourStep < navItems.length - 1 && (
                <ArrowRight size={16} className="ml-1" />
              )}
            </button>
          </div>
          
          <div className="mt-4 text-center text-sm text-[var(--theme-text)]">
            Step {currentTourStep + 1} of {navItems.length}
          </div>
        </div>
      )}

      {/* Chrome-style Theme Picker at Sidebar Bottom (only on Dashboard) */}
      {activeTab === '/dashboard' && (
        <div className="w-full px-4 pb-4 mt-6 flex flex-col items-center">
          <ThemePicker />
        </div>
      )}

      <style jsx global>{`
        .tour-highlight {
          position: relative;
          z-index: 60;
          transform: scale(1.05);
          background-color: rgba(59, 130, 246, 0.2) !important;
          transition: transform 0.2s ease, background-color 0.2s ease;
        }
        
        body.tour-active nav a:not(.tour-highlight) {
          opacity: 0.7;
          filter: grayscale(30%);
        }

        body {
          overflow-x: hidden;
        }
      `}</style>
    </AuthGuard>
  )
}

// ThemePicker component for sidebar
const ThemePicker = () => {
  const [selectedTheme, setSelectedTheme] = React.useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('flexcraftTheme');
      if (stored) {
        const found = themes.find(t => t.name === stored);
        if (found) return found;
      }
    }
    return defaultTheme;
  });

  React.useEffect(() => {
    const root = document.documentElement;
    Object.entries(selectedTheme).forEach(([key, value]) => {
      if (key !== 'name') root.style.setProperty(`--theme-${key}`, value);
    });
    localStorage.setItem('flexcraftTheme', selectedTheme.name);
  }, [selectedTheme]);

  const handleThemeChange = (themeName: string) => {
    const theme = themes.find(t => t.name === themeName);
    if (theme) setSelectedTheme(theme);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <label className="mb-1 text-xs font-medium text-[var(--theme-text)]">Theme</label>
      <div className="relative w-full">
        <select
          className="w-full border border-[var(--theme-primary)] rounded px-3 py-1 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedTheme.name}
          onChange={e => handleThemeChange(e.target.value)}
        >
          {themes.map(theme => (
            <option key={theme.name} value={theme.name}>{theme.name}</option>
          ))}
        </select>
        <div className="absolute right-2 top-2 flex items-center pointer-events-none">
          {/* Chrome-style color dot for selected theme */}
          <span
            className="inline-block w-4 h-4 rounded-full border border-[var(--theme-background)]"
            style={{ background: selectedTheme.primary }}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-2 justify-center">
        {themes.map(theme => (
          <button
            key={theme.name}
            className={`w-6 h-6 rounded-full border-2 transition-all duration-150 ${selectedTheme.name === theme.name ? 'border-[var(--theme-accent)] scale-110' : 'border-[var(--theme-primary)]'}`}
            style={{ background: theme.primary }}
            title={theme.name}
            onClick={() => handleThemeChange(theme.name)}
            aria-label={`Switch to ${theme.name} theme`}
          />
        ))}
      </div>
    </div>
  );
};

export default Header