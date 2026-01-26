import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unauthorized - SMMS",
};

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>
        <p className="text-xl text-gray-600 mb-8">Access Denied</p>
        <p className="text-gray-500 mb-8">You don't have permission to access this resource</p>
        <a 
          href="/dashboard" 
          className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}
