import React, { useState } from 'react';
import { CourseSpecification, UserRole, PipelinePage, MatrixCellMapping } from '../types';
import { getPermissionsForRole, requestAIGeneration } from '../api';

interface Page3MatrixMapProps {
  course: CourseSpecification;
  onUpdateCourse: (updated: CourseSpecification) => void;
  currentRole: UserRole;
  onNavigate: (page: PipelinePage) => void;
  showNotification: (msg: string) => void;
  onOpenAIAssistantWithPrompt: (prompt: string) => void;
}

export const Page3MatrixMap: React.FC<Page3MatrixMapProps> = ({
  course,
  onUpdateCourse,
  currentRole,
  onNavigate,
  showNotification,
  onOpenAIAssistantWithPrompt,
}) => {
  const permissions = getPermissionsForRole(currentRole);
  const [selectedCell, setSelectedCell] = useState<{ coId: string; targetId: string }>({
    coId: course.selectedCellEvidence?.coId || 'CO2',
    targetId: course.selectedCellEvidence?.targetId || 'PO3',
  });
  const [isAutoMapping, setIsAutoMapping] = useState(false);

  const getMapping = (coId: string, targetId: string): MatrixCellMapping | undefined => {
    return course.matrixMappings.find((m) => m.coId === coId && m.targetId === targetId);
  };

  const getLevel = (coId: string, targetId: string): 0 | 1 | 2 | 3 => {
    return getMapping(coId, targetId)?.level || 0;
  };

  const handleSetLevel = (coId: string, targetId: string, nextLevel: 0 | 1 | 2 | 3) => {
    if (!permissions.canModifyMatrix) {
      showNotification('Permission restricted: Only Authors and Reviewers can edit matrix mappings.');
      return;
    }

    const updated = [...course.matrixMappings];
    const existingIndex = updated.findIndex((m) => m.coId === coId && m.targetId === targetId);

    if (nextLevel === 0) {
      if (existingIndex >= 0) {
        updated.splice(existingIndex, 1);
      }
    } else {
      if (existingIndex >= 0) {
        updated[existingIndex] = {
          ...updated[existingIndex],
          level: nextLevel,
        };
      } else {
        updated.push({
          coId,
          targetId,
          level: nextLevel,
          justification: `Direct alignment between ${coId} and ${targetId} validated for curriculum outcome.`,
        });
      }
    }

    onUpdateCourse({
      ...course,
      matrixMappings: updated,
    });
  };

  const handleCellClick = (coId: string, targetId: string) => {
    setSelectedCell({ coId, targetId });
    if (!permissions.canModifyMatrix) return;
    const current = getLevel(coId, targetId);
    const nextLevel = ((current + 1) % 4) as 0 | 1 | 2 | 3;
    handleSetLevel(coId, targetId, nextLevel);
  };

  const handleUpdateJustification = (text: string) => {
    if (!permissions.canModifyMatrix) return;
    const updated = [...course.matrixMappings];
    const existingIndex = updated.findIndex((m) => m.coId === selectedCell.coId && m.targetId === selectedCell.targetId);

    if (existingIndex >= 0) {
      updated[existingIndex] = {
        ...updated[existingIndex],
        justification: text,
      };
      onUpdateCourse({ ...course, matrixMappings: updated });
    }
  };

  const handleAutoMapAI = async () => {
    setIsAutoMapping(true);
    try {
      const res = await requestAIGeneration('auto_map_matrix', {
        cos: course.outcomes,
        pos: course.programOutcomes,
      });
      if (res.success) {
        showNotification(res.content);
      }
    } finally {
      setIsAutoMapping(false);
    }
  };

  // Calculations
  const mappedCells = course.matrixMappings.filter((m) => m.level > 0);
  const substantialCount = course.matrixMappings.filter((m) => m.level === 3).length;
  const coveredPOs = new Set(
    course.matrixMappings.filter((m) => m.level > 0 && m.targetId.startsWith('PO')).map((m) => m.targetId)
  ).size;

  const totalSum = mappedCells.reduce((acc, m) => acc + m.level, 0);
  const averageAttainment = mappedCells.length > 0 ? (totalSum / mappedCells.length).toFixed(2) : '0.00';

  const selectedMapping = getMapping(selectedCell.coId, selectedCell.targetId);
  const selectedCO = course.outcomes.find((co) => co.id === selectedCell.coId);
  const selectedPO = course.programOutcomes.find((po) => po.id === selectedCell.targetId);

  return (
    <div className="w-full px-4 lg:px-8 py-6 flex flex-col gap-6 max-w-[1560px] mx-auto animate-in fade-in duration-150">
      {/* Breadcrumb & Top Bar */}
      <div className="flex items-center justify-between">
        <nav className="flex items-center gap-2 text-xs text-[#43474e]">
          <button type="button" onClick={() => onNavigate('upload')} className="hover:text-[#022448]">Home</button>
          <span>/</span>
          <button type="button" onClick={() => onNavigate('spec')} className="hover:text-[#022448]">Specifications</button>
          <span>/</span>
          <span className="font-semibold">{course.code}</span>
          <span>/</span>
          <span className="font-bold text-[#022448] bg-[#dee9fc] px-2 py-0.5 rounded">3. Outcome Correlation</span>
        </nav>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#80f3dd] text-[#006f61] text-xs font-bold uppercase tracking-wider">
          <span className="material-symbols-outlined text-[16px]">rule_folder</span>
          <span>NBA CRITERION 3.1 COMPLIANT</span>
        </div>
      </div>

      {/* Header with Title and Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#022448] tracking-tight">
            Curriculum Correlation Matrix (CO–PO–PSO)
          </h1>
          <p className="text-xs text-[#43474e] max-w-4xl leading-relaxed">
            Correlate Course Outcomes (CO1–CO5) against 12 Program Outcomes (PO1–PO12) and Program Specific Outcomes (PSO1–PSO2). Scale:{' '}
            <strong className="text-[#022448]">3</strong> = Substantial,{' '}
            <strong className="text-[#022448]">2</strong> = Moderate,{' '}
            <strong className="text-[#022448]">1</strong> = Slight,{' '}
            <strong className="text-[#022448]">-</strong> = None.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start lg:self-center shrink-0">
          <button
            type="button"
            onClick={handleAutoMapAI}
            disabled={isAutoMapping}
            className="inline-flex items-center gap-1.5 px-4 h-9 rounded bg-[#006b5d] hover:bg-[#005046] text-white transition-all shadow-xs text-xs font-semibold"
          >
            <span className="material-symbols-outlined text-[18px]">psychology</span>
            <span>{isAutoMapping ? 'Mapping Matrix...' : "Auto-Map via Bloom's AI"}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              const headers = ['Course Outcome', ...course.programOutcomes.map((p) => p.code)];
              const rows = course.outcomes.map((co) => {
                const cols = course.programOutcomes.map((po) => {
                  const lvl = getLevel(co.id, po.id);
                  return lvl > 0 ? lvl.toString() : '-';
                });
                return [co.code, ...cols].join(',');
              });
              const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
              const link = document.createElement('a');
              link.href = encodeURI(csvContent);
              link.download = `${course.code}_CO_PO_PSO_Matrix.csv`;
              link.click();
              showNotification('Exported Matrix to CSV');
            }}
            className="inline-flex items-center gap-1.5 px-4 h-9 rounded bg-white border border-[#dee9fc] text-[#022448] hover:bg-[#eff4ff] transition-colors shadow-xs text-xs font-semibold"
          >
            <span className="material-symbols-outlined text-[18px]">table_view</span>
            <span>Export Matrix to Excel / CSV</span>
          </button>
        </div>
      </div>

      {/* 4 Pastel Summary Flashcards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Attainment Index */}
        <div className="p-4 rounded-xl bg-[#EAF2FF] flex items-start justify-between shadow-xs">
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] text-[#2A4365] font-bold uppercase tracking-wider">Target Attainment</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="font-['Plus_Jakarta_Sans'] text-2xl text-[#0A2540] font-bold">{averageAttainment}</span>
              <span className="text-xs text-[#4A5568]">/ 3.00 max</span>
            </div>
            <span className="text-xs text-[#2D3748] mt-1.5">Average threshold index</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#D3E4FE] text-[#022448] flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">calculate</span>
          </div>
        </div>

        {/* Card 2: Vector Coverage */}
        <div className="p-4 rounded-xl bg-[#E6F7F5] flex items-start justify-between shadow-xs">
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] text-[#005046] font-bold uppercase tracking-wider">PO Vector Coverage</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="font-['Plus_Jakarta_Sans'] text-2xl text-[#00382E] font-bold">{coveredPOs} / 12</span>
              <span className="text-xs text-[#006F61] font-bold">({((coveredPOs / 12) * 100).toFixed(1)}%)</span>
            </div>
            <span className="text-xs text-[#005046] mt-1.5">Outcomes actively mapped</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#C5EFEA] text-[#005046] flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">fact_check</span>
          </div>
        </div>

        {/* Card 3: Level 3 Cells */}
        <div className="p-4 rounded-xl bg-[#F1ECFF] flex items-start justify-between shadow-xs">
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] text-[#4A2D82] font-bold uppercase tracking-wider">Substantial (Level 3)</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="font-['Plus_Jakarta_Sans'] text-2xl text-[#2B1055] font-bold">{substantialCount} Cells</span>
            </div>
            <span className="text-xs text-[#553C9A] mt-1.5">High correlation weightings</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#DDD2FC] text-[#4A2D82] flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">insights</span>
          </div>
        </div>

        {/* Card 4: Audit Status */}
        <div className="p-4 rounded-xl bg-[#EAF8EF] flex items-start justify-between shadow-xs">
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] text-[#1E5D34] font-bold uppercase tracking-wider">NBA &amp; ABET Audit</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="font-['Plus_Jakarta_Sans'] text-2xl text-[#0D381E] font-bold">Tier-1 Ready</span>
            </div>
            <span className="text-xs text-[#276749] mt-1.5">SAR Criterion 3.1 validated</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#C7EED4] text-[#1E5D34] flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">workspace_premium</span>
          </div>
        </div>
      </div>

      {/* Main Workspace Split: Matrix Table (8 cols) + Articulation Justification Drawer (4 cols) */}
      <div className="grid grid-cols-1 2xl:grid-cols-12 gap-6 items-start">
        {/* Correlation Matrix Table (8 cols) */}
        <div className="2xl:col-span-8 flex flex-col gap-3 bg-white p-5 rounded-xl shadow-xs border border-[#dee9fc] overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-2">
            <div className="flex items-center gap-2">
              <span className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#022448]">Matrix Grid</span>
              <span className="text-[11px] text-[#43474e] bg-[#eff4ff] px-2 py-0.5 rounded border border-[#dee9fc]">
                Click cell to cycle 0 &rarr; 1 &rarr; 2 &rarr; 3
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#006B5D]"></span> 3: Substantial</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#1E3A5F]"></span> 2: Moderate</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#8AA4CF]"></span> 1: Slight</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#d9e3f6]"></span> -: None</span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border border-[#dee9fc]">
            <table className="w-full border-collapse text-left min-w-[920px] text-xs">
              <thead>
                <tr className="bg-[#eff4ff] text-[#43474e] font-semibold text-[11px] border-b border-[#dee9fc]">
                  <th className="p-3 w-40 font-bold text-[#022448] sticky left-0 bg-[#eff4ff] z-10 shadow-[2px_0_4px_rgba(0,0,0,0.02)]">
                    Course Outcome
                  </th>
                  {course.programOutcomes.map((po) => (
                    <th
                      key={po.id}
                      className={`p-2 text-center font-bold ${po.isPSO ? 'bg-[#E6F7F5] text-[#005046]' : ''}`}
                      title={`${po.code}: ${po.title}`}
                    >
                      {po.code}
                      <span className="block text-[10px] font-normal text-[#43474e]">{po.shortTitle}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dee9fc]">
                {course.outcomes.map((co) => (
                  <tr key={co.id} className="hover:bg-[#eff4ff]/30 transition-colors">
                    <td className="p-3 font-bold text-[#022448] sticky left-0 bg-white z-10 shadow-[2px_0_4px_rgba(0,0,0,0.02)]">
                      <div className="flex flex-col">
                        <span className="font-semibold text-xs">{co.code}</span>
                        <span className="text-[10px] text-[#43474e] font-normal truncate max-w-[120px]">
                          {co.shortTitle}
                        </span>
                      </div>
                    </td>

                    {course.programOutcomes.map((po) => {
                      const lvl = getLevel(co.id, po.id);
                      const isSelected = selectedCell.coId === co.id && selectedCell.targetId === po.id;

                      let cellBg = 'bg-[#eff4ff] text-[#43474e]';
                      if (lvl === 3) cellBg = 'bg-[#006B5D] text-white';
                      else if (lvl === 2) cellBg = 'bg-[#1E3A5F] text-white';
                      else if (lvl === 1) cellBg = 'bg-[#8AA4CF] text-white';

                      return (
                        <td
                          key={po.id}
                          className={`p-1.5 text-center ${po.isPSO ? 'bg-[#F4FBFA]' : ''}`}
                        >
                          <button
                            type="button"
                            onClick={() => handleCellClick(co.id, po.id)}
                            className={`w-8 h-8 rounded font-mono font-bold text-xs transition-all ${cellBg} ${
                              isSelected ? 'ring-2 ring-[#006b5d] ring-offset-1 scale-105' : 'hover:opacity-90'
                            }`}
                            title={`${co.code} ↔ ${po.code} Level: ${lvl > 0 ? lvl : 'None'}`}
                          >
                            {lvl > 0 ? lvl : '-'}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Drawer: Articulation Evidence & Justification (4 cols) */}
        <div className="2xl:col-span-4 flex flex-col gap-4 bg-white p-5 rounded-xl shadow-xs border border-[#dee9fc]">
          <div className="flex items-center justify-between border-b border-[#dee9fc] pb-2.5">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#006b5d] text-[20px]">edit_note</span>
              <h2 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#022448]">
                Articulation Evidence &amp; Justification
              </h2>
            </div>
            <span className="px-2 py-0.5 bg-[#eff4ff] text-[#022448] font-mono text-[11px] font-bold rounded">
              {selectedCell.coId} ↔ {selectedCell.targetId}
            </span>
          </div>

          {/* Details of Selected Cell */}
          <div className="p-3 bg-[#eff4ff] rounded-lg border border-[#dee9fc] flex flex-col gap-1 text-xs">
            <div className="font-bold text-[#022448]">
              {selectedCO ? `${selectedCO.code}: ${selectedCO.shortTitle}` : selectedCell.coId}
            </div>
            <p className="text-[11px] text-[#43474e] leading-relaxed">
              {selectedCO?.description}
            </p>
            <div className="mt-2 pt-2 border-t border-[#dee9fc] text-[11px] text-[#43474e]">
              Target: <strong className="text-[#022448]">{selectedPO?.code}: {selectedPO?.title}</strong>
            </div>
          </div>

          {/* Level Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-[#43474e] uppercase tracking-wider">
              Assigned Correlation Scale
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { lvl: 0, label: '- None' },
                { lvl: 1, label: '1 Slight' },
                { lvl: 2, label: '2 Moderate' },
                { lvl: 3, label: '3 Substantial' },
              ].map((opt) => (
                <button
                  key={opt.lvl}
                  type="button"
                  onClick={() => handleSetLevel(selectedCell.coId, selectedCell.targetId, opt.lvl as any)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all border ${
                    getLevel(selectedCell.coId, selectedCell.targetId) === opt.lvl
                      ? 'bg-[#006b5d] text-white border-[#006b5d]'
                      : 'bg-white text-[#43474e] border-[#dee9fc] hover:bg-[#eff4ff]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Justification Textarea */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-[#43474e] uppercase tracking-wider">
              Auditor Justification Evidence
            </label>
            <textarea
              rows={4}
              value={selectedMapping?.justification || ''}
              disabled={!permissions.canModifyMatrix}
              onChange={(e) => handleUpdateJustification(e.target.value)}
              placeholder="Cite specific textbook chapters, laboratory milestones, and exam questions proving this correlation level..."
              className="w-full p-2.5 text-xs bg-white border border-[#dee9fc] rounded-lg text-[#121c2a] focus:ring-2 focus:ring-[#006b5d] focus:outline-none"
            />
          </div>

          {/* AI Helper Trigger */}
          <button
            type="button"
            onClick={() =>
              onOpenAIAssistantWithPrompt(
                `Generate institutional justification for mapping ${selectedCell.coId} (${selectedCO?.shortTitle}) to ${selectedCell.targetId} (${selectedPO?.title}) at level ${getLevel(selectedCell.coId, selectedCell.targetId)}`
              )
            }
            className="w-full py-2 px-3 bg-[#E6F7F5] hover:bg-[#c5efea] text-[#006b5d] border border-[#80f3dd] rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">psychology</span>
            <span>Synthesize Justification via AI</span>
          </button>
        </div>
      </div>
    </div>
  );
};
