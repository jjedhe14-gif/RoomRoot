import { motion } from 'framer-motion';
import { Bell, Home, Users, MessageSquare, Wrench } from 'lucide-react';
import { GlassCard } from '../components/glass';
import { notifications } from '../data/mockData';

const icons: Record<string, typeof Home> = { roommate: Users, listing: Home, service: Wrench, message: MessageSquare, system: Bell };

export default function NotificationsPage() {
  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Notifications</h1>

        {notifications.length === 0 ? (
          <GlassCard className="text-center py-16">
            <div className="text-5xl mb-4">🔔</div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">No notifications</h3>
            <p className="text-[var(--text-secondary)]">You're all caught up!</p>
          </GlassCard>
        ) : (
          <GlassCard noPadding>
            <div className="divide-y divide-[var(--border-primary)]">
              {notifications.map((n, i) => {
                const Icon = icons[n.type] || Bell;
                return (
                  <motion.div key={n.id} className={`flex items-start gap-3 p-4 hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer ${!n.read ? 'bg-brand-50/50 dark:bg-brand-900/10' : ''}`}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${n.type === 'roommate' ? 'bg-brand-50 dark:bg-brand-900/20' : n.type === 'listing' ? 'bg-green-50 dark:bg-green-900/20' : n.type === 'service' ? 'bg-orange-50 dark:bg-orange-900/20' : 'bg-purple-50 dark:bg-purple-900/20'}`}>
                      <Icon size={18} className={`${n.type === 'roommate' ? 'text-brand-600' : n.type === 'listing' ? 'text-green-600' : n.type === 'service' ? 'text-orange-600' : 'text-purple-600'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-[var(--text-primary)]">{n.title}</h4>
                        {!n.read && <span className="w-2 h-2 rounded-full bg-brand-600" />}
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">{n.body}</p>
                      <p className="text-[10px] text-[var(--text-tertiary)] mt-1">{n.time}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
