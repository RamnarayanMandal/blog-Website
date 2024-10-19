import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import  CartList  from "../CartList";
export const BlogDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { blog } = location.state || {};

  // Handle back button click
  const handleBack = () => {
    navigate(-1);
  };

  const BASE_URL = import.meta.env.VITE_API_URL;

  if (!blog) {
    return (
      <div className="container mx-auto p-6 bg-white text-gray-800">
        Blog not found!
      </div>
    );
  }

  // Function to format the date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

  return (
    <div className="p-6 py-20 min-h-screen bg-white text-gray-800 ml-20">
      <div className="lg:flex w-full  ">
        <div className="flex flex-col lg:w-[70%]">
          <div className="flex justify-between content-center gap-4 items-center">
            <button
              onClick={handleBack}
              className="mb-6 w-40 text-white bg-blue-500 hover:bg-blue-700 p-2 px-5 rounded-md focus:outline-none"
            >
              ⬅ Back
            </button>
          </div>
          <div className="grid  grid-cols-1 gap-4">
            <div>
              {blog.image && (
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-auto md:h-full object-cover rounded-xl"
                />
              )}
              {blog.video && (
                <video
                  src={blog.video}
                  alt={blog.title}
                  className="w-full h-auto md:h-full object-cover rounded-xl"
                  controls
                  autoPlay
                  muted
                />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
              <div
                className="mb-4"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
              
            </div>
            <p className="text-gray-600 text-sm my-2">
                                    {formatDate(blog.createdAt)} - {formatDate(blog.updatedAt)}
                                </p>
          </div>
          
        </div>
        <div className="lg:w-[30%]">
            <CartList />
          </div>
      </div>
    </div>
  );
};
