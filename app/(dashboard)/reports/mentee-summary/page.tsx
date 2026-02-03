import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentee Summary Report - SMMS",
};

export default function MenteeSummaryReportPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Mentee Summary Report</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Mentee summary report</p>
      </div>
    </div>
  );
}
