import React, { useState,useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { useDispatch } from "react-redux";
// import { setData } from "../../redux/slices/slice";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Dashboard from "./Dashboard";
// Product Dropdown Links
import Categories from "./Product/Categories";
import Brands from "./Product/Brands";
import Unit from "./Product/Unit";
import NewProduct from "./Product/NewProduct";
import Variation from "./Product/Variation";
// Service Dropdown Links
import NewService from "./Service/NewServices";
import ServiceCategory from "./Service/ServiceCategory";
// Other Links...
import Packages from "./Packages";
import Booking from "./Booking";
import RegularBooking from "./RegularBooking";
import Customers from "./Customers";
import Staff from "./Staff";
import Purchase from "./Purchase";
import Stock from "./Stock";
 import Expense from "./Expense";
// Course Management Dropdown Links
import Batch from "./CourseManagement/Batch";
import Course from "./CourseManagement/Course";
import Students from "./CourseManagement/Students";


const Admin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <div className="admin-container flex bg-white text-slate-600 min-h-screen">
      <Sidebar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className="main-content flex-1 transition-all duration-200 bg-[#fdfbf8]  text-slate-700">
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <hr className="border-gray-300" />
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Product Dropdown Links */}
          <Route path="/product_category" element={<Categories />} />
          <Route path="/brand" element={<Brands />} />
          <Route path="/product_unit" element={<Unit />} />
          <Route path="/new_product" element={<NewProduct />} />
          <Route path="/variation" element={<Variation />} />
          {/* Service Dropdown Links */}
          <Route path="/service_category" element={<ServiceCategory />} />
          <Route path="/new_service" element={<NewService />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/regular_booking" element={<RegularBooking />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/purchase" element={<Purchase />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/all_expense" element={<Expense />} />
          {/* Course management Dropdown Links */}
          <Route path="/batch" element={<Batch />} />
          <Route path="/course" element={<Course />} />
          <Route path="/students" element={<Students />} />
        </Routes>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Admin;
