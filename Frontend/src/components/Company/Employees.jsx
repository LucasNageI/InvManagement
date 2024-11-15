import React, { useState } from "react"
import "../../styles/component_styles/Company/Employees.css"
import { usernameVerification, isPositiveNumber } from "../../utils/index.js"

const Employees = () => {
  const [errorMessage, setErrorMessage] = useState("")
  const [errorClass, setErrorClass] = useState("no-error")
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
  ])

  const handleSubmit = (e) => {
    e.preventDefault()

    const full_name = e.target.full_name.value
    const job = e.target.job.value
    const salary = e.target.salary.value
    const years_worked = e.target.years_worked.value

    const isFullNameValid = usernameVerification(full_name)
    const isJobValid = usernameVerification(job)
    const isSalaryValid = isPositiveNumber(salary)
    const isYearsWorkedValid = isPositiveNumber(years_worked)

    if (!isFullNameValid) {
      setErrorClass("form-error")
      setErrorMessage("Invalid name")
    } else if (!isJobValid) {
      setErrorClass("form-error")
      setErrorMessage("Invalid job name")
    } else if (!isSalaryValid) {
      setErrorClass("form-error")
      setErrorMessage("Invalid number of salary")
    } else if (!isYearsWorkedValid) {
      setErrorClass("form-error")
      setErrorMessage("Invalid number of years worked")
    } else {
      const newEmployee = {
        id: employees.length + 1,
        full_name,
        job,
        salary,
        years_worked,
        state: "Active",
      }
      setEmployees([...employees, newEmployee])
      setErrorClass("no-error")
      setErrorMessage("")
      e.target.reset()
    }
  }
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
      <form onSubmit={handleSubmit} className="employees-form">
        <div className="employees-form-inputs-container">
          <label className="employees-form-labels" htmlFor="Name">
            Full Name:
          </label>
          <input
            className="employees-form-inputs"
            type="text"
            name="full_name"
          />
        </div>
        <div className="employees-form-inputs-container">
          <label className="employees-form-labels" htmlFor="Salary">
            Salary:
          </label>
          <input
            className="employees-form-inputs"
            type="number"
            name="salary"
          />
        </div>
        <div className="employees-form-inputs-container">
          <label className="employees-form-labels" htmlFor="job">
            Job:
          </label>
          <input className="employees-form-inputs" type="text" name="job" />
        </div>
        <div className="employees-form-inputs-container">
          <label className="employees-form-labels" htmlFor="Years Worked">
            Years Worked:
          </label>
          <input
            className="employees-form-inputs"
            type="number"
            name="years_worked"
          />
        </div>
        <div className="employees-form-inputs-container">
          <select className="employees-form-inputs" id="state">
            <option value="Active">Avalible</option>
            <option value="Inactive">Not Avalible</option>
          </select>
        </div>
        <div className={errorClass}>
          <i className="bi bi-exclamation-triangle-fill"></i>
          <p>{errorMessage}</p>
        </div>
        <button className="form-submit-button">Save</button>
      </form>
    </div>
  )
}

export default Employees