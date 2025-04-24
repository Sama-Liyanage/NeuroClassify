"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import google from "../../../public/assets/images/google.png";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleLogin = async () => {
    setError(""); // Clear previous errors
    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("userEmail", email);

      router.push("/Dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="flex w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Left Side - Gradient Background & Text */}
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 text-center bg-gradient-to-br from-white via-purple-300 to-blue-400">
          <h1 className="text-3xl font-bold">
            AI-Powered Brain Tumor <span className="text-black">Classification.</span>
          </h1>
          <p className="mt-2 text-sm opacity-80">
            Enhancing diagnosis with advanced MRI analysis for accurate and efficient tumor classification.
          </p>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 p-10 bg-white flex flex-col justify-center">
          <div className="flex flex-col items-center mb-6">
            <p className="text-sm text-gray-500">
              Enter the information you entered while registering.
            </p>
          </div>

          {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex justify-between items-center text-sm mb-4">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Remember me
            </label>
            <a href="#" className="text-blue-600 hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg hover:opacity-90"
          >
            Login
          </button>

          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="px-2 text-gray-500 text-sm">or</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <button className="w-full flex items-center justify-center gap-2 py-3 px-4 border rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50">
            <Image src={google} alt="Google" width={20} height={20} />
            Sign in with Google
          </button>

          <p className="mt-4 text-center text-gray-500 text-sm">
            Are you new?{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Create an Account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
