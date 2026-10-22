import { Card } from "../components/ui/Card";
import { Stat } from "../components/ui/Stat";
import { authenticatedFetch } from "../services/authRequest";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useEffect, useState } from "react";

export const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
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
          let message = t("dashboard.error");
          if (err.message?.includes("401")) {
            message = t("dashboard.unauthorized");
          } else if (err.message?.includes("403")) {
            message = t("dashboard.access_restricted");
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
          setTotalError(t("dashboard.access_restricted"));
        }
      }
    };
    fetchData();
    return () => {
      cancelled = true;
    };
  }, [user, t]);

  const stats = [
    {
      label: t("dashboard.total_candidates"),
      value: totalLoading
        ? t("dashboard.loading")
        : totalError
        ? totalError
        : total !== null
        ? String(total)
        : t("dashboard.data_not_available"),
      change: "",
      icon: "users",
      color: "navy",
    },
    { label: t("dashboard.verified_employment"), value: t("dashboard.data_not_available"), change: "", icon: "briefcase", color: "teal" },
    { label: t("dashboard.active_interventions"), value: t("dashboard.data_not_available"), change: "", icon: "handshake", color: "navy" },
    { label: t("dashboard.followups_completed"), value: t("dashboard.data_not_available"), change: "", icon: "phone", color: "teal" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-navy-800">{t("dashboard.title")}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Stat key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title={t("dashboard.employment_trends")} icon="trending-up" color="teal">
          <div className="space-y-4">
            <p className="text-navy-600">{t("dashboard.employment_trends_desc")}</p>
            <div className="h-24 bg-navy-50 rounded-lg">
              {/* Placeholder for chart - clearly labeled as synthetic data */}
              <div className="flex h-full items-center justify-center text-navy-400">
                {t("dashboard.chart_placeholder")}
              </div>
            </div>
            <p className="text-sm text-navy-500">
              {t("dashboard.chart_note")}
            </p>
          </div>
        </Card>

        <Card title={t("dashboard.intervention_effectiveness")} icon="pie-chart" color="navy">
          <div className="space-y-4">
            <p className="text-navy-600">{t("dashboard.intervention_desc")}</p>
            <div className="h-24 bg-navy-50 rounded-lg">
              {/* Placeholder for chart - clearly labeled as synthetic data */}
              <div className="flex h-full items-center justify-center text-navy-400">
                {t("dashboard.chart_placeholder")}
              </div>
            </div>
            <p className="text-sm text-navy-500">
              {t("dashboard.chart_note")}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
