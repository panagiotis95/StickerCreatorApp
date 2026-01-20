
import React from 'react';
import { Page } from '../types';
import { Sparkles, Palette, Zap, ShieldCheck, Heart, ArrowRight, Play } from 'lucide-react';

interface HomeProps {
  onStart: () => void;
}

const Home: React.FC<HomeProps> = ({ onStart }) => {
  return (
    <div className="space-y-24 pb-24">
      {/* Hero */}
      <section className="relative h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-300 rounded-full blur-[100px] opacity-20 animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-300 rounded-full blur-[100px] opacity-20" />
          <div className="grid grid-cols-6 grid-rows-6 w-full h-full opacity-[0.03]">
            {Array.from({ length: 36 }).map((_, i) => (
              <div key={i} className="border border-slate-900" />
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider">
              <Zap size={14} /> New: Gemini 2.5 Powered
            </div>
            <h1 className="text-5xl sm:text-7xl font-bold font-accent leading-tight text-slate-900">
              Δημιουργήστε <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">Stickers</span> που Μιλάνε!
            </h1>
            <p className="text-lg text-slate-600 max-w-xl mx-auto lg:mx-0">
              Η StickerGenius είναι η πρώτη πλατφόρμα που χρησιμοποιεί προηγμένη AI για να μετατρέψει τις λέξεις σας σε μοναδικά, υψηλής ποιότητας αυτοκόλλητα σε δευτερόλεπτα.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <button 
                onClick={onStart}
                className="bg-indigo-600 text-white font-bold py-4 px-10 rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-105 transition-all flex items-center gap-2"
              >
                Ξεκινήστε Τώρα <ArrowRight size={20} />
              </button>
              <button className="bg-white text-slate-700 font-bold py-4 px-10 rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all flex items-center gap-2">
                <Play size={20} /> Δείτε το Demo
              </button>
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-4 pt-4 text-sm text-slate-400">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => (
                  <img key={i} src={`https://picsum.photos/32/32?random=${i}`} className="w-8 h-8 rounded-full border-2 border-white" alt="user" />
                ))}
              </div>
              <span>10,000+ δημιουργοί ήδη μαζί μας</span>
            </div>
          </div>

          <div className="hidden lg:flex relative justify-center">
            <div className="relative w-80 h-80 bg-white rounded-[60px] shadow-2xl p-4 flex items-center justify-center rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-pink-500/10 rounded-[60px]" />
              <img src="https://picsum.photos/300/300?random=10" className="w-64 h-64 object-contain rounded-3xl drop-shadow-xl sticker-effect" alt="sticker demo" />
              <div className="absolute -top-6 -right-6 bg-yellow-400 text-slate-900 font-bold py-2 px-4 rounded-xl rotate-12 shadow-lg">
                AI GEN
              </div>
            </div>
            <div className="absolute top-20 -left-10 w-48 h-48 bg-white rounded-[40px] shadow-2xl p-4 flex items-center justify-center -rotate-12 hover:rotate-0 transition-transform duration-500">
              <img src="https://picsum.photos/200/200?random=11" className="w-36 h-36 object-contain drop-shadow-lg" alt="sticker demo 2" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          { label: 'Δημιουργίες', value: '500K+' },
          { label: 'Χρήστες', value: '120K' },
          { label: 'Αξιολογήσεις', value: '4.9/5' },
          { label: 'Χώρες', value: '25+' },
        ].map((stat, idx) => (
          <div key={idx} className="text-center space-y-2 p-6 bg-white rounded-3xl border border-slate-100">
            <div className="text-3xl font-bold text-slate-800">{stat.value}</div>
            <div className="text-sm text-slate-500">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-bold font-accent">Γιατί να μας επιλέξετε;</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">Συνδυάζουμε την τέχνη με την κορυφαία τεχνολογία.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'AI Σχεδιασμός', desc: 'Μετατρέψτε το κείμενο σε τέχνη αμέσως.', icon: <Palette className="text-indigo-600" /> },
            { title: 'Υψηλή Ποιότητα', desc: 'Stickers έτοιμα για εκτύπωση σε 4K.', icon: <Sparkles className="text-pink-600" /> },
            { title: 'Ασφαλείς Πληρωμές', desc: 'PayPal, Stripe & κρυπτονομίσματα.', icon: <ShieldCheck className="text-green-600" /> },
          ].map((feat, idx) => (
            <div key={idx} className="bg-white p-10 rounded-[40px] border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all group">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-50 transition-colors">
                {feat.icon}
              </div>
              <h3 className="text-xl font-bold mb-4">{feat.title}</h3>
              <p className="text-slate-500 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-slate-900 py-24 px-4 overflow-hidden relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-accent text-white">Τι λένε οι πελάτες μας</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-slate-800 p-8 rounded-3xl border border-slate-700 space-y-4">
                <div className="flex text-yellow-400 gap-1">
                  {Array.from({ length: 5 }).map((_, j) => <Heart key={j} size={16} fill="currentColor" />)}
                </div>
                <p className="text-slate-300 italic">"Η ποιότητα των stickers που παρήγαγε η AI ήταν απίστευτη. Δεν πίστευα ότι θα ήταν τόσο εύκολο!"</p>
                <div className="flex items-center gap-4">
                  <img src={`https://picsum.photos/40/40?random=${i+20}`} className="w-10 h-10 rounded-full" alt="avatar" />
                  <div>
                    <div className="text-white font-bold text-sm">Γιώργος Π.</div>
                    <div className="text-slate-500 text-xs">Verified Artist</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-[50px] p-12 text-center text-white space-y-8 shadow-2xl">
          <h2 className="text-4xl font-bold font-accent">Έτοιμοι να δημιουργήσετε;</h2>
          <p className="text-indigo-100 max-w-xl mx-auto">
            Γίνετε μέλος της κοινότητάς μας σήμερα και πάρτε 20% έκπτωση στην πρώτη σας παραγγελία!
          </p>
          <button 
            onClick={onStart}
            className="bg-white text-indigo-600 font-bold py-4 px-12 rounded-2xl hover:bg-slate-50 hover:scale-105 transition-all shadow-xl"
          >
            Ξεκινήστε Δωρεάν
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
