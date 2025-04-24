"use client";

import React, { useState } from "react";
import SideNavbar from "../Component/SideNavbar";
import TopNav from "../Component/TopNav";

function Settings() {
  const [isExpanded, setIsExpanded] = useState(true);

  const [profile, setProfile] = useState({
    name: "Dr. Samantha Adams",
    email: "samantha@dreamclinic.com",
    specialty: "Neurosurgeon",
    contact: "+1 555-123-4567",
    profilePicture: "/default-doctor.png",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    alert("Profile saved successfully!");
  };

  const handlePasswordUpdate = () => {
    if (passwords.new !== passwords.confirm) {
      alert("New passwords do not match.");
      return;
    }
    alert("Password updated successfully!");
  };

  return (
    <>
      <SideNavbar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      <TopNav isExpanded={isExpanded} />

      <div
        className={`transition-all duration-300 bg-gray-50 min-h-screen p-8 ${
          isExpanded ? "ml-60 w-[calc(100%-15rem)]" : "ml-16 w-[calc(100%-4rem)]"
        }`}
      >
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800">Doctor Settings</h1>
            <p className="text-gray-500 mt-1">Manage your personal and login information</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center text-center">
              <img
                src={profile.profilePicture}
                alt="Doctor"
                className="w-32 h-32 rounded-full border-4 border-blue-400 object-cover mb-4"
              />
              <h2 className="text-xl font-semibold text-gray-800">{profile.name}</h2>
              <p className="text-sm text-gray-500 mb-1">{profile.specialty}</p>
              <p className="text-sm text-gray-500">{profile.email}</p>
              <p className="text-sm text-gray-500">{profile.contact}</p>
            </div>

            {/* Edit Profile Form */}
            <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Edit Profile</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                    className="w-full mt-1 border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    className="w-full mt-1 border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Specialty</label>
                  <input
                    type="text"
                    name="specialty"
                    value={profile.specialty}
                    onChange={handleProfileChange}
                    className="w-full mt-1 border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Contact</label>
                  <input
                    type="text"
                    name="contact"
                    value={profile.contact}
                    onChange={handleProfileChange}
                    className="w-full mt-1 border border-gray-300 rounded-md p-2"
                  />
                </div>
              </div>
              <div className="text-right">
                <button
                  onClick={handleSaveProfile}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Profile
                </button>
              </div>
            </div>
          </div>

          {/* Password Change Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Change Password</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Current Password</label>
                <input
                  type="password"
                  name="current"
                  value={passwords.current}
                  onChange={handlePasswordChange}
                  className="w-full mt-1 border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">New Password</label>
                <input
                  type="password"
                  name="new"
                  value={passwords.new}
                  onChange={handlePasswordChange}
                  className="w-full mt-1 border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm text-gray-600">Confirm Password</label>
                <input
                  type="password"
                  name="confirm"
                  value={passwords.confirm}
                  onChange={handlePasswordChange}
                  className="w-full mt-1 border border-gray-300 rounded-md p-2"
                />
              </div>
            </div>
            <div className="text-right mt-4">
              <button
                onClick={handlePasswordUpdate}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Settings;
