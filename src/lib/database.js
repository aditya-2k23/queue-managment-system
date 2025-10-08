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
  // Create a new hospital admin with Supabase Auth
  async createAdmin(adminData, hospitalId) {
    try {
      // Step 1: Create user in Supabase Auth
      const { data: authUser, error: authError } = await supabase.auth.signUp({
        email: adminData.email,
        password: adminData.password, // Use raw password for auth
        options: {
          data: {
            name: adminData.name,
            role: 'hospital_admin',
            hospital_id: hospitalId
          }
        }
      })

      if (authError) {
        console.error('Auth user creation failed:', authError)
        throw authError
      }

      // Step 2: Create admin record in hospital_admins table
      const { data, error } = await supabase
        .from('hospital_admins')
        .insert([{
          id: authUser.user.id, // Use auth user ID as primary key
          hospital_id: hospitalId,
          name: adminData.name,
          email: adminData.email,
          password_hash: adminData.passwordHash, // Keep hashed password for backup
          role: adminData.role || 'admin'
        }])
        .select()
        .single()

      if (error) throw error

      return {
        success: true,
        data: {
          ...data,
          auth_user: authUser.user
        }
      }
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
  },

  // Update a department
  async updateDepartment(departmentId, updates) {
    try {
      const { data, error } = await supabase
        .from('departments')
        .update({
          name: updates.name,
          description: updates.description
        })
        .eq('id', departmentId)
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) }
    }
  },

  // Delete a department (consider soft delete later)
  async deleteDepartment(departmentId) {
    try {
      const { error } = await supabase
        .from('departments')
        .delete()
        .eq('id', departmentId)

      if (error) throw error
      return { success: true }
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) }
    }
  }
}

// Doctor Services
export const doctorService = {
  // Create a new doctor with Supabase Auth (requires admin re-authentication)
  async createDoctor(doctorData, hospitalId, departmentId, adminCredentials = null) {
    try {
      // Step 1: Create user in Supabase Auth
      const { data: authUser, error: authError } = await supabase.auth.signUp({
        email: doctorData.email,
        password: doctorData.password, // Temporary password, doctor should change it
        options: {
          data: {
            name: doctorData.name,
            role: 'doctor',
            hospital_id: hospitalId,
            department_id: departmentId
          }
        }
      })

      if (authError) {
        console.error('Doctor auth user creation failed:', authError)
        throw authError
      }

      // Step 2: Create doctor record in doctors table
      const { data, error } = await supabase
        .from('doctors')
        .insert([{
          id: authUser.user.id, // Use auth user ID as primary key
          hospital_id: hospitalId,
          department_id: departmentId,
          name: doctorData.name,
          email: doctorData.email,
          specialization: doctorData.specialization,
          available_days: doctorData.availableDays,
          consultation_time: doctorData.consultationTime,
          room_number: doctorData.roomNumber,
          max_patients_per_day: doctorData.maxPatientsPerDay
        }])
        .select()
        .single()

      if (error) throw error

      // Step 3: Re-authenticate admin if credentials provided
      if (adminCredentials?.email && adminCredentials?.password) {
        const { error: reAuthError } = await supabase.auth.signInWithPassword({
          email: adminCredentials.email,
          password: adminCredentials.password
        })

        if (reAuthError) {
          console.error('Admin re-authentication failed:', reAuthError)
          throw new Error('Doctor created but admin re-authentication failed. Please login again.')
        }
      }

      return {
        success: true,
        data: {
          ...data,
          auth_user: authUser.user
        },
        needsReAuth: !adminCredentials // Indicates if admin needs to re-authenticate
      }
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) }
    }
  },

  // Update doctor
  async updateDoctor(doctorId, updates) {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .update(updates)
        .eq('id', doctorId)
        .select(`
          *,
          departments (
            id,
            name,
            description
          )
        `)
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) }
    }
  },

  // Delete doctor (also removes auth user)
  async deleteDoctor(doctorId) {
    try {
      // Note: In production, you might want to soft delete or archive
      // For now, we'll just delete from doctors table
      // Supabase Auth user deletion requires admin privileges

      const { error } = await supabase
        .from('doctors')
        .delete()
        .eq('id', doctorId)

      if (error) throw error
      return { success: true }
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

// Queue Services
export const queueService = {
  // Get queue by doctor and date
  async getQueueByDoctorAndDate(doctorId, date) {
    try {
      const { data, error } = await supabase
        .from('queue')
        .select(`
          *,
          patients (
            name,
            phone,
            email
          )
        `)
        .eq('doctor_id', doctorId)
        .eq('appointment_date', date)
        .order('token_number', { ascending: true })

      if (error) throw error

      // Transform data to flatten patient info
      const transformedData = data.map(item => ({
        ...item,
        patient_name: item.patients?.name || 'N/A',
        patient_phone: item.patients?.phone || 'N/A',
        patient_email: item.patients?.email || 'N/A'
      }))

      return { success: true, data: transformedData }
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) }
    }
  },

  // Update queue status
  async updateQueueStatus(queueId, status) {
    try {
      const { data, error } = await supabase
        .from('queue')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', queueId)
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) }
    }
  },

  // Get queue statistics for a doctor
  async getQueueStats(doctorId, date) {
    try {
      const { data, error } = await supabase
        .from('queue')
        .select('status')
        .eq('doctor_id', doctorId)
        .eq('appointment_date', date)

      if (error) throw error

      const stats = {
        total: data.length,
        waiting: data.filter(item => item.status === 'waiting').length,
        inProgress: data.filter(item => item.status === 'in-progress').length,
        completed: data.filter(item => item.status === 'completed').length,
        noShow: data.filter(item => item.status === 'no-show').length
      }

      return { success: true, data: stats }
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) }
    }
  },

  // Create new queue entry
  async createQueueEntry(queueData) {
    try {
      const { data, error } = await supabase
        .from('queue')
        .insert([{
          doctor_id: queueData.doctorId,
          patient_id: queueData.patientId,
          appointment_date: queueData.appointmentDate,
          appointment_time: queueData.appointmentTime,
          token_number: queueData.tokenNumber,
          status: queueData.status || 'waiting',
          notes: queueData.notes
        }])
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) }
    }
  },

  // Get next available token number
  async getNextTokenNumber(doctorId, date) {
    try {
      const { data, error } = await supabase
        .from('queue')
        .select('token_number')
        .eq('doctor_id', doctorId)
        .eq('appointment_date', date)
        .order('token_number', { ascending: false })
        .limit(1)

      if (error) throw error

      const nextToken = data.length > 0 ? data[0].token_number + 1 : 1
      return { success: true, data: nextToken }
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) }
    }
  }
}

// Patient Services
export const patientService = {
  // Create a new patient
  async createPatient(patientData) {
    try {
      const { data, error } = await supabase
        .from('patients')
        .insert([{
          name: patientData.name,
          phone: patientData.phone,
          email: patientData.email,
          date_of_birth: patientData.dateOfBirth,
          gender: patientData.gender,
          address: patientData.address
        }])
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) }
    }
  },

  // Get patient by phone
  async getPatientByPhone(phone) {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('phone', phone)
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) }
    }
  },

  // Get patient by ID
  async getPatient(patientId) {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', patientId)
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

      // Step 2: Create admin with auth (pass both raw password and hash)
      const adminPayload = {
        ...adminData,
        password: adminData.rawPassword // Add raw password for auth
      }

      const adminResult = await adminService.createAdmin(adminPayload, hospitalId)
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