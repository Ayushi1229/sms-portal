'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Role {
  id: number;
  name: string;
}

interface Department {
  id: string;
  name: string;
}

export default function UserForm() {
  const router = useRouter();
  const [roles, setRoles] = useState<Role[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    roleId: '',
    departmentId: '',
  });

  useEffect(() => {
    // Fetch roles and departments
    const fetchData = async () => {
      try {
        // Hardcode roles (you can create an API endpoint later)
        setRoles([
          { id: 1, name: 'super_admin' },
          { id: 2, name: 'institutional_admin' },
          { id: 3, name: 'department_admin' },
          { id: 4, name: 'mentor' },
          { id: 5, name: 'student' },
        ]);

        // Fetch departments from API
        const deptResponse = await fetch('/api/departments?limit=100');
        if (deptResponse.ok) {
          const deptData = await deptResponse.json();
          // Handle the API response structure: { success: true, data: { departments: [...], pagination: {...} } }
          if (deptData.success && deptData.data && Array.isArray(deptData.data.departments)) {
            setDepartments(deptData.data.departments);
          } else if (Array.isArray(deptData.data)) {
            // Fallback in case structure is different
            setDepartments(deptData.data);
          } else {
            console.warn('Unexpected departments API response structure:', deptData);
            setDepartments([]);
          }
        } else {
          console.error('Failed to fetch departments');
          setDepartments([]);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setDepartments([]);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.email || !formData.firstName || !formData.lastName || !formData.password || !formData.roleId) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      const payload = {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        password: formData.password,
        roleId: parseInt(formData.roleId),
        ...(formData.departmentId && { departmentId: formData.departmentId }),
      };

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create user');
      }

      alert('User created successfully!');
      router.push('/users');
    } catch (err) {
      console.error('Error creating user:', err);
      setError(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Add New User</h1>
        <p className="text-gray-600 mt-1">Create a new user account</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
              <select
                name="roleId"
                value={formData.roleId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select a role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <select
                name="departmentId"
                value={formData.departmentId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select a department (optional)</option>
                {Array.isArray(departments) && departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
            >
              {loading ? 'Creating...' : 'Create User'}
            </button>
            <Link
              href="/users"
              className="mt-6 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
