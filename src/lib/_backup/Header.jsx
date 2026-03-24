
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDesign } from '@/hooks/useDesign';
import { supabase } from '@/lib/customSupabaseClient';

/* ─── Pill Nav (rounded container, pill hover/active) ─── */
const PillNav = ({ menuItems, location, getLabel, d, hoveredIndex, setHoveredIndex }) => (
  <div className="hidden xl:flex items-center">
    <div className="flex items-center backdrop-blur-md rounded-full px-1.5 py-1.5 border" style={{ backgroundColor: d.cardBg, borderColor: d.cardBorder }}>
      {menuItems.map((item, index) => {
        const isActive = location.pathname === item.path;
        return (
          <div key={index} className="relative" onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)}>
            {hoveredIndex === index && !isActive && (
              <motion.div layoutId="navHover" className="absolute inset-0 bg-white/[0.08] rounded-full" transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }} />
            )}
            {isActive && (
              <motion.div layoutId="navActive" className="absolute inset-0 rounded-full" style={{ background: d.accentBg, border: `1px solid ${d.accentHover}33` }} transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }} />
            )}
            <Link to={item.path} className={`relative z-10 px-4 py-2 text-[13px] heading-font tracking-wide transition-colors flex items-center rounded-full ${isActive ? 'font-bold' : 'text-white/80 hover:text-white font-medium'}`} style={isActive ? { color: d.accentLight } : undefined}>
              {getLabel(item)}
            </Link>
          </div>
        );
      })}
    </div>
  </div>
);

/* ─── Classic Nav (full-width bar, no pill container) ─── */
const ClassicNav = ({ menuItems, location, getLabel, d, hoveredIndex, setHoveredIndex }) => (
  <div className="hidden xl:flex items-center gap-1">
    {menuItems.map((item, index) => {
      const isActive = location.pathname === item.path;
      return (
        <div key={index} className="relative" onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)}>
          {hoveredIndex === index && !isActive && (
            <motion.div layoutId="navHoverClassic" className="absolute inset-0 rounded-lg" style={{ backgroundColor: d.accentBg }} transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }} />
          )}
          {isActive && (
            <motion.div layoutId="navActiveClassic" className="absolute inset-0 rounded-lg" style={{ background: d.accentBgStrong, boxShadow: `0 0 12px ${d.accent}25` }} transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }} />
          )}
          <Link to={item.path} className={`relative z-10 px-5 py-2.5 text-[13px] heading-font tracking-wide transition-colors flex items-center ${isActive ? 'font-bold' : 'text-white/70 hover:text-white font-medium'}`} style={isActive ? { color: d.accent } : undefined}>
            {getLabel(item)}
          </Link>
        </div>
      );
    })}
  </div>
);

/* ─── Underline Nav (bottom border indicator) ─── */
const UnderlineNav = ({ menuItems, location, getLabel, d, hoveredIndex, setHoveredIndex }) => (
  <div className="hidden xl:flex items-center gap-0">
    {menuItems.map((item, index) => {
      const isActive = location.pathname === item.path;
      return (
        <div key={index} className="relative" onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)}>
          <Link to={item.path} className={`relative z-10 px-5 py-2 text-[13px] heading-font tracking-wide transition-colors flex items-center ${isActive ? 'font-bold' : 'text-white/70 hover:text-white font-medium'}`} style={isActive ? { color: d.accent } : undefined}>
            {getLabel(item)}
          </Link>
          {isActive && (
            <motion.div layoutId="navUnderline" className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full" style={{ background: `linear-gradient(to right, ${d.gradientFrom}, ${d.gradientTo})` }} transition={{ type: 'spring', bounce: 0.3, duration: 0.5 }} />
          )}
          {hoveredIndex === index && !isActive && (
            <motion.div className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full bg-white/20" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} exit={{ scaleX: 0 }} transition={{ duration: 0.2 }} />
          )}
        </div>
      );
    })}
  </div>
);

