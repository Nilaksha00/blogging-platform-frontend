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

  const token = localStorage?.getItem("token");
  const user = JSON.parse(localStorage?.getItem("user"));
  const userName = user?.fullName;

  const headers = {
    Authorization: `Bearer ${token}`,
  };

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

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/blogs/${id}`, {
      headers,
    });
    const newBlogs = blogs.filter((blog) => blog._id !== id);
    setBlogs(newBlogs);
    toast.success("Blog deleted successfully");
  };

  const handleAddBlogButton = () => {
    router.push("/add-blog");
  };

  const handleEditBlogButton = (id) => {
    router.push(`/update-blog/?id=${id}`);
  };

  const handleViewBlogButton = (id) => {
    router.push(`/view-blog/?id=${id}`);
  };

  return (
    <div>
      <button
        onClick={handleAddBlogButton}
        className=" text-white  bg-primary-600 hover:bg-primary-700 focus:ring-1 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-8 py-2 my-6 mx-3 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:opacity-75 disabled:hover:bg-primary-600 "
      >
        Add a New Blog
      </button>
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Title
              </th>
              <th scope="col" className="px-6 py-3">
                Author
              </th>
              <th scope="col" className="px-6 py-3">
                Summary
              </th>
              <th scope="col" className="px-6 py-3">
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
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {blog.title}
                </th>
                <td className="px-6 py-4">{blog.author}</td>
                <td className="px-6 py-4 w-1/3 max-w-xs truncate">
                  {blog.content}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleViewBlogButton(blog._id)}
                    className=" text-white  bg-primary-600 hover:bg-primary-700 focus:ring-1 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-xs px-4 py-1 mx-2 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:opacity-75 disabled:hover:bg-primary-600 "
                  >
                    View
                  </button>
                  {userName == blog.author ? (
                    <>
                      <button
                        onClick={() => handleEditBlogButton(blog._id)}
                        className=" text-white  bg-primary-600 hover:bg-primary-700 focus:ring-1 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-xs px-4 py-1 mx-2 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:opacity-75 disabled:hover:bg-primary-600 "
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(blog._id)}
                        className=" text-white  bg-primary-600 hover:bg-primary-700 focus:ring-1 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-xs px-4 py-1 mx-1 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:opacity-75 disabled:hover:bg-primary-600 "
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    ""
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
