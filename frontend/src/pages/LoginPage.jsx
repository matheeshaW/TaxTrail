import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function LoginPage() {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {}
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-4 py-10 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.22),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(14,165,233,0.14),transparent_38%)]" />

      <div className="relative mx-auto flex w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-md">
        <section className="hidden w-1/2 border-r border-white/10 bg-white/5 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold">TaxTrail</h1>
            <p className="mt-3 text-sm text-slate-300">
              Public finance insights made easier with tax, budget, and regional analysis in one place.
            </p>
          </div>

          <div className="space-y-3 text-sm text-slate-300">
            <p className="rounded-lg bg-white/10 px-4 py-3">Track tax contributions by region and year.</p>
            <p className="rounded-lg bg-white/10 px-4 py-3">Switch between records and analytical summaries quickly.</p>
            <p className="rounded-lg bg-white/10 px-4 py-3">Built for transparency and policy decision support.</p>
          </div>
        </section>

        <section className="w-full p-7 sm:p-10 lg:w-1/2">
          <h2 className="text-2xl font-bold text-white">Welcome back</h2>
          <p className="mt-1 text-sm text-slate-300">Sign in to continue to your dashboard.</p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-300">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-white placeholder:text-slate-300 outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-300/30"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-300">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-white placeholder:text-slate-300 outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-300/30"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <button
              className="w-full rounded-full bg-sky-400 px-4 py-2.5 font-semibold text-slate-950 shadow-sm transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {error && (
              <p className="rounded-lg border border-red-300/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {error}
              </p>
            )}
          </form>

          <p className="mt-5 text-sm text-slate-300">
            New here?{" "}
            <Link to="/register" className="font-semibold text-sky-300 hover:text-sky-200 hover:underline">
              Create an account
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}