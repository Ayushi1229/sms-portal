import type { Metadata } from "next";

export const metadata: Metadata = {
  Reports Dashboard: "Reports Dashboard - SMMS",
};

export default function ReportsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Reports Dashboard</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">This page will be implemented in Week 9 (Reports & Analytics)</p>
      </div>
    </div>
  );
}
