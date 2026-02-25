import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Prescriptions from "./pages/Prescriptions";
import Appointments from "./pages/Appointments";
import MedicineTracker from "./pages/MedicineTracker";
import HealthChat from "./pages/HealthChat";
import DietPlan from "./pages/DietPlan";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/prescriptions" element={<Prescriptions />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/medicine" element={<MedicineTracker />} />
            <Route path="/chat" element={<HealthChat />} />
            <Route path="/diet" element={<DietPlan />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
