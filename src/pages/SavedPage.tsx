import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MapPin, Star, BedDouble, Trash2 } from 'lucide-react';
import { GlassCard, GlassButton } from '../components/glass';
import { useAppStore } from '../stores/appStore';
import { useToastStore } from '../stores/toastStore';
import { properties } from '../data/mockData';
import { formatPriceFull, getRoomTypeLabel } from '../utils/helpers';

export default function SavedPage() {
  const navigate = useNavigate();
  const { savedRooms, toggleSaveRoom } = useAppStore();
  const { addToast } = useToastStore();
  const saved = properties.filter(p => savedRooms.includes(p.id));

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-2">Saved Rooms</h1>
        <p className="text-[var(--text-secondary)] mb-6">{saved.length} saved properties</p>

        {saved.length === 0 ? (
          <GlassCard className="text-center py-16">
            <div className="text-5xl mb-4">❤️</div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">No saved rooms yet</h3>
            <p className="text-[var(--text-secondary)] mb-4">Save rooms you like and they'll appear here.</p>
            <GlassButton onClick={() => navigate('/explore')}>Browse Rooms</GlassButton>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {saved.map(property => (
              <motion.div key={property.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <GlassCard noPadding className="overflow-hidden cursor-pointer" onClick={() => navigate(`/property/${property.id}`)}>
                  <div className="relative h-40">
                    <img src={property.coverImage} alt={property.name} className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <button onClick={(e) => { e.stopPropagation(); toggleSaveRoom(property.id); addToast('Room removed from saved', 'info'); }} className="absolute top-3 right-3 p-2 rounded-xl bg-black/30 backdrop-blur-sm text-red-400 hover:bg-black/50 transition-colors">
                      <Trash2 size={16} />
                    </button>
                    <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-white/90 dark:bg-black/60 backdrop-blur-sm text-xs font-bold text-[var(--text-primary)]">{formatPriceFull(property.rent)}/mo</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-[var(--text-primary)]">{property.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)] mt-1"><MapPin size={12} /> {property.location.area}, {property.location.city}</div>
                    <div className="flex items-center gap-2 mt-2 text-xs text-[var(--text-secondary)]">
                      <span className="flex items-center gap-1"><BedDouble size={12} /> {getRoomTypeLabel(property.roomType)}</span>
                      <span>• {property.gender === 'boys' ? 'Boys' : property.gender === 'girls' ? 'Girls' : 'Unisex'}</span>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border-primary)]">
                      <div className="flex items-center gap-1"><Star size={12} className="text-yellow-500 fill-yellow-500" /><span className="text-xs font-semibold">{property.rating}</span></div>
                      <span className="text-xs text-[var(--text-secondary)]">📍 {property.distance} km</span>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
