"use client";

import React, { useState } from "react";
import SideNavbar from "../Component/SideNavbar";
import TopNav from "../Component/TopNav";
import Card from "../Component/Card";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from "chart.js";


ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

function Dashboard() {
  const [isExpanded, setIsExpanded] = useState(true);

  // Pie chart data for Risk Assessment (Meningioma, Glioma, Pituitary Tumor distribution)
  const pieChartData = {
    labels: ["Meningioma", "Glioma", "Pituitary Tumor"],
    datasets: [
      {
        data: [40, 35, 25],
        backgroundColor: ["#3B82F6", "#8B5CF6", "#10B981"],
        hoverBackgroundColor: ["#2563EB", "#6D28D9", "#059669"],
      },
    ],
  };

  return (
    <>
      <SideNavbar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      <TopNav isExpanded={isExpanded} />
      <div
        className={`transition-all duration-300 p-6 bg-white h-screen ${isExpanded ? "ml-60 w-[calc(100%-15rem)]" : "ml-16 w-[calc(100%-4rem)]"}`}
      >
        <h1 className="text-3xl font-semibold mb-4 text-gray-800">Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[{ title: "Total Patients", value: "2,847", subtitle: "↑ 12% increase", color: "blue" },
            { title: "Pending Analysis", value: "156", subtitle: "24 urgent cases", color: "orange" },
            { title: "Completed Scans", value: "1,934", subtitle: "↑ 8% increase", color: "green" },
            { title: "Success Rate", value: "94.3%", subtitle: "↑ 2.1%", color: "purple" }]
            .map((item, index) => (
              <Card key={index} title={item.title} value={item.value} subtitle={item.subtitle} color={item.color} />
            ))}
        </div>

        {/* Risk Assessment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 shadow-xl rounded-lg transition-transform transform hover:scale-105 hover:shadow-2xl">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Tumor Type Distribution</h2>
            <div className="flex items-center justify-center">
              <div className="w-64 h-64">
                <Pie
                  data={pieChartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: "top",
                        labels: {
                          boxWidth: 12,
                          padding: 15,
                          font: {
                            size: 14,
                          },
                        },
                      },
                      tooltip: {
                        backgroundColor: "#fff",
                        titleColor: "#333",
                        bodyColor: "#333",
                        borderColor: "#ddd",
                        borderWidth: 1,
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>

          {/* High-Risk Patients */}
          <div className="bg-white p-6 shadow-xl rounded-lg transition-transform transform hover:scale-105 hover:shadow-2xl">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">High-Risk Patients</h2>
            <div className="space-y-4">
              {[ 
                { name: "Sarah Johnson", risk: "94%", label: "Urgent", color: "red" },
                { name: "Michael Chen", risk: "87%", label: "High", color: "yellow" },
                { name: "Emily White", risk: "82%", label: "Medium", color: "green" },
              ].map((patient, index) => (
                <div key={index} className={`p-3 rounded-lg flex justify-between items-center bg-${patient.color}-100 transition-transform transform hover:scale-105`}>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                    <div>
                      <p className="font-medium text-gray-800">{patient.name}</p>
                      <p className="text-sm text-gray-500">Risk Score: {patient.risk}</p>
                    </div>
                  </div>
                  <span className={`text-sm px-3 py-1 rounded-full bg-${patient.color}-500 text-white`}>{patient.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
