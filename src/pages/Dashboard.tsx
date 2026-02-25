import { motion } from "framer-motion";
import {
  Calendar,
  Pill,
  FileImage,
  Activity,
  Clock,
  ArrowRight,
  Bell,
} from "lucide-react";
import { Link } from "react-router-dom";
import StatCard from "@/components/dashboard/StatCard";

const upcomingAppointments = [
  { id: 1, doctor: "Dr. Sarah Johnson", specialty: "Cardiologist", date: "Mar 2, 2026", time: "10:00 AM", status: "confirmed" },
  { id: 2, doctor: "Dr. Michael Chen", specialty: "General Physician", date: "Mar 5, 2026", time: "2:30 PM", status: "pending" },
];

const recentPrescriptions = [
  { id: 1, name: "Amoxicillin 500mg", doctor: "Dr. Sarah Johnson", date: "Feb 24, 2026", doses: "3x daily" },
  { id: 2, name: "Metformin 850mg", doctor: "Dr. Chen", date: "Feb 20, 2026", doses: "2x daily" },
];

const medicineSchedule = [
  { id: 1, name: "Amoxicillin", time: "8:00 AM", taken: true },
  { id: 2, name: "Metformin", time: "9:00 AM", taken: true },
  { id: 3, name: "Amoxicillin", time: "2:00 PM", taken: false },
  { id: 4, name: "Vitamin D", time: "6:00 PM", taken: false },
];

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Good Morning, Alex 👋</h1>
          <p className="text-muted-foreground mt-1">Here's your health overview for today</p>
        </div>
        <button className="relative w-11 h-11 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors">
          <Bell className="w-5 h-5 text-foreground" />
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-bold">3</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Calendar} label="Next Appointment" value="Mar 2" subtitle="Dr. Sarah Johnson" variant="primary" />
        <StatCard icon={Pill} label="Today's Medicines" value="2/4" subtitle="2 remaining doses" variant="warning" />
        <StatCard icon={FileImage} label="Prescriptions" value="5" subtitle="Active prescriptions" variant="info" />
        <StatCard icon={Activity} label="Health Score" value="87%" subtitle="Good condition" variant="success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Medicine Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl border border-border p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-card-foreground">Today's Doses</h2>
            <Link to="/medicine" className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {medicineSchedule.map((med) => (
              <div
                key={med.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  med.taken ? "bg-success/5 border-success/20" : "bg-card border-border"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${med.taken ? "bg-success" : "bg-muted-foreground/30"}`} />
                  <div>
                    <p className={`text-sm font-medium ${med.taken ? "line-through text-muted-foreground" : "text-card-foreground"}`}>{med.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {med.time}
                    </p>
                  </div>
                </div>
                {med.taken ? (
                  <span className="text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-md">Taken ✓</span>
                ) : (
                  <button className="text-xs font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-md hover:bg-primary/20 transition-colors">
                    Mark Taken
                  </button>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Appointments */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl border border-border p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-card-foreground">Upcoming Appointments</h2>
            <Link to="/appointments" className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {upcomingAppointments.map((apt) => (
              <div key={apt.id} className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                  {apt.date.split(" ")[1].replace(",", "")}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-card-foreground">{apt.doctor}</p>
                  <p className="text-xs text-muted-foreground">{apt.specialty}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{apt.date} · {apt.time}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-md ${
                  apt.status === "confirmed" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                }`}>
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Prescriptions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-xl border border-border p-6 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-card-foreground">Recent Prescriptions</h2>
            <Link to="/prescriptions" className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recentPrescriptions.map((rx) => (
              <div key={rx.id} className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                <div className="w-11 h-11 rounded-xl bg-info/10 flex items-center justify-center">
                  <FileImage className="w-5 h-5 text-info" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-card-foreground">{rx.name}</p>
                  <p className="text-xs text-muted-foreground">{rx.doctor} · {rx.doses}</p>
                  <p className="text-xs text-muted-foreground">{rx.date}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
