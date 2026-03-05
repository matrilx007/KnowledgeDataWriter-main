import type { QAItem, SegmentItem } from './index';

export interface HistoryRecord {
  id: string;
  name: string;
  type: 'qa' | 'segment';
  data: QAItem[] | SegmentItem[];
  separator?: string; // 仅用于QA类型
  createdAt: string;
  updatedAt: string;
}

export interface HistoryState {
  records: HistoryRecord[];
  currentRecord: HistoryRecord | null;
}