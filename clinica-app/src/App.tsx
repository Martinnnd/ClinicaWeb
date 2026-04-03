import { useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import { STORAGE_KEY } from "./data/mock";
import type { User } from "./types";

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return user ? (
    <DashboardPage user={user} onLogout={handleLogout} />
  ) : (
    <LoginPage onLogin={setUser} />
  );
}