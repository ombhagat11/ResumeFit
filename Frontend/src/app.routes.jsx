import {createBrowserRouter} from "react-router-dom";
import Register from "./features/auth/pages/register";
import Login from "./features/auth/pages/login";
import Protected from "./features/auth/components/protected";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Protected><h1>Home Page</h1></Protected>
    },
    {
        path: "/login",
        element: <Login/>
    },
    {
        path: "/register", 
        element: <Register/>
    },
    {
        path: "/auth/register",
        element: <Register/>
    },
    {
        path: "/auth/login",
        element: <Login/>
    }
])