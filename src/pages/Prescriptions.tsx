import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Camera, FileImage, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const mockPrescriptions = [
  { id: 1, name: "General Checkup Prescription", doctor: "Dr. Sarah Johnson", date: "Feb 24, 2026", medicines: ["Amoxicillin 500mg", "Paracetamol 650mg"], status: "active" },
  { id: 2, name: "Blood Sugar Follow-up", doctor: "Dr. Michael Chen", date: "Feb 20, 2026", medicines: ["Metformin 850mg"], status: "active" },
  { id: 3, name: "Vitamin Deficiency", doctor: "Dr. Priya Patel", date: "Feb 10, 2026", medicines: ["Vitamin D3 60K", "Iron Supplement"], status: "completed" },
  { id: 4, name: "Seasonal Allergy", doctor: "Dr. Sarah Johnson", date: "Jan 15, 2026", medicines: ["Cetirizine 10mg", "Montelukast 10mg"], status: "completed" },
];

const Prescriptions = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = mockPrescriptions.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.doctor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Prescriptions</h1>
          <p className="text-muted-foreground mt-1">View and manage your prescriptions</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Camera className="w-4 h-4" /> Scan
          </Button>
          <Button className="gap-2 gradient-primary border-0 text-primary-foreground hover:opacity-90">
            <Upload className="w-4 h-4" /> Upload
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search prescriptions..."
          className="pl-11 h-12"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((rx, i) => (
          <motion.div
            key={rx.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <FileImage className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-card-foreground text-sm">{rx.name}</h3>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${
                    rx.status === "active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                  }`}>
                    {rx.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{rx.doctor} · {rx.date}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {rx.medicines.map((med) => (
                    <span key={med} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-md">
                      {med}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Prescriptions;
