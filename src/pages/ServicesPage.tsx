import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Clock, Star, ChevronRight, CheckCircle, Circle, Truck, Wrench, ArrowRight } from 'lucide-react';
import { GlassCard, GlassButton, GlassModal, GlassInput, GlassTextArea } from '../components/glass';
import { services } from '../data/mockData';
import { useToastStore } from '../stores/toastStore';
import { formatPriceFull } from '../utils/helpers';
import { createLiveServiceRequest, getLiveServiceRequests, type LiveServiceRequest } from '../services/api';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

const statusSteps = ['requested', 'assigned', 'on-the-way', 'in-progress', 'completed'];
const statusLabels = ['Requested', 'Assigned', 'On The Way', 'In Progress', 'Completed'];

export default function ServicesPage() {
  const { addToast } = useToastStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showTracking, setShowTracking] = useState(false);
  const [currentStep, setCurrentStep] = useState(2);
  const [requests, setRequests] = useState<LiveServiceRequest[]>([]);
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const refreshRequests = async () => {
    try { setRequests((await getLiveServiceRequests()).content); } catch { /* login/API state is surfaced by the existing auth flow */ }
  };
  useEffect(() => { void refreshRequests(); const timer = window.setInterval(() => void refreshRequests(), 15000); return () => window.clearInterval(timer); }, []);

  const submitRequest = async () => {
    const service = services.find(item => item.id === selectedService);
    if (!service || !description.trim() || !address.trim()) { addToast('Add a description and address to continue.', 'error'); return; }
    setSubmitting(true);
    try {
      await createLiveServiceRequest({ serviceType: service.name, description, address, preferredDate: preferredDate || undefined, preferredTime: preferredTime || undefined, estimatedPrice: service.startingPrice });
      await refreshRequests(); setShowRequestModal(false); setDescription(''); setAddress(''); setPreferredDate(''); setPreferredTime(''); addToast('Service request created!', 'success');
    } catch (error) { addToast(error instanceof Error ? error.message : 'Unable to create service request.', 'error'); } finally { setSubmitting(false); }
  };

  const filtered = services.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">Room Services</h1>
            <p className="text-[var(--text-secondary)] mt-1">Quick repairs and maintenance at your doorstep</p>
          </div>
          <GlassButton variant="secondary" onClick={() => setShowTracking(true)} icon={<Clock size={18} />}>Track Requests</GlassButton>
        </div>

        <div className="relative mb-6">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search services..." className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none focus:border-brand-500 transition-colors text-sm" />
        </div>

        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" variants={container} initial="hidden" animate="show">
          {filtered.map(service => (
            <motion.div key={service.id} variants={item}>
              <GlassCard className="h-full">
                <div className="text-3xl mb-3">{service.icon}</div>
                <h3 className="font-bold text-[var(--text-primary)] mb-1">{service.name}</h3>
                <p className="text-xs text-[var(--text-secondary)] mb-3 leading-relaxed">{service.description}</p>
                <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)] mb-3">
                  <span className="font-semibold text-brand-600">From {formatPriceFull(service.startingPrice)}</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {service.availability}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)] mb-4">
                  <Star size={12} className="text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">{service.rating}</span>
                  <span>({service.reviewCount})</span>
                </div>
                <GlassButton fullWidth size="sm" onClick={() => { setSelectedService(service.id); setShowRequestModal(true); }}>
                  Request Service
                </GlassButton>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Tracking Section */}
        <GlassCard className="mt-8">
          <h3 className="font-bold text-[var(--text-primary)] mb-4">Service Request Tracking</h3>
          <div className="space-y-4">
            {requests.map(req => (
              <div key={req.id} className="p-4 rounded-xl bg-[var(--bg-tertiary)]">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-[var(--text-primary)]">{req.serviceType}</h4>
                    <p className="text-xs text-[var(--text-tertiary)]">{req.provider || 'Awaiting assignment'} • {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'Just now'}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg ${req.status === 'completed' ? 'bg-green-50 dark:bg-green-900/20 text-green-600' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600'}`}>
                    {req.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {statusSteps.map((step, j) => (
                    <div key={j} className="flex items-center gap-1 flex-1">
                      <div className={`w-2 h-2 rounded-full ${j <= statusSteps.indexOf(req.status.toLowerCase()) ? 'bg-brand-600' : 'bg-gray-300 dark:bg-gray-600'}`} />
                      {j < statusSteps.length - 1 && <div className={`flex-1 h-0.5 ${j < statusSteps.indexOf(req.status.toLowerCase()) ? 'bg-brand-600' : 'bg-gray-300 dark:bg-gray-600'}`} />}
                    </div>
                  ))}
                </div>
                <p className="text-right text-[10px] text-[var(--text-tertiary)] mt-1">Total: {req.estimatedPrice ? formatPriceFull(req.estimatedPrice) : 'To be quoted'}</p>
              </div>
            ))}
            {requests.length === 0 && <p className="py-5 text-center text-sm text-[var(--text-tertiary)]">No service requests yet.</p>}
          </div>
        </GlassCard>
      </div>

      {/* Request Modal */}
      <GlassModal isOpen={showRequestModal} onClose={() => setShowRequestModal(false)} title={`Request ${services.find(s => s.id === selectedService)?.name || ''}`}>
        <div className="space-y-4">
          <GlassTextArea label="Describe the issue" value={description} onChange={event => setDescription(event.target.value)} placeholder="Briefly describe what needs to be fixed..." />
          <GlassInput label="Preferred Date" type="date" value={preferredDate} onChange={event => setPreferredDate(event.target.value)} />
          <GlassInput label="Preferred Time" type="time" value={preferredTime} onChange={event => setPreferredTime(event.target.value)} />
          <GlassInput label="Your Address" value={address} onChange={event => setAddress(event.target.value)} placeholder="Room/PG address" />
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-tertiary)]">
            <span className="text-sm text-[var(--text-secondary)]">Estimated cost:</span>
            <span className="font-bold text-brand-600">{formatPriceFull(services.find(s => s.id === selectedService)?.startingPrice || 0)}+</span>
          </div>
          <GlassButton fullWidth disabled={submitting} onClick={() => void submitRequest()}>
            {submitting ? 'Submitting...' : 'Submit Request'}
          </GlassButton>
        </div>
      </GlassModal>

      {/* Tracking Modal */}
      <GlassModal isOpen={showTracking} onClose={() => setShowTracking(false)} title="Service Tracking" size="lg">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
            <div>
              <h4 className="font-semibold text-[var(--text-primary)]">Plumbing Repair</h4>
              <p className="text-xs text-[var(--text-secondary)]">Assigned to: Ramesh Plumbing</p>
            </div>
            <span className="text-xs font-bold text-blue-600">In Progress</span>
          </div>
          <div className="space-y-3">
            {statusLabels.map((label, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${i <= currentStep ? 'bg-brand-600 text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]'}`}>
                  {i < currentStep ? <CheckCircle size={14} /> : <Circle size={14} />}
                </div>
                <span className={`text-sm ${i <= currentStep ? 'font-medium text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]'}`}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </GlassModal>
    </div>
  );
}
