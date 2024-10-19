import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa'; 
import logo from "../assets/logo.png"


export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-100 p-4 flex justify-between items-center">
     <img src={logo} className='w-40 h-12'/>
   
      <div className="md:hidden">
        <button onClick={toggleMenu}>
          {isOpen ? <FaTimes size={30}  /> : <FaBars size={30} color="black" />}
        </button>
      </div>
     
      <ul className={`md:flex md:space-x-6 absolute md:static top-16 left-0 w-full md:w-auto md:bg-transparent bg-blue-500 transition-transform duration-300 ease-in-out ${isOpen ? 'block' : 'hidden'} md:flex`}>
        <li className=" px-4 py-2 text-black md:px-0 md:py-0">
          <a href="#">Home</a>
        </li>
        <li className=" text-black px-4 py-2 md:px-0 md:py-0">
          <a href="#">About</a>
        </li>
        <li className=" text-black px-4 py-2 md:px-0 md:py-0">
          <a href="#">Services</a>
        </li>
        <li className=" text-black px-4 py-2 md:px-0 md:py-0">
          <a href="#">Contact</a>
        </li>
        <li className=" text-black px-4 py-2 md:px-0 md:py-0">
          <a href="#">Block</a>
        </li>
      </ul>
    </nav>
  );
};
