import type { HistoryRecord } from '../types/history';
import type { QAItem, SegmentItem } from '../types/index';

const HISTORY_STORAGE_KEY = 'dataEntryHistory';

// 保存历史记录
export const saveHistoryRecord = (
  name: string,
  type: 'qa' | 'segment',
  data: QAItem[] | SegmentItem[],
  separator?: string
): HistoryRecord => {
  const now = new Date().toISOString();
  const record: HistoryRecord = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    name,
    type,
    data,
    separator,
    createdAt: now,
    updatedAt: now
  };

  const existingRecords = getHistoryRecords();
  const updatedRecords = [record, ...existingRecords];
  
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedRecords));
  return record;
};

// 获取所有历史记录
export const getHistoryRecords = (): HistoryRecord[] => {
  const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

// 更新历史记录
export const updateHistoryRecord = (
  id: string,
  name: string,
  data: QAItem[] | SegmentItem[],
  separator?: string
): HistoryRecord | null => {
  const records = getHistoryRecords();
  const recordIndex = records.findIndex(r => r.id === id);
  
  if (recordIndex === -1) return null;

  const updatedRecord: HistoryRecord = {
    ...records[recordIndex],
    name,
    data,
    separator,
    updatedAt: new Date().toISOString()
  };

  records[recordIndex] = updatedRecord;
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(records));
  return updatedRecord;
};

// 删除历史记录
export const deleteHistoryRecord = (id: string): void => {
  const records = getHistoryRecords();
  const filteredRecords = records.filter(r => r.id !== id);
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(filteredRecords));
};

// 清空所有历史记录
export const clearAllHistory = (): void => {
  localStorage.removeItem(HISTORY_STORAGE_KEY);
};

// 导出历史记录数据
export const exportHistoryRecord = (record: HistoryRecord): void => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  let content = '';
  let filename = '';

  if (record.type === 'qa') {
    const qaData = record.data as QAItem[];
    const separator = record.separator || '\n\n\n';
    content = qaData
      .filter(item => item.question.trim() && item.answer.trim())
      .map((item, index) => `Q${index + 1}: ${item.question}\nA${index + 1}: ${item.answer}`)
      .join(separator);
    filename = `qa-${record.name}-${timestamp}.txt`;
  } else {
    const segmentData = record.data as SegmentItem[];
    content = segmentData
      .map((item, index) => `段落${index + 1}: ${item.content}`)
      .join('\n');
    filename = `segment-${record.name}-${timestamp}.txt`;
  }

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};