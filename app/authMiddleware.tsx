import { redirect } from "next/navigation";

export const isAuthenticated = () => {
  if (typeof window !== "undefined") {
    return !!window.localStorage.getItem("token");
  }
  return false;
};

export const redirectToErrorPage = () => {
  if (typeof window !== "undefined") {
    redirect("/unauthenticated");
  }
};
