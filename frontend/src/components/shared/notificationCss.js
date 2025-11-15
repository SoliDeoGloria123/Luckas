const baseNames = {
  panel: 'notification-panel',
  header: 'notification-header',
  title: 'notification-title',
  titleText: 'title',
  unreadCount: 'unread-count',
  actions: 'notification-actions',
  markAllBtn: 'mark-all-read-btn',
  closeBtn: 'close-btn',
  content: 'notification-content',
  footer: 'notification-footer',
  refreshBtn: 'refresh-btn',
  loading: 'notification-loading',
  spinner: 'spinner',
  error: 'notification-error',
  retryBtn: 'retry-btn',
  empty: 'notification-empty',
  emptyIcon: 'empty-icon',
  list: 'notification-list',
  item: 'notification-item',
  iconItem: 'notification-icon-item',
  contentItem: 'notification-content-item',
  titleItem: 'notification-title-item',
  message: 'notification-message',
  date: 'notification-date',
  actionsItem: 'notification-actions-item',
  markReadBtn: 'mark-read-btn',
  deleteBtn: 'delete-btn'
};

function createNotificationCssClasses(suffix = '') {
  const formattedSuffix = suffix ? `-${suffix}` : '';
  return Object.fromEntries(
    Object.entries(baseNames).map(([key, value]) => [key, value + formattedSuffix])
  );
}

export default createNotificationCssClasses;
