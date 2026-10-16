import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { authenticatedFetch } from "../services/authRequest";
import { useAuth } from "../contexts/AuthContext";
import { TrainingProgrammeRead } from "./TrainingDetail";

export interface TrainingFormValues {
  name: string;
  description: string | null;
  course_or_skill_area: string;
  training_provider: string | null;
  location: string | null;
  start_date: string; // ISO date string
  end_date: string; // ISO date string
  status: string | null; // "draft" | "active" | "completed" | "cancelled"
}

export const TrainingForm: React.FC = () => {
  const { programme_id } = useParams<{ programme_id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [values, setValues] = useState<TrainingFormValues>({
    name: "",
    description: null,
    course_or_skill_area: "",
    training_provider: null,
    location: null,
    start_date: "",
    end_date: "",
    status: null,
  });
  const [initialValues, setInitialValues] = useState<TrainingFormValues | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  // Determine if we are in edit mode (based on presence of programme_id)
  useEffect(() => {
    setIsEdit(!!programme_id);
  }, [programme_id]);

  // Fetch existing programme data for edit mode
  useEffect(() => {
    if (isEdit && programme_id) {
      const fetchProgramme = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await authenticatedFetch<TrainingProgrammeRead>(`/training/${programme_id}`);
          // Map the response to our form values
          const formValues: TrainingFormValues = {
            name: response.name,
            description: response.description ?? null,
            course_or_skill_area: response.course_or_skill_area,
            training_provider: response.training_provider ?? null,
            location: response.location ?? null,
            start_date: response.start_date, // Assuming ISO string
            end_date: response.end_date, // Assuming ISO string
            status: response.status,
          };
          setValues(formValues);
          setInitialValues(formValues);
        } catch (err: any) {
          if (err.message && err.message.includes("404")) {
            setError("Training programme not found. It may have been removed.");
          } else if (err.message && err.message.includes("403")) {
            setError("Access restricted. You are not authorized to view this training programme.");
          } else {
            setError(err.message || "Failed to load training programme details.");
          }
        } finally {
          setLoading(false);
        }
      };
      fetchProgramme();
    }
  }, [isEdit, programme_id]);

  // Reset form to initial values (useful for edit mode if we want to reset)
  const resetForm = useCallback(() => {
    if (initialValues) {
      setValues(initialValues);
    }
  }, [initialValues]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement
    >
  ) => {
    const { name, value, type, checked } = e.target;
    setValues(prev => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? +value
          : value === ""
          ? null
          : value,
    }));
  };

  // Validate form
  const validate = useCallback((): string | null => {
    if (!values.name.trim()) {
      return "Programme name is required";
    }
    if (!values.course_or_skill_area.trim()) {
      return "Course/skill area is required";
    }
    if (!values.start_date) {
      return "Start date is required";
    }
    if (!values.end_date) {
      return "End date is required";
    }
    const start = new Date(values.start_date);
    const end = new Date(values.end_date);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return "Invalid date format";
    }
    if (end < start) {
      return "End date must be on or after start date";
    }
    return null;
  }, [values]);

  // Get changed fields for PATCH requests (only send fields that have actually changed)
  const getChangedFields = useCallback((): Record<string, any> => {
    if (!isEdit || !initialValues) {
      // In create mode, send all fields
      return values;
    }

    const changedFields: Record<string, any> = {};
    const fieldsToCheck: (keyof TrainingFormValues)[] = [
      "name",
      "description",
      "course_or_skill_area",
      "training_provider",
      "location",
      "start_date",
      "end_date",
      "status",
    ];

    for (const field of fieldsToCheck) {
      if (values[field] !== initialValues[field]) {
        changedFields[field] = values[field];
      }
    }

    return changedFields;
  }, [isEdit, initialValues, values]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const validationError = validate();
      if (validationError) {
        setError(validationError);
        return;
      }

      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        if (isEdit && programme_id) {
          // Edit mode: PATCH /api/v1/training/{programme_id}
          // Only send fields that have actually changed
          const updateData = getChangedFields();
          
          // If no fields changed, we can skip the request
          if (Object.keys(updateData).length === 0) {
            setSuccess(true);
            setTimeout(() => {
              navigate(`/training/${programme_id}`);
            }, 1500);
            return;
          }

          await authenticatedFetch<any>(`/training/${programme_id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updateData),
          });
        } else {
          // Create mode: POST /api/v1/training
          await authenticatedFetch<any>("/training", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          });
        }
        setSuccess(true);
        // Optionally, redirect to the list or detail page after success
        // We'll redirect to the list page after a short delay
        setTimeout(() => {
          navigate(`/training`);
        }, 1500);
      } catch (err: any) {
        if (err.message && err.message.includes("403")) {
          setError("Access restricted. You are not authorized to perform this action.");
        } else if (err.message && err.message.includes("422")) {
          // Validation error from backend
          setError("Invalid data: end date must be after start date.");
        } else {
          setError(err.message || "Failed to save training programme. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    },
    [isEdit, programme_id, values, validate, getChangedFields, navigate]
  );

  // If we want to allow resetting the form in edit mode
  const handleReset = (e: React.MouseEvent) => {
    e.preventDefault();
    resetForm();
  };

  // Status options
  const statusOptions = [
    { label: "Draft", value: "draft" },
    { label: "Active", value: "active" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
  ];

  return (
    <div className="space-y-6">
      {/* Header and Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-navy-800">
            {isEdit ? "Edit Training Programme" : "Create Training Programme"}
          </h1>
          <p className="text-sm text-navy-600 mt-1">
            {isEdit
              ? "Update the details of this training programme."
              : "Create a new training programme offered by institutes."}
          </p>
        </div>

        {/* Cancel/Back link */}
        <div className="text-right">
          <Link
            to={isEdit ? `/training/${programme_id}` : "/training"}
            className="inline-flex items-center px-3 py-1 text-sm font-medium text-navy-600 hover:text-navy-800 hover:underline"
          >
            {isEdit ? "View Programme" : "Browse Programmes"}
          </Link>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md flex items-start justify-between">
          <div className="flex items-center">
            <span className="text-red-500 text-xl mr-3">⚠️</span>
            <p class="text-sm text-red-700">{error}</p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="text-xs font-semibold text-red-700 hover:text-red-900 underline ml-4"
          >
            Retry
          </button>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-md flex items-start justify-between">
          <div className="flex items-center">
            <span className="text-green-500 text-xl mr-3">✅</span>
            <p class="text-sm text-green-700">
              Training programme saved successfully! Redirecting...
            </p>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Programme Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-navy-700 mb-1">
              Programme Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={values.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-navy-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={values.description ?? ""}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500"
            />
          </div>

          {/* Course/Skill Area */}
          <div>
            <label htmlFor="course_or_skill_area" className="block text-sm font-medium text-navy-700 mb-1">
              Course/Skill Area
            </label>
            <input
              id="course_or_skill_area"
              type="text"
              name="course_or_skill_area"
              value={values.course_or_skill_area}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500"
            />
          </div>

          {/* Training Provider */}
          <div>
            <label htmlFor="training_provider" className="block text-sm font-medium text-navy-700 mb-1">
              Training Provider
            </label>
            <input
              id="training_provider"
              type="text"
              name="training_provider"
              value={values.training_provider ?? ""}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500"
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-navy-700 mb-1">
              Location
            </label>
            <input
              id="location"
              type="text"
              name="location"
              value={values.location ?? ""}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500"
            />
          </div>

          {/* Start Date */}
          <div>
            <label htmlFor="start_date" className="block text-sm font-medium text-navy-700 mb-1">
              Start Date
            </label>
            <input
              id="start_date"
              type="date"
              name="start_date"
              value={values.start_date}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500"
            />
          </div>

          {/* End Date */}
          <div>
            <label htmlFor="end_date" className="block text-sm font-medium text-navy-700 mb-1">
              End Date
            </label>
            <input
              id="end_date"
              type="date"
              name="end_date"
              value={values.end_date}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500"
            />
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-navy-700 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={values.status ?? ""}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500"
            >
              <option value="">-- Select Status --</option>
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={handleReset}
              disabled={loading || !isEdit}
              className="px-4 py-2 text-sm font-medium text-navy-600 bg-navy-50 hover:bg-navy-100 rounded-md hover:underline"
            >
              {isEdit ? "Reset" : "Cancel"}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-navy-600 text-white text-sm font-medium rounded-md hover:bg-navy-700 transition-colors focus:outline-none focus:ring-2 focus:ring-navy-500"
            >
              {loading ? "Saving..." : isEdit ? "Update Programme" : "Create Programme"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrainingForm;
