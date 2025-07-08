import { FileText, Video, BookOpen, HelpCircle, Code, Calendar, Download, ChevronRight } from 'lucide-react';

const ResourcesPage = () => {
  const resourceTypes = [
    {
      icon: <FileText className="h-8 w-8 text-blue-500" />,
      title: "Documentation",
      description: "Detailed guides and API references",
      link: "#",
      linkText: "View Docs"
    },
    {
      icon: <Video className="h-8 w-8 text-purple-500" />,
      title: "Video Tutorials",
      description: "Step-by-step video walkthroughs",
      link: "#",
      linkText: "Watch Videos"
    },
    {
      icon: <BookOpen className="h-8 w-8 text-green-500" />,
      title: "Blog",
      description: "Articles and best practices",
      link: "#",
      linkText: "Read Blog"
    },
    {
      icon: <HelpCircle className="h-8 w-8 text-orange-500" />,
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
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900">Resources</h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to get the most out of our platform
          </p>
        </div>
      </div>

      {/* Resource Types */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {resourceTypes.map((resource, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="mb-4">
                  {resource.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{resource.title}</h3>
                <p className="text-gray-600 mb-4">{resource.description}</p>
                <a href={resource.link} className="text-blue-600 font-medium inline-flex items-center hover:text-blue-800">
                  {resource.linkText}
                  <ChevronRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Guides Section */}
      <div className="py-16 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Guides & Downloads</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive resources to help you succeed
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {guides.map((guide, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-start">
                  <div className="bg-blue-50 p-3 rounded-lg mr-4">
                    <Download className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{guide.title}</h3>
                    <p className="text-gray-600 mt-1">{guide.description}</p>
                    <div className="mt-4 flex items-center text-sm text-gray-500">
                      <span>{guide.type}</span>
                      <span className="mx-2">•</span>
                      <span>{guide.size}</span>
                    </div>
                    <a href={guide.link} className="mt-4 text-blue-600 font-medium inline-flex items-center hover:text-blue-800">
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
            <h2 className="text-3xl font-bold text-gray-900">Upcoming Webinars</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Join our live sessions and learn from the experts
            </p>
          </div>
          
          <div className="space-y-6">
            {webinars.map((webinar, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-lg font-semibold text-gray-900">{webinar.title}</h3>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{webinar.date}</span>
                      <span className="mx-2">•</span>
                      <span>{webinar.duration}</span>
                    </div>
                  </div>
                  <a href={webinar.link} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-flex items-center justify-center">
                    Register Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Developer Resources */}
      <div className="py-16 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Developer Resources</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Tools and references for building with our API
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-start mb-4">
                <div className="bg-purple-100 p-2 rounded-md mr-4">
                  <Code className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">API Reference</h3>
                  <p className="text-gray-600 mt-1">Complete documentation for all API endpoints</p>
                </div>
              </div>
              <a href="#" className="text-blue-600 font-medium inline-flex items-center hover:text-blue-800">
                Explore API Docs
                <ChevronRight className="ml-1 h-4 w-4" />
              </a>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-start mb-4">
                <div className="bg-green-100 p-2 rounded-md mr-4">
                  <Code className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">SDK Libraries</h3>
                  <p className="text-gray-600 mt-1">Official client libraries for popular languages</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">JavaScript</a>
                <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">Python</a>
                <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">Java</a>
                <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">Ruby</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-blue-600 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white">Can't find what you're looking for?</h2>
          <p className="mt-4 text-xl text-blue-100 max-w-3xl mx-auto">
            Our support team is ready to help you with any questions.
          </p>
          <div className="mt-8">
            <a href="#" className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-medium rounded-md hover:bg-blue-50">
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