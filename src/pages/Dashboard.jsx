import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import userStore from "../store/userStore";

const Dashboard = () => {
  const { isLoggedIn } = userStore();
  const navigate = useNavigate();
  useEffect(() => {
    console.log({ isLoggedIn });
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, []);

  return <div>Dashboard</div>;
};

export default Dashboard;
