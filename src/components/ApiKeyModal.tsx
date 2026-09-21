import React, { useState } from 'react';
import { X, Key, Check, AlertCircle, Eye, EyeOff, ExternalLink, Sparkles, RefreshCw } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentKey: string;
  isLiveApi: boolean;
  onSaveKey: (key: string) => Promise<boolean>;
  onClearKey: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  currentKey,
  isLiveApi,
  onSaveKey,
  onClearKey,
}) => {
  const [apiKeyInput, setApiKeyInput] = useState(currentKey);
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleSaveAndTest = async () => {
    if (!apiKeyInput.trim()) {
      onClearKey();
      setTestResult({ success: true, message: '已恢復為預設離線精選模式。' });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      const ok = await onSaveKey(apiKeyInput.trim());
      if (ok) {
        setTestResult({
          success: true,
          message: '連線成功！已成功載入 Google Places 即時食肆資料。',
        });
      } else {
        setTestResult({
          success: false,
          message: '無法連線至 Google Places API，請確認 API Key 是否已啟用 Places API 及 Maps JavaScript API 服務。',
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err?.message || '連線測試失敗，請檢查金鑰或網路。',
      });
    } finally {
      setTesting(false);
    }
  };

  const handleClear = () => {
    setApiKeyInput('');
    onClearKey();
    setTestResult({ success: true, message: '已清除自訂 API Key，恢復為預設 28 間葵興精選食肆。' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden p-6 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-orange-100 text-orange-600">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Google Places API 設定</h3>
              <p className="text-xs text-slate-500">串接即時 Google 商家評分與營業資訊</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current status pill */}
        <div className="my-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                isLiveApi ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <span className="text-xs font-bold text-slate-800">
              {isLiveApi ? '目前運作：Google Places API 即時連線' : '目前運作：葵興本地精選離線模式 (28間)'}
            </span>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">
            {isLiveApi ? 'LIVE' : 'DEMO'}
          </span>
        </div>

        {/* Input Box */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-700">
            Google Maps API Key (瀏覽器端使用)
          </label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full pl-3.5 pr-10 py-2.5 bg-slate-100/70 text-sm font-mono text-slate-900 rounded-xl border border-slate-200 focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20 outline-hidden transition-all"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            * 金鑰只會儲存在您本地瀏覽器的 <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">localStorage</code>，絕不會上傳到任何伺服器或第三方資料庫。
          </p>
        </div>

        {/* Test Feedback Message */}
        {testResult && (
          <div
            className={`mt-4 p-3 rounded-xl text-xs flex items-start gap-2 ${
              testResult.success
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {testResult.success ? (
              <Check className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            )}
            <span className="leading-relaxed">{testResult.message}</span>
          </div>
        )}

        {/* Guidance and How-to */}
        <div className="mt-5 p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/60 text-xs text-amber-900 space-y-2">
          <div className="flex items-center gap-1.5 font-bold">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>無 API Key？毋須擔心！</span>
          </div>
          <p className="text-amber-800/90 leading-relaxed text-[11px]">
            「葵興食乜好」已內置 28 間涵蓋 KCC、新葵興廣場、KC100、大連排工廈與光輝圍的真實道地餐廳資料，落雨天橋標記及步行時間已全數經過驗證，無需輸入任何 Key 亦可即開即用！
          </p>
          <a
            href="https://developers.google.com/maps/documentation/javascript/get-api-key"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-bold text-orange-700 hover:text-orange-800 hover:underline text-[11px]"
          >
            <span>如何申請 Google Maps API Key（每月免費額度充足）</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Modal Actions */}
        <div className="mt-6 flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <button
            onClick={handleClear}
            className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            重設回離線模式
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              取消
            </button>
            <button
              onClick={handleSaveAndTest}
              disabled={testing}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-md shadow-orange-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {testing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              <span>{testing ? '連線驗證中...' : '儲存並連線'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
