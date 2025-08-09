"use client"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"

const Notifications = () => {
  const navigate = useNavigate()

  // Sample notifications data
  const notifications = [
    { id: 1, message: "buy food", type: "success", date: "2024-01-22" },
    { id: 2, message: "buy food.", type: "info", date: "2024-01-21" },
    { id: 3, message: "buy food", type: "success", date: "2024-01-15" },
    { id: 4, message: "buy food", type: "warning", date: "2024-01-10" },
  ]

  const getTypeClass = (type) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-800"
      case "info":
        return "bg-blue-100 text-blue-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole="employee" />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Notifications</h2>
            </div>
            <div className="p-6">
              {notifications.length === 0 ? (
                <p className="text-gray-600 text-center">No new notifications.</p>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-center justify-between p-4 rounded-md ${getTypeClass(notification.type)}`}
                    >
                      <p className="text-sm font-medium">{notification.message}</p>
                      <span className="text-xs text-gray-600">{notification.date}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Notifications
