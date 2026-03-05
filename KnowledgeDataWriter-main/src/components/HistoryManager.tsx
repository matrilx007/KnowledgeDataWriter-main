import React, { useState, useEffect } from 'react';
import type { HistoryRecord } from '../types/history';
import type { QAItem, SegmentItem } from '../types/index';
import { 
  getHistoryRecords, 
  saveHistoryRecord, 
  updateHistoryRecord, 
  deleteHistoryRecord, 
  exportHistoryRecord 
} from '../utils/history';

interface HistoryManagerProps {
  isOpen: boolean;
  onClose: () => void;
  currentType: 'qa' | 'segment';
  currentData: QAItem[] | SegmentItem[];
  currentSeparator?: string;
  onLoadHistory: (record: HistoryRecord) => void;
  onSaveAsNew: (name: string) => void;
}

const HistoryManager: React.FC<HistoryManagerProps> = ({
  isOpen,
  onClose,
  currentType,
  currentData,
  currentSeparator,
  onLoadHistory,
  onSaveAsNew
}) => {
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<HistoryRecord | null>(null);

  // 加载历史记录
  useEffect(() => {
    if (isOpen) {
      setRecords(getHistoryRecords());
    }
  }, [isOpen]);

  // 保存当前数据为新记录
  const handleSaveAsNew = () => {
    if (!saveName.trim()) return;
    
    const record = saveHistoryRecord(saveName.trim(), currentType, currentData, currentSeparator);
    setRecords([record, ...records]);
    setSaveModalOpen(false);
    setSaveName('');
    onSaveAsNew(saveName.trim());
  };

  // 更新现有记录
  const handleUpdateRecord = (record: HistoryRecord) => {
    const updatedRecord = updateHistoryRecord(
      record.id, 
      record.name, 
      currentData, 
      currentSeparator
    );
    if (updatedRecord) {
      setRecords(records.map(r => r.id === record.id ? updatedRecord : r));
    }
  };

  // 删除记录
  const handleDeleteRecord = (record: HistoryRecord) => {
    if (window.confirm(`确定要删除记录"${record.name}"吗？`)) {
      deleteHistoryRecord(record.id);
      setRecords(records.filter(r => r.id !== record.id));
    }
  };

  // 加载记录
  const handleLoadRecord = (record: HistoryRecord) => {
    onLoadHistory(record);
    onClose();
  };

  // 格式化日期
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 过滤当前类型的记录
  const filteredRecords = records.filter(r => r.type === currentType);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* 头部 */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">📋 录入历史</h2>
              <p className="text-blue-100 text-sm">
                {currentType === 'qa' ? 'QA问答录入' : '分段文本录入'} - 
                共 {filteredRecords.length} 条记录
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSaveModalOpen(true)}
                className="px-4 py-2 text-sm font-medium bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center space-x-2"
              >
                <span>💾</span>
                <span>保存当前</span>
              </button>
              <button
                onClick={onClose}
                className="text-white hover:text-blue-200 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        {/* 统计信息 */}
        {filteredRecords.length > 0 && (
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                <span>📊 数据统计</span>
                <span>总记录: {filteredRecords.length}</span>
                <span>
                  总条目: {filteredRecords.reduce((acc, record) => {
                    const count = record.type === 'qa' 
                      ? (record.data as QAItem[]).filter(qa => qa.question.trim() && qa.answer.trim()).length
                      : (record.data as SegmentItem[]).filter(seg => seg.content.trim()).length;
                    return acc + count;
                  }, 0)}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                最近更新: {filteredRecords.length > 0 ? formatDate(filteredRecords[0].updatedAt) : '-'}
              </div>
            </div>
          </div>
        )}

        {/* 内容 */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          {filteredRecords.length === 0 ? (
            <div className="text-center py-16 px-6">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-4xl">📝</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  暂无{currentType === 'qa' ? 'QA录入' : '分段录入'}历史记录
                </h3>
                <p className="text-gray-500 mb-6">
                  开始录入数据后，点击"保存当前"来创建您的第一个历史记录
                </p>
                <button
                  onClick={() => setSaveModalOpen(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  💾 保存当前数据
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid gap-4">
                {filteredRecords.map((record, index) => {
                  const dataCount = record.type === 'qa' 
                    ? (record.data as QAItem[]).filter(qa => qa.question.trim() && qa.answer.trim()).length
                    : (record.data as SegmentItem[]).filter(seg => seg.content.trim()).length;

                  const getSeparatorDisplay = (sep: string) => {
                    switch(sep) {
                      case '\n\n\n': return { icon: '📄', text: '三个换行' };
                      case '\n\n': return { icon: '📃', text: '两个换行' };
                      case '\n': return { icon: '📑', text: '一个换行' };
                      case ' ': return { icon: '⎵', text: '空格' };
                      case '\t': return { icon: '↹', text: '制表符' };
                      default: return { icon: '🔧', text: '自定义' };
                    }
                  };

                  return (
                    <div key={record.id} 
                         className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-sm font-bold text-blue-600">
                              {index + 1}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 text-lg">{record.name}</h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                <span className="flex items-center space-x-1">
                                  <span>{record.type === 'qa' ? '❓' : '📝'}</span>
                                  <span>{record.type === 'qa' ? `${dataCount} 个QA对` : `${dataCount} 个段落`}</span>
                                </span>
                                {record.separator && record.type === 'qa' && (
                                  <span className="flex items-center space-x-1 text-gray-500">
                                    <span>{getSeparatorDisplay(record.separator).icon}</span>
                                    <span>{getSeparatorDisplay(record.separator).text}</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span className="flex items-center space-x-1">
                              <span>🕐</span>
                              <span>创建: {formatDate(record.createdAt)}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <span>🔄</span>
                              <span>更新: {formatDate(record.updatedAt)}</span>
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => handleLoadRecord(record)}
                            className="px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors flex items-center space-x-1"
                            title="加载此记录"
                          >
                            <span>📂</span>
                            <span>加载</span>
                          </button>
                          <button
                            onClick={() => handleUpdateRecord(record)}
                            className="px-3 py-2 text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors flex items-center space-x-1"
                            title="用当前数据更新此记录"
                          >
                            <span>🔄</span>
                            <span>更新</span>
                          </button>
                          <button
                            onClick={() => exportHistoryRecord(record)}
                            className="px-3 py-2 text-sm font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors flex items-center space-x-1"
                            title="导出此记录"
                          >
                            <span>📤</span>
                            <span>导出</span>
                          </button>
                          <button
                            onClick={() => handleDeleteRecord(record)}
                            className="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors flex items-center space-x-1"
                            title="删除此记录"
                          >
                            <span>🗑️</span>
                            <span>删除</span>
                          </button>
                        </div>
                      </div>
                      
                      {/* 数据预览 */}
                      <div className="bg-gray-50 rounded-lg p-3 mt-3">
                        <div className="text-xs text-gray-600 mb-2">数据预览:</div>
                        <div className="text-sm text-gray-700 max-h-20 overflow-y-auto">
                          {record.type === 'qa' ? (
                            <div className="space-y-1">
                              {(record.data as QAItem[]).slice(0, 2).map((qa, idx) => (
                                <div key={idx} className="truncate">
                                  <span className="font-medium">Q:</span> {qa.question || '未设置'} 
                                  <span className="mx-2">|</span>
                                  <span className="font-medium">A:</span> {qa.answer || '未设置'}
                                </div>
                              ))}
                              {(record.data as QAItem[]).length > 2 && (
                                <div className="text-gray-500">... 还有 {(record.data as QAItem[]).length - 2} 个QA对</div>
                              )}
                            </div>
                          ) : (
                            <div className="space-y-1">
                              {(record.data as SegmentItem[]).slice(0, 3).map((seg, idx) => (
                                <div key={idx} className="truncate">
                                  <span className="font-medium">段落{idx + 1}:</span> {seg.content || '空段落'}
                                </div>
                              ))}
                              {(record.data as SegmentItem[]).length > 3 && (
                                <div className="text-gray-500">... 还有 {(record.data as SegmentItem[]).length - 3} 个段落</div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 保存弹窗 */}
      {saveModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-t-xl">
              <h3 className="text-lg font-bold flex items-center space-x-2">
                <span>💾</span>
                <span>保存当前数据</span>
              </h3>
              <p className="text-blue-100 text-sm mt-1">
                为当前的{currentType === 'qa' ? 'QA录入' : '分段录入'}数据创建历史记录
              </p>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  记录名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  placeholder={`请输入${currentType === 'qa' ? 'QA' : '分段'}记录名称...`}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  autoFocus
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && saveName.trim()) {
                      handleSaveAsNew();
                    }
                  }}
                />
                <div className="mt-2 text-xs text-gray-500">
                  建议使用描述性名称，如"客户信息收集模板"、"产品评价问卷"等
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3 mb-6">
                <div className="text-sm text-gray-600 mb-1">当前数据概览:</div>
                <div className="text-sm text-gray-800">
                  {currentType === 'qa' ? (
                    <>
                      {(currentData as QAItem[]).filter(qa => qa.question.trim() && qa.answer.trim()).length} 个完整QA对
                      {currentSeparator && (
                        <span className="text-gray-500 ml-2">
                          (分隔符: {currentSeparator === '\n\n\n' ? '三个换行' : 
                                   currentSeparator === '\n\n' ? '两个换行' : 
                                   currentSeparator === '\n' ? '一个换行' : 
                                   currentSeparator === ' ' ? '空格' : 
                                   currentSeparator === '\t' ? '制表符' : '自定义'})
                        </span>
                      )}
                    </>
                  ) : (
                    <>{(currentData as SegmentItem[]).filter(seg => seg.content.trim()).length} 个有效段落</>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setSaveModalOpen(false);
                    setSaveName('');
                  }}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveAsNew}
                  disabled={!saveName.trim()}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  <span>💾</span>
                  <span>保存记录</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryManager;