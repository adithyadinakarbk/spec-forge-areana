import React, { useState } from 'react';
import { CourseSpecification, UserRole, PipelinePage, WorkflowComment, WorkflowStage } from '../types';
import { getPermissionsForRole } from '../api';

interface Page5ApprovalWorkflowProps {
  course: CourseSpecification;
  onUpdateCourse: (updated: CourseSpecification) => void;
  currentRole: UserRole;
  onNavigate: (page: PipelinePage) => void;
  showNotification: (msg: string) => void;
}

export const Page5ApprovalWorkflow: React.FC<Page5ApprovalWorkflowProps> = ({
  course,
  onUpdateCourse,
  currentRole,
  onNavigate,
  showNotification,
}) => {
  const permissions = getPermissionsForRole(currentRole);
  const [newComment, setNewComment] = useState('');
  const [isActionItem, setIsActionItem] = useState(false);

  const handleStageTransition = (nextStage: WorkflowStage, stageLabel: string) => {
    onUpdateCourse({
      ...course,
      stage: nextStage,
    });
    showNotification(`Workflow stage transitioned: ${stageLabel}`);
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const authorNames: Record<string, string> = {
      author: 'Dr. Aris Vance (Author)',
      reviewer: 'Prof. Elena Rostova (DRC Reviewer)',
      hod: 'Prof. Marcus Chen (HOD)',
      admin: 'System Administrator',
    };

    const authorRoleMap: Record<string, string> = {
      author: 'Course Author',
      reviewer: 'Review Committee Lead',
      hod: 'Head of Department',
      admin: 'Administrator',
    };

    const newEntry: WorkflowComment = {
      id: `com-${Date.now()}`,
      authorName: authorNames[currentRole] || 'Dr. Aris Vance',
      authorRole: authorRoleMap[currentRole] || 'Faculty Member',
      avatarInitials: currentRole === 'hod' ? 'MC' : currentRole === 'reviewer' ? 'ER' : 'AV',
      timestamp: 'Just now',
      text: newComment.trim(),
      stageTag: course.stage.replace('_', ' ').toUpperCase(),
      isActionItem,
      isResolved: false,
    };

    onUpdateCourse({
      ...course,
      workflowComments: [...course.workflowComments, newEntry],
    });

    setNewComment('');
    setIsActionItem(false);
    showNotification('Comment posted to governance audit thread.');
  };

  const handleToggleResolve = (commentId: string) => {
    const updated = course.workflowComments.map((c) =>
      c.id === commentId ? { ...c, isResolved: !c.isResolved } : c
    );
    onUpdateCourse({ ...course, workflowComments: updated });
    showNotification('Action item resolution toggled.');
  };

  return (
    <div className="w-full px-4 lg:px-8 py-6 flex flex-col gap-6 max-w-[1560px] mx-auto animate-in fade-in duration-150">
      {/* Top Context Breadcrumb & Stage Quick Info */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2">
        <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-[#43474e] text-xs">
          <button type="button" onClick={() => onNavigate('upload')} className="hover:text-[#022448]">Home</button>
          <span>/</span>
          <button type="button" onClick={() => onNavigate('spec')} className="hover:text-[#022448]">Specifications</button>
          <span>/</span>
          <span className="font-semibold text-[#022448]">{course.code}</span>
          <span>/</span>
          <span className="font-bold text-[#022448] bg-[#dee9fc] px-2 py-0.5 rounded">5. Approval Workflow</span>
        </nav>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#dee9fc] text-[#022448] text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#006b5d]"></span>
            NBA Tier-1 Criteria 2.1
          </span>
          <span className="px-2.5 py-1 rounded bg-[#e6eeff] text-[#43474e] font-mono text-xs">
            {course.version}
          </span>
        </div>
      </div>

      {/* Title & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="max-w-3xl">
          <h1 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#022448] tracking-tight">
            Course Specification Approval Workflow
          </h1>
          <p className="text-xs text-[#43474e] mt-1 leading-relaxed">
            Multi-tier governance tracking review and sign-off stages across Course Author, Department Review Committee, and Head of Department (HOD).
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => showNotification('Audit trail log displayed.')}
            className="inline-flex items-center gap-1.5 px-3.5 h-9 rounded bg-[#eff4ff] text-[#022448] hover:bg-[#e6eeff] text-xs font-semibold transition-colors shadow-xs border border-[#dee9fc]"
          >
            <span className="material-symbols-outlined text-[18px]">history</span>
            <span>View Audit Trail</span>
          </button>
          <button
            type="button"
            onClick={() => showNotification('Reviewer invitation prompt opened.')}
            className="inline-flex items-center gap-1.5 px-4 h-9 rounded bg-[#022448] text-white hover:bg-[#1e3a5f] text-xs font-semibold transition-colors shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>Add Reviewer</span>
          </button>
        </div>
      </div>

      {/* 4 Pastel Summary Flashcards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Lifecycle */}
        <div className="bg-[#EAF2FF] p-4 rounded-xl flex items-start gap-3.5 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-[#022448] shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[22px]">account_tree</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] text-[#43474e] uppercase tracking-wider font-bold">Current Lifecycle</span>
            <span className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#022448] mt-1">Stage 2 of 4</span>
            <span className="text-xs text-[#43474e] mt-0.5 capitalize">{course.stage.replace('_', ' ')}</span>
          </div>
        </div>

        {/* Card 2: Workflow Status */}
        <div className="bg-[#FFF5DF] p-4 rounded-xl flex items-start gap-3.5 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-[#92400e] shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[22px]">schedule</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] text-[#855300] uppercase tracking-wider font-bold">Workflow Status</span>
            <span className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#92400e] mt-1 capitalize">
              {course.stage.replace('_', ' ')}
            </span>
            <span className="text-xs text-[#855300] mt-0.5">Assigned 2 Days Ago</span>
          </div>
        </div>

        {/* Card 3: Feedback */}
        <div className="bg-[#F1ECFF] p-4 rounded-xl flex items-start gap-3.5 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-[#342468] shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[22px]">chat_bubble_outline</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] text-[#342468] uppercase tracking-wider font-bold">Faculty Feedback</span>
            <span className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#261758] mt-1">
              {course.workflowComments.length} Comments
            </span>
            <span className="text-xs text-[#342468] mt-0.5">1 Action Item Active</span>
          </div>
        </div>

        {/* Card 4: Endorsement */}
        <div className="bg-[#EAF8EF] p-4 rounded-xl flex items-start gap-3.5 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-[#15803D] shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[22px]">verified_user</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] text-[#15803D] uppercase tracking-wider font-bold">Primary Endorsement</span>
            <span className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#084b23] mt-1">
              Author Signed
            </span>
            <span className="text-xs text-[#15803D] mt-0.5">Dr. Aris Vance (Oct 14)</span>
          </div>
        </div>
      </div>

      {/* Horizontal Stepper Timeline */}
      <div className="bg-white p-5 rounded-xl shadow-xs border border-[#dee9fc] flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-[#eff4ff] pb-3">
          <div className="flex items-center gap-2">
            <span className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#022448]">
              Accreditation Sign-off Trajectory
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-[#eff4ff] text-[#43474e]">
              Autonomous College Reg {course.academicYear}
            </span>
          </div>
          <span className="text-xs text-[#43474e]">SLA Target: 5 Business Days</span>
        </div>

        {/* Stepper Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Step 1: Author */}
          <div className="p-3.5 rounded-lg bg-[#eff4ff] flex flex-col gap-1 border border-[#dee9fc]">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-[#006b5d] text-white flex items-center justify-center text-xs font-bold">
                ✓
              </span>
              <span className="text-[11px] text-[#006b5d] font-bold">Completed</span>
            </div>
            <span className="font-bold text-xs text-[#022448] mt-1">1. Author Submission</span>
            <span className="text-xs text-[#121c2a]">Dr. Aris Vance</span>
            <span className="font-mono text-[10px] text-[#43474e]">Oct 14, 2024 · 14:32</span>
          </div>

          {/* Step 2: DRC */}
          <div
            className={`p-3.5 rounded-lg flex flex-col gap-1 border transition-all ${
              course.stage === 'in_review'
                ? 'bg-[#EAF2FF] border-[#006b5d] ring-1 ring-[#006b5d]'
                : 'bg-[#eff4ff] border-[#dee9fc]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-[#022448] text-white flex items-center justify-center text-xs font-bold">
                2
              </span>
              <span className="text-[11px] text-[#022448] font-bold">
                {course.stage === 'in_review' ? 'In Progress' : 'Endorsed'}
              </span>
            </div>
            <span className="font-bold text-xs text-[#022448] mt-1">2. Dept Review Committee</span>
            <span className="text-xs text-[#121c2a]">Prof. Elena Rostova</span>
            <span className="font-mono text-[10px] text-[#43474e]">Review Active</span>
          </div>

          {/* Step 3: HOD */}
          <div
            className={`p-3.5 rounded-lg flex flex-col gap-1 border transition-all ${
              course.stage === 'pending_hod'
                ? 'bg-[#EAF2FF] border-[#006b5d] ring-1 ring-[#006b5d]'
                : course.stage === 'approved'
                ? 'bg-[#EAF8EF] border-[#16a34a]'
                : 'bg-white border-[#dee9fc] opacity-80'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center text-xs font-bold">
                {course.stage === 'approved' ? '✓' : '3'}
              </span>
              <span className="text-[11px] text-[#43474e] font-bold">
                {course.stage === 'approved' ? 'Signed' : 'Pending'}
              </span>
            </div>
            <span className="font-bold text-xs text-[#022448] mt-1">3. HOD Formal Approval</span>
            <span className="text-xs text-[#121c2a]">Prof. Marcus Chen</span>
            <span className="font-mono text-[10px] text-[#43474e]">Head of Department</span>
          </div>

          {/* Step 4: BOS */}
          <div
            className={`p-3.5 rounded-lg flex flex-col gap-1 border transition-all ${
              course.stage === 'approved' ? 'bg-[#EAF8EF] border-[#16a34a]' : 'bg-white border-[#dee9fc] opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-800 flex items-center justify-center text-xs font-bold">
                {course.stage === 'approved' ? '✓' : '4'}
              </span>
              <span className="text-[11px] text-[#43474e] font-bold">
                {course.stage === 'approved' ? 'Accredited' : 'Queue'}
              </span>
            </div>
            <span className="font-bold text-xs text-[#022448] mt-1">4. BOS Ratification</span>
            <span className="text-xs text-[#121c2a]">Academic Council</span>
            <span className="font-mono text-[10px] text-[#43474e]">Curriculum Published</span>
          </div>
        </div>
      </div>

      {/* Decision Panel & Governance Discussion Thread */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Comments Thread & Add Review Note (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Discussion Thread Card */}
          <div className="bg-white p-5 rounded-xl shadow-xs border border-[#dee9fc] flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#eff4ff] pb-3">
              <h2 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#022448] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006b5d] text-[20px]">forum</span>
                <span>Governance Review Committee Discussion</span>
              </h2>
              <span className="text-xs text-[#43474e]">
                {course.workflowComments.length} Records in Thread
              </span>
            </div>

            {/* Comments List */}
            <div className="flex flex-col gap-3">
              {course.workflowComments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-4 bg-[#eff4ff]/50 rounded-xl border border-[#dee9fc] flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#022448] text-white text-xs font-bold flex items-center justify-center">
                        {comment.avatarInitials}
                      </div>
                      <div>
                        <span className="font-bold text-xs text-[#022448]">{comment.authorName}</span>
                        <span className="text-[11px] text-[#43474e] ml-2">({comment.authorRole})</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-[#dee9fc] text-[#022448] font-mono text-[10px] font-bold">
                        {comment.stageTag}
                      </span>
                      <span className="text-[11px] text-[#43474e] font-mono">{comment.timestamp}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#121c2a] leading-relaxed pl-9">
                    {comment.text}
                  </p>

                  {comment.isActionItem && (
                    <div className="ml-9 mt-1 flex items-center justify-between bg-white p-2 rounded border border-[#dee9fc]">
                      <span className="text-xs text-[#92400e] font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">task_alt</span>
                        Action Item Required before final sign-off
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleResolve(comment.id)}
                        className={`px-2 py-1 rounded text-xs font-bold transition-colors ${
                          comment.isResolved
                            ? 'bg-[#DCFCE7] text-[#15803D]'
                            : 'bg-[#FFF5DF] text-[#855300] hover:bg-[#ffecc0]'
                        }`}
                      >
                        {comment.isResolved ? '✓ Resolved' : 'Mark as Addressed'}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handlePostComment} className="flex flex-col gap-2.5 pt-3 border-t border-[#eff4ff]">
              <label className="text-xs font-bold text-[#022448] uppercase tracking-wider">
                Post Committee Observation or Action Item
              </label>
              <textarea
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Enter formal academic review note, reference critique, or endorsement remarks..."
                className="w-full p-2.5 text-xs bg-white border border-[#dee9fc] rounded-lg text-[#121c2a] focus:ring-2 focus:ring-[#006b5d] focus:outline-none"
              />
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-[#43474e] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActionItem}
                    onChange={(e) => setIsActionItem(e.target.checked)}
                    className="accent-[#006b5d]"
                  />
                  <span>Flag as Mandatory Action Item</span>
                </label>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#022448] hover:bg-[#1e3a5f] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                >
                  Post Comment
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right: Decision Triggers & Signatories (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {/* Active Decision Panel based on Current Role */}
          <div className="bg-white p-5 rounded-xl shadow-xs border border-[#dee9fc] flex flex-col gap-4">
            <h3 className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#022448] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#dee9fc] pb-2">
              <span className="material-symbols-outlined text-[#006b5d] text-[18px]">verified</span>
              <span>Governance Action Triggers</span>
            </h3>

            <div className="text-xs text-[#43474e]">
              Active Role: <strong className="text-[#022448] uppercase font-mono">{currentRole}</strong>
            </div>

            {/* Reviewer Actions */}
            {permissions.canApproveReviewer && (
              <div className="flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => handleStageTransition('pending_hod', 'Department Review Committee Endorsed')}
                  className="w-full py-2 px-3 bg-[#006b5d] hover:bg-[#005046] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  <span>Endorse &amp; Forward to HOD</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleStageTransition('changes_requested', 'Changes Requested by DRC')}
                  className="w-full py-2 px-3 bg-[#FFF5DF] text-[#855300] hover:bg-[#ffecc0] text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors border border-[#855300]/20"
                >
                  <span className="material-symbols-outlined text-[16px]">replay</span>
                  <span>Request Author Modifications</span>
                </button>
              </div>
            )}

            {/* HOD Actions */}
            {permissions.canSignOffHOD && (
              <div className="flex flex-col gap-2.5 pt-2 border-t border-[#eff4ff]">
                <button
                  type="button"
                  onClick={() => handleStageTransition('approved', 'HOD Final Approval Granted')}
                  className="w-full py-2.5 px-3 bg-[#15803D] hover:bg-[#0e6231] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">approval</span>
                  <span>Grant Final HOD Sign-off &amp; Seal</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleStageTransition('changes_requested', 'Returned by HOD')}
                  className="w-full py-2 px-3 bg-white text-[#ba1a1a] border border-[#ba1a1a] hover:bg-[#FFF0F0] text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Return to Committee</span>
                </button>
              </div>
            )}

            {/* Author Action */}
            {permissions.canEditSpecification && course.stage === 'changes_requested' && (
              <button
                type="button"
                onClick={() => handleStageTransition('in_review', 'Resubmitted for Review')}
                className="w-full py-2 px-3 bg-[#022448] hover:bg-[#1e3a5f] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Resubmit Revised Specification</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onNavigate('export')}
              className="mt-2 w-full py-2 bg-[#eff4ff] hover:bg-[#dee9fc] text-[#022448] text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors border border-[#dee9fc]"
            >
              <span>Proceed to 6. Export &amp; Publish</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          {/* Committee Roster */}
          <div className="bg-white p-5 rounded-xl shadow-xs border border-[#dee9fc] flex flex-col gap-3">
            <h3 className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#022448] uppercase tracking-wider border-b border-[#dee9fc] pb-2">
              Signatory Roster
            </h3>
            <div className="flex flex-col gap-2.5 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#121c2a] block">Dr. Aris Vance</span>
                  <span className="text-[11px] text-[#43474e]">Course Lead Author</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#DCFCE7] text-[#15803D] font-bold text-[10px]">
                  Signed
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#121c2a] block">Prof. Elena Rostova</span>
                  <span className="text-[11px] text-[#43474e]">DRC Review Committee</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#EAF2FF] text-[#022448] font-bold text-[10px]">
                  Reviewing
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#121c2a] block">Prof. Marcus Chen</span>
                  <span className="text-[11px] text-[#43474e]">HOD Computer Science</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#eff4ff] text-[#43474e] font-bold text-[10px]">
                  Pending
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
