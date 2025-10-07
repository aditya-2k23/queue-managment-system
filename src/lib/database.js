import { supabase, handleSupabaseError } from './supabase.js'

// Hospital Services
export const hospitalService = {
  // Create a new hospital
  async createHospital(hospitalData) {
    try {
      const { data, error } = await supabase
        .from('hospitals')
        .insert([{
          name: hospitalData.name,
          email: hospitalData.email,
          phone: hospitalData.phone,
          address: hospitalData.address,
          city: hospitalData.city,
          state: hospitalData.state,
          pincode: hospitalData.pincode,
          registration_number: hospitalData.registrationNumber
        }])
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) }
    }
  },

  // Get hospital by ID
  async getHospital(hospitalId) {
    try {
      const { data, error } = await supabase
        .from('hospitals')
        .select('*')
        .eq('id', hospitalId)
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) }
    }
  },

  // Update hospital
  async updateHospital(hospitalId, updates) {
    try {
      const { data, error } = await supabase
        .from('hospitals')
        .update(updates)
        .eq('id', hospitalId)
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) }
    }
  }
}

// Hospital Admin Services
export const adminService = {
  // Create a new hospital admin
  async createAdmin(adminData, hospitalId) {
    try {
      const { data, error } = await supabase
        .from('hospital_admins')
        .insert([{
          hospital_id: hospitalId,
          name: adminData.name,
          email: adminData.email,
          password_hash: adminData.passwordHash, // You'll need to hash this before calling
          role: adminData.role || 'admin'
        }])
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) }
    }
  },

  // Get admin by email
  async getAdminByEmail(email) {
    try {
      const { data, error } = await supabase
        .from('hospital_admins')
        .select(`
          *,
          hospitals (
            id,
            name,
            email,
            city,
            state
          )
        `)
        .eq('email', email)
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) }
    }
  }
}

// Department Services
export const departmentService = {
  // Create a new department
  async createDepartment(departmentData, hospitalId) {
    try {
      const { data, error } = await supabase
        .from('departments')
        .insert([{
          hospital_id: hospitalId,
          name: departmentData.name,
          description: departmentData.description
        }])
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) }
    }
  },

  // Get departments by hospital
  async getDepartmentsByHospital(hospitalId) {
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .eq('hospital_id', hospitalId)

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) }
    }
  }
}

// Doctor Services
export const doctorService = {
  // Create a new doctor
  async createDoctor(doctorData, hospitalId, departmentId) {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .insert([{
          hospital_id: hospitalId,
          department_id: departmentId,
          name: doctorData.name,
          specialization: doctorData.specialization,
          available_days: doctorData.availableDays,
          consultation_time: doctorData.consultationTime,
          room_number: doctorData.roomNumber,
          max_patients_per_day: doctorData.maxPatientsPerDay
        }])
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) }
    }
  },

  // Get doctors by hospital
  async getDoctorsByHospital(hospitalId) {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select(`
          *,
          departments (
            id,
            name,
            description
          )
        `)
        .eq('hospital_id', hospitalId)

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) }
    }
  },

  // Get doctors by department
  async getDoctorsByDepartment(departmentId) {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('department_id', departmentId)

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) }
    }
  }
}

// Settings Services
export const settingsService = {
  // Create hospital settings
  async createSettings(settingsData, hospitalId) {
    try {
      const { data, error } = await supabase
        .from('settings')
        .insert([{
          hospital_id: hospitalId,
          queue_type: settingsData.queueType || 'token',
          auto_assign: settingsData.autoAssign ?? true,
          notify_via_sms: settingsData.notifyViaSms ?? false
        }])
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) }
    }
  },

  // Get settings by hospital
  async getSettingsByHospital(hospitalId) {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('hospital_id', hospitalId)
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) }
    }
  }
}

// Registration Service (combines hospital + admin creation)
export const registrationService = {
  async registerHospital(hospitalData, adminData) {
    try {
      // Step 1: Create hospital
      const hospitalResult = await hospitalService.createHospital(hospitalData)
      if (!hospitalResult.success) {
        return hospitalResult
      }

      const hospitalId = hospitalResult.data.id

      // Step 2: Create admin (you'll need to hash password before this)
      const adminResult = await adminService.createAdmin(adminData, hospitalId)
      if (!adminResult.success) {
        // TODO: Consider rolling back hospital creation
        return adminResult
      }

      // Step 3: Create default settings
      const settingsResult = await settingsService.createSettings({
        queueType: 'token',
        autoAssign: true,
        notifyViaSms: false
      }, hospitalId)

      return {
        success: true,
        data: {
          hospital: hospitalResult.data,
          admin: adminResult.data,
          settings: settingsResult.success ? settingsResult.data : null
        }
      }
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) }
    }
  }
}