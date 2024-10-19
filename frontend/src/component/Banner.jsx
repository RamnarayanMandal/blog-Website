import React from 'react'
import bannerLogo from "../assets/block.jpg"

export const Banner = () => {
  return (
    <div className='w-full h-[50vh] relative'>
      
      <img src={bannerLogo} alt="Banner" className='w-full h-full object-cover'/>

      
      <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center'>
        <h1 className='text-black text-4xl font-bold'>Blog</h1>
      </div>
    </div>
  )
}
