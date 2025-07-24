import React, { use } from "react";
import { useAuthStore } from "../store/useAuthStore";

const LogoutButton = ({ children }) => {
  const { logout } = useAuthStore();

  const onLogout = async () => {
    try {
      await logout();
      console.log("LOGGED OUT");
    } catch (error) {
      console.log("ERROR IN LOGOUT", error);
    }
  };
  return (
    <button className="btn btn-primary" onClick={onLogout}>
      {children}
    </button>
  );
};

export default LogoutButton;
