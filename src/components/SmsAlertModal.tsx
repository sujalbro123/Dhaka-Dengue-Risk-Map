import React, { useState } from 'react';
import { ComputedAreaRisk, SentAlertLog } from '../types';
import { Smartphone, Send, CheckCircle2, ShieldAlert, History, X, Bell, Siren } from 'lucide-react';

interface SmsAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  areas: ComputedAreaRisk[];
  initialAreaId?: string;
  onSendAlert: (alert: SentAlertLog) => void;
  sentAlerts: SentAlertLog[];
}

export const SmsAlertModal: React.FC<SmsAlertModalProps> = ({
  isOpen,
  onClose,
  areas,
  initialAreaId,
  onSendAlert,
  sentAlerts,
}) => {
  const [selectedAreaId, setSelectedAreaId] = useState<string>(
    initialAreaId || areas.find((a) => a.riskLevel === 'critical' || a.riskLevel === 'high')?.id || areas[0]?.id || ''
  );
  const [channel, setChannel] = useState<'SMS' | 'Emergency Push' | 'Public Broadcast'>('SMS');
  const [sentSuccess, setSentSuccess] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'phone' | 'log'>('phone');

  if (!isOpen) return null;

  const targetArea = areas.find((a) => a.id === selectedAreaId) || areas[0];

  const defaultMessage = `GOVT DENGUE ALERT [DGHS/DDRM]: High dengue risk alert: ${
    targetArea?.name || 'Dhaka Zone'
  } (Risk score: ${
    targetArea?.riskScore100 || 85
  }/100) — residents advised to remove standing water from flowerpots, tires & roof tanks, and use mosquito nets immediately.`;

  const [messageText, setMessageText] = useState(defaultMessage);

  // Update default message when target area changes
  const handleAreaChange = (id: string) => {
    setSelectedAreaId(id);
    const area = areas.find((a) => a.id === id);
    if (area) {
      setMessageText(
        `GOVT DENGUE ALERT [DGHS/DDRM]: High dengue risk alert: ${area.name} (Risk score: ${area.riskScore100}/100) — residents advised to remove standing water from flowerpots, tires & roof tanks, and use mosquito nets immediately.`
      );
    }
  };

  const handleSimulateSend = () => {
    if (!targetArea) return;
    const estimatedRecipients = Math.round(targetArea.population * 0.15); // e.g. 15% mobile users in zone
    const newAlert: SentAlertLog = {
      id: `alert-${Date.now()}`,
      areaId: targetArea.id,
      areaName: targetArea.name,
      riskScore: targetArea.riskScore100,
      riskLevel: targetArea.riskLevel,
      channel,
      message: messageText,
      recipientCount: estimatedRecipients,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' today',
    };

    onSendAlert(newAlert);
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="bg-[#0f1218] border border-[#E3E1DA]/20 rounded-sm max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-red-500/20 text-red-400 rounded-sm border border-red-500/30">
              <Siren className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Simulate public SMS & emergency broadcast
              </h3>
              <p className="text-xs text-slate-400">
                Lock screen preview for demonstration
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab switch */}
            <div className="flex items-center bg-slate-900 p-1 rounded-sm border border-slate-800">
              <button
                onClick={() => setActiveTab('phone')}
                className={`px-3 py-1 text-xs font-semibold rounded-sm transition-colors flex items-center gap-1 ${
                  activeTab === 'phone' ? 'bg-[#1F3A5F] text-white border border-[#E3E1DA]/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                Phone simulator
              </button>
              <button
                onClick={() => setActiveTab('log')}
                className={`px-3 py-1 text-xs font-semibold rounded-sm transition-colors flex items-center gap-1 ${
                  activeTab === 'log' ? 'bg-[#1F3A5F] text-white border border-[#E3E1DA]/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                Sent log ({sentAlerts.length})
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-sm transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'phone' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
              {/* Left Column: Form Controls */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Select target zone
                  </label>
                  <select
                    value={selectedAreaId}
                    onChange={(e) => handleAreaChange(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-500"
                  >
                    {areas.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.corporation}) — Score: {a.riskScore100}/100 [{a.riskLevel.toUpperCase()}]
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Alert delivery channel
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['SMS', 'Emergency Push', 'Public Broadcast'] as const).map((ch) => (
                      <button
                        key={ch}
                        type="button"
                        onClick={() => setChannel(ch)}
                        className={`py-2 px-2 text-xs font-semibold rounded-sm border text-center transition-colors ${
                          channel === ch
                            ? 'bg-slate-800 border-white text-white'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {ch}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Alert message body
                  </label>
                  <textarea
                    rows={4}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-sm p-3 text-xs text-slate-200 focus:outline-none focus:border-slate-500 leading-relaxed font-mono"
                  />
                </div>

                <div className="p-3 bg-slate-900 border border-slate-800 rounded-sm text-xs text-slate-300 flex items-center justify-between">
                  <span>Est. mobile subscribers reached:</span>
                  <strong className="font-mono text-sm text-white">
                    {targetArea ? Math.round(targetArea.population * 0.15).toLocaleString() : '0'} residents
                  </strong>
                </div>

                <button
                  type="button"
                  onClick={handleSimulateSend}
                  disabled={sentSuccess}
                  className="w-full py-2.5 bg-[#1F3A5F] hover:bg-[#1a3050] text-white font-bold text-xs uppercase tracking-wider rounded-sm border border-[#E3E1DA]/30 transition-colors flex items-center justify-center gap-2"
                >
                  {sentSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>Alert broadcasted to log</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Simulate broadcast to {targetArea?.name}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Right Column: Simulated Phone Lockscreen Preview */}
              <div className="flex flex-col items-center justify-center">
                <div className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-1">
                  <Smartphone className="w-4 h-4 text-slate-400" />
                  Mobile lock screen preview
                </div>

                <div className="w-full max-w-[280px] bg-black border border-slate-800 rounded-sm p-3 relative overflow-hidden text-slate-100 min-h-[440px] flex flex-col justify-between">
                  {/* Phone Notch */}
                  <div className="w-28 h-4 bg-slate-900 mx-auto rounded-b-sm mb-4 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-sm bg-slate-800" />
                  </div>

                  {/* Lockscreen Clock */}
                  <div className="text-center my-2 font-mono">
                    <div className="text-3xl font-extralight tracking-tight text-slate-200">09:41</div>
                    <div className="text-[10px] text-slate-400 font-medium font-sans">Wednesday, July 22</div>
                  </div>

                  {/* Lock Screen Notification Box */}
                  <div className="my-auto">
                    <div className="bg-slate-900 border border-slate-700 rounded-sm p-3">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pb-1.5 border-b border-slate-800">
                        <div className="flex items-center gap-1 font-bold text-red-400 uppercase tracking-wider">
                          <Bell className="w-3 h-3 text-red-400" />
                          EMERGENCY ALERT
                        </div>
                        <span className="font-mono">NOW</span>
                      </div>

                      <div className="mt-2 text-[11px] text-slate-200 leading-snug font-sans">
                        {messageText}
                      </div>

                      <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[9px] text-slate-400">
                        <span>Issued by DGHS & City Corp</span>
                        <span className="text-slate-300 font-semibold">Swipe to open</span>
                      </div>
                    </div>
                  </div>

                  {/* Home Bar */}
                  <div className="w-20 h-1 bg-slate-700 mx-auto rounded-sm mt-4" />
                </div>
              </div>
            </div>
          ) : (
            /* Sent Log Tab */
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                <span className="font-bold text-slate-300">Simulated alert dispatch history ({sentAlerts.length})</span>
                <span className="text-slate-500">Demo log</span>
              </div>

              {sentAlerts.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">No alert dispatches recorded yet today.</div>
              ) : (
                <div className="space-y-2.5">
                  {sentAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="p-3 bg-slate-900 border border-slate-800 rounded-sm flex flex-col gap-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded-sm font-bold font-mono">
                            {alert.areaName}
                          </span>
                          <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded-sm font-semibold text-[10px]">
                            {alert.channel}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-mono">{alert.timestamp}</span>
                      </div>

                      <p className="text-slate-300 mt-1 leading-relaxed text-[11px] font-mono bg-slate-950 p-2 rounded-sm border border-slate-800/60">
                        {alert.message}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                        <span>Recipients reached: <strong className="font-mono">{alert.recipientCount.toLocaleString()}</strong> mobile devices</span>
                        <span>Status: <strong className="text-emerald-400">Delivered (simulated)</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
