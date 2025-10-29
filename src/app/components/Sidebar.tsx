"use client"
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
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
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Memoize theme to prevent unnecessary re-renders
  const [selectedTheme, setSelectedTheme] = React.useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('flexcraftTheme')
      return themes.find(t => t.name === stored) || defaultTheme
    }
    return defaultTheme
  })

  // Apply theme once on mount and when changed
  React.useEffect(() => {
    const root = document.documentElement
    Object.entries(selectedTheme).forEach(([key, value]) => {
      if (key !== 'name') root.style.setProperty(`--theme-${key}`, value)
    })
    localStorage.setItem('flexcraftTheme', selectedTheme.name)
  }, [selectedTheme])

  // Optimized slider update with debouncing
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

      const slider = sliderRef.current
      if (!slider) return

      if (immediate) {
        slider.style.transition = 'none'
        slider.style.transform = `translateX(${left}px)`
        slider.style.width = `${width}px`
      } else {
        slider.style.transition = 'transform 200ms ease, width 200ms ease'
        slider.style.transform = `translateX(${left}px)`
        slider.style.width = `${width}px`
      }
    })
  }, [pathname, activeTab])

  // Initialize and handle resize events
  useEffect(() => {
    const initialTab = navItems.find(item => pathname.startsWith(item.path))
    if (initialTab) {
      setActiveTab(initialTab.path)
      setCurrentTourStep(Math.max(0, navItems.findIndex(item => item.path === initialTab.path)))
    }

    const tourCompleted = localStorage.getItem('navTourCompleted')
    if (tourCompleted !== 'true') {
      const timer = setTimeout(() => setShowTour(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [pathname])

  // Setup resize observer with debouncing
  useEffect(() => {
    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current)
      }
      resizeTimeoutRef.current = setTimeout(() => {
        updateSlider()
      }, 100)
    }

    resizeObserverRef.current = new ResizeObserver(handleResize)

    if (navRef.current) {
      resizeObserverRef.current.observe(navRef.current)
    }

    return () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current)
      }
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [updateSlider])

  // Memoized tab ref handler
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

  // Tour navigation handlers
  const handleNextTourStep = useCallback(() => {
    if (currentTourStep < navItems.length - 1) {
      const nextStep = currentTourStep + 1
      setCurrentTourStep(nextStep)
      router.push(navItems[nextStep].path)
    } else {
      handleCompleteTour()
    }
  }, [currentTourStep, router])

  const handlePrevTourStep = useCallback(() => {
    if (currentTourStep > 0) {
      const prevStep = currentTourStep - 1
      setCurrentTourStep(prevStep)
      router.push(navItems[prevStep].path)
    }
  }, [currentTourStep, router])

  const handleCompleteTour = useCallback(() => {
    setShowTour(false)
    setHasCompletedTour(true)
    localStorage.setItem('navTourCompleted', 'true')
  }, [])

  // Position tour tooltip with memoized description
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

  const getTourDescription = useCallback((path: string): string => {
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
  }, [])

  const handleNavClick = useCallback((path: string, e: React.MouseEvent) => {
    if (!showTour) return
    
    const clickedIndex = navItems.findIndex(item => item.path === path)
    if (clickedIndex >= 0) {
      setCurrentTourStep(clickedIndex)
    }
  }, [showTour])

  // Memoize nav items to prevent unnecessary re-renders
  const memoizedNavItems = useMemo(() => navItems, [])

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
                    transition: 'transform 200ms ease, width 200ms ease',
                    left: 0
                  }}
                />
                {memoizedNavItems.map((item) => (
                  <NavItem
                    key={item.path}
                    item={item}
                    pathname={pathname}
                    showTour={showTour}
                    handleTabRef={handleTabRef}
                    handleNavClick={handleNavClick}
                    updateActiveTab={(path) => setActiveTab(path)}
                  />
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
        <TourTooltip
          ref={tourTooltipRef}
          currentTourStep={currentTourStep}
          navItems={memoizedNavItems}
          getTourDescription={getTourDescription}
          handleCompleteTour={handleCompleteTour}
          handlePrevTourStep={handlePrevTourStep}
          handleNextTourStep={handleNextTourStep}
        />
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

// Memoized NavItem component to prevent unnecessary re-renders
const NavItem = React.memo(({
  item,
  pathname,
  showTour,
  handleTabRef,
  handleNavClick,
  updateActiveTab
}: {
  item: typeof navItems[0]
  pathname: string
  showTour: boolean
  handleTabRef: (el: HTMLAnchorElement | null, path: string) => void
  handleNavClick: (path: string, e: React.MouseEvent) => void
  updateActiveTab: (path: string) => void
}) => {
  return (
    <Link
      href={item.path}
      ref={(el) => handleTabRef(el, item.path)}
      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors relative z-10 ${
        pathname.startsWith(item.path)
          ? 'text-[var(--theme-accent)] font-medium' 
          : 'text-[var(--theme-text)] hover:bg-[color-mix(in_srgb,var(--theme-accent)_10%,var(--theme-background)_90%)] hover:text-[var(--theme-text)]'
      }`}
      onMouseEnter={() => updateActiveTab(item.path)}
      onMouseLeave={() => updateActiveTab(navItems.find(i => pathname.startsWith(i.path))?.path || '')}
      onClick={(e) => {
        if (showTour) {
          e.preventDefault()
          handleNavClick(item.path, e)
        }
      }}
    >
      <item.icon className="w-4 h-4 mr-2 flex-shrink-0" />
      <span className="truncate">{item.label}</span>
    </Link>
  )
})
NavItem.displayName = 'NavItem'

// Memoized TourTooltip component
const TourTooltip = React.memo(React.forwardRef<HTMLDivElement, {
  currentTourStep: number
  navItems: typeof navItems
  getTourDescription: (path: string) => string
  handleCompleteTour: () => void
  handlePrevTourStep: () => void
  handleNextTourStep: () => void
}>(({
  currentTourStep,
  navItems,
  getTourDescription,
  handleCompleteTour,
  handlePrevTourStep,
  handleNextTourStep
}, ref) => {
  return (
    <div
      ref={ref}
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
  )
}))
TourTooltip.displayName = 'TourTooltip'

export default Header