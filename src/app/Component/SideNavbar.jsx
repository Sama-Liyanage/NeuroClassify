"use client";

import { useRouter } from "next/navigation";
import PropTypes from "prop-types";
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiDashboardLine,
  RiFileListLine,
  RiUserHeartLine,
  RiSettings3Line,
} from "react-icons/ri";
import { MdOutlineLogout } from "react-icons/md";
import { AiOutlineCloudUpload } from "react-icons/ai";
import profile from "../../../public/assets/images/profile.png"
import Image from "next/image";


const SideNavbar = ({ isExpanded, setIsExpanded }) => {
  const toggleSidebar = () => setIsExpanded(!isExpanded);
  const router = useRouter();

  const menuItems = [
    { label: "Dashboard", icon: RiDashboardLine, path: "/Dashboard" },
    { label: "Patients", icon: RiUserHeartLine, path: "/Patients" },
    { label: "MRI Uploads", icon: AiOutlineCloudUpload, path: "/Uploads" },
    { label: "Reports", icon: RiFileListLine, path: "/Reports" },
    // { label: "Consultation", icon: RiUserHeartLine, path: "/consultation" },
    { label: "Settings", icon: RiSettings3Line, path: "/Settings" },
  ];

  const logout = () => {
    router.push("/login");
  };

  return (
    <div
      className={`fixed top-0 h-screen bg-white z-20 transition-all duration-300 ${
        isExpanded ? "w-60" : "w-16"
      }`}
    >
      <div className="flex flex-col justify-between h-full p-4">
        {/* Top Section */}
        <div>
          {/* Collapse/Expand Button */}
          <div
            className="flex items-center justify-end mb-6 cursor-pointer text-black"
            onClick={toggleSidebar}
          >
            {isExpanded ? (
              <RiArrowLeftSLine className="text-2xl" />
            ) : (
              <RiArrowRightSLine className="text-2xl" />
            )}
          </div>

          {/* Profile Section */}
          <div className="flex items-center gap-3 mb-6">
            <Image
              src={profile} 
              alt="Profile"
              width="50"
              height="50"
              className="w-8 h-8 rounded-full border border-gray-300"
            />
            {isExpanded && (
              <div>
                <h3 className="text-sm font-semibold">Dr. Sarah Wilson</h3>
                <p className="text-xs text-gray-500">Medical AI Specialist</p>
              </div>
            )}
          </div>

          {/* Menu Items */}
          <div className="my-5 border-b border-gray-100 pb-3 space-y-7 ">
            {menuItems.map((item) => (
              <div
                key={item.label}
                onClick={() => router.push(item.path)}
                className="flex items-center gap-3 p-2 hover:bg-purple-500 rounded-md group cursor-pointer hover:shadow-lg"
              >
                <item.icon className="text-lg text-black group-hover:text-white" />
                {isExpanded && (
                  <h3 className="text-xs sm:text-sm text-black group-hover:text-white font-semibold">
                    {item.label}
                  </h3>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="my-5">
          <div
            onClick={logout}
            className="flex items-center justify-center gap-3 p-2 border border-gray-700 hover:bg-purple-500 hover:border-purple-500 rounded-md group cursor-pointer hover:shadow-lg"
          >
            <MdOutlineLogout className="text-lg text-black group-hover:text-white" />
            {isExpanded && (
              <h3 className="text-sm text-black group-hover:text-white font-semibold">
                Logout
              </h3>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

SideNavbar.propTypes = {
  isExpanded: PropTypes.bool.isRequired,
  setIsExpanded: PropTypes.func.isRequired,
};

export default SideNavbar;
