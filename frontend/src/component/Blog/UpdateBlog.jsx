import React, { useEffect, useState } from 'react';
import { IoMdClose } from "react-icons/io";
import { FiPaperclip } from 'react-icons/fi';
import Swal from 'sweetalert2';
import axios from 'axios';
import ReactQuill from 'react-quill'; // Import ReactQuill
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

const BASE_URL = import.meta.env.VITE_API_URL;

const UpdateBlog = ({ onClose, blog }) => {
  const [blogData, setBlogData] = useState({
    title: '',
    content: '',
    slug: '', // Single slug reference, not an array
    image: null,
    video: null,
    audio: null,
    documents: [],
  });

  const token = localStorage.getItem('token');
  const [showFileOptions, setShowFileOptions] = useState(false);
  const [selectedFileType, setSelectedFileType] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (blog) {
      setBlogData({
        title: blog.title,
        content: blog.content,
        slug: blog.slug?._id || '',  // Set slug as single category ID
        image: null,
        video: null,
        audio: null,
        documents: [],
      });
    }
  }, [blog]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlogData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle Quill content change
  const handleQuillChange = (content) => {
    setBlogData((prevData) => ({
      ...prevData,
      content: content,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setBlogData((prevData) => ({
      ...prevData,
      [selectedFileType]: file,
    }));
    setShowFileOptions(false);
    setSelectedFileType('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true before API call
    const formDataToSubmit = new FormData();

    formDataToSubmit.append('title', blogData.title);
    formDataToSubmit.append('content', blogData.content);
    formDataToSubmit.append('slug', blogData.slug);  // Single category ID
   
    if (blogData.image) formDataToSubmit.append('image', blogData.image);
    if (blogData.video) formDataToSubmit.append('video', blogData.video);
    if (blogData.audio) formDataToSubmit.append('audio', blogData.audio);
    if (blogData.documents.length > 0) {
      blogData.documents.forEach(doc => {
        formDataToSubmit.append('documents', doc);
      });
    }

    try {
      const url = blog
        ? `${BASE_URL}/api/blogs/posts/${blog._id}`
        : `${BASE_URL}/api/blogs/posts`;

      const method = blog ? 'put' : 'post';

      const response = await axios({
        method: method,
        url: url,
        data: formDataToSubmit,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      Swal.fire({
        icon: 'success',
        title: `Blog ${blog ? 'Updated' : 'Created'}!`,
        text: `The blog has been ${blog ? 'updated' : 'created'} successfully.`,
      });

      setBlogData({
        title: '',
        content: '',
        slug: '',
        image: null,
        video: null,
        audio: null,
        documents: [],
      });
      onClose();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: `There was an error ${blog ? 'updating' : 'creating'} the blog. Please try again.`,
      });
    } finally {
      setLoading(false); // Set loading to false after API call
    }
  };

  return (
    <div className="max-w-lg mx-auto w-full p-4 rounded-lg shadow-lg h-[90%] overflow-y-auto top-0 ">
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-lg relative">
        <div className='flex justify-between content-center items-center'>
          <h2 className="text-xl font-semibold mb-4">{blog ? 'Update Blog' : 'Create Blog'}</h2>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <IoMdClose size={24} />
          </button>
        </div>
        
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={blogData.title}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
          <ReactQuill value={blogData.content} onChange={handleQuillChange} />
        </div>

        <div className="mb-4">
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700">Slug</label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={blogData.slug}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* File upload components for image, video, audio */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Attachments</label>
          <div className="flex items-center space-x-4 mt-1">
            <button
              type="button"
              onClick={() => setShowFileOptions(!showFileOptions)}
              className="flex items-center text-sm text-blue-500 hover:text-blue-700"
            >
              <FiPaperclip className="mr-1" /> Attach File
            </button>
          </div>
        </div>

        {showFileOptions && (
          <div className="mb-4">
            <label htmlFor="fileType" className="block text-sm font-medium text-gray-700">Select File Type</label>
            <select
              id="fileType"
              onChange={(e) => setSelectedFileType(e.target.value)}
              value={selectedFileType}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Choose file type...</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
              <option value="documents">Documents</option>
            </select>
            {selectedFileType && (
              <div className="mt-2">
                <input type="file" onChange={handleFileChange} />
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Submitting...' : blog ? 'Update Blog' : 'Create Blog'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateBlog;