const NAV_COMPONENTS = { pill: PillNav, classic: ClassicNav, underline: UnderlineNav };

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const { language, toggleLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const { getDesign, getLayout } = useDesign();
  const d = getDesign('header');
  const layout = getLayout('header');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .eq('is_active', true)
          .order('sort_order');
        
        if (error) throw error;

        if (data && data.length > 0) {
          setMenuItems(data);
        } else {
          throw new Error('No menu items found');
        }
      } catch (err) {
        console.warn('Failed to fetch menu items, using fallback:', err.message);
        setMenuItems([
            { label_ka: 'მთავარი', label_en: 'Home', path: '/' },
            { label_ka: 'ჩვენ შესახებ', label_en: 'About Us', path: '/about' },
            { label_ka: 'ისტორია', label_en: 'History', path: '/portfolio' },
            { label_ka: 'ბრენდები', label_en: 'Brands', path: '/industries' },
            { label_ka: 'პროექტები', label_en: 'Projects', path: '/projects' },
            { label_ka: 'სიახლეები', label_en: 'News', path: '/news' },
            { label_ka: 'კონტაქტი', label_en: 'Contact', path: '/contact' }
        ]);
      }
    };
    fetchMenu();
  }, []);

  const handleLanguageSwitch = () => {
    if (location.pathname === '/founder') {
      navigate('/founder-en');
    } else if (location.pathname === '/founder-en') {
      navigate('/founder');
    } else {
      toggleLanguage();
    }
  };

  const getLabel = (item) => language === 'ka' ? item.label_ka : item.label_en;

  const NavComponent = NAV_COMPONENTS[layout] || PillNav;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 backdrop-blur-xl ${
        isScrolled 
          ? 'shadow-[0_4px_30px_rgba(0,0,0,0.3)] border-b border-white/5' 
          : ''
      }`}
      style={{ backgroundColor: isScrolled ? d.bg + 'F2' : d.bg + 'CC' }}
    >
      <nav className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center group relative z-50">
             <motion.div 
               whileHover={{ scale: 1.03 }}
               transition={{ type: 'spring', stiffness: 400, damping: 25 }}
               className="flex items-center"
             >
                <img 
                  src="https://i.postimg.cc/BQ9F76vR/chocheli-investment-logo.png" 
                  alt="Chocheli Investment Group" 
                  className="h-9 md:h-11 w-auto object-contain transition-all duration-300"
                />
             </motion.div>
          </Link>

          {/* Desktop Navigation — layout variant */}
          <NavComponent menuItems={menuItems} location={location} getLabel={getLabel} d={d} hoveredIndex={hoveredIndex} setHoveredIndex={setHoveredIndex} />

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLanguageSwitch}
              className="px-4 py-2 rounded-full backdrop-blur-md border text-white transition-all text-xs font-bold uppercase tracking-widest flex items-center justify-center min-w-[3.5rem]"
              style={{ backgroundColor: d.accentBg, borderColor: d.cardBorder }}
            >
              {location.pathname === '/founder' ? 'Eng' : location.pathname === '/founder-en' ? 'ქარ' : (language === 'en' ? 'ქარ' : 'Eng')}
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden w-10 h-10 rounded-full backdrop-blur-md border flex items-center justify-center text-white transition-all"
              style={{ backgroundColor: d.accentBg, borderColor: d.cardBorder }}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="xl:hidden mb-4 backdrop-blur-xl rounded-2xl overflow-hidden border shadow-2xl"
              style={{ backgroundColor: d.bg2 + 'F2', borderColor: d.cardBorder }}
            >
              <div className="flex flex-col p-3 space-y-0.5">
                {menuItems.map((item, index) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.04 }}
                    >
                      <Link
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm heading-font transition-all ${
                           isActive 
                           ? 'font-bold' 
                           : 'text-white/80 hover:text-white hover:bg-white/[0.06]'
                        }`}
                        style={isActive ? { color: d.accentLight, backgroundColor: d.accentBg, border: `1px solid ${d.accent}20` } : undefined}
                      >
                        <span>{getLabel(item)}</span>
                        <ChevronRight className="w-4 h-4 transition-colors" style={{ color: isActive ? d.accent : 'rgba(255,255,255,0.2)' }} />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
};

export default Header;
