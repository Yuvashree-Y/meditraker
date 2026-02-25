import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Plus, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

const appointments = [
  { id: 1, doctor: "Dr. Sarah Johnson", specialty: "Cardiologist", date: "Mar 2, 2026", time: "10:00 AM", location: "City Heart Hospital", type: "in-person", status: "upcoming" },
  { id: 2, doctor: "Dr. Michael Chen", specialty: "General Physician", date: "Mar 5, 2026", time: "2:30 PM", location: "Online", type: "video", status: "upcoming" },
  { id: 3, doctor: "Dr. Priya Patel", specialty: "Dermatologist", date: "Feb 20, 2026", time: "11:00 AM", location: "Skin Care Clinic", type: "in-person", status: "completed" },
  { id: 4, doctor: "Dr. Sarah Johnson", specialty: "Cardiologist", date: "Feb 10, 2026", time: "9:30 AM", location: "City Heart Hospital", type: "in-person", status: "completed" },
];

const Appointments = () => {
  const upcoming = appointments.filter((a) => a.status === "upcoming");
  const past = appointments.filter((a) => a.status === "completed");

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Appointments</h1>
          <p className="text-muted-foreground mt-1">Manage your doctor visits</p>
        </div>
        <Button className="gap-2 gradient-primary border-0 text-primary-foreground hover:opacity-90">
          <Plus className="w-4 h-4" /> Book Appointment
        </Button>
      </div>

      {/* Upcoming */}
      <h2 className="text-lg font-semibold text-foreground mb-4">Upcoming</h2>
      <div className="space-y-3 mb-8">
        {upcoming.map((apt, i) => (
          <motion.div
            key={apt.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card rounded-xl border border-border p-5 flex items-center gap-5 hover:shadow-md transition-shadow"
          >
            <div className="w-16 h-16 rounded-xl gradient-primary flex flex-col items-center justify-center text-primary-foreground shrink-0">
              <span className="text-xl font-bold leading-none">{apt.date.split(" ")[1].replace(",", "")}</span>
              <span className="text-xs opacity-80">{apt.date.split(" ")[0]}</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-card-foreground">{apt.doctor}</h3>
              <p className="text-sm text-muted-foreground">{apt.specialty}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {apt.time}</span>
                <span className="flex items-center gap-1">
                  {apt.type === "video" ? <Video className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
                  {apt.location}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              {apt.type === "video" && (
                <Button size="sm" className="gradient-primary border-0 text-primary-foreground text-xs hover:opacity-90">Join Call</Button>
              )}
              <Button size="sm" variant="outline" className="text-xs">Reschedule</Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Past */}
      <h2 className="text-lg font-semibold text-foreground mb-4">Past Appointments</h2>
      <div className="space-y-3">
        {past.map((apt, i) => (
          <motion.div
            key={apt.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card rounded-xl border border-border p-5 flex items-center gap-5 opacity-70"
          >
            <div className="w-16 h-16 rounded-xl bg-muted flex flex-col items-center justify-center text-muted-foreground shrink-0">
              <span className="text-xl font-bold leading-none">{apt.date.split(" ")[1].replace(",", "")}</span>
              <span className="text-xs">{apt.date.split(" ")[0]}</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-card-foreground">{apt.doctor}</h3>
              <p className="text-sm text-muted-foreground">{apt.specialty}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {apt.time}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {apt.location}</span>
              </div>
            </div>
            <span className="text-xs font-medium text-muted-foreground bg-muted px-3 py-1 rounded-md">Completed</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Appointments;
