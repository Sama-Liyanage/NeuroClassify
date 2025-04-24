import React from "react";

const TopNav = ({ isExpanded }) => {
  return (
    <div
      className={`flex-grow bg-white p-4 transition-all duration-300 ${
        isExpanded ? "ml-60" : "ml-16"
      }`}
    >
      <h1 className="text-xl font-bold"></h1>
    </div>
  );
};

export default TopNav;
