import React from "react";
import { CircularProgress, Box } from "@mui/material";
import { useUserContext } from "../../context/useUserContext";
import { Navigate } from "react-router-dom";
import Header from "../shared/Header";

const PrivateRoute = ({ element: Element }) => {
  const { user, isLoading } = useUserContext();

  if (isLoading) {
    return (
      <Box
        position="fixed"
        top="0"
        left="0"
        width="100%"
        height="100%"
        zIndex="9999"
        bgcolor="rgba(255, 255, 255, 0.8)"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <CircularProgress size={60} color="primary" />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Header />
      <Element />
    </>
  );
};

export default PrivateRoute;
