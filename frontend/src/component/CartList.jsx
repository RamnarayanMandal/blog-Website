import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const CartList = () => {
    const [Blogs, setBlogs] = useState([]);
    const BASE_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate(); // Initialize navigate

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

    // Function to format the date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleOnClick = (blog) => {
        console.log(blog);
        navigate("/blog-details", { state: { blog } });
    };

    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 gap-4">
                {Blogs.length === 0 ? (
                    <div className="text-center col-span-full">Your cart is empty.</div>
                ) : (
                    Blogs.map((item) => (
                        <div 
                            key={item._id} 
                            className="border rounded-lg shadow-md p-4"
                            onClick={() => handleOnClick(item)} // Pass the correct item
                        >
                            {item.image && (
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-30 h-30 object-cover rounded-md mb-2"
                                />
                            )}
                            <h3 className="text-lg font-semibold">{item.title}</h3>
                            <div
                                className="mt-2 overflow-hidden line-clamp-2"
                                dangerouslySetInnerHTML={{ __html: item.content }}
                            />
                            <p className="text-gray-600 text-sm my-2">
                                {formatDate(item.createdAt)} - {formatDate(item.updatedAt)}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CartList;
