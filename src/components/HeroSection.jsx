import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Star, ChevronLeft, ChevronRight, MapPin, ArrowRight } from 'lucide-react';
import { useSiteContent } from '@/hooks/useSiteContent';
import { useDesign } from '@/hooks/useDesign';
import { projects as staticProjects } from '@/data/projects';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const { t, language } = useLanguage();
  const { content: c } = useSiteContent('hero_section');
  const { content: pc } = useSiteContent('projects');
  const { getDesign } = useDesign();
  const d = getDesign('hero');
  const lang = language === 'ka' ? 'ka' : 'en';

  // Build projects list
  const dbProjects = pc?.items?.map(item => ({
    id: item.id,
    title: { en: item.title_en, ka: item.title_ka },
    description: { en: item.description_en, ka: item.description_ka },
    location: { en: item.location_en, ka: item.location_ka },
    status: item.status || 'ongoing',
    images: item.images || []
  }));
  const projects = dbProjects || staticProjects;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentSlide(prev => (prev + 1) % projects.length);
  }, [projects.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentSlide(prev => (prev - 1 + projects.length) % projects.length);
  }, [projects.length]);

  // Auto-advance every 6 seconds
  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const currentProject = projects[currentSlide];

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 })
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ backgroundColor: d.bg }}>
      {/* Background: Current project image with overlay */}
      <AnimatePresence custom={direction} mode="popLayout">
        <motion.div
          key={currentSlide}
          custom={direction}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <img
            src={currentProject?.images?.[0] || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab'}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to right, ${d.bg}, ${d.bg}D9, ${d.bg}80)` }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${d.bg}, transparent, ${d.bg}4D)` }} />
        </motion.div>
      </AnimatePresence>

      {/* Noise texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[80vh]">
          
          {/* LEFT: Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold tracking-wide mb-8 backdrop-blur-sm" style={{ backgroundColor: d.accentBg, borderColor: d.accentHover + '33', color: d.accentLight }}>
               <Star size={14} fill="currentColor" />
               <span>{c?.[`badge_${lang}`] || (language === 'ka' ? '30+ წლიანი გამოცდილება' : '30+ Years of Excellence')}</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white heading-font mb-6 leading-[1.08] tracking-tight">
              {c?.[`title_line1_${lang}`] || (language === 'ka' ? 'ისტორიის' : 'Building')} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-white to-cyan-200">
                 {c?.[`title_line2_${lang}`] || (language === 'ka' ? 'მშენებლობა' : 'History.')}
              </span> <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-400">
                 {c?.[`title_line3_${lang}`] || (language === 'ka' ? 'მასშტაბური ხედვით' : 'Created at Scale.')}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-400 body-font mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
               {c?.[`subtitle_${lang}`] || t({
                 en: 'A premier Georgian family-owned investment group with a proven track record in manufacturing, retail, and distribution.',
                 ka: 'წამყვანი ქართული საოჯახო საინვესტიციო ჯგუფი დადასტურებული ისტორიით წარმოებაში, ვაჭრობასა და დისტრიბუციაში.'
               })}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
               <Link
                 to="/industries"
                 className="px-8 py-3.5 text-white font-bold rounded-full transition-all shadow-lg flex items-center gap-2 text-sm tracking-wide"
                 style={{ backgroundImage: `linear-gradient(to right, ${d.gradientFrom}, ${d.gradientTo})`, boxShadow: `0 10px 25px -5px ${d.accent}40` }}
               >
                 {language === 'ka' ? 'კომპანიები' : 'Our Companies'}
                 <ArrowRight className="w-4 h-4" />
               </Link>
               <Link
                 to="/projects"
                 className="px-8 py-3.5 bg-white/[0.08] backdrop-blur-md border border-white/[0.12] text-white font-bold rounded-full hover:bg-white/[0.15] transition-all flex items-center gap-2 text-sm tracking-wide"
               >
                 {language === 'ka' ? 'პროექტები' : 'Projects'}
               </Link>
            </div>
          </motion.div>

          {/* RIGHT: Project Slider Card */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden bg-white/[0.05] backdrop-blur-md border border-white/[0.1] shadow-2xl">
              {/* Slider Image */}
              <div className="relative h-72 md:h-80 overflow-hidden">
                <AnimatePresence custom={direction} mode="wait">
                  <motion.img
                    key={currentSlide}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                    src={currentProject?.images?.[0] || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab'}
                    alt={t(currentProject?.title)}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AnimatePresence>
                <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${d.bg}E6, transparent, transparent)` }} />

                {/* Status badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1.5 bg-teal-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full uppercase tracking-wider">
                    {t(currentProject?.status || 'ongoing')}
                  </span>
                </div>
              </div>

              {/* Project Info */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                  <div className="flex items-center gap-2 text-sm mb-2" style={{ color: d.accentLight }}>
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{t(currentProject?.location)}</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white heading-font mb-2 line-clamp-1">
                      {t(currentProject?.title)}
                    </h3>
                    <p className="text-slate-400 text-sm line-clamp-2 mb-4">
                      {t(currentProject?.description)}
                    </p>
                    <Link
                      to={`/project/${currentProject?.id}`}
                      className="inline-flex items-center hover:opacity-80 text-sm font-semibold transition-colors gap-1.5"
                      style={{ color: d.accentLight }}
                    >
                      {language === 'ka' ? 'ვრცლად' : 'View Details'}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Slider Controls */}
              <div className="absolute top-1/2 -translate-y-1/2 left-3 z-20">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={prevSlide}
                  className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </motion.button>
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 right-3 z-20">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={nextSlide}
                  className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Slide Indicators */}
            <div className="flex items-center justify-center gap-2 mt-5">
              {projects.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => { setDirection(idx > currentSlide ? 1 : -1); setCurrentSlide(idx); }}
                  className="relative"
                >
                  <div className={`h-1.5 rounded-full transition-all duration-500 ${
                    idx === currentSlide ? 'w-8' : 'w-3 bg-white/20 hover:bg-white/40'
                  }`} style={idx === currentSlide ? { backgroundColor: d.accentHover } : undefined} />
                </button>
              ))}
            </div>

            {/* Floating decorative elements */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 w-20 h-20 bg-teal-500/10 rounded-full blur-xl border border-teal-500/20 hidden lg:block pointer-events-none"
            />
            <motion.div 
              animate={{ y: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-8 -left-8 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl border border-cyan-500/20 hidden lg:block pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none z-10" style={{ background: `linear-gradient(to top, ${d.bg}, transparent)` }} />
    </section>
  );
};

export default HeroSection;