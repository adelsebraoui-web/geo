import { useState, useEffect } from "react";
import { getReports, type Report } from "./CreateReport";
import { ChevronDown, ChevronUp, Trash2, FileText, Image as ImageIcon, X } from "lucide-react";

const REPORTS_KEY = "reports_storage_v1";

const scheduleColors: Record<string, string> = {
  Planning: "bg-info/10 text-info",
  Ongoing: "bg-warning/10 text-warning",
  Done: "bg-success/10 text-success",
  Delayed: "bg-destructive/10 text-destructive",
};

export default function ReportsView() {
  const [reports, setReports] = useState<Report[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [viewImage, setViewImage] = useState<string | null>(null);

  useEffect(() => {
    setReports(getReports());
  }, []);

  const toggleExpand = (id: string) => {
    const next = new Set(expandedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpandedIds(next);
  };

  const removeReport = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Vill du radera denna rapport?")) return;
    const updated = reports.filter((r) => r.id !== id);
    setReports(updated);
    localStorage.setItem(REPORTS_KEY, JSON.stringify(updated));
  };

  return (
    <div className="max-w-lg mx-auto p-4 pb-20">
      <h2 className="text-xl font-bold mb-6">Rapporter</h2>

      {reports.length === 0 && (
        <div className="text-center py-12 bg-card rounded-3xl border border-dashed border-border">
          <p className="text-muted-foreground text-sm italic">Inga rapporter skapade ännu.</p>
        </div>
      )}

      <div className="space-y-4">
        {reports.map((r) => {
          const isExpanded = expandedIds.has(r.id);
          return (
            <div
              key={r.id}
              onClick={() => toggleExpand(r.id)}
              className="log-card bg-card border border-border rounded-3xl p-5 shadow-sm cursor-pointer hover:border-primary/20 overflow-hidden"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-foreground text-base">{r.job}</h3>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground/40" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground/40" />
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase mt-0.5">
                    {new Date(r.timestamp).toLocaleDateString("sv-SE", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <button
                  onClick={(e) => removeReport(e, r.id)}
                  className="p-2 text-muted-foreground/30 hover:text-destructive hover:bg-destructive/5 rounded-lg transition-colors z-10"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {/* Summary row */}
              <div className="flex flex-wrap gap-2">
                <span className="text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">
                  {r.place} {r.placeNumber}
                </span>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${scheduleColors[r.schedule] || "bg-secondary text-foreground"}`}>
                  {r.schedule}
                </span>
                {r.attachments.length > 0 && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <FileText className="w-3 h-3" /> {r.attachments.length}
                  </span>
                )}
                {r.pictures.length > 0 && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" /> {r.pictures.length}
                  </span>
                )}
              </div>

              {isExpanded && (
                <div className="mt-5 pt-5 border-t border-secondary space-y-4">
                  {r.notes && (
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Anteckningar</span>
                      <p className="text-sm text-foreground/80 bg-secondary p-3 rounded-xl">{r.notes}</p>
                    </div>
                  )}

                  {r.attachments.length > 0 && (
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Bilagor</span>
                      <div className="space-y-1">
                        {r.attachments.map((a, i) => (
                          <a
                            key={i}
                            href={a.url}
                            download={a.name}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-2 text-xs text-primary bg-primary/5 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors"
                          >
                            <FileText className="w-3 h-3" />
                            {a.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {r.pictures.length > 0 && (
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Bilder</span>
                      <div className="grid grid-cols-3 gap-2">
                        {r.pictures.map((p, i) => (
                          <img
                            key={i}
                            src={p.url}
                            alt={p.name}
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewImage(p.url);
                            }}
                            className="w-full h-20 object-cover rounded-xl border border-border cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Image lightbox */}
      {viewImage && (
        <div
          className="fixed inset-0 bg-foreground/80 z-50 flex items-center justify-center p-4"
          onClick={() => setViewImage(null)}
        >
          <button className="absolute top-4 right-4 text-card p-2" onClick={() => setViewImage(null)}>
            <X className="w-8 h-8" />
          </button>
          <img src={viewImage} alt="Preview" className="max-w-full max-h-full rounded-2xl object-contain" />
        </div>
      )}
    </div>
  );
}
