import React, { useState } from 'react';
import {
  CourseSpecification,
  UserRole,
  PipelinePage,
  CourseOutcome,
  SyllabusUnit,
  BloomsTaxonomy,
  TextbookReference,
} from '../types';
import { getPermissionsForRole, requestAIGeneration } from '../api';

interface Page2CourseSpecProps {
  course: CourseSpecification;
  onUpdateCourse: (updated: CourseSpecification) => void;
  currentRole: UserRole;
  onNavigate: (page: PipelinePage) => void;
  showNotification: (msg: string) => void;
  onOpenAIAssistantWithPrompt: (prompt: string) => void;
}

export const Page2CourseSpec: React.FC<Page2CourseSpecProps> = ({
  course,
  onUpdateCourse,
  currentRole,
  onNavigate,
  showNotification,
  onOpenAIAssistantWithPrompt,
}) => {
  const permissions = getPermissionsForRole(currentRole);
  const [activeSection, setActiveSection] = useState<'A' | 'B' | 'C' | 'D' | 'E' | 'F'>('A');
  const [isAiSuggesting, setIsAiSuggesting] = useState(false);

  const totalLectureHours = course.lectureHoursPerWeek * course.totalSemesterWeeks;
  const totalLabHours = course.labHoursPerWeek * course.totalSemesterWeeks;
  const totalContactHours = totalLectureHours + totalLabHours;
  const calculatedCredits = course.lectureHoursPerWeek + course.tutorialHoursPerWeek + course.labHoursPerWeek * 0.5;

  const totalAssessmentPercentage = course.assessmentScheme.reduce((acc, item) => acc + item.percentage, 0);

  const bloomsCounts = course.outcomes.reduce((acc, co) => {
    acc[co.bloomsLevel] = (acc[co.bloomsLevel] || 0) + 1;
    return acc;
  }, {} as Record<BloomsTaxonomy, number>);

  const handleUpdate = <K extends keyof CourseSpecification>(field: K, val: CourseSpecification[K]) => {
    if (!permissions.canEditSpecification) {
      showNotification('Read-only: Switch to Author role to edit course specification.');
      return;
    }
    onUpdateCourse({ ...course, [field]: val });
  };

  const handleAddCO = () => {
    if (!permissions.canEditSpecification) return;
    const nextIdx = course.outcomes.length + 1;
    const newCO: CourseOutcome = {
      id: `CO${nextIdx}`,
      code: `CO${nextIdx}`,
      shortTitle: 'Advanced Algorithmic Design',
      description: 'Formulate and evaluate parallel algorithmic solutions and lock-free data structures.',
      bloomsLevel: 'Create',
      bloomsTag: 'L6-Create',
      targetWeight: 15,
      assessmentMethod: 'Laboratory Practicum Milestone',
    };
    onUpdateCourse({
      ...course,
      outcomes: [...course.outcomes, newCO],
    });
    showNotification(`Added Course Outcome CO${nextIdx}`);
  };

  const handleRemoveCO = (id: string) => {
    if (!permissions.canEditSpecification) return;
    onUpdateCourse({
      ...course,
      outcomes: course.outcomes.filter((co) => co.id !== id),
      matrixMappings: course.matrixMappings.filter((m) => m.coId !== id),
    });
    showNotification('Removed Course Outcome.');
  };

  const handleAISuggestCO = async () => {
    setIsAiSuggesting(true);
    try {
      const res = await requestAIGeneration('suggest_co', {
        code: course.code,
        title: course.title,
        cos: course.outcomes,
      });
      if (res.success) {
        handleAddCO();
        showNotification('Bloom’s AI successfully synthesized a high-order L6-Create Outcome.');
      }
    } finally {
      setIsAiSuggesting(false);
    }
  };

  return (
    <div className="w-full px-4 lg:px-8 py-6 flex flex-col gap-6 max-w-[1720px] mx-auto animate-in fade-in duration-150">
      {/* Breadcrumb & Navigation */}
      <div className="flex flex-col gap-2">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[#43474e] text-xs">
          <button
            type="button"
            onClick={() => onNavigate('upload')}
            className="hover:text-[#022448] transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">home</span>
            <span>Home</span>
          </button>
          <span className="text-[#c4c6cf] font-bold">/</span>
          <button
            type="button"
            onClick={() => onNavigate('spec')}
            className="hover:text-[#022448] transition-colors"
          >
            Specifications
          </button>
          <span className="text-[#c4c6cf] font-bold">/</span>
          <span className="font-mono text-[#121c2a] font-semibold">{course.code}</span>
          <span className="text-[#c4c6cf] font-bold">/</span>
          <span className="text-[#022448] font-bold bg-[#dee9fc] px-2 py-0.5 rounded">
            2. Course Specification
          </span>
        </nav>

        {/* Title Bar & Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#022448] tracking-tight">
                Course Specification Editor
              </h1>
              <span className="px-2.5 py-0.5 rounded bg-[#dee9fc] text-[#022448] text-xs font-semibold uppercase tracking-wider">
                {course.code}: Core Theory + Lab
              </span>
              <span className="px-2.5 py-0.5 rounded bg-[#80f3dd] text-[#006f61] text-xs font-semibold">
                Accreditation Cycle {course.academicYear}
              </span>
            </div>
            <p className="text-xs text-[#43474e] max-w-3xl leading-relaxed">
              Define comprehensive course identification, pedagogical objectives, Bloom’s cognitive outcomes, and modular syllabus aligned with national accreditation standards.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('export')}
              className="px-3.5 py-2 rounded-lg bg-[#e6eeff] hover:bg-[#dee9fc] text-[#022448] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
              <span>Preview PDF</span>
            </button>
            <button
              type="button"
              onClick={() => showNotification('Course specification draft autosaved.')}
              className="px-3.5 py-2 rounded-lg bg-[#eff4ff] hover:bg-[#e6eeff] text-[#121c2a] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs border border-[#dee9fc]"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              <span>Save Draft</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('mapping')}
              className="px-5 py-2 rounded-lg bg-[#022448] hover:bg-[#1e3a5f] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <span>Next: Mapping Matrix</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Pastel Summary Flashcards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Course Code */}
        <div className="p-4 rounded-xl bg-[#EAF2FF] flex flex-col justify-between shadow-xs transition-transform hover:-translate-y-0.5">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] text-[#274B7D] uppercase tracking-wider font-bold">Course Code</span>
              <span className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#0B254A] mt-1 font-mono">
                {course.code}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/90 flex items-center justify-center text-[#1E3A5F] shadow-xs">
              <span className="material-symbols-outlined text-[24px]">menu_book</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#274B7D]/10 flex items-center justify-between text-xs">
            <span className="text-[#38557A] truncate max-w-[150px]">Dept: {course.department}</span>
            <span className="font-mono text-[#274B7D] font-bold">{course.level}</span>
          </div>
        </div>

        {/* Card 2: Credits & L-T-P */}
        <div className="p-4 rounded-xl bg-[#F1ECFF] flex flex-col justify-between shadow-xs transition-transform hover:-translate-y-0.5">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] text-[#4E3A82] uppercase tracking-wider font-bold">
                L-T-P: {course.lectureHoursPerWeek}-{course.tutorialHoursPerWeek}-{course.labHoursPerWeek}
              </span>
              <span className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#2B1B54] mt-1 font-mono">
                {course.credits.toFixed(1)} Credits
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/90 flex items-center justify-center text-[#4B3080] shadow-xs">
              <span className="material-symbols-outlined text-[24px]">school</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#4E3A82]/10 flex items-center justify-between text-xs">
            <span className="text-[#5B468F]">{totalLectureHours} Lec + {totalLabHours} Lab Hrs</span>
            <span className="font-mono text-[#4E3A82] font-bold">{totalContactHours} Contact</span>
          </div>
        </div>

        {/* Card 3: Outcomes */}
        <div className="p-4 rounded-xl bg-[#E6F7F5] flex flex-col justify-between shadow-xs transition-transform hover:-translate-y-0.5">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] text-[#006053] uppercase tracking-wider font-bold">Defined COs</span>
              <span className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#003830] mt-1 font-mono">
                {course.outcomes.length} Outcomes
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/90 flex items-center justify-center text-[#006B5D] shadow-xs">
              <span className="material-symbols-outlined text-[24px]">track_changes</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#006053]/10 flex items-center justify-between text-xs">
            <span className="text-[#196B60]">Bloom L2–L6 Mapped</span>
            <span className="font-mono text-[#006053] font-bold">100% Taxonomized</span>
          </div>
        </div>

        {/* Card 4: Completeness */}
        <div className="p-4 rounded-xl bg-[#EAF8EF] flex flex-col justify-between shadow-xs transition-transform hover:-translate-y-0.5">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] text-[#1F6838] uppercase tracking-wider font-bold">Spec Completeness</span>
              <span className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#0D3F1E] mt-1 font-mono">
                94%
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/90 flex items-center justify-center text-[#1B6F38] shadow-xs">
              <span className="material-symbols-outlined text-[24px]">check_circle</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#1F6838]/10 flex items-center justify-between text-xs">
            <span className="text-[#276B3E]">All Sections Validated</span>
            <span className="font-mono text-[#1F6838] font-bold">1 Advisory</span>
          </div>
        </div>
      </div>

      {/* Main Workspace Grid: Form Editor (8 cols) + Side Compliance Rail (4 cols) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Editor (8 cols) */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          {/* Section Navigation Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto bg-white p-1.5 rounded-xl border border-[#dee9fc] shadow-xs">
            {[
              { id: 'A', label: 'A. Basics & Credits' },
              { id: 'B', label: 'B. Description & Rationale' },
              { id: 'C', label: 'C. Course Outcomes (COs)' },
              { id: 'D', label: 'D. Modular Syllabus' },
              { id: 'E', label: 'E. Assessment Scheme' },
              { id: 'F', label: 'F. Textbooks & Literature' },
            ].map((sec) => (
              <button
                key={sec.id}
                type="button"
                onClick={() => setActiveSection(sec.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeSection === sec.id
                    ? 'bg-[#1e3a5f] text-white shadow-xs'
                    : 'text-[#43474e] hover:bg-[#eff4ff]'
                }`}
              >
                {sec.label}
              </button>
            ))}
          </div>

          {/* SECTION A: Course Basics & Credit Breakdown */}
          {activeSection === 'A' && (
            <section className="bg-white p-6 rounded-xl shadow-xs flex flex-col gap-5 border border-[#dee9fc] animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-[#dee9fc] pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-[#e6eeff] text-[#022448] font-bold text-sm flex items-center justify-center">
                    A
                  </span>
                  <div>
                    <h2 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#022448]">
                      Course Basics &amp; Credit Breakdown
                    </h2>
                    <p className="text-[11px] text-[#43474e]">
                      Statutory metadata required for university cataloging and Board of Studies approval.
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded bg-[#DCFCE7] text-[#15803D] text-[11px] font-bold">
                  Validated
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-xs font-semibold text-[#121c2a] mb-1">Course Code</label>
                  <input
                    type="text"
                    value={course.code}
                    disabled={!permissions.canEditSpecification}
                    onChange={(e) => handleUpdate('code', e.target.value)}
                    className="w-full h-9 px-3 font-mono font-bold text-sm bg-white border border-[#dee9fc] rounded-lg text-[#121c2a] focus:ring-2 focus:ring-[#006b5d] focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-[#121c2a] mb-1">Course Title</label>
                  <input
                    type="text"
                    value={course.title}
                    disabled={!permissions.canEditSpecification}
                    onChange={(e) => handleUpdate('title', e.target.value)}
                    className="w-full h-9 px-3 font-semibold text-xs bg-white border border-[#dee9fc] rounded-lg text-[#121c2a] focus:ring-2 focus:ring-[#006b5d] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#121c2a] mb-1">Offering Department</label>
                  <input
                    type="text"
                    value={course.department}
                    disabled={!permissions.canEditSpecification}
                    onChange={(e) => handleUpdate('department', e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-white border border-[#dee9fc] rounded-lg text-[#121c2a] focus:ring-2 focus:ring-[#006b5d] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#121c2a] mb-1">Academic Year</label>
                  <input
                    type="text"
                    value={course.academicYear}
                    disabled={!permissions.canEditSpecification}
                    onChange={(e) => handleUpdate('academicYear', e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-white border border-[#dee9fc] rounded-lg text-[#121c2a] focus:ring-2 focus:ring-[#006b5d] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#121c2a] mb-1">Semester &amp; Tier</label>
                  <input
                    type="text"
                    value={course.semester}
                    disabled={!permissions.canEditSpecification}
                    onChange={(e) => handleUpdate('semester', e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-white border border-[#dee9fc] rounded-lg text-[#121c2a] focus:ring-2 focus:ring-[#006b5d] focus:outline-none"
                  />
                </div>
              </div>

              {/* L-T-P Breakdown Card */}
              <div className="p-4 bg-[#eff4ff] rounded-xl border border-[#dee9fc] flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#022448] uppercase tracking-wider">
                    Credit &amp; Contact Hour Distribution (L-T-P)
                  </span>
                  <span className="text-xs font-mono font-bold text-[#006b5d]">
                    Formula: Credits = L + T + (P / 2)
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-white p-3 rounded-lg border border-[#dee9fc]">
                    <span className="text-[11px] text-[#43474e] block">Lecture (L) Hrs/Wk</span>
                    <input
                      type="number"
                      value={course.lectureHoursPerWeek}
                      disabled={!permissions.canEditSpecification}
                      onChange={(e) => handleUpdate('lectureHoursPerWeek', parseInt(e.target.value) || 0)}
                      className="mt-1 w-full font-mono text-base font-bold text-[#022448] focus:outline-none"
                    />
                    <span className="text-[10px] text-[#43474e]">{totalLectureHours} Total Semester Hrs</span>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-[#dee9fc]">
                    <span className="text-[11px] text-[#43474e] block">Tutorial (T) Hrs/Wk</span>
                    <input
                      type="number"
                      value={course.tutorialHoursPerWeek}
                      disabled={!permissions.canEditSpecification}
                      onChange={(e) => handleUpdate('tutorialHoursPerWeek', parseInt(e.target.value) || 0)}
                      className="mt-1 w-full font-mono text-base font-bold text-[#022448] focus:outline-none"
                    />
                    <span className="text-[10px] text-[#43474e]">0 Semester Hrs</span>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-[#dee9fc]">
                    <span className="text-[11px] text-[#43474e] block">Practical/Lab (P) Hrs/Wk</span>
                    <input
                      type="number"
                      value={course.labHoursPerWeek}
                      disabled={!permissions.canEditSpecification}
                      onChange={(e) => handleUpdate('labHoursPerWeek', parseInt(e.target.value) || 0)}
                      className="mt-1 w-full font-mono text-base font-bold text-[#022448] focus:outline-none"
                    />
                    <span className="text-[10px] text-[#43474e]">{totalLabHours} Total Lab Hrs</span>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-[#dee9fc]">
                    <span className="text-[11px] text-[#43474e] block">Total Statutory Credits</span>
                    <div className="mt-1 font-mono text-base font-bold text-[#006b5d]">
                      {calculatedCredits.toFixed(1)} Credits
                    </div>
                    <span className="text-[10px] text-[#006b5d] font-semibold">{totalContactHours} Total Contact Hrs</span>
                  </div>
                </div>
              </div>

              {/* Prerequisites Tags */}
              <div>
                <label className="block text-xs font-semibold text-[#121c2a] mb-1.5">
                  Prerequisites (Curricular Foundations)
                </label>
                <div className="flex flex-wrap gap-2">
                  {course.prerequisites.map((pr, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#eff4ff] border border-[#dee9fc] text-[#022448] rounded-lg text-xs font-medium"
                    >
                      <span>{pr}</span>
                      {permissions.canEditSpecification && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...course.prerequisites];
                            updated.splice(idx, 1);
                            handleUpdate('prerequisites', updated);
                          }}
                          className="text-[#43474e] hover:text-[#ba1a1a] font-bold"
                        >
                          ×
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* SECTION B: Description & Pedagogical Rationale */}
          {activeSection === 'B' && (
            <section className="bg-white p-6 rounded-xl shadow-xs flex flex-col gap-5 border border-[#dee9fc] animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-[#dee9fc] pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-[#e6eeff] text-[#022448] font-bold text-sm flex items-center justify-center">
                    B
                  </span>
                  <div>
                    <h2 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#022448]">
                      Course Description &amp; Pedagogical Rationale
                    </h2>
                    <p className="text-[11px] text-[#43474e]">
                      Catalog narrative for student handbooks and university accreditation dossier.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 text-xs">
                <div>
                  <label className="block text-xs font-semibold text-[#121c2a] mb-1">
                    Official Course Catalog Description
                  </label>
                  <textarea
                    rows={4}
                    value={course.courseDescription}
                    disabled={!permissions.canEditSpecification}
                    onChange={(e) => handleUpdate('courseDescription', e.target.value)}
                    className="w-full p-3 text-xs leading-relaxed bg-white border border-[#dee9fc] rounded-lg text-[#121c2a] focus:ring-2 focus:ring-[#006b5d] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#121c2a] mb-1">
                    Pedagogical Rationale &amp; Industry Alignment
                  </label>
                  <textarea
                    rows={3}
                    value={course.pedagogicalRationale}
                    disabled={!permissions.canEditSpecification}
                    onChange={(e) => handleUpdate('pedagogicalRationale', e.target.value)}
                    className="w-full p-3 text-xs leading-relaxed bg-white border border-[#dee9fc] rounded-lg text-[#121c2a] focus:ring-2 focus:ring-[#006b5d] focus:outline-none"
                  />
                </div>
              </div>
            </section>
          )}

          {/* SECTION C: Course Outcomes & Bloom's Taxonomy Mapping */}
          {activeSection === 'C' && (
            <section className="bg-white p-6 rounded-xl shadow-xs flex flex-col gap-5 border border-[#dee9fc] animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-[#dee9fc] pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-[#e6eeff] text-[#022448] font-bold text-sm flex items-center justify-center">
                    C
                  </span>
                  <div>
                    <h2 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#022448]">
                      Course Outcomes &amp; Bloom's Taxonomy Mapping
                    </h2>
                    <p className="text-[11px] text-[#43474e]">
                      Action-oriented competency statements mapped to Revised Bloom’s Taxonomy levels L1 to L6.
                    </p>
                  </div>
                </div>

                {permissions.canEditSpecification && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleAISuggestCO}
                      disabled={isAiSuggesting}
                      className="px-3 py-1.5 rounded-lg border border-[#006b5d] text-[#006b5d] hover:bg-[#E6F7F5] transition-colors text-xs font-semibold flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">psychology</span>
                      <span>{isAiSuggesting ? 'Synthesizing...' : 'AI CO Suggest'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleAddCO}
                      className="px-3 py-1.5 rounded-lg bg-[#022448] hover:bg-[#1e3a5f] text-white transition-colors text-xs font-semibold flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                      <span>Add Outcome</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3.5">
                {course.outcomes.map((co, idx) => (
                  <div
                    key={co.id}
                    className="p-4 bg-white border border-[#dee9fc] rounded-xl hover:border-[#adc8f5] transition-colors flex flex-col gap-2.5 shadow-xs"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs bg-[#022448] text-white px-2.5 py-0.5 rounded">
                          {co.code}
                        </span>
                        <input
                          type="text"
                          value={co.shortTitle}
                          disabled={!permissions.canEditSpecification}
                          onChange={(e) => {
                            const updated = [...course.outcomes];
                            updated[idx] = { ...co, shortTitle: e.target.value };
                            handleUpdate('outcomes', updated);
                          }}
                          className="font-bold text-xs text-[#022448] bg-transparent border-b border-transparent hover:border-[#dee9fc] focus:border-[#006b5d] focus:outline-none"
                        />
                        <select
                          value={co.bloomsLevel}
                          disabled={!permissions.canEditSpecification}
                          onChange={(e) => {
                            const updated = [...course.outcomes];
                            const lvl = e.target.value as BloomsTaxonomy;
                            const tagMap: Record<BloomsTaxonomy, string> = {
                              Remember: 'L1-Remember',
                              Understand: 'L2-Understand',
                              Apply: 'L3-Apply',
                              Analyze: 'L4-Analyze',
                              Evaluate: 'L5-Evaluate',
                              Create: 'L6-Create',
                            };
                            updated[idx] = { ...co, bloomsLevel: lvl, bloomsTag: tagMap[lvl] };
                            handleUpdate('outcomes', updated);
                          }}
                          className="text-xs font-semibold px-2 py-0.5 rounded bg-[#E6F7F5] border border-[#80f3dd] text-[#006b5d] focus:outline-none"
                        >
                          <option value="Remember">Bloom L1: Remember</option>
                          <option value="Understand">Bloom L2: Understand</option>
                          <option value="Apply">Bloom L3: Apply</option>
                          <option value="Analyze">Bloom L4: Analyze</option>
                          <option value="Evaluate">Bloom L5: Evaluate</option>
                          <option value="Create">Bloom L6: Create</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-xs">
                          <span className="text-[#43474e]">Weight:</span>
                          <input
                            type="number"
                            value={co.targetWeight}
                            disabled={!permissions.canEditSpecification}
                            onChange={(e) => {
                              const updated = [...course.outcomes];
                              updated[idx] = { ...co, targetWeight: parseInt(e.target.value) || 0 };
                              handleUpdate('outcomes', updated);
                            }}
                            className="w-12 h-6 text-right font-mono font-bold border border-[#dee9fc] rounded px-1 text-xs"
                          />
                          <span className="text-[#43474e] font-bold">%</span>
                        </div>
                        {permissions.canEditSpecification && (
                          <button
                            type="button"
                            onClick={() => handleRemoveCO(co.id)}
                            className="text-[#74777f] hover:text-[#ba1a1a] transition-colors p-1"
                            title="Delete Outcome"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <div>
                      <textarea
                        rows={2}
                        value={co.description}
                        disabled={!permissions.canEditSpecification}
                        onChange={(e) => {
                          const updated = [...course.outcomes];
                          updated[idx] = { ...co, description: e.target.value };
                          handleUpdate('outcomes', updated);
                        }}
                        className="w-full p-2.5 text-xs bg-white border border-[#dee9fc] rounded-lg text-[#121c2a] focus:ring-2 focus:ring-[#006b5d] focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-[#43474e] font-semibold">Direct Assessment Tool:</span>
                      <input
                        type="text"
                        value={co.assessmentMethod}
                        disabled={!permissions.canEditSpecification}
                        onChange={(e) => {
                          const updated = [...course.outcomes];
                          updated[idx] = { ...co, assessmentMethod: e.target.value };
                          handleUpdate('outcomes', updated);
                        }}
                        className="flex-1 h-7 px-2 bg-[#eff4ff] border border-[#dee9fc] rounded text-xs text-[#022448] font-medium"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* SECTION D: Modular Syllabus & Laboratory Units */}
          {activeSection === 'D' && (
            <section className="bg-white p-6 rounded-xl shadow-xs flex flex-col gap-5 border border-[#dee9fc] animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-[#dee9fc] pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-[#e6eeff] text-[#022448] font-bold text-sm flex items-center justify-center">
                    D
                  </span>
                  <div>
                    <h2 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#022448]">
                      Modular Syllabus &amp; Laboratory Units
                    </h2>
                    <p className="text-[11px] text-[#43474e]">
                      Chronological progression of 5 core units across 14 semester weeks with laboratory practicals.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {course.units.map((unit, idx) => (
                  <div
                    key={unit.id}
                    className="p-4 bg-white border border-[#dee9fc] rounded-xl flex flex-col gap-3 shadow-xs"
                  >
                    <div className="flex items-center justify-between border-b border-[#eff4ff] pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 bg-[#eff4ff] text-[#022448] rounded border border-[#dee9fc]">
                          Unit {unit.unitNumber}
                        </span>
                        <input
                          type="text"
                          value={unit.title}
                          disabled={!permissions.canEditSpecification}
                          onChange={(e) => {
                            const updated = [...course.units];
                            updated[idx] = { ...unit, title: e.target.value };
                            handleUpdate('units', updated);
                          }}
                          className="font-bold text-xs text-[#022448] bg-transparent border-b border-transparent focus:border-[#006b5d] focus:outline-none w-72 md:w-96"
                        />
                      </div>
                      <span className="text-xs font-mono font-semibold text-[#43474e]">
                        {unit.lectureHours}h Lec / {unit.labHours}h Lab
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#43474e] uppercase tracking-wider mb-1">
                        Syllabus Lecture Topics
                      </label>
                      <input
                        type="text"
                        value={unit.topics.join('; ')}
                        disabled={!permissions.canEditSpecification}
                        onChange={(e) => {
                          const updated = [...course.units];
                          updated[idx] = {
                            ...unit,
                            topics: e.target.value.split(';').map((s) => s.trim()).filter(Boolean),
                          };
                          handleUpdate('units', updated);
                        }}
                        className="w-full h-8 px-2.5 text-xs bg-white border border-[#dee9fc] rounded-lg text-[#121c2a]"
                      />
                    </div>

                    {unit.labExperiments && (
                      <div>
                        <label className="block text-[11px] font-semibold text-[#43474e] uppercase tracking-wider mb-1">
                          Laboratory Practical Experiments
                        </label>
                        <input
                          type="text"
                          value={unit.labExperiments.join('; ')}
                          disabled={!permissions.canEditSpecification}
                          onChange={(e) => {
                            const updated = [...course.units];
                            updated[idx] = {
                              ...unit,
                              labExperiments: e.target.value.split(';').map((s) => s.trim()).filter(Boolean),
                            };
                            handleUpdate('units', updated);
                          }}
                          className="w-full h-8 px-2.5 text-xs bg-[#eff4ff] border border-[#dee9fc] rounded-lg text-[#022448]"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* SECTION E: Assessment Scheme */}
          {activeSection === 'E' && (
            <section className="bg-white p-6 rounded-xl shadow-xs flex flex-col gap-5 border border-[#dee9fc] animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-[#dee9fc] pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-[#e6eeff] text-[#022448] font-bold text-sm flex items-center justify-center">
                    E
                  </span>
                  <div>
                    <h2 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#022448]">
                      Course Assessment &amp; Grading Rubric
                    </h2>
                    <p className="text-[11px] text-[#43474e]">
                      Cumulative total must equal exactly 100%. Mandatory threshold gates enforce learning mastery.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border border-[#dee9fc] rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#eff4ff] text-[#43474e] font-semibold uppercase text-[11px] border-b border-[#dee9fc]">
                    <tr>
                      <th className="p-3">Component</th>
                      <th className="p-3 text-right">Weight (%)</th>
                      <th className="p-3">Mapped Outcomes</th>
                      <th className="p-3 text-center">Mandatory Pass</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#dee9fc]">
                    {course.assessmentScheme.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-[#eff4ff]/30">
                        <td className="p-3 font-semibold text-[#121c2a]">
                          {item.component}
                          <div className="text-[11px] text-[#43474e] font-normal">{item.description}</div>
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-[#022448]">
                          {item.percentage}%
                        </td>
                        <td className="p-3 font-mono text-xs text-[#006b5d]">
                          {item.coMappings.join(', ')}
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              item.isMandatoryToPass
                                ? 'bg-[#DCFCE7] text-[#15803D]'
                                : 'bg-[#e6eeff] text-[#43474e]'
                            }`}
                          >
                            {item.isMandatoryToPass ? 'Yes' : 'No'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-[#eff4ff] font-bold border-t border-[#dee9fc] text-xs">
                      <td className="p-3 text-[#43474e] uppercase">Total Assessment Sum</td>
                      <td className={`p-3 text-right font-mono ${totalAssessmentPercentage === 100 ? 'text-[#15803D]' : 'text-[#ba1a1a]'}`}>
                        {totalAssessmentPercentage}%
                      </td>
                      <td colSpan={2} className="p-3 text-right text-[#15803D]">
                        ✓ Compliant with university 100% threshold
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </section>
          )}

          {/* SECTION F: Textbooks & Prescribed Literature */}
          {activeSection === 'F' && (
            <section className="bg-white p-6 rounded-xl shadow-xs flex flex-col gap-5 border border-[#dee9fc] animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-[#dee9fc] pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-[#e6eeff] text-[#022448] font-bold text-sm flex items-center justify-center">
                    F
                  </span>
                  <div>
                    <h2 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#022448]">
                      Prescribed Textbooks &amp; Reference Literature
                    </h2>
                    <p className="text-[11px] text-[#43474e]">
                      Required textbook editions and library catalog holdings for Tier-1 peer inspection.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {course.textbooks.map((tb) => (
                  <div
                    key={tb.id}
                    className="p-4 bg-white border border-[#dee9fc] rounded-xl flex flex-col gap-1.5 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          tb.type === 'textbook'
                            ? 'bg-[#022448] text-white'
                            : 'bg-[#e6eeff] text-[#022448] border border-[#dee9fc]'
                        }`}
                      >
                        {tb.type}
                      </span>
                      {tb.isOutdated && (
                        <span className="px-2 py-0.5 bg-[#FFF5DF] text-[#855300] text-[10px] font-bold rounded flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">warning</span>
                          <span>Edition &gt; 10 Years Old</span>
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-[#121c2a]">{tb.title}</h3>
                    <div className="text-xs text-[#43474e]">
                      Authors: <span className="text-[#121c2a] font-medium">{tb.authors}</span> • {tb.publisher} ({tb.year})
                    </div>
                    <div className="text-xs font-mono text-[#43474e] flex items-center gap-4">
                      <span>ISBN: {tb.isbn}</span>
                      {tb.libraryAccessUrl && (
                        <a
                          href={tb.libraryAccessUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#006b5d] hover:underline flex items-center gap-1"
                        >
                          <span>Library Holding Link</span>
                          <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Side Rail (4 cols): Specification Validation Rail & Quick Audit Actions */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          <div className="bg-white rounded-xl p-5 shadow-xs flex flex-col gap-4 border border-[#dee9fc]">
            <div className="flex items-center justify-between border-b border-[#dee9fc] pb-2.5">
              <h2 className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#022448] uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#006b5d] text-[18px]">verified</span>
                <span>Specification Health Inspector</span>
              </h2>
              <span className="text-[10px] font-mono bg-[#80f3dd] text-[#006f61] px-1.5 py-0.5 rounded font-bold">
                NBA Tier-1
              </span>
            </div>

            {/* Metric 1: Hours */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#43474e] font-medium">Contact Hours Ratio</span>
                <span className="font-mono font-bold text-[#15803D]">
                  {totalContactHours} / 70 Hrs (100%)
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#dee9fc] rounded-full overflow-hidden">
                <div className="h-full bg-[#15803D]" style={{ width: '100%' }} />
              </div>
            </div>

            {/* Metric 2: Bloom's Spectrum */}
            <div className="flex flex-col gap-1.5 pt-2 border-t border-[#dee9fc]">
              <span className="text-[11px] font-bold text-[#43474e] uppercase tracking-wider">
                Bloom's Cognitive Distribution
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {(['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'] as BloomsTaxonomy[]).map(
                  (level) => (
                    <div
                      key={level}
                      className="flex items-center justify-between px-2 py-1 bg-[#eff4ff] rounded border border-[#dee9fc]"
                    >
                      <span className="text-[#121c2a] text-[11px]">{level}</span>
                      <span className="font-mono font-bold text-[#022448]">
                        {bloomsCounts[level] || 0}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Rule Checklist */}
            <div className="flex flex-col gap-2 pt-2 border-t border-[#dee9fc]">
              <span className="text-[11px] font-bold text-[#43474e] uppercase tracking-wider">
                Autonomous Pre-Checks
              </span>
              <ul className="text-xs flex flex-col gap-1.5">
                <li className="flex items-center gap-1.5 text-[#121c2a]">
                  <span className="material-symbols-outlined text-[16px] text-[#15803D]">check_circle</span>
                  <span>Prerequisite chain valid (CS101, MA201)</span>
                </li>
                <li className="flex items-center gap-1.5 text-[#121c2a]">
                  <span className="material-symbols-outlined text-[16px] text-[#15803D]">check_circle</span>
                  <span>14 lab practical sessions defined</span>
                </li>
                <li className="flex items-center gap-1.5 text-[#121c2a]">
                  <span className="material-symbols-outlined text-[16px] text-[#B76E00]">warning</span>
                  <span>1 reference edition outdated (&gt;10 years)</span>
                </li>
              </ul>
            </div>

            {/* Quick AI Action */}
            <div className="pt-2 border-t border-[#dee9fc]">
              <button
                type="button"
                onClick={() => onOpenAIAssistantWithPrompt('Analyze Bloom levels and suggest modern textbooks for CS301')}
                className="w-full py-2 px-3 bg-[#E6F7F5] hover:bg-[#c5efea] text-[#006b5d] border border-[#80f3dd] rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">psychology</span>
                <span>Audit with Curriculum AI</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
