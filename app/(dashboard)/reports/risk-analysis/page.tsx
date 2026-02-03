import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Risk Analysis - SMMS",
};

export default function RiskAnalysisPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Risk Analysis</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Analyze student risks</p>
      </div>
    </div>
  );
}
