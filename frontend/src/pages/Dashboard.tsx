import { Card } from "../components/ui/Card";
import { Stat } from "../components/ui/Stat";
import { authenticatedFetch } from "../services/authRequest";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";

export const Dashboard = () => {
  const { user } = useAuth();
  const [total, setTotal] = useState<number | null>(null);
  const [totalLoading, setTotalLoading] = useState<boolean>(true);
  const [totalError, setTotalError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const fetchData = async () => {
      setTotalLoading(true);
      setTotalError(null);
      // Only gov_admin and institute_officer can access the candidates endpoint for counting
      if (user.role === "gov_admin" || user.role === "institute_officer") {
        try {
          const response = await authenticatedFetch<{ total: number }>(
            `/candidates?page=1&page_size=1`
          );
          if (!cancelled) {
            const value = response.total;
            if (typeof value === "number" && !isNaN(value) && value >= 0) {
              setTotal(value);
            } else {
              setTotalError("Invalid data received");
            }
            setTotalLoading(false);
          }
        } catch (err: any) {
          if (cancelled) return;
          let message = "Failed to load data";
          if (err.message?.includes("401")) {
            message = "Unauthorized";
          } else if (err.message?.includes("403")) {
            message = "Access restricted";
          } else {
            message = err.message || "Unknown error";
          }
          if (!cancelled) {
            setTotalError(message);
            setTotalLoading(false);
          }
        }
      } else {
        // trainee and employer: no access to candidates endpoint for total count
        if (!cancelled) {
          setTotalLoading(false);
          setTotalError("Access restricted");
        }
      }
    };
    fetchData();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const stats = [
    {
      label: "Total Candidates",
      value: totalLoading
        ? "Loading…"
        : totalError
        ? totalError
        : total !== null
        ? String(total)
        : "Data not available",
      change: "",
      icon: "users",
      color: "navy",
    },
    { label: "Verified Employment", value: "Data not available", change: "", icon: "briefcase", color: "teal" },
    { label: "Active Interventions", value: "Data not available", change: "", icon: "handshake", color: "navy" },
    { label: "Follow-ups Completed", value: "Data not available", change: "", icon: "phone", color: "teal" },
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
