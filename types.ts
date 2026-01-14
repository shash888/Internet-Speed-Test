
export interface SpeedResult {
  id: string;
  timestamp: number;
  downloadSpeed: number;
  uploadSpeed: number;
  ping: number;
}

export type TestStatus = 'IDLE' | 'RUNNING' | 'COMPLETED' | 'ERROR';

export interface TestState {
  status: TestStatus;
  currentDownload: number | null;
  currentUpload: number | null;
  currentPing: number | null;
  error: string | null;
}
