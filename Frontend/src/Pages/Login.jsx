import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "../Components/Loading"; // Your Loading component

const Login = () => {
  const url = "http://localhost:3003";
  const [inputValue, setInputValue] = useState(""); // Combines email/username into one field
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State for loading

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading
    setError(""); // Clear previous errors

    console.log("Form Submitted");
    console.log("Input:", inputValue);
    console.log("Password:", password);

    // Check if the input is an email
    const isEmail = /\S+@\S+\.\S+/.test(inputValue);

    try {
      // Send inputValue as email or username based on validation
      const response = await axios.post(`${url}/user/login`, {
        email: isEmail ? inputValue : undefined,
        userName: isEmail ? undefined : inputValue,
        password,
      });

      console.log("Response Data:", response.data);

      if (response.data.token) {
        console.log("Token:", response.data.token);

        localStorage.setItem("token", response.data.token);
        setTimeout(() => {
          setIsLoading(false); // Stop loading
          navigate("/admin/dashboard");
        }, 1500);
      } else {
        setError("Invalid email/username or password");
        setIsLoading(false); // Stop loading if login fails
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("Error logging in");
      setIsLoading(false); // Stop loading if an error occurs
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* Loading overlay (only shows when isLoading is true) */}
      {isLoading && <Loading />}

      <div className="flex items-center justify-center min-h-screen">
        <div className="relative w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <h2 className="text-2xl font-bold text-center">Login</h2>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Email/Username
              </label>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter your email or username"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <button className="w-full px-4 py-2 text-white bg-indigo-500 rounded-md hover:bg-indigo-600 transition duration-200">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
