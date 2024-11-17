import React from "react"
import { usernameVerification, isPositiveNumber } from "../../utils"

const EmployeesList = ({
  employees,
  searchQuery,
  setEmployees,
  authToken,
  company_id,
  editingEmployee,
  setEditingEmployee,
  setErrorClass,
  setErrorMessage,
}) => {
  const handleEdit = (employee) => {
    setEditingEmployee(employee)
    setErrorClass("no-error")
    setErrorMessage("")
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    const updatedEmployee = {
      full_name: e.target.full_name.value,
      job: e.target.job.value,
      salary: e.target.salary.value,
      years_worked: e.target.years_worked.value,
      state: e.target.state.value,
    }

    if (
      !usernameVerification(updatedEmployee.full_name) ||
      !usernameVerification(updatedEmployee.job) ||
      !isPositiveNumber(updatedEmployee.salary) ||
      !isPositiveNumber(updatedEmployee.years_worked)
    ) {
      setErrorClass("form-error")
      setErrorMessage("Invalid inputs. Please check the fields.")
      return
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/companies/${company_id}/update-employee/${editingEmployee._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(updatedEmployee),
        }
      )

      if (!response.ok) {
        throw new Error("Failed to update employee.")
      }

      const updatedEmployeeFromServer = await response.json()

      setEmployees((prevEmployees) =>
        prevEmployees.map((emp) =>
          emp._id === editingEmployee._id ? updatedEmployeeFromServer : emp
        )
      )

      setEditingEmployee(null)
      setErrorClass("no-error")
      setErrorMessage("")
    } catch (error) {
      console.error("Error updating employee:", error)
      setErrorClass("form-error")
      setErrorMessage("Failed to update employee. Try again.")
    }
  }

  const handleDelete = async (id) => {
    if (!id) {
      console.error("Employee ID is missing or undefined.")
      return
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/companies/${company_id}/delete-employee/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error("Error deleting employee.")
      }

      setEmployees((prevEmployees) =>
        prevEmployees.filter((employee) => employee._id !== id)
      )
    } catch (error) {
      console.error("Error deleting employee:", error)
      setErrorClass("form-error")
      setErrorMessage("Failed to delete the employee. Try again.")
    }
  }

  const handleCancelEdit = () => {
    setEditingEmployee(null)
  }

  const filteredEmployees = employees.filter((employee) =>
    employee.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="list-container">
      <ul className="employees-list">
        {filteredEmployees.map((employee) => (
          <li key={employee._id} className="employees-item">
            {editingEmployee?._id === employee._id ? (
              <form onSubmit={handleUpdate} className="edit-employee-form">
                <input
                  className="employees-form-inputs"
                  type="text"
                  name="full_name"
                  defaultValue={employee.full_name}
                />
                <input
                  className="employees-form-inputs"
                  type="text"
                  name="job"
                  defaultValue={employee.job}
                />
                <input
                  className="employees-form-inputs"
                  type="number"
                  name="salary"
                  defaultValue={employee.salary}
                />
                <input
                  className="employees-form-inputs"
                  type="number"
                  name="years_worked"
                  defaultValue={employee.years_worked}
                />
                <select
                  className="employees-form-inputs"
                  name="state"
                  defaultValue={employee.state}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <button className="save-edit-button" type="submit">
                  Save
                </button>
                <button
                  className="cancel-edit-button"
                  type="button"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <h3 className="list-title">{employee.full_name}</h3>
                <p className="employee-info">
                  <span className="list-span">Job:</span> {employee.job}
                </p>
                <p className="employee-info">
                  <span className="list-span">Salary:</span> {employee.salary}
                </p>
                <p className="employee-info">
                  <span className="list-span">Years Worked:</span>{" "}
                  {employee.years_worked}
                </p>
                <p className="employee-info">
                  <span className="list-span">State:</span> {employee.state}
                </p>
                <button
                  className="edit-button"
                  onClick={() => handleEdit(employee)}
                >
                  Edit
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(employee._id)}
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default EmployeesList