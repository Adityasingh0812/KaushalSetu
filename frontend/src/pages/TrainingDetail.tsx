import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { authenticatedFetch } from "../services/authRequest";
import { useAuth } from "../contexts/AuthContext";

export interface TrainingProgrammeRead {
  id: number;
  name: string;
  description: string | null;
  course_or_skill_area: string;
  training_provider: string | null;
  location: string | null;
  start_date: string; // ISO date string
  end_date: string; // ISO date string
  status: string; // "draft" | "active" | "completed" | "cancelled"
  institute_id: number | null;
  created_at: string; // ISO datetime string
  updated_at: string; // ISO datetime string
}

export const TrainingDetail: React.FC = () => {
  const { programme_id } = useParams<{ programme_id: string }>();
  const { user } = useAuth();

  const [programme, setProgramme] = useState<TrainingProgrammeRead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const fetchProgramme = useCallback(async () => {
    if (!programme_id) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setNotFound(false);
    try {
      const response = await authenticatedFetch<TrainingProgrammeRead>(
        `/training/${programme_id}`
      );
      setProgramme(response);
    } catch (err: any) {
      if (err.message && err.message.includes("404")) {
        setNotFound(true);
      } else if (err.message && err.message.includes("403")) {
        setError("Access restricted. You are not authorized to view this training programme.");
      } else {
        setError(err.message || "Failed to load training programme details. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [programme_id]);

  useEffect(() => {
    fetchProgramme();
  }, [fetchProgramme, programme_id]);

  // Determine if the user can edit a programme (gov_admin or institute_officer)
  const canEdit = user?.role === "gov_admin" || user?.role === "institute_officer";

  // Status label mapping for display
  const statusLabels: Record<string, string> = {
    draft: "Draft",
    active: "Active",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  // Status badge colors
  const statusColors: Record<string, string> = {
    draft: "bg-yellow-50 text-yellow-800 border-yellow-200",
    active: "bg-green-50 text-green-800 border-green-200",
    completed: "bg-blue-50 text-blue-800 border-blue-200",
    cancelled: "bg-red-50 text-red-800 border-red-200",
  };

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="h-16 w-16 rounded-full bg-navy-100 flex items-center justify-center text-navy-700">
              404
            </div>
          </div>
          <h2 className="mb-4 text-3xl font-bold text-navy-800">Training Programme Not Found</h2>
          <p className="max-w-md text-navy-600">
            The training programme you're looking for doesn't exist or has been removed.
          </p>
          <div className="mt-6">
            <Link
              to="/training"
              className="inline-flex items-center px-4 py-2 bg-navy-600 text-white font-medium rounded-md shadow-sm hover:bg-navy-700"
            >
              Back to Training Programmes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-navy-800">
            {programme ? programme.name : "Training Programme Details"}
          </h1>
          <p className="text-sm text-navy-600 mt-1">
            View detailed information about this training programme.
          </p>
        </div>

        {/* Edit button for authorized roles */}
        {canEdit && programme && (
          <Link
            to={`/training/${programme.id}/edit`} // We'll need to create this route later
            className="px-4 py-2 bg-navy-600 text-white text-sm font-medium rounded-md hover:bg-navy-700 transition-colors focus:outline-none focus:ring-2 focus:ring-navy-500"
          >
            Edit Programme
          </Link>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md flex items-start justify-between">
          <div className="flex items-center">
            <span className="text-red-500 text-xl mr-3">⚠️</span>
            <p className="text-sm text-red-700">{error}</p>
          </div>
          <button
            onClick={() => fetchProgramme()}
            className="text-xs font-semibold text-red-700 hover:text-red-900 underline ml-4"
          >
            Retry
          </button>
        </div>
      )}

      {/* Main Content: Detail View or Loading */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-navy-600 space-y-3">
            <div className="w-8 h-8 border-4 border-navy-200 border-t-navy-600 rounded-full animate-spin" />
            <p className="text-sm">Loading training programme details...</p>
          </div>
        ) : programme ? (
          <div className="space-y-6 p-6">
            {/* Programme Header */}
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-navy-100 flex items-center justify-center text-navy-700 font-bold text-sm">
                {programme.name ? programme.name.charAt(0).toUpperCase() : "T"}
              </div>
              <div>
                <h2 className="text-xl font-bold text-navy-800">{programme.name}</h2>
                <div className="flex items-center space-x-3 mt-1">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      statusColors[programme.status as keyof typeof statusColors] ||
                      "bg-gray-50 text-gray-800 border-gray-200"
                    }`}
                  >
                    {statusLabels[programme.status as keyof typeof statusLabels] ||
                      programme.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            {programme.description && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-navy-800">Description</h3>
                <p className="text-navy-600">{programme.description}</p>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Skill/Course Area */}
              <div>
                <h3 className="text-sm font-semibold text-navy-700 mb-1">Skill/Course Area</h3>
                <p className="text-navy-600">{programme.course_or_skill_area}</p>
              </div>

              {/* Training Provider */}
              <div>
                <h3 className="text-sm font-semibold text-navy-700 mb-1">Training Provider</h3>
                <p className="text-navy-600">
                  {programme.training_provider || "Not specified"}
                </p>
              </div>

              {/* Location */}
              <div>
                <h3 className="text-sm font-semibold text-navy-700 mb-1">Location</h3>
                <p className="text-navy-600">
                  {programme.location || "Not specified"}
                </p>
              </div>

              {/* Dates */}
              <div>
                <h3 className="text-sm font-semibold text-navy-700 mb-1">Programme Dates</h3>
                <p className="text-navy-600">
                  {`
                    ${new Date(programme.start_date).toLocaleDateString()} to
                    ${new Date(programme.end_date).toLocaleDateString()}
                  `}
                </p>
              </div>

              {/* Institute Information */}
              <div>
                <h3 className="text-sm font-semibold text-navy-700 mb-1">Offering Institute</h3>
                <p className="text-navy-600">
                  {programme.institute_id ? (
                    <>
                      {programme.institute_name || `Institute ID: ${programme.institute_id}`}
                      {programme.institute_name && programme.institute_id && (
                        <span className="ml-2 text-xs text-navy-500">(ID: #{programme.institute_id})</span>
                      )}
                    </>
                  ) : (
                    "Not assigned to any institute"
                  )}
                </p>
              </div>

              {/* Timestamps */}
              <div>
                <h3 className="text-sm font-semibold text-navy-700 mb-1">Created At</h3>
                <p className="text-navy-600">
                  {new Date(programme.created_at).toLocaleString()}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-navy-700 mb-1">Updated At</h3>
                <p className="text-navy-600">
                  {new Date(programme.updated_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 px-4">
            <span className="text-4xl">🎓</span>
            <h3 className="mt-2 text-base font-medium text-navy-800">No training programme data available</h3>
            <p className="mt-1 text-sm text-navy-500">
              Unable to load training programme details. Please try again later.
            </p>
          </div>
        )}
      </div>

      {/* Back to List Link */}
      <div className="text-center">
        <Link
          to="/training"
          className="inline-flex items-center px-4 py-2 bg-navy-600 text-white font-medium rounded-md shadow-sm hover:bg-navy-700"
        >
          ← Back to Training Programmes List
        </Link>
      </div>
    </div>
  );
};

export default TrainingDetail;
