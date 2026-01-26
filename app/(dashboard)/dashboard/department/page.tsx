import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Department Dashboard - SMMS",
};

export default function DepartmentDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Department Dashboard</h1>
      <p className="text-gray-600 mb-6">Department-level metrics and oversight</p>
      
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Department: Computer Science & Engineering</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-gray-500">Mentors</div>
            <div className="text-2xl font-bold">15</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Students</div>
            <div className="text-2xl font-bold">120</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Sessions This Month</div>
            <div className="text-2xl font-bold">48</div>
          </div>
        </div>
      </div>
    </div>
  );
}
