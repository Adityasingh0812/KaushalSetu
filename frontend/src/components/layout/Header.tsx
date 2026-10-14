import { LanguageToggle } from "../ui/LanguageToggle";
import { UserProfile } from "../ui/UserProfile";

export const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-navy-800">KaushalSetu</h1>
          <nav className="hidden md:flex space-x-4">
            <a href="#" className="text-navy-600 hover:text-navy-800">Dashboard</a>
            <a href="#" className="text-navy-600 hover:text-navy-800">Candidates</a>
            <a href="#" className="text-navy-600 hover:text-navy-800">Analytics</a>
            <a href="#" className="text-navy-600 hover:text-navy-800">Reports</a>
          </nav>
        </div>
        <div className="flex items-center space-x-3">
          <LanguageToggle />
          <UserProfile />
        </div>
      </div>
    </header>
  );
};
