import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom"; 
import { FaCog,FaBars, FaTimes ,FaUserCircle } from "react-icons/fa"; 
import { FiArrowLeftCircle } from "react-icons/fi";
const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const userName = "Admin";
  const navigate = useNavigate();

  const [hasShadow, setHasShadow] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hideDropdownTimeout, setHideDropdownTimeout] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setHasShadow(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setShowDropdown(false);
    navigate("/");
  };

  const handleDelayedHide = () => {
    const timeout = setTimeout(() => setShowDropdown(false), 300);
    setHideDropdownTimeout(timeout);
  };

  const handleCancelHide = () => {
    if (hideDropdownTimeout) {
      clearTimeout(hideDropdownTimeout);
    }
    setHideDropdownTimeout(null);
    setShowDropdown(true);
  };

  return (
    <div
      className={`navbar px-4 md:px-12 py-4 md:z-50 md:sticky md:top-0 transition-shadow duration-300 bg-[#cc9f64] ${
        hasShadow ? " shadow-[ 0px 4px 8px rgba(0, 0, 0, 0.1)]" : ""
      }`}
    >
      <div className="container  flex justify-between items-center  ">
        {/* Sidebar Toggle Button */}

        <button
          onClick={toggleSidebar}
          className="text-2xl text-[#ecf0f1] md: focus:outline-none "
        >
          {isSidebarOpen ? (
            <FiArrowLeftCircle className="text-3xl cursor-pointer hover:text-[#976f3b]" />
          ) : (
            <FaBars className="text-3xl cursor-pointer hover:text-[#976f3b]" />
          )}
        </button>
        <div
          className="relative"
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={handleDelayedHide}
        >
          <NavLink className="nav-link">
            <FaUserCircle className="w-10 h-10 text-white hover:text-[#976f3b] hover:bg-white rounded-full " />
          </NavLink>

          {showDropdown && (
            <div
              className="absolute right-0 mt-2 w-48 bg-[#ecf0f1] border  rounded-lg shadow-lg py-2 z-50"
              onMouseEnter={handleCancelHide}
              onMouseLeave={handleDelayedHide}
            >
              <p className="px-4 py-2 text-sm text-[#2c3e50] border-b">
                {userName}
              </p>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 bg-[#cc9f64] text-sm text-[#ffffff] hover:bg-[#b88542]  transition-all"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
