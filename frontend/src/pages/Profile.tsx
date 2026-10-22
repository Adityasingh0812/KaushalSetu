import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { authenticatedFetch } from "../services/authRequest";
import { useLanguage } from "../contexts/LanguageContext";

export const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [candidate, setCandidate] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({
    date_of_birth: "",
    gender: "",
    education_background: "",
    skills: "",
    preferred_location: "",
  });

  // Convert date to string for input
  const formatDate = (date: string | null) => {
    if (!date) return "";
    return date.split("T")[0];
  };

  // Safely format skills from array, JSON string, or comma-separated string
  const formatSkills = (skills: string[] | string | null | undefined): string => {
    if (!skills) return "";
    if (Array.isArray(skills)) {
      return skills.join(", ");
    }
    if (typeof skills === "string") {
      try {
        const parsed = JSON.parse(skills);
        if (Array.isArray(parsed)) {
          return parsed.join(", ");
        }
      } catch {
        return skills;
      }
      return skills;
    }
    return "";
  };

  // Load candidate profile
  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }
    // Only trainees can access this page
    if (user.role !== "trainee") {
      navigate("/", { replace: true });
      return;
    }
    const loadCandidate = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await authenticatedFetch<any>("/candidates/me");
        setCandidate(data);
        setFormData({
          date_of_birth: formatDate(data.date_of_birth),
          gender: data.gender || "",
          education_background: data.education_background || "",
          skills: formatSkills(data.skills),
          preferred_location: data.preferred_location || "",
        });
      } catch (err: any) {
        setError(err.message || t("profile.load_error"));
      } finally {
        setLoading(false);
      }
    };

    loadCandidate();
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      // Prepare skills as an array of strings (not double-stringified)
      const skillsArray = formData.skills
        .split(",")
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0);
      const updateData = {
        date_of_birth: formData.date_of_birth || null,
        gender: formData.gender || null,
        education_background: formData.education_background || null,
        skills: skillsArray.length > 0 ? skillsArray : null,
        preferred_location: formData.preferred_location || null,
      };
      const response = await authenticatedFetch<any>("/candidates/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });
      setCandidate(response);
      setSuccess(t("profile.update_success"));
    } catch (err: any) {
      setError(err.message || t("profile.update_error"));
    } finally {
      setLoading(false);
    }
  };

  if (loading && !candidate) {
    return (
      <div className="flex items-center justify-center py-12 text-navy-600">
        {t("profile.loading")}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-navy-800">{t("profile.title")}</h1>
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded-r-md">
          <p>{error}</p>
        </div>
      )}
      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 text-green-700 p-4 rounded-r-md">
          <p>{success}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
        <div>
          <label className="block text-sm font-medium text-navy-700 mb-2">
            {t("profile.date_of_birth")}
          </label>
          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-navy-700 mb-2">
            {t("profile.gender")}
          </label>
          <input
            type="text"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            placeholder={t("profile.gender_placeholder")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-navy-700 mb-2">
            {t("profile.education")}
          </label>
          <input
            type="text"
            name="education_background"
            value={formData.education_background}
            onChange={handleChange}
            placeholder={t("profile.education_placeholder")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-navy-700 mb-2">
            {t("profile.skills")}
          </label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder={t("profile.skills_placeholder")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-navy-700 mb-2">
            {t("profile.preferred_location")}
          </label>
          <input
            type="text"
            name="preferred_location"
            value={formData.preferred_location}
            onChange={handleChange}
            placeholder={t("profile.location_placeholder")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500"
          />
        </div>
        <div className="flex items-center justify-between pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-navy-600 text-white rounded-md hover:bg-navy-700 disabled:opacity-50 font-medium transition-colors"
          >
            {loading ? t("button.saving") : t("button.save")}
          </button>
          <button
            type="button"
            onClick={logout}
            className="px-4 py-2 bg-gray-200 text-navy-800 rounded-md hover:bg-gray-300 text-sm font-medium transition-colors"
          >
            {t("profile.logout")}
          </button>
        </div>
      </form>

      {/* Display current values */}
      {candidate && (
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm space-y-3">
          <h2 className="text-lg font-semibold text-navy-800 border-b pb-2">{t("profile.current_saved")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <p className="text-navy-700">
              <span className="font-medium text-navy-900">{t("profile.date_of_birth")}:</span>{" "}
              {candidate.date_of_birth ? formatDate(candidate.date_of_birth) : t("profile.not_set")}
            </p>
            <p className="text-navy-700">
              <span className="font-medium text-navy-900">{t("profile.gender")}:</span>{" "}
              {candidate.gender || t("profile.not_set")}
            </p>
            <p className="text-navy-700">
              <span className="font-medium text-navy-900">{t("profile.education")}:</span>{" "}
              {candidate.education_background || t("profile.not_set")}
            </p>
            <p className="text-navy-700">
              <span className="font-medium text-navy-900">{t("profile.preferred_location")}:</span>{" "}
              {candidate.preferred_location || t("profile.not_set")}
            </p>
            <div className="md:col-span-2 text-navy-700">
              <span className="font-medium text-navy-900">{t("profile.skills")}:</span>{" "}
              {formatSkills(candidate.skills) ? (
                <div className="mt-1 flex flex-wrap gap-2">
                  {formatSkills(candidate.skills)
                    .split(",")
                    .map((skill: string) => skill.trim())
                    .filter((skill: string) => skill.length > 0)
                    .map((skill: string, idx: number) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800"
                      >
                        {skill}
                      </span>
                    ))}
                </div>
              ) : (
                t("profile.not_set")
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
