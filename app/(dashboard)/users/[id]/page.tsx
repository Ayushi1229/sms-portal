import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Details - SMMS",
};

export default function UserDetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">User Details</h1>
      <p className="text-gray-600 mb-4">User ID: {params.id}</p>
      
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">User profile details will be displayed here in Week 4-5</p>
      </div>
    </div>
  );
}
