import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: string;
  username: string;
  password: string;
  role: "admin" | "user";
  createdAt: string;
}

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addUser: (username: string, password: string, role: "admin" | "user") => boolean;
  removeUser: (id: string) => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const USERS_KEY = "gas_users_v1";
const SESSION_KEY = "gas_session_v1";

const DEFAULT_ADMIN: User = {
  id: "admin-default",
  username: "admin",
  password: "admin123",
  role: "admin",
  createdAt: new Date().toISOString(),
};

function getStoredUsers(): User[] {
  const saved = localStorage.getItem(USERS_KEY);
  if (saved) return JSON.parse(saved);
  // Seed default admin
  const initial = [DEFAULT_ADMIN];
  localStorage.setItem(USERS_KEY, JSON.stringify(initial));
  return initial;
}

function storeUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(getStoredUsers);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const sessionId = localStorage.getItem(SESSION_KEY);
    if (sessionId) {
      const u = getStoredUsers().find((u) => u.id === sessionId);
      if (u) setCurrentUser(u);
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const u = users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );
    if (u) {
      setCurrentUser(u);
      localStorage.setItem(SESSION_KEY, u.id);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const addUser = (username: string, password: string, role: "admin" | "user"): boolean => {
    if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) return false;
    const newUser: User = {
      id: Date.now().toString(),
      username,
      password,
      role,
      createdAt: new Date().toISOString(),
    };
    const updated = [...users, newUser];
    setUsers(updated);
    storeUsers(updated);
    return true;
  };

  const removeUser = (id: string) => {
    if (id === "admin-default") return; // Can't remove default admin
    const updated = users.filter((u) => u.id !== id);
    setUsers(updated);
    storeUsers(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        login,
        logout,
        addUser,
        removeUser,
        isAdmin: currentUser?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
