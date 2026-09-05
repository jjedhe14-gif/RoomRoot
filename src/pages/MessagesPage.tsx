import { useEffect, useState } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { getLiveConversations, getLiveMessages, sendLiveMessage, type LiveConversation } from '../services/api';
import { useToastStore } from '../stores/toastStore';

type LiveMessage = { id: number; content: string; sender: { id: number }; createdAt: string; readAt?: string | null };

export default function MessagesPage() {
  const { addToast } = useToastStore();
  const [conversations, setConversations] = useState<LiveConversation[]>([]);
  const [active, setActive] = useState<LiveConversation | null>(null);
  const [messages, setMessages] = useState<LiveMessage[]>([]);
  const [text, setText] = useState('');

  const refresh = async () => {
    try { const data = (await getLiveConversations()).content; setConversations(data); if (active) setActive(data.find(item => item.id === active.id) || active); }
    catch { /* auth/API errors are handled by the page state */ }
  };
  useEffect(() => { void refresh(); const timer = window.setInterval(() => void refresh(), 10000); return () => window.clearInterval(timer); }, [active?.id]);
  useEffect(() => { if (!active) return; void getLiveMessages(active.id).then(data => setMessages(data.content)).catch(() => setMessages([])); }, [active?.id]);

  const send = async () => {
    if (!active || !text.trim()) return;
    try { await sendLiveMessage(active.id, text.trim()); setText(''); const data = await getLiveMessages(active.id); setMessages(data.content); await refresh(); }
    catch (error) { addToast(error instanceof Error ? error.message : 'Unable to send message.', 'error'); }
  };

  return <div className="min-h-screen pt-20 pb-24 md:pb-8 px-4"><div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)]" style={{ height: 'calc(100vh - 140px)' }}><div className="flex h-full">
    <aside className={`${active ? 'hidden md:block' : 'block'} w-full md:w-80 border-r border-[var(--border-primary)] overflow-y-auto`}><div className="border-b border-[var(--border-primary)] p-4"><h1 className="text-xl font-bold text-[var(--text-primary)]">Messages</h1><p className="mt-1 text-xs text-[var(--text-tertiary)]">Live conversations with owners</p></div>{conversations.map(conversation => <button key={conversation.id} onClick={() => setActive(conversation)} className="w-full border-b border-[var(--border-primary)] p-4 text-left hover:bg-[var(--bg-tertiary)]"><p className="text-sm font-semibold text-[var(--text-primary)]">{conversation.otherParticipant?.name || 'Conversation'}</p><p className="mt-1 truncate text-xs text-[var(--text-secondary)]">{conversation.lastMessage?.content || 'No messages yet'}</p></button>)}{conversations.length === 0 && <p className="p-6 text-center text-sm text-[var(--text-tertiary)]">No conversations yet. Start one from a property listing.</p>}</aside>
    <section className={`${active ? 'flex' : 'hidden md:flex'} flex-1 flex-col`}>
      {active ? <><header className="flex items-center gap-3 border-b border-[var(--border-primary)] p-4"><button className="md:hidden" onClick={() => setActive(null)}><ArrowLeft size={18} /></button><div><p className="font-semibold text-[var(--text-primary)]">{active.otherParticipant?.name}</p><p className="text-xs text-[var(--text-tertiary)]">{active.listing?.title || 'RoomRoot conversation'}</p></div></header><div className="flex-1 space-y-3 overflow-y-auto p-4">{messages.map(message => <div key={message.id} className={`flex ${message.sender.id === active.otherParticipant?.id ? 'justify-start' : 'justify-end'}`}><div className="max-w-[75%] rounded-2xl bg-brand-600 px-4 py-2.5 text-sm text-white">{message.content}<div className="mt-1 text-[10px] opacity-70">{new Date(message.createdAt).toLocaleString()}</div></div></div>)}</div><div className="flex gap-2 border-t border-[var(--border-primary)] p-3"><input value={text} onChange={event => setText(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') void send(); }} placeholder="Type a message..." className="flex-1 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-tertiary)] px-3 py-2 text-sm text-[var(--text-primary)]" /><button onClick={() => void send()} className="rounded-xl bg-brand-600 p-2.5 text-white"><Send size={17} /></button></div></> : <div className="m-auto text-center text-sm text-[var(--text-tertiary)]">Select a conversation</div>}
    </section>
  </div></div></div>;
}
