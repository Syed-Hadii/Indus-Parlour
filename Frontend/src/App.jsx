import React from "react";
import Login from "./Pages/Login";
import Admin from "./admin/pages/Admin"; 
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./Components/protectedRoute";

const RoutesWithLoading = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/admin/*" element={<ProtectedRoute element={<Admin />} />} />
      {/* <Route path="/admin/*" element={<Admin />} /> */}
    </Routes>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <RoutesWithLoading />
      {/* <Route path="/admin/*" element={(element = <Admin />)} /> */}
    </BrowserRouter>
  );
};

export default App;
