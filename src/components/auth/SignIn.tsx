import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

export function SignIn({ defaultStep = "signIn" }: { defaultStep?: "signIn" | "signUp" }) {
  const { isAuthenticated } = useConvexAuth();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/";
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<"signIn" | "signUp">(defaultStep);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 dark:bg-slate-950">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-700/50 dark:bg-slate-900/80">
        <h1 className="text-center text-2xl font-bold tracking-tight text-amber-400">
          Much Ado
        </h1>
        <p className="text-center text-slate-400">
          {step === "signIn" ? "Sign in to your account" : "Create your account"}
        </p>

        <form
          onSubmit={async (event) => {
            event.preventDefault();
            setError(null);
            setLoading(true);
            const formData = new FormData(event.currentTarget);
            try {
              await signIn("password", formData);
            } catch (e) {
              setError(e instanceof Error ? e.message : "Something went wrong");
            } finally {
              setLoading(false);
            }
          }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Email"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              placeholder="Password"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
            />
          </div>
          <input name="flow" type="hidden" value={step} />

          {error && (
            <p className="rounded-lg bg-red-500/20 px-3 py-2 text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-amber-500 px-4 py-3 font-semibold text-slate-900 transition hover:bg-amber-400 disabled:opacity-50"
          >
            {loading ? "Please wait..." : step === "signIn" ? "Sign in" : "Sign up"}
          </button>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={() => {
              setStep(step === "signIn" ? "signUp" : "signIn");
              setError(null);
            }}
            className="text-sm text-amber-400 hover:text-amber-300"
          >
            {step === "signIn" ? "Sign up instead" : "Sign in instead"}
          </button>
        </div>
      </div>
    </div>
  );
}
