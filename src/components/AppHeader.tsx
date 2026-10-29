import React from 'react';
import { CourseSpecification, UserRole } from '../types';
import { normalizeRole } from '../api';

interface AppHeaderProps {
  course: CourseSpecification;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenSettings: () => void;
  onOpenAIAssistant: () => void;
  lastSavedText?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  course,
  currentRole,
  onRoleChange,
  onOpenSettings,
  onOpenAIAssistant,
  lastSavedText = 'Saved just now',
}) => {
  const normRole = normalizeRole(currentRole);

  const roleInfo: Record<string, { name: string; title: string }> = {
    author: { name: 'Dr. Aris Vance', title: 'Assoc. Prof CSE' },
    reviewer: { name: 'Prof. Elena Rostova', title: 'DRC Reviewer' },
    hod: { name: 'Prof. Marcus Chen', title: 'Head of Department' },
    admin: { name: 'Dr. Aris Vance', title: 'System Administrator' },
  };

  const currentPerson = roleInfo[normRole] || roleInfo.author;

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#ffffff] z-50 shadow-[0_1px_8px_rgba(0,0,0,0.04)] no-print">
      <div className="h-16 w-full px-4 lg:px-8 flex items-center justify-between gap-6">
        {/* Logo & App Brand */}
        <div className="flex items-center gap-3.5 min-w-[260px]">
          <div className="h-9 w-9 rounded-lg bg-[#022448] text-white flex items-center justify-center font-bold text-sm tracking-tighter shadow-xs">
            SF
          </div>
          <div className="flex flex-col">
            <span className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#022448] leading-none">
              SpecForge
            </span>
            <span className="text-[11px] text-[#43474e] uppercase tracking-wider font-semibold mt-1">
              Academic Specification Workspace
            </span>
          </div>
        </div>

        {/* Center Document Context Banner */}
        <div className="hidden xl:flex items-center gap-3.5 px-3.5 py-1.5 rounded-xl bg-[#eff4ff]">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#43474e]">Doc:</span>
            <span className="text-xs font-semibold text-[#022448]">
              {course.code}: {course.title}
            </span>
          </div>
          <div className="h-4 w-px bg-[#c4c6cf]"></div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#80f3dd] text-[#006f61] text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#006b5d]"></span>
            <span className="capitalize">{course.stage.replace('_', ' ')}</span>
          </div>
          <div className="h-4 w-px bg-[#c4c6cf]"></div>
          <div className="inline-flex items-center gap-1.5 text-[#43474e] text-xs">
            <span className="material-symbols-outlined text-[16px] text-[#006b5d]">cloud_done</span>
            <span>{lastSavedText}</span>
          </div>
        </div>

        {/* Right Action Cluster: Role Switcher, AI Assistant, Notifications, User */}
        <div className="flex items-center gap-3">
          {/* Simulated Role Switcher */}
          <div className="flex items-center p-1 bg-[#e6eeff] rounded-lg border border-[#c4c6cf]/40">
            <button
              type="button"
              onClick={() => onRoleChange('author')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                normRole === 'author'
                  ? 'bg-[#022448] text-white shadow-xs'
                  : 'text-[#43474e] hover:text-[#022448] hover:bg-[#dee9fc]'
              }`}
              title="Author: Draft, Edit & Ingest Syllabus"
            >
              Author
            </button>
            <button
              type="button"
              onClick={() => onRoleChange('reviewer')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                normRole === 'reviewer'
                  ? 'bg-[#022448] text-white shadow-xs'
                  : 'text-[#43474e] hover:text-[#022448] hover:bg-[#dee9fc]'
              }`}
              title="Reviewer: Inspect, Comment & Endorse"
            >
              Reviewer
            </button>
            <button
              type="button"
              onClick={() => onRoleChange('hod')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                normRole === 'hod'
                  ? 'bg-[#022448] text-white shadow-xs'
                  : 'text-[#43474e] hover:text-[#022448] hover:bg-[#dee9fc]'
              }`}
              title="HOD: Final Sign-off & Accreditation Lock"
            >
              HOD
            </button>
          </div>

          {/* AI Curriculum Assistant */}
          <button
            type="button"
            onClick={onOpenAIAssistant}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#006b5d] hover:bg-[#005046] text-white rounded text-xs font-semibold transition-colors shadow-xs"
            title="Open AI Curriculum Assistant"
          >
            <span className="material-symbols-outlined text-[16px]">psychology</span>
            <span className="hidden sm:inline">Curriculum AI</span>
          </button>

          {/* AI Settings Trigger */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="p-1.5 text-[#43474e] hover:text-[#022448] hover:bg-[#dee9fc] rounded transition-colors"
            title="Configure AI API Key (Saved in Client Storage)"
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </button>

          <div className="h-6 w-px bg-[#c4c6cf] hidden sm:block"></div>

          {/* User Profile Info */}
          <div className="flex items-center gap-2.5">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-bold text-[#121c2a] leading-tight">
                {currentPerson.name}
              </span>
              <span className="text-[11px] text-[#43474e] leading-none mt-0.5">
                {currentPerson.title}
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#022448] flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
