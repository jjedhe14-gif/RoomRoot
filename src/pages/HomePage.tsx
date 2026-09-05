import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, SlidersHorizontal, ArrowRight, Star, Wifi, UtensilsCrossed, Wind, Shield, Users, Home, Wrench, ChevronRight, Zap, Building, BedDouble } from 'lucide-react';
import { GlassCard, GlassButton, GlassInput } from '../components/glass';
import { Avatar } from '../components/ui/Avatar';
import { properties, roommates } from '../data/mockData';
import { formatPriceFull, getRoomTypeLabel } from '../utils/helpers';
import { useAppStore } from '../stores/appStore';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } } };

export default function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { isSaved, toggleSaveRoom } = useAppStore();
  const { requestLocation } = useAppStore() as { requestLocation?: () => void };

  const featuredProperties = properties.slice(0, 6);
  const featuredRoommates = roommates.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-16 px-4">
        {/* Background gradient orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-brand-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand-600 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
              Trusted by 10,000+ students
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[var(--text-primary)] leading-tight mb-6 text-balance">
              Find your place.
              <br />
              <span className="gradient-text">Find your people.</span>
            </h1>

            <p className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed">
              Discover affordable PGs, hostels, rooms and roommates near your college.
            </p>
          </motion.div>

          {/* Search Panel */}
          <motion.div
            className="glass-card p-3 sm:p-4 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder='Search "Thane, Mumbai, Vartak Nagar..."'
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all text-sm"
                />
              </div>
              <div className="flex gap-2">
                <GlassButton
                  variant="secondary"
                  size="md"
                  icon={<MapPin size={18} />}
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(
                        () => {},
                        () => {}
                      );
                    }
                  }}
                >
                  <span className="hidden sm:inline">Location</span>
                </GlassButton>
                <GlassButton
                  variant="secondary"
                  size="md"
                  icon={<SlidersHorizontal size={18} />}
                  onClick={() => navigate('/explore')}
                >
                  <span className="hidden sm:inline">Filters</span>
                </GlassButton>
                <GlassButton
                  size="md"
                  onClick={() => navigate(`/explore?q=${searchQuery}`)}
                  icon={<Search size={18} />}
                >
                  Search
                </GlassButton>
              </div>
            </div>

            {/* Quick tags */}
            <div className="flex flex-wrap gap-2 mt-3 px-1">
              {['Near Thane College', 'Under ₹8k', 'Boys PG', 'With Food', 'AC Rooms'].map(tag => (
                <button
                  key={tag}
                  onClick={() => navigate(`/explore?q=${tag}`)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-900/20 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'PGs & Hostels', value: '2,500+', icon: Building },
            { label: 'Active Students', value: '10,000+', icon: Users },
            { label: 'Cities Covered', value: '15+', icon: MapPin },
            { label: 'Happy Reviews', value: '5,000+', icon: Star },
          ].map((stat) => (
            <motion.div key={stat.label} className="glass-card p-4 text-center" variants={item} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <stat.icon size={24} className="mx-auto text-brand-500 mb-2" />
              <div className="text-2xl font-bold text-[var(--text-primary)]">{stat.value}</div>
              <div className="text-xs text-[var(--text-secondary)] mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quick Categories */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4" variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}>
            {[
              { label: 'Boys PG', desc: 'Safe & affordable', icon: Home, color: 'from-blue-500 to-blue-600', link: '/explore?gender=boys' },
              { label: 'Girls Hostel', desc: 'Secure accommodation', icon: Shield, color: 'from-pink-500 to-pink-600', link: '/explore?gender=girls' },
              { label: 'Find Roommates', desc: 'Split your rent', icon: Users, color: 'from-green-500 to-green-600', link: '/roommates' },
              { label: 'Room Services', desc: 'Quick repairs', icon: Wrench, color: 'from-orange-500 to-orange-600', link: '/services' },
            ].map((cat) => (
              <motion.div key={cat.label} variants={item}>
                <Link to={cat.link} className="glass-card p-5 block group">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <cat.icon size={24} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-[var(--text-primary)] mb-1">{cat.label}</h3>
                  <p className="text-xs text-[var(--text-secondary)]">{cat.desc}</p>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">Featured PGs & Hostels</h2>
              <p className="text-[var(--text-secondary)] mt-1">Top-rated properties near you</p>
            </div>
            <Link to="/explore" className="flex items-center gap-1 text-brand-600 font-semibold text-sm hover:gap-2 transition-all">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}>
            {featuredProperties.map(property => (
              <motion.div key={property.id} variants={item}>
                <GlassCard noPadding className="overflow-hidden cursor-pointer" onClick={() => navigate(`/property/${property.id}`)}>
                  <div className="relative h-48">
                    <img src={property.coverImage} alt={property.name} className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      {property.verified && (
                        <span className="px-2 py-1 rounded-lg bg-green-500/90 text-white text-xs font-semibold backdrop-blur-sm">✓ Verified</span>
                      )}
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleSaveRoom(property.id); }}
                      className="absolute top-3 right-3 p-2 rounded-xl bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-colors"
                    >
                      <span className={isSaved(property.id) ? 'text-red-400' : ''}>♥</span>
                    </button>
                    <div className="absolute bottom-3 left-3">
                      <span className="px-2.5 py-1 rounded-lg bg-white/90 dark:bg-black/50 backdrop-blur-sm text-xs font-bold text-[var(--text-primary)]">
                        {formatPriceFull(property.rent)}/month
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-[var(--text-primary)] text-lg">{property.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-[var(--text-secondary)] mt-1">
                      <MapPin size={14} />
                      {property.location.area}, {property.location.city}
                    </div>
                    <div className="flex items-center gap-3 mt-3 text-xs text-[var(--text-secondary)]">
                      <span className="flex items-center gap-1"><BedDouble size={14} /> {getRoomTypeLabel(property.roomType)}</span>
                      <span>•</span>
                      <span>{property.gender === 'boys' ? '👨 Boys' : property.gender === 'girls' ? '👩 Girls' : '👥 Unisex'}</span>
                      {property.ac && <><span>•</span><span className="flex items-center gap-1"><Wind size={14} /> AC</span></>}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {property.amenities.slice(0, 4).map(a => (
                        <span key={a} className="px-2 py-0.5 rounded-md bg-[var(--bg-tertiary)] text-[10px] font-medium text-[var(--text-secondary)]">
                          {a}
                        </span>
                      ))}
                      {property.amenities.length > 4 && (
                        <span className="px-2 py-0.5 rounded-md bg-brand-50 dark:bg-brand-900/20 text-[10px] font-medium text-brand-600">
                          +{property.amenities.length - 4} more
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--border-primary)]">
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-semibold text-[var(--text-primary)]">{property.rating}</span>
                        <span className="text-xs text-[var(--text-tertiary)]">({property.reviewCount})</span>
                      </div>
                      <span className="text-xs text-[var(--text-secondary)]">📍 {property.distance} km away</span>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Roommate Finder CTA */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <GlassCard className="relative overflow-hidden" noPadding>
            <div className="absolute inset-0 bg-gradient-to-r from-brand-600/10 to-purple-600/10 dark:from-brand-600/5 dark:to-purple-600/5" />
            <div className="relative p-8 sm:p-10 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-3">
                  Split the rent, not the experience
                </h2>
                <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
                  Find compatible roommates who match your lifestyle. Save up to 60% on accommodation costs.
                </p>
                <Link to="/roommates">
                  <GlassButton size="lg" icon={<Users size={18} />}>
                    Find Roommates
                  </GlassButton>
                </Link>
              </div>
              <div className="flex -space-x-3">
                {featuredRoommates.map((r, i) => (
                  <div key={r.id} className="relative" style={{ zIndex: 3 - i }}>
                    <Avatar name={r.name} size="lg" />
                  </div>
                ))}
                <div className="w-14 h-14 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 text-sm font-bold border-2 border-white dark:border-[var(--bg-primary)]">
                  +10k
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-2">How RoomRoot Works</h2>
          <p className="text-[var(--text-secondary)] mb-10">Find your perfect space in 3 simple steps</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Search & Filter', desc: 'Browse PGs, hostels, and rooms by budget, location, and preferences.', icon: Search },
              { step: '02', title: 'Compare & Connect', desc: 'Compare properties, read reviews, and chat with owners and roommates.', icon: Users },
              { step: '03', title: 'Move In', desc: 'Schedule a visit, book your room, and settle into your new home.', icon: Home },
            ].map((s) => (
              <GlassCard key={s.step} className="text-center relative">
                <div className="text-5xl font-bold text-brand-500/10 absolute top-3 right-4">{s.step}</div>
                <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center mx-auto mb-4">
                  <s.icon size={24} className="text-brand-600" />
                </div>
                <h3 className="font-bold text-[var(--text-primary)] mb-2">{s.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{s.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Roommate Requests */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">Looking for Roommates</h2>
              <p className="text-[var(--text-secondary)] mt-1">Students near you need roommates</p>
            </div>
            <Link to="/roommates" className="flex items-center gap-1 text-brand-600 font-semibold text-sm hover:gap-2 transition-all">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4" variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}>
            {featuredRoommates.map(r => (
              <motion.div key={r.id} variants={item}>
                <GlassCard className="cursor-pointer" onClick={() => navigate('/roommates')}>
                  <div className="flex items-start gap-3">
                    <Avatar name={r.name} size="lg" online={Math.random() > 0.5} />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[var(--text-primary)]">{r.name}</h3>
                      <p className="text-xs text-[var(--text-secondary)]">{r.course} • {r.year}</p>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">📍 {r.location}</p>
                    </div>
                  </div>
                  <div className="mt-3 p-3 rounded-xl bg-[var(--bg-tertiary)]">
                    <p className="text-sm text-[var(--text-primary)] font-medium">{r.description}</p>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex gap-2">
                      {r.lifestyle.smoking === 'no' && <span className="px-2 py-0.5 rounded-md bg-green-50 dark:bg-green-900/20 text-green-600 text-xs font-medium">🚭 Non-smoker</span>}
                      <span className="px-2 py-0.5 rounded-md bg-brand-50 dark:bg-brand-900/20 text-brand-600 text-xs font-medium">💰 {formatPriceFull(r.amountPerPerson)}/mo</span>
                    </div>
                    {r.compatibility && (
                      <span className="text-xs font-bold text-green-600">{r.compatibility}% match</span>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <GlassCard className="p-8 sm:p-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-4">
              Ready to find your perfect room?
            </h2>
            <p className="text-[var(--text-secondary)] mb-8 max-w-lg mx-auto">
              Join thousands of students who found their ideal accommodation through RoomRoot.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/explore">
                <GlassButton size="lg" icon={<Search size={18} />}>
                  Start Searching
                </GlassButton>
              </Link>
              <Link to="/login">
                <GlassButton variant="secondary" size="lg">
                  Create Account
                </GlassButton>
              </Link>
            </div>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}
