import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Progress Report - SMMS",
};

export default function StudentProgressReportPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Student Progress Report</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Track student progress</p>
      </div>
    </div>
  );
}
