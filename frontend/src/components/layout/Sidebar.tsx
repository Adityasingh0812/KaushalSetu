import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isDashboardActive = location.pathname === "/" || location.pathname === "/dashboard";

  const getNavLinkClass = (isActive: boolean) =>
    `flex items-center px-4 py-2 text-navy-600 hover:bg-navy-50 hover:text-navy-800 ${
      isActive ? "bg-navy-50 text-navy-800 font-medium" : ""
    }`;

  return (
    <aside className="w-64 bg-white border-r border-gray-200">
      <div className="flex-shrink-0 flex items-center px-4 py-6">
        <span className="text-xl font-semibold text-navy-800">Menu</span>
      </div>
      <nav className="mt-10 space-y-2">
        <NavLink
          to="/dashboard"
          className={() => getNavLinkClass(isDashboardActive)}
        >
          Dashboard
        </NavLink>
        {user?.role === "trainee" && (
          <NavLink
            to="/profile"
            className={({ isActive }) => getNavLinkClass(isActive)}
          >
            Profile
          </NavLink>
        )}
        {(user?.role === "gov_admin" || user?.role === "institute_officer") && (
          <NavLink
            to="/candidates"
            className={({ isActive }) => getNavLinkClass(isActive)}
          >
            Candidates
          </NavLink>
        )}
        <NavLink
          to="/training"
          className={({ isActive }) => getNavLinkClass(isActive)}
        >
          Training
        </NavLink>
        <NavLink
          to="/employment"
          className={({ isActive }) => getNavLinkClass(isActive)}
        >
          Employment
        </NavLink>
        <NavLink
          to="/followups"
          className={({ isActive }) => getNavLinkClass(isActive)}
        >
          Follow-ups
        </NavLink>
        <NavLink
          to="/interventions"
          className={({ isActive }) => getNavLinkClass(isActive)}
        >
          Interventions
        </NavLink>
        <NavLink
          to="/jobs"
          className={({ isActive }) => getNavLinkClass(isActive)}
        >
          Jobs
        </NavLink>
        <NavLink
          to="/employers"
          className={({ isActive }) => getNavLinkClass(isActive)}
        >
          Employers
        </NavLink>
      </nav>
    </aside>
  );
};