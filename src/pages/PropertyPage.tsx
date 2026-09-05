import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Share2, Star, MapPin, BedDouble, Wind, UtensilsCrossed, Wifi, Shield, Clock, Phone, MessageSquare, Calendar, ChevronRight, AlertTriangle } from 'lucide-react';
import { GlassCard, GlassButton, GlassModal } from '../components/glass';
import { Avatar } from '../components/ui/Avatar';
import { properties, roommates } from '../data/mockData';
import { useAppStore } from '../stores/appStore';
import { useToastStore } from '../stores/toastStore';
import { formatPriceFull, getRoomTypeLabel, getInitials } from '../utils/helpers';
import { createLiveReport, startLiveConversationByEmail } from '../services/api';

export default function PropertyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const property = properties.find(p => p.id === id);
  const { isSaved, toggleSaveRoom } = useAppStore();
  const { addToast } = useToastStore();
  const [activeImage, setActiveImage] = useState(0);
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportDescription, setReportDescription] = useState('');

  if (!property) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <GlassCard className="text-center p-12">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Property not found</h2>
          <Link to="/explore" className="text-brand-600 font-semibold mt-4 inline-block">Browse all properties →</Link>
        </GlassCard>
      </div>
    );
  }

  const nearbyRoommates = roommates.filter(r => r.location.toLowerCase().includes(property.location.area.toLowerCase()) || r.location.toLowerCase().includes(property.location.city.toLowerCase())).slice(0, 3);

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-8">
      {/* Back button */}
      <div className="max-w-5xl mx-auto px-4 mb-4">
        <Link to="/explore" className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
          <ArrowLeft size={16} /> Back to Explore
        </Link>
      </div>

      {/* Image Gallery */}
      <div className="max-w-5xl mx-auto px-4 mb-6">
        <GlassCard noPadding className="overflow-hidden">
          <div className="relative h-64 sm:h-80 md:h-96">
            <img src={property.images[activeImage] || property.coverImage} alt={property.name} className="w-full h-full object-cover transition-all duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            {property.verified && <span className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-green-500/90 text-white text-sm font-semibold backdrop-blur-sm">✓ Verified Property</span>}
            <div className="absolute top-4 right-4 flex gap-2">
              <button onClick={() => { toggleSaveRoom(property.id); addToast(isSaved(property.id) ? 'Room removed from saved' : 'Room saved ❤️', 'success'); }} className="p-2.5 rounded-xl bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-colors">
                <Heart size={20} className={isSaved(property.id) ? 'fill-red-400 text-red-400' : 'text-white'} />
              </button>
              <button onClick={() => { navigator.clipboard?.writeText(window.location.href); addToast('Link copied!', 'success'); }} className="p-2.5 rounded-xl bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-colors">
                <Share2 size={20} className="text-white" />
              </button>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">{property.name}</h1>
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <MapPin size={14} /> {property.location.address}
              </div>
            </div>
          </div>
          {/* Thumbnail strip */}
          {property.images.length > 1 && (
            <div className="flex gap-2 p-3 overflow-x-auto">
              {property.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(i)} className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-colors ${i === activeImage ? 'border-brand-600' : 'border-transparent'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </GlassCard>
      </div>

      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Info */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">{property.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1"><Star size={16} className="text-yellow-500 fill-yellow-500" /><span className="font-semibold text-[var(--text-primary)]">{property.rating}</span><span className="text-sm text-[var(--text-tertiary)]">({property.reviewCount} reviews)</span></div>
                  <span className="text-[var(--text-tertiary)]">•</span>
                  <span className="text-sm text-[var(--text-secondary)]">📍 {property.distance} km away</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-brand-600">{formatPriceFull(property.rent)}<span className="text-sm font-normal text-[var(--text-secondary)]">/mo</span></div>
                <div className="text-xs text-[var(--text-secondary)]">Deposit: {formatPriceFull(property.deposit)}</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-[var(--text-secondary)]">
              <span className="flex items-center gap-1"><BedDouble size={16} /> {getRoomTypeLabel(property.roomType)}</span>
              <span>• {property.gender === 'boys' ? '👨 Boys' : property.gender === 'girls' ? '👩 Girls' : '👥 Unisex'}</span>
              {property.ac && <span className="flex items-center gap-1"><Wind size={16} /> AC</span>}
              <span>• {property.furnished === 'fully' ? 'Fully Furnished' : property.furnished === 'semi' ? 'Semi Furnished' : 'Unfurnished'}</span>
              {property.foodIncluded && <span className="flex items-center gap-1"><UtensilsCrossed size={16} /> Food {property.foodType ? `(${property.foodType})` : ''}</span>}
            </div>
            <div className="mt-4 p-4 rounded-xl bg-[var(--bg-tertiary)]">
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{property.description}</p>
            </div>
          </GlassCard>

          {/* Amenities */}
          <GlassCard>
            <h3 className="font-bold text-[var(--text-primary)] mb-4">Amenities</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {property.amenities.map(a => (
                <div key={a} className="flex items-center gap-2 p-2.5 rounded-xl bg-[var(--bg-tertiary)] text-sm text-[var(--text-primary)]">
                  <span className="text-brand-500">✓</span> {a}
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Rules */}
          <GlassCard>
            <h3 className="font-bold text-[var(--text-primary)] mb-4">House Rules</h3>
            <div className="space-y-2">
              {property.rules.map((rule, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <Shield size={14} className="text-[var(--text-tertiary)]" />
                  {rule}
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Map Placeholder */}
          <GlassCard>
            <h3 className="font-bold text-[var(--text-primary)] mb-4">Location</h3>
            <div className="h-56 overflow-hidden rounded-xl bg-[var(--bg-tertiary)]">
              <iframe
                title={`Map showing ${property.name}`}
                src={`https://www.google.com/maps?q=${property.location.lat},${property.location.lng}&z=15&output=embed`}
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <p className="mt-2 text-xs text-[var(--text-secondary)]">{property.location.address}</p>
            <a href={`https://www.google.com/maps?q=${property.location.lat},${property.location.lng}`} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm text-brand-600 font-medium hover:underline">
              Open in Google Maps <ChevronRight size={14} />
            </a>
          </GlassCard>

          {/* Nearby */}
          <GlassCard>
            <h3 className="font-bold text-[var(--text-primary)] mb-4">Nearby Places</h3>
            <div className="space-y-2">
              {property.nearby.map((place, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-tertiary)]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center">
                      <MapPin size={14} className="text-brand-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{place.name}</p>
                      <p className="text-xs text-[var(--text-tertiary)]">{place.type}</p>
                    </div>
                  </div>
                  <span className="text-xs text-[var(--text-secondary)]">{place.distance}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Reviews */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[var(--text-primary)]">Reviews</h3>
              <div className="flex items-center gap-1">
                <Star size={18} className="text-yellow-500 fill-yellow-500" />
                <span className="font-bold text-[var(--text-primary)]">{property.rating}</span>
                <span className="text-sm text-[var(--text-tertiary)]">/ 5</span>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Rohit M.', rating: 5, text: 'Great PG with clean rooms and tasty food. Staff is very cooperative.' },
                { name: 'Vikram S.', rating: 4, text: 'Good location, a bit noisy on weekends but overall a great place to stay.' },
                { name: 'Priya K.', rating: 5, text: 'Best PG in the area! Wi-Fi is fast and rooms are well-maintained.' },
              ].map((review, i) => (
                <div key={i} className="p-3 rounded-xl bg-[var(--bg-tertiary)]">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar name={review.name} size="sm" />
                    <span className="text-sm font-semibold text-[var(--text-primary)]">{review.name}</span>
                    <div className="flex">{Array.from({ length: review.rating }).map((_, j) => <Star key={j} size={12} className="text-yellow-500 fill-yellow-500" />)}</div>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">{review.text}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Safety */}
          <GlassCard className="border-yellow-200 dark:border-yellow-800/30">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="text-yellow-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-[var(--text-primary)] mb-1">Trust & Safety</h4>
                <p className="text-sm text-[var(--text-secondary)]">Never send money before verifying the property and owner in person. Visit the property before making any payment.</p>
                <div className="flex gap-3 mt-3">
                  <button onClick={() => setShowReportModal(true)} className="text-xs text-red-500 font-medium hover:underline">Report Listing</button>
                  <button className="text-xs text-red-500 font-medium hover:underline">Block Owner</button>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Sticky action card */}
          <div className="lg:sticky lg:top-24">
            <GlassCard>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-brand-600">{formatPriceFull(property.rent)}<span className="text-base font-normal text-[var(--text-secondary)]">/month</span></div>
                <p className="text-sm text-[var(--text-secondary)]">+ {formatPriceFull(property.deposit)} refundable deposit</p>
              </div>
              <div className="space-y-2 mb-4">
                <GlassButton fullWidth onClick={() => setShowVisitModal(true)} icon={<Calendar size={18} />}>Schedule a Visit</GlassButton>
                <GlassButton fullWidth variant="secondary" onClick={() => setShowContactModal(true)} icon={<Phone size={18} />}>Contact Owner</GlassButton>
                <GlassButton fullWidth variant="secondary" icon={<MessageSquare size={18} />} onClick={async () => {
                  if (!property.owner.email) { navigate('/messages'); return; }
                  try { await startLiveConversationByEmail(property.owner.email, `Hi, I am interested in ${property.name}.`); navigate('/messages'); }
                  catch (error) { addToast(error instanceof Error ? error.message : 'Unable to start conversation.', 'error'); }
                }}>Chat with Owner</GlassButton>
              </div>
              <div className="p-3 rounded-xl bg-[var(--bg-tertiary)]">
                <div className="flex items-center gap-3">
                  <Avatar name={property.owner.name} size="md" />
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{property.owner.name}</p>
                    <p className="text-xs text-[var(--text-tertiary)]">{property.owner.verified ? '✓ Verified Owner' : 'Unverified'}</p>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Nearby roommates */}
            {nearbyRoommates.length > 0 && (
              <GlassCard className="mt-4">
                <h4 className="font-bold text-[var(--text-primary)] mb-3">Roommates Looking Nearby</h4>
                <div className="space-y-3">
                  {nearbyRoommates.map(r => (
                    <Link to="/roommates" key={r.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors">
                      <Avatar name={r.name} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--text-primary)] truncate">{r.name}</p>
                        <p className="text-xs text-[var(--text-tertiary)]">{r.spotsAvailable} spots • {formatPriceFull(r.amountPerPerson)}/mo</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </GlassCard>
            )}
          </div>
        </div>
      </div>

      {/* Visit Modal */}
      <GlassModal isOpen={showVisitModal} onClose={() => setShowVisitModal(false)} title="Schedule a Visit">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Preferred Date</label>
            <input type="date" className="glass-input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Preferred Time</label>
            <input type="time" className="glass-input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Message (optional)</label>
            <textarea className="glass-input resize-none" rows={3} placeholder="Any specific questions for the owner?" />
          </div>
          <GlassButton fullWidth onClick={() => { setShowVisitModal(false); addToast('Visit scheduled! ✓', 'success'); }}>
            Confirm Visit
          </GlassButton>
        </div>
      </GlassModal>

      {/* Contact Modal */}
      <GlassModal isOpen={showContactModal} onClose={() => setShowContactModal(false)} title="Contact Owner">
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center mx-auto">
            <Phone size={24} className="text-brand-600" />
          </div>
          <div>
            <p className="font-bold text-[var(--text-primary)] text-lg">{property.owner.name}</p>
            <p className="text-[var(--text-secondary)]">{property.owner.phone}</p>
          </div>
          <a href={`tel:${property.owner.phone}`} className="block">
            <GlassButton fullWidth icon={<Phone size={18} />}>Call Now</GlassButton>
          </a>
        </div>
      </GlassModal>

      <GlassModal isOpen={showReportModal} onClose={() => setShowReportModal(false)} title={`Report ${property.name}`}>
        <div className="space-y-4">
          <p className="text-sm text-[var(--text-secondary)]">Your report will be attached to <strong>{property.name}</strong> at {property.location.address}.</p>
          <textarea value={reportDescription} onChange={event => setReportDescription(event.target.value)} rows={4} placeholder="Describe the issue with this PG or hostel..." className="glass-input w-full resize-none" />
          <GlassButton fullWidth onClick={async () => { try { await createLiveReport({ targetName: property.name, targetAddress: property.location.address, reason: 'Listing reported by user', description: reportDescription }); setShowReportModal(false); setReportDescription(''); addToast('Report submitted for review.', 'success'); } catch (error) { addToast(error instanceof Error ? error.message : 'Unable to submit report.', 'error'); } }}>Submit Report</GlassButton>
        </div>
      </GlassModal>
    </div>
  );
}
