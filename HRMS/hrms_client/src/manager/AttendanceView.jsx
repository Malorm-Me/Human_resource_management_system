"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const AttendanceView = () => {
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [employeeAttendance, setEmployeeAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);
  const closePreview = () => setPreviewImage(null);
  const [error, setError] = useState(null);

  // Fetch attendance data from backend 
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/attendance")
      .then((response) => {
        setEmployeeAttendance(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch attendance data:", err);
        setError("Failed to load attendance data.");
        setLoading(false);
      });
  }, []);

  const employees = [
    ...new Set(employeeAttendance.map((entry) => entry.employee)),
  ];

  const filteredAttendance = employeeAttendance.filter((entry) => {
    const matchesEmployee = selectedEmployee
      ? entry.employee === selectedEmployee
      : true;
    const matchesDate = selectedDate ? entry.date === selectedDate : true;
    return matchesEmployee && matchesDate;
  });

  const getStatusClass = (status) => {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-800";
      case "Late":
        return "bg-yellow-100 text-yellow-800";
      case "Absent":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar userRole="manager" />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <p className="p-6 text-center">Loading attendance records...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar userRole="manager" />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <p className="p-6 text-center text-red-600">{error}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole="manager" />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">
                Employee Attendance Logs
              </h2>
              <div className="flex space-x-4">
                <div>
                  <label htmlFor="employeeFilter" className="sr-only">
                    Filter by Employee
                  </label>
                  <select
                    id="employeeFilter"
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="">All Employees</option>
                    {employees.map((emp) => (
                      <option key={emp} value={emp}>
                        {emp}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="dateFilter" className="sr-only">
                    Filter by Date
                  </label>
                  <input
                    type="date"
                    id="dateFilter"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  />
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time In
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time Out
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Photo
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAttendance.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No attendance records found for the selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredAttendance.map((entry) => (
                      <tr key={entry.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {entry.employee}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {entry.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {entry.timeIn}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {entry.timeOut || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                              entry.status
                            )}`}
                          >
                            {entry.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {entry.photo ? (
                            <img
                              src={`http://localhost:5000/uploads/${entry.photo}`}
                              alt="Attendance Selfie"
                              className="h-10 w-10 object-cover rounded-full cursor-pointer"
                              onClick={() => setPreviewImage(`http://localhost:5000/uploads/${entry.photo}`)}
                            />
                          ) : (
                            <div className="h-10 w-10 bg-gray-200 rounded-full" />
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
            {/* Image preview modal */}
        {previewImage && (
          <div
            onClick={closePreview}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 cursor-pointer"
          >
            <img
              src={previewImage}
              alt="Attendance Preview"
              className="max-h-[90vh] max-w-[90vw] rounded shadow-lg"
              onClick={(e) => e.stopPropagation()} // prevent modal close on image click
            />
            <button
              onClick={closePreview}
              className="absolute top-5 right-5 text-white text-3xl font-bold"
              aria-label="Close preview"
            >
              &times;
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default AttendanceView;
