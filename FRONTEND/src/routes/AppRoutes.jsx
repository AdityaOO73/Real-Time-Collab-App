import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import MainLayout from "../layouts/MainLayout";

import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import Editor from "../pages/Editor";
import VersionControl from "../pages/VersionControl";
import PrivateRoute from "../components/PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Login /> },
      { path: "/signup", element: <Signup /> },

      {
        element: <MainLayout />,
        children: [
          {
            path: "/dashboard",
            element: (
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            ),
          },
          {
            path: "/editor/:id",
            element: (
              <PrivateRoute>
                <Editor />
              </PrivateRoute>
            ),
          },
          {
            path: "/versions/:id",
            element: (
              <PrivateRoute>
                <VersionControl />
              </PrivateRoute>
            ),
          },
        ],
      },
    ],
  },
]);

export default router;