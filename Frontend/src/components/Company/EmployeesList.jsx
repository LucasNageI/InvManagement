import React, { useEffect } from "react"
import { usernameVerification, isPositiveNumber } from "../../utils"
import getAuthToken from "../../utils/getAuthToken"

const EmployeesList = ({
  employees,
  setEmployees,
  searchQuery,
  authToken,
  company_id,
  editingEmployee,
  setEditingEmployee,
  isAdmin,
}) => {
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/employees/${company_id}/get-employees`,
          {
            method: "GET",
            headers: getAuthToken(),
          }
        )
  
        if (!response.ok) {
          throw new Error("Failed to fetch employees.")
        }
  
        const data = await response.json()

        setEmployees(Array.isArray(data.data) ? data.data : [])
      } catch (error) {
        console.error("Error fetching employees:", error)
        setEmployees([])
      }
    }
  
    fetchEmployees()
 }, [company_id, authToken, setEmployees])  

  const handleEdit = (employee) => {
    setEditingEmployee(employee)
  }

  const handleUpdate = async (e) => {
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
      return
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/employees/${company_id}/update-employee/${editingEmployee._id}`,
        {
          method: "PUT",
          headers: getAuthToken(),
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
    } catch (error) {
      console.error("Error updating employee:", error)
    }
  }

  const handleDelete = async (id) => {
    if (!id) {
      console.error("Employee ID is missing or undefined.")
      return
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/employees/${company_id}/delete-employee/${id}`,
        {
          method: "DELETE",
          headers: getAuthToken(),
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
    }
  }

  const handleCancelEdit = () => {
    setEditingEmployee(null)
  }

  const filteredEmployees = Array.isArray(employees)
  ? employees.filter((employee) =>
      employee.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  : []


  return (
    <div className="list-container">
      {filteredEmployees.length === 0 ? (
        <p>No employees found.</p>
      ) : (
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
                  {isAdmin && (
                    <>
                      <button className="edit-button" onClick={() => handleEdit(employee)}>
                        Edit
                      </button>
                      <button className="delete-button" onClick={() => handleDelete(employee._id)}>
                        Delete
                      </button>
                    </>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default EmployeesList