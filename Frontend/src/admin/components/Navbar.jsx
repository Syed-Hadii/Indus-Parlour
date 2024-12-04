import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom"; 
import { FaCog, FaUserCircle } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";

const Navbar = () => { 
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
      className={`navbar px-3 py-4 z-50 sticky top-0 transition-shadow duration-300 bg-[#2c3e50] text-[#067528] ${
        hasShadow ? " shadow-[ 0px 4px 8px rgba(0, 0, 0, 0.1)]" : ""
      }`}
    >
      <div className="container  flex justify-between items-center">
        <div className="search hidden md:flex border border-[#cfd1d0] focus-within:outline focus-within:outline-[#a8aaa8] focus-within:outline-1 rounded-md py ml-14">
          <button
            className="border-r-white bg-white rounded-l-md pl-2 pr-1.5 py-1 "
            disabled
          >
            <FiSearch className="w-[17px] h-[17px] text-[#808180]" />
          </button>
          <input
            type="text"
            placeholder="Search for ..."
            className="border-l-white bg-white text-[14px] outline-none rounded-r-md w-[275px] px-1 py-[7px]"
            disabled
          />
        </div>

        <div
          className="relative"
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={handleDelayedHide}
        >
          <NavLink className="nav-link">
            <FaUserCircle className="w-10 h-10 text-[#ecf0f1]" />
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
              <div className="flex flex-col items-start md:hidden">
                <NavLink className="nav-link w-full px-4 py-2 text-left text-sm text-[#067528] hover:bg-[#067528] hover:text-white">
                  <FaCog className="inline-block w-[17px] h-[17px] mr-2" />
                  Settings
                </NavLink>
              </div>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 bg-[#1abc9c] text-sm text-[#ffffff] hover:bg-[#16a085]  transition-all"
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
