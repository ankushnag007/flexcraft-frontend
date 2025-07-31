import Image from 'next/image';
import React from 'react'
import logo from "../../Assets/images/headway-high-resolution-logo-grayscale-transparent.png"
const header = () => {
  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50 max-w-screen">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex items-center justify-center">
              <Image src={logo} className='h-6 w-auto' alt="Flexcraft Logo" />
            </div>
            </div>

           
          </div>

  

      

      </header>
      </>
  )
}

export default header