import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { FaThumbsUp, FaThumbsDown, FaRegComment, FaUserCircle } from 'react-icons/fa';
import UpdateBlog from './UpdateBlog';
import { useNavigate } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_API_URL;

const Blog = () => {
    const [Blogs, setBlogs] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);
   
    
    const navigate = useNavigate();
    const contentRefs = useRef({});

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/Blogs/posts`);
                const data = await response.json();
                setBlogs(data);
            } catch (error) {
                console.error('Error fetching Blogs:', error);
            }
        };

        fetchBlogs();
    }, []);

    

    const handleUpdateBlog = (Blog) => {
        setSelectedBlog(Blog);
        setShowModal(true);
    };

    const handleAddBlog = () => {
        setSelectedBlog(null);
        setShowModal(true);
    };

    const handleDeleteBlog = async (Blog) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `You are about to delete ${Blog.title}. This action cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`${BASE_URL}/api/Blogs/posts/${Blog._id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    setBlogs((prevBlogs) =>
                        prevBlogs.filter((cert) => cert._id !== Blog._id)
                    );
                    Swal.fire('Deleted!', `${Blog.title} has been deleted.`, 'success');
                } else {
                    throw new Error('Failed to delete the Blog.');
                }
            } catch (error) {
                console.error('Error deleting Blog:', error);
                Swal.fire('Error!', 'There was an error deleting the Blog.', 'error');
            }
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleOnclick = (blog) => {
        console.log(blog);
        navigate("/blog-details", { state: { blog } });
    };

  
    return (
        <motion.div
            className="form-container"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className='flex justify-center items-center flex-col lg:px-0 md:mx-0 md:px-0 px-5 pl-20 py-20'>
                <div className="flex justify-between items-center w-full lg:px-32">
                    <button
                        onClick={handleAddBlog}
                        className="bg-pink-500 text-white font-semibold py-2 px-4 rounded shadow-md transition-all duration-300 ease-in-out transform hover:bg-blue-800 hover:shadow-lg hover:scale-105">
                        Add Blog
                    </button>
                </div>

                <div className='grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-4 justify-start lg:px-32'>
                    {Blogs.map((Blog) => {

                        return (
                            <div key={Blog._id} className='border p-4 rounded-md shadow-md my-4'>
                                
                                <h2 className='text-xl font-bold my-2'>{Blog.title}</h2>

                                {/* Display the blog image if available */}
                                {Blog.image && <img src={Blog.image} alt={Blog.title} className='w-full h-96 rounded-md mb-2 cursor-pointer'
                                    onClick={() => handleOnclick(Blog)}
                                />}
                                {Blog.video && (
                                    <video
                                        src={Blog.video}
                                        alt={Blog.title}
                                        className="w-full h-auto md:h-full object-cover rounded-xl cursor-pointer"
                                        controls
                                    />
                                )}

                                <div className='mt-2'>
                                    {/* Limit content to 4 lines with Show More option */}
                                    <div
                                        ref={el => contentRefs.current[Blog._id] = el} // Attach ref to content div
                                        className={`overflow-hidden line-clamp-4`}
                                        dangerouslySetInnerHTML={{ __html: Blog.content }}
                                    />
                                    
                                </div>

                                
                                <p className="text-gray-600 text-sm my-2">
                                    {formatDate(Blog.createdAt)} - {formatDate(Blog.updatedAt)}
                                </p>
                                
                            </div>
                        );
                    })}
                </div>
            </div>
            {showModal && (
                <div className="modal">
                    <UpdateBlog blog={selectedBlog} onClose={() => setShowModal(false)} />
                </div>
            )}
        </motion.div>
    );
};

export default Blog;
