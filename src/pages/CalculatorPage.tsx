import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Users, Sparkles } from 'lucide-react';
import { GlassCard, GlassInput, GlassButton } from '../components/glass';

export default function CalculatorPage() {
  const [rent, setRent] = useState(18000);
  const [roommates, setRoommates] = useState(3);
  const [electricity, setElectricity] = useState(1500);
  const [wifi, setWifi] = useState(900);
  const [maid, setMaid] = useState(3000);
  const [food, setFood] = useState(6000);

  const total = useMemo(() => rent + electricity + wifi + maid + food, [rent, electricity, wifi, maid, food]);
  const perPerson = useMemo(() => Math.ceil(total / Math.max(roommates, 1)), [total, roommates]);

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center mx-auto mb-3">
            <Calculator size={28} className="text-brand-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">Budget Calculator</h1>
          <p className="text-[var(--text-secondary)] mt-1">Estimate your monthly living expenses</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard>
            <h3 className="font-bold text-[var(--text-primary)] mb-4">Expenses</h3>
            <div className="space-y-4">
              <GlassInput label="Monthly Rent (₹)" type="number" value={rent} onChange={e => setRent(Number(e.target.value) || 0)} />
              <GlassInput label="Number of Roommates" type="number" value={roommates} onChange={e => setRoommates(Number(e.target.value) || 1)} />
              <GlassInput label="Electricity (₹)" type="number" value={electricity} onChange={e => setElectricity(Number(e.target.value) || 0)} />
              <GlassInput label="Wi-Fi (₹)" type="number" value={wifi} onChange={e => setWifi(Number(e.target.value) || 0)} />
              <GlassInput label="Maid (₹)" type="number" value={maid} onChange={e => setMaid(Number(e.target.value) || 0)} />
              <GlassInput label="Food (₹)" type="number" value={food} onChange={e => setFood(Number(e.target.value) || 0)} />
            </div>
          </GlassCard>

          <div className="space-y-4">
            <GlassCard className="text-center">
              <p className="text-sm text-[var(--text-secondary)] mb-2">Total Monthly Expense</p>
              <motion.p className="text-4xl font-bold text-brand-600" key={total} initial={{ scale: 0.9 }} animate={{ scale: 1 }}>₹{total.toLocaleString('en-IN')}</motion.p>
              <p className="text-xs text-[var(--text-tertiary)] mt-2">for {roommates} {roommates === 1 ? 'person' : 'people'}</p>
            </GlassCard>

            <GlassCard className="text-center bg-gradient-to-br from-brand-500 to-purple-600 border-0">
              <p className="text-sm text-white/80 mb-2">Estimated Monthly Expense Per Person</p>
              <motion.p className="text-5xl font-bold text-white" key={perPerson} initial={{ scale: 0.9 }} animate={{ scale: 1 }}>₹{perPerson.toLocaleString('en-IN')}</motion.p>
              <div className="flex items-center justify-center gap-1 mt-2">
                <Sparkles size={14} className="text-white/70" />
                <p className="text-xs text-white/70">per person / month</p>
              </div>
            </GlassCard>

            <GlassCard>
              <h4 className="font-semibold text-[var(--text-primary)] mb-3">Breakdown</h4>
              {[
                { label: 'Rent per person', value: Math.ceil(rent / Math.max(roommates, 1)), color: 'bg-brand-500' },
                { label: 'Electricity per person', value: Math.ceil(electricity / Math.max(roommates, 1)), color: 'bg-yellow-500' },
                { label: 'Wi-Fi per person', value: Math.ceil(wifi / Math.max(roommates, 1)), color: 'bg-green-500' },
                { label: 'Maid per person', value: Math.ceil(maid / Math.max(roommates, 1)), color: 'bg-orange-500' },
                { label: 'Food per person', value: Math.ceil(food / Math.max(roommates, 1)), color: 'bg-purple-500' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3 py-2">
                  <div className={`w-2 h-2 rounded-full ${item.color}`} />
                  <span className="flex-1 text-sm text-[var(--text-secondary)]">{item.label}</span>
                  <span className="text-sm font-semibold text-[var(--text-primary)]">₹{item.value.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
