"use client";
import React, { useEffect } from "react";
import { isAuthenticated, redirectToErrorPage } from "../authMiddleware";

export default async function Home() {
  useEffect(() => {
    if (!isAuthenticated()) {
      redirectToErrorPage();
    }
  }, []);

  return <div>Home</div>;
}
