"use client";

import React, { useEffect, useState } from "react";
import SideNavbar from "../Component/SideNavbar";
import TopNav from "../Component/TopNav";
import jsPDF from "jspdf";

function Reports() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [reports, setReports] = useState([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch(`${apiUrl}/reports`);
        const data = await res.json();
        setReports(data);
        console.log("Fetched reports:", data);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      }
    };

    fetchReports();
  }, []);

  const handleDownload = (report) => {
    const pdf = new jsPDF();
    pdf.setFontSize(16);
    pdf.text("Patient Report", 20, 20);
    pdf.setFontSize(12);

    // Helper function to handle page breaks if needed
    const addPageIfNeeded = (yOffset) => {
      const pageHeight = pdf.internal.pageSize.height;
      if (yOffset >= pageHeight - 20) {
        pdf.addPage();
        return 20; // Reset offset after new page
      }
      return yOffset;
    };

    // Patient Information
    let yOffset = 30;
    yOffset = addPageIfNeeded(yOffset);
    pdf.text(`Name: ${report.patient_name || "N/A"}`, 20, yOffset);
    yOffset += 8;
    yOffset = addPageIfNeeded(yOffset);
    pdf.text(`Gender: ${report.patient_gender || "N/A"}`, 20, yOffset);
    yOffset += 8;
    yOffset = addPageIfNeeded(yOffset);
    pdf.text(`Email: ${report.patient_email || "N/A"}`, 20, yOffset);
    yOffset += 8;
    yOffset = addPageIfNeeded(yOffset);
    pdf.text(`Diagnosis: ${report.diagnosis || "N/A"}`, 20, yOffset);
    yOffset += 10;

    // Recommendations
    if (report.recommendation && report.recommendation.length > 0) {
      yOffset = addPageIfNeeded(yOffset);
      pdf.text("Recommendations:", 20, yOffset);
      yOffset += 8;

      // Loop through recommendations and handle wrapping
      const maxWidth = 180; // Max width for text wrapping
      report.recommendation.forEach((rec, index) => {
        const lines = pdf.splitTextToSize(`${index + 1}. ${rec}`, maxWidth);
        lines.forEach((line, lineIndex) => {
          yOffset = addPageIfNeeded(yOffset);
          pdf.text(line, 20, yOffset);
          yOffset += 8;
        });
      });
    } else {
      yOffset = addPageIfNeeded(yOffset);
      pdf.text("Recommendations: N/A", 20, yOffset);
      yOffset += 8;
    }

    // Add Image if exists
    if (report.image_url) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = report.image_url;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const imgData = canvas.toDataURL("image/png");

        // Reduce the image width to make it smaller
        const imgWidth = 120;  // Reduced width
        const imgHeight = (img.height * imgWidth) / img.width;

        // Calculate offset for image and add page if needed
        yOffset = addPageIfNeeded(yOffset);
        pdf.addImage(imgData, "PNG", 20, yOffset, imgWidth, imgHeight);

        // After adding image, save the PDF
        pdf.save(`${report.patient_name?.replace(/\s/g, "_") || "report"}.pdf`);
      };
    } else {
      pdf.save(`${report.patient_name?.replace(/\s/g, "_") || "report"}.pdf`);
    }
  };

  return (
    <>
      <SideNavbar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      <TopNav isExpanded={isExpanded} />
      <div
        className={`transition-all duration-300 p-6 bg-white min-h-screen ${
          isExpanded
            ? "ml-60 w-[calc(100%-15rem)]"
            : "ml-16 w-[calc(100%-4rem)]"
        }`}
      >
        <h1 className="text-3xl font-semibold mb-6">Patient Reports</h1>

        <table className="w-full border shadow-md rounded-lg mt-4 text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Diagnosis</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {reports.map((report, index) => (
              <tr key={index} className="hover:bg-gray-50 transition">
                <td className="p-3">{report.patient_name}</td>
                <td className="p-3">{report.patient_email}</td>
                <td className="p-3">{report.diagnosis}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => handleDownload(report)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Download PDF
                  </button>
                </td>
              </tr>
            ))}
            {reports.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center p-5 text-gray-500">
                  No reports available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Reports;
