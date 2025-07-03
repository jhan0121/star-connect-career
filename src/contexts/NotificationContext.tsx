
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  type: 'consultation_request' | 'consultation_accepted' | 'consultation_rejected' | 'new_message' | 'consultation_completed' | 'community_comment';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  userId?: string;
  consultationId?: number;
  postId?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  // 새로운 알림 트리거 함수들
  notifyConsultationApproved: (mentorName: string, consultationId: number) => void;
  notifyConsultationRejected: (mentorName: string, consultationId: number) => void;
  notifyCommunityComment: (postTitle: string, commenterName: string, postId: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const addNotification = (notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const notification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };
    
    setNotifications(prev => [notification, ...prev]);
    
    // Show toast notification
    toast({
      title: notification.title,
      description: notification.message,
    });
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  // 새로운 알림 트리거 함수들
  const notifyConsultationApproved = (mentorName: string, consultationId: number) => {
    addNotification({
      type: 'consultation_accepted',
      title: '상담 신청이 승인되었습니다!',
      message: `${mentorName} 멘토가 상담 신청을 승인했습니다.`,
      consultationId
    });
  };

  const notifyConsultationRejected = (mentorName: string, consultationId: number) => {
    addNotification({
      type: 'consultation_rejected',
      title: '상담 신청이 거절되었습니다',
      message: `${mentorName} 멘토가 상담 신청을 거절했습니다.`,
      consultationId
    });
  };

  const notifyCommunityComment = (postTitle: string, commenterName: string, postId: string) => {
    addNotification({
      type: 'community_comment',
      title: '새로운 댓글이 달렸습니다',
      message: `${commenterName}님이 "${postTitle}" 글에 댓글을 작성했습니다.`,
      postId
    });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      notifyConsultationApproved,
      notifyConsultationRejected,
      notifyCommunityComment
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
