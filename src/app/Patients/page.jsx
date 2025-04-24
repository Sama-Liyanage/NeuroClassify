"use client";

import React, { useState, useEffect } from "react";
import SideNavbar from "../Component/SideNavbar";
import TopNav from "../Component/TopNav";
import { FaEdit, FaEye } from "react-icons/fa";

const Patients = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [patients, setPatients] = useState([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const patientsPerPage = 5;

  // Fetch patients from backend
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch(`${apiUrl}/patients`); 
        const data = await res.json();
        setPatients(data);
      } catch (err) {
        console.error("Error fetching patients:", err);
      }
    };

    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(
    (patient) =>
      patient.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.symptoms?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(
    indexOfFirstPatient,
    indexOfLastPatient
  );
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  return (
    <>
      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
            <h2 className="text-lg font-semibold mb-4">Add New Patient</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target;
                const newPatient = {
                  fullName: form.fullName.value.trim(),
                  dateOfBirth: form.dob.value,
                  gender: form.gender.value,
                  symptoms: form.symptoms.value.trim(),
                  medicalHistory: form.medicalHistory.value.trim(),
                  email: form.email.value.trim(),
                  password: form.password.value,
                };

                if (
                  !newPatient.fullName ||
                  !newPatient.dateOfBirth ||
                  !newPatient.gender ||
                  !newPatient.symptoms ||
                  !newPatient.email ||
                  !newPatient.password
                ) {
                  alert("Please fill all required fields");
                  return;
                }

                fetch(`${apiUrl}/patients`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(newPatient),
                })
                  .then((res) => res.json())
                  .then((data) => {
                    setPatients((prev) => [...prev, data]);
                    setShowModal(false);
                    form.reset();
                  })
                  .catch((err) => {
                    console.error("Error adding patient:", err);
                  });
              }}
              
            >
              <div>
                <label className="text-sm text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  className="w-full border rounded p-2 mt-1"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  required
                  className="w-full border rounded p-2 mt-1"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700">Gender</label>
                <select
                  name="gender"
                  required
                  className="w-full border rounded p-2 mt-1"
                >
                  <option value="">Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-700">
                  Presenting Symptoms
                </label>
                <textarea
                  name="symptoms"
                  rows="2"
                  required
                  className="w-full border rounded p-2 mt-1"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700">Medical History</label>
                <textarea
                  name="medicalHistory"
                  rows="2"
                  className="w-full border rounded p-2 mt-1"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full border rounded p-2 mt-1"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  className="w-full border rounded p-2 mt-1"
                />
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <SideNavbar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      <TopNav isExpanded={isExpanded} />

      <div
        className={`transition-all duration-300 p-4 bg-white min-h-screen ${
          isExpanded
            ? "ml-60 w-[calc(100%-15rem)]"
            : "ml-16 w-[calc(100%-4rem)]"
        }`}
      >
        <div className="bg-white p-5 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Patients</h2>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-4 py-2 text-sm rounded-md shadow hover:bg-blue-700 transition"
            >
              + Add Patient
            </button>
          </div>

          <input
            type="text"
            placeholder="Search patients..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full p-2 mb-4 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
          />

          <div className="overflow-x-auto">
            <table className="w-full border-collapse shadow-sm rounded-lg">
              <thead>
                <tr className="text-gray-700 text-sm bg-gray-100">
                  <th className="p-2 text-left">Full Name</th>
                  <th className="p-2 text-left">Date of Birth</th>
                  <th className="p-2 text-left">Gender</th>
                  <th className="p-2 text-left">Symptoms</th>
                  <th className="p-2 text-left">Medical History</th>
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {currentPatients.length > 0 ? (
                  currentPatients.map((patient, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition">
                      <td className="p-3 font-medium text-gray-900">
                        {patient.fullName}
                      </td>
                      <td className="p-3 text-gray-700">
                        {patient.dateOfBirth}
                      </td>
                      <td className="p-3 text-gray-700">{patient.gender}</td>
                      <td className="p-3 text-gray-700">{patient.symptoms}</td>
                      <td className="p-3 text-gray-700">
                        {patient.medicalHistory}
                      </td>
                      <td className="p-3 text-gray-700">{patient.email}</td>
                      <td className="p-3 flex justify-center gap-2 text-base">
                        <FaEye className="text-blue-500 cursor-pointer hover:text-blue-700 transition" />
                        <FaEdit className="text-green-500 cursor-pointer hover:text-green-700 transition" />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-4 text-center text-gray-500">
                      No patients found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredPatients.length > 0 && (
            <div className="flex justify-between items-center mt-4 text-gray-600 text-xs">
              <p>
                Showing {indexOfFirstPatient + 1} -{" "}
                {Math.min(indexOfLastPatient, filteredPatients.length)} of{" "}
                {filteredPatients.length} patients
              </p>
              <div className="flex gap-1">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  className="px-2 py-1 border rounded-md hover:bg-gray-100 transition"
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-2 py-1 border rounded-md ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white shadow-md"
                        : "hover:bg-gray-100"
                    } transition`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className="px-2 py-1 border rounded-md hover:bg-gray-100 transition"
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Patients;
