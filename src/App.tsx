import React, { useState } from 'react';
import { CourseSpecification, UserRole, PipelinePage } from './types';
import { INITIAL_COURSE_SPECIFICATION } from './api';
import { AppHeader } from './components/AppHeader';
import { AppSidebar } from './components/AppSidebar';
import { Page1UploadIngest } from './components/Page1UploadIngest';
import { Page2CourseSpec } from './components/Page2CourseSpec';
import { Page3MatrixMap } from './components/Page3MatrixMap';
import { Page4ValidationChecks } from './components/Page4ValidationChecks';
import { Page5ApprovalWorkflow } from './components/Page5ApprovalWorkflow';
import { Page6ExportPublish } from './components/Page6ExportPublish';
import { Settings } from './Settings';
import { AIAssistantModal } from './components/AIAssistantModal';

export default function App() {
  const [course, setCourse] = useState<CourseSpecification>(INITIAL_COURSE_SPECIFICATION);
  const [currentRole, setCurrentRole] = useState<UserRole>('author');
  const [currentPage, setCurrentPage] = useState<PipelinePage>('upload');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [assistantPrompt, setAssistantPrompt] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleOpenAIAssistantWithPrompt = (prompt: string) => {
    setAssistantPrompt(prompt);
    setIsAIAssistantOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#121c2a] flex flex-col font-['Inter'] antialiased">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-[#27313f] text-[#eaf1ff] px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 text-xs animate-in fade-in slide-in-from-top-4 duration-200 no-print">
          <span className="material-symbols-outlined text-[#83f6e0] text-[20px]">task_alt</span>
          <span className="font-medium">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white"
          >
            ×
          </button>
        </div>
      )}

      {/* Fixed Top Navigation Shell */}
      <AppHeader
        course={course}
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAIAssistant={() => {
          setAssistantPrompt('');
          setIsAIAssistantOpen(true);
        }}
      />

      {/* Fixed Left Workflow Pipeline Sidebar */}
      <AppSidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      {/* Main Viewport Content Area with Left Sidebar Offset */}
      <div className="pl-64 pt-16 min-h-screen flex flex-col">
        <main className="flex-1 w-full pb-16">
          {currentPage === 'upload' && (
            <Page1UploadIngest
              course={course}
              onUpdateCourse={setCourse}
              currentRole={currentRole}
              onNavigate={setCurrentPage}
              showNotification={showNotification}
            />
          )}

          {currentPage === 'spec' && (
            <Page2CourseSpec
              course={course}
              onUpdateCourse={setCourse}
              currentRole={currentRole}
              onNavigate={setCurrentPage}
              showNotification={showNotification}
              onOpenAIAssistantWithPrompt={handleOpenAIAssistantWithPrompt}
            />
          )}

          {currentPage === 'mapping' && (
            <Page3MatrixMap
              course={course}
              onUpdateCourse={setCourse}
              currentRole={currentRole}
              onNavigate={setCurrentPage}
              showNotification={showNotification}
              onOpenAIAssistantWithPrompt={handleOpenAIAssistantWithPrompt}
            />
          )}

          {currentPage === 'checks' && (
            <Page4ValidationChecks
              course={course}
              onUpdateCourse={setCourse}
              currentRole={currentRole}
              onNavigate={setCurrentPage}
              showNotification={showNotification}
              onOpenAIAssistantWithPrompt={handleOpenAIAssistantWithPrompt}
            />
          )}

          {currentPage === 'workflow' && (
            <Page5ApprovalWorkflow
              course={course}
              onUpdateCourse={setCourse}
              currentRole={currentRole}
              onNavigate={setCurrentPage}
              showNotification={showNotification}
            />
          )}

          {currentPage === 'export' && (
            <Page6ExportPublish
              course={course}
              onUpdateCourse={setCourse}
              currentRole={currentRole}
              onNavigate={setCurrentPage}
              showNotification={showNotification}
            />
          )}
        </main>
      </div>

      {/* Restyled AI Settings Modal (Headers: x-llm-provider, x-llm-key, x-llm-model) */}
      <Settings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* AI Curriculum Assistant Modal */}
      <AIAssistantModal
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        course={course}
        initialPrompt={assistantPrompt}
      />
    </div>
  );
}
