import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";

export const Register = () => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (password !== confirmPassword) {
      setError(t("auth.passwords_mismatch"));
      return;
    }
    if (password.length < 8) {
      setError(t("auth.password_min"));
      return;
    }
    if (!email.includes("@")) {
      setError(t("auth.invalid_email"));
      return;
    }
    if (fullName.trim().length < 2) {
      setError(t("auth.name_min"));
      return;
    }

    setLoading(true);
    try {
      await register(email, fullName.trim(), phone.trim() || null, password);
      // Registration successful - redirect to login with success message
      navigate("/login?registered=true", { replace: true });
    } catch (err: any) {
      // Handle API error messages
      const msg = err?.message || "";
      if (msg.includes("400") || msg.includes("Email already registered")) {
        setError(t("auth.email_exists"));
      } else if (msg.includes("422") || msg.includes("validation")) {
        setError(t("auth.validation_error"));
      } else if (msg.includes("500")) {
        setError(t("auth.server_error"));
      } else {
        setError(msg || t("auth.server_error"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-navy-800">
            {t("auth.create_account")}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t("auth.register_as")}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="fullName" className="sr-only">
              {t("auth.full_name")}
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                </svg>
              </div>
              <input
                id="fullName"
                type="text"
                name="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoFocus
                required
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-400 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
                placeholder={t("auth.full_name")}
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="sr-only">
              {t("auth.email")}
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M3.05 3.05a4 4 0 015.657 5.656l-.708.707a1 1 0 00-1.414 1.415l-.707-.708a6 6 0 118.486 8.486l.708.707a1 1 0 001.415 1.414l.707.708a4 4 0 01-5.657-5.656l-.708-.707a6 6 0 11-8.486-8.486z" clip-rule="evenodd" />
                </svg>
              </div>
              <input
                id="email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-400 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
                placeholder={t("auth.email")}
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="sr-only">
              {t("auth.phone")}
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-400 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
                placeholder={t("auth.phone")}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="sr-only">
              {t("auth.password")}
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 12a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                  <path fill-rule="evenodd" d="M5.047 4.047a2 2 0 000 2.828l2.828 2.828a1 1 0 001.415-1.415l-1.415-1.415A2 2 0 017.465 6.465h11.53a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2v-.5a2 2 0 01.047-1.483l1.173-1.173z" clip-rule="evenodd" />
                </svg>
              </div>
              <input
                id="password"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-400 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
                placeholder={t("auth.password")}
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="sr-only">
              {t("auth.confirm_password")}
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 12a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                  <path fill-rule="evenodd" d="M5.047 4.047a2 2 0 000 2.828l2.828 2.828a1 1 0 001.415-1.415l-1.415-1.415A2 2 0 017.465 6.465h11.53a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2v-.5a2 2 0 01.047-1.483l1.173-1.173z" clip-rule="evenodd" />
                </svg>
              </div>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-400 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
                placeholder={t("auth.confirm_password")}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md shadow-sm bg-navy-600 text-white hover:bg-navy-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-500"
            >
              {loading ? t("auth.creating_account") : t("button.register")}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          {t("auth.already_have_account")}
          <Link
            to="/login"
            className="font-medium text-navy-600 hover:text-navy-800"
          >
            {t("button.login")}
          </Link>
        </p>

        <p className="mt-4 text-center text-xs text-gray-400">
          {t("auth.terms")}
        </p>
      </div>
    </div>
  );
};
