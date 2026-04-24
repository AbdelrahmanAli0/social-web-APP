import React, { useEffect } from "react";
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
import { toast, ToastContainer, Zoom } from "react-toastify";
import EditPostContextProvider from "./Context/EditPostContext";
import UserDataContextProvider from "./Context/UserDataContext";

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
  useEffect(() => {
    const handleOffline = () => {
      toast.warning(" No Internet Connection", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Zoom,
      });
    };

    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
  useEffect(() => {
    const handleOnline = () => {
      toast.success(" Back online!", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Zoom,
      });
    };

    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return (
    <>

        <QueryClientProvider client={QueryClientConfig}>

    <UserDataContextProvider>
      <EditPostContextProvider>
          <AuthcontextProvider>
            <HeroUIProvider>
              <RouterProvider router={router} />
              <ToastContainer />
            </HeroUIProvider>
          </AuthcontextProvider>
      </EditPostContextProvider>
      </UserDataContextProvider>
      
        </QueryClientProvider>

    </>
  );
}
