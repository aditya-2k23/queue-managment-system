import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { authService } from "@/lib/auth";

// Loading component
const LoadingScreen = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

// Protected Route Component
export function ProtectedRoute({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    checkAuth();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = authService.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        setUser(null);
        setAdminData(null);
        setIsLoading(false);
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

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!adminData) {
    // User exists but is not a hospital admin
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-xl font-semibold text-foreground mb-2">
            Access Denied
          </h1>
          <p className="text-muted-foreground mb-4">
            This area is restricted to hospital administrators only.
          </p>
          <button
            onClick={() => authService.signOut()}
            className="text-primary hover:underline"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  // Clone children and pass auth data as props
  return typeof children === "function"
    ? children({ user, adminData })
    : children;
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
