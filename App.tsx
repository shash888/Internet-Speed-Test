import React, { useState, useEffect } from 'react';
import { RefreshCw, Play, Info, AlertTriangle, Github, Zap, History, CheckCircle2 } from 'lucide-react';
import { SpeedResult, TestState } from './types.ts';
import { measureDownloadSpeed, measureUploadSpeed, measurePing } from './services/speedTest.ts';
import SpeedGauge from './components/SpeedGauge.tsx';
import HistoryList from './components/HistoryList.tsx';

const LOCAL_STORAGE_KEY = 'swiftspeed_results_v1';

const App: React.FC = () => {
  const [history, setHistory] = useState<SpeedResult[]>([]);
  const [pingSuccess, setPingSuccess] = useState(false);
  const [state, setState] = useState<TestState>({
    status: 'IDLE',
    currentDownload: null,
    currentUpload: null,
    currentPing: null,
    error: null,
  });

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch (e) { console.error("History parse error:", e); }
    }
  }, []);

  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(history));
    }
  }, [history]);

  const startTest = async () => {
    setPingSuccess(false);
    setState({ status: 'RUNNING', currentDownload: 0, currentUpload: 0, currentPing: 0, error: null });

    try {
      const ping = await measurePing();
      setState(prev => ({ ...prev, currentPing: ping }));
      setPingSuccess(true);

      const [finalDownload, finalUpload] = await Promise.all([
        measureDownloadSpeed((p) => setState(prev => ({ ...prev, currentDownload: p }))),
        measureUploadSpeed((p) => setState(prev => ({ ...prev, currentUpload: p })))
      ]);

      const newResult: SpeedResult = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        downloadSpeed: finalDownload,
        uploadSpeed: finalUpload,
        ping: ping
      };

      setHistory(prev => [newResult, ...prev].slice(0, 5));
      setState(prev => ({ 
        ...prev, 
        status: 'COMPLETED',
        currentDownload: finalDownload,
        currentUpload: finalUpload
      }));

    } catch (err) {
      setState(prev => ({ ...prev, status: 'ERROR', error: 'Connection lost. Try again.' }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 md:py-20 flex flex-col min-h-screen w-full">
      <header className="mb-12 text-center animate-in">
        <div className="inline-flex items-center gap-2 bg-white text-[#E50914] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 shadow-xl">
          <Zap className="w-3 h-3 fill-current" /> Instant Engine
        </div>
        <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter mb-4 neon-text-shadow leading-none">
          SwiftSpeed
        </h1>
        <p className="text-white/70 font-bold text-lg max-w-sm mx-auto leading-tight">
          Reliable. Fast. Accurate. The only speed test you'll ever need.
        </p>
      </header>

      <main className="flex-grow space-y-12">
        <section className="relative glass-panel rounded-[2.5rem] p-8 md:p-12 text-center shadow-2xl overflow-hidden">
          <div className="relative z-10">
            <div className="grid grid-cols-3 gap-3 md:gap-6 mb-12">
              <div className="relative">
                <SpeedGauge value={state.currentPing || 0} label="Ping" unit="ms" active={state.status === 'RUNNING'} />
                {pingSuccess && state.status === 'RUNNING' && (
                   <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1 shadow-lg animate-bounce">
                     <CheckCircle2 className="w-4 h-4 text-white" />
                   </div>
                )}
              </div>
              <SpeedGauge value={state.currentDownload || 0} label="Down" unit="Mbps" active={state.status === 'RUNNING'} />
              <SpeedGauge value={state.currentUpload || 0} label="Up" unit="Mbps" active={state.status === 'RUNNING'} />
            </div>
            
            <div className="flex flex-col items-center">
              {state.status === 'ERROR' && (
                <div className="flex items-center gap-2 text-yellow-300 mb-6 font-bold">
                  <AlertTriangle className="w-5 h-5" /> {state.error}
                </div>
              )}

              {pingSuccess && state.status === 'RUNNING' && (
                <div className="text-green-300 text-xs font-bold uppercase tracking-widest mb-4 animate-in">
                  Ping Measured Successfully!
                </div>
              )}

              <button
                onClick={startTest}
                disabled={state.status === 'RUNNING'}
                className="group relative flex items-center justify-center gap-4 bg-white text-[#E50914] hover:bg-black hover:text-white px-12 py-6 rounded-full font-black text-2xl uppercase tracking-tighter transition-all duration-300 transform active:scale-95 disabled:opacity-50 shadow-2xl"
              >
                {state.status === 'RUNNING' ? (
                  <RefreshCw className="w-7 h-7 animate-spin" />
                ) : (
                  <Play className="w-7 h-7 fill-current group-hover:scale-110 transition-transform" />
                )}
                {state.status === 'RUNNING' ? 'Testing...' : 'START'}
              </button>
              
              <p className="mt-6 text-xs font-black uppercase tracking-widest opacity-40">
                {state.status === 'RUNNING' ? 'Connecting to nearest server' : 'Press START to start test'}
              </p>
            </div>
          </div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-2">
              <History className="w-5 h-5" /> History
            </h2>
            <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Last 5 results</span>
          </div>
          <HistoryList history={history} />
        </section>
      </main>

      <footer className="mt-20 py-10 border-t border-white/5 text-center">
        <div className="flex justify-center gap-8 mb-6 text-white/40">
          <a href="#" className="hover:text-white transition-colors"><Info className="w-5 h-5" /></a>
          <a href="#" className="hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">
          © {new Date().getFullYear()} MySwiftSpeedTest.com
        </p>
      </footer>
    </div>
  );
};

export default App;