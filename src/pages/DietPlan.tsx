import { motion } from "framer-motion";
import { Utensils, Flame, Droplets, Wheat, Apple } from "lucide-react";

const meals = [
  {
    time: "Breakfast · 8:00 AM",
    items: ["Oatmeal with berries", "Green tea", "Boiled eggs (2)"],
    calories: 420,
    icon: "🌅",
  },
  {
    time: "Lunch · 1:00 PM",
    items: ["Grilled chicken salad", "Brown rice", "Lentil soup"],
    calories: 650,
    icon: "☀️",
  },
  {
    time: "Snack · 4:30 PM",
    items: ["Mixed nuts", "Apple", "Greek yogurt"],
    calories: 280,
    icon: "🍎",
  },
  {
    time: "Dinner · 7:30 PM",
    items: ["Baked salmon", "Steamed vegetables", "Quinoa"],
    calories: 550,
    icon: "🌙",
  },
];

const nutrients = [
  { label: "Calories", value: "1,900", target: "2,100", icon: Flame, color: "text-destructive" },
  { label: "Water", value: "6", target: "8 glasses", icon: Droplets, color: "text-info" },
  { label: "Protein", value: "85g", target: "100g", icon: Wheat, color: "text-warning" },
  { label: "Fiber", value: "28g", target: "30g", icon: Apple, color: "text-success" },
];

const DietPlan = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Diet Plan</h1>
        <p className="text-muted-foreground mt-1">Personalized nutrition for your health goals</p>
      </div>

      {/* Nutrient Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {nutrients.map((n, i) => (
          <motion.div
            key={n.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card rounded-xl border border-border p-4 text-center"
          >
            <n.icon className={`w-6 h-6 mx-auto mb-2 ${n.color}`} />
            <p className="text-2xl font-bold text-card-foreground">{n.value}</p>
            <p className="text-xs text-muted-foreground">of {n.target}</p>
            <p className="text-xs font-medium text-muted-foreground mt-1">{n.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Meal Plan */}
      <h2 className="text-lg font-semibold text-foreground mb-4">Today's Meal Plan</h2>
      <div className="space-y-4">
        {meals.map((meal, i) => (
          <motion.div
            key={meal.time}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card rounded-xl border border-border p-5 flex items-start gap-4"
          >
            <span className="text-3xl">{meal.icon}</span>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-card-foreground text-sm">{meal.time}</h3>
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-md">
                  {meal.calories} cal
                </span>
              </div>
              <ul className="mt-2 space-y-1">
                {meal.items.map((item) => (
                  <li key={item} className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DietPlan;
