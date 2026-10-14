export const UserProfile = () => {
  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <div className="h-8 w-8 bg-navy-200 rounded-full flex items-center justify-center">
          <span className="text-navy-600 font-medium">DT</span>
        </div>
        <div className="space-y-0">
          <p className="text-sm font-medium text-navy-800">Demo Trainee</p>
          <p className="text-xs text-navy-500">trainee@example.com</p>
        </div>
      </div>
    </div>
  );
};
