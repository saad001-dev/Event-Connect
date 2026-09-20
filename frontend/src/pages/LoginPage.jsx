import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import toast from "react-hot-toast";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore(); // FIX: login function use karein
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // localStorage se user dhundein
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.email === formData.email) {
          // FIX: login function call karein
          login(user, "demo-token-123");
          toast.success("Logged in successfully!");
          navigate("/");
        } else {
          throw new Error("Email not found. Please register first.");
        }
      } else {
        throw new Error("No account found. Please create an account.");
      }
    } catch (error) {
      toast.error(error.message || "Failed to login");
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0b0d12] flex items-center justify-center px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-48px)] w-full max-w-[1120px] items-center justify-center">
        <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-center lg:gap-10">
          {/* LEFT PANEL */}
          <section className="relative hidden h-[500px] w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/20 lg:block lg:w-[52%]">
            <img
              src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=1000&fit=crop"
              alt="Event networking"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-transparent" />
            <div className="relative z-10 flex h-full flex-col justify-between p-8 xl:p-10">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-lg shadow-lg backdrop-blur-md">
                    ✨
                  </div>
                  <span className="text-lg font-bold tracking-tight text-white">
                    Event Connect
                  </span>
                </div>
                <div className="mt-14 max-w-md">
                  <h2 className="text-[38px] font-bold leading-[1.08] tracking-tight text-white">
                    Connect with
                    <br />
                    <span className="bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
                      Professionals
                    </span>
                  </h2>
                  <p className="mt-5 max-w-[380px] text-sm leading-6 text-white/70">
                    Join thousands of professionals networking, learning and
                    building meaningful connections at events worldwide.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {["JD", "AK", "SM", "+"].map((item, index) => (
                    <div
                      key={index}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-white/10 text-[11px] font-semibold text-white backdrop-blur-md"
                    >
                      {item}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">
                    1,200+ Active Users
                  </p>
                  <p className="mt-0.5 text-[11px] text-white/60">
                    Growing every day
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* RIGHT PANEL */}
          <section className="flex min-h-[500px] w-full items-center rounded-2xl border border-white/10 bg-[#0f1118] px-6 py-8 shadow-2xl shadow-black/20 sm:px-10 lg:w-[48%] lg:px-11">
            <div className="mx-auto w-full max-w-[390px]">
              <div className="mb-7">
                <h1 className="text-[26px] font-bold tracking-tight text-white">
                  Welcome Back
                </h1>
                <p className="mt-2 text-sm leading-5 text-slate-400">
                  Sign in to continue your journey with Event Connect.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-xs font-medium text-slate-300 mb-1.5"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="w-full h-10 rounded-lg border border-white/10 bg-white/[0.045] pl-4 pr-3.5 text-sm text-white outline-none transition-all duration-200 placeholder:text-slate-500 hover:border-white/15 focus:border-indigo-400/60 focus:bg-white/[0.06] focus:ring-2 focus:ring-indigo-500/10"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="block text-xs font-medium text-slate-300 mb-1.5"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full h-10 rounded-lg border border-white/10 bg-white/[0.045] pl-4 pr-3.5 text-sm text-white outline-none transition-all duration-200 placeholder:text-slate-500 hover:border-white/15 focus:border-indigo-400/60 focus:bg-white/[0.06] focus:ring-2 focus:ring-indigo-500/10"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-10 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-sm font-semibold text-white shadow-lg shadow-indigo-500/10 transition-all duration-200 hover:-translate-y-0.5 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-xs text-slate-400">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-indigo-400 transition-colors hover:text-indigo-300"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default LoginPage;
