import { useState } from "react";
import { Wrench, FileText, FolderOpen, Shield, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import ShimsCalculator from "@/components/ShimsCalculator";
import CreateReport from "@/components/CreateReport";
import ReportsView from "@/components/ReportsView";
import AdminPanel from "@/components/AdminPanel";
import volvoLogo from "@/assets/volvo-logo.png";

const TABS = [
  { id: "shims", label: "Shimning", icon: Wrench },
  { id: "create", label: "Skapa Rapport", icon: FileText },
  { id: "reports", label: "Rapporter", icon: FolderOpen },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function Index() {
  const { currentUser, logout, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>("shims");
  const [reportKey, setReportKey] = useState(0);
  const [showAdmin, setShowAdmin] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-[hsl(215,25%,12%)] text-white">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={volvoLogo} alt="Volvo" className="h-10 brightness-0 invert opacity-80" />
            <div>
              <h1 className="text-sm font-extrabold tracking-wide">
                Geometry Analys Support
              </h1>
              <p className="text-[9px] text-white/40 uppercase tracking-[0.25em] font-semibold">
                Volvo Cars
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {isAdmin && (
              <button
                onClick={() => setShowAdmin(true)}
                className="p-2.5 rounded-xl hover:bg-white/10 transition-colors"
                title="Admin"
              >
                <Shield className="w-4 h-4 text-white/60" />
              </button>
            )}
            <button
              onClick={logout}
              className="p-2.5 rounded-xl hover:bg-white/10 transition-colors"
              title="Logga ut"
            >
              <LogOut className="w-4 h-4 text-white/60" />
            </button>
          </div>
        </div>
      </div>

      {/* Shimmer accent line */}
      <div className="shimmer-row h-1" />

      {/* Tabs */}
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-lg mx-auto flex">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === "reports") setReportKey((k) => k + 1);
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-bold uppercase tracking-wide transition-all border-b-2 ${
                  active
                    ? "text-primary border-primary"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Welcome bar */}
      <div className="max-w-lg mx-auto px-4 py-2">
        <p className="text-[10px] text-muted-foreground">
          Inloggad som <span className="font-bold text-foreground">{currentUser?.username}</span>
        </p>
      </div>

      {/* Content */}
      <div>
        {activeTab === "shims" && <ShimsCalculator />}
        {activeTab === "create" && (
          <CreateReport onCreated={() => setReportKey((k) => k + 1)} />
        )}
        {activeTab === "reports" && <ReportsView key={reportKey} />}
      </div>

      {/* Admin panel overlay */}
      {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}
    </div>
  );
}
