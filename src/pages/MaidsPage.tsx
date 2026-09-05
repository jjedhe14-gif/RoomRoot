import { GlassCard } from '../components/glass';

export default function MaidsPage() {
  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-2">Maid & Helpers</h1>
        <p className="text-[var(--text-secondary)] mb-6">Find trusted domestic help for your PG or room</p>
        <GlassCard className="text-center py-16">
          <div className="text-5xl mb-4">🧹</div>
          <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Maid services are currently being added</h3>
          <p className="text-[var(--text-secondary)]">RoomRoot does not have a Maid backend yet, so no provider records are shown.</p>
        </GlassCard>
      </div>
    </div>
  );
}
