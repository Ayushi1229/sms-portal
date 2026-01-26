import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add User - SMMS",
};

export default function NewUserPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Add New User</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 mb-4">User creation form will be implemented in Week 4-5</p>
        <div className="space-y-4 text-sm text-gray-500">
          <p>📧 Email & Role selection</p>
          <p>👤 Profile information (name, phone)</p>
          <p>🏢 Department assignment</p>
          <p>📝 Role-specific profile fields</p>
          <p>✉️ Send invite email</p>
        </div>
      </div>
    </div>
  );
}
