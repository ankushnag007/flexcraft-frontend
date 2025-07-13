import { FileText, Video, BookOpen, HelpCircle, Code, Calendar, Download, ChevronRight } from 'lucide-react';

const ResourcesPage = () => {
  const resourceTypes = [
    {
      icon: <FileText className="h-8 w-8 text-[var(--theme-accent)]" />,
      title: "Documentation",
      description: "Detailed guides and API references",
      link: "#",
      linkText: "View Docs"
    },
    {
      icon: <Video className="h-8 w-8 text-[var(--theme-accent)]" />,
      title: "Video Tutorials",
      description: "Step-by-step video walkthroughs",
      link: "#",
      linkText: "Watch Videos"
    },
    {
      icon: <BookOpen className="h-8 w-8 text-[var(--theme-accent)]" />,
      title: "Blog",
      description: "Articles and best practices",
      link: "#",
      linkText: "Read Blog"
    },
    {
      icon: <HelpCircle className="h-8 w-8 text-[var(--theme-accent)]" />,
      title: "Help Center",
      description: "Answers to common questions",
      link: "#",
      linkText: "Get Help"
    }
  ];

  const guides = [
    {
      title: "Getting Started Guide",
      description: "Everything you need to implement our solution",
      type: "PDF",
      size: "2.4 MB",
      link: "#"
    },
    {
      title: "API Integration Handbook",
      description: "Complete reference for developers",
      type: "PDF",
      size: "3.1 MB",
      link: "#"
    },
    {
      title: "Case Studies",
      description: "See how customers succeed with our platform",
      type: "PDF",
      size: "1.8 MB",
      link: "#"
    }
  ];

  const webinars = [
    {
      title: "Advanced Feature Walkthrough",
      date: "June 15, 2023",
      duration: "45 min",
      link: "#"
    },
    {
      title: "Q3 Product Roadmap Reveal",
      date: "July 5, 2023",
      duration: "60 min",
      link: "#"
    },
    {
      title: "Best Practices Webinar",
      date: "August 2, 2023",
      duration: "30 min",
      link: "#"
    }
  ];

  return (
    <div className="bg-[var(--theme-background)]">
      {/* Hero Section */}
      <div className="bg-[var(--theme-gradient)] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-[var(--theme-text)]">Resources</h1>
          <p className="mt-4 text-xl text-[var(--theme-text)] max-w-3xl mx-auto">
            Everything you need to get the most out of our platform
          </p>
        </div>
      </div>

      {/* Resource Types */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {resourceTypes.map((resource, index) => (
              <div key={index} className="bg-[var(--theme-background)] p-6 rounded-xl shadow-sm border border-[var(--theme-primary)] hover:shadow-md transition-shadow">
                <div className="mb-4">
                  {resource.icon}
                </div>
                <h3 className="text-xl font-semibold text-[var(--theme-text)] mb-2">{resource.title}</h3>
                <p className="text-[var(--theme-text)] mb-4">{resource.description}</p>
                <a href={resource.link} className="text-[var(--theme-accent)] font-medium inline-flex items-center hover:text-[var(--theme-accent-hover)]">
                  {resource.linkText}
                  <ChevronRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Guides Section */}
      <div className="py-16 bg-[var(--theme-background-alt)] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--theme-text)]">Guides & Downloads</h2>
            <p className="mt-4 text-xl text-[var(--theme-text)] max-w-3xl mx-auto">
              Comprehensive resources to help you succeed
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {guides.map((guide, index) => (
              <div key={index} className="bg-[var(--theme-background)] p-6 rounded-lg shadow-sm border border-[var(--theme-primary)]">
                <div className="flex items-start">
                  <div className="bg-[var(--theme-accent)] p-3 rounded-lg mr-4">
                    <Download className="h-6 w-6 text-[var(--theme-accent-text)]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--theme-text)]">{guide.title}</h3>
                    <p className="text-[var(--theme-text)] mt-1">{guide.description}</p>
                    <div className="mt-4 flex items-center text-sm text-[var(--theme-text)]">
                      <span>{guide.type}</span>
                      <span className="mx-2">•</span>
                      <span>{guide.size}</span>
                    </div>
                    <a href={guide.link} className="mt-4 text-[var(--theme-accent)] font-medium inline-flex items-center hover:text-[var(--theme-accent-hover)]">
                      Download
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Webinars Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--theme-text)]">Upcoming Webinars</h2>
            <p className="mt-4 text-xl text-[var(--theme-text)] max-w-3xl mx-auto">
              Join our live sessions and learn from the experts
            </p>
          </div>
          
          <div className="space-y-6">
            {webinars.map((webinar, index) => (
              <div key={index} className="bg-[var(--theme-background)] p-6 rounded-lg shadow-sm border border-[var(--theme-primary)] hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-lg font-semibold text-[var(--theme-text)]">{webinar.title}</h3>
                    <div className="mt-2 flex items-center text-sm text-[var(--theme-text)]">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{webinar.date}</span>
                      <span className="mx-2">•</span>
                      <span>{webinar.duration}</span>
                    </div>
                  </div>
                  <a href={webinar.link} className="px-4 py-2 bg-[var(--theme-accent)] text-[var(--theme-primary)] rounded-md hover:bg-[var(--theme-accent-hover)] inline-flex items-center justify-center">
                    Register Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Developer Resources */}
      <div className="py-16 bg-[var(--theme-background-alt)] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--theme-text)]">Developer Resources</h2>
            <p className="mt-4 text-xl text-[var(--theme-text)] max-w-3xl mx-auto">
              Tools and references for building with our API
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[var(--theme-background)] p-6 rounded-lg shadow-sm border border-[var(--theme-primary)]">
              <div className="flex items-start mb-4">
                <div className="bg-[var(--theme-accent)] p-2 rounded-md mr-4">
                  <Code className="h-6 w-6 text-[var(--theme-accent-text)]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--theme-text)]">API Reference</h3>
                  <p className="text-[var(--theme-text)] mt-1">Complete documentation for all API endpoints</p>
                </div>
              </div>
              <a href="#" className="text-[var(--theme-accent)] font-medium inline-flex items-center hover:text-[var(--theme-accent-hover)]">
                Explore API Docs
                <ChevronRight className="ml-1 h-4 w-4" />
              </a>
            </div>
            
            <div className="bg-[var(--theme-background)] p-6 rounded-lg shadow-sm border border-[var(--theme-primary)]">
              <div className="flex items-start mb-4">
                <div className="bg-[var(--theme-accent)] p-2 rounded-md mr-4">
                  <Code className="h-6 w-6 text-[var(--theme-accent-text)]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--theme-text)]">SDK Libraries</h3>
                  <p className="text-[var(--theme-text)] mt-1">Official client libraries for popular languages</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <a href="#" className="text-[var(--theme-accent)] hover:text-[var(--theme-accent-hover)] text-sm">JavaScript</a>
                <a href="#" className="text-[var(--theme-accent)] hover:text-[var(--theme-accent-hover)] text-sm">Python</a>
                <a href="#" className="text-[var(--theme-accent)] hover:text-[var(--theme-accent-hover)] text-sm">Java</a>
                <a href="#" className="text-[var(--theme-accent)] hover:text-[var(--theme-accent-hover)] text-sm">Ruby</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-[var(--theme-accent)] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[var(--theme-primary)]">Can't find what you're looking for?</h2>
          <p className="mt-4 text-xl text-[var(--theme-primary)] max-w-3xl mx-auto">
            Our support team is ready to help you with any questions.
          </p>
          <div className="mt-8">
            <a href="#" className="inline-flex items-center px-6 py-3 bg-[var(--theme-background)] text-[var(--theme-accent)] font-medium rounded-md hover:bg-[var(--theme-background-alt)]">
              Contact Support
              <ChevronRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;