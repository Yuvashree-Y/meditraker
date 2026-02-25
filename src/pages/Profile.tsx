import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Calendar, Heart, Activity, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";

const profileData = {
  name: "Alex Thompson",
  email: "alex.thompson@email.com",
  phone: "+1 (555) 123-4567",
  address: "123 Health Street, Medical City",
  dob: "March 15, 1990",
  bloodGroup: "O+",
  height: "5'10\"",
  weight: "165 lbs",
  allergies: ["Penicillin", "Dust"],
  conditions: ["Type 2 Diabetes", "Hypertension"],
  emergencyContact: { name: "Jane Thompson", relation: "Spouse", phone: "+1 (555) 987-6543" },
};

const Profile = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Patient Profile</h1>
        <p className="text-muted-foreground mt-1">Your personal and medical information</p>
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-xl border border-border p-6 mb-6"
      >
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
            AT
          </div>
          <div>
            <h2 className="text-xl font-bold text-card-foreground">{profileData.name}</h2>
            <p className="text-sm text-muted-foreground">Patient ID: #MED-2026-0042</p>
            <div className="flex gap-3 mt-2">
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md font-medium">Blood: {profileData.bloodGroup}</span>
              <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-md font-medium">{profileData.height} · {profileData.weight}</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Info */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-card-foreground mb-4">Contact Information</h3>
          <div className="space-y-3">
            {[
              { icon: Mail, value: profileData.email },
              { icon: Phone, value: profileData.phone },
              { icon: MapPin, value: profileData.address },
              { icon: Calendar, value: `Born: ${profileData.dob}` },
            ].map(({ icon: Icon, value }) => (
              <div key={value} className="flex items-center gap-3 text-sm">
                <Icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-card-foreground">{value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Medical Info */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-card-foreground mb-4">Medical Information</h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground font-medium mb-1.5">Allergies</p>
              <div className="flex flex-wrap gap-1.5">
                {profileData.allergies.map((a) => (
                  <span key={a} className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded-md">{a}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium mb-1.5">Conditions</p>
              <div className="flex flex-wrap gap-1.5">
                {profileData.conditions.map((c) => (
                  <span key={c} className="text-xs bg-warning/10 text-warning px-2 py-1 rounded-md">{c}</span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Emergency Contact */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-xl border border-border p-5 md:col-span-2">
          <h3 className="font-semibold text-card-foreground mb-3">Emergency Contact</h3>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
              <Heart className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm font-medium text-card-foreground">{profileData.emergencyContact.name} ({profileData.emergencyContact.relation})</p>
              <p className="text-xs text-muted-foreground">{profileData.emergencyContact.phone}</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button className="gradient-primary border-0 text-primary-foreground hover:opacity-90">Edit Profile</Button>
      </div>
    </div>
  );
};

export default Profile;
