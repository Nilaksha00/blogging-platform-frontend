"use client";
import React, { useEffect, useState } from "react";
import { isAuthenticated, redirectToErrorPage } from "../authMiddleware";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const router = useRouter();

  const [blogs, setBlogs] = useState([]);

  // get token and user details from localstorage
  const token = localStorage?.getItem("token");
  const user = JSON.parse(localStorage?.getItem("user"));
  const userName = user?.fullName;

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  // authorization and get blogs
  useEffect(() => {
    if (!isAuthenticated()) {
      redirectToErrorPage();
    }

    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/blogs", {
          headers,
        });
        setBlogs(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  // delete blog
  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/blogs/${id}`, {
      headers,
    });
    const newBlogs = blogs.filter((blog) => blog._id !== id);
    setBlogs(newBlogs);
    toast.success("Blog deleted successfully");
  };

  // navigate to add blog page
  const handleAddBlogButton = () => {
    router.push("/add-blog");
  };

  // navigate to edit blog page
  const handleEditBlogButton = (id) => {
    router.push(`/update-blog/?id=${id}`);
  };

// delete blog
  const handleViewBlogButton = (id) => {
    router.push(`/view-blog/?id=${id}`);
  };

  return (
    <div>
      <button
        onClick={handleAddBlogButton}
        className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-1 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 my-4 mx-2 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:opacity-75 disabled:hover:bg-primary-600"
      >
        Add a New Blog
      </button>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-4 py-2">
                Title
              </th>
              <th scope="col" className="px-4 py-2">
                Author
              </th>
              <th
                scope="col"
                className="px-4 py-2 xs: hidden sm:hidden md:table-cell"
              >
                Summary
              </th>
              <th scope="col" className="px-4 py-2">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr
                key={blog._id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <th
                  scope="row"
                  className="px-4 py-3 font-medium text-gray-900 dark:text-white"
                >
                  {blog.title}
                </th>
                <td className="px-4 py-3">{blog.author}</td>
                <td className="px-4 py-3 truncate max-w-xs xs: hidden sm:hidden md:table-cell">
                  {blog.content}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleViewBlogButton(blog._id)}
                    className="my-1 text-white bg-primary-600 hover:bg-primary-700 focus:ring-1 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-xs px-3 py-1 mx-2 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:opacity-75 disabled:hover:bg-primary-600"
                  >
                    View
                  </button>
                  {userName == blog.author && (
                    <>
                      <button
                        onClick={() => handleEditBlogButton(blog._id)}
                        className="my-1 text-white bg-primary-600 hover:bg-primary-700 focus:ring-1 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-xs px-3 py-1 mx-2 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:opacity-75 disabled:hover:bg-primary-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(blog._id)}
                        className="my-1 text-white bg-primary-600 hover:bg-primary-700 focus:ring-1 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-xs px-3 py-1 mx-1 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:opacity-75 disabled:hover:bg-primary-600"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover={false}
        theme="dark"
      />
    </div>
  );
}
