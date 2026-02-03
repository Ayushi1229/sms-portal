import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Login - SMS Portal",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-8 sm:p-10">
            <div className="mb-8">
              <p className="text-sm font-semibold text-slate-600">SMS Portal</p>
              <h1 className="mt-2 text-2xl font-semibold text-slate-900">
                Sign in to your account
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Access dashboards for admins, mentors, and students.
              </p>
            </div>

            <LoginForm />

            <p className="mt-6 text-sm text-slate-600">
              New here?{" "}
              <Link
                href="/register"
                className="font-medium text-slate-900 hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>

          <div className="relative hidden md:block bg-gradient-to-br from-slate-900 to-slate-700 p-10 text-white">
            <div className="absolute inset-0 opacity-10" />
            <div className="relative h-full flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-semibold">Welcome back</h2>
                <p className="mt-3 text-sm text-slate-200">
                  Manage sessions, track progress, and stay on top of mentorship
                  activity in one place.
                </p>
              </div>

              <ul className="space-y-3 text-sm text-slate-200">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 h-2 w-2 rounded-full bg-white/80" />
                  Secure, role-based access
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 h-2 w-2 rounded-full bg-white/80" />
                  Quick links to dashboards
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 h-2 w-2 rounded-full bg-white/80" />
                  Notifications that keep you informed
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
