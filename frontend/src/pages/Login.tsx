import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      // On success, redirect to dashboard or intended location
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      setError(
        err?.message ||
          "Invalid email or password. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-navy-800">
            Sign in to KaushalSetu
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Use your institute account to access the system
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="sr-only">
              Email
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
                autoFocus
                required
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-400 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
                placeholder="Email address"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="sr-only">
              Password
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
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-400 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-navy-600 focus:ring-navy-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-navy-700">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a
                href="/forgot-password"
                className="font-medium text-navy-600 hover:text-navy-800"
              >
                Forgot password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md shadow-sm bg-navy-600 text-white hover:bg-navy-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-500"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-medium text-navy-600 hover:text-navy-800"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};