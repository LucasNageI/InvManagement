import Company from "../models/CompanyModel.js"

class CompanyRepository {
  /**
   * Obtener todas las compañías
   * @returns {Promise<Array>} - Una lista con todas las compañías
   */
  static async findAll() {
    try {
      return await Company.find()
    } catch (error) {
      throw new Error("Error al obtener las compañías: " + error.message)
    }
  }

  /**
   * Buscar una compañía por ID
   * @param {string} id - ID de la compañía
   * @returns {Promise<Object>} - La compañía encontrada
   */
  static async findById(id) {
    try {
      return await Company.findById(id)
    } catch (error) {
      throw new Error("Error al buscar la compañía por ID: " + error.message)
    }
  }

  /**
   * Buscar una compañía por nombre
   * @param {string} businessName - Nombre de la compañía
   * @returns {Promise<Object>} - La compañía encontrada
   */
  static async findByName(businessName) {
    try {
      return await Company.findOne({ businessName })
    } catch (error) {
      throw new Error(
        "Error al buscar la compañía por nombre: " + error.message
      )
    }
  }

  /**
   * Crear una nueva compañía
   * @param {Object} companyData - Datos de la nueva compañía
   * @returns {Promise<Object>} - La compañía creada
   */
  static async create(companyData) {
    try {
      const company = new Company(companyData)
      return await company.save()
    } catch (error) {
      throw new Error("Error al crear la compañía: " + error.message)
    }
  }

  /**
   * Actualizar una compañía por ID
   * @param {string} id - ID de la compañía
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object>} - La compañía actualizada
   */
  static async updateById(id, updateData) {
    try {
      return await Company.findByIdAndUpdate(id, updateData, { new: true })
    } catch (error) {
      throw new Error("Error al actualizar la compañía: " + error.message)
    }
  }

  /**
   * Eliminar una compañía por ID
   * @param {string} id - ID de la compañía
   * @returns {Promise<Object>} - La compañía eliminada
   */
  static async deleteById(id) {
    try {
      return await Company.findByIdAndDelete(id)
    } catch (error) {
      throw new Error("Error al eliminar la compañía: " + error.message)
    }
  }

  /**
   * Agregar un empleado a la lista de empleados
   * @param {string} companyId - ID de la compañía
   * @param {Object} employeeData - Datos del empleado
   * @returns {Promise<Object>} - La compañía con el empleado agregado
   */
  static async addEmployee(companyId, employeeData) {
    try {
      return await Company.findByIdAndUpdate(
        companyId,
        { $push: { employees: employeeData } },
        { new: true }
      )
    } catch (error) {
      throw new Error("Error al agregar un empleado: " + error.message)
    }
  }

  /**
   * Agregar un ítem al inventario
   * @param {string} companyId - ID de la compañía
   * @param {Object} inventoryItem - Datos del ítem
   * @returns {Promise<Object>} - La compañía con el ítem agregado
   */
  static async addInventoryItem(companyId, inventoryItem) {
    try {
      return await Company.findByIdAndUpdate(
        companyId,
        { $push: { inventory: inventoryItem } },
        { new: true }
      )
    } catch (error) {
      throw new Error(
        "Error al agregar un ítem al inventario: " + error.message
      )
    }
  }
}

export default CompanyRepository