import React from 'react'
import { Navbar } from './Navbar'
import { Banner } from './Banner'
import Blog from '../component/Blog/Blog'

export const BlockHomePage = () => {
  return (
    <div>
          <Banner/>
          <Blog/>
    </div>
  )
}
