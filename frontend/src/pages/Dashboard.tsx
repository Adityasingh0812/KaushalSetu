import { Card } from "../components/ui/Card";
import { Stat } from "../components/ui/Stat";

export const Dashboard = () => {
  // Synthetic data for demonstration - clearly labeled as placeholder
  const stats = [
    { label: "Total Candidates", value: "250", change: "+12%", icon: "users", color: "navy" },
    { label: "Verified Employment", value: "89", change: "+8%", icon: "briefcase", color: "teal" },
    { label: "Active Interventions", value: "34", change: "+5%", icon: "handshake", color: "navy" },
    { label: "Follow-ups Completed", value: "187", change: "+15%", icon: "phone", color: "teal" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-navy-800">Dashboard Overview</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Stat key={stat.label} {...stat} />
        ))}
      </div>
      
      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Employment Trends" icon="trending-up" color="teal">
          <div className="space-y-4">
            <p className="text-navy-600">This chart shows verified employment trends over time.</p>
            <div className="h-24 bg-navy-50 rounded-lg">
              {/* Placeholder for chart - clearly labeled as synthetic data */}
              <div className="flex h-full items-center justify-center text-navy-400">
                [Employment Trend Chart - Synthetic Data for Demo]
              </div>
            </div>
            <p className="text-sm text-navy-500">
              Note: This chart uses clearly labeled synthetic data for demonstration purposes only.
            </p>
          </div>
        </Card>
        
        <Card title="Intervention Effectiveness" icon="pie-chart" color="navy">
          <div className="space-y-4">
            <p className="text-navy-600">This chart shows the effectiveness of different intervention types.</p>
            <div className="h-24 bg-navy-50 rounded-lg">
              {/* Placeholder for chart - clearly labeled as synthetic data */}
              <div className="flex h-full items-center justify-center text-navy-400">
                [Intervention Effectiveness Chart - Synthetic Data for Demo]
              </div>
            </div>
            <p className="text-sm text-navy-500">
              Note: This chart uses clearly labeled synthetic data for demonstration purposes only.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
