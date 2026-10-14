export const Sidebar = () => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200">
      <div className="flex-shrink-0 flex items-center px-4 py-6">
        <span className="text-xl font-semibold text-navy-800">Menu</span>
      </div>
      <nav className="mt-10 space-y-2">
        <a href="#" className="flex items-center px-4 py-2 text-navy-600 hover:bg-navy-50 hover:text-navy-800">
          Dashboard
        </a>
        <a href="#" className="flex items-center px-4 py-2 text-navy-600 hover:bg-navy-50 hover:text-navy-800">
          Candidates
        </a>
        <a href="#" className="flex items-center px-4 py-2 text-navy-600 hover:bg-navy-50 hover:text-navy-800">
          Training
        </a>
        <a href="#" className="flex items-center px-4 py-2 text-navy-600 hover:bg-navy-50 hover:text-navy-800">
          Employment
        </a>
        <a href="#" className="flex items-center px-4 py-2 text-navy-600 hover:bg-navy-50 hover:text-navy-800">
          Follow-ups
        </a>
        <a href="#" className="flex items-center px-4 py-2 text-navy-600 hover:bg-navy-50 hover:text-navy-800">
          Interventions
        </a>
        <a href="#" className="flex items-center px-4 py-2 text-navy-600 hover:bg-navy-50 hover:text-navy-800">
          Jobs
        </a>
        <a href="#" className="flex items-center px-4 py-2 text-navy-600 hover:bg-navy-50 hover:text-navy-800">
          Employers
        </a>
      </nav>
    </aside>
  );
};
