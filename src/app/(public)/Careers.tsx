"use client"
import { Briefcase, MapPin, DollarSign, Clock, ChevronRight, Users, Code, Server, PieChart, Headphones, PenTool, Check, Search, BookOpen } from 'lucide-react';
import { useState } from 'react';
// import Demo from '../Assets/videos/demo.mp4'

const CareersPage = () => {
  const departments = [
    {
      id: 'engineering',
      name: 'Engineering',
      icon: <Code className="h-5 w-5" />,
      color: 'text-[var(--theme-accent)]'
    },
    {
      id: 'product',
      name: 'Product',
      icon: <Server className="h-5 w-5" />,
      color: 'text-[var(--theme-primary)]'
    },
    {
      id: 'design',
      name: 'Design',
      icon: <PenTool className="h-5 w-5" />,
      color: 'text-[var(--theme-accent)]'
    },
    {
      id: 'marketing',
      name: 'Marketing',
      icon: <PieChart className="h-5 w-5" />,
      color: 'text-[color-mix(in_srgb,var(--theme-accent)_70%,var(--theme-primary)_30%)]'
    },
    {
      id: 'customer-success',
      name: 'Customer Success',
      icon: <Headphones className="h-5 w-5" />,
      color: 'text-[var(--theme-accent)]'
    },
    {
      id: 'people-ops',
      name: 'People Operations',
      icon: <Users className="h-5 w-5" />,
      color: 'text-[var(--theme-primary)]'
    }
  ];

  const jobOpenings = [
    {
      id: 'senior-frontend-engineer',
      title: 'Senior Frontend Engineer',
      department: 'engineering',
      type: 'Full-time',
      location: 'Remote',
      salary: '$120,000 - $150,000',
      posted: '2 days ago'
    },
    {
      id: 'product-manager',
      title: 'Product Manager',
      department: 'product',
      type: 'Full-time',
      location: 'San Francisco, CA',
      salary: '$130,000 - $160,000',
      posted: '1 week ago'
    },
    {
      id: 'ux-designer',
      title: 'UX Designer',
      department: 'design',
      type: 'Full-time',
      location: 'Remote',
      salary: '$90,000 - $120,000',
      posted: '3 days ago'
    },
    {
      id: 'growth-marketer',
      title: 'Growth Marketer',
      department: 'marketing',
      type: 'Full-time',
      location: 'New York, NY',
      salary: '$100,000 - $130,000',
      posted: '5 days ago'
    },
    {
      id: 'customer-support-specialist',
      title: 'Customer Support Specialist',
      department: 'customer-success',
      type: 'Full-time',
      location: 'Remote',
      salary: '$60,000 - $80,000',
      posted: '1 day ago'
    },
    {
      id: 'hr-business-partner',
      title: 'HR Business Partner',
      department: 'people-ops',
      type: 'Full-time',
      location: 'Austin, TX',
      salary: '$85,000 - $110,000',
      posted: '2 weeks ago'
    }
  ];

  const benefits = [
    {
      title: 'Competitive Compensation',
      description: 'We offer competitive salaries and equity packages',
      icon: <DollarSign className="h-6 w-6 text-[var(--theme-accent)]" />
    },
    {
      title: 'Flexible Work',
      description: 'Remote-friendly with flexible hours',
      icon: <Clock className="h-6 w-6 text-[color-mix(in_srgb,var(--theme-accent)_70%,var(--theme-primary)_30%)]" />
    },
    {
      title: 'Health & Wellness',
      description: 'Comprehensive medical, dental, and vision insurance',
      icon: <Users className="h-6 w-6 text-[var(--theme-primary)]" />
    },
    {
      title: 'Learning Budget',
      description: 'Annual stipend for professional development',
      icon: <BookOpen className="h-6 w-6 text-[var(--theme-accent)]" />
    }
  ];

  const [activeDepartment, setActiveDepartment] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredJobs = jobOpenings.filter(job => {
    const matchesDepartment = activeDepartment ? job.department === activeDepartment : true;
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         job.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDepartment && matchesSearch;
  });

  return (
    <div className="bg-[var(--theme-background)]">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[var(--theme-accent)] to-[var(--theme-primary)] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-[var(--theme-primary)]">Join Our Team</h1>
          <p className="mt-4 text-xl text-[color-mix(in_srgb,var(--theme-accent)_30%,var(--theme-background)_70%)] max-w-3xl mx-auto">
            Help us build the future of technology. Explore opportunities to grow your career.
          </p>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-[var(--theme-background)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--theme-text)]">Why Work With Us</h2>
            <p className="mt-4 text-xl text-[var(--theme-text)] max-w-3xl mx-auto">
              We take care of our team with benefits that matter
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-[var(--theme-background)] p-6 rounded-lg shadow-sm border border-[var(--theme-primary)] text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-[color-mix(in_srgb,var(--theme-accent)_10%,var(--theme-background)_90%)] flex items-center justify-center mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-medium text-[var(--theme-text)] mb-2">{benefit.title}</h3>
                <p className="text-[var(--theme-text)]">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="sm:flex sm:items-center sm:justify-between mb-8">
            <h2 className="text-3xl font-bold text-[var(--theme-text)]">Open Positions</h2>
            <div className="mt-4 sm:mt-0">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-[var(--theme-text)]" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-[var(--theme-background)] rounded-md leading-5 bg-[var(--theme-background)] placeholder-[var(--theme-text)] focus:outline-none focus:ring-[var(--theme-accent)] focus:border-[var(--theme-accent)] sm:text-sm"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Department Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveDepartment(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${!activeDepartment ? 'bg-[var(--theme-accent)] text-[var(--theme-primary)]' : 'bg-gray-100 text-gray-700 hover:bg-[color-mix(in_srgb,var(--theme-accent)_30%,var(--theme-background)_70%)]'}`}
            >
              All Departments
            </button>
            {departments.map((dept) => (
              <button
                key={dept.id}
                onClick={() => setActiveDepartment(dept.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${activeDepartment === dept.id ? 'bg-[var(--theme-accent)] text-[var(--theme-primary)]' : 'bg-gray-100 text-gray-700 hover:bg-[color-mix(in_srgb,var(--theme-accent)_30%,var(--theme-background)_70%)]'}`}
              >
                <span className={`mr-2 ${dept.color}`}>{dept.icon}</span>
                {dept.name}
              </button>
            ))}
          </div>

          {/* Jobs List */}
          <div className="bg-[var(--theme-background)] shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => {
                  const dept = departments.find(d => d.id === job.department);
                  return (
                    <li key={job.id}>
                      <a href={`/careers/${job.id}`} className="block hover:bg-gray-50">
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className={`flex-shrink-0 ${dept?.color}`}>
                                {dept?.icon}
                              </div>
                              <p className="ml-3 text-lg font-medium text-[var(--theme-accent)] truncate">
                                {job.title}
                              </p>
                            </div>
                            <div className="ml-2 flex-shrink-0 flex">
                              <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-[color-mix(in_srgb,var(--theme-accent)_10%,var(--theme-background)_90%)] text-green-800">
                                {job.type}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-[var(--theme-text)]">
                                <Briefcase className="flex-shrink-0 mr-1.5 h-4 w-4 text-[var(--theme-text)]" />
                                {dept?.name}
                              </p>
                              <p className="mt-2 flex items-center text-sm text-[var(--theme-text)] sm:mt-0 sm:ml-6">
                                <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-[var(--theme-text)]" />
                                {job.location}
                              </p>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-[var(--theme-text)] sm:mt-0">
                              <DollarSign className="flex-shrink-0 mr-1.5 h-4 w-4 text-[var(--theme-text)]" />
                              {job.salary}
                              <span className="ml-4 flex items-center text-sm text-[var(--theme-text)]">
                                <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-[var(--theme-text)]" />
                                {job.posted}
                              </span>
                            </div>
                          </div>
                        </div>
                      </a>
                    </li>
                  );
                })
              ) : (
                <li className="px-4 py-12 text-center">
                  <h3 className="text-lg font-medium text-[var(--theme-text)]">No jobs found</h3>
                  <p className="mt-1 text-sm text-[var(--theme-text)]">
                    {searchTerm ? 'Try adjusting your search or filter' : 'There are currently no open positions in this department'}
                  </p>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Culture Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-[var(--theme-background)]">
        <div className="max-w-7xl mx-auto">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div className="mb-8 lg:mb-0">
              <h2 className="text-3xl font-bold text-[var(--theme-text)] mb-4">Our Culture</h2>
              <p className="text-lg text-[var(--theme-text)] mb-4">
                We believe in creating an environment where people can do their best work and grow both professionally and personally.
              </p>
              <ul className="space-y-3 text-[var(--theme-text)]">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-[color-mix(in_srgb,var(--theme-accent)_70%,var(--theme-primary)_30%)] mt-0.5 mr-2 flex-shrink-0" />
                  <span>Mission-driven work that makes an impact</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-[color-mix(in_srgb,var(--theme-accent)_70%,var(--theme-primary)_30%)] mt-0.5 mr-2 flex-shrink-0" />
                  <span>Transparent and collaborative culture</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-[color-mix(in_srgb,var(--theme-accent)_70%,var(--theme-primary)_30%)] mt-0.5 mr-2 flex-shrink-0" />
                  <span>Opportunities for continuous learning</span>
                </li>
              </ul>
            </div>
            <div className="bg-[var(--theme-background)] p-6 rounded-lg shadow-sm border border-[var(--theme-primary)]">
              {/* <video
                src=".."
                autoPlay
                loop
                muted
                playsInline
                className="rounded-lg"
              /> */}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-[var(--theme-accent)]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[var(--theme-primary)]">Don't see the perfect role?</h2>
          <p className="mt-4 text-xl text-[color-mix(in_srgb,var(--theme-accent)_30%,var(--theme-background)_70%)] max-w-3xl mx-auto">
            We're always looking for talented people. Send us your resume and we'll contact you when we have an opening that matches your skills.
          </p>
          <div className="mt-8">
            <a
              href="#"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-[var(--theme-primary)] bg-[var(--theme-background)] hover:bg-[color-mix(in_srgb,var(--theme-accent)_10%,var(--theme-background)_90%)]"
            >
              Submit Your Resume
              <ChevronRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareersPage;