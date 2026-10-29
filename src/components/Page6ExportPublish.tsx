import React, { useState } from 'react';
import { CourseSpecification, UserRole, PipelinePage } from '../types';

interface Page6ExportPublishProps {
  course: CourseSpecification;
  onUpdateCourse: (updated: CourseSpecification) => void;
  currentRole: UserRole;
  onNavigate: (page: PipelinePage) => void;
  showNotification: (msg: string) => void;
}

export const Page6ExportPublish: React.FC<Page6ExportPublishProps> = ({
  course,
  onNavigate,
  showNotification,
}) => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [includeSeal, setIncludeSeal] = useState(true);
  const [includeWatermark, setIncludeWatermark] = useState(true);
  const [syndicateCanvas, setSyndicateCanvas] = useState(true);
  const [syndicateMoodle, setSyndicateMoodle] = useState(true);

  const totalLectureHours = course.lectureHoursPerWeek * course.totalSemesterWeeks;
  const totalLabHours = course.labHoursPerWeek * course.totalSemesterWeeks;
  const totalContactHours = totalLectureHours + totalLabHours;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(course, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${course.code}_Accreditation_Dossier.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotification(`Downloaded JSON Schema for ${course.code}`);
  };

  const handleDownloadCSV = () => {
    const headers = ['CO Code', 'Competency Title', 'Bloom Level', 'Target %', 'Assessment Method'];
    const rows = course.outcomes.map(
      (co) => `"${co.code}","${co.shortTitle}","${co.bloomsLevel}","${co.targetWeight}%","${co.assessmentMethod}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `${course.code}_Syllabus_Table.csv`;
    link.click();
    showNotification(`Downloaded CSV matrix for ${course.code}`);
  };

  const handlePublishPortal = () => {
    showNotification(`Published ${course.code} (v${course.version}) to Institutional Academic Portal & LMS feeds.`);
  };

  return (
    <div className="w-full px-4 lg:px-8 py-6 flex flex-col gap-6 max-w-[1560px] mx-auto animate-in fade-in duration-150">
      {/* Top Bar Breadcrumb & Status Pill */}
      <div className="flex flex-wrap items-center justify-between gap-3 no-print">
        <nav className="flex items-center gap-2 text-[#43474e] text-xs">
          <button type="button" onClick={() => onNavigate('upload')} className="hover:text-[#022448]">Home</button>
          <span>/</span>
          <button type="button" onClick={() => onNavigate('spec')} className="hover:text-[#022448]">Specifications</button>
          <span>/</span>
          <span className="font-semibold text-[#022448]">{course.code}</span>
          <span>/</span>
          <span className="font-bold text-[#022448] bg-[#dee9fc] px-2 py-0.5 rounded">6. Export &amp; Publish</span>
        </nav>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#80f3dd] text-[#006f61] text-xs font-bold uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#006b5d]"></span>
            Ready For Distribution
          </span>
          <span className="text-[#43474e] font-mono text-xs">Rev: {course.version}</span>
        </div>
      </div>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 no-print">
        <div className="flex flex-col gap-1 max-w-3xl">
          <h1 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#022448] tracking-tight">
            Export &amp; Publish Course Specification
          </h1>
          <p className="text-xs text-[#43474e] leading-relaxed">
            Generate verified institutional syllabus dossiers, accreditation-ready matrices, and student handbooks in multiple file formats. All exports embed certified cryptographic metadata.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleDownloadCSV}
            className="inline-flex items-center gap-1.5 px-3.5 h-9 rounded-lg bg-[#dee9fc] text-[#022448] hover:bg-[#d0dbed] text-xs font-semibold transition-colors shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">folder_zip</span>
            <span>Batch Export Syllabus</span>
          </button>
          <button
            type="button"
            onClick={handlePublishPortal}
            className="inline-flex items-center gap-1.5 px-4 h-9 rounded-lg bg-[#006b5d] hover:bg-[#005046] text-white text-xs font-semibold transition-all shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">publish</span>
            <span>Publish to Academic Portal</span>
          </button>
        </div>
      </div>

      {/* 4 Pastel Summary Flashcards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 no-print">
        {/* Card 1 */}
        <div className="p-4 rounded-xl bg-[#EAF2FF] flex items-start gap-3.5 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-xs text-[#022448]">
            <span className="material-symbols-outlined text-[22px]">description</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#022448] leading-tight">PDF &amp; DOCX</span>
            <span className="text-xs font-semibold text-[#121c2a] mt-0.5">Available Formats</span>
            <span className="text-[11px] text-[#43474e]">Formatted &amp; Styled</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-4 rounded-xl bg-[#EAF8EF] flex items-start gap-3.5 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-xs text-[#15803D]">
            <span className="material-symbols-outlined text-[22px]">verified</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#15803D] leading-tight">Watermarked</span>
            <span className="text-xs font-semibold text-[#121c2a] mt-0.5">Digital Seal Ready</span>
            <span className="text-[11px] text-[#43474e]">Cryptographic Verification</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-4 rounded-xl bg-[#F1ECFF] flex items-start gap-3.5 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-xs text-[#4527A0]">
            <span className="material-symbols-outlined text-[22px]">table_chart</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#4527A0] leading-tight">Excel SAR</span>
            <span className="text-xs font-semibold text-[#121c2a] mt-0.5">Accreditation Matrix</span>
            <span className="text-[11px] text-[#43474e]">NBA Criterion 3 Preset</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="p-4 rounded-xl bg-[#FFF5DF] flex items-start gap-3.5 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-xs text-[#92400E]">
            <span className="material-symbols-outlined text-[22px]">public</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#92400E] leading-tight">Public / LMS</span>
            <span className="text-xs font-semibold text-[#121c2a] mt-0.5">Syndication Target</span>
            <span className="text-[11px] text-[#43474e]">Canvas, Moodle, Portal</span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Document Live Preview Surface */}
        <div className="xl:col-span-8 flex flex-col gap-4">
          {/* Document Preview Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-white shadow-xs border border-[#dee9fc] no-print">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#022448]">Live Dossier Preview</span>
              <div className="h-4 w-px bg-[#c4c6cf]"></div>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(75, z - 10))}
                className="p-1 text-[#43474e] hover:text-[#022448] rounded"
                title="Zoom Out"
              >
                <span className="material-symbols-outlined text-[18px]">zoom_out</span>
              </button>
              <span className="font-mono text-xs font-semibold text-[#121c2a] px-1">{zoomLevel}%</span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
                className="p-1 text-[#43474e] hover:text-[#022448] rounded"
                title="Zoom In"
              >
                <span className="material-symbols-outlined text-[18px]">zoom_in</span>
              </button>
              <div className="h-4 w-px bg-[#c4c6cf]"></div>
              <span className="text-xs text-[#43474e]">Page 1 of 4</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-[#eff4ff] text-[#43474e] font-mono text-[11px]">
                <span className="material-symbols-outlined text-[14px] text-[#006b5d]">verified_user</span>
                <span>SHA-256: 8F2A...9C1B</span>
              </span>
              <button
                type="button"
                onClick={handlePrint}
                className="p-1.5 text-[#022448] hover:bg-[#eff4ff] rounded transition-colors"
                title="Print Preview"
              >
                <span className="material-symbols-outlined text-[18px]">print</span>
              </button>
            </div>
          </div>

          {/* Clean White Paper Preview Surface */}
          <div
            id="print-dossier"
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            className="relative bg-white rounded-xl p-8 sm:p-12 shadow-sm border border-[#dee9fc] min-h-[960px] flex flex-col justify-between overflow-hidden transition-transform duration-150 print:border-none print:shadow-none print:p-0 print:transform-none"
          >
            {/* Watermark Background */}
            {includeWatermark && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center select-none opacity-[0.03]">
                <span className="material-symbols-outlined text-[520px] text-[#022448]">school</span>
              </div>
            )}

            <div className="flex flex-col gap-6 relative z-10">
              {/* Official Crest Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-5 gap-4 bg-[#eff4ff] p-4 rounded-xl border border-[#dee9fc]">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-xs border border-[#dee9fc]">
                    <span className="material-symbols-outlined text-[32px] text-[#022448]">account_balance</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#43474e] uppercase tracking-wider font-bold">
                      {course.facultySchool}
                    </span>
                    <span className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#022448]">
                      Department of {course.department}
                    </span>
                    <span className="text-xs text-[#006b5d] font-semibold">
                      Course Specification Bulletin 2024–2025
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:text-right text-xs">
                  <span className="text-[10px] text-[#43474e] uppercase tracking-wider font-bold">Accreditation Code</span>
                  <span className="font-mono font-bold text-[#022448]">NBA-SAR-CS-2024</span>
                  <span className="text-[11px] text-[#006b5d] font-semibold mt-0.5">Outcome-Based Model (OBE)</span>
                </div>
              </div>

              {/* Course Title Bar and Credit Structure */}
              <div className="p-4 rounded-xl bg-[#e6eeff] flex flex-col md:flex-row md:items-center justify-between gap-4 border border-[#dee9fc]">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-[#43474e] uppercase tracking-wider">Course Identifier</span>
                  <span className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#022448]">
                    {course.code} : {course.title}
                  </span>
                  <span className="text-xs text-[#43474e]">{course.semester} • Tier: {course.level}</span>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <div className="flex flex-col items-center bg-white px-3 py-1.5 rounded-lg shadow-xs border border-[#dee9fc]">
                    <span className="text-[10px] font-bold text-[#43474e]">Credits</span>
                    <span className="font-mono text-base font-bold text-[#022448]">{course.credits.toFixed(1)}</span>
                  </div>
                  <div className="flex flex-col bg-white px-3 py-1.5 rounded-lg shadow-xs border border-[#dee9fc]">
                    <span className="text-[10px] font-bold text-[#43474e]">L - T - P Breakdown</span>
                    <span className="font-mono text-xs font-bold text-[#022448]">
                      {course.lectureHoursPerWeek} - {course.tutorialHoursPerWeek} - {course.labHoursPerWeek} ({totalContactHours} Contact Hrs)
                    </span>
                  </div>
                </div>
              </div>

              {/* Catalog Description */}
              <div className="flex flex-col gap-1 text-xs">
                <span className="font-bold text-[#022448] uppercase tracking-wider text-[11px] border-b border-[#dee9fc] pb-1">
                  1. Course Description &amp; Scope
                </span>
                <p className="text-xs text-[#121c2a] leading-relaxed pt-1">
                  {course.courseDescription}
                </p>
              </div>

              {/* Course Outcomes Table */}
              <div className="flex flex-col gap-2">
                <span className="font-bold text-[#022448] uppercase tracking-wider text-[11px] border-b border-[#dee9fc] pb-1">
                  2. Course Outcomes (COs) &amp; Bloom's Taxonomy Taxonomy
                </span>
                <table className="w-full text-xs border border-[#dee9fc] rounded-lg overflow-hidden">
                  <thead className="bg-[#eff4ff] text-[#43474e] font-semibold text-[11px]">
                    <tr>
                      <th className="p-2.5 w-16">CO</th>
                      <th className="p-2.5">Competency Outcome Statement</th>
                      <th className="p-2.5 w-28">Bloom Level</th>
                      <th className="p-2.5 w-44">Assessment Instrument</th>
                      <th className="p-2.5 text-right w-16">Weight</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#dee9fc]">
                    {course.outcomes.map((co) => (
                      <tr key={co.id}>
                        <td className="p-2.5 font-mono font-bold text-[#022448]">{co.code}</td>
                        <td className="p-2.5 leading-relaxed text-[#121c2a]">{co.description}</td>
                        <td className="p-2.5 font-semibold text-[#006b5d]">{co.bloomsTag}</td>
                        <td className="p-2.5 text-[#43474e]">{co.assessmentMethod}</td>
                        <td className="p-2.5 text-right font-mono font-bold">{co.targetWeight}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Assessment Table */}
              <div className="flex flex-col gap-2">
                <span className="font-bold text-[#022448] uppercase tracking-wider text-[11px] border-b border-[#dee9fc] pb-1">
                  3. Assessment &amp; Grading Scheme
                </span>
                <table className="w-full text-xs border border-[#dee9fc]">
                  <thead className="bg-[#eff4ff] text-[#43474e] font-semibold text-[11px]">
                    <tr>
                      <th className="p-2.5">Assessment Component</th>
                      <th className="p-2.5 text-right w-20">Weight (%)</th>
                      <th className="p-2.5">Mapped Outcomes</th>
                      <th className="p-2.5 text-center w-24">Mandatory Pass</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#dee9fc]">
                    {course.assessmentScheme.map((item) => (
                      <tr key={item.id}>
                        <td className="p-2.5 font-semibold text-[#121c2a]">{item.component}</td>
                        <td className="p-2.5 text-right font-mono font-bold text-[#022448]">{item.percentage}%</td>
                        <td className="p-2.5 font-mono text-[11px] text-[#006b5d]">{item.coMappings.join(', ')}</td>
                        <td className="p-2.5 text-center">{item.isMandatoryToPass ? 'Yes' : 'No'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Prescribed Literature */}
              <div className="flex flex-col gap-2">
                <span className="font-bold text-[#022448] uppercase tracking-wider text-[11px] border-b border-[#dee9fc] pb-1">
                  4. Prescribed Textbooks &amp; Reference Citations
                </span>
                <ul className="text-xs space-y-1 list-disc pl-5 text-[#121c2a]">
                  {course.textbooks.map((tb) => (
                    <li key={tb.id}>
                      <span className="font-bold uppercase text-[#022448]">[{tb.type}]</span>{' '}
                      <strong>{tb.title}</strong>, by {tb.authors} ({tb.publisher}, {tb.year}). ISBN: <span className="font-mono">{tb.isbn}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Signatory Endorsement Seals */}
              {includeSeal && (
                <div className="pt-8 mt-4 border-t-2 border-[#022448] grid grid-cols-1 sm:grid-cols-3 gap-8 text-xs text-center">
                  <div className="flex flex-col items-center">
                    <div className="h-10 flex items-end font-serif italic text-sm text-[#022448]">
                      Dr. Aris Vance
                    </div>
                    <div className="w-44 border-b border-[#022448] mb-1"></div>
                    <div className="font-bold text-[#022448]">Course Lead Author</div>
                    <div className="text-[10px] text-[#43474e]">Signed: Oct 14, 2024</div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="h-10 flex items-end font-serif italic text-sm text-[#022448]">
                      Prof. Elena Rostova
                    </div>
                    <div className="w-44 border-b border-[#022448] mb-1"></div>
                    <div className="font-bold text-[#022448]">Dept Review Committee</div>
                    <div className="text-[10px] text-[#43474e]">Signed: Oct 15, 2024</div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="h-10 flex items-end font-serif italic text-sm text-[#006b5d] font-bold">
                      [ACCREDITATION SEAL]
                    </div>
                    <div className="w-44 border-b border-[#022448] mb-1"></div>
                    <div className="font-bold text-[#022448]">Head of Department (HOD)</div>
                    <div className="text-[10px] text-[#43474e]">Signed: Oct 16, 2024</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Format Exports & Distribution Controls */}
        <div className="xl:col-span-4 flex flex-col gap-6 no-print">
          {/* Download Formats Card */}
          <div className="bg-white p-5 rounded-xl shadow-xs border border-[#dee9fc] flex flex-col gap-4">
            <h3 className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#022448] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#dee9fc] pb-2">
              <span className="material-symbols-outlined text-[#006b5d] text-[18px]">download</span>
              <span>Available Export Formats</span>
            </h3>

            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handlePrint}
                className="p-3 rounded-lg bg-[#eff4ff] hover:bg-[#dee9fc] transition-colors border border-[#dee9fc] flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#ba1a1a] text-[22px]">picture_as_pdf</span>
                  <div>
                    <span className="font-bold text-xs text-[#022448] block">Formatted PDF Syllabus</span>
                    <span className="text-[11px] text-[#43474e]">Includes official seals &amp; page breaks</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#022448] text-[18px]">arrow_forward</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadCSV}
                className="p-3 rounded-lg bg-[#eff4ff] hover:bg-[#dee9fc] transition-colors border border-[#dee9fc] flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#006b5d] text-[22px]">table_chart</span>
                  <div>
                    <span className="font-bold text-xs text-[#022448] block">Accreditation Excel / CSV Matrix</span>
                    <span className="text-[11px] text-[#43474e]">CO-PO-PSO tab with SAR formulas</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#022448] text-[18px]">arrow_forward</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadJSON}
                className="p-3 rounded-lg bg-[#eff4ff] hover:bg-[#dee9fc] transition-colors border border-[#dee9fc] flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#1e3a5f] text-[22px]">data_object</span>
                  <div>
                    <span className="font-bold text-xs text-[#022448] block">Institutional JSON Schema</span>
                    <span className="text-[11px] text-[#43474e]">Standard machine-readable export</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#022448] text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Export Toggles & Seals */}
          <div className="bg-white p-5 rounded-xl shadow-xs border border-[#dee9fc] flex flex-col gap-3.5">
            <h3 className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#022448] uppercase tracking-wider border-b border-[#dee9fc] pb-2">
              Dossier Metadata Controls
            </h3>

            <div className="flex flex-col gap-2.5 text-xs">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-[#121c2a] font-medium">Embed Official Institutional Seals</span>
                <input
                  type="checkbox"
                  checked={includeSeal}
                  onChange={(e) => setIncludeSeal(e.target.checked)}
                  className="accent-[#006b5d] w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-[#121c2a] font-medium">Background University Watermark</span>
                <input
                  type="checkbox"
                  checked={includeWatermark}
                  onChange={(e) => setIncludeWatermark(e.target.checked)}
                  className="accent-[#006b5d] w-4 h-4 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* LMS Syndication */}
          <div className="bg-white p-5 rounded-xl shadow-xs border border-[#dee9fc] flex flex-col gap-3.5">
            <h3 className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#022448] uppercase tracking-wider border-b border-[#dee9fc] pb-2">
              LMS &amp; Portal Syndication
            </h3>

            <div className="flex flex-col gap-2.5 text-xs">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-[#121c2a] font-medium">Syndicate to Canvas LMS</span>
                <input
                  type="checkbox"
                  checked={syndicateCanvas}
                  onChange={(e) => setSyndicateCanvas(e.target.checked)}
                  className="accent-[#006b5d] w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-[#121c2a] font-medium">Syndicate to Moodle / Portal</span>
                <input
                  type="checkbox"
                  checked={syndicateMoodle}
                  onChange={(e) => setSyndicateMoodle(e.target.checked)}
                  className="accent-[#006b5d] w-4 h-4 cursor-pointer"
                />
              </label>
            </div>

            <button
              type="button"
              onClick={handlePublishPortal}
              className="mt-2 w-full py-2.5 bg-[#006b5d] hover:bg-[#005046] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">publish</span>
              <span>Publish Live Syllabus Bulletin</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
