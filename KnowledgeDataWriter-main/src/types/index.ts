// 数据类型定义
export interface QAItem {
  id: string;
  question: string;
  answer: string;
}

export interface SegmentItem {
  id: string;
  content: string;
}

export type InputMode = 'qa' | 'segment';

export interface AppState {
  mode: InputMode;
  qaData: QAItem[];
  segmentData: SegmentItem[];
  currentQAIndex: number;
  lastSavedTime: string | null;
}