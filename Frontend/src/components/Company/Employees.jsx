import React, { useState } from "react"
import "../../styles/component_styles/Company/Employees.css"

const Employees = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [employees, setEmployees] = useState([
    {
      id: 1,
      full_name: "John Doe",
      job: "Manager",
      salary: 5000,
      years_worked: 3,
      state: "Active",
    },
    {
      id: 2,
      full_name: "Jane Smith",
      job: "Sales Associate",
      salary: 4000,
      years_worked: 2,
      state: "Inactive",
    },
    {
      id: 3,
      full_name: "Michael Johnson",
      job: "HR Manager",
      salary: 6000,
      years_worked: 4,
      state: "Active",
    },
    {
      id: 4,
      full_name: "Emily Davis",
      job: "Financial Analyst",
      salary: 5500,
      years_worked: 3,
      state: "Inactive",
    },
    {
      id: 5,
      full_name: "David Wilson",
      job: "Marketing Coordinator",
      salary: 4500,
      years_worked: 2,
      state: "Active",
    },
    {
      id: 6,
      full_name: "Sophia Martinez",
      job: "Customer Service Representative",
      salary: 4800,
      years_worked: 3,
      state: "Inactive",
    },
    {
      id: 7,
      full_name: "Daniel Anderson",
      job: "IT Technician",
      salary: 5200,
      years_worked: 4,
      state: "Active",
    },
    {
      id: 8,
      full_name: "Olivia Thompson",
      job: "Product Manager",
      salary: 5700,
      years_worked: 3,
      state: "Inactive",
    },
    {
      id: 9,
      full_name: "Matthew Johnson",
      job: "Software Developer",
      salary: 5000,
      years_worked: 2,
      state: "Active",
    },
    {
      id: 10,
      full_name: "Ava Davis",
      job: "Data Scientist",
      salary: 5500,
      years_worked: 3,
      state: "Inactive",
    },
    {
      id: 11,
      full_name: "James Wilson",
      job: "Operations Manager",
      salary: 6000,
      years_worked: 4,
      state: "Active",
    },
    {
      id: 12,
      full_name: "Sophia Martinez",
      job: "Customer Service Representative",
      salary: 4800,
      years_worked: 3,
      state: "Inactive",
    },
    {
      id: 13,
      full_name: "Daniel Anderson",
      job: "IT Technician",
      salary: 5200,
      years_worked: 4,
      state: "Active",
    },
    {
      id: 14,
      full_name: "Olivia Thompson",
      job: "Product Manager",
      salary: 5700,
      years_worked: 3,
      state: "Inactive",
    },
    {
      id: 15,
      full_name: "Matthew Johnson",
      job: "Software Developer",
      salary: 5000,
      years_worked: 2,
      state: "Active",
    },
    {
      id: 16,
      full_name: "Ava Davis",
      job: "Data Scientist",
      salary: 5500,
      years_worked: 3,
      state: "Inactive",
    },
    {
      id: 17,
      full_name: "James Wilson",
      job: "Operations Manager",
      salary: 6000,
      years_worked: 4,
      state: "Active",
    },
    {
      id: 18,
      full_name: "Sophia Martinez",
      job: "Customer Service Representative",
      salary: 4800,
      years_worked: 3,
      state: "Inactive",
    },
    {
      id: 19,
      full_name: "Daniel Anderson",
      job: "IT Technician",
      salary: 5200,
      years_worked: 4,
      state: "Active",
    },
    {
      id: 20,
      full_name: "Olivia Thompson",
      job: "Product Manager",
      salary: 5700,
      years_worked: 3,
      state: "Inactive",
    },
  ])

  const filteredEmployees = employees.filter((employee) =>
    employee.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const handleDelete = (id) => {
    const updatedEmployees = employees.filter((employee) => employee.id !== id)
    setEmployees(updatedEmployees)
  }

  return (
    <div className="employees-container">
      <h1 className="h1-title">Employees</h1>

      <input
        onChange={(e) => setSearchQuery(e.target.value)}
        type="text"
        placeholder="Search by Name"
        value={searchQuery}
        className="search-input"
      />

      <div className="list-container">
        <ul className="employees-list">
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((employee) => (
              <li key={employee.id} className="employees-item">
                <div>
                  <h3 className="list-title">{employee.full_name}</h3>
                </div>
                <div>
                  <span className="list-span">ID:</span> {employee.id}
                </div>
                <div>
                  <span className="list-span">Salary:</span> {employee.salary}
                </div>
                <div>
                  <span className="list-span">Job:</span> {employee.job}
                </div>
                <div>
                  <span className="list-span">Years Worked:</span>{" "}
                  {employee.years_worked}
                </div>
                <div>
                  <span className="list-span">State:</span> {employee.state}
                </div>
                <div className="employees-actions">
                  <button
                    className="table-icon-button delete-button"
                    onClick={() => handleDelete(employee.id)}
                  >
                    <span>Delete</span>
                    <i className="bi bi-trash table-icon"></i>
                  </button>
                </div>
              </li>
            ))
          ) : (
            <li>No employees found</li>
          )}
        </ul>
      </div>

      <h2 className="h2-title">Add Employee</h2>
      <form className="employees-form">
        <div className="employees-form-inputs-container">
          <label className="employees-form-labels" htmlFor="Name">
            Full Name:
          </label>
          <input className="employees-form-inputs" type="text" />
        </div>
        <div className="employees-form-inputs-container">
          <label className="employees-form-labels" htmlFor="Salary">
            Salary:
          </label>
          <input className="employees-form-inputs" type="number" />
        </div>
        <div className="employees-form-inputs-container">
          <label className="employees-form-labels" htmlFor="job">
            Job:
          </label>
          <input className="employees-form-inputs" type="text" />
        </div>
        <div className="employees-form-inputs-container">
          <label className="employees-form-labels" htmlFor="Years Worked">
            Years Worked:
          </label>
          <input className="employees-form-inputs" type="number" />
        </div>
        <div className="employees-form-inputs-container">
          <select className="employees-form-inputs" id="state">
            <option value="Active">Avalible</option>
            <option value="Inactive">Not Avalible</option>
          </select>
        </div>
        <button className="form-submit-button">Save</button>
      </form>
    </div>
  )
}

export default Employees
