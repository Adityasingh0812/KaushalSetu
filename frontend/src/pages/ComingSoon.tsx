import React from "react";

interface ComingSoonProps {
  module?: string;
}

export const ComingSoon: React.FC<ComingSoonProps> = ({ module }) => {
  const moduleName = module ? `${module} ` : "";
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="h-12 w-12 rounded-full bg-navy-100 flex items-center justify-center text-navy-700">
            ⚠️
          </div>
        </div>
        <h2 className="mb-4 text-2xl font-bold text-navy-800">
          {moduleName}Coming Soon
        </h2>
        <p className="max-w-md text-navy-600">
          This module is currently under development and will be available in a future update.
          Please check back later.
        </p>
      </div>
    </div>
  );
};
