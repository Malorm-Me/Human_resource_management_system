"use client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import WebcamCapture from "../components/WebcamCapture";
import Navbar from "../components/Navbar";

const SERVER_BASE = "http://localhost:5000";

const AttendancePage = () => {
  const navigate = useNavigate();
  const [capturedImage, setCapturedImage] = useState(null);
  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);
  const [attendanceStatus, setAttendanceStatus] = useState("Not Clocked In");
  const [pastAttendance, setPastAttendance] = useState([]);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const userId = localStorage.getItem("userId");

 
  function formatDateForCompare(dbDate) {
    if (!dbDate) return null;
    if (typeof dbDate === "string") return dbDate.split("T")[0];
    if (dbDate instanceof Date) return dbDate.toISOString().split("T")[0];
    return String(dbDate).split("T")[0];
  }

  function formatTimeFromSql(sqlTime) {
    if (!sqlTime) return null;
    const parts = String(sqlTime).split(":");
    if (parts.length < 2) return sqlTime;
    const hh = parseInt(parts[0], 10);
    const mm = parseInt(parts[1], 10);
    const d = new Date();
    d.setHours(hh, mm, 0, 0);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function serverImageUrl(filenameOrData) {
    if (!filenameOrData) return null;
    if (
      typeof filenameOrData === "string" &&
      filenameOrData.startsWith("data:")
    ) {
      return filenameOrData;
    }
    return `${SERVER_BASE}/uploads/${filenameOrData}`;
  }

  
  useEffect(() => {
    if (!userId) return;

    const fetchAttendance = async () => {
      try {
        const res = await axios.get(`${SERVER_BASE}/api/attendance/${userId}`);
        const rows = Array.isArray(res.data) ? res.data : [];
const mapped = rows.map((r) => {
  const baseDate = new Date(formatDateForCompare(r.date)); 
  baseDate.setDate(baseDate.getDate() + 1); // add one day
  const dateStr = baseDate.toISOString().split("T")[0];

  return {
    id: r.id,
    date: dateStr,
    clock_in_raw: r.clock_in,
    clock_out_raw: r.clock_out,
    clock_in: formatTimeFromSql(r.clock_in),
    clock_out: formatTimeFromSql(r.clock_out),
    status: r.status,
    captured_image: r.captured_image,
    photo: serverImageUrl(r.captured_image),
  };
});


        setPastAttendance(mapped);
        console.log(mapped);
        

        const today = new Date();
        const todayLocal = `${today.getFullYear()}-${String(
          today.getMonth() + 1
        ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

        const todayEntry = mapped.find((m) => m.date === todayLocal);
        console.log("Local today:", todayLocal, "Found:", todayEntry);

        console.log(todayEntry);

        if (todayEntry) {
          setClockInTime(
            todayEntry.clock_in || formatTimeFromSql(todayEntry.clock_in_raw)
          );
          setClockOutTime(
            todayEntry.clock_out || formatTimeFromSql(todayEntry.clock_out_raw)
          );
          setCapturedImage(todayEntry.photo);

         
          if (todayEntry.clock_in_raw && !todayEntry.clock_out_raw) {
            setAttendanceStatus("Clocked In");
            setIsClockedIn(true);
          } else if (todayEntry.clock_in_raw && todayEntry.clock_out_raw) {
            setAttendanceStatus("Clocked Out");
            setIsClockedIn(false);
          } else {
            setAttendanceStatus("Not Clocked In");
            setIsClockedIn(false);
          }
        } else {
          setClockInTime(null);
          setClockOutTime(null);
          setAttendanceStatus("Not Clocked In");
          setIsClockedIn(false);
        }
      } catch (err) {
        console.error("Failed to fetch attendance", err);
      }
    };

    fetchAttendance();
  }, [userId]);

  const handleImageCapture = (imageDataUrl) => {
    setCapturedImage(imageDataUrl);
  };

  const handleClockIn = async () => {
    if (!capturedImage) {
      alert("Please capture a selfie before clocking in.");
      return;
    }
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const dateString = now.toISOString().split("T")[0];

    setClockInTime(timeString);
    setClockOutTime(null);
    setAttendanceStatus("Clocked In");
    setIsClockedIn(true);

    const newEntry = {
      id: pastAttendance.length + 1,
      date: dateString,
      clock_in: timeString,
      clock_out: null,
      status: "Clocked In",
      photo: capturedImage,
    };
    setPastAttendance((prev) => [
      newEntry,
      ...prev.filter((entry) => entry.date !== dateString),
    ]);

    try {
      await axios.post(`${SERVER_BASE}/api/attendance/clock-in`, {
        user_id: userId,
        date: dateString,
        clock_in: timeString,
        captured_image: capturedImage,
        status: "Clocked In",
      });
      alert(`Clocked in at ${timeString}!`);
    } catch (err) {
      console.error("Clock-in failed", err);
      alert("Failed to clock in");
    }
  };

  const handleClockOut = async () => {
    if (!clockInTime) {
      alert("You must clock in first.");
      return;
    }

    const now = new Date();
    const timeString = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const dateString = now.toISOString().split("T")[0];

    setClockOutTime(timeString);
    setAttendanceStatus("Clocked Out");
    setIsClockedIn(false);

    setPastAttendance((prev) =>
      prev.map((entry) =>
        entry.date === dateString
          ? { ...entry, clock_out: timeString, status: "Clocked Out" }
          : entry
      )
    );

    try {
      await axios.post(`${SERVER_BASE}/api/attendance/clock-out`, {
        user_id: userId,
        date: dateString,
        clock_out: timeString,
        status: "Clocked Out",
      });
      alert(`Clocked out at ${timeString}!`);
    } catch (err) {
      console.error("Clock-out failed", err);
      alert("Failed to clock out");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole="employee" />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Webcam and Clock In */}
            <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
              <WebcamCapture onCapture={handleImageCapture} />
              {capturedImage && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Captured Selfie Preview
                  </h3>
                  <div className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-inner flex items-center justify-center">
                    <img
                      src={capturedImage || "/placeholder.svg"}
                      alt="Captured Selfie"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleClockIn}
                      disabled={isClockedIn}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition duration-200 ${
                        isClockedIn
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                    >
                      Clock In
                    </button>
                  </div>
                </div>
              )}
            </div>

            
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Today's Attendance Status
                </h3>
                <div className="flex items-center space-x-4">
                  <div
                    className={`h-12 w-12 rounded-full flex items-center justify-center ${
                      attendanceStatus === "Clocked In"
                        ? "bg-green-100 text-green-600"
                        : attendanceStatus === "Clocked Out"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {attendanceStatus === "Clocked In" && (
                      <svg
                        className="h-6 w-6"
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
                    )}
                    {attendanceStatus === "Clocked Out" && (
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    )}
                    {attendanceStatus === "Not Clocked In" && (
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Status</p>
                    <p className="text-lg font-bold text-gray-900">
                      {attendanceStatus}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <p className="font-medium">Check-in Time:</p>
                    <p>{clockInTime || "N/A"}</p>
                  </div>
                  <div>
                    <p className="font-medium">Check-out Time:</p>
                    <p>{clockOutTime || "N/A"}</p>
                  </div>
                </div>
                {capturedImage && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">
                      Today's Selfie:
                    </p>
                    <img
                      src={capturedImage || "/placeholder.svg"}
                      alt="Today's Selfie"
                      className="w-24 h-24 object-cover rounded-lg shadow-sm"
                    />
                  </div>
                )}
                <button
                  disabled={!isClockedIn}
                  onClick={handleClockOut}
                  className={`px-4 py-2 rounded ${
                    isClockedIn ? "bg-red-500 hover:bg-red-600" : "bg-gray-400"
                  } text-white`}
                >
                  Clock Out
                </button>
              </div>

              {/* Past Attendance Table */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    Past Attendance
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
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
                      {pastAttendance.map((entry) => (
                        <tr key={entry.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {entry.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {entry.clock_in || entry.clock_in_raw || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {entry.clock_out || entry.clock_out_raw || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                entry.status === "Present"
                                  ? "bg-green-100 text-green-800"
                                  : entry.status === "Late"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {entry.status || "N/A"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {entry.photo ? (
                              <img
                                src={entry.photo}
                                alt="Attendance Selfie"
                                className="h-10 w-10 object-cover rounded-full"
                              />
                            ) : null}
                          </td>
                        </tr>
                      ))}
                      {pastAttendance.length === 0 && (
                        <tr>
                          <td
                            colSpan="5"
                            className="px-6 py-4 text-center text-sm text-gray-500"
                          >
                            No attendance records found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AttendancePage;
