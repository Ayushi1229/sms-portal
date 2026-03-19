"use client";

import { useEffect } from "react";
import { AlertOctagon, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 p-4 font-sans relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 max-w-2xl w-full bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-8 md:p-16 text-center transform transition-all duration-500 hover:shadow-3xl">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-100 rounded-full animate-bounce">
            <AlertOctagon size={48} className="text-red-500" strokeWidth={1.5} />
          </div>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
          Oops! Something went wrong.
        </h1>
        <p className="text-lg text-gray-600 mb-10 max-w-lg mx-auto leading-relaxed">
          We experienced an unexpected error while trying to process your request. Our team has been notified.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={reset}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold hover:from-red-600 hover:to-orange-600 transition-all duration-200 shadow-md shadow-red-200 active:scale-95 hover:shadow-lg"
          >
            <RotateCcw size={18} />
            Try Again
          </button>
          
          <Link 
            href="/dashboard" 
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 hover:text-red-600 transition-all duration-200 shadow-sm active:scale-95 group"
          >
            <Home size={18} />
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
