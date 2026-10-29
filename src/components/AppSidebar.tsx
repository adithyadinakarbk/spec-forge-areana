import React from 'react';
import { PipelinePage } from '../types';

interface AppSidebarProps {
  currentPage: PipelinePage;
  onPageChange: (page: PipelinePage) => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ currentPage, onPageChange }) => {
  const navItems: { key: PipelinePage; label: string; icon: string }[] = [
    { key: 'upload', label: '1. Upload', icon: 'cloud_upload' },
    { key: 'spec', label: '2. Spec', icon: 'description' },
    { key: 'mapping', label: '3. CO–PO–PSO Map', icon: 'grid_view' },
    { key: 'checks', label: '4. Checks', icon: 'check_circle' },
    { key: 'workflow', label: '5. Workflow', icon: 'account_tree' },
    { key: 'export', label: '6. Export', icon: 'download' },
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-[#ffffff] z-40 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] no-print">
      <div className="flex flex-col flex-1 pt-6 px-3.5 overflow-y-auto">
        <div className="px-2.5 mb-2.5">
          <span className="text-[11px] font-bold text-[#43474e] uppercase tracking-wider">
            Workflow Pipeline
          </span>
        </div>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = currentPage === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onPageChange(item.key)}
                className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-xs transition-colors text-left ${
                  isActive
                    ? 'bg-[#1e3a5f] text-white font-bold shadow-xs'
                    : 'text-[#43474e] hover:bg-[#dee9fc]/50 hover:text-[#121c2a] font-medium'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Compliance Badge */}
      <div className="p-3.5 border-t border-[#dee9fc]">
        <div className="p-2.5 rounded-lg bg-[#eff4ff] flex items-center gap-2.5 border border-[#dee9fc]">
          <span className="material-symbols-outlined text-[#006b5d] text-[22px]">verified</span>
          <div className="flex flex-col">
            <span className="text-xs text-[#022448] font-bold leading-tight">
              NBA &amp; ABET Compliant
            </span>
            <span className="text-[10px] text-[#43474e] leading-none mt-1">
              Cycle 2024–25 Tier-1
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
