import React, { useState } from 'react';
import type { SegmentItem } from '../types/index';

interface SegmentInputProps {
  segmentData: SegmentItem[];
  onUpdateSegments: (segments: SegmentItem[]) => void;
  onExport: () => void;
  onClear: () => void;
  onSaveToHistory: () => void;
}

const SegmentInput: React.FC<SegmentInputProps> = ({
  segmentData,
  onUpdateSegments,
  onExport,
  onClear,
  onSaveToHistory
}) => {
  const [inputText, setInputText] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState('');

  // 处理文本粘贴和自动分段
  const handleTextSubmit = () => {
    if (!inputText.trim()) return;
    
    // 按段落分割文本（以空行或换行符分割）
    const segments = inputText
      .split(/\n\s*\n|\n/)
      .filter(segment => segment.trim() !== '')
      .map(content => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        content: content.trim()
      }));
    
    onUpdateSegments([...segmentData, ...segments]);
    setInputText('');
  };

  // 开始编辑段落
  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditingContent(segmentData[index].content);
  };

  // 保存编辑
  const saveEdit = () => {
    if (editingIndex !== null && editingContent.trim()) {
      const updatedSegments = [...segmentData];
      updatedSegments[editingIndex] = {
        ...updatedSegments[editingIndex],
        content: editingContent.trim()
      };
      onUpdateSegments(updatedSegments);
    }
    setEditingIndex(null);
    setEditingContent('');
  };

  // 取消编辑
  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingContent('');
  };

  // 删除段落
  const deleteSegment = (index: number) => {
    const updatedSegments = segmentData.filter((_, i) => i !== index);
    onUpdateSegments(updatedSegments);
  };

  // 添加新段落
  const addNewSegment = () => {
    const newSegment: SegmentItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      content: ''
    };
    onUpdateSegments([...segmentData, newSegment]);
    setEditingIndex(segmentData.length);
    setEditingContent('');
  };

  return (
    <div className="w-[90%] mx-auto p-6">
      {/* 页面头部 */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center space-x-2">
              <span>📝</span>
              <span>分段文本录入</span>
            </h1>
            <p className="text-green-100 mt-2">
              智能分段处理，支持批量文本录入和逐段编辑
            </p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
            <div className="text-2xl text-green-700 font-bold">{segmentData.filter(seg => seg.content.trim()).length}</div>
            <div className="text-sm text-green-700 font-bold">有效段落</div>
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
                <span className="text-sm text-gray-600">总段落数</span>
                <span className="text-lg font-semibold text-gray-900">{segmentData.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">有效段落</span>
                <span className="text-lg font-semibold text-green-600">
                  {segmentData.filter(seg => seg.content.trim()).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">总字符数</span>
                <span className="text-lg font-semibold text-blue-600">
                  {segmentData.reduce((acc, seg) => acc + seg.content.length, 0)}
                </span>
              </div>
            </div>
          </div>
          {/* 文本输入区域 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <span>📄</span>
              <span>文本输入</span>
            </h3>
            
            <div className="mb-4">
              <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 mb-3">
                粘贴或输入文本（系统会自动分段）
              </label>
              <textarea
                id="text-input"
                rows={8}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="请在此粘贴或输入需要分段的文本内容...&#10;&#10;系统会按空行自动分割段落"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none transition-colors"
              />
              <div className="mt-2 text-xs text-gray-500">
                💡 提示：使用空行分隔不同段落，系统会自动识别并分段
              </div>
            </div>
            
            <button
              onClick={handleTextSubmit}
              disabled={!inputText.trim()}
              className="w-full px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 border border-transparent rounded-lg hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <span>➕</span>
              <span>智能分段</span>
            </button>
          </div>
        </div>

        {/* 右侧段落列表 */}
        <div className="lg:col-span-2">

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-fit">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <span>📄</span>
                <span>段落列表</span>
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full font-medium">
                  {segmentData.length}
                </span>
              </h3>
            </div>
            
            <div className="max-h-[800px] overflow-y-auto">
              {segmentData.length === 0 ? (
                <div className="text-center py-16 px-6">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-4xl">📝</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">开始录入段落</h3>
                  <p className="text-gray-500 mb-6">在左侧输入文本并点击"智能分段"，或点击"添加新段落"手动创建</p>
                </div>
              ) : (
                <div className="p-6 space-y-4">
                  {segmentData.map((segment, index) => {
                    const hasContent = segment.content.trim();
                    const wordCount = segment.content.length;
                    
                    return (
                      <div key={segment.id} className={`border rounded-xl p-5 transition-all duration-200 ${
                        hasContent 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-gray-200 bg-white hover:border-green-200'
                      }`}>
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                              hasContent 
                                ? 'bg-green-100 text-green-600' 
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {index + 1}
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-700">
                                段落 {index + 1}
                                {hasContent && <span className="ml-2 text-green-600">✓</span>}
                              </span>
                              <div className="text-xs text-gray-500 mt-1">
                                {wordCount} 字符
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            {editingIndex === index ? (
                              <>
                                <button
                                  onClick={saveEdit}
                                  disabled={!editingContent.trim()}
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
                                  className="px-3 py-1.5 text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors flex items-center space-x-1"
                                >
                                  <span>✏️</span>
                                  <span>编辑</span>
                                </button>
                                <button
                                  onClick={() => deleteSegment(index)}
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
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
                              <span>📝</span>
                              <span>编辑段落内容</span>
                            </label>
                            <textarea
                              value={editingContent}
                              onChange={(e) => setEditingContent(e.target.value)}
                              rows={4}
                              placeholder="请输入段落内容..."
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none transition-colors"
                              autoFocus
                            />
                            <div className="mt-2 text-xs text-gray-500">
                              字符数: {editingContent.length}
                            </div>
                          </div>
                        ) : (
                          <div className="bg-white rounded-lg p-4 border border-gray-100">
                            <div className="flex items-start space-x-2 mb-2">
                              <span className="text-green-600 font-medium text-sm">📖</span>
                              <span className="text-sm font-medium text-gray-700">内容:</span>
                            </div>
                            <div className="pl-6">
                              {segment.content ? (
                                <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                                  {segment.content}
                                </p>
                              ) : (
                                <em className="text-gray-400">空段落，点击编辑添加内容</em>
                              )}
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
                onClick={addNewSegment}
                className="w-full px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 border border-transparent rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>➕</span>
                <span>添加新段落</span>
              </button>
              
              <div className="border-t border-gray-200 pt-3">
                <div className="text-xs text-gray-500 mb-2 text-center">数据操作</div>
                <button
                  onClick={onSaveToHistory}
                  disabled={segmentData.length === 0}
                  className="w-full px-4 py-3 text-sm font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <span>💾</span>
                  <span>保存到历史</span>
                </button>
                <button
                  onClick={onExport}
                  disabled={segmentData.length === 0 || segmentData.filter(seg => seg.content.trim()).length === 0}
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

export default SegmentInput;