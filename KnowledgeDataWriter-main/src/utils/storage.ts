import type { QAItem, SegmentItem } from '../types/index';

// 本地存储键名
const STORAGE_KEYS = {
  QA_DATA: 'qaData',
  SEGMENT_DATA: 'segmentData',
  LAST_SAVED_TIME: 'lastSavedTime',
} as const;

// 保存QA数据到本地存储
export const saveQAData = (qaData: QAItem[]): void => {
  localStorage.setItem(STORAGE_KEYS.QA_DATA, JSON.stringify(qaData));
  localStorage.setItem(STORAGE_KEYS.LAST_SAVED_TIME, new Date().toISOString());
};

// 从本地存储加载QA数据
export const loadQAData = (): QAItem[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.QA_DATA);
  return stored ? JSON.parse(stored) : [];
};

// 保存分段数据到本地存储
export const saveSegmentData = (segmentData: SegmentItem[]): void => {
  localStorage.setItem(STORAGE_KEYS.SEGMENT_DATA, JSON.stringify(segmentData));
  localStorage.setItem(STORAGE_KEYS.LAST_SAVED_TIME, new Date().toISOString());
};

// 从本地存储加载分段数据
export const loadSegmentData = (): SegmentItem[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.SEGMENT_DATA);
  return stored ? JSON.parse(stored) : [];
};

// 获取最后保存时间
export const getLastSavedTime = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.LAST_SAVED_TIME);
};

// 清空所有数据
export const clearAllData = (): void => {
  localStorage.removeItem(STORAGE_KEYS.QA_DATA);
  localStorage.removeItem(STORAGE_KEYS.SEGMENT_DATA);
  localStorage.removeItem(STORAGE_KEYS.LAST_SAVED_TIME);
};

// 导出QA数据为文本
export const exportQAData = (qaData: QAItem[], separator: string = '\n\n\n'): void => {
  const content = qaData
    .filter(item => item.question.trim() && item.answer.trim()) // 只导出完整的QA对
    .map((item, index) => `Q${index + 1}: ${item.question}\nA${index + 1}: ${item.answer}`)
    .join(separator);
  
  downloadTextFile(content, 'qa-data');
};

// 导出分段数据为文本
export const exportSegmentData = (segmentData: SegmentItem[]): void => {
  const content = segmentData
    .map((item, index) => `段落${index + 1}: ${item.content}`)
    .join('\n');
  
  downloadTextFile(content, 'segment-data');
};

// 下载文本文件
const downloadTextFile = (content: string, prefix: string): void => {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const filename = `${prefix}-${timestamp}.txt`;
  
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