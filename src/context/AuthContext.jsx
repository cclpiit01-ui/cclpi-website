import { createContext, useContext, useState, useEffect } from "react";
import { supabaseEmployees } from "@/lib/supabaseEmployees";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (authUser) => {
    if (!authUser) { setUser(null); return; }

    const { data, error } = await supabaseEmployees
      .from("profiles_with_email")
      .select("username, is_active, role_id, roles(name, role_pages(page_id, pages(name, path, icon, sort_order)))")
      .eq("id", authUser.id)
      .single();

    if (error || !data || !data.is_active) {
      await supabaseEmployees.auth.signOut();
      setUser(null);
    } else {
      // Extract allowed pages
      const allowedPages = data.roles?.role_pages
        ?.map(rp => rp.pages)
        .filter(Boolean)
        .sort((a, b) => a.sort_order - b.sort_order) || [];

      setUser({
        id: authUser.id,
        email: authUser.email,
        username: data.username,
        role: data.roles?.name,
        role_id: data.role_id,
        is_active: data.is_active,
        allowedPages, // ← list ng pages na allowed
      });
    }
  };

  useEffect(() => {
    supabaseEmployees.auth.getSession().then(({ data: { session } }) => {
      fetchProfile(session?.user ?? null).finally(() => setLoading(false));
    });

    const { data: { subscription } } = supabaseEmployees.auth.onAuthStateChange((_event, session) => {
      fetchProfile(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (emailOrUsername, password) => {
    let email = emailOrUsername;

    // Check if input is username (walang @ sign)
    if (!emailOrUsername.includes("@")) {
      const { data, error } = await supabaseEmployees
        .from("profiles_with_email")
        .select("email")
        .eq("username", emailOrUsername)
        .single();

      if (error || !data?.email) {
        throw new Error("Username not found.");
      }

      email = data.email;
    }

    const { data, error } = await supabaseEmployees.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    await supabaseEmployees.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);