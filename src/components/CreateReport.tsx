import { useState } from "react";
import { Plus, Paperclip, Camera, X } from "lucide-react";

export interface Report {
  id: string;
  job: string;
  place: string;
  placeNumber: string;
  notes: string;
  schedule: string;
  attachments: { name: string; url: string; type: string }[];
  pictures: { name: string; url: string }[];
  timestamp: string;
}

const PLACES = ["Pretrim", "Trim", "Final", "Övrigt"];
const SCHEDULES = ["Planning", "Ongoing", "Done", "Delayed"];

const REPORTS_KEY = "reports_storage_v1";

export function getReports(): Report[] {
  const saved = localStorage.getItem(REPORTS_KEY);
  return saved ? JSON.parse(saved) : [];
}

function saveReports(reports: Report[]) {
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
}

export default function CreateReport({ onCreated }: { onCreated?: () => void }) {
  const [job, setJob] = useState("");
  const [place, setPlace] = useState("");
  const [placeNumber, setPlaceNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [schedule, setSchedule] = useState("");
  const [attachments, setAttachments] = useState<{ name: string; url: string; type: string }[]>([]);
  const [pictures, setPictures] = useState<{ name: string; url: string }[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "attachment" | "picture") => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const url = ev.target?.result as string;
        if (type === "attachment") {
          setAttachments((prev) => [...prev, { name: file.name, url, type: file.type }]);
        } else {
          setPictures((prev) => [...prev, { name: file.name, url }]);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removeAttachment = (idx: number) => setAttachments((prev) => prev.filter((_, i) => i !== idx));
  const removePicture = (idx: number) => setPictures((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = () => {
    if (!job.trim()) return alert("Ange ett jobbnamn.");
    if (!place) return alert("Välj en plats.");
    if (!schedule) return alert("Välj en status.");

    const report: Report = {
      id: Date.now().toString(),
      job,
      place,
      placeNumber,
      notes,
      schedule,
      attachments,
      pictures,
      timestamp: new Date().toISOString(),
    };

    const existing = getReports();
    saveReports([report, ...existing]);

    setJob("");
    setPlace("");
    setPlaceNumber("");
    setNotes("");
    setSchedule("");
    setAttachments([]);
    setPictures([]);
    onCreated?.();
    alert("Rapport skapad!");
  };

  return (
    <div className="max-w-lg mx-auto p-4 pb-20">
      <h2 className="text-xl font-bold mb-6">Skapa Rapport</h2>

      <div className="bg-card rounded-3xl shadow-sm border border-border p-5 space-y-5">
        {/* Job */}
        <div>
          <label className="text-[11px] font-bold text-muted-foreground uppercase ml-1 mb-1 block">Jobb</label>
          <input
            value={job}
            onChange={(e) => setJob(e.target.value)}
            placeholder="Jobbnamn..."
            className="w-full p-4 bg-secondary rounded-2xl outline-none focus:ring-2 ring-primary/20 border border-transparent focus:border-primary/20 font-semibold transition-all"
          />
        </div>

        {/* Place */}
        <div>
          <label className="text-[11px] font-bold text-muted-foreground uppercase ml-1 mb-1 block">Plats</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {PLACES.map((p) => (
              <button
                key={p}
                onClick={() => setPlace(p)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  place === p
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          {place && (
            <div className="mt-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1 mb-1 block">
                {place} nummer
              </label>
              <input
                type="number"
                value={placeNumber}
                onChange={(e) => setPlaceNumber(e.target.value)}
                placeholder="T.ex. 5"
                className="w-32 p-3 bg-secondary rounded-xl text-sm border border-transparent focus:bg-card focus:border-border outline-none transition-all font-semibold"
              />
              {placeNumber && (
                <span className="ml-3 text-sm font-bold text-primary">
                  {place} {placeNumber}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="text-[11px] font-bold text-muted-foreground uppercase ml-1 mb-1 block">Anteckningar</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Skriv anteckningar..."
            rows={3}
            className="w-full p-4 bg-secondary rounded-2xl outline-none focus:ring-2 ring-primary/20 border border-transparent focus:border-primary/20 transition-all resize-none"
          />
        </div>

        {/* Schedule */}
        <div>
          <label className="text-[11px] font-bold text-muted-foreground uppercase ml-1 mb-1 block">Schema</label>
          <div className="flex flex-wrap gap-2">
            {SCHEDULES.map((s) => {
              const colors: Record<string, string> = {
                Planning: "bg-info/10 text-info border-info/20",
                Ongoing: "bg-warning/10 text-warning border-warning/20",
                Done: "bg-success/10 text-success border-success/20",
                Delayed: "bg-destructive/10 text-destructive border-destructive/20",
              };
              return (
                <button
                  key={s}
                  onClick={() => setSchedule(s)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                    schedule === s
                      ? colors[s] + " shadow-md"
                      : "bg-secondary text-foreground border-transparent hover:bg-secondary/80"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Attachments */}
        <div>
          <label className="text-[11px] font-bold text-muted-foreground uppercase ml-1 mb-1 block">Bilagor</label>
          <label className="flex items-center gap-2 px-4 py-3 bg-secondary rounded-xl cursor-pointer hover:bg-secondary/80 transition-colors w-fit">
            <Paperclip className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Ladda upp filer</span>
            <input type="file" multiple className="hidden" onChange={(e) => handleFileUpload(e, "attachment")} />
          </label>
          {attachments.length > 0 && (
            <div className="mt-2 space-y-1">
              {attachments.map((a, i) => (
                <div key={i} className="flex items-center justify-between bg-secondary/50 px-3 py-2 rounded-lg text-xs">
                  <span className="truncate flex-1">{a.name}</span>
                  <button onClick={() => removeAttachment(i)} className="text-muted-foreground hover:text-destructive ml-2">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pictures */}
        <div>
          <label className="text-[11px] font-bold text-muted-foreground uppercase ml-1 mb-1 block">Bilder</label>
          <label className="flex items-center gap-2 px-4 py-3 bg-secondary rounded-xl cursor-pointer hover:bg-secondary/80 transition-colors w-fit">
            <Camera className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Ladda upp bilder</span>
            <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFileUpload(e, "picture")} />
          </label>
          {pictures.length > 0 && (
            <div className="mt-2 grid grid-cols-3 gap-2">
              {pictures.map((p, i) => (
                <div key={i} className="relative group">
                  <img src={p.url} alt={p.name} className="w-full h-20 object-cover rounded-xl border border-border" />
                  <button
                    onClick={() => removePicture(i)}
                    className="absolute top-1 right-1 bg-card/80 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3 text-destructive" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold text-sm hover:opacity-90 active:scale-[0.98] shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Skapa Rapport
        </button>
      </div>
    </div>
  );
}
