"use client"
import { useState, useEffect } from "react"
import axios from "axios"
import Navbar from "../components/Navbar"

const SubmitLeave = () => {
  const [leaveForm, setLeaveForm] = useState({
    type: "",
    startDate: "",
    endDate: "",
    reason: "",
  })
  const [pastRequests, setPastRequests] = useState([])
  const userId = localStorage.getItem("userId") 

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/leave/${userId}`)
        setPastRequests(res.data)
      } catch (error) {
        console.error("Failed to fetch leave requests:", error)
      }
    }
    fetchLeaveRequests()
  }, [userId])

  const handleFormChange = (e) => {
    setLeaveForm({
      ...leaveForm,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmitLeave = async (e) => {
    e.preventDefault()
    if (!leaveForm.type || !leaveForm.startDate || !leaveForm.endDate || !leaveForm.reason) {
      alert("Please fill in all fields.")
      return
    }
    if (new Date(leaveForm.startDate) > new Date(leaveForm.endDate)) {
      alert("Start date cannot be after end date.")
      return
    }

    try {
      await axios.post("http://localhost:5000/api/leave", { userId, ...leaveForm })
      alert("Leave request submitted successfully!")

      // Refresh the list after submitting
      const res = await axios.get(`http://localhost:5000/api/leave/${userId}`)
      setPastRequests(res.data)

      // Clear form
      setLeaveForm({
        type: "",
        startDate: "",
        endDate: "",
        reason: "",
      })
    } catch (error) {
      console.error("Error submitting leave:", error)
      alert("Failed to submit leave request.")
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "Approved": return "bg-green-100 text-green-800"
      case "Pending": return "bg-yellow-100 text-yellow-800"
      case "Rejected": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole="employee" />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Leave Request Form */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Submit New Leave Request</h2>
            <form onSubmit={handleSubmitLeave} className="space-y-4">
              {/* Leave Type */}
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Leave Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={leaveForm.type}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Type</option>
                  <option value="Annual Leave">Annual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Personal Leave">Personal Leave</option>
                  <option value="Maternity/Paternity Leave">Maternity/Paternity Leave</option>
                </select>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={leaveForm.startDate}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={leaveForm.endDate}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Reason */}
              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                  Reason
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  rows="3"
                  value={leaveForm.reason}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Briefly describe your reason for leave"
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>

          {/* Past Requests */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Your Past Leave Requests</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pastRequests.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                        No past leave requests.
                      </td>
                    </tr>
                  ) : (
                    pastRequests.map((request) => (
                      <tr key={request.id}>
                        <td className="px-6 py-4 text-sm">{request.type}</td>
                        <td className="px-6 py-4 text-sm">{request.startDate}</td>
                        <td className="px-6 py-4 text-sm">{request.endDate}</td>
                        <td className="px-6 py-4 text-sm">{request.reason}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(request.status)}`}>
                            {request.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default SubmitLeave
