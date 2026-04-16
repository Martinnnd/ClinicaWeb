import { useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import { STORAGE_KEY } from "./data/mock";
import { isSupabaseConfigured } from "./lib/supabase";
import { getSession, logout } from "./services/auth.service";
import { getProfileById } from "./services/profile.service";
import type { User } from "./types";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      if (!isSupabaseConfigured()) {
        const storedUser = localStorage.getItem(STORAGE_KEY);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        setLoading(false);
        return;
      }

      try {
        const session = getSession();
        if (!session) {
          setLoading(false);
          return;
        }

        const profile = await getProfileById(session.user.id, session.access_token);
        setUser(profile);
      } catch (error) {
        console.error(error);
        logout();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    void bootstrap();
  }, []);

  const handleLogout = () => {
    if (isSupabaseConfigured()) {
      logout();
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }

    setUser(null);
  };

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f5f9fc] text-slate-600">
        Cargando aplicación...
      </div>
    );
  }

  return user ? (
    <DashboardPage user={user} onLogout={handleLogout} />
  ) : (
    <LoginPage onLogin={setUser} />
  );
}
