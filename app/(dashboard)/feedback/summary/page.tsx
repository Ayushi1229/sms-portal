import type { Metadata } from "next";

export const metadata: Metadata = {
  Feedback Summary: "Feedback Summary - SMMS",
};

export default function FeedbackSummaryPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Feedback Summary</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">This page will be implemented in Week 4-5</p>
      </div>
    </div>
  );
}
