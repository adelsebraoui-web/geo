import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { X, UserPlus, Trash2, Shield, UserIcon } from "lucide-react";

export default function AdminPanel({ onClose }: { onClose: () => void }) {
  const { users, addUser, removeUser, currentUser } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "user">("user");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleAdd = () => {
    setError("");
    setSuccess("");
    if (!username.trim() || !password.trim()) {
      setError("Fyll i alla fält.");
      return;
    }
    if (password.length < 4) {
      setError("Lösenord måste vara minst 4 tecken.");
      return;
    }
    const ok = addUser(username.trim(), password, role);
    if (!ok) {
      setError("Användarnamnet finns redan.");
      return;
    }
    setSuccess(`Användare "${username}" skapad!`);
    setUsername("");
    setPassword("");
    setRole("user");
  };

  return (
    <div className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-12 overflow-y-auto">
      <div className="w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-secondary/50">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-base">Admin Panel</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-xl transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Add user form */}
          <div className="bg-secondary/50 rounded-2xl p-5 space-y-4 border border-border/50">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Skapa ny användare
            </h3>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Användarnamn"
              className="w-full p-3 bg-card rounded-xl text-sm border border-border outline-none focus:border-primary/30 transition-all font-medium"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Lösenord"
              className="w-full p-3 bg-card rounded-xl text-sm border border-border outline-none focus:border-primary/30 transition-all font-medium"
            />
            <div className="flex gap-2">
              {(["user", "admin"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                    role === r
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-card text-muted-foreground border border-border hover:bg-secondary"
                  }`}
                >
                  {r === "admin" ? "Admin" : "Användare"}
                </button>
              ))}
            </div>

            {error && (
              <p className="text-xs text-destructive font-semibold bg-destructive/5 py-2 px-3 rounded-xl">
                {error}
              </p>
            )}
            {success && (
              <p className="text-xs text-success font-semibold bg-success/5 py-2 px-3 rounded-xl">
                {success}
              </p>
            )}

            <button
              onClick={handleAdd}
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Lägg till användare
            </button>
          </div>

          {/* Users list */}
          <div>
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-1">
              Användare ({users.length})
            </h3>
            <div className="space-y-2">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between bg-secondary/50 border border-border/50 rounded-2xl px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-xl ${
                        u.role === "admin" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {u.role === "admin" ? <Shield className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{u.username}</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-semibold">
                        {u.role === "admin" ? "Admin" : "Användare"}
                      </p>
                    </div>
                  </div>
                  {u.id !== currentUser?.id && u.id !== "admin-default" && (
                    <button
                      onClick={() => removeUser(u.id)}
                      className="p-2 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/5 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
