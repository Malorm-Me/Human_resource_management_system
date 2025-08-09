"use client";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [showAddDepartmentModal, setShowAddDepartmentModal] = useState(false);
  const [showEditDepartmentModal, setShowEditDepartmentModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);

  const [newDepartment, setNewDepartment] = useState({
    name: "",
    num_employees: 0,
  });

  const handleAddDepartmentChange = (e) => {
    setNewDepartment({ ...newDepartment, [e.target.name]: e.target.value });
  };

  const handleAddDepartmentSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/api/departments", {
        name: newDepartment.name,
      })
      .then((res) => {
        setDepartments([...departments, res.data]);
        setNewDepartment({ name: "" });
        setShowAddDepartmentModal(false);
        alert("Department added successfully!");
      })
      .catch((err) => {
        console.error("Failed to add department:", err);
        alert("Failed to add department. Please try again.");
      });
  };

  const handleEditClick = (dept) => {
    setEditingDepartment({ ...dept });
    setShowEditDepartmentModal(true);
  };

  const handleEditDepartmentChange = (e) => {
    const value =
      e.target.name === "manager_id"
        ? parseInt(e.target.value)
        : e.target.value;

    setEditingDepartment({
      ...editingDepartment,
      [e.target.name]: value,
    });
  };

  const handleEditDepartmentSubmit = (e) => {
    
    e.preventDefault();
    axios
      .put(
        `http://localhost:5000/api/departments/${editingDepartment.id}`,
        editingDepartment
      )
      .then((res) => {
        setDepartments((prev) =>
          prev.map((dept) =>
            dept.id === editingDepartment.id ? res.data : dept
          )
        );
        setShowEditDepartmentModal(false);
        setEditingDepartment(null);
        alert("Department updated successfully!");
      })
      .catch((err) => {
        console.error("Failed to update department:", err);
        alert("Failed to update department. Please try again.");
      });
  };

  const handleDeleteDepartment = async (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        await axios.delete(`http://localhost:5000/api/departments/${id}`);
        setDepartments((prev) => prev.filter((dept) => dept.id !== id));
        alert("Department deleted successfully!");
      } catch (error) {
        console.error("Error deleting department:", error);
        alert("Failed to delete department.");
      }
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/departments")
      .then((res) => setDepartments(res.data))
      .catch((err) => console.error("Failed to fetch departments:", err));

    axios
      .get("http://localhost:5000/api/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Failed to fetch users:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole="admin" />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">
                Manage Departments
              </h2>
              <button
                onClick={() => setShowAddDepartmentModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Add New Department
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Department Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Manager
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      # Employees
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {departments.map((dept) => (
                    <tr key={dept.id}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {dept.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {users.find((u) => u.id === dept.manager_id)?.name || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {dept.num_employees}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <button
                          onClick={() => handleEditClick(dept)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteDepartment(dept.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {departments.length === 0 && (
              <div className="p-6 text-center text-gray-600">
                No departments found.
              </div>
            )}
          </div>
        </div>

        {/* Add Department Modal */}
        {showAddDepartmentModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Add New Department
                </h3>
                <button
                  onClick={() => setShowAddDepartmentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleAddDepartmentSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newDepartment.name || ""}
                    onChange={handleAddDepartmentChange}
                    required
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddDepartmentModal(false)}
                    className="py-2 px-4 border rounded-md text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-4 border rounded-md text-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Add Department
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Department Modal */}
        {showEditDepartmentModal && editingDepartment && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Edit Department
                </h3>
                <button
                  onClick={() => setShowEditDepartmentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleEditDepartmentSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editingDepartment.name || ""}
                    onChange={handleEditDepartmentChange}
                    required
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Manager
                  </label>
                  <select
                    name="manager_id"
                    value={editingDepartment.manager_id || ""}
                    onChange={handleEditDepartmentChange}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">-- Select Manager --</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Employees
                  </label>
                  <input
                    type="number"
                    name="num_employees"
                    value={editingDepartment.num_employees || ""}
                    onChange={handleEditDepartmentChange}
                    min="0"
                    required
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditDepartmentModal(false)}
                    className="py-2 px-4 border rounded-md text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-4 border rounded-md text-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Update Department
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Departments;
