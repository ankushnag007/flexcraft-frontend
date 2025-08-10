import React, { useState } from 'react'

const Register = () => {
    const [showSignupModal, setShowSignupModal] = useState(false);
          const [email, setEmail] = useState('');
              const [password, setPassword] = useState('');
              const [name, setName] = useState('');
              const [rememberMe, setRememberMe] = useState(false);
              const [activeTab, setActiveTab] = useState('login');
                    const [showLoginModal, setShowLoginModal] = useState(false);
              
  return (
    <>
       {showSignupModal && (
  <div className="fixed inset-0 z-50 overflow-y-auto">
    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      {/* Background overlay */}
      <div 
        className="fixed inset-0 transition-opacity" 
        aria-hidden="true"
        onClick={() => setShowSignupModal(false)}
      >
        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>

      {/* This element is to trick the browser into centering the modal contents */}
      <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      {/* Modal panel */}
      <div 
        className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full sm:p-6 relative z-50"
        onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
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
                  }}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <form >
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full name
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
             <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Last  name
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
      type="button" // Changed from "submit" to "button" unless it's in a form
      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      onClick={handleClick}
    >
      Create account
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
                // onClick={googleLogin}
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
    </>
  )
}

export default Register