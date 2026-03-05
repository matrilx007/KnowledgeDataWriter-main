import React, { useState, useEffect, useCallback } from 'react';
import type { InputMode, QAItem, SegmentItem } from './types/index';
import { 
  saveQAData, 
  loadQAData, 
  saveSegmentData, 
  loadSegmentData, 
  exportQAData, 
  exportSegmentData, 
  clearAllData,
  getLastSavedTime 
} from './utils/storage';
import Navigation from './components/Navigation';
import QAInput from './components/QAInput';
import SegmentInput from './components/SegmentInput';
import Toast from './components/Toast';
import HistoryManager from './components/HistoryManager';
import type { HistoryRecord } from './types/history';

function App() {
  const [mode, setMode] = useState<InputMode>('qa');
  const [qaData, setQAData] = useState<QAItem[]>([]);
  const [segmentData, setSegmentData] = useState<SegmentItem[]>([]);
  const [qaSeparator, setQASeparator] = useState<string>('\n\n\n');
  const [historyOpen, setHistoryOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false
  });

  // 显示提示消息
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type, isVisible: true });
  }, []);

  // 隐藏提示消息
  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, isVisible: false }));
  }, []);

  // 初始化QA数据
  const initializeQAData = useCallback(() => {
    const existingData = loadQAData();
    setQAData(existingData);
  }, []);

  // 组件挂载时加载数据
  useEffect(() => {
    initializeQAData();
    setSegmentData(loadSegmentData());
    
    const lastSaved = getLastSavedTime();
    if (lastSaved) {
      const lastSavedDate = new Date(lastSaved).toLocaleString();
      showToast(`已加载上次保存的数据 (${lastSavedDate})`, 'info');
    }
  }, [initializeQAData, showToast]);

  // 更新QA数据
  const handleUpdateQAData = useCallback((newQAData: QAItem[]) => {
    setQAData(newQAData);
    saveQAData(newQAData); // 自动保存
  }, []);

  // 更新分段数据
  const handleUpdateSegments = useCallback((segments: SegmentItem[]) => {
    setSegmentData(segments);
    saveSegmentData(segments); // 自动保存
  }, []);

  // 导出数据
  const handleExport = useCallback(() => {
    try {
      if (mode === 'qa') {
        const completedQAs = qaData.filter(qa => qa.question.trim() && qa.answer.trim());
        if (completedQAs.length === 0) {
          showToast('请至少完成一个完整的QA对', 'error');
          return;
        }
        exportQAData(qaData, qaSeparator);
        showToast('QA数据导出成功', 'success');
      } else {
        const hasContent = segmentData.some(segment => segment.content.trim() !== '');
        if (!hasContent) {
          showToast('请至少添加一个有内容的段落', 'error');
          return;
        }
        exportSegmentData(segmentData);
        showToast('分段数据导出成功', 'success');
      }
    } catch (error) {
      showToast('导出失败，请重试', 'error');
      console.error('Export error:', error);
    }
  }, [mode, qaData, segmentData, qaSeparator, showToast]);

  // 清空数据
  const handleClear = useCallback(() => {
    if (window.confirm('确定要清空所有数据吗？此操作不可撤销。')) {
      clearAllData();
      if (mode === 'qa') {
        setQAData([]);
      } else {
        setSegmentData([]);
      }
      showToast('数据已清空', 'success');
    }
  }, [mode, showToast]);

  // 打开历史管理器
  const handleOpenHistory = useCallback(() => {
    setHistoryOpen(true);
  }, []);

  // 关闭历史管理器
  const handleCloseHistory = useCallback(() => {
    setHistoryOpen(false);
  }, []);

  // 加载历史记录
  const handleLoadHistory = useCallback((record: HistoryRecord) => {
    if (record.type === 'qa') {
      setQAData(record.data as QAItem[]);
      if (record.separator) {
        setQASeparator(record.separator);
      }
      showToast(`已加载QA记录: ${record.name}`, 'success');
    } else {
      setSegmentData(record.data as SegmentItem[]);
      showToast(`已加载分段记录: ${record.name}`, 'success');
    }
    // 切换到对应的模式
    setMode(record.type);
  }, [showToast]);

  // 保存当前数据为新历史记录
  const handleSaveAsNew = useCallback((name: string) => {
    showToast(`已保存记录: ${name}`, 'success');
  }, [showToast]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        currentMode={mode} 
        onModeChange={setMode} 
        onOpenHistory={handleOpenHistory} 
      />
      
      <main className="py-8">
        {mode === 'qa' ? (
          <QAInput
            qaData={qaData}
            onUpdateQAData={handleUpdateQAData}
            onExport={handleExport}
            onClear={handleClear}
            separator={qaSeparator}
            onSeparatorChange={setQASeparator}
            onSaveToHistory={handleOpenHistory}
          />
        ) : (
          <SegmentInput
            segmentData={segmentData}
            onUpdateSegments={handleUpdateSegments}
            onExport={handleExport}
            onClear={handleClear}
            onSaveToHistory={handleOpenHistory}
          />
        )}
      </main>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      <HistoryManager
        isOpen={historyOpen}
        onClose={handleCloseHistory}
        currentType={mode}
        currentData={mode === 'qa' ? qaData : segmentData}
        currentSeparator={mode === 'qa' ? qaSeparator : undefined}
        onLoadHistory={handleLoadHistory}
        onSaveAsNew={handleSaveAsNew}
      />
    </div>
  );
}

export default App;
