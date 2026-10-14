interface StatProps {
  label: string;
  value: string;
  change: string;
  icon: string;
  color: "navy" | "teal";
}

export const Stat = ({ label, value, change, icon, color }: StatProps) => {
  const isPositive = change.startsWith("+");
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full flex items-center justify-center">
            <span className="font-medium">{icon === "users" ? "👥" : 
                                   icon === "briefcase" ? "💼" : 
                                   icon === "handshake" ? "🤝" : 
                                   icon === "phone" ? "📞" : 
                                   "📊"}</span>
          </div>
          <div>
            <p className="font-medium text-navy-800">{label}</p>
            <p className="text-2xl font-bold text-navy-900">{value}</p>
          </div>
        </div>
        <p className="font-medium">{change}</p>
      </div>
    </div>
  );
};
