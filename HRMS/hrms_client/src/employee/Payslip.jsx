"use client"
import { useState } from "react"
import Navbar from "../components/Navbar"

const Payslip = () => {
  const [selectedMonth, setSelectedMonth] = useState("January 2024")

  // Sample payslip data
  const payslips = [
    {
      month: "January 2024",
      basicSalary: 5000,
      allowances: 500,
      deductions: 200,
      netPay: 5300,
      downloadLink: "#",
    },
    {
      month: "December 2023",
      basicSalary: 5000,
      allowances: 500,
      deductions: 200,
      netPay: 5300,
      downloadLink: "#",
    },
    {
      month: "November 2023",
      basicSalary: 5000,
      allowances: 500,
      deductions: 200,
      netPay: 5300,
      downloadLink: "#",
    },
  ]

  const currentPayslip = payslips.find((p) => p.month === selectedMonth)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole="employee" />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">My Payslips</h2>

            <div className="mb-6">
              <label htmlFor="monthSelect" className="block text-sm font-medium text-gray-700 mb-1">
                Select Month
              </label>
              <select
                id="monthSelect"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full md:w-1/2 lg:w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {payslips.map((payslip) => (
                  <option key={payslip.month} value={payslip.month}>
                    {payslip.month}
                  </option>
                ))}
              </select>
            </div>

            {currentPayslip ? (
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Payslip for {currentPayslip.month}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-medium">Basic Salary:</span>
                    <span>${currentPayslip.basicSalary.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-medium">Allowances:</span>
                    <span>${currentPayslip.allowances.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-medium">Deductions:</span>
                    <span>-${currentPayslip.deductions.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 font-bold text-lg text-blue-600">
                    <span>Net Pay:</span>
                    <span>${currentPayslip.netPay.toLocaleString()}</span>
                  </div>
                </div>
                <div className="mt-6 text-right">
                  <a
                    href={currentPayslip.downloadLink}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200"
                    download
                  >
                    Download Payslip
                  </a>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-600 border border-gray-200 rounded-lg">
                No payslip available for the selected month.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Payslip
