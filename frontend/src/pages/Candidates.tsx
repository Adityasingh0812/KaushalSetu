import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { authenticatedFetch } from "../services/authRequest";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";

export interface CandidateListItem {
  id: number;
  user_id: number;
  full_name: string;
  email: string;
  phone: string | null;
  education_background: string | null;
  skills: string[] | null;
  preferred_location: string | null;
  institute_id: number | null;
  institute_name: string | null;
  created_at: string;
}

export interface PaginatedCandidatesResponse {
  items: CandidateListItem[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export const Candidates: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  // Filter & pagination states
  const [search, setSearch] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  // Applied query state to avoid refetching on every keystroke
  const [queryState, setQueryState] = useState({
    search: "",
    skills: "",
    location: "",
    page: 1,
    pageSize: 15,
  });

  const [data, setData] = useState<PaginatedCandidatesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCandidates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("page", String(queryState.page));
      params.set("page_size", String(queryState.pageSize));
      if (queryState.search.trim()) {
        params.set("search", queryState.search.trim());
      }
      if (queryState.skills.trim()) {
        params.set("skills", queryState.skills.trim());
      }
      if (queryState.location.trim()) {
        params.set("location", queryState.location.trim());
      }

      const response = await authenticatedFetch<PaginatedCandidatesResponse>(
        `/candidates?${params.toString()}`
      );
      setData(response);
    } catch (err: any) {
      if (err.message && err.message.includes("403")) {
        setError(t("candidates.access_restricted"));
      } else {
        setError(err.message || "Failed to load candidates directory. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [queryState, t]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQueryState((prev) => ({
      ...prev,
      search,
      skills: skillFilter,
      location: locationFilter,
      page: 1, // reset to page 1 on new filter
    }));
  };

  const handleClearFilters = () => {
    setSearch("");
    setSkillFilter("");
    setLocationFilter("");
    setQueryState({
      search: "",
      skills: "",
      location: "",
      page: 1,
      pageSize: queryState.pageSize,
    });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && (!data || newPage <= data.total_pages)) {
      setQueryState((prev) => ({ ...prev, page: newPage }));
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    setQueryState((prev) => ({
      ...prev,
      pageSize: newSize,
      page: 1,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header and Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-800">{t("candidates.title")}</h1>
          <p className="text-sm text-navy-600 mt-1">
            {t("candidates.subtitle")}
          </p>
        </div>

        {/* Demonstration Indicator Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-md text-xs font-medium self-start md:self-auto">
          <span className="text-sm">⚠️</span>
          <span>{t("training.synthetic_data_badge")}</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
        <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="search" className="block text-xs font-semibold text-navy-700 uppercase tracking-wider mb-1">
              {t("label.search")}
            </label>
            <input
              id="search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("candidates.search_placeholder")}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500"
            />
          </div>

          <div>
            <label htmlFor="skillFilter" className="block text-xs font-semibold text-navy-700 uppercase tracking-wider mb-1">
              {t("label.skill")}
            </label>
            <input
              id="skillFilter"
              type="text"
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              placeholder={t("candidates.skill_placeholder")}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500"
            />
          </div>

          <div>
            <label htmlFor="locationFilter" className="block text-xs font-semibold text-navy-700 uppercase tracking-wider mb-1">
              {t("label.location")}
            </label>
            <input
              id="locationFilter"
              type="text"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              placeholder={t("candidates.location_placeholder")}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500"
            />
          </div>

          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-navy-600 text-white text-sm font-medium rounded-md hover:bg-navy-700 transition-colors focus:outline-none focus:ring-2 focus:ring-navy-500"
            >
              {t("button.filter")}
            </button>
            <button
              type="button"
              onClick={handleClearFilters}
              className="px-3 py-2 bg-gray-100 text-navy-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              {t("button.reset")}
            </button>
          </div>
        </form>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md flex items-start justify-between">
          <div className="flex items-center">
            <span className="text-red-500 text-xl mr-3">⚠️</span>
            <p className="text-sm text-red-700">{error}</p>
          </div>
          <button
            onClick={() => fetchCandidates()}
            className="text-xs font-semibold text-red-700 hover:text-red-900 underline ml-4"
          >
            {t("button.retry")}
          </button>
        </div>
      )}

      {/* Main Content: Table or Loading or Empty State */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-navy-600 space-y-3">
            <div className="w-8 h-8 border-4 border-navy-200 border-t-navy-600 rounded-full animate-spin" />
            <p className="text-sm">{t("candidates.loading")}</p>
          </div>
        ) : !data || data.items.length === 0 ? (
          <div className="text-center py-16 px-4">
            <span className="text-4xl">👥</span>
            <h3 className="mt-2 text-base font-medium text-navy-800">{t("candidates.no_results")}</h3>
            <p className="mt-1 text-sm text-navy-500">
              {queryState.search || queryState.skills || queryState.location
                ? t("candidates.no_results_filter")
                : t("candidates.no_results_empty")}
            </p>
            {(queryState.search || queryState.skills || queryState.location) && (
              <div className="mt-4">
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 text-xs font-medium text-navy-600 bg-navy-50 hover:bg-navy-100 rounded-md border border-navy-200 transition-colors"
                >
                  {t("button.clear")}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-navy-700 uppercase tracking-wider">
                    {t("candidates.candidate")}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-navy-700 uppercase tracking-wider">
                    {t("candidates.contact")}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-navy-700 uppercase tracking-wider">
                    {t("candidates.institute")}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-navy-700 uppercase tracking-wider">
                    {t("candidates.skills")}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-navy-700 uppercase tracking-wider">
                    {t("candidates.preferred_location")}
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-navy-700 uppercase tracking-wider">
                    {t("training.action")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.items.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-9 w-9 rounded-full bg-navy-100 flex items-center justify-center text-navy-700 font-bold text-sm">
                          {candidate.full_name ? candidate.full_name.charAt(0).toUpperCase() : "C"}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-semibold text-navy-900">{candidate.full_name}</div>
                          <div className="text-xs text-navy-500">
                            {candidate.education_background || "Education not specified"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-navy-800">{candidate.email}</div>
                      <div className="text-xs text-navy-500">{candidate.phone || "No phone"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-navy-800">
                        {candidate.institute_name || t("training.unassigned")}
                      </div>
                      {candidate.institute_id && (
                        <div className="text-xs text-navy-500">ID: #{candidate.institute_id}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {candidate.skills && candidate.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {candidate.skills.slice(0, 3).map((skill, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200"
                            >
                              {skill}
                            </span>
                          ))}
                          {candidate.skills.length > 3 && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs text-navy-500 bg-gray-100">
                              +{candidate.skills.length - 3}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">{t("candidates.none_listed")}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-navy-700">
                      {candidate.preferred_location || "Not specified"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/candidates/${candidate.id}`}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-navy-600 bg-navy-50 hover:bg-navy-100 hover:text-navy-900 transition-colors"
                      >
                        {t("button.view_profile")}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {data && data.total > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs text-navy-600">
                {t("candidates.showing", {
                  start: ((data.page - 1) * data.page_size) + 1,
                  end: Math.min(data.page * data.page_size, data.total),
                  total: data.total,
                })}
              </span>

              <div className="flex items-center gap-1.5 text-xs text-navy-600">
                <label htmlFor="pageSize">{t("label.per_page")}</label>
                <select
                  id="pageSize"
                  value={queryState.pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="px-2 py-1 text-xs border border-gray-300 rounded bg-white text-navy-800 focus:outline-none focus:ring-1 focus:ring-navy-500"
                >
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(data.page - 1)}
                disabled={data.page <= 1}
                className="px-3 py-1.5 text-xs font-medium text-navy-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {t("button.previous")}
              </button>
              <span className="text-xs text-navy-700 px-2">
                {t("label.page", { current: data.page, total: data.total_pages })}
              </span>
              <button
                onClick={() => handlePageChange(data.page + 1)}
                disabled={data.page >= data.total_pages}
                className="px-3 py-1.5 text-xs font-medium text-navy-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {t("button.next")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
