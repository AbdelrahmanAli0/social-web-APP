import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Components/Layout/Layout";
import Home from "./Components/Home/Home";
import Register from "./Components/Register/Register";
import Login from "./Components/Login/Login";
import { HeroUIProvider } from "@heroui/react";
import AuthcontextProvider from "./Context/Authcontext";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import Profile from "./Components/Profile/Profile";
import ProtectedRegisterRoute from "./ProtectedRoute/ProtectedRegisterRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PostDetails from "./Components/PostDetails/PostDetails";
import { ToastContainer } from "react-toastify";

const router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "home",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "Profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "register",
        element: (
          <ProtectedRegisterRoute>
            <Register />
          </ProtectedRegisterRoute>
        ),
      },
      {
        path: "login",
        element: (
          <ProtectedRegisterRoute>
            <Login />
          </ProtectedRegisterRoute>
        ),
      },
      {
        path: "PostDetails/:id",
        element: (
          <ProtectedRoute>
            <PostDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "*",
        element: (
          <div className="bg-gray-600 h-screen flex justify-center items-center">
            <h1>NOT FOUND</h1>
            <h1>4 0 4</h1>
          </div>
        ),
      },
    ],
  },
]);

const QueryClientConfig = new QueryClient();
export default function App() {
  return (
    <>
      <QueryClientProvider client={QueryClientConfig}>
        <AuthcontextProvider>

          <HeroUIProvider>
            <RouterProvider router={router} />
            <ToastContainer />
          </HeroUIProvider>

        </AuthcontextProvider>
      </QueryClientProvider>
    </>
  );
}
