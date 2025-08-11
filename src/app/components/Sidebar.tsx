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
  { path: '/chat', icon: MessageSquare, label: 'Chat' },
  { path: '/email', icon: MailCheck, label: 'Emails' },
  { path: '/apiworkspace', icon: Terminal, label: 'API Testing' },
  { path: '/github', icon: Github, label: 'GitHub' },
  { path: '/aiagent', icon: Bot, label: 'AI-Agent' },
  { path: '/deployment', icon: UploadCloud, label: 'Deployment' },
  { path: '/integrationsapp', icon: Blocks, label: 'Integrations' },
  { path: '/automation', icon: Workflow, label: 'workflow-automation' },
  { path: '/flowcharts', icon: PenLine, label: 'Architect' },
]

const Header = () => {
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

  const pathname = usePathname()
  const router = useRouter()
  const [showTour, setShowTour] = useState(false)
  const [hasCompletedTour, setHasCompletedTour] = useState(false)
  const [currentTourStep, setCurrentTourStep] = useState(0)
  
  const itemsRef = useRef<Map<string, HTMLAnchorElement>>(new Map())
  const tourTooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const initialTab = navItems.find(item => pathname.startsWith(item.path))
    if (initialTab) {
      const initialStep = navItems.findIndex(item => item.path === initialTab.path)
      setCurrentTourStep(initialStep >= 0 ? initialStep : 0)
    }

    const tourCompleted = localStorage.getItem('navTourCompleted')
    if (tourCompleted !== 'true') {
      setTimeout(() => setShowTour(true), 1500)
    }
  }, [pathname])

  const handleTabRef = useCallback((el: HTMLAnchorElement | null, path: string) => {
    if (el) {
      itemsRef.current.set(path, el)
    } else {
      itemsRef.current.delete(path)
    }
  }, [])

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
    if (!element) return

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
              <nav className="flex space-x-1 relative">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    ref={(el) => handleTabRef(el, item.path)}
                    className={`flex items-center px-3 py-2 text-sm font-medium transition-colors relative ${
                      pathname.startsWith(item.path)
                        ? 'text-[var(--theme-accent)] font-medium border-b-2 border-[var(--theme-accent)]' 
                        : 'text-[var(--theme-text)] hover:text-[var(--theme-accent)]'
                    }`}
                    onClick={(e) => {
                      if (showTour) {
                        e.preventDefault();
                        handleNavClick(item.path, e);
                      }
                    }}
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

const ThemePicker = () => {
  const [selectedTheme, setSelectedTheme] = React.useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('flexcraftTheme')
      if (stored) {
        const found = themes.find(t => t.name === stored)
        if (found) return found
      }
    }
    return defaultTheme
  })

  React.useEffect(() => {
    const root = document.documentElement
    Object.entries(selectedTheme).forEach(([key, value]) => {
      if (key !== 'name') root.style.setProperty(`--theme-${key}`, value)
    })
    localStorage.setItem('flexcraftTheme', selectedTheme.name)
  }, [selectedTheme])

  const handleThemeChange = (themeName: string) => {
    const theme = themes.find(t => t.name === themeName)
    if (theme) setSelectedTheme(theme)
  }

  return (
    <div className="w-full flex flex-col items-center var(--theme-background)" >
      <div className="relative w-full var(--theme-background)">
        <div className="absolute right-2 top-2 flex items-center pointer-events-none bg-gray-200 p-1 rounded-lg" >
          <label className="font-bold  text-sm font-sm font-sm pr-2 " style={{color: selectedTheme.primary}}>Selected theme </label>
          <span
            className="inline-block w-8 h-8 rounded-full border shadow-md"
            style={{ background: selectedTheme.primary }}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-2 justify-center">
        {themes.map(theme => (
          <button
            key={theme.name}
            className={`shadow-lg w-6 h-6 rounded-full border-2 transition-all duration-150 ${selectedTheme.name === theme.name ? 'border-[var(--theme-accent)] scale-110' : 'border-[var(--theme-primary)]'}`}
            style={{ background: theme.primary }}
            title={theme.name}
            onClick={() => handleThemeChange(theme.name)}
            aria-label={`Switch to ${theme.name} theme`}
          />
        ))}
      </div>
    </div>
  )
}

export default Header