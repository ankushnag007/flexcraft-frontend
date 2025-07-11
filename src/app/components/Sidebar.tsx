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
      cancelAnimationFrame(animationFrameRef.current)
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      const currentPath = navItems.find(item => pathname.startsWith(item.path))?.path || activeTab
      if (!currentPath) return

      const tabElement = itemsRef.current.get(currentPath)
      if (!tabElement || !navRef.current || !sliderRef.current) return

      const navRect = navRef.current.getBoundingClientRect()
      const tabRect = tabElement.getBoundingClientRect()
      
      const left = tabRect.left - navRect.left
      const width = tabRect.width

      sliderRef.current.style.transform = `translateX(${left}px) scaleX(${width / 100})`
      sliderRef.current.style.width = '100px'
      sliderRef.current.style.transition = immediate ? 'none' : 
        'transform 250ms cubic-bezier(0.4, 0, 0.2, 1)'
    })
  }, [pathname, activeTab])

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

    updateSlider(true)
    resizeObserverRef.current = new ResizeObserver(() => updateSlider())

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
      <header className="bg-white shadow-sm sticky top-0 z-10 w-full">
        <div className="w-full px-4">
          <div className="flex items-center justify-between h-16 w-full">
            <div className="flex items-center overflow-hidden whitespace-nowrap relative">
              <nav 
                ref={navRef}
                className="flex space-x-1 relative"
              >
                <div 
                  ref={sliderRef}
                  className="absolute bg-blue-100 rounded-md h-8 top-1/2 -translate-y-1/2 origin-left"
                  style={{
                    pointerEvents: 'none',
                    willChange: 'transform',
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
                  className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
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
          className="fixed z-50 bg-white p-6 rounded-lg shadow-xl w-80"
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
              className="text-gray-500 hover:text-gray-700"
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
                  className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
                >
                  <ArrowLeft size={16} className="mr-1" />
                  Previous
                </button>
              )}
            </div>
            
            <button
              onClick={handleNextTourStep}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              {currentTourStep === navItems.length - 1 ? 'Finish' : 'Next'}
              {currentTourStep < navItems.length - 1 && (
                <ArrowRight size={16} className="ml-1" />
              )}
            </button>
          </div>
          
          <div className="mt-4 text-center text-sm text-gray-500">
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

export default Header