import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - SMMS",
};

export default function LoginPage() {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Login to SMMS</h1>
      <p className="text-gray-600 mb-4">
        Role-based authentication for Admin / Mentor / Student
      </p>
      {/* Form will be added in Week 4-5 (Frontend Development) */}
      <div className="space-y-4">
        <div className="text-sm text-gray-500">
          <p>📧 Email login</p>
          <p>🔒 Password authentication</p>
          <p>🎭 Automatic role detection</p>
        </div>
      </div>
    </div>
  );
}
