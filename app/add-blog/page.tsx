"use client";
import React, { useEffect, useState } from "react";
import { isAuthenticated, redirectToErrorPage } from "../authMiddleware";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AddBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const router = useRouter();

  // add blog
  const onAddBlog = async () => {
    try {
      const token = localStorage?.getItem("token");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const userName = JSON.parse(localStorage.getItem("user")!);

      await axios
        .post(
          "http://localhost:5000/api/blogs",
          {
            title: title,
            content: content,
            author: userName.fullName,
          },
          { headers }
        )
        .then((res) => {
          toast.success("Blog Added Successfully");
          router.push("/home");
        });
    } catch (error: any) {
      toast.error("Cannot Add the Blog");
      console.log("Add blog failed", error.message);
    }
  };

  // disable button if fields are empty
  useEffect(() => {
    if (title.length > 0 && content.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [title, content]);

  useEffect(() => {
    if (!isAuthenticated()) {
      redirectToErrorPage();
    }
  });

  return (
    <div className="flex flex-col items-center mt-12 px-6 py-8 mx-auto w-full lg:w-4/5 lg:py-0">
      <div className="w-full sm:w-4/5 md:w-3/5 lg:w-2/3">
        <label
          htmlFor="small-input"
          className="block w-full mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Title
        </label>
        <input
          type="text"
          onChange={(e) => setTitle(e.target.value)}
          id="small-input"
          className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>

      <div className="w-full sm:w-4/5 md:w-3/5 lg:w-2/3 mt-4">
        <label
          htmlFor="small-input"
          className="block w-full mb-2 mt-4 text-sm font-medium text-gray-900 dark:text-white"
        >
          Content
        </label>
        <textarea
          id="small-input"
          rows={15}
          onChange={(e) => setContent(e.target.value)}
          style={{ resize: "none" }}
          className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>

      <div className="w-full sm:w-4/5 md:w-3/5 lg:w-2/3 mt-4">
        <button
          onClick={() => onAddBlog()}
          disabled={buttonDisabled}
          className="my-6 text-white bg-primary-600 hover:bg-primary-700 focus:ring-1 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-6 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:opacity-75 disabled:hover:bg-primary-600 "
        >
          Add Blog
        </button>
        <button
          onClick={() => router.push("/home")}
          className="mx-4 my-6 text-white bg-primary-600 hover:bg-primary-700 focus:ring-1 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:opacity-75 disabled:hover:bg-primary-600 "
        >
          Cancel
        </button>
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

export default AddBlog;
