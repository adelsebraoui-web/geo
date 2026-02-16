import { useState, useEffect, useMemo } from "react";
import { Clipboard, Trash2, Download, ChevronDown, ChevronUp, Save } from "lucide-react";

interface ShimLog {
  id: string;
  machineId: string;
  before: { x: string; y: string; z: string };
  after: { x: string; y: string; z: string };
  delta: { x: string; y: string; z: string };
  note: string;
  timestamp: string;
}

const STORAGE_KEY = "shims_storage_v1";

export default function ShimsCalculator() {
  const [logs, setLogs] = useState<ShimLog[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [machineId, setMachineId] = useState("");
  const [note, setNote] = useState("");
  const [before, setBefore] = useState({ x: "", y: "", z: "" });
  const [after, setAfter] = useState({ x: "", y: "", z: "" });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setLogs(JSON.parse(saved));
  }, []);

  const delta = useMemo(() => {
    const diff = (a: string, b: string) => {
      const res = (parseFloat(a || "0") - parseFloat(b || "0")).toFixed(2);
      return isNaN(parseFloat(res)) ? "0.00" : res;
    };
    return { x: diff(after.x, before.x), y: diff(after.y, before.y), z: diff(after.z, before.z) };
  }, [before, after]);

  const saveEntry = () => {
    if (!machineId.trim()) return alert("Vänligen ange ett Maskin-ID.");
    const entry: ShimLog = {
      id: Date.now().toString(),
      machineId,
      before,
      after,
      delta,
      note,
      timestamp: new Date().toISOString(),
    };
    const newLogs = [entry, ...logs];
    setLogs(newLogs);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newLogs));
    setMachineId("");
    setNote("");
    setBefore({ x: "", y: "", z: "" });
    setAfter({ x: "", y: "", z: "" });
  };

  const removeLog = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Vill du radera denna mätning?")) return;
    const newLogs = logs.filter((l) => l.id !== id);
    setLogs(newLogs);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newLogs));
  };

  const toggleExpand = (id: string) => {
    const next = new Set(expandedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpandedIds(next);
  };

  const exportToText = () => {
    if (logs.length === 0) return alert("Det finns ingen data att exportera.");
    let content = "Shimslogg Geometri - Data\n==========================\n\n";
    logs.forEach((log, index) => {
      const date = new Date(log.timestamp).toLocaleString("sv-SE");
      content += `MÄTNING #${logs.length - index}\nDatum: ${date}\nMaskin-ID: ${log.machineId}\n--------------------------\nVÄRDEN (mm):\n`;
      ["x", "y", "z"].forEach((a) => {
        content += `${a.toUpperCase()}: Före: ${log.before[a as keyof typeof log.before] || "0.00"} | Efter: ${log.after[a as keyof typeof log.after] || "0.00"} | Diff: ${log.delta[a as keyof typeof log.delta]}\n`;
      });
      if (log.note) content += `Notering: ${log.note}\n`;
      content += `\n**************************\n\n`;
    });
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `shimslogg_export_${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-md mx-auto p-4 pb-20">
      <header className="flex items-center justify-between mb-8 pt-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2.5 rounded-xl text-primary-foreground shadow-lg">
            <Clipboard className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight">Geometry Analys Support</h1>
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest">Shims-uträknare</p>
          </div>
        </div>
        <span className="text-[10px] bg-warning/10 text-warning font-bold px-2 py-1 rounded-full uppercase tracking-tighter">
          Lokal Lagring
        </span>
      </header>

      {/* Input section */}
      <div className="bg-card rounded-3xl shadow-sm border border-border p-5 mb-8">
        <div className="mb-5">
          <label className="text-[11px] font-bold text-muted-foreground uppercase ml-1 mb-1 block">Identifiering</label>
          <input
            value={machineId}
            onChange={(e) => setMachineId(e.target.value)}
            placeholder="T.ex. Motor 04 / Pump B"
            className="w-full p-4 bg-secondary rounded-2xl outline-none focus:ring-2 ring-primary/20 border border-transparent focus:border-primary/20 font-semibold transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-muted-foreground uppercase ml-1 block">Före (mm)</label>
            {(["x", "y", "z"] as const).map((a) => (
              <div key={a} className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground/50 uppercase">{a}</span>
                <input
                  type="number"
                  step="0.01"
                  value={before[a]}
                  onChange={(e) => setBefore({ ...before, [a]: e.target.value })}
                  className="w-full pl-7 p-3 bg-secondary rounded-xl text-sm border border-transparent focus:bg-card focus:border-border outline-none transition-all"
                />
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-primary uppercase ml-1 block">Efter (mm)</label>
            {(["x", "y", "z"] as const).map((a) => (
              <div key={a} className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-primary/30 uppercase">{a}</span>
                <input
                  type="number"
                  step="0.01"
                  value={after[a]}
                  onChange={(e) => setAfter({ ...after, [a]: e.target.value })}
                  className="w-full pl-7 p-3 bg-primary/5 rounded-xl text-sm border border-transparent focus:bg-card focus:border-primary/10 outline-none transition-all text-primary font-medium"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2 border-t border-secondary">
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Lägg till en notering..."
            className="flex-1 p-2 text-sm outline-none bg-transparent placeholder:text-muted-foreground/40"
          />
          <button
            onClick={saveEntry}
            className="bg-primary text-primary-foreground p-4 rounded-2xl hover:opacity-90 active:scale-90 shadow-lg transition-all"
          >
            <Save className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* History */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Senaste mätningar</h2>
          <button
            onClick={exportToText}
            className="flex items-center gap-1.5 text-[10px] font-bold text-primary bg-primary/5 px-3 py-1.5 rounded-full hover:bg-primary/10 transition-colors"
          >
            <Download className="w-4 h-4" />
            EXPORTERA DATA
          </button>
        </div>

        {logs.length === 0 && (
          <div className="text-center py-12 bg-card rounded-3xl border border-dashed border-border">
            <p className="text-muted-foreground text-sm italic">Inga loggar sparade ännu.</p>
          </div>
        )}

        {logs.map((log) => {
          const isExpanded = expandedIds.has(log.id);
          return (
            <div
              key={log.id}
              onClick={() => toggleExpand(log.id)}
              className="log-card bg-card border border-border rounded-3xl p-5 shadow-sm cursor-pointer hover:border-primary/20 overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-foreground text-base">{log.machineId}</h3>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground/40" /> : <ChevronDown className="w-4 h-4 text-muted-foreground/40" />}
                  </div>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase mt-0.5">
                    {new Date(log.timestamp).toLocaleDateString("sv-SE", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <button onClick={(e) => removeLog(e, log.id)} className="p-2 text-muted-foreground/30 hover:text-destructive hover:bg-destructive/5 rounded-lg transition-colors z-10">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {(["x", "y", "z"] as const).map((axis) => (
                  <div key={axis} className="bg-secondary/80 rounded-2xl p-3 text-center border border-border/50">
                    <span className="text-[9px] font-bold uppercase text-muted-foreground block mb-1">{axis} (Δ)</span>
                    <span className={`text-sm font-mono font-bold ${parseFloat(log.delta[axis]) > 0 ? "text-success" : parseFloat(log.delta[axis]) < 0 ? "text-destructive" : "text-muted-foreground/30"}`}>
                      {parseFloat(log.delta[axis]) > 0 ? "+" : ""}
                      {log.delta[axis]}
                    </span>
                  </div>
                ))}
              </div>

              {isExpanded && (
                <div className="mt-5 pt-5 border-t border-secondary">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight block">Före</span>
                      {(["x", "y", "z"] as const).map((axis) => (
                        <div key={axis} className="flex justify-between items-center text-xs bg-secondary px-3 py-1.5 rounded-lg">
                          <span className="text-muted-foreground/40 uppercase font-bold text-[9px]">{axis}</span>
                          <span className="font-mono text-foreground/70">{log.before[axis] || "0.00"}</span>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-tight block text-right">Efter</span>
                      {(["x", "y", "z"] as const).map((axis) => (
                        <div key={axis} className="flex justify-between items-center text-xs bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10">
                          <span className="text-primary/30 uppercase font-bold text-[9px]">{axis}</span>
                          <span className="font-mono text-primary font-medium">{log.after[axis] || "0.00"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {log.note && (
                    <div className="mt-4 p-3 bg-warning/5 rounded-2xl border border-warning/10">
                      <p className="text-[11px] text-warning leading-relaxed italic">"{log.note}"</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
