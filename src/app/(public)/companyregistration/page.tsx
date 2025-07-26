"use client"
import React, { useState, useRef } from 'react';
import { FiArrowRight, FiCheck, FiHome, FiUser, FiMail, FiUpload, FiX, FiPhone, FiGlobe, FiClock } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../header';

const RegistrationForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Company fields
    name: '',
    address: '',
    phone_number: '',
    sec_phone_number: '',
    domain: '',
    invite_code: '',
    image: null,
    bck_image: null,
    email: '',
    country: '',
    timezone: '',
    country_code: '',
    
    // User fields
    user_email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'USER',
    is_google_login: false,
    is_verified: false,
    user_phone_number: '',
    user_image: null,
    user_bck_image: null,
    user_country: '',
    user_timezone: '',
    user_country_code: ''
  });

  const companyFileInputRef = useRef(null);
  const companyBckFileInputRef = useRef(null);
  const userFileInputRef = useRef(null);
  const userBckFileInputRef = useRef(null);

  const handleChange = (e:any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          [field]: {
            file,
            preview: event.target.result
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (field, ref) => {
    setFormData(prev => ({
      ...prev,
      [field]: null
    }));
    if (ref.current) {
      ref.current.value = '';
    }
  };

  const nextStep = () => {
    // Validate company fields before proceeding
    if (step === 1) {
      if (!formData.name || !formData.address || !formData.phone_number || 
          !formData.domain || !formData.email) {
        alert('Please fill all required company fields');
        return;
      }
      if (!validatePhone(formData.phone_number)) {
        alert('Please enter a valid 10-digit phone number');
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();
    // Validate user fields before submission
    if (!formData.first_name || !formData.user_email || !formData.password || 
        !formData.user_phone_number || !formData.user_country) {
      alert('Please fill all required user fields');
      return;
    }
    if (!validatePhone(formData.user_phone_number)) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }
    console.log('Form submitted:', formData);
    alert('Registration successful!');
  };

  // Validate phone number format
  const validatePhone = (phone:number) => {
    return /^\d{10}$/.test(phone);
  };

  // Step configurations
  const steps = [
    { id: 1, title: 'Company Info', icon: <FiHome /> },
    { id: 2, title: 'User Info', icon: <FiUser /> }
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">Registration</h1>
            <p className="mt-2 text-lg text-gray-600">Complete your company and user registration</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex justify-between relative">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10"></div>
              <div 
                className="absolute top-1/2 left-0 h-1 bg-blue-600 -z-10 transition-all duration-300 ease-in-out"
                style={{ width: `${(step - 1) * 100}%` }}
              ></div>

              {steps.map((stepItem) => (
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
                      <h2 className="text-2xl font-bold text-gray-800">Company Information</h2>
                      <p className="text-gray-600">Please provide your company details.</p>
                    </div>

                    {/* Company Logo Upload */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Company Logo</label>
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            {formData.image ? (
                              <>
                                <img 
                                  src={formData.image.preview} 
                                  alt="Company logo preview" 
                                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage('image', companyFileInputRef)}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                >
                                  <FiX size={14} />
                                </button>
                              </>
                            ) : (
                              <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                                <FiHome size={24} className="text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <input
                              type="file"
                              ref={companyFileInputRef}
                              onChange={(e) => handleFileChange(e, 'image')}
                              accept="image/*"
                              className="hidden"
                              id="companyLogo"
                            />
                            <label
                              htmlFor="companyLogo"
                              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                            >
                              <FiUpload className="mr-2" />
                              {formData.image ? 'Change Logo' : 'Upload Logo'}
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Company Background Image Upload */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Company Background Image</label>
                        <div className="flex items-center space-x-4">
                          <div className="relative w-full h-32">
                            {formData.bck_image ? (
                              <>
                                <img 
                                  src={formData.bck_image.preview} 
                                  alt="Company background preview" 
                                  className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage('bck_image', companyBckFileInputRef)}
                                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                >
                                  <FiX size={14} />
                                </button>
                              </>
                            ) : (
                              <div className="w-full h-full rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                                <FiUpload size={24} className="text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <input
                              type="file"
                              ref={companyBckFileInputRef}
                              onChange={(e) => handleFileChange(e, 'bck_image')}
                              accept="image/*"
                              className="hidden"
                              id="companyBckImage"
                            />
                            <label
                              htmlFor="companyBckImage"
                              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                            >
                              <FiUpload className="mr-2" />
                              {formData.bck_image ? 'Change Background' : 'Upload Background'}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Company Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          minLength={2}
                          maxLength={100}
                          value={formData.name}
                          onChange={handleChange}
                          className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                          Address *
                        </label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          required
                          minLength={5}
                          maxLength={255}
                          value={formData.address}
                          onChange={handleChange}
                          className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                          Phone Number *
                        </label>
                        <div className="flex items-center">
                          <select
                            name="country_code"
                            value={formData.country_code}
                            onChange={handleChange}
                            className="mt-1 mr-2 px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="+1">+1 (US)</option>
                            <option value="+44">+44 (UK)</option>
                            <option value="+91">+91 (IN)</option>
                          </select>
                          <input
                            type="tel"
                            id="phone_number"
                            name="phone_number"
                            required
                            pattern="^\d{10}$"
                            minLength={10}
                            maxLength={10}
                            value={formData.phone_number}
                            onChange={handleChange}
                            className="mt-1 flex-1 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        {formData.phone_number && !validatePhone(formData.phone_number) && (
                          <p className="mt-1 text-sm text-red-600">Please enter a valid 10-digit phone number</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="sec_phone_number" className="block text-sm font-medium text-gray-700">
                          Secondary Phone Number
                        </label>
                        <div className="flex items-center">
                          <select
                            name="country_code"
                            value={formData.country_code}
                            onChange={handleChange}
                            className="mt-1 mr-2 px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="+1">+1 (US)</option>
                            <option value="+44">+44 (UK)</option>
                            <option value="+91">+91 (IN)</option>
                          </select>
                          <input
                            type="tel"
                            id="sec_phone_number"
                            name="sec_phone_number"
                            pattern="^\d{10}$"
                            minLength={10}
                            maxLength={10}
                            value={formData.sec_phone_number}
                            onChange={handleChange}
                            className="mt-1 flex-1 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        {formData.sec_phone_number && !validatePhone(formData.sec_phone_number) && (
                          <p className="mt-1 text-sm text-red-600">Please enter a valid 10-digit phone number</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="domain" className="block text-sm font-medium text-gray-700">
                          Domain *
                        </label>
                        <input
                          type="text"
                          id="domain"
                          name="domain"
                          required
                          value={formData.domain}
                          onChange={handleChange}
                          className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="invite_code" className="block text-sm font-medium text-gray-700">
                          Invite Code
                        </label>
                        <input
                          type="text"
                          id="invite_code"
                          name="invite_code"
                          value={formData.invite_code}
                          onChange={handleChange}
                          className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Company Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          minLength={5}
                          maxLength={128}
                          value={formData.email}
                          onChange={handleChange}
                          className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                          Country *
                        </label>
                        <select
                          id="country"
                          name="country"
                          required
                          value={formData.country}
                          onChange={handleChange}
                          className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select Country</option>
                          <option value="United States">United States</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="India">India</option>
                          <option value="Canada">Canada</option>
                          <option value="Australia">Australia</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
                          Timezone *
                        </label>
                        <select
                          id="timezone"
                          name="timezone"
                          required
                          value={formData.timezone}
                          onChange={handleChange}
                          className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select Timezone</option>
                          <option value="UTC-12:00">UTC-12:00</option>
                          <option value="UTC-08:00">UTC-08:00 (PST)</option>
                          <option value="UTC-05:00">UTC-05:00 (EST)</option>
                          <option value="UTC+00:00">UTC+00:00 (GMT)</option>
                          <option value="UTC+05:30">UTC+05:30 (IST)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        type="button"
                        onClick={nextStep}
                        disabled={!formData.name || !formData.address || !formData.phone_number || 
                                 !validatePhone(formData.phone_number) || !formData.domain || 
                                 !formData.email || !formData.country || !formData.timezone}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        Continue <FiArrowRight className="ml-2" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Step 2: User Information */}
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
                      <h2 className="text-2xl font-bold text-gray-800">User Information</h2>
                      <p className="text-gray-600">Please provide your personal details.</p>
                    </div>

                    {/* Profile Picture Upload */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            {formData.user_image ? (
                              <>
                                <img 
                                  src={formData.user_image.preview} 
                                  alt="Profile preview" 
                                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage('user_image', userFileInputRef)}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                >
                                  <FiX size={14} />
                                </button>
                              </>
                            ) : (
                              <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                                <FiUser size={24} className="text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <input
                              type="file"
                              ref={userFileInputRef}
                              onChange={(e) => handleFileChange(e, 'user_image')}
                              accept="image/*"
                              className="hidden"
                              id="userImage"
                            />
                            <label
                              htmlFor="userImage"
                              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                            >
                              <FiUpload className="mr-2" />
                              {formData.user_image ? 'Change Photo' : 'Upload Photo'}
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Background Image Upload */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Background Image</label>
                        <div className="flex items-center space-x-4">
                          <div className="relative w-full h-32">
                            {formData.user_bck_image ? (
                              <>
                                <img 
                                  src={formData.user_bck_image.preview} 
                                  alt="Background preview" 
                                  className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage('user_bck_image', userBckFileInputRef)}
                                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                >
                                  <FiX size={14} />
                                </button>
                              </>
                            ) : (
                              <div className="w-full h-full rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                                <FiUpload size={24} className="text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <input
                              type="file"
                              ref={userBckFileInputRef}
                              onChange={(e) => handleFileChange(e, 'user_bck_image')}
                              accept="image/*"
                              className="hidden"
                              id="userBckImage"
                            />
                            <label
                              htmlFor="userBckImage"
                              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                            >
                              <FiUpload className="mr-2" />
                              {formData.user_bck_image ? 'Change Background' : 'Upload Background'}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                          First Name *
                        </label>
                        <input
                          type="text"
                          id="first_name"
                          name="first_name"
                          required
                          minLength={2}
                          maxLength={50}
                          value={formData.first_name}
                          onChange={handleChange}
                          className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="last_name"
                          name="last_name"
                          minLength={2}
                          maxLength={50}
                          value={formData.last_name}
                          onChange={handleChange}
                          className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="user_email" className="block text-sm font-medium text-gray-700">
                          Email *
                        </label>
                        <input
                          type="email"
                          id="user_email"
                          name="user_email"
                          required
                          minLength={5}
                          maxLength={128}
                          value={formData.user_email}
                          onChange={handleChange}
                          className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                          Password *
                        </label>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          required
                          minLength={6}
                          maxLength={25}
                          value={formData.password}
                          onChange={handleChange}
                          className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="mt-1 text-xs text-gray-500">Password must be 6-25 characters</p>
                      </div>

                      <div>
                        <label htmlFor="user_phone_number" className="block text-sm font-medium text-gray-700">
                          Phone Number *
                        </label>
                        <div className="flex items-center">
                          <select
                            name="user_country_code"
                            value={formData.user_country_code}
                            onChange={handleChange}
                            className="mt-1 mr-2 px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="+1">+1 (US)</option>
                            <option value="+44">+44 (UK)</option>
                            <option value="+91">+91 (IN)</option>
                          </select>
                          <input
                            type="tel"
                            id="user_phone_number"
                            name="user_phone_number"
                            required
                            pattern="^\d{10}$"
                            minLength={10}
                            maxLength={10}
                            value={formData.user_phone_number}
                            onChange={handleChange}
                            className="mt-1 flex-1 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        {formData.user_phone_number && !validatePhone(formData.user_phone_number) && (
                          <p className="mt-1 text-sm text-red-600">Please enter a valid 10-digit phone number</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="user_country" className="block text-sm font-medium text-gray-700">
                          Country *
                        </label>
                        <select
                          id="user_country"
                          name="user_country"
                          required
                          value={formData.user_country}
                          onChange={handleChange}
                          className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select Country</option>
                          <option value="United States">United States</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="India">India</option>
                          <option value="Canada">Canada</option>
                          <option value="Australia">Australia</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="user_timezone" className="block text-sm font-medium text-gray-700">
                          Timezone *
                        </label>
                        <select
                          id="user_timezone"
                          name="user_timezone"
                          required
                          value={formData.user_timezone}
                          onChange={handleChange}
                          className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select Timezone</option>
                          <option value="UTC-12:00">UTC-12:00</option>
                          <option value="UTC-08:00">UTC-08:00 (PST)</option>
                          <option value="UTC-05:00">UTC-05:00 (EST)</option>
                          <option value="UTC+00:00">UTC+00:00 (GMT)</option>
                          <option value="UTC+05:30">UTC+05:30 (IST)</option>
                        </select>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="is_google_login"
                          name="is_google_login"
                          type="checkbox"
                          checked={formData.is_google_login}
                          onChange={handleChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="is_google_login" className="ml-2 block text-sm text-gray-700">
                          Sign up with Google
                        </label>
                      </div>
                    </div>

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

                    <div className="flex justify-between pt-4">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={!formData.first_name || !formData.user_email || !formData.password || 
                                 !validatePhone(formData.user_phone_number) || !formData.user_country ||
                                 !formData.user_timezone}
                        className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default RegistrationForm;