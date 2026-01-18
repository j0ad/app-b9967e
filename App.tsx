
import React, { useState, useRef } from 'react';
import { 
  Smartphone, 
  Globe, 
  Settings, 
  Zap, 
  CheckCircle, 
  Download, 
  Code, 
  ArrowLeft,
  Layout,
  Cpu,
  ShieldCheck,
  Rocket,
  Upload,
  FileCode,
  AlertCircle
} from 'lucide-react';
import { AppConfig, AppType, AnalysisResult } from './types';
import { analyzeProject, generateNativeBridge } from './services/geminiService';
import MobileMockup from './components/MobileMockup';

const App: React.FC = () => {
  const [step, setStep] = useState(1);
  const [inputMode, setInputMode] = useState<'url' | 'file'>('file');
  const [config, setConfig] = useState<AppConfig>({
    url: '',
    name: '',
    bundleId: 'com.myapp.pro',
    primaryColor: '#3b82f6',
    type: AppType.ANDROID
  });
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [bridgeCode, setBridgeCode] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setConfig({
        ...config,
        fileName: file.name,
        // In a real app, we'd read the zip content. Here we'll simulate context.
        fileContent: `Project name: ${file.name}, Size: ${file.size} bytes. (Simulated code analysis of React structure)`
      });
    }
  };

  const handleStartAnalysis = async () => {
    if (!config.name || (inputMode === 'url' && !config.url) || (inputMode === 'file' && !config.fileName)) {
      alert("يرجى إكمال جميع البيانات المطلوبة");
      return;
    }
    setLoading(true);
    try {
      const result = await analyzeProject(config);
      setAnalysis(result);
      setStep(2);
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء تحليل المشروع");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateBridge = async () => {
    if (!analysis) return;
    setLoading(true);
    try {
      const code = await generateNativeBridge(analysis.suggestedFeatures);
      setBridgeCode(code);
      setStep(3);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-green-500 to-blue-600 p-2 rounded-lg shadow-lg">
            <Smartphone className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800">
            React2<span className="text-green-600">Android</span>
          </h1>
        </div>
        <div className="hidden md:flex gap-8 text-gray-500 font-semibold">
          <a href="#" className="hover:text-green-600 transition">تحليل الكود</a>
          <a href="#" className="hover:text-green-600 transition">بناء APK</a>
          <a href="#" className="hover:text-green-600 transition">الأسعار</a>
        </div>
        <button className="bg-slate-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-slate-800 transition-all transform hover:scale-105">
          دخول المطورين
        </button>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Step Indicator */}
        <div className="mb-12 flex justify-center items-center gap-6">
          {[
            { label: 'الإعداد', icon: Settings },
            { label: 'التحليل', icon: Zap },
            { label: 'التحويل', icon: Download }
          ].map((s, i) => (
            <React.Fragment key={i}>
              <div className="flex flex-col items-center gap-2">
                <div className={`flex items-center justify-center w-12 h-12 rounded-2xl shadow-md transition-all ${step >= i+1 ? 'bg-green-600 text-white' : 'bg-white text-gray-300'}`}>
                  <s.icon className="w-6 h-6" />
                </div>
                <span className={`text-xs font-bold ${step >= i+1 ? 'text-green-700' : 'text-gray-400'}`}>{s.label}</span>
              </div>
              {i < 2 && <div className={`h-1 w-20 rounded-full ${step > i+1 ? 'bg-green-600' : 'bg-gray-200'}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          <div className="glass-card p-10 rounded-[2.5rem] shadow-2xl border-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-full blur-3xl opacity-50 -translate-y-10 translate-x-10"></div>
            
            {step === 1 && (
              <div className="space-y-8 relative z-10">
                <div>
                  <h2 className="text-3xl font-black text-slate-800 mb-2">حول مشروعك الآن</h2>
                  <p className="text-slate-500">اختر طريقة رفع ملفات React الخاصة بك لتحويلها إلى تطبيق أندرويد احترافي.</p>
                </div>

                <div className="flex bg-slate-100 p-1 rounded-2xl">
                  <button 
                    onClick={() => setInputMode('file')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition ${inputMode === 'file' ? 'bg-white shadow-sm text-green-600' : 'text-slate-500'}`}
                  >
                    <Upload className="w-4 h-4" /> رفع ملفات (ZIP)
                  </button>
                  <button 
                    onClick={() => setInputMode('url')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition ${inputMode === 'url' ? 'bg-white shadow-sm text-green-600' : 'text-slate-500'}`}
                  >
                    <Globe className="w-4 h-4" /> رابط الموقع
                  </button>
                </div>

                <div className="space-y-6">
                  {inputMode === 'file' ? (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-3 border-dashed border-slate-200 rounded-3xl p-10 text-center cursor-pointer hover:border-green-400 hover:bg-green-50 transition group"
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept=".zip,.rar,application/zip"
                        onChange={handleFileUpload}
                      />
                      <div className="bg-slate-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-100 transition">
                        <FileCode className="w-8 h-8 text-slate-400 group-hover:text-green-600" />
                      </div>
                      <h3 className="font-bold text-slate-700">اسحب مشروعك هنا أو تصفح</h3>
                      <p className="text-xs text-slate-400 mt-2">نقبل ملفات ZIP لمشاريع React/Vite</p>
                      {config.fileName && (
                        <div className="mt-4 p-2 bg-green-100 text-green-700 rounded-lg text-sm font-bold flex items-center justify-center gap-2">
                          <CheckCircle className="w-4 h-4" /> {config.fileName}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-bold mb-2 text-slate-700">رابط الموقع المباشر</label>
                      <div className="relative">
                        <Globe className="absolute right-3 top-4 w-5 h-5 text-slate-400" />
                        <input 
                          type="url" 
                          placeholder="https://example.com"
                          className="w-full pr-10 pl-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-green-500 outline-none transition"
                          value={config.url}
                          onChange={(e) => setConfig({...config, url: e.target.value})}
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold mb-2 text-slate-700">اسم التطبيق</label>
                      <input 
                        type="text" 
                        placeholder="تطبيقي الذكي"
                        className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-green-500 outline-none transition"
                        value={config.name}
                        onChange={(e) => setConfig({...config, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2 text-slate-700">اللون الأساسي</label>
                      <div className="flex gap-2 h-[58px]">
                        <input 
                          type="color" 
                          className="w-16 h-full p-1 bg-white border-2 border-slate-100 rounded-2xl cursor-pointer"
                          value={config.primaryColor}
                          onChange={(e) => setConfig({...config, primaryColor: e.target.value})}
                        />
                        <input 
                          type="text" 
                          className="flex-1 px-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xs font-mono"
                          value={config.primaryColor}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleStartAnalysis}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-green-200 transition-all flex items-center justify-center gap-3 text-lg"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>ابدأ التحويل للأندرويد</span>
                      <Zap className="w-6 h-6" />
                    </>
                  )}
                </button>
              </div>
            )}

            {step === 2 && analysis && (
              <div className="space-y-6 relative z-10 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-slate-800">تقرير التحليل الذكي</h2>
                  <div className="text-right">
                    <div className="text-4xl font-black text-green-600">{analysis.readinessScore}%</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">معدل الجاهزية</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="p-5 bg-white rounded-3xl border-2 border-slate-50 shadow-sm">
                    <h3 className="font-bold mb-3 flex items-center gap-2 text-blue-600">
                      <Layout className="w-5 h-5" /> نصائح واجهة المستخدم
                    </h3>
                    <div className="space-y-2">
                      {analysis.suggestions.map((s, i) => (
                        <div key={i} className="flex gap-3 text-sm text-slate-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0"></div>
                          <p>{s}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 bg-green-50 rounded-3xl border-2 border-green-100">
                    <h3 className="font-bold mb-3 flex items-center gap-2 text-green-700">
                      <Smartphone className="w-5 h-5" /> متطلبات نظام أندرويد
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {analysis.androidRequirements.map((req, i) => (
                        <span key={i} className="bg-white/80 px-3 py-1.5 rounded-xl border border-green-200 text-xs font-bold text-green-800">
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-900 rounded-3xl">
                   <div className="flex justify-between items-center mb-2 px-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Capacitor Config</span>
                      <button className="text-[10px] font-bold text-blue-400 hover:text-blue-300">نسخ الكود</button>
                   </div>
                   <pre className="text-blue-300 text-[11px] font-mono p-2 overflow-x-auto">
                     {analysis.codeSnippet}
                   </pre>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setStep(1)}
                    className="flex-1 bg-white border-2 border-slate-100 text-slate-500 font-bold py-4 rounded-2xl hover:bg-slate-50 transition flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-5 h-5" /> رجوع
                  </button>
                  <button 
                    onClick={handleGenerateBridge}
                    className="flex-[2] bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-xl hover:bg-slate-800 transition flex items-center justify-center gap-2"
                  >
                    <span>توليد كود الـ Native Bridge</span>
                    <Cpu className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && bridgeCode && (
              <div className="space-y-8 animate-in zoom-in-95 duration-300">
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-3xl flex items-center justify-center mx-auto mb-4 rotate-3">
                    <CheckCircle className="text-green-600 w-12 h-12" />
                  </div>
                  <h2 className="text-3xl font-black text-slate-800">جاهز للتصدير!</h2>
                  <p className="text-slate-500">تم تجهيز كافة ملفات الأندرويد لربط موقعك بالنظام الأصلي.</p>
                </div>

                <div className="bg-slate-950 p-6 rounded-[2rem] border-4 border-slate-900 shadow-inner relative group">
                  <div className="absolute top-4 left-4 flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="mt-6 max-h-[300px] overflow-y-auto custom-scrollbar">
                    <code className="text-xs text-green-400 font-mono leading-relaxed block text-left ltr whitespace-pre-wrap" dir="ltr">
                      {bridgeCode}
                    </code>
                  </div>
                </div>

                <div className="space-y-4">
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-green-100">
                    <Download className="w-6 h-6" />
                    تحميل مشروع أندرويد ستوديو
                  </button>
                  <div className="flex gap-3">
                    <button className="flex-1 border-2 border-slate-200 text-slate-600 font-bold py-4 rounded-2xl hover:bg-slate-50">
                      معاينة APK
                    </button>
                    <button className="flex-1 bg-slate-100 text-slate-800 font-bold py-4 rounded-2xl hover:bg-slate-200">
                      التوثيق الفني
                    </button>
                  </div>
                </div>

                <div className="bg-blue-50 p-5 rounded-3xl border border-blue-100 flex gap-4">
                  <AlertCircle className="w-6 h-6 text-blue-600 shrink-0" />
                  <p className="text-xs text-blue-800 leading-relaxed">
                    تم تحسين الكود ليتوافق مع Android 14. تأكد من تحديث Gradle إلى الإصدار 8.0 في مشروعك المحلي لضمان أفضل أداء.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Preview */}
          <div className="flex flex-col items-center">
             <div className="mb-6 bg-white px-6 py-2 rounded-full border shadow-sm flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm font-bold text-slate-600 uppercase tracking-widest">Android Device Mockup</span>
             </div>
             
             <MobileMockup 
                url={config.url || ''} 
                primaryColor={config.primaryColor} 
             />

             <div className="mt-12 w-full max-w-[300px]">
                <div className="p-4 bg-white rounded-2xl shadow-sm border flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                    <Rocket className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-800">وضع المطور</h4>
                    <p className="text-[10px] text-slate-400">تزامن حي مع ملفات المشروع</p>
                  </div>
                  <div className="mr-auto">
                    <div className="w-8 h-4 bg-green-500 rounded-full relative">
                      <div className="absolute right-1 top-1 w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
             </div>
          </div>

        </div>
      </main>

      <section className="py-24 border-t bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4">قوة الأندرويد في متناول يدك</h2>
            <p className="text-slate-500">نحن لا نقوم فقط بتغليف الموقع، بل نقوم بإعادة بناء جسور التواصل بين الويب والنظام.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'تحسين الأداء', desc: 'تسريع تحميل الصفحات عبر الـ Caching المحلي.', icon: Zap, color: 'text-yellow-500' },
              { title: 'إشعارات حية', desc: 'تكامل كامل مع Firebase Cloud Messaging.', icon: CheckCircle, color: 'text-green-500' },
              { title: 'بصمة الإصبع', desc: 'تأمين التطبيق عبر Biometric Authentication.', icon: ShieldCheck, color: 'text-blue-500' },
              { title: 'تصدير APK/AAB', desc: 'ملفات جاهزة للنشر المباشر على المتجر.', icon: Download, color: 'text-purple-500' }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-[2rem] border-2 border-slate-50 hover:border-green-100 hover:shadow-xl transition-all group">
                <div className={`w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition ${feature.color}`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-black text-slate-800 mb-3">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 text-white py-20 px-6 border-t border-slate-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Smartphone className="text-green-500 w-8 h-8" />
              <span className="text-2xl font-black">React2Android</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              المنصة رقم #1 للمطورين العرب لتحويل مشاريع React إلى تطبيقات موبايل عالمية المستوى وبأقل مجهود برمجي ممكن.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-lg mb-2">روابط سريعة</h4>
            <a href="#" className="text-slate-400 hover:text-white transition">كيف تعمل المنصة؟</a>
            <a href="#" className="text-slate-400 hover:text-white transition">سجل التغييرات</a>
            <a href="#" className="text-slate-400 hover:text-white transition">انضم لمجتمعنا</a>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4">اشترك في النشرة البرمجية</h4>
            <div className="flex gap-2">
              <input type="email" placeholder="بريدك الإلكتروني" className="bg-slate-900 border border-slate-800 px-4 py-3 rounded-xl flex-1 focus:outline-none focus:border-green-500" />
              <button className="bg-green-600 px-4 py-3 rounded-xl font-bold">اشتراك</button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-900 text-center text-slate-600 text-xs">
          تم التطوير بكل فخر لدعم المطورين العرب - 2024
        </div>
      </footer>
    </div>
  );
};

export default App;
