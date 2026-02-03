import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Mentor - SMMS",
};

export default function NewMentorPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Add Mentor</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Add a new mentor</p>
      </div>
    </div>
  );
}
