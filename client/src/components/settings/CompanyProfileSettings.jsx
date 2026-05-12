import { useState } from 'react';
import { 
  Upload, 
  Globe, 
  Mail,
  X,
  Link as LinkIcon
} from 'lucide-react';

export default function CompanyProfileSettings() {
  const [formData, setFormData] = useState({
    publicProfile: 'Untitled UI',
    tagline: 'Untitled UI is the ultimate Figma UI kit and design system. Kickstart any project and level up as a designer.',
    instagram: 'untitled',
    twitter: 'untitledui',
    facebook: 'untitledui',
    linkedin: 'company/untitledui',
    brandingReports: true,
    brandingEmails: true
  });

  return (
    <div className="space-y-8 divide-y divide-gray-200">
      {/* Header */}
      <div className="pt-6">
        <h2 className="text-lg font-semibold text-gray-900">Company profile</h2>
        <p className="text-sm text-gray-500 mt-1">Update your company photo and details here.</p>
      </div>

      {/* Public Profile */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pt-6">
        <div className="md:col-span-3">
          <label className="text-sm font-medium text-gray-700">Public profile <span className="text-indigo-600">*</span></label>
          <p className="text-xs text-gray-500 mt-1">This will be displayed on your profile.</p>
        </div>
        <div className="md:col-span-9 space-y-4 max-w-2xl">
          <input 
            type="text" 
            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={formData.publicProfile}
            onChange={(e) => setFormData({...formData, publicProfile: e.target.value})}
          />
          <div className="flex items-center">
            <span className="px-3 py-2.5 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg text-sm text-gray-500">untitledui.com/profile/</span>
            <input 
              type="text" 
              className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-r-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={formData.instagram}
              onChange={(e) => setFormData({...formData, instagram: e.target.value})}
            />
          </div>
        </div>
      </div>

      {/* Tagline */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pt-6">
        <div className="md:col-span-3">
          <label className="text-sm font-medium text-gray-700">Tagline <span className="text-indigo-600">*</span></label>
          <p className="text-xs text-gray-500 mt-1">A quick snapshot of your company.</p>
        </div>
        <div className="md:col-span-9 max-w-2xl">
          <textarea 
            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all min-h-[100px] resize-none"
            value={formData.tagline}
            onChange={(e) => setFormData({...formData, tagline: e.target.value})}
          />
          <p className="text-xs text-gray-400 mt-2">41 characters left</p>
        </div>
      </div>

      {/* Company Logo */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pt-6">
        <div className="md:col-span-3">
          <label className="text-sm font-medium text-gray-700">Company logo <span className="text-indigo-600">*</span></label>
          <p className="text-xs text-gray-500 mt-1">Update your company logo and then choose where you want it to display.</p>
        </div>
        <div className="md:col-span-9 flex items-start gap-6 max-w-2xl">
          <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
             <div className="w-6 h-6 bg-white/20 rounded-full" />
          </div>
          <div className="flex-1">
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center hover:border-indigo-400 hover:bg-indigo-50/10 transition-all cursor-pointer group">
              <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-indigo-50 transition-colors border border-gray-100">
                <Upload className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
              </div>
              <p className="text-sm text-gray-600">
                <span className="text-indigo-600 font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or GIF (max. 800×400px)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Branding */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pt-6">
        <div className="md:col-span-3">
          <label className="text-sm font-medium text-gray-700">Branding</label>
          <p className="text-xs text-gray-500 mt-1">Add your logo to reports and emails.</p>
          <button className="text-xs font-semibold text-indigo-600 mt-2 hover:text-indigo-700">View examples</button>
        </div>
        <div className="md:col-span-9 space-y-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              className="mt-1 w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" 
              checked={formData.brandingReports}
              onChange={(e) => setFormData({...formData, brandingReports: e.target.checked})}
            />
            <div>
              <span className="text-sm font-medium text-gray-900">Reports</span>
              <p className="text-xs text-gray-500">Include my logo in summary reports.</p>
            </div>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              className="mt-1 w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" 
              checked={formData.brandingEmails}
              onChange={(e) => setFormData({...formData, brandingEmails: e.target.checked})}
            />
            <div>
              <span className="text-sm font-medium text-gray-900">Emails</span>
              <p className="text-xs text-gray-500">Include my logo in customer emails.</p>
            </div>
          </label>
        </div>
      </div>

      {/* Social Profiles */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pt-6 pb-10">
        <div className="md:col-span-3">
          <label className="text-sm font-medium text-gray-700">Social profiles</label>
        </div>
        <div className="md:col-span-9 space-y-3 max-w-2xl">
          <div className="flex items-center">
            <span className="w-32 px-3 py-2.5 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg text-sm text-gray-500">x.com/</span>
            <input 
              type="text" 
              className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-r-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={formData.twitter}
              onChange={(e) => setFormData({...formData, twitter: e.target.value})}
            />
          </div>
          <div className="flex items-center">
            <span className="w-32 px-3 py-2.5 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg text-sm text-gray-500">facebook.com/</span>
            <input 
              type="text" 
              className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-r-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={formData.facebook}
              onChange={(e) => setFormData({...formData, facebook: e.target.value})}
            />
          </div>
          <div className="flex items-center">
            <span className="w-32 px-3 py-2.5 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg text-sm text-gray-500">linkedin.com/</span>
            <input 
              type="text" 
              className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-r-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={formData.linkedin}
              onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
            />
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-end gap-3 pt-8 pb-4">
        <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button className="px-4 py-2 bg-indigo-600 border border-indigo-600 rounded-lg text-sm font-semibold text-white hover:bg-indigo-700 transition-colors shadow-sm">
          Save
        </button>
      </div>
    </div>
  );
}
