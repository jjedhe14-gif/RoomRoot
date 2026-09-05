import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Users, MessageSquare, Wrench, Home, ArrowRight, Star, MapPin } from 'lucide-react';
import { GlassCard, GlassButton } from '../components/glass';
import { Avatar } from '../components/ui/Avatar';
import { useAppStore } from '../stores/appStore';
import { currentUser, properties, roommates, conversations } from '../data/mockData';
import { formatPriceFull, getRoomTypeLabel } from '../utils/helpers';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

export default function DashboardPage() {
  const navigate = useNavigate();
  const { savedRooms } = useAppStore();
  const recommended = properties.slice(0, 4);

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">Welcome back, Jay 👋</h1>
          <p className="text-[var(--text-secondary)] mt-1">Here's what's happening with your search</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6" variants={container} initial="hidden" animate="show">
          {[
            { label: 'Saved Rooms', value: savedRooms.length, icon: Heart, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
            { label: 'Roommate Requests', value: 2, icon: Users, color: 'text-brand-500', bg: 'bg-brand-50 dark:bg-brand-900/20' },
            { label: 'Messages', value: 5, icon: MessageSquare, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
            { label: 'Service Requests', value: 1, icon: Wrench, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
          ].map(card => (
            <motion.div key={card.label} variants={item}>
              <GlassCard className="cursor-pointer" onClick={() => navigate(card.label.includes('Saved') ? '/saved' : card.label.includes('Roommate') ? '/roommates' : card.label.includes('Messages') ? '/messages' : '/services')}>
                <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
                  <card.icon size={20} className={card.color} />
                </div>
                <p className="text-2xl font-bold text-[var(--text-primary)]">{card.value}</p>
                <p className="text-xs text-[var(--text-secondary)]">{card.label}</p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Recommended */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Recommended for You</h2>
            <button onClick={() => navigate('/explore')} className="flex items-center gap-1 text-brand-600 text-sm font-semibold">View All <ArrowRight size={14} /></button>
          </div>
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" variants={container} initial="hidden" animate="show">
            {recommended.map(p => (
              <motion.div key={p.id} variants={item}>
                <GlassCard noPadding className="overflow-hidden cursor-pointer" onClick={() => navigate(`/property/${p.id}`)}>
                  <img src={p.coverImage} alt={p.name} className="w-full h-32 object-cover" loading="lazy" />
                  <div className="p-3">
                    <h3 className="font-bold text-[var(--text-primary)] text-sm">{p.name}</h3>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">📍 {p.location.area}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-bold text-brand-600">{formatPriceFull(p.rent)}/mo</span>
                      <span className="text-xs text-[var(--text-secondary)]">⭐ {p.rating}</span>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Recent Roommate Requests */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Roommate Requests</h2>
            <button onClick={() => navigate('/roommates')} className="flex items-center gap-1 text-brand-600 text-sm font-semibold">View All <ArrowRight size={14} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {roommates.slice(0, 3).map(r => (
              <GlassCard key={r.id} className="cursor-pointer" onClick={() => navigate('/roommates')}>
                <div className="flex items-center gap-3 mb-2">
                  <Avatar name={r.name} size="sm" />
                  <div>
                    <p className="text-sm font-bold text-[var(--text-primary)]">{r.name}</p>
                    <p className="text-xs text-[var(--text-tertiary)]">{r.course}</p>
                  </div>
                  {r.compatibility && <span className="ml-auto text-xs font-bold text-green-600">{r.compatibility}%</span>}
                </div>
                <p className="text-xs text-[var(--text-secondary)]">{r.description}</p>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Recent Messages */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Recent Messages</h2>
            <button onClick={() => navigate('/messages')} className="flex items-center gap-1 text-brand-600 text-sm font-semibold">View All <ArrowRight size={14} /></button>
          </div>
          <GlassCard noPadding>
            <div className="divide-y divide-[var(--border-primary)]">
              {conversations.slice(0, 3).map(c => (
                <div key={c.id} className="flex items-center gap-3 p-3 hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer" onClick={() => navigate('/messages')}>
                  <Avatar name={c.name} size="md" online={c.online} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{c.name}</p>
                    <p className="text-xs text-[var(--text-secondary)] truncate">{c.lastMessage}</p>
                  </div>
                  <span className="text-[10px] text-[var(--text-tertiary)] shrink-0">{c.lastTime}</span>
                  {c.unread > 0 && <span className="w-5 h-5 rounded-full bg-brand-600 text-white text-[10px] font-bold flex items-center justify-center">{c.unread}</span>}
                </div>
              ))}
            </div>
          </GlassCard>
        </section>
      </div>
    </div>
  );
}
