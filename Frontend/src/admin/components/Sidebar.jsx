import  { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaDesktop,
  FaUser,
  FaBox, 
  FaChartLine, 
  FaConciergeBell,
  FaCalendarCheck,
  FaBoxes, 
  FaAngleLeft,
  FaAngleRight,
  FaRegChartBar,
  FaChalkboardTeacher,
  FaBriefcase,
  FaShoppingBag,
  FaMoneyBillWave,
} from "react-icons/fa";

const Sidebar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const linkClasses = ({ isActive }) => {
    return `flex items-center gap-2 h-10 px-2 rounded-md cursor-pointer transition-all duration-200 ${
      isActive
        ? "bg-[#d5dbdb] text-[#1abc9c]"
        : "text-[#2c3e50] hover:bg-[#d5dbdb] hover:text-black"
    }`;
  };

  const handleDropdownToggle = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div
      className={`flex ${
        isSidebarOpen ? "md:w-[20%]" : "w-[60px]"
      } transition-width duration-300`}
    >
      <div className="sidebar flex flex-col gap-3 w-[100%] md:w-[100%] pt-4 px-1 md:px-4 border border-t-0 border-l-0  bg-[#dee4e6] text-[#2c3e50  ] min-h-screen font-semibold relative">
        {/* Toggle Button */}
        <button
          className="absolute top-6 right-4 text-2xl focus:outline-none"
          onClick={handleSidebarToggle}
        >
          {isSidebarOpen ? <FaAngleLeft /> : <FaAngleRight />}
        </button>

        {/* Logo */}
        <div
          className={`logo text-[#1abc9c]  mb-3 text-2xl ${
            !isSidebarOpen ? "hidden" : ""
          }`}
        >
          <NavLink className="ml-4" to="/admin">
            Indus Parlour
          </NavLink>
        </div>
        <p className={`text-xs text-[#2c3e50]  ${!isSidebarOpen && "hidden"}`}>
          Navigations
        </p>
        <div
          className={`flex flex-col -mt-1 gap-2 text-xs tracking-wider px-1.5 ${
            !isSidebarOpen && "hidden"
          }`}
        >
          {/* Dashboard */}
          <NavLink className={linkClasses} to="dashboard">
            {({ isActive }) => (
              <>
                <FaDesktop
                  className={`w-4 h-4 text-[#2c3e50] ${
                    isActive ? "animate-pulse" : ""
                  } group-hover:text-[#d5dbdb] transition-colors duration-300`}
                />
                <span className=" text-sm">Dashboards</span>
              </>
            )}
          </NavLink>
          {/* Products Dropdown */}
          <div className="relative">
            <div
              className={linkClasses({ isActive: false })}
              onClick={() => handleDropdownToggle("haari")}
            >
              <div className="flex items-center justify-between w-full cursor-pointer">
                <div className="flex items-center gap-1.5  ">
                  <FaBox className="text-[#2c3e50] w-4 h-4" />
                  <span className="text-sm">Products</span>
                </div>
                <span
                  className={`transition-transform ml-1   duration-300 ${
                    openDropdown === "haari" ? "rotate-180" : "rotate-0"
                  }`}
                >
                  ▼
                </span>
              </div>
            </div>
            {isSidebarOpen && (
              <div
                className={`flex flex-col ml-6 text-center mt-1 gap-1 overflow-hidden transition-max-height duration-300 ease-in-out ${
                  openDropdown === "haari" ? "max-h-44" : "max-h-0"
                }`}
              >
                <NavLink className={linkClasses} to="product_category">
                  <span className=" md:text-xs">Categories</span>
                </NavLink>
                <NavLink className={linkClasses} to="brand">
                  <span className=" md:text-xs">Brands </span>
                </NavLink>
                <NavLink className={linkClasses} to="product_unit">
                  <span className=" md:text-xs"> Units</span>
                </NavLink>
                <NavLink className={linkClasses} to="new_product">
                  <span className=" md:text-xs">New Products </span>
                </NavLink>
                <NavLink className={linkClasses} to="variation">
                  <span className=" md:text-xs"> Variation</span>
                </NavLink>
              </div>
            )}
          </div>
          {/* Services */}
          <div className="relative">
            <div
              className={linkClasses({ isActive: false })}
              onClick={() => handleDropdownToggle("account")}
            >
              <div className="flex items-center justify-between w-full cursor-pointer">
                <div className="flex items-center gap-2  ">
                  <FaConciergeBell className="text-[#2c3e50] w-4 h-4" />
                  <span className=" text-sm">Services</span>
                </div>
                <span
                  className={`transition-transform ml-1 duration-300 ${
                    openDropdown === "haari" ? "rotate-180" : "rotate-0"
                  }`}
                >
                  ▼
                </span>
              </div>
            </div>
            {isSidebarOpen && (
              <div
                className={`flex flex-col ml-6 text-center mt-1 gap-1 overflow-hidden transition-max-height duration-300 ease-in-out ${
                  openDropdown === "account" ? "max-h-40" : "max-h-0"
                }`}
              >
                <NavLink className={linkClasses} to="service_category">
                  <span className=" md:text-xs">Service Category</span>
                </NavLink>
                <NavLink className={linkClasses} to="new_service">
                  <span className=" md:text-xs">New Services</span>
                </NavLink>
              </div>
            )}
          </div>
          {/* Packages */}
          <NavLink className={linkClasses} to="packages">
            {({ isActive }) => (
              <>
                <FaBoxes
                  className={`text-[#2c3e50] w-4 h-4 ${
                    isActive ? "animate-pulse" : ""
                  }`}
                />
                <span className="text-sm">Packages</span>
              </>
            )}
          </NavLink>

          {/* Booking */}
          <NavLink className={linkClasses} to="booking">
            {({ isActive }) => (
              <>
                <FaCalendarCheck
                  className={`text-[#2c3e50] w-4 h-4 ${
                    isActive ? "animate-pulse" : ""
                  }`}
                />
                <span className="text-sm ">Booking</span>
              </>
            )}
          </NavLink>

          {/* Regular Sales */}
          <NavLink className={linkClasses} to="regular_booking">
            {({ isActive }) => (
              <>
                <FaChartLine
                  className={`text-[#2c3e50] w-4 h-4 ${
                    isActive ? "animate-pulse" : ""
                  }`}
                />
                <span className=" text-sm   ">Regular Bookings</span>
              </>
            )}
          </NavLink>

          {/* Customers */}
          <NavLink className={linkClasses} to="customers">
            {({ isActive }) => (
              <>
                <FaUser
                  className={`text-[#2c3e50] w-4 h-4 ${
                    isActive ? "animate-pulse" : ""
                  }`}
                />
                <span className=" text-sm">Customers</span>
              </>
            )}
          </NavLink>

          {/* Staff */}
          <NavLink className={linkClasses} to="staff">
            {({ isActive }) => (
              <>
                <FaBriefcase
                  className={`text-[#2c3e50] w-4 h-4 ${
                    isActive ? "animate-pulse" : ""
                  }`}
                />
                <span className="  text-sm  ">Staff</span>
              </>
            )}
          </NavLink>

          {/* Purhchase */}
          <NavLink className={linkClasses} to="purchase">
            {({ isActive }) => (
              <>
                <FaShoppingBag
                  className={`text-[#2c3e50] w-4 h-4 ${
                    isActive ? "animate-pulse" : ""
                  }`}
                />
                <span className="  text-sm">Purchase</span>
              </>
            )}
          </NavLink>
          {/* Stock */}
          <NavLink className={linkClasses} to="stock">
            {({ isActive }) => (
              <>
                <FaBoxes
                  className={`text-[#2c3e50] w-4 h-4 ${
                    isActive ? "animate-pulse" : ""
                  }`}
                />
                <span className="  text-sm">Stock</span>
              </>
            )}
          </NavLink>
          {/* Expense */}
          <NavLink className={linkClasses} to="all_expense">
            {({ isActive }) => (
              <>
                <FaMoneyBillWave
                  className={`text-[#2c3e50] w-4 h-4 ${
                    isActive ? "animate-pulse" : ""
                  }`}
                />
                <span className="  text-sm">Expense</span>
              </>
            )}
          </NavLink>

          {/* Report (Dropdown) */}
          <div className="relative">
            <div
              className={linkClasses({ isActive: false })}
              onClick={() => handleDropdownToggle("stock")}
            >
              <div className="flex items-center justify-between w-full cursor-pointer transition-all">
                <div className="flex items-center gap-2  ">
                  <FaRegChartBar className="text-[#2c3e50] w-4 h-4" />
                  <span className=" text-sm text-red-600">Reports</span>
                </div>
                <span
                  className={`transition-transform ml-1  duration-300 ${
                    openDropdown === "stock" ? "rotate-180" : "rotate-0"
                  }`}
                >
                  ▼
                </span>
              </div>
            </div>
            {isSidebarOpen && (
              <div
                className={`flex flex-col ml-6 text-center mt-1 gap-1 overflow-hidden transition-max-height duration-300 ease-in-out ${
                  openDropdown === "stock" ? "max-h-96" : "max-h-0"
                }`}
              >
                <NavLink className={linkClasses} to="purchase_report">
                  <span className=" text-xs">Purchase</span>
                </NavLink>
                <NavLink className={linkClasses} to="all_reports">
                  <span className=" text-xs">All Report</span>
                </NavLink>
                <NavLink className={linkClasses} to="booking_report">
                  <span className=" text-xs">Booking Report</span>
                </NavLink>
                <NavLink className={linkClasses} to="sales_report">
                  <span className=" text-xs">Sales Report</span>
                </NavLink>
                <NavLink className={linkClasses} to="consumption_report">
                  <span className=" text-xs">Consumption Report </span>
                </NavLink>
                <NavLink className={linkClasses} to="service_report">
                  <span className=" text-xs">Service Report</span>
                </NavLink>
                <NavLink className={linkClasses} to="client_report">
                  <span className=" text-xs">Client Service</span>
                </NavLink>
                <NavLink className={linkClasses} to="staff_report">
                  <span className=" text-xs">Staff Report</span>
                </NavLink>
                <NavLink className={linkClasses} to="expense_report">
                  <span className=" text-xs">Expense Report</span>
                </NavLink>
              </div>
            )}
          </div>
          {/* Course Management */}
          <div className="relative">
            <div
              className={linkClasses({ isActive: false })}
              onClick={() => handleDropdownToggle("vouchers")}
            >
              <div className="flex items-center justify-between w-full cursor-pointer transition-all">
                <div className="flex items-center gap-1  ">
                  <FaChalkboardTeacher className="text-[#2c3e50] w-4 h-4" />
                  <span className=" text-sm">Course Management</span>
                </div>
                <span
                  className={`transition-transform ml-1   duration-300 ${
                    openDropdown === "vouchers" ? "rotate-180" : "rotate-0"
                  }`}
                >
                  ▼
                </span>
              </div>
            </div>
            {isSidebarOpen && (
              <div
                className={`flex flex-col ml-6 mt-1 gap-1 text-center overflow-hidden transition-max-height duration-300 ease-in-out ${
                  openDropdown === "vouchers" ? "max-h-40" : "max-h-0"
                }`}
              >
                <NavLink className={linkClasses} to="batch">
                  <span className=" text-xs">Batch</span>
                </NavLink>
                <NavLink className={linkClasses} to="course">
                  <span className=" text-xs">Course </span>
                </NavLink>
                <NavLink className={linkClasses} to="students">
                  <span className=" text-xs"> Students</span>
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
