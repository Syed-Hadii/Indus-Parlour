import React from "react";
import { FaPhone, FaDochub } from "react-icons/fa";

const Dashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-xl text-[#2c3e50] font-semibold">Dashboard</h1>
      <div className=" w-[65%] h-40 flex justify-between items-center">
        <div className="border-white bg-white rounded-md w-[48%] h-28 flex items-center justify-between px-4">
          <div className="border-[#9784c7] bg-[#d7cef0] border-2 w-[70px] h-[70px] rounded-full  flex items-center justify-center ">
            <FaPhone className="text-[#8573b4]" />
          </div>
          <div className="flex flex-col text-right text-sm text-gray-500 ">
            <span className="font-semibold text-[#2c3e30] text-2xl">0</span>
            <span>Total Contacts</span>
          </div>
        </div>
        <div className="border-white bg-white rounded-md w-[48%] h-28 flex items-center justify-between px-4">
          <div className="border-blue-500 bg-blue-200 border-2 w-[70px] h-[70px] rounded-full  flex items-center justify-center">
            <FaDochub className="text-blue-500"/>
          </div>
          <div className="flex flex-col text-right text-sm text-gray-500 ">
            <span className="font-semibold text-[#2c3e30] text-2xl">0</span>
            <span>Total CVs Submited</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
