import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Dashboard - SMMS",
};

export default function StudentDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Dashboard</h1>
      <p className="text-gray-600 mb-6">Your mentoring journey and progress</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">My Mentor</h2>
          <p className="text-gray-600">Mentor information will be displayed here</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Meeting History</h2>
          <p className="text-gray-600">Past sessions will be listed here</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">My Goals</h2>
          <p className="text-gray-600">Active goals and progress will be shown here</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Feedback Received</h2>
          <p className="text-gray-600">Mentor feedback will appear here</p>
        </div>
      </div>
    </div>
  );
}
