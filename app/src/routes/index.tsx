import React from "react";
import { Route, Routes } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import PrivateRoutes from "./PrivateRoutes";


function AppRoutes() {
  return (
    <Routes>
        {PublicRoutes()}
        {PrivateRoutes()}

      {/* <Route element={<PrivateRoutes />}>
   
      </Route> */}

      {/* 404 fallback */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;