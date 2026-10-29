import React, { useState, useEffect } from 'react';
import { AISettings } from './types';
import { loadSettings, saveSettings, requestAIGeneration } from './api';
import { Settings as SettingsIcon, Key, Cpu, Sliders, CheckCircle2, AlertTriangle, ShieldCheck, X } from 'lucide-react';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (settings: AISettings) => void;
}

export const Settings: React.FC<SettingsProps> = ({ isOpen, onClose, onSave }) => {
  const [settings, setSettings] = useState<AISettings>(loadSettings());
  const [showKey, setShowKey] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSettings(loadSettings());
      setStatusMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings(settings);
    setStatusMessage({ type: 'success', text: 'AI configuration saved to secure client browser session.' });
    if (onSave) onSave(settings);
    setTimeout(() => {
      onClose();
    }, 900);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setStatusMessage(null);
    try {
      const res = await requestAIGeneration('general_query', { test: true }, 'Verify institutional curriculum auditor connection');
      if (res.success) {
        setStatusMessage({
          type: 'success',
          text: `Verification passed with headers [x-llm-provider: ${settings.provider}, x-llm-model: ${settings.model}]. Ready for curriculum synthesis.`,
        });
      } else {
        setStatusMessage({ type: 'error', text: res.warning || 'Verification failed. Please check credentials.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err?.message || 'Connection test failed.' });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div
        className="w-full max-w-xl bg-white border border-[#E2E8F0] rounded shadow-xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-labelledby="ai-settings-title"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-[#1E3A5F] text-white flex items-center justify-between border-b border-[#022448]">
          <div className="flex items-center space-x-2.5">
            <SettingsIcon className="w-5 h-5 text-[#0F9D8A]" />
            <div>
              <h2 id="ai-settings-title" className="text-base font-semibold tracking-tight text-white">
                Curriculum AI Engine Settings
              </h2>
              <p className="text-xs text-slate-300">
                Configure generative model parameters for accreditation audits & outcome mapping
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-300 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content / Form */}
        <form onSubmit={handleSave} className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* Compliance & Security Callout */}
          <div className="flex items-start space-x-3 p-3.5 bg-[#EFF4FF] border-l-4 border-[#0F9D8A] rounded-r">
            <ShieldCheck className="w-5 h-5 text-[#006B5D] shrink-0 mt-0.5" />
            <div className="text-xs text-[#1F2937] leading-relaxed">
              <span className="font-semibold text-[#1E3A5F]">Security Boundary Enforced:</span> API keys remain strictly within your local browser sandbox and are passed via secure request headers (<code>x-llm-provider</code>, <code>x-llm-key</code>, <code>x-llm-model</code>). No keys are ever written to code, server storage, or environment files.
            </div>
          </div>

          {/* Provider Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider">
              LLM Provider
            </label>
            <div className="relative">
              <select
                value={settings.provider}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    provider: e.target.value as any,
                    model:
                      e.target.value === 'google'
                        ? 'gemini-2.5-flash'
                        : e.target.value === 'anthropic'
                        ? 'claude-3-7-sonnet'
                        : e.target.value === 'openai'
                        ? 'gpt-4o'
                        : 'local-audit-model',
                  })
                }
                className="w-full h-10 px-3 bg-white border border-[#E2E8F0] rounded text-sm text-[#1F2937] academic-focus transition-all"
              >
                <option value="google">Google Gemini (Recommended for Higher Education)</option>
                <option value="anthropic">Anthropic Claude (3.7 Sonnet / 3.5 Sonnet)</option>
                <option value="openai">OpenAI (GPT-4o / o3-mini)</option>
                <option value="custom">Local Academic Model / Ollama Proxy</option>
              </select>
            </div>
          </div>

          {/* API Key */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#1F2937] uppercase tracking-wider flex items-center space-x-1.5">
                <Key className="w-3.5 h-3.5 text-[#64748B]" />
                <span>API Secret Key</span>
              </label>
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="text-xs text-[#0F9D8A] hover:underline font-medium"
              >
                {showKey ? 'Hide Key' : 'Reveal Key'}
              </button>
            </div>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={settings.apiKey}
                onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                placeholder={settings.provider === 'google' ? 'AIzaSy...' : 'sk-...'}
                className="w-full h-10 px-3 font-mono text-xs bg-white border border-[#E2E8F0] rounded text-[#1F2937] academic-focus transition-all"
              />
            </div>
            <p className="text-[11px] text-[#64748B]">
              Leave empty to utilize the embedded institutional curriculum validation rules engine.
            </p>
          </div>

          {/* Model Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1F2937] uppercase tracking-wider flex items-center space-x-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#64748B]" />
              <span>Model Identifier (x-llm-model)</span>
            </label>
            <input
              type="text"
              value={settings.model}
              onChange={(e) => setSettings({ ...settings, model: e.target.value })}
              className="w-full h-10 px-3 font-mono text-sm bg-white border border-[#E2E8F0] rounded text-[#1F2937] academic-focus"
              placeholder="gemini-2.5-flash"
            />
          </div>

          {/* Temperature Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#1F2937] uppercase tracking-wider flex items-center space-x-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#64748B]" />
                <span>Synthesis Temperature (Determinism)</span>
              </span>
              <span className="font-mono font-medium text-[#1E3A5F] px-2 py-0.5 bg-[#EFF4FF] rounded border border-[#E2E8F0]">
                {settings.temperature.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.temperature}
              onChange={(e) => setSettings({ ...settings, temperature: parseFloat(e.target.value) })}
              className="w-full accent-[#0F9D8A] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#64748B]">
              <span>0.0 (Strict Academic Compliance)</span>
              <span>1.0 (Creative Exploratory)</span>
            </div>
          </div>

          {/* System Prompt Instructions */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider">
              Institutional Rubric Prompt
            </label>
            <textarea
              rows={3}
              value={settings.systemPrompt}
              onChange={(e) => setSettings({ ...settings, systemPrompt: e.target.value })}
              className="w-full p-2.5 text-xs bg-white border border-[#E2E8F0] rounded text-[#1F2937] academic-focus"
              placeholder="Specify institutional guidelines, accreditation body constraints..."
            />
          </div>

          {/* Status Message feedback */}
          {statusMessage && (
            <div
              className={`p-3 text-xs rounded border flex items-start space-x-2 ${
                statusMessage.type === 'success'
                  ? 'bg-[#DCFCE7] border-[#86EFAC] text-[#15803D]'
                  : statusMessage.type === 'error'
                  ? 'bg-[#FEE2E2] border-[#FCA5A5] text-[#B91C1C]'
                  : 'bg-[#EFF4FF] border-[#ADC8F5] text-[#1E3A5F]'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              <span className="leading-tight">{statusMessage.text}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-between border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting}
              className="px-3 py-2 text-xs font-semibold text-[#1E3A5F] border border-[#1E3A5F] hover:bg-[#F1F5F9] rounded transition-colors disabled:opacity-50"
            >
              {isTesting ? 'Verifying Headers...' : 'Test Connection'}
            </button>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-medium text-[#64748B] hover:text-[#1F2937] hover:bg-[#E2E8F0] rounded transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-[#1E3A5F] hover:bg-[#152A45] rounded transition-colors shadow-xs"
              >
                Save AI Configuration
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
