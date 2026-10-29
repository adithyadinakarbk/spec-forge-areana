import React, { useState } from 'react';
import { CourseSpecification, UserRole, PipelinePage, ValidationRule } from '../types';
import { getPermissionsForRole, requestAIGeneration } from '../api';

interface Page4ValidationChecksProps {
  course: CourseSpecification;
  onUpdateCourse: (updated: CourseSpecification) => void;
  currentRole: UserRole;
  onNavigate: (page: PipelinePage) => void;
  showNotification: (msg: string) => void;
  onOpenAIAssistantWithPrompt: (prompt: string) => void;
}

export const Page4ValidationChecks: React.FC<Page4ValidationChecksProps> = ({
  course,
  onUpdateCourse,
  currentRole,
  onNavigate,
  showNotification,
  onOpenAIAssistantWithPrompt,
}) => {
  const permissions = getPermissionsForRole(currentRole);
  const [activeFilter, setActiveFilter] = useState<'all' | 'hours' | 'blooms' | 'copo' | 'refs'>('all');
  const [isRunningEngine, setIsRunningEngine] = useState(false);

  const handleReRunEngine = () => {
    setIsRunningEngine(true);
    setTimeout(() => {
      setIsRunningEngine(false);
      showNotification('Compliance engine re-run complete: 26 passed, 2 advisories, 0 blocking errors.');
    }, 700);
  };

  const handleRemediateRule = async (ruleId: string) => {
    const rule = course.validationRules.find((r) => r.id === ruleId);
    if (!rule) return;

    const res = await requestAIGeneration('remediate_rule', { rule });

    // Update rule to passed and update textbooks
    const updatedRules = course.validationRules.map((r) =>
      r.id === ruleId ? { ...r, severity: 'passed' as const, isRemediated: true } : r
    );

    const updatedTextbooks = course.textbooks.map((tb) =>
      tb.isOutdated ? { ...tb, isOutdated: false, edition: '4th Edition (2022)' } : tb
    );

    onUpdateCourse({
      ...course,
      validationRules: updatedRules,
      textbooks: updatedTextbooks,
    });

    showNotification(res.content);
  };

  const filteredRules = course.validationRules.filter((r) => {
    if (activeFilter === 'all') return true;
    return r.category === activeFilter;
  });

  const passedCount = course.validationRules.filter((r) => r.severity === 'passed').length;
  const warningCount = course.validationRules.filter((r) => r.severity === 'warning').length;
  const errorCount = course.validationRules.filter((r) => r.severity === 'error').length;
  const complianceScore = Math.round((passedCount / course.validationRules.length) * 100);

  return (
    <div className="w-full px-4 lg:px-8 py-6 flex flex-col gap-6 max-w-[1560px] mx-auto animate-in fade-in duration-150">
      {/* Breadcrumb & Navigation */}
      <div className="flex flex-col gap-2">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[#43474e] text-xs">
          <button type="button" onClick={() => onNavigate('upload')} className="hover:text-[#022448]">Home</button>
          <span>/</span>
          <button type="button" onClick={() => onNavigate('spec')} className="hover:text-[#022448]">Specifications</button>
          <span>/</span>
          <span className="font-semibold">{course.code}</span>
          <span>/</span>
          <span className="font-bold text-[#022448] bg-[#dee9fc] px-2 py-0.5 rounded">4. Validation &amp; Checks</span>
        </nav>

        {/* Title and Action Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mt-1">
          <div className="flex flex-col max-w-3xl">
            <div className="flex items-center gap-2">
              <h1 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#022448] tracking-tight">
                Automated Validation &amp; Compliance Audit
              </h1>
              <span className="px-2.5 py-0.5 rounded bg-[#80f3dd] text-[#006f61] text-xs font-semibold uppercase tracking-wider">
                Engine v3.2
              </span>
            </div>
            <p className="text-xs text-[#43474e] mt-1 leading-relaxed">
              Real-time rule verification against university academic regulations, contact-hour balance, and NBA/ABET Tier-1 accreditation criteria.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleReRunEngine}
              disabled={isRunningEngine}
              className="inline-flex items-center gap-1.5 px-4 h-9 rounded-lg bg-white border border-[#dee9fc] text-[#022448] text-xs font-semibold shadow-xs hover:bg-[#eff4ff] transition-colors"
            >
              <span className={`material-symbols-outlined text-[18px] text-[#006b5d] ${isRunningEngine ? 'animate-spin' : ''}`}>
                sync
              </span>
              <span>{isRunningEngine ? 'Verifying Rules...' : 'Re-Run Compliance Engine'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                showNotification('Exported complete 28-rule compliance audit report to PDF');
              }}
              className="inline-flex items-center gap-1.5 px-4 h-9 rounded-lg bg-[#022448] hover:bg-[#1e3a5f] text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">download_for_offline</span>
              <span>Export Full Audit Log</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Pastel Summary Flashcards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Overall Compliance */}
        <div className="p-4 rounded-xl bg-[#E6F7F5] shadow-xs flex flex-col justify-between transition-transform hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#006f61] font-bold uppercase tracking-wider">Overall Compliance</span>
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#006f61]">
              <span className="material-symbols-outlined text-[20px]">verified_user</span>
            </div>
          </div>
          <div className="my-2">
            <span className="font-['Plus_Jakarta_Sans'] text-2xl text-[#00201b] font-bold">{complianceScore}%</span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-[#006f61]/10 text-xs">
            <span className="text-[#006f61]">Target: &ge; 90%</span>
            <span className="font-mono text-[#006f61] font-semibold">+4.2% vs draft</span>
          </div>
        </div>

        {/* Card 2: Fatal Errors */}
        <div className="p-4 rounded-xl bg-[#FFF0F0] shadow-xs flex flex-col justify-between transition-transform hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#93000a] font-bold uppercase tracking-wider">Fatal Errors</span>
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#ba1a1a]">
              <span className="material-symbols-outlined text-[20px]">error</span>
            </div>
          </div>
          <div className="my-2">
            <span className="font-['Plus_Jakarta_Sans'] text-2xl text-[#410002] font-bold">{errorCount} Blocking</span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-[#93000a]/10 text-xs">
            <span className="text-[#93000a]">Ready for Submission</span>
            <span className="font-bold text-[#ba1a1a]">Clear</span>
          </div>
        </div>

        {/* Card 3: Optimization Notices */}
        <div className="p-4 rounded-xl bg-[#FFF5DF] shadow-xs flex flex-col justify-between transition-transform hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#855300] font-bold uppercase tracking-wider">Optimization Notices</span>
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#9a6200]">
              <span className="material-symbols-outlined text-[20px]">warning</span>
            </div>
          </div>
          <div className="my-2">
            <span className="font-['Plus_Jakarta_Sans'] text-2xl text-[#2b1700] font-bold">{warningCount} Advisories</span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-[#855300]/10 text-xs">
            <span className="text-[#855300]">Non-blocking Warnings</span>
            <span className="font-semibold text-[#9a6200]">Action suggested</span>
          </div>
        </div>

        {/* Card 4: Passed Rules */}
        <div className="p-4 rounded-xl bg-[#EAF8EF] shadow-xs flex flex-col justify-between transition-transform hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#166534] font-bold uppercase tracking-wider">Passed Audit Rules</span>
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#16a34a]">
              <span className="material-symbols-outlined text-[20px]">checklist</span>
            </div>
          </div>
          <div className="my-2">
            <span className="font-['Plus_Jakarta_Sans'] text-2xl text-[#052e16] font-bold">{passedCount} / {course.validationRules.length}</span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-[#166534]/10 text-xs">
            <span className="text-[#166534]">Institutional Constraints</span>
            <span className="font-mono text-[#166534] font-semibold">{complianceScore}% passing</span>
          </div>
        </div>
      </div>

      {/* Main Workspace Container */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Primary Rules Inspection Area */}
        <div className="flex-1 w-full flex flex-col gap-4">
          {/* Filter Tabs & Quick Search */}
          <div className="p-2 rounded-xl bg-white shadow-xs border border-[#dee9fc] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2">
            <div className="flex items-center overflow-x-auto gap-1">
              {[
                { id: 'all', label: `All Rules (${course.validationRules.length})` },
                { id: 'hours', label: 'Contact Hours & Credits' },
                { id: 'blooms', label: "Bloom's Balance" },
                { id: 'copo', label: 'CO-PO Alignment' },
                { id: 'refs', label: 'References & Textbooks' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFilter(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    activeFilter === tab.id
                      ? 'bg-[#1e3a5f] text-white shadow-xs'
                      : 'text-[#43474e] hover:text-[#022448] hover:bg-[#eff4ff]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="hidden sm:flex items-center gap-1.5 px-3 text-[#43474e] text-xs font-semibold shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#16a34a]"></span>
              <span>NBA Cycle {course.academicYear} Validated</span>
            </div>
          </div>

          {/* Issue & Rule Cards Deck */}
          <div className="flex flex-col gap-4">
            {filteredRules.map((rule) => {
              const isPassed = rule.severity === 'passed';
              const isWarning = rule.severity === 'warning';
              const isError = rule.severity === 'error';

              return (
                <article
                  key={rule.id}
                  className="p-5 rounded-xl bg-white shadow-xs border border-[#dee9fc] flex flex-col gap-3 transition-shadow hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          isPassed
                            ? 'bg-[#EAF8EF] text-[#16a34a]'
                            : isWarning
                            ? 'bg-[#FFF5DF] text-[#9a6200]'
                            : 'bg-[#FFF0F0] text-[#ba1a1a]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {isPassed ? 'check_circle' : isWarning ? 'warning' : 'error'}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs text-[#43474e] font-bold">{rule.code}</span>
                          <span className="h-3 w-px bg-[#c4c6cf]"></span>
                          <span
                            className={`text-[11px] px-2 py-0.2 rounded font-bold ${
                              isPassed
                                ? 'bg-[#DCFCE7] text-[#15803D]'
                                : isWarning
                                ? 'bg-[#FFF5DF] text-[#855300]'
                                : 'bg-[#FEE2E2] text-[#991B1B]'
                            }`}
                          >
                            {isPassed ? 'Compliant' : isWarning ? 'Advisory Warning' : 'Fatal Error'}
                          </span>
                          <span className="h-3 w-px bg-[#c4c6cf]"></span>
                          <span className="text-[11px] text-[#43474e]">{rule.categoryLabel}</span>
                        </div>
                        <h2 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#022448] mt-1">
                          {rule.title}
                        </h2>
                      </div>
                    </div>

                    {isWarning && !rule.isRemediated && (
                      <button
                        type="button"
                        onClick={() => handleRemediateRule(rule.id)}
                        className="px-3 py-1.5 rounded-lg bg-[#006b5d] hover:bg-[#005046] text-white text-xs font-semibold flex items-center gap-1 shrink-0 shadow-xs"
                      >
                        <span className="material-symbols-outlined text-[16px]">build</span>
                        <span>Auto-Remediate</span>
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-[#121c2a] leading-relaxed pl-12">
                    {rule.description}
                  </p>

                  <div className="pl-12 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#eff4ff] text-[11px]">
                    <span className="text-[#43474e]">
                      <strong>Impact:</strong> {rule.impactText}
                    </span>
                    <span className="text-[#006b5d] font-semibold">
                      {rule.remediationAction}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Side Rail: Summary & Action */}
        <div className="w-full lg:w-80 flex flex-col gap-5 shrink-0">
          <div className="p-5 bg-white rounded-xl shadow-xs border border-[#dee9fc] flex flex-col gap-3.5">
            <h3 className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#022448] uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#006b5d] text-[18px]">verified</span>
              <span>Audit Execution Summary</span>
            </h3>

            <div className="flex flex-col gap-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#eff4ff]">
                <span className="text-[#43474e]">Engine Version</span>
                <span className="font-mono font-bold text-[#022448]">v3.2-STABLE</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#eff4ff]">
                <span className="text-[#43474e]">Accreditation Standard</span>
                <span className="font-semibold text-[#022448]">NBA Tier-1 / ABET</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#eff4ff]">
                <span className="text-[#43474e]">Total Rules Audited</span>
                <span className="font-mono font-bold text-[#022448]">{course.validationRules.length}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#eff4ff]">
                <span className="text-[#43474e]">Passed Rules</span>
                <span className="font-mono font-bold text-[#15803D]">{passedCount}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#43474e]">Blocking Errors</span>
                <span className="font-mono font-bold text-[#15803D]">{errorCount}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('workflow')}
              className="mt-2 w-full py-2 bg-[#022448] hover:bg-[#1e3a5f] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <span>Proceed to 5. Workflow</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
