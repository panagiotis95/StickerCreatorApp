
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Home from './components/Home';
import StickerCreator from './components/StickerCreator';
import VideoGenerator from './components/VideoGenerator';
import ChatBot from './components/ChatBot';
import { Page, CartItem, Sticker } from './types';
import { 
  ShoppingCart, 
  CreditCard, 
  Trash2, 
  Plus, 
  Minus, 
  CheckCircle, 
  User, 
  ChevronRight, 
  Lock, 
  Loader2,
  AlertCircle
} from 'lucide-react';

type CheckoutStep = 'cart' | 'payment' | 'processing' | 'success';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('cart');
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '', name: '' });

  const addToCart = (sticker: Sticker) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === sticker.id);
      if (existing) {
        return prev.map(item => item.id === sticker.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...sticker, quantity: 1 }];
    });
    setCurrentPage(Page.Cart);
    setCheckoutStep('cart');
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.id !== id));
  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleStartPayment = () => {
    setCheckoutStep('payment');
  };

  const handleFinalPayment = () => {
    setCheckoutStep('processing');
    // Προσομοίωση επεξεργασίας από Stripe/PayPal API
    setTimeout(() => {
      setCheckoutStep('success');
      setTimeout(() => {
        setCart([]);
        setCheckoutStep('cart');
        setCurrentPage(Page.Home);
      }, 3000);
    }, 2500);
  };

  const renderPaymentMethod = () => (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => setPaymentMethod('stripe')}
          className={`flex-1 p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${paymentMethod === 'stripe' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'}`}
        >
          <CreditCard size={24} />
          <span className="font-bold text-sm">Πιστωτική Κάρτα</span>
        </button>
        <button 
          onClick={() => setPaymentMethod('paypal')}
          className={`flex-1 p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${paymentMethod === 'paypal' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'}`}
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-6" alt="paypal" />
          <span className="font-bold text-sm">PayPal</span>
        </button>
      </div>

      {paymentMethod === 'stripe' ? (
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Ονοματεπώνυμο Κάρτας</label>
            <input 
              type="text" 
              placeholder="JOHN DOE"
              className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 uppercase text-sm"
              value={cardDetails.name}
              onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Αριθμός Κάρτας</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="4242 4242 4242 4242"
                className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 text-sm"
                value={cardDetails.number}
                onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="visa" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-4" alt="mastercard" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Λήξη (MM/YY)</label>
              <input 
                type="text" 
                placeholder="12/26"
                className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 text-sm text-center"
                value={cardDetails.expiry}
                onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">CVC</label>
              <input 
                type="password" 
                placeholder="***"
                className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 text-sm text-center"
                value={cardDetails.cvc}
                onChange={(e) => setCardDetails({...cardDetails, cvc: e.target.value})}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 p-8 rounded-3xl text-center space-y-4">
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-10 mx-auto opacity-80" alt="paypal logo" />
          <p className="text-sm text-slate-600">Θα ανακατευθυνθείτε στο PayPal για την ασφαλή ολοκλήρωση της πληρωμής.</p>
          <div className="w-full py-3 bg-[#FFC439] rounded-full text-[#111] font-bold text-sm cursor-pointer hover:bg-[#F2BA36] transition-colors flex items-center justify-center gap-2">
            <span>PayPal</span>
            <span className="italic">Checkout</span>
          </div>
        </div>
      )}

      <div className="pt-6 border-t border-slate-100">
        <button 
          onClick={handleFinalPayment}
          className="w-full bg-indigo-600 text-white font-bold py-5 rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group"
        >
          <Lock size={18} className="text-indigo-200 group-hover:text-white transition-colors" />
          Πληρωμή €{total.toFixed(2)}
        </button>
        <p className="text-[10px] text-center text-slate-400 mt-4 flex items-center justify-center gap-1">
          <ShieldCheck size={12} className="text-green-500" />
          Secure 256-bit SSL Encrypted Payment
        </p>
      </div>
    </div>
  );

  const renderPage = () => {
    switch (currentPage) {
      case Page.Home: return <Home onStart={() => setCurrentPage(Page.StickerCreator)} />;
      case Page.StickerCreator: return <StickerCreator onAddToCart={addToCart} />;
      case Page.VideoGenerator: return <VideoGenerator />;
      case Page.Chat: return <ChatBot />;
      case Page.About: return (
        <div className="max-w-4xl mx-auto p-8 space-y-12">
          <h1 className="text-4xl font-bold font-accent text-center">Σχετικά με Εμάς</h1>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <img src="https://picsum.photos/600/600?random=50" className="rounded-3xl shadow-xl" alt="team" />
            <div className="space-y-4 text-slate-600">
              <p>Η StickerGenius ξεκίνησε από μια απλή ιδέα: να κάνουμε τη δημιουργικότητα προσβάσιμη σε όλους μέσω της τεχνολογίας.</p>
              <p>Είμαστε μια ομάδα σχεδιαστών και μηχανικών που πιστεύουν ότι η AI μπορεί να είναι ο απόλυτος συνεργάτης στην τέχνη.</p>
            </div>
          </div>
        </div>
      );
      case Page.Contact: return (
        <div className="max-w-4xl mx-auto p-8">
          <div className="bg-white rounded-[40px] shadow-xl p-12 grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold font-accent">Επικοινωνήστε μαζί μας</h2>
              <p className="text-slate-500">Είμαστε εδώ για να λύσουμε κάθε απορία σας.</p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-indigo-600 font-bold">
                  <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center">📞</div>
                  +30 210 1234567
                </div>
                <div className="flex items-center gap-3 text-indigo-600 font-bold">
                  <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center">✉️</div>
                  support@stickergenius.gr
                </div>
              </div>
            </div>
            <form className="space-y-4" onSubmit={e => e.preventDefault()}>
              <input type="text" placeholder="Όνομα" className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500" />
              <input type="email" placeholder="Email" className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500" />
              <textarea placeholder="Το μήνυμά σας..." className="w-full h-32 p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 resize-none" />
              <button className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 transition-all">Αποστολή</button>
            </form>
          </div>
        </div>
      );
      case Page.Cart: return (
        <div className="max-w-5xl mx-auto p-4 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h1 className="text-3xl font-bold font-accent flex items-center gap-3">
              <ShoppingCart className="text-indigo-600" /> {checkoutStep === 'payment' ? 'Ολοκλήρωση Πληρωμής' : 'Το Καλάθι σας'}
            </h1>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <span className={checkoutStep === 'cart' ? 'text-indigo-600' : 'text-slate-900'}>ΚΑΛΑΘΙ</span>
              <ChevronRight size={14} />
              <span className={checkoutStep === 'payment' ? 'text-indigo-600' : ''}>ΠΛΗΡΩΜΗ</span>
              <ChevronRight size={14} />
              <span>ΕΠΙΒΕΒΑΙΩΣΗ</span>
            </div>
          </div>
          
          {cart.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <p className="text-slate-400 mb-6">Το καλάθι σας είναι άδειο.</p>
              <button 
                onClick={() => setCurrentPage(Page.StickerCreator)}
                className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all"
              >
                Δημιουργήστε Stickers
              </button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-12 gap-12">
              <div className="lg:col-span-7 space-y-6">
                {checkoutStep === 'cart' ? (
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 animate-in fade-in duration-300">
                        <img src={item.url} className="w-20 h-20 object-contain bg-slate-50 rounded-xl" alt="sticker" />
                        <div className="flex-grow">
                          <h4 className="font-bold text-slate-800 text-sm truncate max-w-[200px]">{item.prompt}</h4>
                          <p className="text-indigo-600 font-bold">€{item.price}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:bg-slate-100 rounded transition-colors"><Minus size={16} /></button>
                          <span className="w-8 text-center font-bold">{item.quantity}</span>
                          <button onClick={() => updateQty(item.id, 1)} className="p-1 hover:bg-slate-100 rounded transition-colors"><Plus size={16} /></button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500 transition-colors p-2"><Trash2 size={20} /></button>
                      </div>
                    ))}
                    <button 
                      onClick={() => setCurrentPage(Page.StickerCreator)}
                      className="text-indigo-600 font-bold text-sm flex items-center gap-2 hover:translate-x-1 transition-transform"
                    >
                      <Plus size={16} /> Προσθήκη περισσότερων stickers
                    </button>
                  </div>
                ) : renderPaymentMethod()}
              </div>

              <div className="lg:col-span-5">
                <div className="bg-white p-8 rounded-[40px] shadow-2xl shadow-slate-200/50 sticky top-24 space-y-6 border border-slate-100">
                  <h3 className="font-bold text-xl flex items-center justify-between">
                    Σύνοψη Παραγγελίας
                    <span className="text-xs bg-slate-100 px-3 py-1 rounded-full text-slate-500 uppercase tracking-wider">{cart.length} Items</span>
                  </h3>
                  
                  <div className="space-y-3 pb-6 border-b border-slate-50">
                    <div className="flex justify-between text-slate-500 text-sm">
                      <span>Υποσύνολο</span>
                      <span className="font-medium text-slate-900">€{total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 text-sm">
                      <span>ΦΠΑ (24%)</span>
                      <span className="font-medium text-slate-900">Περιλαμβάνεται</span>
                    </div>
                    <div className="flex justify-between text-slate-500 text-sm">
                      <span>Μεταφορικά (Digital)</span>
                      <span className="text-green-600 font-bold uppercase text-[10px] bg-green-50 px-2 py-1 rounded-md">ΔΩΡΕΑΝ</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-2xl font-black font-accent">
                    <span>Σύνολο</span>
                    <span className="text-indigo-600">€{total.toFixed(2)}</span>
                  </div>

                  {checkoutStep === 'cart' && (
                    <button 
                      onClick={handleStartPayment}
                      className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group shadow-xl shadow-slate-200"
                    >
                      <span>Συνέχεια στην Πληρωμή</span>
                      <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}

                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-center gap-6 pt-4 grayscale opacity-40">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4" alt="paypal" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" className="h-4" alt="stripe" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-4" alt="mastercard" />
                    </div>
                    <div className="bg-indigo-50/50 p-4 rounded-2xl flex items-start gap-3">
                      <AlertCircle size={18} className="text-indigo-600 flex-shrink-0 mt-0.5" />
                      <p className="text-[10px] text-indigo-700 leading-relaxed">
                        Τα stickers σας θα είναι διαθέσιμα για άμεση λήψη αμέσως μετά την επιτυχή ολοκλήρωση της πληρωμής.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      );
      case Page.Account: return (
        <div className="max-w-4xl mx-auto p-8">
          <div className="bg-white rounded-[40px] shadow-xl p-12 text-center space-y-6">
            <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full mx-auto flex items-center justify-center">
              <User size={48} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Καλωσήρθατε πίσω!</h2>
              <p className="text-slate-500">guest_user_123</p>
            </div>
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              <div className="bg-slate-50 p-4 rounded-2xl">
                <div className="text-xl font-bold text-indigo-600">12</div>
                <div className="text-xs text-slate-500">Stickers</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl">
                <div className="text-xl font-bold text-pink-600">3</div>
                <div className="text-xs text-slate-500">Παραγγελίες</div>
              </div>
            </div>
            <button className="text-indigo-600 font-bold hover:underline">Αποσύνδεση</button>
          </div>
        </div>
      );
      default: return <Home onStart={() => setCurrentPage(Page.StickerCreator)} />;
    }
  };

  return (
    <Layout 
      currentPage={currentPage} 
      setCurrentPage={setCurrentPage}
      cartCount={cart.length}
    >
      {renderPage()}

      {/* Payment Processing Overlay */}
      {checkoutStep === 'processing' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/90 backdrop-blur-lg">
          <div className="text-center space-y-6">
            <div className="relative">
              <Loader2 className="w-20 h-20 text-indigo-600 animate-spin mx-auto" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Lock size={20} className="text-indigo-400" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold font-accent">Ασφαλής Επεξεργασία...</h2>
              <p className="text-slate-500 max-w-xs mx-auto text-sm">Παρακαλούμε μην κλείσετε το παράθυρο, επικοινωνούμε με την τράπεζά σας.</p>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Success Modal */}
      {checkoutStep === 'success' && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/80 backdrop-blur-md px-4">
          <div className="bg-white rounded-[40px] p-12 max-w-sm w-full text-center space-y-6 animate-in zoom-in duration-300 shadow-2xl">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full mx-auto flex items-center justify-center animate-bounce">
              <CheckCircle size={48} />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black font-accent">Επιτυχία!</h2>
              <p className="text-slate-500">Η πληρωμή ολοκληρώθηκε μέσω {paymentMethod === 'stripe' ? 'Κάρτας' : 'PayPal'}.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-xs text-slate-400 mb-1">ΑΡΙΘΜΟΣ ΠΑΡΑΓΓΕΛΙΑΣ</p>
              <p className="font-mono font-bold text-slate-700">#STK-{Math.floor(100000 + Math.random() * 900000)}</p>
            </div>
            <p className="text-xs text-slate-400 animate-pulse italic">Ανακατεύθυνση στην αρχική...</p>
          </div>
        </div>
      )}
    </Layout>
  );
};

// Εσωτερικό βοηθητικό icon component
const ShieldCheck = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export default App;
