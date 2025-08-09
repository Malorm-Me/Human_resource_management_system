"use client";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    pendingLeaveRequests: 0,
    totalEmployees: 0,
    openTasks: 0,
  });
  // Fetch stats 
  useEffect(() => {
    const managerId = localStorage.getItem("userId"); 
    if (!managerId) {
      setError("Manager ID not found");
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:5000/api/manager/stats?managerId=${managerId}`)
      .then((res) => {
        setStats(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load stats");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const name = localStorage.getItem("userName");
    setUserName(name);
  }, []);
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar userRole="manager" />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <p className="p-6 text-center">Loading dashboard...</p>
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
          
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome,{userName} (<small> Manager</small>)
            </h2>
            <p className="text-gray-600">
              Oversee your team, manage tasks, and approve requests.
            </p>
          </div>

         
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Pending Leave Requests
                  </p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingLeaveRequests}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Employees
                  </p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalEmployees}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg
                    className="h-6 w-6 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Open Tasks
                  </p>
                  <p className="text-2xl font-bold text-gray-900">{stats.openTasks}</p>
                </div>
              </div>
            </div>
          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              onClick={() => navigate("/manager/approve-leave")}
              className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition duration-200"
            >
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <svg
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  Approve Leave
                </h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Review and approve or reject employee leave requests.
              </p>
              <span className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Go to Approvals →
              </span>
            </div>

            <div
              onClick={() => navigate("/manager/assign-tasks")}
              className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition duration-200"
            >
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  Assign Tasks
                </h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Create and assign new tasks to your team members.
              </p>
              <span className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Assign New Task →
              </span>
            </div>

            <div
              onClick={() => navigate("/manager/attendance-view")}
              className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition duration-200"
            >
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <svg
                    className="h-6 w-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  Attendance View
                </h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                View daily attendance logs for your team.
              </p>
              <span className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View Attendance →
              </span>
            </div>
          </div>

          {/* Recent Team Activity */}
          <div className="mt-8 bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Recent Team Activity
              </h3>
            </div>
            <div className="p-6">
              <ul className="space-y-4">
                <li className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-900">
                    one
                  </span>
                  <span className="text-xs text-gray-500">1 hour ago</span>
                </li>
                <li className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-900">
                    two
                  </span>
                  <span className="text-xs text-gray-500">3 hours ago</span>
                </li>
                <li className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-900">
                    three
                  </span>
                  <span className="text-xs text-gray-500">Yesterday</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManagerDashboard;
