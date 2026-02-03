import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Attendance Report - SMMS",
};

export default function AttendanceReportPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Attendance Report</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Attendance records</p>
      </div>
    </div>
  );
}
