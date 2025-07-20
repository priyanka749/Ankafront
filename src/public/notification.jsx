import { Bell, Check, X } from 'lucide-react';
import { useEffect, useState } from 'react';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  // Fetch notifications
  useEffect(() => {
    if (token) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [token]);

  // Update localStorage notification count whenever unreadCount changes
  useEffect(() => {
    localStorage.setItem('notificationCount', unreadCount.toString());
    window.dispatchEvent(new Event('notificationUpdated'));
  }, [unreadCount]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/notifications/unread-count', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setUnreadCount(data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await fetch(`http://localhost:3000/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.isRead);
      await Promise.all(
        unreadNotifications.map(notification => 
          fetch(`http://localhost:3000/api/notifications/${notification._id}/read`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` }
          })
        )
      );
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInSeconds = Math.floor((now - notificationDate) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order':
        return '🛍️';
      case 'payment':
        return '💳';
      default:
        return '📢';
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Bell size={48} className="mx-auto mb-4 text-gray-300" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600">Please log in to view your notifications</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
                {unreadCount > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    You have {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
                  </p>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="bg-[#8B6B3E] text-white px-4 py-2 rounded-lg hover:bg-[#6d5532] transition-colors duration-200 flex items-center gap-2"
                >
                  <Check size={16} />
                  Mark all as read
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B6B3E] mx-auto"></div>
              <p className="mt-4">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Bell size={64} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No notifications</h3>
              <p className="text-gray-600">You're all caught up! Check back later for updates.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-6 hover:bg-gray-50 transition-colors duration-200 ${
                    !notification.isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full ml-2"></span>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-600 mb-3 leading-relaxed">
                        {notification.message}
                      </p>
                      <p className="text-sm text-gray-400">
                        {formatTimeAgo(notification.createdAt)}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification._id)}
                        className="ml-4 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-200"
                        title="Mark as read"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notifications;