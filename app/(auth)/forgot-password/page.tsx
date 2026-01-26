import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password - SMMS",
};

export default function ForgotPasswordPage() {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Forgot Password</h1>
      <p className="text-gray-600 mb-4">
        Enter your email to receive a password reset link
      </p>
      {/* Form will be added in Week 4-5 */}
    </div>
  );
}
