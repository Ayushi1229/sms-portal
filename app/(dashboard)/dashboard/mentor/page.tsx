import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentor Dashboard - SMMS",
};

export default function MentorDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Mentor Dashboard</h1>
      <p className="text-gray-600 mb-6">View your mentees and upcoming meetings</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">My Mentees (8)</h2>
          <p className="text-gray-600">Mentee list will be displayed here</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Upcoming Meetings</h2>
          <p className="text-gray-600">Schedule will be displayed here</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Academic Alerts</h2>
        <p className="text-gray-600">At-risk student alerts will appear here</p>
      </div>
    </div>
  );
}
