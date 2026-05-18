import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  ChevronDown, 
  MoreVertical,
  Settings,
  Code
} from 'lucide-react';

export default function AppearanceSettings() {
  const [displayPreference, setDisplayPreference] = useState('system');
  const [bannerAppearance, setBannerAppearance] = useState('simplified');
  const [brandColor, setBrandColor] = useState('#7F56D9');
  const [transparentSidebar, setTransparentSidebar] = useState(true);

  const colors = [
    { name: 'Gray', value: '#4B5563' },
    { name: 'Green', value: '#10B981' },
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Indigo', value: '#6366F1' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Pink', value: '#EC4899' },
    { name: 'Orange', value: '#F59E0B' },
  ];

  return (
    <div className="space-y-8 divide-y divide-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between pt-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Appearance</h2>
          <p className="text-sm text-gray-500 mt-1">Change how your dashboard looks and feels.</p>
        </div>
        <button className="p-2 text-gray-400 hover:text-gray-600">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Company Logo */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pt-6">
        <div className="md:col-span-3">
          <label className="text-sm font-medium text-gray-700">Company logo</label>
          <p className="text-xs text-gray-500 mt-1">Update your company logo.</p>
        </div>
        <div className="md:col-span-9 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            D
          </div>
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            Replace logo
          </button>
        </div>
      </div>

      {/* Brand Color */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pt-6">
        <div className="md:col-span-3">
          <label className="text-sm font-medium text-gray-700">Brand color</label>
          <p className="text-xs text-gray-500 mt-1">Select or customize your brand color.</p>
        </div>
        <div className="md:col-span-9">
          <div className="flex flex-wrap items-center gap-3">
            {colors.map((color) => (
              <button
                key={color.value}
                onClick={() => setBrandColor(color.value)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  brandColor === color.value ? 'border-gray-900 scale-110' : 'border-transparent'
                }`}
                style={{ backgroundColor: color.value }}
              />
            ))}
            <div className="flex items-center gap-3 ml-2">
              <span className="text-sm text-gray-500">Custom</span>
              <button 
                className="w-8 h-8 rounded-full border-2 border-gray-900"
                style={{ backgroundColor: brandColor }}
              />
              <div className="flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-lg">
                <span className="text-sm text-gray-400 mr-2">#</span>
                <input 
                  type="text" 
                  value={brandColor.replace('#', '')} 
                  onChange={(e) => setBrandColor(`#${e.target.value}`)}
                  className="w-16 text-sm font-medium outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Display Preference */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pt-6">
        <div className="md:col-span-3">
          <label className="text-sm font-medium text-gray-700">Display preference</label>
          <p className="text-xs text-gray-500 mt-1">Switch between light and dark modes.</p>
        </div>
        <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { id: 'system', name: 'System preference', preview: 'system' },
            { id: 'light', name: 'Light mode', preview: 'light' },
            { id: 'dark', name: 'Dark mode', preview: 'dark' },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setDisplayPreference(mode.id)}
              className={`text-left group focus:outline-none`}
            >
              <div className={`aspect-[16/10] rounded-xl border-2 mb-3 overflow-hidden transition-all relative ${
                displayPreference === mode.id ? 'border-indigo-600 ring-2 ring-indigo-600/20' : 'border-gray-200 group-hover:border-gray-300'
              }`}>
                {/* Mockup Preview */}
                <div className={`absolute inset-0 flex flex-col ${mode.id === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
                  <div className={`h-3 border-b ${mode.id === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'} p-1 flex gap-1`}>
                    <div className="w-1 h-1 rounded-full bg-red-400" />
                    <div className="w-1 h-1 rounded-full bg-yellow-400" />
                    <div className="w-1 h-1 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 flex">
                    <div className={`w-1/4 border-r ${mode.id === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`} />
                    <div className="flex-1 p-2 space-y-2">
                      <div className={`h-1.5 w-1/2 rounded ${mode.id === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`} />
                      <div className={`h-6 w-full rounded border ${mode.id === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} relative`}>
                        <div className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-indigo-500" />
                      </div>
                    </div>
                  </div>
                </div>
                {mode.id === 'system' && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-white via-transparent to-gray-900 opacity-50 pointer-events-none" />
                )}
                {displayPreference === mode.id && (
                  <div className="absolute bottom-2 left-2 w-4 h-4 bg-indigo-600 rounded-full border-2 border-white flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  </div>
                )}
              </div>
              <span className={`text-sm font-medium ${displayPreference === mode.id ? 'text-gray-900' : 'text-gray-500'}`}>
                {mode.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Transparent Sidebar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pt-6">
        <div className="md:col-span-3">
          <label className="text-sm font-medium text-gray-700">Transparent sidebar</label>
          <p className="text-xs text-gray-500 mt-1">Make the sidebar transparent.</p>
        </div>
        <div className="md:col-span-9">
          <button 
            onClick={() => setTransparentSidebar(!transparentSidebar)}
            className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${
              transparentSidebar ? 'bg-indigo-600' : 'bg-gray-200'
            }`}
          >
            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
              transparentSidebar ? 'translate-x-5' : ''
            }`} />
          </button>
        </div>
      </div>

      {/* Language */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pt-6">
        <div className="md:col-span-3">
          <label className="text-sm font-medium text-gray-700">Language</label>
          <p className="text-xs text-gray-500 mt-1">Default language for public dashboard.</p>
        </div>
        <div className="md:col-span-9">
          <div className="relative max-w-sm">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
              <span className="text-base mr-2">🇺🇸</span>
            </div>
            <select className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-300 rounded-lg text-sm appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none">
              <option>English (US)</option>
              <option>Hindi</option>
              <option>Spanish</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Banner Appearance */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pt-6 pb-10">
        <div className="md:col-span-3">
          <label className="text-sm font-medium text-gray-700">Banner appearance</label>
          <p className="text-xs text-gray-500 mt-1">Change how banners appear to visitors.</p>
        </div>
        <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { id: 'default', name: 'Default', desc: 'Default solid brand color.' },
            { id: 'simplified', name: 'Simplified', desc: 'Minimal and simplified.' },
            { id: 'custom', name: 'Custom styling', desc: 'Manage styling with CSS.' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setBannerAppearance(item.id)}
              className="text-left group focus:outline-none"
            >
              <div className={`aspect-[16/10] rounded-xl border-2 mb-3 overflow-hidden transition-all relative bg-gray-50 flex items-center justify-center ${
                bannerAppearance === item.id ? 'border-indigo-600 ring-2 ring-indigo-600/20' : 'border-gray-200 group-hover:border-gray-300'
              }`}>
                {item.id === 'custom' ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-500 flex items-center gap-2">
                      <Code className="w-3.5 h-3.5" />
                      Edit CSS
                    </div>
                  </div>
                ) : (
                  <div className="w-3/4 h-3/4 bg-white rounded-lg border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className={`h-4 ${item.id === 'default' ? 'bg-indigo-600' : 'bg-gray-100'} m-2 rounded`} />
                    <div className="flex gap-2 p-2">
                      <div className="w-8 h-8 rounded-lg bg-gray-100" />
                      <div className="flex-1 space-y-1">
                        <div className="h-2 w-3/4 bg-gray-100 rounded" />
                        <div className="h-1.5 w-1/2 bg-gray-50 rounded" />
                      </div>
                    </div>
                    {item.id === 'simplified' && (
                      <div className="absolute bottom-2 left-2 w-4 h-4 bg-indigo-600 rounded-full border-2 border-white" />
                    )}
                  </div>
                )}
                {bannerAppearance === item.id && item.id !== 'custom' && (
                  <div className="absolute bottom-2 left-2 w-4 h-4 bg-indigo-600 rounded-full border-2 border-white flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  </div>
                )}
              </div>
              <p className={`text-sm font-medium ${bannerAppearance === item.id ? 'text-gray-900' : 'text-gray-500'}`}>{item.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Reset Section */}
      <div className="flex items-center justify-between pt-8 pb-4">
        <button className="text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors">
          Reset to default
        </button>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button className="px-4 py-2 bg-indigo-600 border border-indigo-600 rounded-lg text-sm font-semibold text-white hover:bg-indigo-700 transition-colors shadow-sm">
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
