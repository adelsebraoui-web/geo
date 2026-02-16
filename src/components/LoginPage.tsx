import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Lock, User } from "lucide-react";
import volvoLogo from "@/assets/volvo-logo.png";

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password.trim()) {
      setError("Fyll i alla fält.");
      return;
    }
    const ok = login(username.trim(), password);
    if (!ok) {
      setError("Fel användarnamn eller lösenord.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(215,25%,10%)] via-[hsl(220,20%,15%)] to-[hsl(215,25%,10%)] flex flex-col items-center justify-center p-6">
      {/* Volvo iron mark */}
      <div className="mb-8 flex flex-col items-center gap-4">
        <img src={volvoLogo} alt="Volvo Cars" className="h-14 brightness-0 invert opacity-90" />
        <div className="text-center">
          <h1 className="text-2xl font-extrabold tracking-tight text-white/95">
            Geometry Analys Support
          </h1>
          <p className="text-xs text-white/40 uppercase tracking-[0.3em] mt-1 font-semibold">
            Volvo Cars
          </p>
        </div>
      </div>

      {/* Login card */}
      <form
        onSubmit={handleLogin}
        className={`w-full max-w-sm bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-5 shadow-2xl ${
          shake ? "animate-shake" : ""
        }`}
      >
        <div>
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider ml-1 mb-2 block">
            Användarnamn
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ange användarnamn"
              autoComplete="username"
              className="w-full pl-11 pr-4 py-4 bg-white/[0.06] border border-white/10 rounded-2xl text-white placeholder:text-white/20 outline-none focus:border-white/30 focus:bg-white/[0.08] transition-all text-sm font-medium"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider ml-1 mb-2 block">
            Lösenord
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ange lösenord"
              autoComplete="current-password"
              className="w-full pl-11 pr-4 py-4 bg-white/[0.06] border border-white/10 rounded-2xl text-white placeholder:text-white/20 outline-none focus:border-white/30 focus:bg-white/[0.08] transition-all text-sm font-medium"
            />
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-400 font-semibold text-center bg-red-400/10 py-2 rounded-xl">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full bg-white text-[hsl(215,25%,12%)] py-4 rounded-2xl font-bold text-sm hover:bg-white/90 active:scale-[0.98] transition-all shadow-lg"
        >
          Logga in
        </button>
      </form>

      <p className="mt-8 text-[10px] text-white/20 uppercase tracking-widest">
        © {new Date().getFullYear()} Volvo Car Corporation
      </p>
    </div>
  );
}
