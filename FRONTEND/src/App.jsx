import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { authSuccess } from "./redux/slices/authSlice";

function App() {
  const dispatch = useDispatch();

  // 🔥 persist login on refresh
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // future: fetch user from backend
const user = JSON.parse(localStorage.getItem("user"));

      dispatch(authSuccess({ user, token }));
    }
  }, [dispatch]);

  return <Outlet />;
}

export default App;