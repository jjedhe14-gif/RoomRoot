import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border-primary)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/logo.svg" alt="RoomRoot" className="w-9 h-9 object-contain" />
              <span className="text-lg font-bold text-[var(--text-primary)]">Room<span className="text-brand-600">Root</span></span>
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Find your place. Find your people. The modern student housing platform.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-3">Product</h3>
            <ul className="space-y-2">
              <li><Link to="/explore" className="text-sm text-[var(--text-secondary)] hover:text-brand-600 transition-colors">Find Rooms</Link></li>
              <li><Link to="/roommates" className="text-sm text-[var(--text-secondary)] hover:text-brand-600 transition-colors">Find Roommates</Link></li>
              <li><Link to="/maids" className="text-sm text-[var(--text-secondary)] hover:text-brand-600 transition-colors">Maid & Helpers</Link></li>
              <li><Link to="/services" className="text-sm text-[var(--text-secondary)] hover:text-brand-600 transition-colors">Room Services</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-3">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-[var(--text-secondary)] hover:text-brand-600 transition-colors">About</a></li>
              <li><a href="#" className="text-sm text-[var(--text-secondary)] hover:text-brand-600 transition-colors">Contact</a></li>
              <li><a href="#" className="text-sm text-[var(--text-secondary)] hover:text-brand-600 transition-colors">Careers</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-3">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-[var(--text-secondary)] hover:text-brand-600 transition-colors">Help Center</a></li>
              <li><a href="#" className="text-sm text-[var(--text-secondary)] hover:text-brand-600 transition-colors">Safety</a></li>
              <li><a href="#" className="text-sm text-[var(--text-secondary)] hover:text-brand-600 transition-colors">Report Issue</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-3">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-[var(--text-secondary)] hover:text-brand-600 transition-colors">Privacy</a></li>
              <li><a href="#" className="text-sm text-[var(--text-secondary)] hover:text-brand-600 transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[var(--border-primary)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--text-tertiary)]">© 2026 RoomRoot. All rights reserved.</p>
          <p className="text-xs text-[var(--text-tertiary)]">Made with ❤️ for students</p>
        </div>
      </div>
    </footer>
  );
}
