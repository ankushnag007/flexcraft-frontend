import { Check, Zap, Shield, Code, Server, Users, Database, Clock } from 'lucide-react';
import Analytics from '../Assets/videos/images/reports.png'
import Team from '../Assets/videos/images/team.png'


const FeaturesPage = () => {
  const features = [
    {
      icon: <Zap className="h-8 w-8 text-blue-500" />,
      title: "Lightning Fast Performance",
      description: "Optimized for speed with instant load times and seamless interactions."
    },
    {
      icon: <Shield className="h-8 w-8 text-green-500" />,
      title: "Enterprise-Grade Security",
      description: "End-to-end encryption and SOC 2 compliant infrastructure."
    },
    {
      icon: <Code className="h-8 w-8 text-purple-500" />,
      title: "Developer Friendly",
      description: "Comprehensive API and easy-to-integrate SDKs for all platforms."
    },
    {
      icon: <Server className="h-8 w-8 text-orange-500" />,
      title: "99.99% Uptime",
      description: "Globally distributed servers ensure maximum reliability."
    },
    {
      icon: <Users className="h-8 w-8 text-pink-500" />,
      title: "Collaboration Tools",
      description: "Real-time collaboration features for distributed teams."
    },
    {
      icon: <Database className="h-8 w-8 text-indigo-500" />,
      title: "Unlimited Storage",
      description: "Scale without limits with our cloud storage solutions."
    }
  ];

  const metrics = [
    { value: "10x", label: "Faster processing" },
    { value: "24/7", label: "Support availability" },
    { value: "99.9%", label: "Uptime guarantee" },
    { value: "1M+", label: "Happy customers" }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Powerful Features Designed for You
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to streamline your workflow and boost productivity.
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center p-6 rounded-xl hover:bg-gray-50 transition-all">
                <div className="p-3 bg-blue-50 rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {metrics.map((metric, index) => (
              <div key={index} className="p-6">
                <p className="text-4xl font-bold text-blue-600">{metric.value}</p>
                <p className="mt-2 text-lg font-medium text-gray-600">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Features */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-3xl font-bold text-gray-900">Everything You Need</h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-600 lg:mx-auto">
              Advanced capabilities that grow with your business needs.
            </p>
          </div>

          <div className="mt-20">
            <div className="space-y-12">
              <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="md:w-1/2">
                  <div className="bg-blue-50 p-8 rounded-xl">
                    <Clock className="h-12 w-12 text-blue-500 mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Real-Time Analytics</h3>
                    <ul className="space-y-3">
                      {[
                        "Live dashboard updates",
                        "Custom reporting",
                        "Automated insights",
                        "Historical comparisons"
                      ].map((item, i) => (
                        <li key={i} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="md:w-1/2">
                  <img 
                    src={Analytics} 
                    alt="Analytics dashboard" 
                    className="rounded-lg shadow-xl border border-gray-200" 
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row-reverse gap-12 items-center">
                <div className="md:w-1/2">
                  <div className="bg-green-50 p-8 rounded-xl">
                    <Users className="h-12 w-12 text-green-500 mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Team Collaboration</h3>
                    <ul className="space-y-3">
                      {[
                        "Role-based permissions",
                        "Real-time commenting",
                        "Version history",
                        "Activity tracking"
                      ].map((item, i) => (
                        <li key={i} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="md:w-1/2">
                  <img 
                    src={Team} 
                    alt="Collaboration features" 
                    className="rounded-lg shadow-xl border border-gray-200" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to get started?</h2>
          <p className="mt-4 text-xl text-blue-100 max-w-3xl mx-auto">
            Join thousands of businesses already using our platform.
          </p>
          <div className="mt-8">
            <button className="px-8 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors">
              Start Free Trial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;