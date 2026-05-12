import { useState } from 'react';
import { 
  Monitor, 
  Smartphone, 
  Trash2,
  Check,
  X,
  MoreVertical
} from 'lucide-react';

export default function PasswordSettings() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const sessions = [
    {
      id: 1,
      device: '2026 MacBook Pro 14-inch',
      location: 'Melbourne, Australia',
      date: '22 Jan at 10:40am',
      active: true,
      type: 'desktop'
    },
    {
      id: 2,
      device: '2026 MacBook Pro 14-inch',
      location: 'Melbourne, Australia',
      date: '22 Jan at 4:20pm',
      active: false,
      type: 'desktop'
    }
  ];

  return (
    <div className="space-y-8 divide-y divide-gray-200">
      {/* Password Change Section */}
      <div className="pt-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Password</h2>
            <p className="text-sm text-gray-500 mt-1">Please enter your current password to change your password.</p>
          </div>
        </div>

        <div className="space-y-6 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-4">
              <label className="text-sm font-medium text-gray-700">Current password <span className="text-indigo-600">*</span></label>
            </div>
            <div className="md:col-span-8">
              <input 
                type="password" 
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="••••••••"
                value={formData.currentPassword}
                onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-4">
              <label className="text-sm font-medium text-gray-700">New password <span className="text-indigo-600">*</span></label>
            </div>
            <div className="md:col-span-8">
              <input 
                type="password" 
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="••••••••"
                value={formData.newPassword}
                onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
              />
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-gray-400" />
                Must be at least 8 characters.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pb-6">
            <div className="md:col-span-4">
              <label className="text-sm font-medium text-gray-700">Confirm new password <span className="text-indigo-600">*</span></label>
            </div>
            <div className="md:col-span-8">
              <input 
                type="password" 
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button className="px-4 py-2 bg-indigo-600 border border-indigo-600 rounded-lg text-sm font-semibold text-white hover:bg-indigo-700 transition-colors shadow-sm">
            Update password
          </button>
        </div>
      </div>

      {/* Sessions Section */}
      <div className="pt-10 pb-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Where you're logged in</h2>
            <p className="text-sm text-gray-500 mt-1">We'll alert you via olivia@untitledui.com if there is any unusual activity on your account.</p>
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {sessions.map((session) => (
            <div key={session.id} className="flex items-start gap-4 py-4 border-b border-gray-100 last:border-0 group">
              <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                {session.type === 'desktop' ? <Monitor className="w-5 h-5 text-gray-400" /> : <Smartphone className="w-5 h-5 text-gray-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium text-gray-900">{session.device}</h4>
                  {session.active && (
                    <span className="flex items-center gap-1 px-1.5 py-0.5 bg-green-50 text-green-700 text-[10px] font-medium rounded-full border border-green-100">
                      <div className="w-1 h-1 bg-green-500 rounded-full" />
                      Active now
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">{session.location}</span>
                  <div className="w-1 h-1 bg-gray-300 rounded-full" />
                  <span className="text-xs text-gray-500">{session.date}</span>
                </div>
              </div>
              <button className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
