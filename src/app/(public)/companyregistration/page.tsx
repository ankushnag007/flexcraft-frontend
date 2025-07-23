"use client"
import React, { useState, useRef } from 'react';
import { FiArrowRight, FiCheck, FiHome, FiUsers, FiSettings, FiMail, FiUpload, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../header'
const CompanyRegistration = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    companySize: '',
    companyWebsite: '',
    companyLogo: null,
    adminName: '',
    adminEmail: '',
    adminPassword: '',
    teamMembers: [],
    preferences: {
      notifications: true,
      updates: true,
      marketing: false
    }
  });

  const fileInputRef = useRef(null);

  const industries = [
    'Technology',
    'Finance',
    'Healthcare',
    'Education',
    'Retail',
    'Manufacturing',
    'Other'
  ];

  const companySizes = [
    '1-10 employees',
    '11-50 employees',
    '51-200 employees',
    '201-500 employees',
    '501-1000 employees',
    '1000+ employees'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          companyLogo: {
            file,
            preview: event.target.result
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setFormData(prev => ({
      ...prev,
      companyLogo: null
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addTeamMember = (email) => {
    if (email && !formData.teamMembers.includes(email)) {
      setFormData(prev => ({
        ...prev,
        teamMembers: [...prev.teamMembers, email]
      }));
    }
  };

  const removeTeamMember = (email) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter(member => member !== email)
    }));
  };

  const nextStep = () => {
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send data to your backend
    alert('Company registration successful!');
  };

  // Step configurations
  const steps = [
    { id: 1, title: 'Company Info', icon: <FiHome /> },
    { id: 2, title: 'Admin Account', icon: <FiUsers /> },
    { id: 3, title: 'Team Members', icon: <FiUsers /> },
    { id: 4, title: 'Preferences', icon: <FiSettings /> }
  ];

  return (
    <>
        <Header />
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Create Your Company Account</h1>
          <p className="mt-2 text-lg text-gray-600">Get started in just a few simple steps</p>
        </div>

        {/* Progress Steps - Asana-like */}
        <div className="mb-12">
          <div className="flex justify-between relative">
            {/* Progress line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10"></div>
            <div 
              className="absolute top-1/2 left-0 h-1 bg-blue-600 -z-10 transition-all duration-300 ease-in-out"
              style={{ width: `${(step - 1) * 33.33}%` }}
            ></div>

            {steps.map((stepItem, index) => (
              <div key={stepItem.id} className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => step > stepItem.id && setStep(stepItem.id)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                    ${step === stepItem.id ? 'bg-blue-600 text-white shadow-lg transform scale-110' : 
                      step > stepItem.id ? 'bg-green-100 text-green-600' : 'bg-white border-2 border-gray-300 text-gray-400'}
                    ${step > stepItem.id ? 'cursor-pointer hover:bg-green-200' : ''}`}
                >
                  {step > stepItem.id ? <FiCheck size={20} /> : stepItem.icon}
                </button>
                <span className={`mt-3 text-sm font-medium ${step >= stepItem.id ? 'text-gray-900' : 'text-gray-500'}`}>
                  {stepItem.title}
                </span>
                {index < steps.length - 1 && (
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-16 h-1"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-xl overflow-hidden"
        >
          <form onSubmit={handleSubmit}>
            {/* Step 1: Company Information */}
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="p-8 space-y-6"
                >
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-800">Tell us about your company</h2>
                    <p className="text-gray-600">We'll use this information to customize your experience.</p>
                  </div>

                  {/* Company Logo Upload */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Company Logo</label>
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        {formData.companyLogo ? (
                          <>
                            <img 
                              src={formData.companyLogo.preview} 
                              alt="Company logo preview" 
                              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={removeLogo}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <FiX size={14} />
                            </button>
                          </>
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                            <FiUsers size={24} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept="image/*"
                          className="hidden"
                          id="companyLogo"
                        />
                        <label
                          htmlFor="companyLogo"
                          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                        >
                          <FiUpload className="mr-2" />
                          {formData.companyLogo ? 'Change Logo' : 'Upload Logo'}
                        </label>
                        <p className="mt-1 text-xs text-gray-500">Recommended size: 256x256px</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        id="companyName"
                        name="companyName"
                        required
                        value={formData.companyName}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                        Industry *
                      </label>
                      <select
                        id="industry"
                        name="industry"
                        required
                        value={formData.industry}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select your industry</option>
                        {industries.map(industry => (
                          <option key={industry} value={industry}>{industry}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="companySize" className="block text-sm font-medium text-gray-700">
                        Company Size *
                      </label>
                      <select
                        id="companySize"
                        name="companySize"
                        required
                        value={formData.companySize}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select your company size</option>
                        {companySizes.map(size => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="companyWebsite" className="block text-sm font-medium text-gray-700">
                        Company Website
                      </label>
                      <input
                        type="url"
                        id="companyWebsite"
                        name="companyWebsite"
                        value={formData.companyWebsite}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!formData.companyName || !formData.industry || !formData.companySize}
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Continue <FiArrowRight className="ml-2" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step 2: Admin Account */}
            <AnimatePresence mode="wait">
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="p-8 space-y-6"
                >
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-800">Create your admin account</h2>
                    <p className="text-gray-600">You'll use this account to manage your company settings.</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label htmlFor="adminName" className="block text-sm font-medium text-gray-700">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        id="adminName"
                        name="adminName"
                        required
                        value={formData.adminName}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700">
                        Work Email *
                      </label>
                      <input
                        type="email"
                        id="adminEmail"
                        name="adminEmail"
                        required
                        value={formData.adminEmail}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-700">
                        Password *
                      </label>
                      <input
                        type="password"
                        id="adminPassword"
                        name="adminPassword"
                        required
                        minLength="8"
                        value={formData.adminPassword}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                      <div className="mt-2 text-sm text-gray-500">
                        <p>Password requirements:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li className={formData.adminPassword.length >= 8 ? 'text-green-600' : ''}>
                            At least 8 characters
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!formData.adminName || !formData.adminEmail || !formData.adminPassword}
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue <FiArrowRight className="ml-2" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step 3: Team Members */}
            <AnimatePresence mode="wait">
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="p-8 space-y-6"
                >
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-800">Invite your team</h2>
                    <p className="text-gray-600">Add your team members to collaborate together (you can skip this and add them later).</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="teamMemberEmail" className="block text-sm font-medium text-gray-700">
                        Team Member Emails
                      </label>
                      <div className="mt-1 flex rounded-lg shadow-sm">
                        <input
                          type="email"
                          id="teamMemberEmail"
                          className="flex-1 min-w-0 block w-full px-4 py-3 rounded-none rounded-l-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="name@company.com"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addTeamMember(e.target.value);
                              e.target.value = '';
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const input = document.getElementById('teamMemberEmail');
                            addTeamMember(input.value);
                            input.value = '';
                          }}
                          className="inline-flex items-center px-4 py-3 border border-l-0 border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-r-lg"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {formData.teamMembers.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700">Team Members to Invite</h4>
                        <ul className="border border-gray-200 rounded-lg divide-y divide-gray-200">
                          {formData.teamMembers.map((email) => (
                            <li key={email} className="flex items-center justify-between py-3 px-4">
                              <div className="flex items-center">
                                <div className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                                  <FiMail className="text-gray-500" />
                                </div>
                                <span className="text-sm font-medium text-gray-800">{email}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeTeamMember(email)}
                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                              >
                                Remove
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Back
                    </button>
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={nextStep}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      >
                        Skip for now
                      </button>
                      <button
                        type="button"
                        onClick={nextStep}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Continue <FiArrowRight className="ml-2" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step 4: Preferences */}
            <AnimatePresence mode="wait">
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="p-8 space-y-6"
                >
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-800">Almost done!</h2>
                    <p className="text-gray-600">Configure your preferences to get started.</p>
                  </div>

                  <div className="space-y-6">
                    <fieldset className="space-y-4">
                      <legend className="text-base font-medium text-gray-700">Email Preferences</legend>
                      <div className="space-y-4">
                        <div className="relative flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="notifications"
                              name="preferences.notifications"
                              type="checkbox"
                              checked={formData.preferences.notifications}
                              onChange={handleChange}
                              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="notifications" className="font-medium text-gray-700">
                              Product notifications
                            </label>
                            <p className="text-gray-500">Important updates about your account and services.</p>
                          </div>
                        </div>

                        <div className="relative flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="updates"
                              name="preferences.updates"
                              type="checkbox"
                              checked={formData.preferences.updates}
                              onChange={handleChange}
                              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="updates" className="font-medium text-gray-700">
                              Product updates
                            </label>
                            <p className="text-gray-500">New features and improvements.</p>
                          </div>
                        </div>

                        <div className="relative flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="marketing"
                              name="preferences.marketing"
                              type="checkbox"
                              checked={formData.preferences.marketing}
                              onChange={handleChange}
                              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="marketing" className="font-medium text-gray-700">
                              Marketing communications
                            </label>
                            <p className="text-gray-500">Tips, promotions, and special offers.</p>
                          </div>
                        </div>
                      </div>
                    </fieldset>

                    <div className="border-t border-gray-200 pt-6">
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
                            I agree to the Terms of Service and Privacy Policy
                          </label>
                          <p className="text-gray-500">By creating an account, you agree to our terms and conditions.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-6">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Complete Registration
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </div>
    </div>
    </>
  );
};

export default CompanyRegistration;