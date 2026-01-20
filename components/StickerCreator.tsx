
import React, { useState, useRef } from 'react';
import { generateSticker, editSticker, analyzeStickerIdea, generateTTS } from '../services/gemini';
import { Sparkles, Wand2, Download, Trash2, Mic, Play, Loader2, Info, ShoppingCart, Printer, Type as TypeIcon } from 'lucide-react';
import { Sticker } from '../types';

interface StickerCreatorProps {
  onAddToCart: (s: Sticker) => void;
}

const StickerCreator: React.FC<StickerCreatorProps> = ({ onAddToCart }) => {
  const [prompt, setPrompt] = useState('');
  const [stickerName, setStickerName] = useState('');
  const [editPrompt, setEditPrompt] = useState('');
  const [currentSticker, setCurrentSticker] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState('');
  const [exportQuality, setExportQuality] = useState<'72' | '300'>('72');
  const audioContextRef = useRef<AudioContext | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    const result = await generateSticker(prompt);
    if (result) {
      setCurrentSticker(result);
      // Set a default name based on the prompt if empty
      if (!stickerName) {
        setStickerName(prompt.slice(0, 20).replace(/[^a-z0-9]/gi, '_').toLowerCase());
      }
    }
    setLoading(false);
  };

  const handleEdit = async () => {
    if (!currentSticker || !editPrompt) return;
    setLoading(true);
    const result = await editSticker(currentSticker, editPrompt);
    if (result) setCurrentSticker(result);
    setEditPrompt('');
    setLoading(false);
  };

  const handleAnalyze = async () => {
    if (!prompt) return;
    setLoading(true);
    const result = await analyzeStickerIdea(prompt);
    setAnalysis(result);
    setLoading(false);
  };

  const handleExport = () => {
    if (!currentSticker) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      // If 300 DPI selected, we upscale the canvas for better print results (approx 2x)
      const scaleFactor = exportQuality === '300' ? 2 : 1;
      canvas.width = img.width * scaleFactor;
      canvas.height = img.height * scaleFactor;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const link = document.createElement('a');
        const finalName = (stickerName.trim() || 'my-sticker').replace(/[^a-z0-9]/gi, '_');
        link.download = `${finalName}-${exportQuality}dpi.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    };
    img.src = currentSticker;
  };

  const playPhrase = async () => {
    if (!prompt) return;
    const bytes = await generateTTS(prompt);
    if (bytes) {
      if (!audioContextRef.current) audioContextRef.current = new AudioContext({ sampleRate: 24000 });
      const ctx = audioContextRef.current;
      
      const dataInt16 = new Int16Array(bytes.buffer);
      const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
      const channelData = buffer.getChannelData(0);
      for (let i = 0; i < dataInt16.length; i++) {
        channelData[i] = dataInt16[i] / 32768.0;
      }
      
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start();
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-accent mb-4 text-slate-800">Δημιουργικό Εργαστήρι AI</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Περιγράψτε το sticker των ονείρων σας και αφήστε το Gemini να το δημιουργήσει σε δευτερόλεπτα.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Input Side */}
        <div className="space-y-8">
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Sparkles className="text-indigo-600" size={20} />
              1. Περιγράψτε την Ιδέα
            </h3>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="π.χ. Ένας αστροναύτης γάτος που τρώει πίτσα στο διάστημα, πολύχρωμο στυλ..."
                className="w-full h-32 p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 resize-none text-slate-700"
              />
              <div className="absolute bottom-3 right-3 flex gap-2">
                <button 
                  onClick={playPhrase}
                  className="p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors"
                  title="Ακούστε το prompt"
                >
                  <Play size={18} />
                </button>
              </div>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={handleGenerate}
                disabled={loading || !prompt}
                className="flex-grow bg-indigo-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
                Δημιουργία Sticker
              </button>
              <button
                onClick={handleAnalyze}
                disabled={loading || !prompt}
                className="bg-white border-2 border-indigo-600 text-indigo-600 font-bold py-3 px-6 rounded-xl hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Info size={20} />
                Ανάλυση Ιδέας
              </button>
            </div>
          </section>

          {analysis && (
            <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                <Wand2 size={18} /> Συμβουλές AI για βελτίωση:
              </h4>
              <p className="text-amber-800 text-sm italic">{analysis}</p>
            </div>
          )}

          {currentSticker && (
            <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 animate-in fade-in duration-500">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Wand2 className="text-pink-600" size={20} />
                2. Επεξεργασία (Nano Banana AI)
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  placeholder="π.χ. Κάνε τα χρώματα πιο ρετρό ή πρόσθεσε γυαλιά ηλίου..."
                  className="flex-grow p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm"
                />
                <button
                  onClick={handleEdit}
                  disabled={loading || !editPrompt}
                  className="bg-slate-800 text-white px-4 rounded-xl hover:bg-slate-900 transition-colors disabled:opacity-50"
                >
                  <Sparkles size={18} />
                </button>
              </div>
            </section>
          )}
        </div>

        {/* Output Side */}
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-[40px] shadow-inner border-2 border-dashed border-slate-200 p-8 relative overflow-hidden">
          {loading && !currentSticker && (
            <div className="flex flex-col items-center gap-4 text-indigo-600 animate-pulse">
              <Loader2 className="animate-spin" size={48} />
              <p className="font-bold">Η AI σχεδιάζει για εσάς...</p>
            </div>
          )}

          {currentSticker ? (
            <div className="w-full flex flex-col items-center gap-8">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500 to-pink-500 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                <img 
                  src={currentSticker} 
                  alt="AI Sticker" 
                  className="relative w-64 h-64 object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="flex flex-col gap-4 w-full max-w-xs items-center">
                <button 
                  onClick={() => onAddToCart({ id: Math.random().toString(), url: currentSticker, prompt, price: 4.99 })}
                  className="w-full bg-indigo-600 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={20} />
                  Προσθήκη στο Καλάθι (€4.99)
                </button>

                <div className="w-full space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 flex items-center gap-1 px-1">
                      <TypeIcon size={12} /> Όνομα Sticker
                    </label>
                    <input
                      type="text"
                      value={stickerName}
                      onChange={(e) => setStickerName(e.target.value)}
                      placeholder="Δώστε ένα όνομα..."
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                      <label className="text-xs font-bold text-slate-500 flex items-center gap-1">
                        <Printer size={12} /> Ποιότητα Εκτύπωσης
                      </label>
                      <div className="flex gap-1 bg-slate-200 p-1 rounded-lg">
                        <button 
                          onClick={() => setExportQuality('72')}
                          className={`text-[10px] px-2 py-1 rounded-md font-bold transition-all ${exportQuality === '72' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
                        >
                          72 DPI
                        </button>
                        <button 
                          onClick={() => setExportQuality('300')}
                          className={`text-[10px] px-2 py-1 rounded-md font-bold transition-all ${exportQuality === '300' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
                        >
                          300 DPI
                        </button>
                      </div>
                    </div>
                    
                    <button 
                      onClick={handleExport}
                      className="w-full bg-white border-2 border-indigo-600 text-indigo-600 font-bold py-3 px-8 rounded-xl hover:bg-indigo-50 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                    >
                      <Download size={20} />
                      Εξαγωγή PNG ({exportQuality === '300' ? '300' : '72'} DPI)
                    </button>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setCurrentSticker(null);
                    setStickerName('');
                  }}
                  className="text-slate-400 hover:text-pink-600 text-sm font-medium transition-colors flex items-center gap-1"
                >
                  <Trash2 size={16} />
                  Διαγραφή σχεδίου
                </button>
              </div>
            </div>
          ) : !loading && (
            <div className="text-center text-slate-400">
              <div className="w-20 h-20 mx-auto mb-4 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
                <Sparkles size={32} />
              </div>
              <p>Το sticker σας θα εμφανιστεί εδώ</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StickerCreator;
