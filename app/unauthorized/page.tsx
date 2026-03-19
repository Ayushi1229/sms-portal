import type { Metadata } from "next";
import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Unauthorized - SMMS",
};

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-red-400/10 rounded-full blur-3xl mix-blend-multiply filter animate-blob" />
        <div className="absolute -bottom-10 right-1/4 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl mix-blend-multiply filter animate-blob animation-delay-2000" />
      </div>

      <div className="relative bg-white/80 backdrop-blur-xl border border-gray-100 z-10 px-8 py-12 md:p-16 rounded-3xl shadow-2xl max-w-lg w-full text-center mx-4">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-red-100">
          <ShieldAlert className="w-12 h-12 text-red-500" strokeWidth={1.5} />
        </div>
        
        <div className="space-y-4 mb-10">
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
            403
          </h1>
          <h2 className="text-2xl font-bold text-gray-800">
            Access Denied
          </h2>
          <p className="text-gray-500 text-lg">
            You don't have the required permissions to navigate to this page. Please contact your administrator.
          </p>
        </div>

        <Link 
          href="/dashboard" 
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 font-semibold text-lg"
        >
          <ArrowLeft size={20} />
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
