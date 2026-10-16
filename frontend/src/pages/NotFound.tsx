import React from "react";
import { Link } from "react-router-dom";

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="h-16 w-16 rounded-full bg-navy-100 flex items-center justify-center text-navy-700">
            404
          </div>
        </div>
        <h2 className="mb-4 text-3xl font-bold text-navy-800">
          Page Not Found
        </h2>
        <p className="max-w-md text-navy-600">
          The page you're looking for doesn't exist or has been removed.
        </p>
        <div className="mt-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center px-4 py-2 bg-navy-600 text-white font-medium rounded-md shadow-sm hover:bg-navy-700"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};
