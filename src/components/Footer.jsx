import React from 'react';
import { Globe, MapPin, Mail, Phone, ChevronRight, Linkedin, Facebook, Twitter, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDesign } from '@/hooks/useDesign';
import { Link } from 'react-router-dom';
import { useSiteContent } from '@/hooks/useSiteContent';

const Footer = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const { content: c } = useSiteContent('footer');
  const { getDesign } = useDesign();
  const d = getDesign('footer');
  const lang = language === 'ka' ? 'ka' : 'en';

  const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Portfolio', path: '/portfolio' },
    { label: 'Industries', path: '/industries' },
    { label: 'Brand Catalog', path: '/brand-catalog' },
    { label: 'News', path: '/news' },
    { label: 'Careers', path: '/careers' },
    { label: 'Contact', path: '/contact' }
  ];

  return (
    <footer className="text-white pt-16 pb-8 relative overflow-hidden border-t border-white/5" style={{ backgroundColor: d.bg }}>
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" style={{ backgroundColor: d.accent + '08' }}></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3 pointer-events-none" style={{ backgroundColor: d.accent2 + '08' }}></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-6">
            <Link to="/" className="block">
               <h3 className="text-2xl font-bold heading-font uppercase tracking-wide text-white">
                  {c?.[`company_name_${lang}`] || (language === 'ka' ? 'ჩოჩელი' : 'Chocheli')}
               </h3>
               <p className="text-xs font-bold tracking-[0.2em] mt-1 opacity-90 uppercase" style={{ color: d.accent }}>
                  {c?.[`company_subtitle_${lang}`] || (language === 'ka' ? 'საინვესტიციო ჯგუფი' : 'Investment Group')}
               </p>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed body-font max-w-xs">
              {c?.[`description_${lang}`] || t({
                en: 'Building the future of Georgian business through 30 years of disciplined execution and strategic vision.',
                ka: 'ქართული ბიზნესის მომავლის შენება 30 წლიანი დისციპლინირებული შესრულებითა და სტრატეგიული ხედვით.'
              })}
            </p>
            <div className="flex items-center space-x-4">
              <a href={c?.social_links?.linkedin || '#'} className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:bg-teal-500 hover:text-white hover:border-teal-500 transition-all duration-300">
                <Linkedin size={18} />
              </a>
              <a href={c?.social_links?.facebook || '#'} className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:bg-teal-500 hover:text-white hover:border-teal-500 transition-all duration-300">
                <Facebook size={18} />
              </a>
              <a href={c?.social_links?.twitter || '#'} className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:bg-teal-500 hover:text-white hover:border-teal-500 transition-all duration-300">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-lg font-bold heading-font mb-6 text-white border-b border-slate-800 pb-2 inline-block">
              {t('Quick Links')}
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-x-4 gap-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-slate-400 hover:text-teal-300 hover:translate-x-1 transition-all duration-300 text-sm flex items-center group"
                  >
                    <ChevronRight className="w-3 h-3 mr-2 opacity-50 group-hover:opacity-100 text-teal-500" />
                    {t(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h4 className="text-lg font-bold heading-font mb-6 text-white border-b border-slate-800 pb-2 inline-block">
              {t('Contact')}
            </h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li className="flex items-start group">
                 <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center mr-3 shrink-0 group-hover:bg-teal-500/10 transition-colors">
                    <MapPin className="w-4 h-4 text-teal-400" />
                 </div>
                 <span className="mt-1">
                   {c?.[`address_${lang}`] || (language === 'ka' ? 'თავისუფლების მოედანი 12, თბილისი' : '12 Freedom Square, Tbilisi, Georgia')}
                 </span>
              </li>
              <li className="flex items-center group">
                 <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center mr-3 shrink-0 group-hover:bg-teal-500/10 transition-colors">
                    <Mail className="w-4 h-4 text-teal-400" />
                 </div>
                 <a href={`mailto:${c?.email || 'info@chocheli-group.ge'}`} className="hover:text-white transition-colors">{c?.email || 'info@chocheli-group.ge'}</a>
              </li>
              <li className="flex items-center group">
                 <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center mr-3 shrink-0 group-hover:bg-teal-500/10 transition-colors">
                    <Phone className="w-4 h-4 text-teal-400" />
                 </div>
                 <span>{c?.phone || '+995 32 2 123 456'}</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Language & Admin */}
          <div className="flex flex-col">
             <h4 className="text-lg font-bold heading-font mb-6 text-white border-b border-white/10 pb-2 inline-block">
                {t({ en: 'Settings', ka: 'პარამეტრები' })}
             </h4>
             
             <button
               onClick={toggleLanguage}
               className="flex items-center justify-between w-full p-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] hover:border-teal-400/20 transition-all duration-300 group mb-4"
             >
               <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-slate-400 group-hover:text-teal-300 transition-colors" />
                  <span className="text-sm font-medium text-slate-200">
                    {language === 'en' ? 'Language: English' : 'ენა: ქართული'}
                  </span>
               </div>
               <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
             </button>

             <Link to="/admin" className="flex items-center justify-between w-full p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-transparent hover:border-white/[0.06] transition-all duration-300 group mt-auto">
                 <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
                    <span className="text-sm font-medium text-slate-500 group-hover:text-white transition-colors">Admin Portal</span>
                 </div>
             </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs body-font text-center md:text-left">
            &copy; {new Date().getFullYear()} Chocheli Investment Group. {t('All rights reserved.')}
          </p>
          
          <div className="flex items-center space-x-6">
             <Link to="#" className="text-slate-500 hover:text-white text-xs transition-colors">Privacy Policy</Link>
             <Link to="#" className="text-slate-500 hover:text-white text-xs transition-colors">Terms of Use</Link>
             
             {/* Smarketer Logo */}
             <div className="flex items-center gap-2 pl-6 border-l border-slate-800 opacity-60 hover:opacity-100 transition-opacity">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">Dev by</span>
                <a href="https://smarketer.ge" target="_blank" rel="noopener noreferrer">
                   <img 
                      src="https://i.postimg.cc/8z5hCcGp/smarketer-white.webp" 
                      alt="Smarketer" 
                      className="h-4 w-auto"
                   />
                </a>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;