import React, { useEffect, useState } from "react"
import "../../styles/component_styles/Company/Employees.css"
import { isPositiveNumber, usernameVerification } from "../../utils"
import { useParams } from "react-router-dom"
import EmployeesList from "./EmployeesList"

const Employees = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [errorClass, setErrorClass] = useState("no-error")
  const [errorMessage, setErrorMessage] = useState("")
  const [employees, setEmployees] = useState([])
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const authToken = sessionStorage.getItem("auth_token")
  const { company_id } = useParams()

  const fetchAllEmployees = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/employees/${company_id}/get-employees`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
  
      if (!response.ok) {
        throw new Error("Failed to fetch employees.")
      }
  
      const data = await response.json()
      setEmployees(data.data)
    } catch (error) {
      console.error("Error fetching employees:", error)
      setErrorClass("form-error")
      setErrorMessage("Failed to load employees. Try again.")
    }
  }
  

  const checkIfUserIsAdmin = async () => {
    try {
      const companyResponse = await fetch(
        `http://localhost:5000/api/companies/${company_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
  
      if (!companyResponse.ok) {
        throw new Error("Error fetching company data.")
      }
  
      const companyData = await companyResponse.json()
  
      const userResponse = await fetch("http://localhost:5000/api/companies/get-user-profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      })
  
      if (!userResponse.ok) {
        throw new Error("Error fetching user profile.")
      }
  
      const userData = await userResponse.json()
  
      if (userData.data._id === companyData.data.adminUser) {
        setIsAdmin(true)
      }
    } catch (error) {
      console.error("Error checking admin status:", error)
    }
  }
  

  useEffect(() => {
    if (authToken && company_id) {
      fetchAllEmployees()
      checkIfUserIsAdmin()
    }
  }, [company_id, authToken])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const full_name = e.target.full_name.value
    const job = e.target.job.value
    const salary = e.target.salary.value
    const years_worked = e.target.years_worked.value
  
    if (
      !usernameVerification(full_name) ||
      !usernameVerification(job) ||
      !isPositiveNumber(salary) ||
      !isPositiveNumber(years_worked)
    ) {
      setErrorClass("form-error")
      setErrorMessage("Invalid inputs. Please check the fields.")
      return
    }
  
    const newEmployee = {
      full_name,
      job,
      salary,
      years_worked,
      state: "Active",
      company_id: company_id,
    }
  
    try {
      const response = await fetch(
        `http://localhost:5000/api/employees/${company_id}/employees`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(newEmployee),
        }
      )
  
      if (!response.ok) {
        throw new Error("Error saving employee.")
      }
  
      const savedEmployee = await response.json()
  
      if (savedEmployee && savedEmployee.data) {
        setEmployees((prevEmployees) => [...prevEmployees, savedEmployee.data])
      }
  
      setErrorClass("no-error")
      setErrorMessage("")
      e.target.reset()
    } catch (error) {
      console.error("Error saving employee:", error)
      setErrorClass("form-error")
      setErrorMessage("Failed to save the employee. Try again.")
    }
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

      <EmployeesList
        employees={employees}
        searchQuery={searchQuery}
        setEmployees={setEmployees}
        authToken={authToken}
        company_id={company_id}
        editingEmployee={editingEmployee}
        setEditingEmployee={setEditingEmployee}
        setErrorClass={setErrorClass}
        setErrorMessage={setErrorMessage}
        isAdmin={isAdmin}
      />

      {isAdmin && !editingEmployee && (
        <>
          <h2 className="h2-title">Add Employee</h2>
          <form onSubmit={handleSubmit} className="employees-form">
            <div className="employees-form-inputs-container">
              <label className="employees-form-labels" htmlFor="full_name">
                Full Name:
              </label>
              <input
                className="employees-form-inputs"
                type="text"
                name="full_name"
                id="full_name"
                autoComplete="off"
              />
            </div>
            <div className="employees-form-inputs-container">
              <label className="employees-form-labels" htmlFor="job">
                Job:
              </label>
              <input
                className="employees-form-inputs"
                type="text"
                name="job"
                id="job"
                autoComplete="off"
              />
            </div>
            <div className="employees-form-inputs-container">
              <label className="employees-form-labels" htmlFor="salary">
                Salary:
              </label>
              <input
                className="employees-form-inputs"
                type="number"
                name="salary"
                id="salary"
                autoComplete="off"
              />
            </div>
            <div className="employees-form-inputs-container">
              <label className="employees-form-labels" htmlFor="years_worked">
                Years Worked:
              </label>
              <input
                className="employees-form-inputs"
                type="number"
                name="years_worked"
                id="years_worked"
                autoComplete="off"
              />
            </div>
            <button className="form-submit-button" type="submit">
              Add Employee
            </button>
          </form>
        </>
      )}
    </div>
  )
}

export default Employees