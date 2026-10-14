import { LanguageToggle } from "../ui/LanguageToggle";
import { UserProfile } from "../ui/UserProfile";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

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
          {user ? (
            <>
              <UserProfile user={{ email: user.email, full_name: user.full_name, phone: user.phone }} />
              <button
                onClick={handleLogout}
                className="ml-2 text-sm font-medium text-navy-600 hover:text-navy-800"
              >
                Logout
              </button>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
};