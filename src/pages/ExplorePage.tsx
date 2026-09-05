import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, Star, MapPin, BedDouble, Wind, Heart, ChevronDown, Grid, List } from 'lucide-react';
import { GlassCard, GlassButton, GlassInput, GlassModal } from '../components/glass';
import { useAppStore } from '../stores/appStore';
import { properties } from '../data/mockData';
import { formatPriceFull, getRoomTypeLabel } from '../utils/helpers';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

const AMENITIES = ['Wi-Fi', 'Food', 'AC', 'Laundry', 'Gym', 'Parking', 'CCTV', 'Power Backup', 'Study Room', 'Housekeeping'];
const BUDGET_RANGES = [
  { label: 'Under ₹5k', min: 0, max: 5000 },
  { label: '₹5k – ₹8k', min: 5000, max: 8000 },
  { label: '₹8k – ₹12k', min: 8000, max: 12000 },
  { label: '₹12k – ₹20k', min: 12000, max: 20000 },
  { label: '₹20k+', min: 20000, max: 50000 },
];

export default function ExplorePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { filters, setFilters, resetFilters, activeFilterCount, isSaved, toggleSaveRoom, toggleCompare, compareList } = useAppStore();
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) { setFilters({ searchQuery: q }); setSearchInput(q); }
  }, [searchParams]);

  const filtered = useMemo(() => {
    return properties.filter(p => {
      if (filters.budget[0] > 0 || filters.budget[1] < 50000) {
        if (p.rent < filters.budget[0] || p.rent > filters.budget[1]) return false;
      }
      if (filters.gender.length > 0 && !filters.gender.includes(p.gender)) return false;
      if (filters.roomType.length > 0 && !filters.roomType.includes(p.roomType)) return false;
      if (filters.ac !== null && p.ac !== filters.ac) return false;
      if (filters.foodIncluded !== null && p.foodIncluded !== filters.foodIncluded) return false;
      if (filters.amenities.length > 0 && !filters.amenities.every(a => p.amenities.includes(a))) return false;
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.location.city.toLowerCase().includes(q) && !p.location.area.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [filters]);

  const handleSearch = () => setFilters({ searchQuery: searchInput });

  const FilterChip = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
    <motion.span
      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand-600 text-xs font-medium"
      initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
      layout
    >
      {label}
      <button onClick={onRemove} className="ml-0.5 hover:bg-brand-100 dark:hover:bg-brand-800/30 rounded-full p-0.5">
        <X size={12} />
      </button>
    </motion.span>
  );

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">Explore Rooms</h1>
          <p className="text-[var(--text-secondary)] mt-1">{filtered.length} properties found</p>
        </div>

        {/* Search & Filters Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Search by name, area, city..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none focus:border-brand-500 transition-colors text-sm"
            />
          </div>
          <div className="flex gap-2">
            <GlassButton variant="secondary" icon={<SlidersHorizontal size={16} />} onClick={() => setShowFilters(true)}>
              Filters {activeFilterCount() > 0 && <span className="ml-1 px-1.5 py-0.5 rounded-full bg-brand-600 text-white text-[10px]">{activeFilterCount()}</span>}
            </GlassButton>
            <div className="hidden sm:flex gap-1 glass-card p-1">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-brand-600 text-white' : 'text-[var(--text-secondary)]'}`}><Grid size={16} /></button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-brand-600 text-white' : 'text-[var(--text-secondary)]'}`}><List size={16} /></button>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        <AnimatePresence>
          {activeFilterCount() > 0 && (
            <motion.div className="flex flex-wrap gap-2 mb-4" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
              {filters.gender.map(g => <FilterChip key={`g-${g}`} label={g} onRemove={() => setFilters({ gender: filters.gender.filter(x => x !== g) })} />)}
              {filters.roomType.map(r => <FilterChip key={`r-${r}`} label={getRoomTypeLabel(r)} onRemove={() => setFilters({ roomType: filters.roomType.filter(x => x !== r) })} />)}
              {filters.amenities.map(a => <FilterChip key={`a-${a}`} label={a} onRemove={() => setFilters({ amenities: filters.amenities.filter(x => x !== a) })} />)}
              {filters.ac !== null && <FilterChip label={filters.ac ? 'AC' : 'Non-AC'} onRemove={() => setFilters({ ac: null })} />}
              {filters.foodIncluded !== null && <FilterChip label={filters.foodIncluded ? 'Food included' : 'No food'} onRemove={() => setFilters({ foodIncluded: null })} />}
              <button onClick={resetFilters} className="text-xs text-red-500 font-medium px-2 hover:underline">Clear all</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Compare Bar */}
        <AnimatePresence>
          {compareList.length > 0 && (
            <motion.div className="glass-card p-3 mb-4 flex items-center justify-between"
              initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}>
              <span className="text-sm font-medium text-[var(--text-primary)]">{compareList.length}/3 selected for comparison</span>
              <GlassButton size="sm" onClick={() => navigate('/compare')}>Compare Now</GlassButton>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        {filtered.length === 0 ? (
          <GlassCard className="text-center py-16">
            <div className="text-5xl mb-4">😭</div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">No rooms found</h3>
            <p className="text-[var(--text-secondary)] mb-6">Try increasing your budget or expanding your search area.</p>
            <GlassButton variant="secondary" onClick={resetFilters}>Clear all filters</GlassButton>
          </GlassCard>
        ) : (
          <motion.div
            className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5' : 'flex flex-col gap-4'}
            variants={container}
            initial="hidden"
            animate="show"
          >
            {filtered.map(property => (
              <motion.div key={property.id} variants={item} layout>
                {viewMode === 'grid' ? (
                  <GlassCard noPadding className="overflow-hidden" onClick={() => navigate(`/property/${property.id}`)}>
                    <div className="relative h-44">
                      <img src={property.coverImage} alt={property.name} className="w-full h-full object-cover" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      {property.verified && <span className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-green-500/90 text-white text-xs font-semibold">✓ Verified</span>}
                      <button onClick={(e) => { e.stopPropagation(); toggleSaveRoom(property.id); }} className="absolute top-3 right-3 p-2 rounded-xl bg-black/30 backdrop-blur-sm hover:bg-black/50">
                        <Heart size={16} className={isSaved(property.id) ? 'fill-red-400 text-red-400' : 'text-white'} />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); toggleCompare(property.id); }} className="absolute bottom-3 right-3 p-1.5 rounded-lg bg-black/30 backdrop-blur-sm text-white text-xs">
                        {compareList.includes(property.id) ? '✓' : '⚖'} Compare
                      </button>
                      <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-white/90 dark:bg-black/60 backdrop-blur-sm text-xs font-bold text-[var(--text-primary)]">{formatPriceFull(property.rent)}/mo</span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-[var(--text-primary)]">{property.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)] mt-1"><MapPin size={12} /> {property.location.area}, {property.location.city}</div>
                      <div className="flex items-center gap-2 mt-2 text-xs text-[var(--text-secondary)]">
                        <span className="flex items-center gap-1"><BedDouble size={12} /> {getRoomTypeLabel(property.roomType)}</span>
                        <span>• {property.gender === 'boys' ? '👨 Boys' : property.gender === 'girls' ? '👩 Girls' : '👥'}</span>
                        {property.ac && <span className="flex items-center gap-1"><Wind size={12} /> AC</span>}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {property.amenities.slice(0, 3).map(a => <span key={a} className="px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)] text-[10px] text-[var(--text-secondary)]">{a}</span>)}
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border-primary)]">
                        <div className="flex items-center gap-1"><Star size={12} className="text-yellow-500 fill-yellow-500" /><span className="text-xs font-semibold">{property.rating}</span><span className="text-[10px] text-[var(--text-tertiary)]">({property.reviewCount})</span></div>
                        <span className="text-[10px] text-[var(--text-secondary)]">📍 {property.distance} km</span>
                      </div>
                    </div>
                  </GlassCard>
                ) : (
                  <GlassCard className="flex gap-4 cursor-pointer" onClick={() => navigate(`/property/${property.id}`)}>
                    <img src={property.coverImage} alt={property.name} className="w-32 h-28 rounded-xl object-cover shrink-0" loading="lazy" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-[var(--text-primary)]">{property.name}</h3>
                          <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)]"><MapPin size={12} /> {property.location.area}, {property.location.city}</div>
                        </div>
                        <span className="font-bold text-brand-600">{formatPriceFull(property.rent)}/mo</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-xs text-[var(--text-secondary)]">
                        <span>{getRoomTypeLabel(property.roomType)}</span> • <span>{property.gender === 'boys' ? 'Boys' : property.gender === 'girls' ? 'Girls' : 'Unisex'}</span>
                        {property.ac && <>• <span>AC</span></>}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1"><Star size={12} className="text-yellow-500 fill-yellow-500" /><span className="text-xs font-semibold">{property.rating}</span></div>
                        <div className="flex gap-2">
                          <button onClick={(e) => { e.stopPropagation(); toggleSaveRoom(property.id); }} className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)]"><Heart size={14} className={isSaved(property.id) ? 'fill-red-400 text-red-400' : 'text-[var(--text-secondary)]'} /></button>
                          <button onClick={(e) => { e.stopPropagation(); toggleCompare(property.id); }} className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-xs">⚖</button>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Filter Modal */}
      <GlassModal isOpen={showFilters} onClose={() => setShowFilters(false)} title="Filters" size="md">
        <div className="space-y-6">
          {/* Budget */}
          <div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-3">Monthly Rent</h3>
            <div className="flex flex-wrap gap-2">
              {BUDGET_RANGES.map(range => (
                <button
                  key={range.label}
                  onClick={() => setFilters({ budget: [range.min, range.max] })}
                  className={`px-3 py-2 rounded-xl text-sm font-medium border transition-colors ${
                    filters.budget[0] === range.min && filters.budget[1] === range.max
                      ? 'bg-brand-600 text-white border-brand-600'
                      : 'border-[var(--border-primary)] text-[var(--text-secondary)] hover:border-brand-500'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Gender */}
          <div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-3">Gender</h3>
            <div className="flex flex-wrap gap-2">
              {['boys', 'girls', 'unisex'].map(g => (
                <button key={g} onClick={() => {
                  const newGender = filters.gender.includes(g) ? filters.gender.filter(x => x !== g) : [...filters.gender, g];
                  setFilters({ gender: newGender });
                }} className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${filters.gender.includes(g) ? 'bg-brand-600 text-white border-brand-600' : 'border-[var(--border-primary)] text-[var(--text-secondary)]'}`}>
                  {g === 'boys' ? '👨 Boys' : g === 'girls' ? '👩 Girls' : '👥 Unisex'}
                </button>
              ))}
            </div>
          </div>

          {/* Room Type */}
          <div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-3">Room Type</h3>
            <div className="flex flex-wrap gap-2">
              {['single', 'double', 'triple', 'quad'].map(r => (
                <button key={r} onClick={() => {
                  const newType = filters.roomType.includes(r) ? filters.roomType.filter(x => x !== r) : [...filters.roomType, r];
                  setFilters({ roomType: newType });
                }} className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${filters.roomType.includes(r) ? 'bg-brand-600 text-white border-brand-600' : 'border-[var(--border-primary)] text-[var(--text-secondary)]'}`}>
                  {getRoomTypeLabel(r)}
                </button>
              ))}
            </div>
          </div>

          {/* AC */}
          <div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-3">AC / Non-AC</h3>
            <div className="flex gap-2">
              <button onClick={() => setFilters({ ac: filters.ac === true ? null : true })} className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${filters.ac === true ? 'bg-brand-600 text-white border-brand-600' : 'border-[var(--border-primary)] text-[var(--text-secondary)]'}`}>❄️ AC</button>
              <button onClick={() => setFilters({ ac: filters.ac === false ? null : false })} className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${filters.ac === false ? 'bg-brand-600 text-white border-brand-600' : 'border-[var(--border-primary)] text-[var(--text-secondary)]'}`}>🌀 Non-AC</button>
            </div>
          </div>

          {/* Food */}
          <div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-3">Food</h3>
            <div className="flex gap-2">
              <button onClick={() => setFilters({ foodIncluded: filters.foodIncluded === true ? null : true })} className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${filters.foodIncluded === true ? 'bg-brand-600 text-white border-brand-600' : 'border-[var(--border-primary)] text-[var(--text-secondary)]'}`}>🍽️ Food Included</button>
              <button onClick={() => setFilters({ foodIncluded: filters.foodIncluded === false ? null : false })} className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${filters.foodIncluded === false ? 'bg-brand-600 text-white border-brand-600' : 'border-[var(--border-primary)] text-[var(--text-secondary)]'}`}>🏠 Self-Cook</button>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-3">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {AMENITIES.map(a => (
                <button key={a} onClick={() => {
                  const newAmenities = filters.amenities.includes(a) ? filters.amenities.filter(x => x !== a) : [...filters.amenities, a];
                  setFilters({ amenities: newAmenities });
                }} className={`px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${filters.amenities.includes(a) ? 'bg-brand-600 text-white border-brand-600' : 'border-[var(--border-primary)] text-[var(--text-secondary)]'}`}>
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-[var(--border-primary)]">
            <GlassButton variant="secondary" fullWidth onClick={() => { resetFilters(); setShowFilters(false); }}>Reset All</GlassButton>
            <GlassButton fullWidth onClick={() => setShowFilters(false)}>Show {filtered.length} results</GlassButton>
          </div>
        </div>
      </GlassModal>
    </div>
  );
}
