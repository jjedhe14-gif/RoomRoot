import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, MapPin, Calendar, Filter, X, ChevronDown, MessageSquare, UserPlus } from 'lucide-react';
import { GlassCard, GlassButton, GlassInput, GlassTextArea, GlassModal } from '../components/glass';
import { Avatar } from '../components/ui/Avatar';
import { roommates } from '../data/mockData';
import { useToastStore } from '../stores/toastStore';
import { formatPriceFull } from '../utils/helpers';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

const lifestyleLabels: Record<string, string> = {
  'no': '🚭 Non-smoker', 'yes': '🚬 Smoker', 'occasionally': '🚬 Occasional',
  'veg': '🥬 Vegetarian', 'non-veg': '🍖 Non-Veg', 'both': '🍽️ Both',
  'early': '🌅 Early riser', 'late': '🦉 Night owl', 'flexible': '🕐 Flexible',
  'quiet': '🤫 Quiet', 'music': '🎵 Music while studying', 'normal': '📖 Normal',
  'very': '✨ Very clean', 'relaxed': '😌 Relaxed',
  'moderate': '🔊 Moderate noise', 'loud': '🎉 Social',
};

export default function RoommatesPage() {
  const { addToast } = useToastStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<string>('');
  const [showPostModal, setShowPostModal] = useState(false);

  const filtered = roommates.filter(r => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!r.name.toLowerCase().includes(q) && !r.college.toLowerCase().includes(q) && !r.location.toLowerCase().includes(q)) return false;
    }
    if (genderFilter && r.preferredGender !== genderFilter && r.preferredGender !== 'any') return false;
    return true;
  });

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">Find a Roommate</h1>
            <p className="text-[var(--text-secondary)] mt-1">Connect with students looking for roommates</p>
          </div>
          <GlassButton onClick={() => setShowPostModal(true)} icon={<Users size={18} />}>Post Requirement</GlassButton>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
            <input
              type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name, college, location..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none focus:border-brand-500 transition-colors text-sm"
            />
          </div>
          <div className="flex gap-2">
            {['', 'male', 'female'].map(g => (
              <button key={g} onClick={() => setGenderFilter(g)} className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${genderFilter === g ? 'bg-brand-600 text-white border-brand-600' : 'border-[var(--border-primary)] text-[var(--text-secondary)]'}`}>
                {g === '' ? 'All' : g === 'male' ? '👨 Boys' : '👩 Girls'}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <GlassCard className="text-center py-16">
            <div className="text-5xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">No roommates found</h3>
            <p className="text-[var(--text-secondary)] mb-4">Try adjusting your search or filters.</p>
          </GlassCard>
        ) : (
          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4" variants={container} initial="hidden" animate="show">
            {filtered.map(r => (
              <motion.div key={r.id} variants={item}>
                <GlassCard>
                  <div className="flex items-start gap-3 mb-4">
                    <Avatar name={r.name} size="lg" online={Math.random() > 0.5} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-[var(--text-primary)]">{r.name}, {r.age}</h3>
                        {r.compatibility && (
                          <span className="px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 text-xs font-bold">
                            {r.compatibility}% match
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--text-secondary)]">{r.course} • {r.year} • {r.college}</p>
                      <div className="flex items-center gap-1 text-xs text-[var(--text-tertiary)] mt-0.5"><MapPin size={11} /> {r.location}</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[var(--bg-tertiary)] mb-3">
                    <p className="text-sm text-[var(--text-primary)]">{r.description}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                    <div className="p-2 rounded-xl bg-[var(--bg-tertiary)]">
                      <div className="text-lg font-bold text-brand-600">{formatPriceFull(r.amountPerPerson)}</div>
                      <div className="text-[10px] text-[var(--text-tertiary)]">per person</div>
                    </div>
                    <div className="p-2 rounded-xl bg-[var(--bg-tertiary)]">
                      <div className="text-lg font-bold text-[var(--text-primary)]">{r.spotsAvailable}</div>
                      <div className="text-[10px] text-[var(--text-tertiary)]">spots open</div>
                    </div>
                    <div className="p-2 rounded-xl bg-[var(--bg-tertiary)]">
                      <div className="text-sm font-bold text-[var(--text-primary)] flex items-center justify-center gap-1"><Calendar size={14} /> {r.moveInDate.split('-').slice(1).join('/')}</div>
                      <div className="text-[10px] text-[var(--text-tertiary)]">move-in</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {Object.entries(r.lifestyle).map(([key, value]) => (
                      <span key={key} className="px-2 py-1 rounded-lg bg-[var(--bg-tertiary)] text-[10px] font-medium text-[var(--text-secondary)]">
                        {lifestyleLabels[value] || value}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <GlassButton size="sm" className="flex-1" onClick={() => addToast('Roommate request sent! ✓', 'success')} icon={<UserPlus size={14} />}>Request to Join</GlassButton>
                    <GlassButton size="sm" variant="secondary" className="flex-1" onClick={() => addToast('Opening chat...', 'info')} icon={<MessageSquare size={14} />}>Message</GlassButton>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Post Requirement Modal */}
      <GlassModal isOpen={showPostModal} onClose={() => setShowPostModal(false)} title="Post Roommate Requirement" size="md">
        <div className="space-y-4">
          <GlassInput label="Your Name" placeholder="Enter your name" />
          <div className="grid grid-cols-2 gap-3">
            <GlassInput label="College" placeholder="College name" />
            <GlassInput label="Course" placeholder="e.g. B.Sc CS" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <GlassInput label="Location" placeholder="e.g. Thane" />
            <GlassInput label="Total Room Rent (₹)" type="number" placeholder="e.g. 18000" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <GlassInput label="Amount Per Person (₹)" type="number" placeholder="e.g. 6000" />
            <GlassInput label="Spots Available" type="number" placeholder="e.g. 2" />
          </div>
          <GlassInput label="Move-in Date" type="date" />
          <GlassTextArea label="Description" placeholder="Tell potential roommates about the room and what you're looking for..." />
          <GlassButton fullWidth onClick={() => { setShowPostModal(false); addToast('Requirement posted! 🎉', 'success'); }}>
            Post Requirement
          </GlassButton>
        </div>
      </GlassModal>
    </div>
  );
}
