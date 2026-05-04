import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '../hooks/useNotifications';

export default function NotificationToggle() {
  const { t } = useTranslation();
  const { permission, notificationsEnabled, toggle } = useNotifications();

  const denied = permission === 'denied';

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={!denied ? toggle : undefined}
      disabled={denied}
      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
      style={{
        background: notificationsEnabled
          ? 'linear-gradient(135deg, rgba(45,106,79,0.3), rgba(45,106,79,0.1))'
          : 'var(--color-surface-2)',
        border: notificationsEnabled
          ? '1px solid rgba(45,106,79,0.5)'
          : '1px solid var(--color-border)',
        color: notificationsEnabled ? '#4ade80' : 'var(--color-text-muted)',
        cursor: denied ? 'not-allowed' : 'pointer',
        opacity: denied ? 0.5 : 1,
      }}
    >
      <span className="text-lg">{notificationsEnabled ? '🔔' : '🔕'}</span>
      <span>
        {denied
          ? t('permission_denied')
          : notificationsEnabled
          ? t('notifications_enabled')
          : t('enable_notifications')}
      </span>
      {notificationsEnabled && (
        <motion.div
          className="w-2 h-2 rounded-full bg-green-400"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      )}
    </motion.button>
  );
}
