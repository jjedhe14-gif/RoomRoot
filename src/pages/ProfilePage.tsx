import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Settings, Heart, MessageSquare, Wrench, FileText,
  ChevronRight, LogOut, Edit3, Shield, X, Plus, MapPin, Trash2,
  GraduationCap, Wallet, Tag, Save, Camera,
} from 'lucide-react';
import { GlassCard, GlassButton, GlassInput } from '../components/glass';
import { Avatar } from '../components/ui/Avatar';
import { properties } from '../data/mockData';
import { useAppStore } from '../stores/appStore';
import { formatPriceFull } from '../utils/helpers';
import { deleteCurrentAccount } from '../services/authService';
import { useToastStore } from '../stores/toastStore';

const LIFESTYLE_OPTIONS = [
  'Non-smoker', 'Smoker', 'Early sleeper', 'Night owl',
  'Veg preferred', 'Non-veg OK', 'Quiet environment', 'Music friendly',
  'Very clean', 'Relaxed', 'Studious', 'Social',
];

export default function ProfilePage() {
  const { savedRooms, logout, authUser, updateProfile } = useAppStore();
  const { addToast } = useToastStore();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const deleteAccount = async () => {
    try {
      setDeleting(true);
      await deleteCurrentAccount();
      if (authUser?.email) {
        const profiles = JSON.parse(localStorage.getItem('roomroot-profiles') || '{}');
        delete profiles[authUser.email.toLowerCase()];
        localStorage.setItem('roomroot-profiles', JSON.stringify(profiles));
      }
      logout();
      addToast('Your account and data have been permanently deleted.', 'success');
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Unable to delete your account.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  // Use authUser from the store (set at login) — fall back to a default
  const user = authUser || {
    id: 0, name: 'Guest', email: '', role: 'STUDENT',
    emailVerified: false, status: 'ACTIVE',
  };

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Profile Header */}
        <GlassCard className="text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-500/5 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <div className="flex justify-center mb-4 relative">
              <Avatar name={user.name} size="xl" />
              <button className="absolute bottom-0 right-1/2 translate-x-8 translate-y-1 w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-lg hover:bg-brand-700 transition-colors">
                <Camera size={14} />
              </button>
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">{user.name}</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">{user.email}</p>
            <div className="flex items-center justify-center gap-4 mt-3 text-sm text-[var(--text-secondary)]">
              {user.university && <span>🎓 {user.university}</span>}
              {user.course && <span>📚 {user.course}</span>}
            </div>
            <div className="flex items-center justify-center gap-4 mt-1 text-sm text-[var(--text-secondary)]">
              {user.city && <span>📍 {user.city}</span>}
              {user.budgetMin != null && user.budgetMax != null && (
                <span>💰 Budget: {formatPriceFull(user.budgetMin)} - {formatPriceFull(user.budgetMax)}</span>
              )}
            </div>
            {user.lifestyle && user.lifestyle.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {user.lifestyle.map(l => (
                  <span key={l} className="px-3 py-1 rounded-full bg-[var(--bg-tertiary)] text-xs font-medium text-[var(--text-secondary)]">{l}</span>
                ))}
              </div>
            )}
            {user.bio && (
              <p className="mt-3 text-sm text-[var(--text-secondary)] max-w-md mx-auto">{user.bio}</p>
            )}
            {user.address && (
              <p className="mt-1 text-xs text-[var(--text-tertiary)]">📍 {user.address}</p>
            )}
            <GlassButton variant="secondary" size="sm" icon={<Edit3 size={14} />} className="mt-4" onClick={() => setEditOpen(true)}>
              Edit Profile
            </GlassButton>
          </div>
        </GlassCard>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Saved', value: savedRooms.length, icon: '❤️' },
            { label: 'Messages', value: 12, icon: '💬' },
            { label: 'Reviews', value: 5, icon: '⭐' },
            { label: 'Services', value: 2, icon: '🛠️' },
          ].map(s => (
            <GlassCard key={s.label} className="text-center p-3">
              <div className="text-xl mb-1">{s.icon}</div>
              <div className="text-lg font-bold text-[var(--text-primary)]">{s.value}</div>
              <div className="text-[10px] text-[var(--text-tertiary)]">{s.label}</div>
            </GlassCard>
          ))}
        </div>

        {/* Menu Items */}
        <GlassCard noPadding>
          <div className="divide-y divide-[var(--border-primary)]">
            {[
              { icon: Heart, label: 'Saved Rooms', count: savedRooms.length, link: '/saved', color: 'text-red-500' },
              { icon: UsersIcon, label: 'Roommate Requests', count: 0, link: '/roommates', color: 'text-brand-500' },
              { icon: MessageSquare, label: 'Messages', count: 3, link: '/messages', color: 'text-green-500' },
              { icon: Wrench, label: 'Service Requests', count: 2, link: '/services', color: 'text-orange-500' },
              { icon: FileText, label: 'My Reviews', count: 5, link: '#', color: 'text-purple-500' },
              { icon: Settings, label: 'Settings', link: '/settings', color: 'text-[var(--text-secondary)]' },
            ].map((mi, i) => (
              <Link key={i} to={mi.link} className="flex items-center gap-3 p-4 hover:bg-[var(--bg-tertiary)] transition-colors">
                <mi.icon size={20} className={mi.color} />
                <span className="flex-1 text-sm font-medium text-[var(--text-primary)]">{mi.label}</span>
                {mi.count !== undefined && <span className="text-xs text-[var(--text-tertiary)] mr-2">{mi.count}</span>}
                <ChevronRight size={16} className="text-[var(--text-tertiary)]" />
              </Link>
            ))}
          </div>
        </GlassCard>

        {/* Recent Activity */}
        <GlassCard>
          <h3 className="font-bold text-[var(--text-primary)] mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { icon: '🏨', text: 'Viewed UrbanNest PG', time: '2 hours ago' },
              { icon: '💬', text: 'Messaged Arjun Sharma', time: '5 hours ago' },
              { icon: '❤️', text: 'Saved BluNest Student Housing', time: '1 day ago' },
              { icon: '🛠️', text: 'Requested plumbing service', time: '2 days ago' },
            ].map((a, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-xl">
                <span className="text-lg">{a.icon}</span>
                <span className="flex-1 text-sm text-[var(--text-primary)]">{a.text}</span>
                <span className="text-xs text-[var(--text-tertiary)]">{a.time}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassButton variant="ghost" fullWidth icon={<LogOut size={18} />} onClick={logout} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10">
          Log Out
        </GlassButton>
        <GlassButton variant="ghost" fullWidth icon={<Trash2 size={18} />} onClick={() => setDeleteOpen(true)} className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10">
          Delete Account
        </GlassButton>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {editOpen && (
          <EditProfileModal user={user} onClose={() => setEditOpen(false)} onSave={(updates) => { updateProfile(updates); setEditOpen(false); }} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteOpen && (
          <motion.div className="fixed inset-0 z-[70] flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={deleting ? undefined : () => setDeleteOpen(false)} />
            <motion.section className="relative w-full max-w-md rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6 shadow-2xl" initial={{ scale: 0.95, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 12 }}>
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/15"><Trash2 size={20} /></div>
              <h2 className="mt-4 text-lg font-bold text-[var(--text-primary)]">Are you sure you want to delete your account?</h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">This permanently erases your profile, listings, saved items, applications, messages, and other account data. This cannot be undone.</p>
              <div className="mt-6 flex justify-end gap-3">
                <button disabled={deleting} onClick={() => setDeleteOpen(false)} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] disabled:opacity-50">Cancel</button>
                <button disabled={deleting} onClick={() => void deleteAccount()} className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">{deleting ? 'Deleting…' : 'Yes, delete account'}</button>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---- Edit Profile Modal ----
function EditProfileModal({ user, onClose, onSave }: {
  user: { name: string; email: string; phone?: string; university?: string; course?: string; yearOfStudy?: number; city?: string; address?: string; budgetMin?: number; budgetMax?: number; lifestyle?: string[]; bio?: string };
  onClose: () => void;
  onSave: (updates: Record<string, unknown>) => void;
}) {
  const [name, setName] = useState(user.name || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [university, setUniversity] = useState(user.university || '');
  const [course, setCourse] = useState(user.course || '');
  const [yearOfStudy, setYearOfStudy] = useState(user.yearOfStudy?.toString() || '');
  const [city, setCity] = useState(user.city || '');
  const [address, setAddress] = useState(user.address || '');
  const [budgetMin, setBudgetMin] = useState(user.budgetMin?.toString() || '');
  const [budgetMax, setBudgetMax] = useState(user.budgetMax?.toString() || '');
  const [lifestyle, setLifestyle] = useState<string[]>(user.lifestyle || []);
  const [bio, setBio] = useState(user.bio || '');

  const toggleLifestyle = (tag: string) => {
    setLifestyle(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleSave = () => {
    onSave({
      name: name.trim() || user.name,
      phone: phone.trim() || undefined,
      university: university.trim() || undefined,
      course: course.trim() || undefined,
      yearOfStudy: yearOfStudy ? parseInt(yearOfStudy) : undefined,
      city: city.trim() || undefined,
      address: address.trim() || undefined,
      budgetMin: budgetMin ? parseInt(budgetMin) : undefined,
      budgetMax: budgetMax ? parseInt(budgetMax) : undefined,
      lifestyle: lifestyle.length > 0 ? lifestyle : undefined,
      bio: bio.trim() || undefined,
    });
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <motion.div
        className="relative w-full sm:max-w-lg max-h-[calc(100dvh-4rem)] sm:max-h-[90vh] overflow-y-auto bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-t-3xl sm:rounded-2xl shadow-2xl"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 400 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 pb-0">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">Edit Profile</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--bg-tertiary)] transition-colors">
            <X size={18} className="text-[var(--text-secondary)]" />
          </button>
        </div>

        {/* Form */}
        <div className="p-5 space-y-4">
          {/* Name */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
              <User size={13} /> Full Name
            </label>
            <input
              type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="Your name"
              className="h-10 w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-tertiary)] px-3.5 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-tertiary)] focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
              📱 Phone Number
            </label>
            <input
              type="tel" value={phone} onChange={e => setPhone(e.target.value)}
              placeholder="+91 98765 43200"
              className="h-10 w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-tertiary)] px-3.5 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-tertiary)] focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          {/* College & Course */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                <GraduationCap size={13} /> College / University
              </label>
              <input
                type="text" value={university} onChange={e => setUniversity(e.target.value)}
                placeholder="e.g. Thane College"
                className="h-10 w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-tertiary)] px-3.5 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-tertiary)] focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                📚 Course
              </label>
              <input
                type="text" value={course} onChange={e => setCourse(e.target.value)}
                placeholder="e.g. B.Tech CS"
                className="h-10 w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-tertiary)] px-3.5 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-tertiary)] focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          </div>

          {/* Year & City */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                🎓 Year of Study
              </label>
              <select
                value={yearOfStudy} onChange={e => setYearOfStudy(e.target.value)}
                className="h-10 w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-tertiary)] px-3.5 text-sm text-[var(--text-primary)] outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 appearance-none"
              >
                <option value="">Select</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
                <option value="5">5th Year</option>
              </select>
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                <MapPin size={13} /> City
              </label>
              <input
                type="text" value={city} onChange={e => setCity(e.target.value)}
                placeholder="e.g. Thane"
                className="h-10 w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-tertiary)] px-3.5 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-tertiary)] focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
              <MapPin size={13} /> Address / Area
            </label>
            <input
              type="text" value={address} onChange={e => setAddress(e.target.value)}
              placeholder="e.g. Anand Nagar, Thane West"
              className="h-10 w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-tertiary)] px-3.5 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-tertiary)] focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          {/* Budget */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
              <Wallet size={13} /> Monthly Budget (₹)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number" value={budgetMin} onChange={e => setBudgetMin(e.target.value)}
                placeholder="Min (e.g. 5000)"
                className="h-10 w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-tertiary)] px-3.5 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-tertiary)] focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
              />
              <input
                type="number" value={budgetMax} onChange={e => setBudgetMax(e.target.value)}
                placeholder="Max (e.g. 12000)"
                className="h-10 w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-tertiary)] px-3.5 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-tertiary)] focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          </div>

          {/* Lifestyle Tags */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] mb-2">
              <Tag size={13} /> Lifestyle & Preferences
            </label>
            <div className="flex flex-wrap gap-2">
              {LIFESTYLE_OPTIONS.map(tag => {
                const active = lifestyle.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleLifestyle(tag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                      active
                        ? 'bg-brand-600 text-white border-brand-600 shadow-sm shadow-brand-600/20'
                        : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border-[var(--border-primary)] hover:border-brand-300'
                    }`}
                  >
                    {active && <span className="mr-1">✓</span>}
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
              ✍️ Bio
            </label>
            <textarea
              value={bio} onChange={e => setBio(e.target.value)}
              placeholder="Tell others about yourself..."
              rows={3}
              className="w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-tertiary)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-tertiary)] focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 resize-none"
            />
          </div>
        </div>

        {/* Footer — extra bottom padding on mobile to clear the dock bar */}
        <div className="p-5 pt-0 pb-24 md:pb-5 flex gap-3">
          <GlassButton variant="secondary" fullWidth onClick={onClose}>Cancel</GlassButton>
          <GlassButton fullWidth icon={<Save size={16} />} onClick={handleSave}>Save Profile</GlassButton>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ---- Inline SVG icon to avoid unused import warning ----
function UsersIcon(props: React.SVGProps<SVGSVGElement> & { size?: number }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
}
