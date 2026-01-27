import type { Metadata } from "next";
import { Calendar, Clock, MapPin, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Schedule Session - SMMS",
};

export default function ScheduleSessionPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Schedule a Session</h1>

      <div className="bg-white rounded-lg shadow p-8">
        <form className="space-y-6">
          {/* Mentor Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mentor *</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Select Mentor</option>
                <option>Dr. John Smith</option>
                <option>Dr. Sarah Williams</option>
                <option>Prof. Michael Brown</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Student *</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Select Student</option>
                <option>Alice Johnson</option>
                <option>Bob Davis</option>
                <option>Carol Smith</option>
              </select>
            </div>
          </div>

          {/* Session Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Calendar size={16} className="inline mr-2" />
                Date *
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Clock size={16} className="inline mr-2" />
                Time *
              </label>
              <input
                type="time"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Duration and Mode */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Duration (minutes) *</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>30</option>
                <option>45</option>
                <option>60</option>
                <option>90</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mode *</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>In-Person</option>
                <option>Virtual</option>
                <option>Hybrid</option>
              </select>
            </div>
          </div>

          {/* Location / Meeting Link */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <MapPin size={16} className="inline mr-2" />
              Location / Meeting Link
            </label>
            <input
              type="text"
              placeholder="Room 101 or https://meet.google.com/..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Topic / Agenda */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Topic / Agenda</label>
            <textarea
              rows={4}
              placeholder="Describe the session topic..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Schedule Session
            </button>
            <button
              type="reset"
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition font-semibold"
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* Quick Info */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3">Scheduling Tips</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>✓ Choose a time that works for both mentor and student</li>
          <li>✓ Sessions are typically 30-90 minutes</li>
          <li>✓ Provide clear agenda for better discussions</li>
          <li>✓ Confirmation email will be sent to both participants</li>
        </ul>
      </div>
    </div>
  );
}
