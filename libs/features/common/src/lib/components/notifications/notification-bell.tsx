import React from 'react';
import {
  NotificationDropdown,
  NotificationDropdownProps,
} from './notification-dropdown';

export type NotificationBellProps = NotificationDropdownProps;

export const NotificationBell: React.FC<NotificationBellProps> = (props) => {
  return <NotificationDropdown {...props} />;
};
