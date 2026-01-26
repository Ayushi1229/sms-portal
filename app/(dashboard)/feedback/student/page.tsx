import type { Metadata } from "next";

export const metadata: Metadata = {
  Student Feedback: "Student Feedback - SMMS",
};

export default function StudentFeedbackPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Student Feedback</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">This page will be implemented in Week 4-5</p>
      </div>
    </div>
  );
}
