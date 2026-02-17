import { getCurrentUser, ROLE_NAMES, getDashboardUrl } from '@/lib/auth';
import { cookies } from 'next/headers';
import Link from 'next/link';

export default async function AuthStatusPage() {
  const cookieStore = await cookies();
  const hasToken = !!cookieStore.get('accessToken');
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            🔐 Authentication Status
          </h1>

          {/* Authentication Status */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Current Status
            </h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <span className="font-medium text-gray-700 w-40">
                  Access Token:
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    hasToken
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {hasToken ? '✓ Present' : '✗ Missing'}
                </span>
              </div>
              <div className="flex items-center">
                <span className="font-medium text-gray-700 w-40">
                  Authentication:
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {user ? '✓ Authenticated' : '✗ Not Authenticated'}
                </span>
              </div>
            </div>
          </div>

          {/* User Information */}
          {user ? (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                User Information
              </h2>
              <div className="bg-blue-50 rounded-lg p-6 space-y-3">
                <div className="flex">
                  <span className="font-medium text-gray-700 w-32">ID:</span>
                  <span className="text-gray-900 font-mono text-sm">
                    {user.id}
                  </span>
                </div>
                <div className="flex">
                  <span className="font-medium text-gray-700 w-32">Email:</span>
                  <span className="text-gray-900">{user.email}</span>
                </div>
                <div className="flex">
                  <span className="font-medium text-gray-700 w-32">Role:</span>
                  <span className="text-gray-900">
                    {ROLE_NAMES[user.roleId]} (ID: {user.roleId})
                  </span>
                </div>
                <div className="flex">
                  <span className="font-medium text-gray-700 w-32">
                    Dashboard:
                  </span>
                  <Link
                    href={getDashboardUrl(user.roleId)}
                    className="text-blue-600 hover:underline"
                  >
                    {getDashboardUrl(user.roleId)}
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-8">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800">
                  ⚠️ You are not currently authenticated. Please login to access
                  the system.
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            {user ? (
              <>
                <Link
                  href={getDashboardUrl(user.roleId)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Go to Dashboard
                </Link>
                <form action="/api/auth/logout" method="POST">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Logout
                  </button>
                </form>
              </>
            ) : (
              <Link
                href="/login"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Login
              </Link>
            )}
          </div>

          {/* Test Information */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Test Credentials
            </h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-3">
                Use these credentials to test different roles:
              </p>
              <div className="space-y-2 text-sm">
                <div className="font-mono bg-white p-2 rounded">
                  <strong>Super Admin:</strong> admin@sampleinstitute.edu /
                  Password@123
                </div>
                <div className="font-mono bg-white p-2 rounded">
                  <strong>Dept Admin:</strong> cse.admin@sampleinstitute.edu /
                  Password@123
                </div>
                <div className="font-mono bg-white p-2 rounded">
                  <strong>Mentor:</strong> mentor@sampleinstitute.edu /
                  Password@123
                </div>
                <div className="font-mono bg-white p-2 rounded">
                  <strong>Student:</strong> student1@sampleinstitute.edu /
                  Password@123
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
