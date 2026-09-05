import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, Star, MapPin, BedDouble, Wind, UtensilsCrossed } from 'lucide-react';
import { GlassCard, GlassButton } from '../components/glass';
import { useAppStore } from '../stores/appStore';
import { properties } from '../data/mockData';
import { formatPriceFull, getRoomTypeLabel } from '../utils/helpers';

const compareFields = [
  { label: 'Monthly Rent', key: 'rent', format: (v: number) => formatPriceFull(v) + '/mo' },
  { label: 'Deposit', key: 'deposit', format: (v: number) => formatPriceFull(v) },
  { label: 'Room Type', key: 'roomType', format: (v: string) => getRoomTypeLabel(v) },
  { label: 'Gender', key: 'gender', format: (v: string) => v === 'boys' ? 'Boys' : v === 'girls' ? 'Girls' : 'Unisex' },
  { label: 'AC', key: 'ac', format: (v: boolean) => v ? '✅ Yes' : '❌ No' },
  { label: 'Food Included', key: 'foodIncluded', format: (v: boolean) => v ? '✅ Yes' : '❌ No' },
  { label: 'Distance', key: 'distance', format: (v: number) => v + ' km' },
  { label: 'Rating', key: 'rating', format: (v: number) => `⭐ ${v}` },
  { label: 'Reviews', key: 'reviewCount', format: (v: number) => `${v} reviews` },
  { label: 'Furnished', key: 'furnished', format: (v: string) => v === 'fully' ? 'Fully' : v === 'semi' ? 'Semi' : 'Unfurnished' },
  { label: 'Available', key: 'available', format: (v: boolean) => v ? '✅ Yes' : '❌ No' },
  { label: 'Verified', key: 'verified', format: (v: boolean) => v ? '✅ Yes' : '❌ No' },
];

export default function ComparePage() {
  const navigate = useNavigate();
  const { compareList, toggleCompare } = useAppStore();
  const compared = properties.filter(p => compareList.includes(p.id));

  if (compared.length < 2) {
    return (
      <div className="min-h-screen pt-20 pb-24 md:pb-8 px-4">
        <div className="max-w-5xl mx-auto">
          <GlassCard className="text-center py-16">
            <div className="text-5xl mb-4">⚖️</div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Add properties to compare</h3>
            <p className="text-[var(--text-secondary)] mb-4">Select 2 or 3 properties from the Explore page to compare them.</p>
            <GlassButton onClick={() => navigate('/explore')}>Browse Properties</GlassButton>
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Compare Properties</h1>
        <GlassCard noPadding className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-[var(--border-primary)]">
                <th className="p-4 text-left text-sm font-semibold text-[var(--text-secondary)] w-40">Feature</th>
                {compared.map(p => (
                  <th key={p.id} className="p-4 text-center">
                    <div className="relative">
                      <button onClick={() => toggleCompare(p.id)} className="absolute -top-1 -right-1 p-1 rounded-full bg-[var(--bg-tertiary)] hover:bg-red-100"><X size={12} /></button>
                      <img src={p.coverImage} alt={p.name} className="w-20 h-14 rounded-lg object-cover mx-auto mb-2" />
                      <p className="text-sm font-bold text-[var(--text-primary)]">{p.name}</p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {compareFields.map((field, i) => (
                <tr key={field.key} className={`border-b border-[var(--border-primary)] ${i % 2 === 0 ? 'bg-[var(--bg-tertiary)]/50' : ''}`}>
                  <td className="p-3 text-sm font-medium text-[var(--text-secondary)]">{field.label}</td>
                  {compared.map(p => (
                    <td key={p.id} className="p-3 text-center text-sm text-[var(--text-primary)]">
                      {field.format((p as unknown as Record<string, unknown>)[field.key] as never)}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-b border-[var(--border-primary)]">
                <td className="p-3 text-sm font-medium text-[var(--text-secondary)]">Amenities</td>
                {compared.map(p => (
                  <td key={p.id} className="p-3 text-center">
                    <div className="flex flex-wrap gap-1 justify-center">
                      {p.amenities.map(a => <span key={a} className="px-1.5 py-0.5 rounded bg-brand-50 dark:bg-brand-900/20 text-[10px] text-brand-600">{a}</span>)}
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3"></td>
                {compared.map(p => (
                  <td key={p.id} className="p-3 text-center">
                    <GlassButton size="sm" onClick={() => navigate(`/property/${p.id}`)}>View Details</GlassButton>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </GlassCard>
      </div>
    </div>
  );
}
