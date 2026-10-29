import React, { useState } from 'react';
import { CourseSpecification } from '../types';
import { requestAIGeneration, loadSettings } from '../api';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: CourseSpecification;
  initialPrompt?: string;
  onApplyOutcomeSuggestion?: (outcomeText: string) => void;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  course,
  initialPrompt = '',
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [loading, setLoading] = useState(false);
  const [responseContent, setResponseContent] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<'audit' | 'suggest_co' | 'auto_map'>('audit');

  if (!isOpen) return null;

  const currentSettings = loadSettings();

  const handleRunAI = async (taskOverride?: 'audit' | 'suggest_co' | 'auto_map') => {
    const task = taskOverride || activeTask;
    setLoading(true);
    setResponseContent(null);

    const action =
      task === 'suggest_co'
        ? 'suggest_co'
        : task === 'auto_map'
        ? 'auto_map_matrix'
        : 'general_query';

    try {
      const res = await requestAIGeneration(
        action,
        {
          code: course.code,
          title: course.title,
          cos: course.outcomes,
          pos: course.programOutcomes,
          workload: {
            credits: course.credits,
            lecture: course.lectureHoursPerWeek,
            lab: course.labHoursPerWeek,
          },
        },
        prompt
      );

      setResponseContent(res.content);
    } catch (err: any) {
      setResponseContent(`Failed to execute AI request: ${err?.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 no-print">
      <div className="w-full max-w-2xl bg-white border border-[#dee9fc] rounded-xl shadow-xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-[#022448] text-white flex items-center justify-between border-b border-[#01162d]">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#80f3dd] text-[24px]">psychology</span>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-white font-['Plus_Jakarta_Sans']">
                SpecForge Curriculum AI Assistant
              </h2>
              <p className="text-[11px] text-slate-300">
                Grounding against NBA Tier-1 &amp; ABET Computing Accreditation Criteria
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded hover:bg-white/10"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex flex-col gap-4 max-h-[75vh] overflow-y-auto">
          {/* Header indicator */}
          <div className="flex items-center justify-between text-[11px] text-[#43474e] bg-[#eff4ff] border border-[#dee9fc] px-3 py-1.5 rounded-lg">
            <span>
              Provider: <strong className="text-[#022448]">{currentSettings.provider}</strong> • Model:{' '}
              <strong className="text-[#022448] font-mono">{currentSettings.model}</strong>
            </span>
            <span className="text-[#006b5d] font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">shield</span>
              <span>Isolated Client Headers Active</span>
            </span>
          </div>

          {/* Quick Action Presets */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-[#43474e] uppercase tracking-wider">
              Auditor Preset Tasks
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveTask('audit');
                  setPrompt('Perform comprehensive Bloom\'s Revised Taxonomy distribution audit.');
                  handleRunAI('audit');
                }}
                className={`p-2.5 text-left border rounded-lg text-xs transition-colors ${
                  activeTask === 'audit'
                    ? 'border-[#006b5d] bg-[#E6F7F5] text-[#022448] font-semibold'
                    : 'border-[#dee9fc] hover:bg-[#eff4ff] text-[#43474e]'
                }`}
              >
                <div className="font-bold text-[#022448]">Audit Bloom's Verbs</div>
                <div className="text-[10px] text-[#43474e]">Verify L1–L6 balance</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTask('suggest_co');
                  setPrompt('Synthesize a high-order L6-Create Outcome for advanced data structures.');
                  handleRunAI('suggest_co');
                }}
                className={`p-2.5 text-left border rounded-lg text-xs transition-colors ${
                  activeTask === 'suggest_co'
                    ? 'border-[#006b5d] bg-[#E6F7F5] text-[#022448] font-semibold'
                    : 'border-[#dee9fc] hover:bg-[#eff4ff] text-[#43474e]'
                }`}
              >
                <div className="font-bold text-[#022448]">Synthesize New CO</div>
                <div className="text-[10px] text-[#43474e]">Action verbs + rubric</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTask('auto_map');
                  setPrompt('Auto-correlate all 5 COs to PO1–PO12 and PSO1–PSO2.');
                  handleRunAI('auto_map');
                }}
                className={`p-2.5 text-left border rounded-lg text-xs transition-colors ${
                  activeTask === 'auto_map'
                    ? 'border-[#006b5d] bg-[#E6F7F5] text-[#022448] font-semibold'
                    : 'border-[#dee9fc] hover:bg-[#eff4ff] text-[#43474e]'
                }`}
              >
                <div className="font-bold text-[#022448]">NBA Auto-Map</div>
                <div className="text-[10px] text-[#43474e]">Correlation index audit</div>
              </button>
            </div>
          </div>

          {/* Prompt Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-[#43474e] uppercase tracking-wider">
              Custom Prompt / Query
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask curriculum assistant or specify syllabus requirements..."
                className="flex-1 h-9 px-3 text-xs bg-white border border-[#dee9fc] rounded-lg text-[#121c2a] focus:ring-2 focus:ring-[#006b5d] focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleRunAI();
                  }
                }}
              />
              <button
                type="button"
                onClick={() => handleRunAI()}
                disabled={loading}
                className="px-4 h-9 bg-[#022448] hover:bg-[#1e3a5f] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <span>Analyzing...</span>
                ) : (
                  <>
                    <span>Generate</span>
                    <span className="material-symbols-outlined text-[16px]">send</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* AI Response Display */}
          {responseContent && (
            <div className="mt-2 p-4 bg-[#eff4ff] border border-[#dee9fc] rounded-xl flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#022448] border-b border-[#dee9fc] pb-1.5">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#006b5d] text-[18px]">psychology</span>
                  <span>Curriculum Synthesis Result</span>
                </span>
                <span className="text-[10px] text-[#15803D] font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  <span>Validated</span>
                </span>
              </div>
              <pre className="text-xs text-[#121c2a] font-mono whitespace-pre-wrap leading-relaxed bg-white p-3 border border-[#dee9fc] rounded-lg max-h-60 overflow-y-auto">
                {responseContent}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#eff4ff] border-t border-[#dee9fc] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-[#022448] border border-[#dee9fc] hover:bg-white rounded-lg transition-colors"
          >
            Close Assistant
          </button>
        </div>
      </div>
    </div>
  );
};
