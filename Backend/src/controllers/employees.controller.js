import Employee from "../models/EmployeeModel.js"
import Company from "../models/CompanyModel.js"
import ResponseBuilder from "../helpers/builders/responseBuilder.js"

export const createEmployeeController = async (req, res) => {
  const responseBuilder = new ResponseBuilder()
  try {
    const { full_name, job, salary, years_worked, state, company_id } = req.body

    if (
      !full_name ||
      !job ||
      !salary ||
      !years_worked ||
      !state ||
      !company_id
    ) {
      return res.status(400).json(responseBuilder
          .setOk(false)
          .setMessage("All fields are required.")
          .setCode("MISSING_FIELDS")
          .build()
      )
    }

    const company = await Company.findById(company_id)
    if (!company) {
      return res.status(404).json(responseBuilder
          .setOk(false)
          .setMessage("Company not found.")
          .setCode("COMPANY_NOT_FOUND")
          .build()
      )
    }

    const newEmployee = new Employee({
      full_name,
      job,
      salary,
      years_worked,
      state,
      company_id,
    })

    const savedEmployee = await newEmployee.save()
    return res.status(201).json(responseBuilder
        .setOk(true)
        .setMessage("Employee created successfully.")
        .setData(savedEmployee)
        .setCode("EMPLOYEE_CREATED")
        .build()
    )
  } catch (error) {
    console.error("Error creating employee:", error)
    return res.status(500).json(responseBuilder
        .setOk(false)
        .setMessage("Failed to create employee.")
        .setCode("SERVER_ERROR")
        .build()
    )
  }
}

export const updateEmployeeController = async (req, res) => {
  const responseBuilder = new ResponseBuilder()
  try {
    const { company_id, id } = req.params
    const { full_name, job, salary, years_worked, state } = req.body

    if (!full_name || !job || !salary || !years_worked || !state) {
      return res.status(400).json(responseBuilder
          .setOk(false)
          .setMessage("All fields are required.")
          .setCode("MISSING_FIELDS")
          .build()
      )
    }

    if (salary < 0 || years_worked < 0) {
      return res.status(400).json(responseBuilder
          .setOk(false)
          .setMessage("Salary and years worked must be positive numbers.")
          .setCode("INVALID_FIELDS")
          .build()
      )
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      { full_name, job, salary, years_worked, state, company_id },
      { new: true, runValidators: true }
    )

    if (!updatedEmployee) {
      return res.status(404).json(responseBuilder
          .setOk(false)
          .setMessage("Employee not found.")
          .setCode("EMPLOYEE_NOT_FOUND")
          .build()
      )
    }

    return res.status(200).json(responseBuilder
        .setOk(true)
        .setMessage("Employee updated successfully.")
        .setData(updatedEmployee)
        .setCode("EMPLOYEE_UPDATED")
        .build()
    )
  } catch (error) {
    console.error("Error updating employee:", error)
    return res.status(500).json(responseBuilder
        .setOk(false)
        .setMessage("Failed to update employee.")
        .setCode("SERVER_ERROR")
        .build()
    )
  }
}

export const getEmployeesByCompany = async (req, res) => {
  const responseBuilder = new ResponseBuilder()
  const { company_id } = req.params

  try {
    const employees = await Employee.find({ company_id })

    if (!employees || employees.length === 0) {
      return res.status(404).json(responseBuilder
          .setOk(false)

          .setMessage("No employees found for this company.")
          .setCode("NO_EMPLOYEES")
          .build()
      )
    }

    return res.status(200).json(responseBuilder
        .setOk(true)
        .setData(employees)
        .setCode("EMPLOYEES_FOUND")
        .build()
    )
  } catch (error) {
    console.error("Error fetching employees:", error)
    return res.status(500).json(responseBuilder
        .setOk(false)
        .setMessage("Failed to fetch employees.")
        .setCode("SERVER_ERROR")
        .build()
    )
  }
}

export const deleteEmployeeController = async (req, res) => {
  const responseBuilder = new ResponseBuilder()
  try {
    const { id } = req.params

    const deletedEmployee = await Employee.findByIdAndDelete(id)

    if (!deletedEmployee) {
      return res.status(404).json(responseBuilder
          .setOk(false)
          .setMessage("Employee not found.")
          .setCode("EMPLOYEE_NOT_FOUND")
          .build()
      )
    }

    return res.status(200).json(responseBuilder
        .setOk(true)
        .setMessage("Employee deleted successfully.")
        .setCode("EMPLOYEE_DELETED")
        .build()
    )
  } catch (error) {
    console.error("Error deleting employee:", error)
    return res.status(500).json(responseBuilder
        .setOk(false)
        .setMessage("Failed to delete employee.")
        .setCode("SERVER_ERROR")
        .build()
    )
  }
}