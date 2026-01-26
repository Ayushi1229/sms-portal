import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register - SMMS",
};

export default function RegisterPage() {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Account</h1>
      <p className="text-gray-600 mb-4">
        Admin-initiated registration for new users
      </p>
      {/* Form will be added in Week 4-5 */}
    </div>
  );
}
