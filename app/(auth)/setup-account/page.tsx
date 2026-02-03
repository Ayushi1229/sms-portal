import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Setup Account - SMMS",
};

export default function SetupAccountPage() {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Setup Your Account</h1>
      <p className="text-gray-600 mb-4">
        Complete your profile and set a password
      </p>
    </div>
  );
}
