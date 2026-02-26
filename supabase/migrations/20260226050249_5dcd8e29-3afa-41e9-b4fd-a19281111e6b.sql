
-- Profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  date_of_birth DATE,
  blood_group TEXT,
  height TEXT,
  weight TEXT,
  allergies TEXT[] DEFAULT '{}',
  conditions TEXT[] DEFAULT '{}',
  emergency_contact_name TEXT,
  emergency_contact_relation TEXT,
  emergency_contact_phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own profile" ON public.profiles FOR DELETE USING (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Prescriptions table
CREATE TABLE public.prescriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  doctor_name TEXT NOT NULL DEFAULT '',
  prescription_date DATE NOT NULL DEFAULT CURRENT_DATE,
  medicines TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active',
  image_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own prescriptions" ON public.prescriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own prescriptions" ON public.prescriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own prescriptions" ON public.prescriptions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own prescriptions" ON public.prescriptions FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_prescriptions_updated_at BEFORE UPDATE ON public.prescriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Appointments table
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  doctor_name TEXT NOT NULL DEFAULT '',
  specialty TEXT DEFAULT '',
  appointment_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own appointments" ON public.appointments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own appointments" ON public.appointments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own appointments" ON public.appointments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own appointments" ON public.appointments FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Medicine tracker table
CREATE TABLE public.medicine_tracker (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  medicine_name TEXT NOT NULL,
  dosage TEXT NOT NULL DEFAULT '',
  schedule_time TIME NOT NULL,
  taken BOOLEAN NOT NULL DEFAULT false,
  taken_at TIMESTAMPTZ,
  schedule_date DATE NOT NULL DEFAULT CURRENT_DATE,
  prescription_id UUID REFERENCES public.prescriptions(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.medicine_tracker ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own medicine_tracker" ON public.medicine_tracker FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own medicine_tracker" ON public.medicine_tracker FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own medicine_tracker" ON public.medicine_tracker FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own medicine_tracker" ON public.medicine_tracker FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_medicine_tracker_updated_at BEFORE UPDATE ON public.medicine_tracker FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for prescription images
INSERT INTO storage.buckets (id, name, public) VALUES ('prescription-images', 'prescription-images', false);

CREATE POLICY "Users can upload own prescription images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'prescription-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own prescription images"
ON storage.objects FOR SELECT
USING (bucket_id = 'prescription-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own prescription images"
ON storage.objects FOR DELETE
USING (bucket_id = 'prescription-images' AND auth.uid()::text = (storage.foldername(name))[1]);
