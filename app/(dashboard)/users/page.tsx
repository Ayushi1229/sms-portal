import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users - SMMS",
};

export default function UsersPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-1">Manage all system users</p>
        </div>
        <a 
          href="/users/new" 
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          + Add User
        </a>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="Search users..." 
              className="flex-1 px-4 py-2 border rounded-md"
            />
            <select className="px-4 py-2 border rounded-md">
              <option>All Roles</option>
              <option>Super Admin</option>
              <option>Department Admin</option>
              <option>Mentor</option>
              <option>Student</option>
            </select>
            <select className="px-4 py-2 border rounded-md">
              <option>All Departments</option>
            </select>
          </div>
        </div>
        <div className="p-6">
          <p className="text-gray-600">User list will be implemented in Week 4-5 with API integration</p>
        </div>
      </div>
    </div>
  );
}
