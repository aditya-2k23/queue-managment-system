import { useEffect, useState } from 'react'
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

// Hook to use auth context
export function useAuth() {
  const [user, setUser] = useState(null);
  const [adminData, setAdminData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();

    const {
      data: { subscription },
    } = authService.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        setUser(null);
        setAdminData(null);
      } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        await checkAuth();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAuth = async () => {
    try {
      const result = await authService.getCurrentUser();

      if (result.success && result.data?.user) {
        setUser(result.data.user);
        setAdminData(result.data.adminData);
      } else {
        setUser(null);
        setAdminData(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      setAdminData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
    setAdminData(null);
  };

  return {
    user,
    adminData,
    isLoading,
    signOut,
    isAuthenticated: !!user && !!adminData,
  };
}
