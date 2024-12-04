import React from "react";
import "./Loading.css";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
      <div className="loading-container">
        <h1 className="loading-text mb-4">Indus Parlour</h1>
        {/* <div className="loading-spinner"></div> */}
        <div className="loading-message text-gray-600 mt-4">
          Loading amazing experiences...
        </div>
        <div className="loading-dots">
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </div>
      </div>
    </div>
  );
};

export default Loading;
