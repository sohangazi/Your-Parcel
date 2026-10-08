import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { ContactMessage } from '../../types';
import { Mail, Phone, Clock, CheckCircle2, MessageSquare, Search } from 'lucide-react';

export const AdminMessages: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'contactMessages'), (snap) => {
      const list: ContactMessage[] = [];
      snap.forEach((d) => list.push({ ...d.data(), id: d.id } as ContactMessage));
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setMessages(list);
    });
    return () => unsub();
  }, []);

  const markStatus = async (id: string, status: ContactMessage['status']) => {
    try {
      await updateDoc(doc(db, 'contactMessages', id), { status });
    } catch (e) {
      console.warn(e);
    }
  };

  const filtered = messages.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.message.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-white">Customer Support Inquiries</h1>
        <p className="text-xs text-slate-400">
          Messages received through the public contact form and international inquiries desk.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((msg) => (
          <div
            key={msg.id}
            className={`bg-slate-900 border rounded-2xl p-5 space-y-3 transition-colors ${
              msg.status === 'unread' ? 'border-cyan-500/50 bg-slate-900/90' : 'border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">{msg.name}</h3>
                <span className="text-[11px] text-cyan-400 font-mono">{msg.email}</span>
              </div>
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                  msg.status === 'unread'
                    ? 'bg-amber-950 text-amber-300'
                    : msg.status === 'replied'
                    ? 'bg-emerald-950 text-emerald-300'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {msg.status}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 whitespace-pre-line leading-relaxed">
              {msg.message}
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-[11px] text-slate-500 font-mono">
                {new Date(msg.createdAt).toLocaleString()}
              </span>

              <div className="flex items-center gap-2">
                {msg.phone && (
                  <a
                    href={`tel:${msg.phone}`}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300"
                    title="Call"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                )}
                {msg.status === 'unread' && (
                  <button
                    onClick={() => markStatus(msg.id, 'read')}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                  >
                    Mark Read
                  </button>
                )}
                {msg.status !== 'replied' && (
                  <button
                    onClick={() => markStatus(msg.id, 'replied')}
                    className="px-2.5 py-1 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 text-xs font-bold border border-emerald-800"
                  >
                    Mark Replied
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-2 text-center py-12 text-slate-500 text-xs">
            No contact messages recorded.
          </div>
        )}
      </div>
    </div>
  );
};
