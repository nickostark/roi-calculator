import React, { useState } from 'react';
import { Calculator, TrendingUp, Lock, Users, FileText, Briefcase, GraduationCap } from 'lucide-react';

type ScenarioKey = 'content' | 'consulting' | 'therapy' | 'legal' | 'education';

const ROICalculator = () => {
  const [activeScenario, setActiveScenario] = useState<ScenarioKey>('content');
  
  const scenarios = {
    content: {
      name: "Content Creator",
      icon: FileText,
      color: "bg-blue-500",
      description: "Voice memos → polished content",
      inputs: {
        recordingsPerMonth: 20,
        minutesManual: 35,
        minutesAuto: 8,
        hourlyRate: 35,
        avgRecordingMinutes: 5
      }
    },
    consulting: {
      name: "Consulting Firm",
      icon: Briefcase,
      color: "bg-purple-500",
      description: "Client calls → documented insights",
      inputs: {
        recordingsPerMonth: 40,
        minutesManual: 30,
        minutesAuto: 10,
        hourlyRate: 150,
        avgRecordingMinutes: 45
      }
    },
    therapy: {
      name: "Private Practice",
      icon: Users,
      color: "bg-green-500",
      description: "Session notes without typing",
      inputs: {
        recordingsPerMonth: 75,
        minutesManual: 18,
        minutesAuto: 5,
        hourlyRate: 160,
        avgRecordingMinutes: 50
      }
    },
    legal: {
      name: "Legal Team",
      icon: Lock,
      color: "bg-red-500",
      description: "Privileged calls → secure transcripts",
      inputs: {
        recordingsPerMonth: 30,
        minutesManual: 15,
        minutesAuto: 5,
        hourlyRate: 315,
        avgRecordingMinutes: 35
      }
    },
    education: {
      name: "Education Business",
      icon: GraduationCap,
      color: "bg-orange-500",
      description: "Course content → materials",
      inputs: {
        recordingsPerMonth: 12,
        minutesManual: 180,
        minutesAuto: 45,
        hourlyRate: 50,
        avgRecordingMinutes: 60
      }
    }
  };

  const current = scenarios[activeScenario];
  const { recordingsPerMonth, minutesManual, minutesAuto, hourlyRate, avgRecordingMinutes } = current.inputs;
  
  // Calculations
  const timeSavedPerRecording = minutesManual - minutesAuto;
  const timeSavedPerMonth = (timeSavedPerRecording * recordingsPerMonth) / 60;
  const moneySavedPerMonth = timeSavedPerMonth * hourlyRate;
  const moneySavedPerYear = moneySavedPerMonth * 12;
  
  // API comparison
  // Whisper API: $0.006/min; 
  // AI Processing (summary, formatting, extraction): ~$0.019/min - assumes Claude Sonnet or GPT-4
  
  const apiCostPerMinute = 0.025;
  const apiCostPerRecording = avgRecordingMinutes * apiCostPerMinute;
  const apiCostPerMonth = apiCostPerRecording * recordingsPerMonth;
  const apiCostPerYear = apiCostPerMonth * 12;
  
  // Setup cost per scenario (one-time) 
  const setupHours = activeScenario === 'legal' ? 4 : activeScenario === 'consulting' ? 6 : 5;
  const setupTimeCost = setupHours * hourlyRate;
  const vpsYearlyCost = activeScenario === 'content' ? 175 : // midpoint ($150-200)
    activeScenario === 'consulting' ? 400 : // midpoint ($350-450)
      activeScenario === 'therapy' ? 525 : // midpoint ($450-600)
        activeScenario === 'legal' ? 450 : // midpoint ($400-500)
          activeScenario === 'education' ? 350 : // midpoint ($300-400)
            175; // fallback
  
  
  // Break-even
  const totalFirstYearCost = setupTimeCost + vpsYearlyCost;
  const totalFirstYearSavings = moneySavedPerYear + apiCostPerYear;
  const netFirstYearSavings = Math.ceil(totalFirstYearSavings - totalFirstYearCost);
  const breakEvenMonths = totalFirstYearCost > 0 ? Math.ceil(totalFirstYearCost / (moneySavedPerMonth + apiCostPerMonth)) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3">
            <Lock className="w-8 h-8 text-slate-700" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Private Transcription ROI
            </h1>
          </div>
          <p className="text-slate-600 text-sm mt-2">
            Self-hosted vs. external APIs
          </p>
        </div>
        {/* <div className="text-center mb-8">
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Real cost analysis: Self-hosted transcription vs. external APIs
          </p>
        </div> */}

        {/*** Scenario selector ***/}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
          {Object.entries(scenarios).map(([key, scenario]) => {
            const Icon = scenario.icon;
            const isActive = activeScenario === key;
            return (
              <button
                key={key}
                onClick={() => setActiveScenario(key as ScenarioKey)}
                className={`p-4 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-white shadow-lg ring-2 ring-slate-900 scale-105' 
                    : 'bg-white hover:shadow-md hover:scale-102'
                }`}
              >
                <div className={`w-12 h-12 ${scenario.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-sm font-semibold text-slate-900">{scenario.name}</div>
                <div className="text-xs text-slate-500 mt-1">{scenario.description}</div>
              </button>
            );
          })}
        </div>

        {/*** Results ***/}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-[#720404]">
            <div className="text-sm font-medium text-slate-600 mb-2">Time Saved Monthly</div>
            <div className="text-4xl font-bold text-slate-900">{timeSavedPerMonth.toFixed(1)}</div>
            <div className="text-sm text-slate-500 mt-1">hours reclaimed</div>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="text-xs text-slate-600">
                {timeSavedPerRecording.toFixed(1)} min saved per recording × {recordingsPerMonth} recordings
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-[#4FF9D0]">
            <div className="text-sm font-medium text-slate-600 mb-2">Value Created Monthly</div>
            <div className="text-4xl font-bold text-slate-900">${moneySavedPerMonth.toFixed(0)}</div>
            <div className="text-sm text-slate-500 mt-1">at ${hourlyRate}/hr</div>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="text-xs text-slate-600">
                First year: ${moneySavedPerYear.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-[#053371]">
            <div className="text-sm font-medium text-slate-600 mb-2">API Costs Avoided</div>
            <div className="text-4xl font-bold text-slate-900">${apiCostPerMonth.toFixed(0)}</div>
            <div className="text-sm text-slate-500 mt-1">per month</div>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="text-xs text-slate-600">
                First year: ${apiCostPerYear.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Special note for legal team */}
        {activeScenario === 'legal' && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-900">
                <strong>Note:</strong> Time savings understates true value. Primary benefit is maintaining attorney-client privilege by keeping communications on your infrastructure, with no third-party subpoena risk.
              </div>
            </div>
          </div>
        )}

        {/*** CTA ***/}
        <div className="relative overflow-hidden rounded-2xl p-[1px] mb-8 bg-gradient-to-br from-[#053371] via-[#4FF9D0]/40 to-[#720404]/30 shadow-[0_22px_60px_-45px_rgba(5,51,113,0.9)]">
          <div className="relative rounded-2xl bg-white/90 backdrop-blur-sm p-6 sm:p-8 border border-white/70">
            <div className="pointer-events-none absolute -top-16 -right-12 h-40 w-40 rounded-full bg-[#4FF9D0]/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-16 h-44 w-44 rounded-full bg-[#053371]/15 blur-3xl" />
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <p className="text-lg text-slate-700 max-w-2xl">
              This is one automation. Imagine what 5-10 could save you.
            </p>
            <a
              href="https://cal.com/cognistark/20min-call"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl bg-[#720404] px-10 py-6 text-m font-semibold text-white shadow-lg shadow-[#720404]/30 transition-all hover:bg-[#4a0202] hover:shadow-[#720404]/50 hover:-translate-y-0.5"
            >
              Schedule a call to explore your workflows
            </a>
          </div>
          </div>
        </div>

        {/*** Breakdown ***/}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Calculator className="w-6 h-6" />
            First Year Analysis
          </h2>
          
          <div className="space-y-6">
            {/*** Costs ***/}
            <div>
              <div className="text-sm font-semibold text-slate-700 mb-3">Initial Investment</div>
              <div className="space-y-2 bg-slate-50 rounded-lg p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Setup time (assuming self-setup: {setupHours} hrs @ ${hourlyRate}/hr)</span>
                  <span className="font-medium text-slate-900">${setupTimeCost}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">VPS hosting (annual)</span>
                  <span className="font-medium text-slate-900">${vpsYearlyCost}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-slate-200">
                  <span className="text-slate-700 font-semibold">Total First Year Cost</span>
                  <span className="font-bold text-slate-900">${totalFirstYearCost}</span>
                </div>
              </div>
            </div>

            {/*** Savings ***/}
            <div>
              <div className="text-sm font-semibold text-slate-700 mb-3">First Year Savings</div>
              <div className="space-y-2 bg-green-50 rounded-lg p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Time value reclaimed</span>
                  <span className="font-medium text-green-700">${moneySavedPerYear.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">API costs avoided (minimum, with no buffer for errors)</span>
                  <span className="font-medium text-green-700">${apiCostPerYear.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-green-200">
                  <span className="text-slate-700 font-semibold">Total First Year Savings</span>
                  <span className="font-bold text-green-700">${totalFirstYearSavings.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#4a0202] to-[#720404] rounded-xl p-6 text-[#FAF4EC]">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-medium opacity-90 mb-1">Net First Year Result</div>
                  <div className="text-4xl font-bold">${netFirstYearSavings.toLocaleString()}</div>
                  <div className="text-sm opacity-90 mt-2">
                    Break-even in {breakEvenMonths} {breakEvenMonths === 1 ? 'month' : 'months'}
                  </div>
                </div>
                <TrendingUp className="w-16 h-16 opacity-80" />
              </div>
            </div>
          </div>
        </div>

        {/*** Privacy val ***/}
        <div className="bg-slate-900 rounded-2xl shadow-lg p-8 text-slate-300">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Lock className="w-6 h-6" />
            Beyond the Numbers: Privacy & Control
          </h2>
          <div className="grid sm:grid-cols-2 gap-6 text-sm">
            <div>
              <div className="font-semibold mb-2 text-blue-400">What You Keep</div>
              <ul className="space-y-1 text-slate-300">
                <li>• Client confidentiality intact</li>
                <li>• No third-party data processing agreements</li>
                <li>• Full audit trail on your infrastructure</li>
                <li>• No AI training on your conversations</li>
              </ul>
            </div>
            <div>
              <div className="font-semibold mb-2 text-green-200">What You Avoid</div>
              <ul className="space-y-1 text-slate-300">
                <li>• Vendor lock-in & price increases</li>
                <li>• Compliance audits explaining third-party tools</li>
                <li>• Data breach liability from external services</li>
                <li>• Client concerns about recording tools</li>
              </ul>
            </div>
          </div>
        </div>

        {/*** Footnote ***/}
        {/* <div className="mt-8 text-center text-sm text-slate-500">
          <p>Assumptions: API costs at {apiCostPerMinute}/min (Whisper, Claude Sonnet/GPT-4), {setupHours}-hour setup, ~${Math.ceil(vpsYearlyCost/12)}/month VPS hosting</p>
          <p className="mt-2">Your actual savings will vary based on call volume, audio quality, and hourly rate</p>
        </div> */}
        <footer className="mt-16 text-center text-slate-500 text-sm space-y-1">
          <p>© 2026 CogniStark.com</p>
          <p>
            <a
              href="mailto:contact@cognistark.com"
              className="text-slate-600 hover:text-slate-800 underline decoration-slate-400/70 hover:decoration-slate-700 transition"
            >
              contact@cognistark.com
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default ROICalculator;