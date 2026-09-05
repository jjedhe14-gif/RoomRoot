import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Monitor, Bell, Shield, User, Lock, Trash2, LogOut, ChevronRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GlassCard, GlassButton } from '../components/glass';
import { useThemeStore } from '../stores/themeStore';
import { useToastStore } from '../stores/toastStore';

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${enabled ? 'bg-brand-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
      <motion.div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow" animate={{ x: enabled ? 20 : 0 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
    </button>
  );
}

export default function SettingsPage() {
  const { theme, setTheme } = useThemeStore();
  const { addToast } = useToastStore();
  const [notifications, setNotifications] = useState({ roommates: true, messages: true, listings: true, services: true, prices: false });
  const [privacy, setPrivacy] = useState({ profileVisible: true, locationShare: false, contactVisible: false });

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link to="/profile" className="p-2 rounded-xl hover:bg-[var(--bg-tertiary)]"><ArrowLeft size={20} /></Link>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Settings</h1>
        </div>

        {/* Appearance */}
        <GlassCard>
          <h3 className="font-bold text-[var(--text-primary)] mb-4">Appearance</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'light', label: 'Light', icon: Sun },
              { value: 'dark', label: 'Dark', icon: Moon },
              { value: 'system', label: 'System', icon: Monitor },
            ].map(opt => (
              <button key={opt.value} onClick={() => setTheme(opt.value as 'light' | 'dark' | 'system')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${
                  theme === opt.value ? 'border-brand-600 bg-brand-50 dark:bg-brand-900/20' : 'border-[var(--border-primary)] hover:border-brand-300'
                }`}>
                <opt.icon size={24} className={theme === opt.value ? 'text-brand-600' : 'text-[var(--text-secondary)]'} />
                <span className={`text-sm font-medium ${theme === opt.value ? 'text-brand-600' : 'text-[var(--text-secondary)]'}`}>{opt.label}</span>
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Notifications */}
        <GlassCard>
          <h3 className="font-bold text-[var(--text-primary)] mb-4">Notifications</h3>
          <div className="space-y-4">
            {[
              { key: 'roommates', label: 'New roommate requests' },
              { key: 'messages', label: 'New messages' },
              { key: 'listings', label: 'New room listings' },
              { key: 'services', label: 'Service updates' },
              { key: 'prices', label: 'Price alerts' },
            ].map(n => (
              <div key={n.key} className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-primary)]">{n.label}</span>
                <Toggle
                  enabled={notifications[n.key as keyof typeof notifications]}
                  onToggle={() => setNotifications(prev => ({ ...prev, [n.key]: !prev[n.key as keyof typeof prev] }))}
                />
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Privacy */}
        <GlassCard>
          <h3 className="font-bold text-[var(--text-primary)] mb-4">Privacy</h3>
          <div className="space-y-4">
            {[
              { key: 'profileVisible', label: 'Profile visible to others' },
              { key: 'locationShare', label: 'Share location with matches' },
              { key: 'contactVisible', label: 'Show contact to property owners' },
            ].map(p => (
              <div key={p.key} className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-primary)]">{p.label}</span>
                <Toggle
                  enabled={privacy[p.key as keyof typeof privacy]}
                  onToggle={() => setPrivacy(prev => ({ ...prev, [p.key]: !prev[p.key as keyof typeof prev] }))}
                />
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Account */}
        <GlassCard noPadding>
          <div className="divide-y divide-[var(--border-primary)]">
            {[
              { icon: User, label: 'Edit Profile', color: 'text-brand-500' },
              { icon: Lock, label: 'Change Password', color: 'text-[var(--text-secondary)]' },
            ].map((item, i) => (
              <button key={i} onClick={() => addToast(`${item.label} — coming soon`, 'info')} className="w-full flex items-center gap-3 p-4 hover:bg-[var(--bg-tertiary)] transition-colors">
                <item.icon size={20} className={item.color} />
                <span className="flex-1 text-left text-sm font-medium text-[var(--text-primary)]">{item.label}</span>
                <ChevronRight size={16} className="text-[var(--text-tertiary)]" />
              </button>
            ))}
            <button onClick={() => addToast('Logged out', 'info')} className="w-full flex items-center gap-3 p-4 hover:bg-[var(--bg-tertiary)] transition-colors">
              <LogOut size={20} className="text-orange-500" />
              <span className="flex-1 text-left text-sm font-medium text-[var(--text-primary)]">Log Out</span>
            </button>
            <button onClick={() => addToast('Delete account — contact support', 'warning')} className="w-full flex items-center gap-3 p-4 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
              <Trash2 size={20} className="text-red-500" />
              <span className="flex-1 text-left text-sm font-medium text-red-500">Delete Account</span>
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
