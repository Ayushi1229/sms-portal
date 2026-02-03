import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Institution - SMMS",
};

export default function NewInstitutionPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Add Institution</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Add a new institution</p>
      </div>
    </div>
  );
}
