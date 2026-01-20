
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Home from './components/Home';
import StickerCreator from './components/StickerCreator';
import VideoGenerator from './components/VideoGenerator';
import ChatBot from './components/ChatBot';
import { Page, CartItem, Sticker } from './types';
import { ShoppingCart, CreditCard, Trash2, Plus, Minus, CheckCircle, User } from 'lucide-react';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);

  const addToCart = (sticker: Sticker) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === sticker.id);
      if (existing) {
        return prev.map(item => item.id === sticker.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...sticker, quantity: 1 }];
    });
    setCurrentPage(Page.Cart);
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.id !== id));
  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    setShowCheckoutSuccess(true);
    setTimeout(() => {
      setCart([]);
      setShowCheckoutSuccess(false);
      setCurrentPage(Page.Home);
    }, 3000);
  };

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
          <h1 className="text-3xl font-bold font-accent mb-8 flex items-center gap-3">
            <ShoppingCart className="text-indigo-600" /> Το Καλάθι σας
          </h1>
          
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
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <img src={item.url} className="w-20 h-20 object-contain bg-slate-50 rounded-xl" alt="sticker" />
                    <div className="flex-grow">
                      <h4 className="font-bold text-slate-800 text-sm truncate max-w-[200px]">{item.prompt}</h4>
                      <p className="text-indigo-600 font-bold">€{item.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:bg-slate-100 rounded"><Minus size={16} /></button>
                      <span className="w-8 text-center font-bold">{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="p-1 hover:bg-slate-100 rounded"><Plus size={16} /></button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
                  </div>
                ))}
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-xl h-fit space-y-6">
                <h3 className="font-bold text-xl">Σύνολο Παραγγελίας</h3>
                <div className="space-y-2 pb-4 border-b">
                  <div className="flex justify-between text-slate-600">
                    <span>Υποσύνολο</span>
                    <span>€{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Μεταφορικά</span>
                    <span className="text-green-600 font-bold">ΔΩΡΕΑΝ</span>
                  </div>
                </div>
                <div className="flex justify-between text-xl font-bold">
                  <span>Σύνολο</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                  <CreditCard size={20} />
                  Ολοκλήρωση Αγοράς
                </button>
                <div className="flex items-center justify-center gap-4 pt-4 grayscale opacity-50">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4" alt="paypal" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" className="h-4" alt="stripe" />
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

      {/* Checkout Success Modal */}
      {showCheckoutSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-md px-4">
          <div className="bg-white rounded-[40px] p-12 max-w-sm w-full text-center space-y-6 animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full mx-auto flex items-center justify-center animate-bounce">
              <CheckCircle size={40} />
            </div>
            <h2 className="text-2xl font-bold font-accent">Η παραγγελία ολοκληρώθηκε!</h2>
            <p className="text-slate-500">Σας ευχαριστούμε για την εμπιστοσύνη σας. Θα λάβετε σύντομα email επιβεβαίωσης.</p>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
