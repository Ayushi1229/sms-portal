import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Export Reports - SMMS",
};

export default function ExportReportsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Export Reports</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Export reports</p>
      </div>
    </div>
  );
}
