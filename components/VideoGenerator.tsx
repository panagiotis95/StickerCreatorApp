
import React, { useState } from 'react';
import { generatePromoVideo } from '../services/gemini';
import { Video, Sparkles, Loader2, Download, Play, AlertCircle } from 'lucide-react';

const VideoGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [needsKey, setNeedsKey] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return;

    // Check key
    const hasKey = await (window as any).aistudio?.hasSelectedApiKey();
    if (!hasKey) {
      setNeedsKey(true);
      return;
    }

    setLoading(true);
    const result = await generatePromoVideo(prompt, aspectRatio);
    if (result) setVideoUrl(result);
    setLoading(false);
  };

  const handleKeySelect = async () => {
    await (window as any).aistudio?.openSelectKey();
    setNeedsKey(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-accent mb-4 text-slate-800">Promo Video Generator</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Δημιουργήστε ένα κινηματογραφικό βίντεο για την προώθηση των stickers σας με την τεχνολογία Veo 3.1.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <label className="block text-sm font-bold text-slate-700">Περιγράψτε το βίντεο</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="π.χ. Ένα παιδί που κολλάει αστραφτερά stickers στο laptop του, ηλιόλουστο δωμάτιο, κινηματογραφική λήψη..."
              className="w-full h-32 p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
              <button 
                onClick={() => setAspectRatio('16:9')}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${aspectRatio === '16:9' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-600'}`}
              >
                16:9 (Landscape)
              </button>
              <button 
                onClick={() => setAspectRatio('9:16')}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${aspectRatio === '9:16' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-600'}`}
              >
                9:16 (Portrait)
              </button>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !prompt}
              className="bg-slate-900 text-white font-bold py-3 px-10 rounded-2xl hover:bg-slate-800 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
              Δημιουργία Video
            </button>
          </div>

          {needsKey && (
            <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-red-700">
                <AlertCircle size={20} />
                <span className="text-sm font-medium">Απαιτείται κλειδί API για τη χρήση του Veo.</span>
              </div>
              <button 
                onClick={handleKeySelect}
                className="bg-red-600 text-white text-xs font-bold py-2 px-4 rounded-lg hover:bg-red-700"
              >
                Επιλογή Κλειδιού
              </button>
            </div>
          )}
        </div>

        <div className="bg-slate-900 min-h-[300px] flex items-center justify-center relative p-4">
          {loading ? (
            <div className="flex flex-col items-center gap-4 text-white text-center">
              <Loader2 className="animate-spin w-12 h-12 text-indigo-400" />
              <div className="space-y-1">
                <p className="font-bold text-lg">Η παραγωγή ξεκίνησε!</p>
                <p className="text-slate-400 text-sm">Αυτό μπορεί να διαρκέσει 1-2 λεπτά. Μην κλείσετε τη σελίδα.</p>
              </div>
            </div>
          ) : videoUrl ? (
            <div className="w-full max-w-2xl">
              <video 
                src={videoUrl} 
                controls 
                autoPlay 
                className={`w-full rounded-2xl shadow-2xl ${aspectRatio === '9:16' ? 'max-h-[500px] object-contain' : ''}`}
              />
              <div className="mt-6 flex justify-center gap-4">
                <a 
                  href={videoUrl} 
                  download="sticker-promo.mp4"
                  className="bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-xl hover:bg-white/20 transition-all flex items-center gap-2 font-bold"
                >
                  <Download size={20} />
                  Λήψη Video
                </a>
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-500 space-y-2">
              <Video size={48} className="mx-auto opacity-20" />
              <p>Το βίντεο σας θα εμφανιστεί εδώ</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoGenerator;
