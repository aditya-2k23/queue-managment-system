import { useEffect, useState } from 'react'
import { supabase, handleSupabaseError } from './supabase.js'

// Authentication Service
export const authService = {
  // Sign in with email and password (for admins)
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

  // Sign in as doctor
  async signInAsDoctor(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      // Get doctor data from doctors table
      const { data: doctorData, error: doctorError } = await supabase
        .from('doctors')
        .select(`
          *,
          departments (
            id,
            name,
            description
          ),
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

      if (doctorError) {
        console.error('Could not fetch doctor data:', doctorError)
        // If no doctor data found, this user might not be a doctor
        throw new Error('You are not authorized to access the doctor portal')
      }

      return {
        success: true,
        data: {
          user: data.user,
          session: data.session,
          doctorData: doctorData,
          role: 'doctor'
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

      // First try to get admin data
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

      if (!adminError && adminData) {
        return {
          success: true,
          data: {
            user,
            adminData,
            role: 'admin'
          }
        }
      }

      // If not admin, try to get doctor data
      const { data: doctorData, error: doctorError } = await supabase
        .from('doctors')
        .select(`
          *,
          departments (
            id,
            name,
            description
          ),
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

      if (!doctorError && doctorData) {
        return {
          success: true,
          data: {
            user,
            doctorData,
            role: 'doctor'
          }
        }
      }

      // User exists but has no role data
      console.warn('User has no associated role data')
      return {
        success: true,
        data: {
          user,
          adminData: null,
          doctorData: null,
          role: null
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

// Hook to use auth context
export function useAuth() {
  const [user, setUser] = useState(null);
  const [adminData, setAdminData] = useState(null);
  const [doctorData, setDoctorData] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial auth check
    checkAuth();

    // Set up auth state change listener
    const {
      data: { subscription },
    } = authService.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event);
      
      if (event === "SIGNED_OUT" || !session) {
        setUser(null);
        setAdminData(null);
        setDoctorData(null);
        setUserRole(null);
        setIsLoading(false);
      } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "INITIAL_SESSION") {
        // Re-check auth on sign in or token refresh
        await checkAuth();
      } else if (event === "USER_UPDATED") {
        // User data updated, refresh
        await checkAuth();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAuth = async () => {
    try {
      // First check if there's a session
      const sessionResult = await authService.getSession();
      
      if (!sessionResult.success || !sessionResult.data) {
        // No session found
        setUser(null);
        setAdminData(null);
        setDoctorData(null);
        setUserRole(null);
        setIsLoading(false);
        return;
      }

      // If session exists, get user details
      const result = await authService.getCurrentUser();

      if (result.success && result.data?.user) {
        setUser(result.data.user);
        setUserRole(result.data.role);
        
        if (result.data.role === 'admin') {
          setAdminData(result.data.adminData);
          setDoctorData(null);
        } else if (result.data.role === 'doctor') {
          setDoctorData(result.data.doctorData);
          setAdminData(null);
        } else {
          setAdminData(result.data.adminData);
          setDoctorData(result.data.doctorData);
        }
      } else {
        setUser(null);
        setAdminData(null);
        setDoctorData(null);
        setUserRole(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      setAdminData(null);
      setDoctorData(null);
      setUserRole(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
    setAdminData(null);
    setDoctorData(null);
    setUserRole(null);
  };

  return {
    user,
    adminData,
    doctorData,
    userRole,
    isLoading,
    signOut,
    isAuthenticated: !!user && (!!adminData || !!doctorData),
    isAdmin: userRole === 'admin',
    isDoctor: userRole === 'doctor',
  };
}
