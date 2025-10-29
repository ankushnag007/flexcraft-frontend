"use client"
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings, Menu, X, 
  Loader2, Check, Github, Slack, Figma, Trello, Zap, Rocket, Cloud, Cpu, 
  Server, Code, Database, Shield, BarChart, Users, Bell, GitBranch, Layout, 
  GitPullRequest, Terminal, Package, Monitor, Smartphone, Tablet, LifeBuoy, 
  ArrowBigRight,
  ArrowRight
} from 'lucide-react';
import Image from "next/image"
import { useRouter } from 'next/navigation';
import axios from 'axios';

const FlexcraftHomepage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const router = useRouter();

  // API Configuration
  const API_BASE_URL = 'https://3676b8a5d5d7.ngrok-free.app/api/v1';

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
      });

      // Store token based on remember me selection
      if (rememberMe) {
        localStorage.setItem('authToken', response.data.token);
      } else {
        sessionStorage.setItem('authToken', response.data.token);
      }

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Invalid email or password');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle signup
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSigningUp(true);

    // Validation
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      setIsSigningUp(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      setIsSigningUp(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/init_register`, {
        email,
        password,
        first_name: name,
        last_name: lastName,
        role: "super_admin"
      });

      setSuccess('Account created successfully! Please log in.');
      // Clear form
      setName('');
      setLastName('');
      setEmail('');
      setPassword('');
      // Switch to login modal
      setShowSignupModal(false);
      setShowLoginModal(true);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Signup failed. Please try again.');
      } else {
        setError('Signup failed. Please try again.');
      }
    } finally {
      setIsSigningUp(false);
    }
  };

  const handleClick = () => {
    router.push("/companyregistration");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Animation variants
  const sectionVariants = {
    offscreen: {
      y: 50,
      opacity: 0
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8
      }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
  };

  const fadeInUp = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white overflow-y-hidden">
        <div className="mb-4">
          <div className="rounded-full flex items-center justify-center animate-pulse">
            <Image src="/images/headway-high-resolution-logo-grayscale-transparent.png" width={96} height={96} alt="Flexcraft Logo" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex items-center justify-center">
              <Image src="/images/headway-high-resolution-logo-grayscale-transparent.png" width={120} height={30} alt="Flexcraft Logo" />
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={() => setShowLoginModal(true)}
              className="text-sm font-medium text-gray-500 hover:text-gray-900"
            >
              Log in
            </button>
            <button 
              onClick={() => setShowSignupModal(true)}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Sign up
            </button>
          </div>

          <button 
            onClick={toggleMenu}
            className="md:hidden p-2 text-gray-500 hover:text-gray-900 rounded-md"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white px-4 pb-4">
            <div className="flex flex-col space-y-3">
              <a href="/features" className="text-sm font-medium text-gray-500 hover:text-gray-900 py-2">Features</a>
              <a href="/pricing" className="text-sm font-medium text-gray-500 hover:text-gray-900 py-2">Pricing</a>
              <a href="/resources" className="text-sm font-medium text-gray-500 hover:text-gray-900 py-2">Resources</a>
              <a href="/integrationsPage" className="text-sm font-medium text-gray-500 hover:text-gray-900 py-2">Integrations</a>
              <a href="/careers" className="text-sm font-medium text-gray-500 hover:text-gray-900 py-2">Careers</a>
            </div>
            <div className="flex flex-col space-y-3 mt-4 pt-4 border-t border-gray-200">
              <button 
                onClick={() => {
                  setShowLoginModal(true);
                  setIsMenuOpen(false);
                }}
                className="text-sm font-medium text-gray-500 hover:text-gray-900 py-2 text-left"
              >
                Log in
              </button>
              <button 
                onClick={() => {
                  setShowSignupModal(true);
                  setIsMenuOpen(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 text-center transition-colors"
              >
                Sign up
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <motion.div 
        className="py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            The Complete Project Management Platform
          </motion.h1>
          <motion.p 
            className="mt-6 text-white max-w-3xl mx-auto text-sm"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            All-in-one solution for project management, deployment, API testing, team collaboration, and AI-powered insights.
          </motion.p>
          <motion.div 
            className="mt-10 flex justify-center space-x-4"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <a href="https://calendly.com/flexcraftapp/30min" className="px-8 py-1 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-black hover:text-white md:py-4 md:text-lg md:px-10 transition-colors">
              Get started for free 
            </a>
            <a href="#" className="px-4 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition-colors">
              See all features
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* Demo Video Section */}
      <motion.section 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.section 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="rounded-xl w-full bg-white flex flex-col md:flex-row items-stretch">
            <div className="flex justify-center items-center md:basis-[30%] w-full md:w-auto p-6 relative">
              <h1 className="text-4xl font-extrabold tracking-tight text-blue-600 sm:text-5xl lg:text-6xl relative z-10">Collaborate with teams</h1>
              <Image src="/images/arrow-frame.svg" width={80} height={80} alt="Arrow Frame" className="w-20 h-20 object-contain absolute right-0 bottom-0 z-0" />
            </div>
            <div className="md:basis-[70%] w-full p-4">
              <div style={{ position: 'relative', paddingBottom: '56.25%' }}>
                <iframe
                  loading="lazy"
                  src="https://app.storylane.io/demo/bnxkkkyc0v42?embed=inline"
                  name="sl-embed"
                  allow="fullscreen"
                  allowFullScreen
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none'
                  }}
                ></iframe>
              </div>
            </div>
          </div>
        </motion.section>
      </motion.section>

      {/* Feature Highlights */}
      <motion.section 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.3 }}
      >
        <h2 className="text-3xl font-bold text-white mb-12 text-center">Everything Your Team Needs in One Platform</h2>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature) => (
            <motion.div 
              key={feature.title}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all"
              variants={item}
            >
              <div className="text-blue-600 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-500">
                {feature.description}
              </p>
              <div className="mt-4">
                <a href="#" className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center">
                  Explore features <Zap className="w-4 h-4 ml-1" />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Platform Architecture Section */}
      <motion.section 
        className="bg-white pt-16"
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Robust & Scalable Architecture</h2>
            <p className="text-lg text-gray-500 max-w-3xl mx-auto">
              Built for enterprise-grade performance and reliability
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {architectureFeatures.map((feature, index) => (
              <motion.div 
                key={feature.title}
                className="bg-gray-50 p-6 rounded-lg text-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={index}
              >
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Workflow Section */}
      <motion.section 
        className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16"
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Streamlined Development Workflow</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From idea to production in one seamless workflow
            </p>
          </div>
          
          <div className="relative">
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-blue-200 -mt-px"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {workflowSteps.map((step, index) => (
                <motion.div 
                  key={step.title}
                  className="bg-white p-6 rounded-xl shadow-sm text-center relative z-10"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={index}
                >
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold">{index + 1}</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Unified Platform Section */}
      <motion.section 
        className="bg-gray-50 py-16"
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div className="mb-8 lg:mb-0">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">One Platform, Endless Possibilities</h2>
              <p className="text-lg text-gray-500 mb-6">
                Flexcraft brings together all the tools your team needs to build, deploy, and manage projects without switching between multiple apps.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.li 
                    key={benefit}
                    className="flex items-start"
                    variants={fadeIn}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={index}
                  >
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-1" />
                    <span className="text-gray-700">{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            <div className="relative w-full h-80 bg-gray-100 overflow-hidden rounded-lg shadow-xl">
              <Image src="/images/team.png" layout="fill" objectFit="cover" alt="Team" />
            </div>
          </div>
        </div>
      </motion.section>

      {/* AI Section */}
      <motion.section 
        className="bg-white py-16"
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div className="relative w-full h-80 bg-gray-100 overflow-hidden rounded-lg shadow-xl lg:order-first">
              {/* Placeholder for AI image */}
            </div>
            <div className="mb-8 lg:mb-0">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">AI-Powered Development</h2>
              <p className="text-lg text-gray-500 mb-6">
                Our AI analyzes your code, issues, and team activity to provide actionable insights and automate repetitive tasks.
              </p>
              <ul className="space-y-4">
                {aiBenefits.map((benefit, index) => (
                  <motion.li 
                    key={benefit}
                    className="flex items-start"
                    variants={fadeIn}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={index}
                  >
                    <Check className="h-5 w-5 text-blue-500 mr-2 mt-1" />
                    <span className="text-gray-700">{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        className="py-16 bg-gray-900 text-white"
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div 
                key={stat.value}
                // variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={index}
              >
                <div className="text-4xl font-bold text-blue-400 mb-2">{stat.value}</div>
                <div className="text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Integration Section */}
      <motion.section 
        className="bg-gray-50 py-16"
        // variants={sectionVariants}
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Seamless Integrations</h2>
            <p className="text-lg text-gray-500 max-w-3xl mx-auto">
              Flexcraft works with the tools you already use, connecting your entire workflow.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {integrations.map((integration, index) => (
              <motion.div 
                key={integration.name}
                className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-center hover:shadow-md transition-all"
                variants={fadeIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={index}
              >
                <div className="flex flex-col items-center">
                  <div className="bg-gray-100 p-3 rounded-full mb-2">
                    {integration.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{integration.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <a href="#" className="text-blue-600 text-lg font-medium hover:text-blue-700 inline-flex items-center">
              View all integrations <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </motion.section>

      {/* Resources Section */}
      <motion.section 
        className="bg-white py-16"
        // variants={sectionVariants}
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Learning Resources</h2>
            <p className="text-lg text-gray-500 max-w-3xl mx-auto">
              Everything you need to get started and master Flexcraft
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {resources.map((resource, index) => (
              <motion.div 
                key={resource.title}
                className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all"
                // variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={index}
              >
                <div className="h-48 bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
                  {resource.icon}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-medium text-gray-900 mb-2">{resource.title}</h3>
                  <p className="text-gray-600 mb-4">
                    {resource.description}
                  </p>
                  <a href="#" className="text-blue-600 font-medium inline-flex items-center">
                    Explore {resource.title.toLowerCase()} 
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.section 
        className="bg-white py-16"
        // variants={sectionVariants}
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Teams Worldwide</h2>
            <p className="text-lg text-gray-500 max-w-3xl mx-auto">
              Join thousands of teams who have transformed their workflow with Flexcraft.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={testimonial.name}
                className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-all"
                variants={fadeIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={index}
              >
                <div className="flex items-center mb-4">
                  <div className="bg-gray-200 border-2 border-dashed rounded-full w-10 h-10" />
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "{testimonial.quote}"
                </p>
                <div className="mt-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="bg-gradient-to-r from-blue-600 to-blue-800 py-16"
        // variants={sectionVariants}
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Ready to transform your workflow?
          </h2>
          <p className="mt-6 text-xl text-blue-100 max-w-3xl mx-auto">
            Join thousands of teams who use Flexcraft to build better software, faster.
          </p>
          <div className="mt-10 flex justify-center space-x-4">
            <a href="#" className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 md:py-4 md:text-lg md:px-10 transition-colors">
              Start free trial
            </a>
            <a href="https://calendly.com/flexcraftapp/30min" className="px-8 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition-colors">
              Request demo
            </a>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer 
        className="bg-gray-800 text-white"
        // variants={sectionVariants}
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.1 }}
      >
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {footerLinks.map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-semibold tracking-wider uppercase mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <a href={link.href} className="text-sm text-gray-300 hover:text-white transition-colors">
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6 mb-4 md:mb-0">
              {socialLinks.map((social) => (
                <a key={social.name} href={social.href} className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">{social.name}</span>
                  {social.icon}
                </a>
              ))}
            </div>
            <p className="text-sm text-gray-400">© 2025 Flexcraft. All rights reserved.</p>
          </div>
        </div>
      </motion.footer>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 transition-opacity" 
              aria-hidden="true"
              onClick={() => {
                setShowLoginModal(false);
                setError('');
              }}
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div 
              className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6 relative z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Sign in to your account</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Or{' '}
                      <button 
                        onClick={() => {
                          setShowLoginModal(false);
                          setShowSignupModal(true);
                          setError('');
                        }}
                        className="font-medium text-blue-600 hover:text-blue-500"
                      >
                        start your 14-day free trial
                      </button>
                    </p>
                  </div>
                </div>
              </div>
              {error && (
                <div className="mt-4 p-2 bg-red-100 text-red-700 rounded text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="mt-4 p-2 bg-green-100 text-green-700 rounded text-sm">
                  {success}
                </div>
              )}
              <div className="mt-5">
                <form onSubmit={handleLogin}>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email address
                    </label>  
                    <div className="mt-1">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="mt-1">
                      <input
                        type="password"
                        id="password"
                        name="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                        Remember me
                      </label>
                    </div>
                    <div className="text-sm">
                      <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                        Forgot your password?
                      </a>
                    </div>
                  </div>
                  <div className="mt-5">
                    <button
                      type="submit"
                      disabled={isLoggingIn}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoggingIn ? (
                        <>
                          <Loader2 className="animate-spin mr-2 h-4 w-4" />
                          Signing in...
                        </>
                      ) : 'Sign in'}
                    </button>
                  </div>
                </form>
                <div className="mt-4">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/480px-Google_%22G%22_logo.svg.png"
                        className="h-5 w-5"
                        alt="Google logo"
                      />
                      Sign in with Google
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignupModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 transition-opacity" 
              aria-hidden="true"
              onClick={() => {
                setShowSignupModal(false);
                setError('');
              }}
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div 
              className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full sm:p-6 relative z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Create your account</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Already have an account?{' '}
                      <button 
                        onClick={() => {
                          setShowSignupModal(false);
                          setShowLoginModal(true);
                          setError('');
                        }}
                        className="font-medium text-blue-600 hover:text-blue-500"
                      >
                        Sign in
                      </button>
                    </p>
                  </div>
                </div>
              </div>
              {error && (
                <div className="mt-4 p-2 bg-red-100 text-red-700 rounded text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="mt-4 p-2 bg-green-100 text-green-700 rounded text-sm">
                  {success}
                </div>
              )}
              <div className="mt-5">
                <form>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700">
                      Email address
                    </label>
                    <div className="mt-1">
                      <input
                        type="email"
                        id="signup-email"
                        name="signup-email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="mt-1">
                      <input
                        type="password"
                        id="signup-password"
                        name="signup-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Must be at least 8 characters
                    </p>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="terms"
                          name="terms"
                          type="checkbox"
                          required
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="terms" className="font-medium text-gray-700">
                          I agree to the{' '}
                          <a href="#" className="text-blue-600 hover:text-blue-500">
                            Terms of Service
                          </a>{' '}
                          and{' '}
                          <a href="#" className="text-blue-600 hover:text-blue-500">
                            Privacy Policy
                          </a>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5">
                    <button
                    onClick={handleClick}
                      type="submit"
                      disabled={isSigningUp}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSigningUp ? (
                        <>
                          <Loader2 className="animate-spin mr-2 h-4 w-4" />
                          Creating account...
                        </>
                      ) : 'Create account'}
                    </button>
                  </div>
                </form>
                <div className="mt-5">
                  <div className="mt-4">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <button
                        className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/480px-Google_%22G%22_logo.svg.png"
                          className="h-5 w-5"
                          alt="Google logo"
                        />
                        Sign up with Google
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Data arrays
const features = [
  {
    title: 'Project Management',
    description: 'Complete project tracking with issues, sprints, roadmaps, and customizable workflows.',
    icon: (
      <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
      </svg>
    )
  },
  {
    title: 'Deployment Tools',
    description: 'Full CI/CD pipeline integration with automated deployments and rollback capabilities.',
    icon: (
      <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    )
  },
  {
    title: 'API Testing',
    description: 'Powerful API testing suite with collections, environments, and automated testing.',
    icon: (
      <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
      </svg>
    )
  },
  {
    title: 'Video & Chat',
    description: 'Integrated video meetings and team chat with file sharing and threaded conversations.',
    icon: (
      <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
      </svg>
    )
  },
  {
    title: 'GitHub Integration',
    description: 'Full GitHub integration with repo management, PR reviews, and deployment triggers.',
    icon: (
      <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    )
  },
  {
    title: 'AI Insights',
    description: 'AI-powered code review, issue suggestions, and automated documentation.',
    icon: (
      <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 12.094A5.973 5.973 0 004 15v1H1v-1a3 3 0 013.75-2.906z" />
      </svg>
    )
  }
];

const architectureFeatures = [
  {
    title: "Cloud-Native",
    description: "Built on Kubernetes for elastic scalability",
    icon: <Cloud className="w-8 h-8 text-blue-600" />
  },
  {
    title: "Microservices",
    description: "Modular architecture for flexibility",
    icon: <Server className="w-8 h-8 text-blue-600" />
  },
  {
    title: "AI-Powered",
    description: "Machine learning for intelligent insights",
    icon: <Cpu className="w-8 h-8 text-blue-600" />
  },
  {
    title: "Enterprise Security",
    description: "SOC 2 compliant with end-to-end encryption",
    icon: <Shield className="w-8 h-8 text-blue-600" />
  }
];

const workflowSteps = [
  {
    title: "Plan",
    description: "Create tasks, assign owners, set timelines"
  },
  {
    title: "Code",
    description: "Collaborate in real-time with built-in IDE"
  },
  {
    title: "Test",
    description: "Run automated tests and API checks"
  },
  {
    title: "Review",
    description: "AI-assisted code review and feedback"
  },
  {
    title: "Deploy",
    description: "One-click deployments to production"
  }
];

const stats = [
  { value: "5x", label: "Faster Deployment" },
  { value: "68%", label: "Reduced Bugs" },
  { value: "10k+", label: "Active Teams" },
  { value: "99.9%", label: "Uptime" }
];

const benefits = [
  "Single sign-on with GitHub or custom email",
  "Unified dashboard for all project activities",
  "Cross-functional collaboration tools",
  "Enterprise-grade security and compliance",
  "Real-time project analytics",
  "Customizable workflow automation"
];

const aiBenefits = [
  "AI-assisted code reviews",
  "Automated documentation generation",
  "Predictive issue detection",
  "Smart project timeline forecasting",
  "Intelligent resource allocation",
  "Automated testing suggestions"
];

const integrations = [
  { name: 'GitHub', icon: <Github className="w-6 h-6 text-gray-800" /> },
  { name: 'Slack', icon: <Slack className="w-6 h-6 text-purple-600" /> },
  { name: 'Figma', icon: <Figma className="w-6 h-6 text-pink-500" /> },
  { name: 'Trello', icon: <Trello className="w-6 h-6 text-blue-500" /> },
  { name: 'Jira', icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-500" viewBox="0 0 48 48"><path fill="#0052cc" d="M30.902 5.5c3.451 0 6.25 2.799 6.25 6.25v24.5c0 3.451-2.799 6.25-6.25 6.25h-13.5c-3.451 0-6.25-2.799-6.25-6.25v-24.5c0-3.451 2.799-6.25 6.25-6.25h13.5z"/><path fill="#2684ff" d="M30.902 5.5c3.451 0 6.25 2.799 6.25 6.25v24.5c0 3.451-2.799 6.25-6.25 6.25h-6.75v-37h6.75z"/><path fill="white" d="M17.402 12.25c.414 0 .75.336.75.75v22a.75.75 0 01-1.5 0v-22c0-.414.336-.75.75-.75zm3.75 0c.414 0 .75.336.75.75v22a.75.75 0 01-1.5 0v-22c0-.414.336-.75.75-.75zm3.75 0c.414 0 .75.336.75.75v22a.75.75 0 01-1.5 0v-22c0-.414.336-.75.75-.75z"/></svg> },
  { name: 'Postman', icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-orange-500" viewBox="0 0 48 48"><path fill="#ff6c37" d="M44 8H4a4 4 0 00-4 4v24a4 4 0 004 4h40a4 4 0 004-4V12a4 4 0 00-4-4z"/><path fill="white" d="M30 15a9 9 0 00-9 9 9 9 0 009 9 9 9 0 009-9 9 9 0 00-9-9zm0 16a7 7 0 110-14 7 7 0 010 14z"/><path fill="white" d="M30 25a1 1 0 100-2 1 1 0 000 2z"/></svg> },
  { name: 'AWS', icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-yellow-600" viewBox="0 0 48 48"><path fill="#ff9900" d="M7.2 40l-5-8.8 5-8.7h10l5 8.7-5 8.8H7.2zm33.6 0l-5-8.8 5-8.7h10l5 8.7-5 8.8h-10z"/><path fill="#ff9900" d="M24 26l-5-8.7 5-8.8 5 8.8-5 8.7zm0 14l-5-8.8 5-8.7 5 8.7-5 8.8z"/></svg> },
  { name: 'Azure', icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-500" viewBox="0 0 48 48"><path fill="#0089d6" d="M24 5l-18 10 18 10 18-10-18-10z"/><path fill="#0089d6" d="M24 25l-18 10 18 10 18-10-18-10z"/></svg> },
  { name: 'Docker', icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-500" viewBox="0 0 48 48"><path fill="#2396ed" d="M47.527 19.847c-1.219-5.223-5.345-8.66-10.484-9.136-.368-.034-.728-.05-1.085-.05-1.614 0-3.077.309-4.292.825-1.215.516-2.282 1.265-3.197 2.238-.915.973-1.689 2.169-2.322 3.584-.633 1.415-1.14 3.049-1.52 4.899h-1.184c-.38-1.85-.887-3.484-1.52-4.899-.633-1.415-1.407-2.611-2.322-3.584-.915-.973-1.982-1.722-3.197-2.238-1.215-.516-2.678-.825-4.292-.825-.357 0-.717.016-1.085.05-5.139.476-9.265 3.913-10.484 9.136-1.219 5.223-.143 10.22 3.215 14.999 3.358 4.779 8.573 8.154 15.642 10.126 7.069 1.972 13.774 2.958 20.114 2.958 6.34 0 13.045-.986 20.114-2.958 7.069-1.972 12.284-5.347 15.642-10.126 3.358-4.779 4.434-9.776 3.215-14.999z"/></svg> },
  { name: 'Kubernetes', icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-500" viewBox="0 0 48 48"><path fill="#326ce5" d="M24 5l-18 10 18 10 18-10-18-10z"/><path fill="#326ce5" d="M24 25l-18 10 18 10 18-10-18-10z"/></svg> },
  { name: 'GitLab', icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-orange-500" viewBox="0 0 48 48"><path fill="#e24329" d="M24 5l5.091 15.636H42L30.954 30.273 36.045 45 24 35.091 11.955 45l5.091-14.727L6 20.636h12.909z"/></svg> }
];

const resources = [
  {
    title: "Documentation",
    description: "Comprehensive guides and API references",
    icon: <Code className="w-12 h-12 text-blue-600" />
  },
  {
    title: "Tutorials",
    description: "Step-by-step video tutorials for all features",
    icon: <GitPullRequest className="w-12 h-12 text-blue-600" />
  },
  {
    title: "Community",
    description: "Join our developer community for support",
    icon: <Users className="w-12 h-12 text-blue-600" />
  }
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "CTO, TechStart Inc.",
    quote: "Flexcraft has transformed how our engineering team collaborates. The all-in-one platform saved us from juggling multiple tools and improved our deployment frequency by 40%."
  },
  {
    name: "Michael Chen",
    role: "Engineering Lead, DataSystems",
    quote: "The AI-powered insights have been a game-changer for our code quality. We've reduced production bugs by 65% since implementing Flexcraft's automated code review."
  },
  {
    name: "Emma Rodriguez",
    role: "Product Manager, GrowthLabs",
    quote: "As a PM, I love how Flexcraft brings all stakeholders onto one platform. The real-time collaboration features have cut our planning cycle time in half."
  }
];

const footerLinks = [
  {
    title: "Product",
    links: [
      { name: "Features", href: "/features" },
      { name: "Pricing", href: "/pricing" },
      { name: "Integrations", href: "/integrations" },
      { name: "Roadmap", href: "/roadmap" }
    ]
  },
  {
    title: "Resources",
    links: [
      { name: "Documentation", href: "/documentation" },
      { name: "API Reference", href: "/api" },
      { name: "Community", href: "/community" },
      { name: "Blog", href: "/blog" }
    ]
  },
  {
    title: "Company",
    links: [
      { name: "About", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Contact", href: "/contact" },
      { name: "Press", href: "/press" }
    ]
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy", href: "/privacy" },
      { name: "Terms", href: "/terms" },
      { name: "Security", href: "/security" },
      { name: "Compliance", href: "/compliance" }
    ]
  }
];

const socialLinks = [
  {
    name: 'Twitter',
    href: '#',
    icon: (
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
      </svg>
    )
  },
  {
    name: 'GitHub',
    href: '#',
    icon: (
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 2 12 2z" clipRule="evenodd" />
      </svg>
    )
  },
  {
    name: 'LinkedIn',
    href: '#',
    icon: (
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    )
  }
];

export default FlexcraftHomepage;