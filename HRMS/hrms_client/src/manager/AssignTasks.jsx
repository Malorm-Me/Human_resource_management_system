"use client";
import { useState,useEffect  } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";


const AssignTasks = () => {
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    assignee: "",
    managerId: localStorage.getItem("userId"),
  });

   const [employees, setEmployees] = useState([]);

  const handleTaskFormChange = (e) => {
    setTaskForm({
      ...taskForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleAssignTask = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/assignTasks",
        taskForm
      );
      alert(response.data.message);
      setTaskForm({
        title: "",
        description: "",
        dueDate: "",
        assignee: "",
        
      });
    } catch (error) {
      console.error("Error assigning task:", error);
      alert("Failed to assign task");
    }
  };

    useEffect(() => {
    const managerId = localStorage.getItem("userId");
    console.log("selected manager ID:", managerId);
    
    if (!managerId) return;

    axios
      .get(`http://localhost:5000/api/users/department-members/${managerId}`)
      .then((res) => {
        setEmployees(res.data);
      })
      .catch((err) => {
        console.error("Failed to load department users", err);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole="manager" />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Assign New Task
            </h2>
            <form onSubmit={handleAssignTask} className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Task Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={taskForm.title}
                  onChange={handleTaskFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter task title"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  value={taskForm.description}
                  onChange={handleTaskFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter task description"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="assignee"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Assignee
                  </label>
                  <select
                    id="assignee"
                    name="assignee"
                    value={taskForm.assignee}
                    onChange={handleTaskFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Assignee</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="dueDate"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Due Date
                  </label>
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={taskForm.dueDate}
                    onChange={handleTaskFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="submit"
                  className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AssignTasks;
