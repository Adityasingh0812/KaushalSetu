import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";

export const Sidebar = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();

  const isDashboardActive = location.pathname === "/" || location.pathname === "/dashboard";

  const getNavLinkClass = (isActive: boolean) =>
    `flex items-center px-4 py-2 text-navy-600 hover:bg-navy-50 hover:text-navy-800 ${
      isActive ? "bg-navy-50 text-navy-800 font-medium" : ""
    }`;

  return (
    <aside className="w-64 bg-white border-r border-gray-200">
      <div className="flex-shrink-0 flex items-center px-4 py-6">
        <span className="text-xl font-semibold text-navy-800">{t("menu.title")}</span>
      </div>
      <nav className="mt-10 space-y-2">
        <NavLink
          to="/dashboard"
          className={() => getNavLinkClass(isDashboardActive)}
        >
          {t("nav.dashboard")}
        </NavLink>
        {user?.role === "trainee" && (
          <NavLink
            to="/profile"
            className={({ isActive }) => getNavLinkClass(isActive)}
          >
            {t("nav.profile")}
          </NavLink>
        )}
        {(user?.role === "gov_admin" || user?.role === "institute_officer") && (
          <NavLink
            to="/candidates"
            className={({ isActive }) => getNavLinkClass(isActive)}
          >
            {t("nav.candidates")}
          </NavLink>
        )}
        <NavLink
          to="/training"
          className={({ isActive }) => getNavLinkClass(isActive)}
        >
          {t("nav.training")}
        </NavLink>
        <NavLink
          to="/employment"
          className={({ isActive }) => getNavLinkClass(isActive)}
        >
          {t("nav.employment")}
        </NavLink>
        <NavLink
          to="/followups"
          className={({ isActive }) => getNavLinkClass(isActive)}
        >
          {t("nav.followups")}
        </NavLink>
        <NavLink
          to="/interventions"
          className={({ isActive }) => getNavLinkClass(isActive)}
        >
          {t("nav.interventions")}
        </NavLink>
        <NavLink
          to="/jobs"
          className={({ isActive }) => getNavLinkClass(isActive)}
        >
          {t("nav.jobs")}
        </NavLink>
        <NavLink
          to="/employers"
          className={({ isActive }) => getNavLinkClass(isActive)}
        >
          {t("nav.employers")}
        </NavLink>
      </nav>
    </aside>
  );
};