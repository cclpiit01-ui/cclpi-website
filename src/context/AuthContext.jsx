import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch admin profile (username + role) from admin_profiles table
  const fetchProfile = async (authUser) => {
    if (!authUser) { setUser(null); return; }

    const { data, error } = await supabase
      .from("admin_profiles")
      .select("username, role")
      .eq("id", authUser.id)
      .single();

    if (error || !data) {
      await supabase.auth.signOut();
      setUser(null);
    } else {
      setUser({
        id: authUser.id,
        email: authUser.email,
        username: data.username,
        role: data.role,
      });
    }
  };

  useEffect(() => {
    // Check existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      fetchProfile(session?.user ?? null).finally(() => setLoading(false));
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      fetchProfile(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
