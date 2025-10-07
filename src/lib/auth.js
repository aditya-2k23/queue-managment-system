import { supabase, handleSupabaseError } from './supabase.js'

// Authentication Service
export const authService = {
  // Sign in with email and password
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      // Get additional admin data from hospital_admins table
      const { data: adminData, error: adminError } = await supabase
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
        .eq('id', data.user.id)
        .single()

      if (adminError) {
        console.warn('Could not fetch admin data:', adminError)
      }

      return {
        success: true,
        data: {
          user: data.user,
          session: data.session,
          adminData: adminData || null
        }
      }
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) }
    }
  },

  // Sign out
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { success: true }
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) }
    }
  },

  // Get current user session
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error) throw error

      if (!user) {
        return { success: true, data: null }
      }

      // Get additional admin data
      const { data: adminData, error: adminError } = await supabase
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
        .eq('id', user.id)
        .single()

      if (adminError) {
        console.warn('Could not fetch admin data:', adminError)
      }

      return {
        success: true,
        data: {
          user,
          adminData: adminData || null
        }
      }
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) }
    }
  },

  // Get current session
  async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      return { success: true, data: session }
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) }
    }
  },

  // Listen to auth state changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  },

  // Check if user is authenticated
  async isAuthenticated() {
    const sessionResult = await this.getSession()
    return sessionResult.success && sessionResult.data !== null
  },

  // Reset password
  async resetPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      if (error) throw error
      return { success: true }
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) }
    }
  }
}