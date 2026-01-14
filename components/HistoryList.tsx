import React from 'react';
import { SpeedResult } from '../types';
import { Clock, Download, Upload } from 'lucide-react';

interface HistoryListProps {
  history: SpeedResult[];
}

const HistoryList: React.FC<HistoryListProps> = ({ history }) => {
  if (history.length === 0) {
    return (
      <div className="p-8 text-center glass-panel rounded-3xl opacity-50 italic">
        No recent tests yet. Start one above!
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      {history.map((test) => (
        <article key={test.id} className="glass-panel p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 transition-hover hover:bg-white/10">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-bold leading-none">
                {new Date(test.timestamp).toLocaleDateString()}
              </p>
              <p className="text-xs opacity-60">
                {new Date(test.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-white/70" />
              <div>
                <span className="font-black text-lg">{test.downloadSpeed.toFixed(1)}</span>
                <span className="text-[10px] ml-1 opacity-70 uppercase">Mbps</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-white/70" />
              <div>
                <span className="font-black text-lg">{test.uploadSpeed.toFixed(1)}</span>
                <span className="text-[10px] ml-1 opacity-70 uppercase">Mbps</span>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};

export default HistoryList;