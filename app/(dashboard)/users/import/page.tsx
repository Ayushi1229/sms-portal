import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Import Users - SMMS",
};

export default function ImportUsersPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Bulk Import Users</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Upload Excel File</h2>
        <p className="text-gray-600 mb-4">Excel upload and bulk import will be implemented in Week 6</p>
        <div className="space-y-2 text-sm text-gray-500">
          <p>1. Download template Excel file</p>
          <p>2. Fill in user data (email, name, role, department)</p>
          <p>3. Upload filled template</p>
          <p>4. Review and confirm import</p>
        </div>
      </div>
    </div>
  );
}
