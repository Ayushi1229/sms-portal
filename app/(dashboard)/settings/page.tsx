import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings - SMMS',
};

const settingCards = [
  {
    title: 'Profile Settings',
    description: 'Update your name, contact details, and profile preferences.',
    href: '/settings/profile',
  },
  {
    title: 'Password Settings',
    description: 'Change your password and review password policy requirements.',
    href: '/settings/password',
  },
  {
    title: 'Security Settings',
    description: 'Manage security controls, sessions, and account safety options.',
    href: '/settings/security',
  }
];

export default function SettingsHomePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Choose a settings module to continue.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {settingCards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition"
          >
            <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700">
              {card.title}
            </h2>
            <p className="text-sm text-gray-600 mt-2">{card.description}</p>
            <p className="text-sm font-medium text-blue-600 mt-4">Open</p>
          </Link>
        ))}
      </div>
    </div>
  );
}