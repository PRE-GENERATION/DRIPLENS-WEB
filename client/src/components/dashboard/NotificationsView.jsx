import React from 'react';
import { motion } from 'framer-motion';
import { Bell, User, Heart, MessageSquare, Star, CheckCircle } from 'lucide-react';

const NotificationsView = () => {
  const notifications = [
    {
      id: 1,
      type: 'user',
      title: 'New member joined',
      message: 'Phoenix Baker has joined your community.',
      time: '2 hours ago',
      icon: <User className="text-blue-500" size={18} />,
      bgColor: 'bg-blue-50'
    },
    {
      id: 2,
      type: 'payment',
      title: 'Payment received',
      message: 'You received a payment of $450.00 from Lana Steiner.',
      time: '5 hours ago',
      icon: <CheckCircle className="text-green-500" size={18} />,
      bgColor: 'bg-green-50'
    },
    {
      id: 3,
      type: 'interaction',
      title: 'New comment on post',
      message: 'Natali Craig commented on "Building your API Stack".',
      time: 'Yesterday',
      icon: <MessageSquare className="text-purple-500" size={18} />,
      bgColor: 'bg-purple-50'
    },
    {
      id: 4,
      type: 'system',
      title: 'Monthly report ready',
      message: 'Your analytics report for April is now available to view.',
      time: '2 days ago',
      icon: <Star className="text-amber-500" size={18} />,
      bgColor: 'bg-amber-50'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Notifications</h2>
        <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
          Mark all as read
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        {notifications.map((notif, index) => (
          <div 
            key={notif.id}
            className={`p-6 flex gap-4 hover:bg-gray-50 transition-colors ${index !== notifications.length - 1 ? 'border-b border-gray-100' : ''}`}
          >
            <div className={`w-10 h-10 rounded-xl ${notif.bgColor} flex items-center justify-center shrink-0`}>
              {notif.icon}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-gray-900">{notif.title}</h4>
                <span className="text-xs text-gray-400 font-medium">{notif.time}</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">{notif.message}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default NotificationsView;
