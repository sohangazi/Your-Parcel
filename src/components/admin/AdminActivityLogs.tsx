import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { History, ShieldCheck, Search, Filter } from 'lucide-react';

export const AdminActivityLogs: React.FC = () => {
  const { activityLogs } = useData();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');

  const filtered = activityLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.adminEmail.toLowerCase().includes(search.toLowerCase());
    const matchesCat = catFilter === 'all' || log.category === catFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-white">System Audit & Activity Logs</h1>
        <p className="text-xs text-slate-400">
          Immutable audit trail of administrator pricing adjustments, shipment status progressions, and CMS publications.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <input
            type="text"
            placeholder="Search action or log details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
        >
          <option value="all">All Categories</option>
          <option value="pricing">Pricing Changes</option>
          <option value="shipment">Shipment Tracking</option>
          <option value="country">Country Config</option>
          <option value="product">Product Config</option>
          <option value="cms">CMS & Content</option>
          <option value="system">System Events</option>
        </select>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] font-mono border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-6">Timestamp</th>
              <th className="py-3.5 px-6">Administrator</th>
              <th className="py-3.5 px-6">Action</th>
              <th className="py-3.5 px-6">Category</th>
              <th className="py-3.5 px-6">Event Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300 font-medium">
            {filtered.map((log) => (
              <tr key={log.id} className="hover:bg-slate-850/50 transition-colors">
                <td className="py-4 px-6 text-[11px] text-slate-400 font-mono whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="py-4 px-6 font-mono text-cyan-400 text-xs">
                  {log.adminEmail}
                </td>
                <td className="py-4 px-6 font-bold text-white whitespace-nowrap">
                  {log.action}
                </td>
                <td className="py-4 px-6">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-950 text-slate-400 border border-slate-800">
                    {log.category}
                  </span>
                </td>
                <td className="py-4 px-6 text-slate-300 max-w-md">
                  {log.details}
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-xs text-slate-500">
                  No activity logs recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
