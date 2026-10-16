import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { authenticatedFetch } from "../services/authRequest";

export interface CandidateDetailData {
  id: number;
  user_id: number;
  full_name: string;
  email: string;
  phone: string | null;
  date_of_birth: string | null;
  gender: string | null;
  education_background: string | null;
  skills: string[] | null;
  preferred_location: string | null;
  institute_id: number | null;
  institute_name: string | null;
  created_at: string;
  updated_at: string;
}

export const CandidateDetail: React.FC = () => {
  const { candidate_id } = useParams<{ candidate_id: string }>();
  const navigate = useNavigate();

  const [candidate, setCandidate] = useState<CandidateDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorStatusCode, setErrorStatusCode] = useState<number | null>(null);

  const fetchCandidate = useCallback(async () => {
    if (!candidate_id) {
      setError("Invalid candidate ID.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setErrorStatusCode(null);

    try {
      const data = await authenticatedFetch<CandidateDetailData>(
        `/candidates/${candidate_id}`
      );
      setCandidate(data);
    } catch (err: any) {
      const msg = err.message || "";
      if (msg.includes("404")) {
        setErrorStatusCode(404);
        setError("Candidate record not found. The requested candidate does not exist or belongs to a different institute.");
      } else if (msg.includes("403")) {
        setErrorStatusCode(403);
        setError("Access denied. You do not have authorization to view this candidate profile.");
      } else {
        setError(msg || "Failed to load candidate details. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [candidate_id]);

  useEffect(() => {
    fetchCandidate();
  }, [fetchCandidate]);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Not provided";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return "N/A";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Navigation & Actions Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/candidates"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-600 hover:text-navy-900 transition-colors"
        >
          <span>←</span> Back to Candidates Directory
        </Link>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-md text-xs font-medium">
          <span>⚠️</span> Synthetic Demonstration Data
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-12 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-4 border-navy-200 border-t-navy-600 rounded-full animate-spin" />
          <p className="text-sm text-navy-600">Loading candidate details...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center space-y-4">
          <div className="text-3xl">
            {errorStatusCode === 404 ? "🔍" : errorStatusCode === 403 ? "🔒" : "⚠️"}
          </div>
          <h2 className="text-lg font-bold text-navy-800">
            {errorStatusCode === 404
              ? "Candidate Not Found"
              : errorStatusCode === 403
              ? "Authorization Required"
              : "Unable to Load Profile"}
          </h2>
          <p className="text-sm text-navy-600 max-w-md mx-auto">{error}</p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => fetchCandidate()}
              className="px-4 py-2 bg-navy-600 text-white text-xs font-medium rounded-md hover:bg-navy-700 transition-colors"
            >
              Retry
            </button>
            <button
              onClick={() => navigate("/candidates")}
              className="px-4 py-2 bg-gray-100 text-navy-800 text-xs font-medium rounded-md hover:bg-gray-200 transition-colors"
            >
              Return to Directory
            </button>
          </div>
        </div>
      )}

      {/* Detail Content */}
      {!loading && !error && candidate && (
        <div className="space-y-6">
          {/* Candidate Profile Header Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-navy-600 text-white flex items-center justify-center text-2xl font-bold">
                  {candidate.full_name ? candidate.full_name.charAt(0).toUpperCase() : "C"}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-navy-900">{candidate.full_name}</h1>
                  <p className="text-sm text-navy-600 mt-0.5">{candidate.email}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-navy-50 text-navy-700 border border-navy-200">
                      Candidate ID #{candidate.id}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-50 text-teal-800 border border-teal-200">
                      {candidate.institute_name || "Unassigned Institute"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
              {/* Contact & Affiliation */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-navy-700 border-b border-gray-100 pb-2">
                  Contact & Institutional Affiliation
                </h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-navy-500 font-medium">Email Address</dt>
                    <dd className="text-navy-900 font-semibold">{candidate.email}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-navy-500 font-medium">Phone</dt>
                    <dd className="text-navy-900 font-semibold">{candidate.phone || "Not provided"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-navy-500 font-medium">Assigned Institute</dt>
                    <dd className="text-navy-900 font-semibold">
                      {candidate.institute_name ? (
                        <span>
                          {candidate.institute_name}
                          {candidate.institute_id && (
                            <span className="text-xs text-navy-400 font-normal ml-1">
                              (ID: #{candidate.institute_id})
                            </span>
                          )}
                        </span>
                      ) : (
                        <span className="text-navy-400 italic">None</span>
                      )}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-navy-500 font-medium">System User ID</dt>
                    <dd className="text-navy-900 font-mono text-xs">#{candidate.user_id}</dd>
                  </div>
                </dl>
              </div>

              {/* Academic & Training Background */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-navy-700 border-b border-gray-100 pb-2">
                  Education & Preferences
                </h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-navy-500 font-medium">Education Background</dt>
                    <dd className="text-navy-900 font-semibold">
                      {candidate.education_background || "Not specified"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-navy-500 font-medium">Preferred Location</dt>
                    <dd className="text-navy-900 font-semibold">
                      {candidate.preferred_location || "Not specified"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-navy-500 font-medium">Date of Birth</dt>
                    <dd className="text-navy-900 font-semibold">
                      {formatDate(candidate.date_of_birth)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-navy-500 font-medium">Gender</dt>
                    <dd className="text-navy-900 font-semibold">
                      {candidate.gender || "Not provided"}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Skills Section */}
            <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-navy-700">
                Skills & Competencies
              </h3>
              {candidate.skills && candidate.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">No skills recorded for this candidate profile.</p>
              )}
            </div>

            {/* Timestamps & Audit Info */}
            <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-navy-400 gap-2">
              <div>Created on: {formatDateTime(candidate.created_at)}</div>
              <div>Last updated: {formatDateTime(candidate.updated_at)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
