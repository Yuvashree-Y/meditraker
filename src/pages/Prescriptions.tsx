import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, Camera, FileImage, Search, Plus, X, Loader2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Prescriptions = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [medicines, setMedicines] = useState("");
  const [notes, setNotes] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Fetch prescriptions
  const { data: prescriptions = [], isLoading } = useQuery({
    queryKey: ["prescriptions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prescriptions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Upload mutation
  const createPrescription = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");

      let imageUrl: string | null = null;

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const filePath = `${user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("prescription-images")
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("prescription-images")
          .getPublicUrl(filePath);

        imageUrl = urlData.publicUrl;
      }

      const medicineList = medicines
        .split(",")
        .map((m) => m.trim())
        .filter(Boolean);

      const { error } = await supabase.from("prescriptions").insert({
        user_id: user.id,
        name,
        doctor_name: doctorName,
        medicines: medicineList,
        notes: notes || null,
        image_url: imageUrl,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
      toast.success("Prescription uploaded successfully!");
      resetForm();
      setDialogOpen(false);
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to upload prescription");
    },
  });

  const resetForm = () => {
    setName("");
    setDoctorName("");
    setMedicines("");
    setNotes("");
    setImageFile(null);
    setImagePreview(null);
  };

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File must be under 10MB");
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !doctorName.trim()) {
      toast.error("Please fill in name and doctor fields");
      return;
    }
    setUploading(true);
    createPrescription.mutate(undefined, {
      onSettled: () => setUploading(false),
    });
  };

  const filtered = prescriptions.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.doctor_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Prescriptions</h1>
          <p className="text-muted-foreground mt-1">View and manage your prescriptions</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2 gradient-primary border-0 text-primary-foreground hover:opacity-90">
              <Plus className="w-4 h-4" /> Add Prescription
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Prescription</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="name">Prescription Name *</Label>
                <Input id="name" placeholder="e.g. General Checkup" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="doctor">Doctor Name *</Label>
                <Input id="doctor" placeholder="e.g. Dr. Sarah Johnson" value={doctorName} onChange={(e) => setDoctorName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medicines">Medicines (comma-separated)</Label>
                <Input id="medicines" placeholder="e.g. Amoxicillin 500mg, Paracetamol" value={medicines} onChange={(e) => setMedicines(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" placeholder="Any additional notes..." value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
              </div>

              {/* Image upload area */}
              <div className="space-y-2">
                <Label>Prescription Image</Label>
                {imagePreview ? (
                  <div className="relative rounded-xl overflow-hidden border border-border">
                    <img src={imagePreview} alt="Preview" className="w-full max-h-48 object-contain bg-muted" />
                    <button
                      type="button"
                      onClick={() => { setImageFile(null); setImagePreview(null); }}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-background/80 flex items-center justify-center hover:bg-background"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
                    <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileSelect} />
                    <Button type="button" variant="outline" className="flex-1 gap-2 h-20 flex-col" onClick={() => fileInputRef.current?.click()}>
                      <Upload className="w-5 h-5" />
                      <span className="text-xs">Upload File</span>
                    </Button>
                    <Button type="button" variant="outline" className="flex-1 gap-2 h-20 flex-col" onClick={() => cameraInputRef.current?.click()}>
                      <Camera className="w-5 h-5" />
                      <span className="text-xs">Take Photo</span>
                    </Button>
                  </div>
                )}
              </div>

              <Button type="submit" disabled={uploading} className="w-full gradient-primary border-0 text-primary-foreground hover:opacity-90">
                {uploading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Uploading...</> : "Save Prescription"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
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

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-16">
          <FileImage className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">
            {searchQuery ? "No prescriptions match your search" : "No prescriptions yet. Add your first one!"}
          </p>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((rx, i) => (
          <motion.div
            key={rx.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              {rx.image_url ? (
                <button
                  onClick={() => { setPreviewUrl(rx.image_url); setPreviewOpen(true); }}
                  className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-border hover:ring-2 hover:ring-primary/50 transition-all"
                >
                  <img src={rx.image_url} alt="" className="w-full h-full object-cover" />
                </button>
              ) : (
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <FileImage className="w-6 h-6 text-primary" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-card-foreground text-sm">{rx.name}</h3>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${
                      rx.status === "active"
                        ? "bg-success/10 text-success"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {rx.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {rx.doctor_name} · {formatDate(rx.prescription_date)}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {(rx.medicines || []).map((med) => (
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

      {/* Image preview dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl p-2">
          {previewUrl && (
            <img src={previewUrl} alt="Prescription" className="w-full rounded-lg" />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Prescriptions;
