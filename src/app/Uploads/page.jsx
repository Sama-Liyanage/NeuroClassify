"use client";

import React, { useEffect, useState } from "react";
import SideNavbar from "../Component/SideNavbar";
import TopNav from "../Component/TopNav";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Image from "next/image";

const Button = ({ children, className, ...props }) => {
  return (
    <button
      className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

function Uploads() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [image, setImage] = useState(null);
  const [patients, setPatients] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [patientInfo, setPatientInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const pythonApiurl = process.env.NEXT_PUBLIC_PYTHON_API_URL;

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch(`${apiUrl}/patients`);
        const data = await res.json();
        setPatients(data);
      } catch (err) {
        console.error("Failed to fetch patients:", err);
      }
    };

    fetchPatients();
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  //--57
  const handleSubmit = async () => {
    if (!selectedCustomer || !image) {
      alert("Please select a patient and upload an image.");
      return;
    }

    const selectedPatient = patients.find((p) => p.email === selectedCustomer);

    if (!selectedPatient) {
      alert("Selected patient not found.");
      return;
    }

    const formData = new FormData();
    const blob = await fetch(image).then((res) => res.blob());

    formData.append("file", blob, "patientInfo.scanImage");
    formData.append("patient_email", selectedPatient.email);
    formData.append("patient_name", selectedPatient.fullName);
    const age =
      new Date().getFullYear() -
      new Date(selectedPatient.dateOfBirth).getFullYear();
    formData.append("patient_age", age);

    formData.append("patient_gender", selectedPatient.gender);
    formData.append("symptoms", selectedPatient.symptoms || "");
    formData.append("medical_history", selectedPatient.medicalHistory || "");

    try {
      const response = await fetch(`${pythonApiurl}/predict/`, {
        method: "POST",
        body: formData,
      });

      console.log("loading.....");

      const data = await response.json();
      //false

      setPatientInfo({
        ...selectedPatient,
        diagnosis: data.report.diagnosis,
        recommendation: data.report.recommendation,
        scanImage: data.report.image_url,
      });
    } catch (error) {
      console.error("Prediction request failed:", error);
      alert("Prediction failed. Please try again later.");
    }
  };

  const handleDownloadPDF = async () => {
    const reportElement = document.getElementById("printableReport");
    const downloadBtn = document.querySelector(".download-btn");

    if (!reportElement) {
      alert("Report section not found.");
      return;
    }

    try {
      // Temporarily hide the button
      if (downloadBtn) downloadBtn.style.display = "none";

      await new Promise((resolve) => setTimeout(resolve, 300));

      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        scrollY: -window.scrollY,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const totalPDFPages = Math.ceil(imgHeight / pageHeight);

      for (let i = 0; i < totalPDFPages; i++) {
        const position = -i * pageHeight;
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, 10 + position, imgWidth, imgHeight);
      }

      pdf.save("Patient_Report.pdf");
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      // Show the button back
      if (downloadBtn) downloadBtn.style.display = "block";

      setLoading(false);
      setDisabled(false);
    }
  };

  return (
    <>
      <SideNavbar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      <TopNav isExpanded={isExpanded} />
      <div
        className={`transition-all duration-300 p-4 bg-white min-h-screen ${
          isExpanded
            ? "ml-60 w-[calc(100%-15rem)]"
            : "ml-16 w-[calc(100%-4rem)]"
        }`}
      >
        <div className="bg-white shadow-lg rounded-2xl p-4 md:p-8 w-full min-h-[80vh] grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Left Panel - Patient Information */}
          <div className="flex flex-col space-y-4 md:space-y-6 border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0 md:pr-6">
            <h2 className="text-xl font-bold text-gray-800">
              Patient Information
            </h2>

            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
            >
              <option value="">Choose a patient</option>
              {patients.map((p) => (
                <option key={p.email} value={p.email}>
                  {p.fullName}
                </option>
              ))}
            </select>

            <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="upload"
              />
              <label htmlFor="upload" className="cursor-pointer">
                <p className="text-gray-500">
                  Drag and drop or click to upload image
                </p>
                <Button className="mt-3">Select File</Button>
              </label>

              {image && (
                <div className="mt-4 w-full flex justify-center">
                  <Image
                    src={image}
                    alt="Uploaded Preview"
                    className="max-w-full h-auto rounded-lg shadow"
                    width={300}
                    height={300}
                  />
                </div>
              )}
            </div>

            <Button
              className="w-full mt-2"
              onClick={handleSubmit}
              disabled={disabled}
            >
              {loading ? "Processing..." : "Submit Scan"}
            </Button>
          </div>

          {/* Right Panel - Analysis Results */}
          {patientInfo && (
            <div
              id="printableReport"
              className="flex flex-col space-y-4 md:space-y-6 pt-4 md:pt-0"
            >
              <h2 className="text-xl font-bold text-gray-800">
                Analysis Results
              </h2>

              <div className="space-y-3">
                <div className="bg-gray-100 p-2 rounded-md">
                  <span className="text-sm text-gray-600">Name: </span>
                  <strong>{patientInfo.fullName}</strong>
                </div>
                <div className="bg-gray-100 p-2 rounded-md">
                  <span className="text-sm text-gray-600">Gender: </span>
                  <strong>{patientInfo.gender}</strong>
                </div>
                <div className="bg-gray-100 p-2 rounded-md">
                  <span className="text-sm text-gray-600">Email: </span>
                  <strong>{patientInfo.email}</strong>
                </div>
                <div className="bg-gray-100 p-2 rounded-md">
                  <span className="text-sm text-gray-600">Date of Birth: </span>
                  <strong>{patientInfo.dateOfBirth}</strong>
                </div>
                <div className="bg-red-50 p-2 rounded-md border border-red-200">
                  <span className="text-sm text-red-700 font-medium">
                    Diagnosis: {patientInfo.diagnosis}
                  </span>
                </div>
                <div className="bg-red-50 p-2 rounded-md border border-red-200">
                  <span className="text-sm text-red-700 font-medium">
                    Tumor Size: {patientInfo.scanImage.tumor_size}
                  </span>
                </div>
                <div className="bg-red-50 p-2 rounded-md border border-red-200">
                  <span className="text-sm text-red-700 font-medium">
                    Tumor Location: {patientInfo.scanImage.tumor_location}
                  </span>
                </div>
              </div>

              <div className="w-full flex justify-center">
                {patientInfo.scanImage ? (
                  <Image
                    src={patientInfo.scanImage}
                    alt="Scan"
                    className="rounded-lg shadow-lg object-contain max-w-md"
                    width={300}
                    height={200}
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    No scan image available.
                  </div>
                )}
              </div>

              <div className="bg-yellow-100 p-3 rounded-md text-yellow-800 font-medium">
                <ul className="list-disc list-inside space-y-1 text-left">
                  {patientInfo.recommendation.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>

              <Button
                className="w-full bg-gray-800 download-btn"
                onClick={handleDownloadPDF}
              >
                Download PDF Report
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Uploads;
