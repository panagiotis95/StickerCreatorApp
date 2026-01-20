
import React from 'react';
import { Page } from '../types';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  MessageCircle, 
  Sparkles, 
  Video, 
  User, 
  Home,
  Info,
  Mail
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  setCurrentPage: (p: Page) => void;
  cartCount: number;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, setCurrentPage, cartCount }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navItems = [
    { id: Page.Home, label: 'Αρχική', icon: <Home size={20} /> },
    { id: Page.StickerCreator, label: 'Δημιουργία', icon: <Sparkles size={20} /> },
    { id: Page.VideoGenerator, label: 'Promo Videos', icon: <Video size={20} /> },
    { id: Page.Chat, label: 'Βοήθεια AI', icon: <MessageCircle size={20} /> },
    { id: Page.About, label: 'Σχετικά', icon: <Info size={20} /> },
    { id: Page.Contact, label: 'Επικοινωνία', icon: <Mail size={20} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => setCurrentPage(Page.Home)}
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform">
              <Sparkles size={24} />
            </div>
            <span className="text-xl font-bold font-accent text-slate-800 hidden sm:block">StickerGenius</span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`text-sm font-medium transition-colors ${currentPage === item.id ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={() => setCurrentPage(Page.Cart)}
              className="relative p-2 text-slate-600 hover:text-indigo-600 transition-colors"
            >
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => setCurrentPage(Page.Account)}
              className="p-2 text-slate-600 hover:text-indigo-600 transition-colors"
            >
              <User size={24} />
            </button>
            <button 
              className="lg:hidden p-2 text-slate-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}>
          <div 
            className="absolute top-0 left-0 w-64 h-full bg-white shadow-2xl p-6 flex flex-col gap-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 mb-8">
              <Sparkles className="text-indigo-600" size={24} />
              <span className="font-bold text-xl font-accent">Genius</span>
            </div>
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => { setCurrentPage(item.id); setIsMenuOpen(false); }}
                className={`flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${currentPage === item.id ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4 text-white">
              <Sparkles size={24} />
              <span className="text-xl font-bold font-accent">StickerGenius</span>
            </div>
            <p className="text-sm leading-relaxed">
              Η επόμενη γενιά στη δημιουργία stickers. Χρησιμοποιούμε τη δύναμη της AI για να φέρουμε τις ιδέες σας στη ζωή.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Προϊόντα</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => setCurrentPage(Page.StickerCreator)} className="hover:text-white transition-colors">Δημιουργία Stickers</button></li>
              <li><button className="hover:text-white transition-colors">Έτοιμα Σχέδια</button></li>
              <li><button className="hover:text-white transition-colors">Custom Πακέτα</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Εταιρεία</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => setCurrentPage(Page.About)} className="hover:text-white transition-colors">Σχετικά με Εμάς</button></li>
              <li><button onClick={() => setCurrentPage(Page.Contact)} className="hover:text-white transition-colors">Επικοινωνία</button></li>
              <li><button className="hover:text-white transition-colors">Όροι Χρήσης</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Newsletter</h4>
            <p className="text-xs mb-4">Εγγραφείτε για να λαμβάνετε προσφορές και νέα!</p>
            <form className="flex gap-2" onSubmit={e => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Email..." 
                className="bg-slate-800 border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 flex-grow"
              />
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors">
                OK
              </button>
            </form>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 text-center text-xs">
          &copy; {new Date().getFullYear()} StickerGenius AI. Όλα τα δικαιώματα διατηρούνται.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
