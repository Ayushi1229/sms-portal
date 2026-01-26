import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit User - SMMS",
};

export default function EditUserPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit User</h1>
      <p className="text-gray-600 mb-4">User ID: {params.id}</p>
      
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">User edit form will be implemented in Week 4-5</p>
      </div>
    </div>
  );
}
