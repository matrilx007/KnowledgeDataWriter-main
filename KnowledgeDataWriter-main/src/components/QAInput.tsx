import React, { useState } from 'react';
import type { QAItem } from '../types/index';

interface QAInputProps {
  qaData: QAItem[];
  onUpdateQAData: (qaData: QAItem[]) => void;
  onExport: () => void;
  onClear: () => void;
  separator: string;
  onSeparatorChange: (separator: string) => void;
  onSaveToHistory: () => void;
}

const QAInput: React.FC<QAInputProps> = ({
  qaData,
  onUpdateQAData,
  onExport,
  onClear,
  separator,
  onSeparatorChange,
  onSaveToHistory
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingQuestion, setEditingQuestion] = useState('');
  const [editingAnswer, setEditingAnswer] = useState('');

  // 添加新的QA对
  const addNewQA = () => {
    const newQA: QAItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      question: '',
      answer: ''
    };
    onUpdateQAData([...qaData, newQA]);
    setEditingIndex(qaData.length);
    setEditingQuestion('');
    setEditingAnswer('');
  };

  // 开始编辑QA对
  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditingQuestion(qaData[index].question);
    setEditingAnswer(qaData[index].answer);
  };

  // 保存编辑
  const saveEdit = () => {
    if (editingIndex !== null && editingQuestion.trim() && editingAnswer.trim()) {
      const updatedQAData = [...qaData];
      updatedQAData[editingIndex] = {
        ...updatedQAData[editingIndex],
        question: editingQuestion.trim(),
        answer: editingAnswer.trim()
      };
      onUpdateQAData(updatedQAData);
    }
    setEditingIndex(null);
    setEditingQuestion('');
    setEditingAnswer('');
  };

  // 取消编辑
  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingQuestion('');
    setEditingAnswer('');
  };

  // 删除QA对
  const deleteQA = (index: number) => {
    const updatedQAData = qaData.filter((_, i) => i !== index);
    onUpdateQAData(updatedQAData);
  };

  // 计算进度
  const completedCount = qaData.filter(qa => qa.question.trim() !== '' && qa.answer.trim() !== '').length;
  const totalCount = qaData.length;

  // 预设分隔符选项
  const separatorOptions = [
    { label: '三个换行', value: '\n\n\n' },
    { label: '两个换行', value: '\n\n' },
    { label: '一个换行', value: '\n' },
    { label: '空格', value: ' ' },
    { label: '制表符', value: '\t' },
    { label: '自定义', value: 'custom' }
  ];

  return (
    <div className="w-[90%] mx-auto p-6">
      {/* 页面头部 */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center space-x-2">
              <span>❓</span>
              <span>QA 问答录入</span>
            </h1>
            <p className="text-blue-100 mt-2">
              创建和管理问答对，支持自定义分隔符导出
            </p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-700">{completedCount}</div>
            <div className="text-sm font-bold text-blue-700">已完成</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 左侧控制面板 */}
        <div className="lg:col-span-1 space-y-6">
          {/* 统计信息 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <span>📊</span>
              <span>统计信息</span>
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">总QA对数</span>
                <span className="text-lg font-semibold text-gray-900">{totalCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">已完成</span>
                <span className="text-lg font-semibold text-green-600">{completedCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">完成率</span>
                <span className="text-lg font-semibold text-blue-600">
                  {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%
                </span>
              </div>
              {totalCount > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>进度</span>
                    <span>{completedCount}/{totalCount}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(completedCount / totalCount) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 导出设置 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <span>⚙️</span>
              <span>导出设置</span>
            </h3>
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                QA对分隔符
              </label>
              {separatorOptions.map((option) => (
                <label key={option.value} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="separator"
                    value={option.value}
                    checked={separator === option.value}
                    onChange={(e) => onSeparatorChange(e.target.value)}
                    className="mr-3 h-4 w-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
              {separator === 'custom' && (
                <input
                  type="text"
                  placeholder="输入自定义分隔符"
                  value={separator === 'custom' ? '' : separator}
                  onChange={(e) => onSeparatorChange(e.target.value)}
                  className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>
          </div>
        </div>

        {/* 右侧QA对列表 */}
        <div className="lg:col-span-2">{/* QA对列表内容 */}

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-fit">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <span>📝</span>
                <span>QA对列表</span>
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full font-medium">
                  {totalCount}
                </span>
              </h3>
            </div>
            
            <div className="max-h-[800px] overflow-y-auto">
              {qaData.length === 0 ? (
                <div className="text-center py-16 px-6">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-4xl">❓</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">开始创建QA对</h3>
                  <p className="text-gray-500 mb-6">点击左侧"添加新QA对"按钮来创建您的第一个问答</p>
                </div>
              ) : (
                <div className="p-6 space-y-4">
                  {qaData.map((qa, index) => {
                    const isComplete = qa.question.trim() && qa.answer.trim();
                    
                    return (
                      <div key={qa.id} className={`border rounded-xl p-5 transition-all duration-200 ${
                        isComplete 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-gray-200 bg-white hover:border-blue-200'
                      }`}>
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                              isComplete 
                                ? 'bg-green-100 text-green-600' 
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {index + 1}
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                              QA对 {index + 1}
                              {isComplete && <span className="ml-2 text-green-600">✓</span>}
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            {editingIndex === index ? (
                              <>
                                <button
                                  onClick={saveEdit}
                                  disabled={!editingQuestion.trim() || !editingAnswer.trim()}
                                  className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
                                >
                                  <span>💾</span>
                                  <span>保存</span>
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-1"
                                >
                                  <span>❌</span>
                                  <span>取消</span>
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => startEditing(index)}
                                  className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors flex items-center space-x-1"
                                >
                                  <span>✏️</span>
                                  <span>编辑</span>
                                </button>
                                <button
                                  onClick={() => deleteQA(index)}
                                  className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors flex items-center space-x-1"
                                >
                                  <span>🗑️</span>
                                  <span>删除</span>
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                        
                        {editingIndex === index ? (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
                                <span>❓</span>
                                <span>问题</span>
                              </label>
                              <textarea
                                value={editingQuestion}
                                onChange={(e) => setEditingQuestion(e.target.value)}
                                rows={2}
                                placeholder="请输入问题..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-colors"
                                autoFocus
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
                                <span>💭</span>
                                <span>答案</span>
                              </label>
                              <textarea
                                value={editingAnswer}
                                onChange={(e) => setEditingAnswer(e.target.value)}
                                rows={3}
                                placeholder="请输入答案..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-colors"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="bg-white rounded-lg p-4 border border-gray-100">
                              <div className="flex items-start space-x-2 mb-2">
                                <span className="text-blue-600 font-medium text-sm">❓</span>
                                <span className="text-sm font-medium text-gray-700">问题:</span>
                              </div>
                              <p className="text-gray-900 leading-relaxed pl-6">
                                {qa.question || <em className="text-gray-400">未设置问题</em>}
                              </p>
                            </div>
                            <div className="bg-white rounded-lg p-4 border border-gray-100">
                              <div className="flex items-start space-x-2 mb-2">
                                <span className="text-green-600 font-medium text-sm">💭</span>
                                <span className="text-sm font-medium text-gray-700">答案:</span>
                              </div>
                              <p className="text-gray-900 leading-relaxed pl-6">
                                {qa.answer || <em className="text-gray-400">未设置答案</em>}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

        </div>
        <div className="lg:col-span-1">
          {/* 操作按钮 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <span>🔧</span>
              <span>操作</span>
            </h3>
            <div className="space-y-3">
              <button
                onClick={addNewQA}
                className="w-full px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 border border-transparent rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>➕</span>
                <span>添加新QA对</span>
              </button>
              
              <div className="border-t border-gray-200 pt-3">
                <div className="text-xs text-gray-500 mb-2 text-center">数据操作</div>
                <button
                  onClick={onSaveToHistory}
                  disabled={qaData.length === 0}
                  className="w-full px-4 py-3 text-sm font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <span>💾</span>
                  <span>保存到历史</span>
                </button>
                <button
                  onClick={onExport}
                  disabled={completedCount === 0}
                  className="w-full px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 border border-transparent rounded-lg hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 mt-2"
                >
                  <span>📤</span>
                  <span>导出数据</span>
                </button>
              </div>
              
              <div className="border-t border-gray-200 pt-3">
                <div className="text-xs text-gray-500 mb-2 text-center">危险操作</div>
                <button
                  onClick={onClear}
                  className="w-full px-4 py-3 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <span>🗑️</span>
                  <span>清空数据</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QAInput;