import { useState } from "react";
import { motion } from "framer-motion";
import { Pill, Clock, Check, Plus, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Medicine {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  times: { time: string; taken: boolean }[];
  startDate: string;
  endDate: string;
  remaining: number;
  total: number;
}

const initialMedicines: Medicine[] = [
  {
    id: 1, name: "Amoxicillin", dosage: "500mg", frequency: "3x daily",
    times: [
      { time: "8:00 AM", taken: true },
      { time: "2:00 PM", taken: false },
      { time: "8:00 PM", taken: false },
    ],
    startDate: "Feb 24", endDate: "Mar 3", remaining: 4, total: 7,
  },
  {
    id: 2, name: "Metformin", dosage: "850mg", frequency: "2x daily",
    times: [
      { time: "9:00 AM", taken: true },
      { time: "9:00 PM", taken: false },
    ],
    startDate: "Feb 20", endDate: "Ongoing", remaining: 28, total: 30,
  },
  {
    id: 3, name: "Vitamin D3", dosage: "60,000 IU", frequency: "Weekly",
    times: [{ time: "10:00 AM", taken: false }],
    startDate: "Feb 10", endDate: "Mar 10", remaining: 2, total: 4,
  },
];

const MedicineTracker = () => {
  const [medicines, setMedicines] = useState<Medicine[]>(initialMedicines);

  const markTaken = (medId: number, timeIndex: number) => {
    setMedicines((prev) =>
      prev.map((m) =>
        m.id === medId
          ? { ...m, times: m.times.map((t, i) => (i === timeIndex ? { ...t, taken: true } : t)) }
          : m
      )
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Medicine Tracker</h1>
          <p className="text-muted-foreground mt-1">Track your daily doses and stay on schedule</p>
        </div>
        <Button className="gap-2 gradient-primary border-0 text-primary-foreground hover:opacity-90">
          <Plus className="w-4 h-4" /> Add Medicine
        </Button>
      </div>

      <div className="space-y-4">
        {medicines.map((med, i) => {
          const progress = Math.round(((med.total - med.remaining) / med.total) * 100);
          return (
            <motion.div
              key={med.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Pill className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground">{med.name} — {med.dosage}</h3>
                    <p className="text-xs text-muted-foreground">{med.frequency} · {med.startDate} → {med.endDate}</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-md">
                  {progress}% complete
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-muted mb-4">
                <div className="h-full rounded-full gradient-primary transition-all" style={{ width: `${progress}%` }} />
              </div>

              {/* Today's doses */}
              <div className="flex flex-wrap gap-2">
                {med.times.map((t, ti) => (
                  <button
                    key={ti}
                    onClick={() => !t.taken && markTaken(med.id, ti)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      t.taken
                        ? "bg-success/10 text-success border border-success/20"
                        : "bg-muted text-muted-foreground border border-border hover:border-primary hover:text-primary"
                    }`}
                  >
                    {t.taken ? <Check className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                    {t.time}
                    {t.taken && " ✓"}
                  </button>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default MedicineTracker;
