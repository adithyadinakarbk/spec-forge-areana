import React, { useState, useRef } from 'react';
import { CourseSpecification, UserRole, PipelinePage, UploadedArtifact } from '../types';
import { getPermissionsForRole } from '../api';

interface Page1UploadIngestProps {
  course: CourseSpecification;
  onUpdateCourse: (updated: CourseSpecification) => void;
  currentRole: UserRole;
  onNavigate: (page: PipelinePage) => void;
  showNotification: (msg: string) => void;
}

export const Page1UploadIngest: React.FC<Page1UploadIngestProps> = ({
  course,
  onUpdateCourse,
  currentRole,
  onNavigate,
  showNotification,
}) => {
  const permissions = getPermissionsForRole(currentRole);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSimulatingIngest, setIsSimulatingIngest] = useState(false);
  const [ingestProgress, setIngestProgress] = useState(92);

  const handleFileUpload = (fileName: string, fileSize: string) => {
    if (!permissions.canUploadSyllabus) {
      showNotification('Permission restricted: Only Authors and Administrators can upload new syllabus artifacts.');
      return;
    }

    setIsSimulatingIngest(true);
    setIngestProgress(25);

    const interval = setInterval(() => {
      setIngestProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSimulatingIngest(false);

          const newArtifact: UploadedArtifact = {
            id: `art-${Date.now()}`,
            name: fileName,
            size: fileSize,
            type: fileName.endsWith('.pdf') ? 'PDF / A-1a' : 'DOCX OpenXML',
            uploadedBy: currentRole === 'author' ? 'Dr. Aris Vance' : 'Faculty Contributor',
            uploadedRole: currentRole,
            date: 'Just now',
            version: `v${(course.uploadedArtifacts.length + 1).toFixed(1)}`,
            status: 'verified',
            tag: 'Parsed Course Outline',
          };

          onUpdateCourse({
            ...course,
            uploadedArtifacts: [newArtifact, ...course.uploadedArtifacts],
          });

          showNotification(`File ingested & verified: ${fileName}`);
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const sizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
      handleFileUpload(file.name, sizeStr);
    }
  };

  const handleApplyPreset = (preset: 'obe_2024' | 'abet_cac' | 'cbcs_elective') => {
    onUpdateCourse({
      ...course,
      activePreset: preset,
    });
    showNotification(`Active blueprint switched to: ${preset.toUpperCase()}`);
  };

  return (
    <div className="w-full px-4 lg:px-8 py-6 flex flex-col gap-6 max-w-[1560px] mx-auto animate-in fade-in duration-150">
      {/* Role and Workflow Banner */}
      <div className="w-full rounded-xl bg-white border border-[#dee9fc] p-4 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#E6F7F5] text-[#006b5d] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
          </div>
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[#022448]">Simulated Role:</span>
              <span className="px-2 py-0.5 rounded bg-[#d5e3ff] text-[#022448] font-mono text-[11px] font-bold uppercase">
                {currentRole} Mode
              </span>
              <span className="text-xs text-[#43474e]">
                • {permissions.canUploadSyllabus ? 'Full Draft, Edit & Ingest Permissions' : 'Inspection & Review Mode (Read-Only)'}
              </span>
            </div>
            <span className="text-xs text-[#43474e] mt-1">
              Reviewer mode unlocks rubric appraisal; HOD mode enables final accreditation sign-off &amp; curriculum lock.
            </span>
          </div>
        </div>

        {/* Workflow Lifecycle Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#dee9fc]">
          <span className="text-xs uppercase tracking-wider text-[#43474e] font-bold">Lifecycle:</span>
          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="px-2 py-0.5 rounded bg-[#e6eeff] text-[#43474e] font-medium">1. Draft</span>
            <span className="material-symbols-outlined text-[12px] text-[#c4c6cf]">arrow_forward</span>
            <span className="px-2 py-0.5 rounded bg-[#DCFCE7] text-[#15803D] font-bold ring-1 ring-[#15803D]/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]"></span>
              2. In Review
            </span>
            <span className="material-symbols-outlined text-[12px] text-[#c4c6cf]">arrow_forward</span>
            <span className="px-2 py-0.5 rounded bg-[#FFF4E5] text-[#B76E00] font-medium opacity-80">3. Changes Requested</span>
            <span className="material-symbols-outlined text-[12px] text-[#c4c6cf]">arrow_forward</span>
            <span className="px-2 py-0.5 rounded bg-[#F1ECFF] text-[#342468] font-medium opacity-80">4. Pending HOD</span>
            <span className="material-symbols-outlined text-[12px] text-[#c4c6cf]">arrow_forward</span>
            <span className="px-2 py-0.5 rounded bg-[#80f3dd] text-[#006f61] font-medium opacity-80">5. Approved</span>
          </div>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
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
        <span className="font-semibold text-[#121c2a]">{course.code}</span>
        <span className="text-[#c4c6cf] font-bold">/</span>
        <span className="text-[#022448] font-bold bg-[#dee9fc] px-2 py-0.5 rounded">
          1. Upload &amp; Ingest
        </span>
      </nav>

      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-1">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1e3a5f] text-white text-xs font-bold">
              1
            </span>
            <h1 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#022448] tracking-tight">
              Upload &amp; Syllabus Ingest
            </h1>
          </div>
          <p className="text-xs text-[#43474e] max-w-3xl leading-relaxed">
            Upload existing syllabi, previous term course outlines, or start from accredited department blueprints for automated Bloom’s taxonomy extraction.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={() => showNotification('Viewing Ingest Log: 3 files processed with 0 fatal parser exceptions.')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white text-[#022448] border border-[#dee9fc] text-xs font-semibold shadow-xs hover:bg-[#eff4ff] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">history</span>
            <span>Ingest Log</span>
          </button>
          <button
            type="button"
            onClick={() => showNotification('Schema Guide: Adhering to UGC / AICTE Outcome-Based Education Framework.')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white text-[#022448] border border-[#dee9fc] text-xs font-semibold shadow-xs hover:bg-[#eff4ff] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">help_outline</span>
            <span>Schema Guide</span>
          </button>
        </div>
      </header>

      {/* 4 Pastel Summary Flashcards */}
      <section aria-label="Ingestion Statistics" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Soft Blue */}
        <div className="p-4 rounded-xl bg-[#EAF2FF] flex flex-col justify-between shadow-xs relative overflow-hidden transition-transform hover:-translate-y-0.5">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider text-[#022448] font-bold">
                Uploaded Artifacts
              </span>
              <span className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#022448] mt-1 leading-none">
                {course.uploadedArtifacts.length} Files
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-[#022448] shadow-xs">
              <span className="material-symbols-outlined text-[22px]">upload_file</span>
            </div>
          </div>
          <div className="mt-4 pt-2 border-t border-[#022448]/10 flex items-center justify-between text-[#022448] text-xs opacity-90">
            <span>PDF, DOCX, XLSX</span>
            <span className="font-mono font-semibold">24.2 MB total</span>
          </div>
        </div>

        {/* Card 2: Soft Teal */}
        <div className="p-4 rounded-xl bg-[#E6F7F5] flex flex-col justify-between shadow-xs relative overflow-hidden transition-transform hover:-translate-y-0.5">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider text-[#006f61] font-bold">
                AI Parsing Accuracy
              </span>
              <span className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#004d43] mt-1 leading-none">
                99.4%
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-[#006b5d] shadow-xs">
              <span className="material-symbols-outlined text-[22px]">psychology</span>
            </div>
          </div>
          <div className="mt-4 pt-2 border-t border-[#006f61]/10 flex items-center justify-between text-[#004d43] text-xs opacity-90">
            <span>AST Schema Extraction</span>
            <span className="font-mono font-semibold">&lt; 1.2s latency</span>
          </div>
        </div>

        {/* Card 3: Soft Purple */}
        <div className="p-4 rounded-xl bg-[#F1ECFF] flex flex-col justify-between shadow-xs relative overflow-hidden transition-transform hover:-translate-y-0.5">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider text-[#342468] font-bold">
                Accredited Blueprints
              </span>
              <span className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#261758] mt-1 leading-none">
                3 Outlines
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-[#3e2c7a] shadow-xs">
              <span className="material-symbols-outlined text-[22px]">layers</span>
            </div>
          </div>
          <div className="mt-4 pt-2 border-t border-[#342468]/10 flex items-center justify-between text-[#261758] text-xs opacity-90">
            <span>NBA &amp; ABET Ready</span>
            <span className="font-mono font-semibold">Tier-1 Curricula</span>
          </div>
        </div>

        {/* Card 4: Soft Green */}
        <div className="p-4 rounded-xl bg-[#EAF8EF] flex flex-col justify-between shadow-xs relative overflow-hidden transition-transform hover:-translate-y-0.5">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider text-[#0e6231] font-bold">
                Institutional Schema
              </span>
              <span className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#084b23] mt-1 leading-none">
                Compliant
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-[#0e6231] shadow-xs">
              <span className="material-symbols-outlined text-[22px]">check_circle</span>
            </div>
          </div>
          <div className="mt-4 pt-2 border-t border-[#0e6231]/10 flex items-center justify-between text-[#084b23] text-xs opacity-90">
            <span>Autonomous Pre-Checks</span>
            <span className="font-mono font-semibold">14/14 Pass</span>
          </div>
        </div>
      </section>

      {/* Main Workspace (Two Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Upload Area + History Table (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Drag & Drop Upload Panel */}
          <div className="bg-white rounded-xl p-6 shadow-xs flex flex-col gap-4 border border-[#dee9fc]">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <h2 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#022448]">
                  Upload Document Artifact
                </h2>
                <span className="text-xs text-[#43474e]">
                  Structured engine extracts units, lecture hours, practical experiments, and outcome descriptors.
                </span>
              </div>
              <span className="px-2 py-0.5 bg-[#e6eeff] text-[#022448] text-[11px] font-bold rounded uppercase tracking-wider">
                v2.4 Engine
              </span>
            </div>

            {/* Drop Box with Dashed Border */}
            <div
              id="drop-zone"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDragging(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  const f = e.dataTransfer.files[0];
                  handleFileUpload(f.name, `${(f.size / (1024 * 1024)).toFixed(1)} MB`);
                }
              }}
              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-[#006b5d] bg-[#E6F7F5]'
                  : 'border-[#c4c6cf] hover:border-[#006b5d] bg-[#eff4ff]/60'
              }`}
            >
              <div className="w-14 h-14 rounded-full bg-[#E6F7F5] flex items-center justify-center text-[#006b5d] mb-3 shadow-xs">
                <span className="material-symbols-outlined text-[30px]">cloud_upload</span>
              </div>
              <p className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#022448] mb-1">
                Drag and drop your syllabus file here or <span className="text-[#006b5d] underline underline-offset-4 decoration-2">Browse files</span>
              </p>
              <p className="text-xs text-[#43474e] mb-4">
                Supported formats: PDF, DOCX, LaTeX, XLSX (Max 25MB)
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-[#43474e]">
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded shadow-xs border border-[#dee9fc]">
                  <span className="material-symbols-outlined text-[14px] text-[#006b5d]">check</span> Direct PDF OCR
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded shadow-xs border border-[#dee9fc]">
                  <span className="material-symbols-outlined text-[14px] text-[#006b5d]">check</span> Word Styles Parsing
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded shadow-xs border border-[#dee9fc]">
                  <span className="material-symbols-outlined text-[14px] text-[#006b5d]">check</span> LaTeX Preamble Map
                </span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.xlsx,.tex"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Quick Actions Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              <span className="text-xs font-bold text-[#43474e] uppercase tracking-wider">
                Alternative Acceleration:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleApplyPreset('obe_2024');
                    showNotification('Populated 2024 University Standard Blueprint into specification');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#dee9fc] text-[#022448] hover:bg-[#d0dbed] transition-colors text-xs font-semibold"
                >
                  <span className="material-symbols-outlined text-[16px]">account_balance</span>
                  <span>Use 2024 University Standard Blueprint</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    showNotification('Cloned syllabus parameters from Spring 2024 offering');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#dee9fc] text-[#022448] hover:bg-[#d0dbed] transition-colors text-xs font-semibold"
                >
                  <span className="material-symbols-outlined text-[16px]">content_copy</span>
                  <span>Clone Previous Term Offering</span>
                </button>
              </div>
            </div>
          </div>

          {/* Uploaded Documents & Version Archive Table */}
          <div className="bg-white rounded-xl shadow-xs overflow-hidden flex flex-col border border-[#dee9fc]">
            <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#eff4ff]/60 border-b border-[#dee9fc]">
              <div className="flex flex-col">
                <h2 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#022448]">
                  Uploaded Documents &amp; Version Archive
                </h2>
                <span className="text-xs text-[#43474e]">
                  Active parsed sources feeding into the current syllabus specification.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => showNotification('Filtered archive')}
                  className="px-2.5 py-1 rounded bg-[#e6eeff] text-[#022448] text-xs font-semibold hover:bg-[#dee9fc] transition-colors"
                >
                  Filter by Type
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const csvRows = [
                      'Document Name,Type,Uploaded By,Date,Version,Status',
                      ...course.uploadedArtifacts.map(
                        (a) => `"${a.name}","${a.type}","${a.uploadedBy}","${a.date}","${a.version}","${a.status}"`
                      ),
                    ];
                    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `${course.code}_Artifacts_Archive.csv`;
                    link.click();
                    showNotification('Artifact audit exported to CSV');
                  }}
                  className="px-2.5 py-1 rounded bg-[#e6eeff] text-[#022448] text-xs font-semibold hover:bg-[#dee9fc] transition-colors"
                >
                  Export Audit (.CSV)
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#eff4ff] text-[#43474e] font-semibold uppercase tracking-wider text-[11px] border-b border-[#dee9fc]">
                    <th className="py-2.5 px-3.5">Document Name</th>
                    <th className="py-2.5 px-3.5">File Type</th>
                    <th className="py-2.5 px-3.5">Uploaded By</th>
                    <th className="py-2.5 px-3.5">Date</th>
                    <th className="py-2.5 px-3.5">Version</th>
                    <th className="py-2.5 px-3.5">Status</th>
                    <th className="py-2.5 px-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#dee9fc]">
                  {course.uploadedArtifacts.map((artifact) => (
                    <tr key={artifact.id} className="hover:bg-[#eff4ff]/40 transition-colors">
                      <td className="py-3 px-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center font-bold">
                            <span className="material-symbols-outlined text-[16px]">
                              {artifact.type.includes('PDF') ? 'picture_as_pdf' : 'description'}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-[#022448] leading-tight">
                              {artifact.name}
                            </span>
                            <span className="text-[11px] text-[#43474e]">
                              {artifact.size} • {artifact.tag}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3.5 font-mono text-[#121c2a]">
                        {artifact.type}
                      </td>
                      <td className="py-3 px-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-[#1e3a5f] text-white text-[10px] font-bold flex items-center justify-center">
                            {artifact.uploadedBy.split(' ').map((p) => p[0]).join('').slice(0, 2)}
                          </span>
                          <span className="text-[#121c2a] font-medium">{artifact.uploadedBy}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3.5 font-mono text-[#43474e]">
                        {artifact.date}
                      </td>
                      <td className="py-3 px-3.5">
                        <span className="px-1.5 py-0.5 bg-[#e6eeff] font-mono text-[11px] rounded text-[#022448] font-bold">
                          {artifact.version}
                        </span>
                      </td>
                      <td className="py-3 px-3.5">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#DCFCE7] text-[#15803D] font-semibold text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]"></span>
                          <span>Parsed &amp; Verified</span>
                        </span>
                      </td>
                      <td className="py-3 px-3.5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => showNotification(`Inspecting parsed content of ${artifact.name}`)}
                            className="px-2 py-1 rounded bg-[#dee9fc] text-[#022448] hover:bg-[#d0dbed] transition-colors font-semibold"
                          >
                            View
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              showNotification(`Reparsing ${artifact.name} with updated AST rules...`);
                              handleFileUpload(artifact.name, artifact.size);
                            }}
                            className="px-2 py-1 rounded bg-[#e6eeff] text-[#43474e] hover:text-[#022448] transition-colors font-semibold"
                          >
                            Reparse
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Active Ingest Pipeline & Blueprint Presets (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Active Ingest Pipeline Card */}
          <div className="bg-white rounded-xl p-5 shadow-xs flex flex-col gap-4 border border-[#dee9fc]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#006b5d] text-[22px]">bolt</span>
                <h2 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#022448]">
                  Active Ingest Pipeline
                </h2>
              </div>
              <span className="px-2 py-0.5 bg-[#80f3dd] text-[#006f61] rounded text-[11px] font-bold">
                {isSimulatingIngest ? 'Parsing...' : 'Live Stream'}
              </span>
            </div>

            {/* Document Under Parsing Info */}
            <div className="p-3.5 rounded-lg bg-[#eff4ff] flex flex-col gap-1.5 border border-[#dee9fc]">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#022448]">
                    CS301_Data_Structures.docx
                  </span>
                  <span className="text-[11px] text-[#43474e] font-mono">
                    1.8 MB • AST Tokenization Active
                  </span>
                </div>
                <span className="text-sm text-[#006b5d] font-bold font-mono">
                  {ingestProgress}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#d9e3f6] h-2 rounded-full overflow-hidden mt-1">
                <div
                  className="bg-[#006b5d] h-full rounded-full transition-all duration-300"
                  style={{ width: `${ingestProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-[#43474e] mt-1">
                <span>Section: Laboratory Experiments</span>
                <span>{isSimulatingIngest ? 'Processing...' : 'Ready'}</span>
              </div>
            </div>

            {/* Parsed Entities Counters Grid */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold text-[#43474e] uppercase tracking-wider">
                Extracted Schema Entities
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-[#eff4ff] rounded-lg flex items-center gap-2.5 border border-[#dee9fc]">
                  <div className="w-7 h-7 rounded bg-white flex items-center justify-center text-[#022448] shadow-xs">
                    <span className="material-symbols-outlined text-[16px]">flag</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[#022448] leading-tight font-mono">
                      {course.outcomes.length}
                    </span>
                    <span className="text-[10px] text-[#43474e]">Course Outcomes</span>
                  </div>
                </div>

                <div className="p-2.5 bg-[#eff4ff] rounded-lg flex items-center gap-2.5 border border-[#dee9fc]">
                  <div className="w-7 h-7 rounded bg-white flex items-center justify-center text-[#022448] shadow-xs">
                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[#022448] leading-tight font-mono">
                      {course.totalLectureHours}
                    </span>
                    <span className="text-[10px] text-[#43474e]">Lecture Hours</span>
                  </div>
                </div>

                <div className="p-2.5 bg-[#eff4ff] rounded-lg flex items-center gap-2.5 border border-[#dee9fc]">
                  <div className="w-7 h-7 rounded bg-white flex items-center justify-center text-[#022448] shadow-xs">
                    <span className="material-symbols-outlined text-[16px]">biotech</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[#022448] leading-tight font-mono">
                      {course.totalSemesterWeeks}
                    </span>
                    <span className="text-[10px] text-[#43474e]">Lab Sessions</span>
                  </div>
                </div>

                <div className="p-2.5 bg-[#eff4ff] rounded-lg flex items-center gap-2.5 border border-[#dee9fc]">
                  <div className="w-7 h-7 rounded bg-white flex items-center justify-center text-[#022448] shadow-xs">
                    <span className="material-symbols-outlined text-[16px]">psychology_alt</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[#022448] leading-tight font-mono">
                      6
                    </span>
                    <span className="text-[10px] text-[#43474e]">Bloom’s Tags</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Micro AI Confidence Callout */}
            <div className="p-3 rounded-lg bg-[#E6F7F5] flex items-center gap-2.5 border border-[#80f3dd]">
              <span className="material-symbols-outlined text-[#006b5d] text-[20px] shrink-0">verified</span>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#022448]">Bloom's Taxonomy Level Alignments</span>
                <span className="text-[11px] text-[#43474e]">L1-Remember to L6-Create detected across COs.</span>
              </div>
            </div>
          </div>

          {/* Curriculum Blueprint Presets Card */}
          <div className="bg-white rounded-xl p-5 shadow-xs flex flex-col gap-4 border border-[#dee9fc]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#022448] text-[20px]">auto_stories</span>
                <h2 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#022448]">
                  Curriculum Blueprint Presets
                </h2>
              </div>
              <span className="text-xs text-[#006b5d] font-bold">Preset Active</span>
            </div>
            <p className="text-xs text-[#43474e]">
              Select an institutional template to auto-populate compliance constraints, rubrics, and mapping matrices.
            </p>

            {/* Presets */}
            <div className="flex flex-col gap-2">
              <label
                onClick={() => handleApplyPreset('obe_2024')}
                className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors border ${
                  course.activePreset === 'obe_2024'
                    ? 'bg-[#eff4ff] border-[#006b5d]'
                    : 'bg-white border-[#dee9fc] hover:bg-[#eff4ff]/60'
                }`}
              >
                <input
                  type="radio"
                  name="blueprint"
                  checked={course.activePreset === 'obe_2024'}
                  onChange={() => handleApplyPreset('obe_2024')}
                  className="mt-1 accent-[#006b5d]"
                />
                <div className="flex flex-col flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#022448]">OBE Standard 2024</span>
                    {course.activePreset === 'obe_2024' && (
                      <span className="px-1.5 py-0.5 rounded bg-[#006b5d] text-white text-[10px] font-bold">Active</span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#43474e] mt-0.5">
                    Outcome-Based Education with PO1–PO12 mapping &amp; PSO criteria.
                  </span>
                </div>
              </label>

              <label
                onClick={() => handleApplyPreset('abet_cac')}
                className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors border ${
                  course.activePreset === 'abet_cac'
                    ? 'bg-[#eff4ff] border-[#006b5d]'
                    : 'bg-white border-[#dee9fc] hover:bg-[#eff4ff]/60'
                }`}
              >
                <input
                  type="radio"
                  name="blueprint"
                  checked={course.activePreset === 'abet_cac'}
                  onChange={() => handleApplyPreset('abet_cac')}
                  className="mt-1 accent-[#006b5d]"
                />
                <div className="flex flex-col flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#022448]">ABET Computing CAC</span>
                    <span className="font-mono text-[10px] text-[#43474e]">Criterion 3</span>
                  </div>
                  <span className="text-[11px] text-[#43474e] mt-0.5">
                    Global Computing Accreditation Commission rubric format.
                  </span>
                </div>
              </label>

              <label
                onClick={() => handleApplyPreset('cbcs_elective')}
                className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors border ${
                  course.activePreset === 'cbcs_elective'
                    ? 'bg-[#eff4ff] border-[#006b5d]'
                    : 'bg-white border-[#dee9fc] hover:bg-[#eff4ff]/60'
                }`}
              >
                <input
                  type="radio"
                  name="blueprint"
                  checked={course.activePreset === 'cbcs_elective'}
                  onChange={() => handleApplyPreset('cbcs_elective')}
                  className="mt-1 accent-[#006b5d]"
                />
                <div className="flex flex-col flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#022448]">CBCS Elective</span>
                    <span className="font-mono text-[10px] text-[#43474e]">UGC / AICTE</span>
                  </div>
                  <span className="text-[11px] text-[#43474e] mt-0.5">
                    Choice Based Credit System modular theory &amp; lab distribution.
                  </span>
                </div>
              </label>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-[#dee9fc] text-[#43474e] text-xs">
              <span>Target Accreditation:</span>
              <span className="font-bold text-[#022448]">
                {course.activePreset === 'abet_cac'
                  ? 'ABET Computing (CAC Criterion 3)'
                  : 'NBA Tier-1 (Washington Accord)'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Footer Bar */}
      <footer className="mt-2 py-3 px-6 bg-white rounded-xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#dee9fc] no-print">
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
          <button
            type="button"
            onClick={() => showNotification('Reset workspace changes')}
            className="px-4 py-1.5 rounded bg-[#e6eeff] text-[#43474e] hover:text-[#022448] hover:bg-[#dee9fc] transition-colors text-xs font-semibold"
          >
            Cancel
          </button>
          <span className="text-xs text-[#43474e] hidden md:inline">
            Active doc: <span className="font-mono font-medium text-[#022448]">{course.code} v{course.version}</span>
          </span>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={() => showNotification('Draft autosaved to local session.')}
            className="px-4 py-1.5 rounded bg-[#dee9fc] text-[#022448] hover:bg-[#d0dbed] transition-colors text-xs font-semibold"
          >
            Save Draft &amp; Exit
          </button>
          <button
            type="button"
            onClick={() => onNavigate('spec')}
            className="inline-flex items-center gap-1.5 px-6 py-1.5 rounded bg-[#006b5d] hover:bg-[#005046] text-white text-xs font-semibold shadow-xs transition-all"
          >
            <span>Proceed to 2. Spec Editor</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
