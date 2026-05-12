import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Calendar, MoreHorizontal, User } from 'lucide-react';

const ReportsView = ({ type = 'Saved reports' }) => {
  const reports = [
    { id: 1, name: 'Q1 Performance Audit', date: 'Apr 12, 2026', size: '2.4 MB', author: 'Olivia Rhye' },
    { id: 2, name: 'Brand Collaboration Summary', date: 'Mar 28, 2026', size: '1.8 MB', author: 'Olivia Rhye' },
    { id: 3, name: 'Creator Engagement Metrics', date: 'Mar 15, 2026', size: '3.2 MB', author: 'Phoenix Baker' },
    { id: 4, name: 'Monthly Revenue Projection', date: 'Mar 01, 2026', size: '940 KB', author: 'Olivia Rhye' },
  ];

  const getTitle = () => {
    if (type === 'Saved reports') return 'Saved Reports';
    if (type === 'Scheduled reports') return 'Scheduled Reports';
    if (type === 'User reports') return 'User Specific Reports';
    return 'Reports';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{getTitle()}</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-all shadow-sm">
          <FileText size={16} /> Generate new report
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Report Name</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Size</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Author</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                      <FileText size={16} />
                    </div>
                    <span className="font-bold text-gray-900">{report.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar size={14} />
                    {report.date}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{report.size}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-[10px] font-bold text-gray-600">
                      {report.author.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{report.author}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-gray-200 rounded-lg text-gray-500 transition-colors">
                      <Download size={16} />
                    </button>
                    <button className="p-2 hover:bg-gray-200 rounded-lg text-gray-500 transition-colors">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ReportsView;
