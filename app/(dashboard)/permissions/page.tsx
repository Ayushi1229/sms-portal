import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Permissions - SMMS",
};

export default function PermissionsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Permissions</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Manage permissions</p>
      </div>
    </div>
  );
}
