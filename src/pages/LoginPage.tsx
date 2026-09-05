import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Mail, MessageCircle, ShieldCheck } from 'lucide-react';
import { GlassButton, GlassCard, GlassInput } from '../components/glass';
import { useAppStore } from '../stores/appStore';
import { useToastStore } from '../stores/toastStore';
import { sendVerificationCode, verifyCode } from '../services/authService';

type AuthMode = 'signup' | 'login';

function DiscordMark() {
  return <span className="w-5 h-5 rounded-md bg-[#5865F2] text-white flex items-center justify-center text-[10px] font-black" aria-hidden="true">DS</span>;
}

function RoomRootLogo({ className }: { className: string }) {
  return <img src="/logo.svg" alt="RoomRoot" className={`object-contain ${className}`} />;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const setSession = useAppStore(state => state.setSession);
  const { addToast } = useToastStore();
  const [mode, setMode] = useState<AuthMode>('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpRequested, setOtpRequested] = useState(false);
  const [loading, setLoading] = useState(false);

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setOtpRequested(false);
    setOtp('');
  };

  const requestOtp = async () => {
    if (mode === 'signup' && !name.trim()) {
      addToast('Enter your name to continue.', 'error');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      addToast('Enter a valid email address.', 'error');
      return;
    }
    try {
      setLoading(true);
      await sendVerificationCode(email);
      setOtpRequested(true);
      addToast('Verification code sent to your email.', 'info');
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Unable to send verification code.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const verifyAndEnter = async () => {
    if (!/^\d{6}$/.test(otp.trim())) {
      addToast('Enter the 6-digit verification code.', 'error');
      return;
    }
    try {
      setLoading(true);
      const response = await verifyCode(email, otp, mode === 'signup' ? name : undefined);
      setSession(response.token, response.user);
      addToast(mode === 'signup' ? 'Account created! Welcome to RoomRoot.' : 'Welcome back to RoomRoot!', 'success');
      navigate('/', { replace: true });
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Unable to verify code.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const continueWith = (provider: string) => {
    addToast(`${provider} sign-in is not connected to the backend yet. Use email verification.`, 'info');
  };

  return (
    <div className="min-h-screen px-4 py-8 sm:py-12 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(66,99,235,0.18),transparent_32%),radial-gradient(circle_at_85%_80%,rgba(20,184,166,0.12),transparent_30%)] pointer-events-none" />
      <motion.div className="w-full max-w-5xl relative z-10 grid lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-16 items-center" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="hidden lg:block">
          <div className="flex items-center gap-3 mb-8">
            <RoomRootLogo className="w-11 h-11" />
            <span className="text-xl font-bold text-[var(--text-primary)]">Room<span className="text-brand-600">Root</span></span>
          </div>
          <p className="text-sm uppercase tracking-[0.18em] text-brand-600 font-semibold mb-3">Find your place</p>
          <h1 className="text-4xl xl:text-5xl font-bold leading-tight text-[var(--text-primary)] mb-5">A better room starts with the right people.</h1>
          <p className="text-[var(--text-secondary)] leading-relaxed max-w-md">Discover trusted student housing, compatible roommates, and everyday services in one calm, connected space.</p>
          <div className="mt-8 space-y-3 text-sm text-[var(--text-secondary)]">
            {['Verified rooms near your college', 'Roommates matched to your lifestyle', 'Support when you need it'].map(point => <div key={point} className="flex items-center gap-2"><Check size={16} className="text-green-500" />{point}</div>)}
          </div>
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="lg:hidden text-center mb-6">
            <RoomRootLogo className="w-14 h-14 mx-auto mb-3" />
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Welcome to RoomRoot</h1>
          </div>
          <GlassCard className="p-5 sm:p-7">
            <div className="mb-6"><h2 className="text-2xl font-bold text-[var(--text-primary)]">Get started</h2><p className="text-sm text-[var(--text-secondary)] mt-1">Use your email to securely enter RoomRoot.</p></div>
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[var(--bg-tertiary)] mb-6">
              <button onClick={() => switchMode('signup')} className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${mode === 'signup' ? 'bg-[var(--bg-secondary)] text-brand-600 shadow-sm' : 'text-[var(--text-secondary)]'}`}>New here? Sign up</button>
              <button onClick={() => switchMode('login')} className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${mode === 'login' ? 'bg-[var(--bg-secondary)] text-brand-600 shadow-sm' : 'text-[var(--text-secondary)]'}`}>Already a user? Log in</button>
            </div>
            <div className="space-y-4">
              {mode === 'signup' && <GlassInput label="Your name" value={name} onChange={event => setName(event.target.value)} placeholder="Jay Patel" />}
              <GlassInput label="Email address" type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="you@college.edu" icon={<Mail size={18} />} />
              {!otpRequested ? <GlassButton fullWidth size="lg" onClick={requestOtp} disabled={loading} icon={<ArrowRight size={18} />}>{loading ? 'Sending code...' : 'Send verification code'}</GlassButton> : <>
                <div className="rounded-xl border border-brand-200 dark:border-brand-900/40 bg-brand-50/70 dark:bg-brand-900/10 p-3 text-xs text-[var(--text-secondary)] flex gap-2"><ShieldCheck size={16} className="text-brand-600 shrink-0" /><span>We sent a 6-digit code to <strong className="text-[var(--text-primary)]">{email}</strong>.</span></div>
                <GlassInput label="Verification code" inputMode="numeric" maxLength={6} value={otp} onChange={event => setOtp(event.target.value.replace(/\D/g, ''))} placeholder="123456" />
                <GlassButton fullWidth size="lg" onClick={verifyAndEnter} disabled={loading}>{loading ? 'Verifying...' : 'Verify and enter'}</GlassButton>
                <button onClick={() => setOtpRequested(false)} className="w-full text-xs text-brand-600 hover:underline">Change email</button>
              </>}
            </div>
            <div className="relative my-6"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[var(--border-primary)]" /></div><div className="relative flex justify-center text-xs"><span className="px-3 bg-[var(--glass-bg)] text-[var(--text-tertiary)]">or continue instantly</span></div></div>
            <div className="grid grid-cols-2 gap-3">
              <GlassButton variant="secondary" fullWidth onClick={() => continueWith('Discord')} icon={<DiscordMark />}>Discord</GlassButton>
              <GlassButton variant="secondary" fullWidth onClick={() => continueWith('WhatsApp')} icon={<MessageCircle size={18} className="text-green-500" />}>WhatsApp</GlassButton>
            </div>
          </GlassCard>
          <div className="text-center mt-6 flex items-center justify-center gap-2 text-xs text-white/75"><button onClick={() => addToast('Help and support: support@roomroot.app', 'info')} className="font-light hover:text-white transition-colors">Help and support</button><span className="text-white/35">•</span><span className="font-light">Your privacy matters</span></div>
        </div>
      </motion.div>
    </div>
  );
}