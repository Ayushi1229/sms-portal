import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password - SMMS",
};

export default function ResetPasswordPage() {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Reset Password</h1>
      <p className="text-gray-600 mb-4">
        Enter your new password
      </p>
\    </div>
  );
}
