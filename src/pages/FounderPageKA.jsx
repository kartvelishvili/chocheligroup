import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import Timeline from '@/components/Timeline';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowDown } from 'lucide-react';
import { useSiteContent } from '@/hooks/useSiteContent';
import { useDesign } from '@/hooks/useDesign';

const defaultMilestones = [
  { year: "1991", title: '\u10d9\u10dd\u10db\u10de\u10d0\u10dc\u10d8\u10d0 \u201e\u10da\u10dd\u10db\u10d8\u10e1\u10d8\u10e1\u201c \u10d3\u10d0\u10d0\u10e0\u10e1\u10d4\u10d1\u10d0' },
  { year: "2005", title: '\u10dc\u10d0\u10e2\u10d0\u10ee\u10e2\u10d0\u10e0\u10d8\u10e1 \u10da\u10e3\u10d3\u10e1\u10d0\u10ee\u10d0\u10e0\u10e8\u10d8\u10e1 \u10d2\u10d0\u10ee\u10e1\u10dc\u10d0' },
  { year: "2006", title: '\u10de\u10d0\u10e0\u10e2\u10dc\u10d8\u10dd\u10e0\u10dd\u10d1\u10d0 Knauf-\u10d7\u10d0\u10dc' },
  { year: "2009", title: '\u10e1\u10d0\u10d9\u10dd\u10dc\u10d3\u10d8\u10e2\u10e0\u10dd \u10d9\u10dd\u10db\u10de\u10d0\u10dc\u10d8\u10d0 \u201e\u10d1\u10d0\u10e0\u10d0\u10db\u10d1\u10dd\u10e1\u201c \u10d3\u10d0\u10d0\u10e0\u10e1\u10d4\u10d1\u10d0' },
  { year: "2011", title: '\u10da\u10e3\u10d3\u10e1\u10d0\u10ee\u10d0\u10e0\u10e8 \u201e\u10d6\u10d4\u10d3\u10d0\u10d6\u10d4\u10dc\u10d8\u10e1\u201c \u10d2\u10d0\u10ee\u10e1\u10dc\u10d0' },
  { year: "2017", title: '\u10e1\u10d0\u10d5\u10d0\u10ed\u10e0\u10dd \u10e5\u10e1\u10d4\u10da \u201e\u10db\u10d0\u10d2\u10dc\u10d8\u10e2\u10d8\u10e1\u201c \u10d2\u10d0\u10e8\u10d5\u10d4\u10d1\u10d0' },
  { year: "2024", title: '\u201e\u10d3\u10d4\u10d8\u10da\u10d8\u201c \u10ef\u10d2\u10e3\u10e4\u10d7\u10d0\u10dc \u10e8\u10d4\u10e0\u10ec\u10e7\u10db\u10d0' },
  { year: "2025", title: '\u10d4\u10da\u10d4\u10e5\u10e2\u10e0\u10dd\u10db\u10dd\u10d1\u10d8\u10da\u10d4\u10d1\u10d8\u10e1 (EV) \u10d3\u10d0 \u10d9\u10d0\u10d1\u10d0\u10da\u10d0\u10e1 \u10de\u10e0\u10dd\u10d4\u10e5\u10e2\u10d4\u10d1\u10d8\u10e1 \u10d2\u10d0\u10e4\u10d0\u10e0\u10d7\u10dd\u10d4\u10d1\u10d0' }
];

const defaultBioSections = [
  { id: 1, title: '\u10d0\u10d3\u10e0\u10d4\u10e3\u10da\u10d8 \u10ec\u10da\u10d4\u10d1\u10d8 \u10d3\u10d0 \u10d2\u10d0\u10dc\u10d0\u10d7\u10da\u10d4\u10d1\u10d0', text: '\u10ea\u10d4\u10d6\u10d0\u10e0 \u10e9\u10dd\u10e9\u10d4\u10da\u10d8\u10e1 \u10d2\u10d6\u10d0 \u10d8\u10ec\u10e7\u10d4\u10d1\u10d0 \u10e1\u10d0\u10e5\u10d0\u10e0\u10d7\u10d5\u10d4\u10da\u10dd\u10e1\u10d7\u10d5\u10d8\u10e1 \u10e3\u10e0\u10d7\u10e3\u10da\u10d4\u10e1, \u10d2\u10d0\u10e0\u10d3\u10d0\u10db\u10d0\u10d5\u10d0\u10da \u10de\u10d4\u10e0\u10d8\u10dd\u10d3\u10e8\u10d8. \u10d0\u10ee\u10d0\u10da\u10d2\u10d0\u10d6\u10e0\u10d3\u10dd\u10d1\u10d8\u10d3\u10d0\u10dc\u10d5\u10d4 \u10d2\u10d0\u10db\u10dd\u10d8\u10e0\u10e9\u10d4\u10dd\u10d3\u10d0 \u10da\u10d8\u10d3\u10d4\u10e0\u10e3\u10da\u10d8 \u10d7\u10d5\u10d8\u10e1\u10d4\u10d1\u10d4\u10d1\u10d8\u10d7 \u10d3\u10d0 \u10e8\u10e0\u10dd\u10db\u10d8\u10e1\u10d0\u10d3\u10db\u10d8 \u10d2\u10d0\u10dc\u10e1\u10d0\u10d9\u10e3\u10d7\u10e0\u10d4\u10d1\u10e3\u10da\u10d8 \u10d3\u10d0\u10db\u10dd\u10d9\u10d8\u10d3\u10d4\u10d1\u10e3\u10da\u10d4\u10d1\u10d8\u10d7.', image: "https://i.postimg.cc/L5fSvwW3/506835830-10014646511952069-4363242619380959237-n.jpg" },
  { id: 2, title: '\u10de\u10d8\u10e0\u10d5\u10d4\u10da\u10d8 \u10dc\u10d0\u10d1\u10d8\u10ef\u10d4\u10d1\u10d8 \u10d1\u10d8\u10d6\u10dc\u10d4\u10e1\u10e8\u10d8', text: '90-\u10d8\u10d0\u10dc\u10d4\u10d1\u10d8\u10e1 \u10d3\u10d0\u10e1\u10d0\u10ec\u10e7\u10d8\u10e1\u10e8\u10d8, \u10e0\u10dd\u10d3\u10d4\u10e1\u10d0\u10ea \u10e5\u10d5\u10d4\u10e7\u10d0\u10dc\u10d0\u10e8\u10d8 \u10e1\u10e0\u10e3\u10da\u10d8 \u10d4\u10d9\u10dd\u10dc\u10dd\u10db\u10d8\u10d9\u10e3\u10e0\u10d8 \u10e1\u10e2\u10d0\u10d2\u10dc\u10d0\u10ea\u10d8\u10d0 \u10d8\u10e7\u10dd, \u10ea\u10d4\u10d6\u10d0\u10e0 \u10e9\u10dd\u10e9\u10d4\u10da\u10db\u10d0 \u10d2\u10d0\u10d3\u10d0\u10d3\u10d2\u10d0 \u10d2\u10d0\u10d1\u10d4\u10d3\u10e3\u10da\u10d8 \u10dc\u10d0\u10d1\u10d8\u10ef\u10d4\u10d1\u10d8 \u10d9\u10d4\u10e0\u10eb\u10dd \u10e1\u10d4\u10e5\u10e2\u10dd\u10e0\u10e8\u10d8.', image: "https://i.postimg.cc/x1g2sKsX/505897957-10014646788618708-2502156204642059171-n.jpg" },
  { id: 3, title: '\u10ec\u10d0\u10e0\u10db\u10dd\u10d4\u10d1\u10d8\u10e1 \u10db\u10d0\u10e1\u10e8\u10e2\u10d0\u10d1\u10d8\u10e0\u10d4\u10d1\u10d0', text: '2000-\u10d8\u10d0\u10dc\u10d8 \u10ec\u10da\u10d4\u10d1\u10d8 \u10d2\u10d0\u10e0\u10d3\u10d0\u10db\u10e2\u10d4\u10ee\u10d8 \u10d0\u10e6\u10db\u10dd\u10e9\u10dc\u10d3\u10d0. \u201e\u10da\u10dd\u10db\u10d8\u10e1\u10d8\u10e1\u201c \u10d3\u10d0 \u10e8\u10d4\u10db\u10d3\u10d2\u10dd\u10db \u201e\u10dc\u10d0\u10e2\u10d0\u10ee\u10e2\u10d0\u10e0\u10d8\u10e1\u201c \u10d3\u10d0\u10d0\u10e0\u10e1\u10d4\u10d1\u10d0\u10db \u10e1\u10e0\u10e3\u10da\u10d8\u10d0\u10d3 \u10e8\u10d4\u10ea\u10d5\u10d0\u10da\u10d0 \u10e5\u10d0\u10e0\u10d7\u10e3\u10da\u10d8 \u10d1\u10d0\u10d6\u10d0\u10e0\u10d8.', image: "https://i.postimg.cc/SsYbNHmb/506372066-10013430508740336-349768235636487541-n.jpg" },
  { id: 4, title: '\u10e1\u10d0\u10ef\u10d0\u10e0\u10dd \u10e1\u10d0\u10db\u10e1\u10d0\u10ee\u10e3\u10e0\u10d8 \u10d3\u10d0 \u10da\u10d8\u10d3\u10d4\u10e0\u10dd\u10d1\u10d0', text: '\u10d1\u10d8\u10d6\u10dc\u10d4\u10e1\u10e8\u10d8 \u10d3\u10d0\u10d2\u10e0\u10dd\u10d5\u10d8\u10da\u10d8 \u10e3\u10d6\u10d0\u10e0\u10db\u10d0\u10d6\u10d0\u10e0\u10d8 \u10d2\u10d0\u10db\u10dd\u10ea\u10d3\u10d8\u10da\u10d4\u10d1\u10d0 \u10ea\u10d4\u10d6\u10d0\u10e0 \u10e9\u10dd\u10e9\u10d4\u10da\u10db\u10d0 \u10e1\u10d0\u10ee\u10d4\u10da\u10db\u10ec\u10d8\u10e4\u10dd \u10e1\u10d0\u10db\u10e1\u10d0\u10ee\u10e3\u10e0\u10e8\u10d8 \u10d2\u10d0\u10d3\u10d0\u10d8\u10e2\u10d0\u10dc\u10d0.', image: "https://i.postimg.cc/0jgR6ZNb/506648127-10020319648051422-783754334374978744-n.jpg" },
  { id: 5, title: '\u10d8\u10dc\u10d3\u10e3\u10e1\u10e2\u10e0\u10d8\u10e3\u10da\u10d8 \u10d3\u10d8\u10d5\u10d4\u10e0\u10e1\u10d8\u10e4\u10d8\u10d9\u10d0\u10ea\u10d8\u10d0', text: '\u10db\u10ee\u10dd\u10da\u10dd\u10d3 \u10e1\u10d0\u10e1\u10db\u10d4\u10da\u10d4\u10d1\u10d8\u10e1 \u10ec\u10d0\u10e0\u10db\u10dd\u10d4\u10d1\u10d8\u10d7 \u10e8\u10d4\u10db\u10dd\u10e4\u10d0\u10e0\u10d2\u10d5\u10da\u10d0 \u10d0\u10e0 \u10d8\u10e7\u10dd \u10e1\u10d0\u10d9\u10db\u10d0\u10e0\u10d8\u10e1\u10d8. \u10e1\u10e2\u10e0\u10d0\u10e2\u10d4\u10d2\u10d8\u10e3\u10da\u10d8 \u10ee\u10d4\u10d3\u10d5\u10d8\u10e1 \u10dc\u10d0\u10ec\u10d8\u10da\u10d8 \u10d8\u10e7\u10dd \u10d1\u10d8\u10d6\u10dc\u10d4\u10e1\u10d8\u10e1 \u10d3\u10d8\u10d5\u10d4\u10e0\u10e1\u10d8\u10e4\u10d8\u10d9\u10d0\u10ea\u10d8\u10d0.', image: "https://i.postimg.cc/66RNssH4/508447183-10045627062187347-4692553886682053883-n.jpg" },
  { id: 6, title: '\u10e0\u10d8\u10d7\u10d4\u10d8\u10da\u10d8 \u10d3\u10d0 \u10d4\u10e0\u10dd\u10d5\u10dc\u10e3\u10da\u10d8 \u10db\u10d0\u10e1\u10e8\u10e2\u10d0\u10d1\u10d8', text: '\u10db\u10dd\u10db\u10ee\u10db\u10d0\u10e0\u10d4\u10d1\u10d4\u10da\u10d7\u10d0\u10dc \u10de\u10d8\u10e0\u10d3\u10d0\u10de\u10d8\u10e0\u10d8 \u10d9\u10dd\u10db\u10e3\u10dc\u10d8\u10d9\u10d0\u10ea\u10d8\u10d8\u10e1\u10d7\u10d5\u10d8\u10e1 \u10e8\u10d4\u10d8\u10e5\u10db\u10dc\u10d0 \u201e\u10db\u10d0\u10d2\u10dc\u10d8\u10e2\u10d8\u201c, \u10e0\u10dd\u10db\u10d4\u10da\u10d8\u10ea \u10d3\u10e6\u10d4\u10e1 \u10d0\u10e1\u10dd\u10d1\u10d8\u10d7 \u10e4\u10d8\u10da\u10d8\u10d0\u10da\u10e1 \u10d8\u10d7\u10d5\u10da\u10d8\u10e1 \u10db\u10d7\u10d4\u10da\u10d8 \u10e1\u10d0\u10e5\u10d0\u10e0\u10d7\u10d5\u10d4\u10da\u10dd\u10e1 \u10db\u10d0\u10e1\u10e8\u10e2\u10d0\u10d1\u10d8\u10d7.', image: "https://i.postimg.cc/BQ0f4hkq/508418937-10043544265728960-2290390415442953318-n.jpg" },
  { id: 7, title: '\u10d3\u10e6\u10d4\u10d5\u10d0\u10dc\u10d3\u10d4\u10da\u10d8 \u10d3\u10e6\u10d4', text: '\u10d3\u10e6\u10d4\u10e1 \u10ea\u10d4\u10d6\u10d0\u10e0 \u10e9\u10dd\u10e9\u10d4\u10da\u10d8 \u10d0\u10d2\u10e0\u10eb\u10d4\u10da\u10d4\u10d1\u10e1 \u10d0\u10e5\u10e2\u10d8\u10e3\u10e0 \u10e1\u10d0\u10e5\u10db\u10d8\u10d0\u10dc\u10dd\u10d1\u10d0\u10e1 \u10e0\u10dd\u10d2\u10dd\u10e0\u10ea \u10d1\u10d8\u10d6\u10dc\u10d4\u10e1\u10d8\u10e1 \u10d2\u10d0\u10dc\u10d5\u10d8\u10d7\u10d0\u10e0\u10d4\u10d1\u10d8\u10e1, \u10d8\u10e1\u10d4 \u10e1\u10d0\u10d9\u10d0\u10dc\u10dd\u10dc\u10db\u10d3\u10d4\u10d1\u10da\u10dd \u10db\u10d8\u10db\u10d0\u10e0\u10d7\u10e3\u10da\u10d4\u10d1\u10d8\u10d7.', image: null }
];

/* classic layout - Full hero, timeline, alternating bio */
const ClassicFounder = ({ d, c, milestones, bioSections }) => (
  <div style={{ backgroundColor: d.bg2 || '#f8fafc' }}>
    <section className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 z-10" style={{ background: `linear-gradient(to top, ${d.heroBg || d.bg}, ${d.heroBg || d.bg}66, transparent)` }} />
        <div className="absolute inset-0 z-10" style={{ background: `linear-gradient(to right, ${d.heroBg || d.bg}BB, transparent, transparent)` }} />
        <img src={c?.hero_image_url || "https://i.postimg.cc/s2XRbv8m/506208349-10020878614662192-2846366780113441950-n.jpg"} alt="" className="w-full h-full object-cover object-center" />
      </div>
      <div className="absolute inset-0 z-20 flex flex-col justify-end pb-32 px-6 md:px-20 container mx-auto">
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="max-w-4xl">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 drop-shadow-lg" style={{ color: d.heroText || '#fff' }}>{c?.hero_name || '\u10ea\u10d4\u10d6\u10d0\u10e0 \u10e9\u10dd\u10e9\u10d4\u10da\u10d8'}</h1>
          <div className="h-1.5 w-32 rounded-full mb-8" style={{ backgroundColor: d.accent }} />
          <p className="text-xl md:text-3xl font-light leading-relaxed max-w-3xl drop-shadow-md" style={{ color: (d.heroText || '#fff') + 'EE' }}>{c?.hero_subtitle_ka || '30+ \u10ec\u10da\u10d8\u10d0\u10dc\u10d8 \u10e8\u10d4\u10e1\u10e0\u10e3\u10da\u10d4\u10d1\u10d0 \u10d1\u10d8\u10d6\u10dc\u10d4\u10e1\u10e8\u10d8, \u10ec\u10d0\u10e0\u10db\u10dd\u10d4\u10d1\u10d0\u10e8\u10d8 \u10d3\u10d0 \u10d8\u10dc\u10e1\u10e2\u10d8\u10e2\u10e3\u10ea\u10d8\u10e3\u10e0 \u10da\u10d8\u10d3\u10d4\u10e0\u10dd\u10d1\u10d0\u10e8\u10d8'}</p>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1, repeat: Infinity, repeatType: 'reverse' }} className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20" style={{ color: d.heroText || '#fff' }}>
        <ArrowDown className="w-8 h-8 opacity-80" />
      </motion.div>
    </section>

    <section className="py-20" style={{ backgroundColor: d.bg || '#fff' }}>
      <div className="container mx-auto px-6 max-w-4xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 heading-font" style={{ color: d.heading }}>{'\u10d8\u10e1\u10e2\u10dd\u10e0\u10d8\u10d0, \u10e0\u10dd\u10db\u10d4\u10da\u10d8\u10ea \u10e5\u10db\u10dc\u10d8\u10e1 \u10db\u10dd\u10db\u10d0\u10d5\u10d0\u10da\u10e1'}</h2>
        <p className="text-lg leading-relaxed body-font" style={{ color: d.textMuted }}>{'\u10ea\u10d4\u10d6\u10d0\u10e0 \u10e9\u10dd\u10e9\u10d4\u10da\u10d8\u10e1 \u10d1\u10d8\u10dd\u10d2\u10e0\u10d0\u10e4\u10d8\u10d0 \u10d0\u10e0\u10d8\u10e1 \u10db\u10d0\u10d2\u10d0\u10da\u10d8\u10d7\u10d8 \u10d8\u10db\u10d8\u10e1\u10d0, \u10d7\u10e3 \u10e0\u10dd\u10d2\u10dd\u10e0 \u10e8\u10d4\u10d8\u10eb\u10da\u10d4\u10d1\u10d0 \u10ee\u10d4\u10d3\u10d5\u10d8\u10e1, \u10e8\u10e0\u10dd\u10db\u10d8\u10e1\u10d0 \u10d3\u10d0 \u10e8\u10d4\u10e3\u10de\u10dd\u10d5\u10e0\u10dd\u10d1\u10d8\u10e1 \u10e8\u10d4\u10d3\u10d4\u10d2\u10d0\u10d3 \u10e8\u10d4\u10d8\u10e5\u10db\u10dc\u10d0\u10e1 \u10d4\u10e0\u10dd\u10d5\u10dc\u10e3\u10da\u10d8 \u10e6\u10d8\u10e0\u10d4\u10d1\u10e3\u10da\u10d4\u10d1\u10d4\u10d1\u10d8.'}</p>
      </div>
    </section>

    <section className="py-10" style={{ backgroundColor: d.bg2 || '#f8fafc' }}><Timeline milestones={milestones} /></section>

    <div style={{ backgroundColor: d.bg || '#fff' }}>
      {bioSections.map((section, index) => (
        <section key={section.id} className="py-20 overflow-hidden" style={{ borderBottom: `1px solid ${d.cardBorder || '#e2e8f0'}` }}>
          <div className="container mx-auto px-6 max-w-7xl">
            <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16`}>
              <motion.div initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: 0.8 }} className="flex-1 space-y-6">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-6xl font-serif font-bold -ml-4 select-none" style={{ color: d.cardBorder || '#e2e8f0' }}>0{index + 1}</span>
                  <h3 className="text-3xl md:text-4xl font-bold relative z-10" style={{ color: d.heading }}>{section.title}</h3>
                </div>
                <div className="h-1 w-20 rounded-full" style={{ backgroundColor: d.accent }} />
                <p className="text-lg leading-8 text-justify body-font" style={{ color: d.textMuted }}>{section.text}</p>
              </motion.div>
              {section.image && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="flex-1 w-full">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl group">
                    <div className="absolute inset-0 group-hover:bg-transparent transition-colors duration-500 z-10" style={{ backgroundColor: d.accentBg }} />
                    <img src={section.image} alt={section.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                  </div>
                </motion.div>
              )}
              {!section.image && (
                <div className="flex-1 hidden lg:block relative">
                  <div className="absolute inset-0 rounded-2xl border-2 border-dashed flex items-center justify-center" style={{ borderColor: d.cardBorder || '#e2e8f0', backgroundColor: d.bg2 || '#f8fafc' }}>
                    <span className="font-bold text-xl uppercase tracking-widest" style={{ color: (d.textMuted || '#666') + '66' }}>{'\u10d2\u10d0\u10d2\u10e0\u10eb\u10d4\u10da\u10d4\u10d1\u10d0 \u10d8\u10e5\u10dc\u10d4\u10d1\u10d0...'}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      ))}
    </div>
  </div>
);

/* modern layout - Compact hero with portrait, cards */
const ModernFounder = ({ d, c, milestones, bioSections }) => (
  <div style={{ backgroundColor: d.bg || '#f8fafc' }}>
    <section className="relative py-32 overflow-hidden" style={{ background: `linear-gradient(135deg, ${d.heroBg || d.bg}, ${(d.heroBg || d.bg)}DD)` }}>
      <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 70% 30%, ${d.accent}12, transparent 60%)` }} />
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-6" style={{ backgroundColor: d.accentBg, color: d.heroAccent || d.accent, border: `1px solid ${(d.heroAccent || d.accent)}30` }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <span>30+ {'\u10ec\u10d4\u10da\u10d8'}</span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-6xl font-bold heading-font mb-6" style={{ color: d.heroText || '#fff' }}>{c?.hero_name || '\u10ea\u10d4\u10d6\u10d0\u10e0 \u10e9\u10dd\u10e9\u10d4\u10da\u10d8'}</motion.h1>
            <p className="text-xl body-font leading-relaxed" style={{ color: (d.heroText || '#fff') + 'BB' }}>{c?.hero_subtitle_ka || '30+ \u10ec\u10da\u10d8\u10d0\u10dc\u10d8 \u10e8\u10d4\u10e1\u10e0\u10e3\u10da\u10d4\u10d1\u10d0 \u10d1\u10d8\u10d6\u10dc\u10d4\u10e1\u10e8\u10d8, \u10ec\u10d0\u10e0\u10db\u10dd\u10d4\u10d1\u10d0\u10e8\u10d8 \u10d3\u10d0 \u10d8\u10dc\u10e1\u10e2\u10d8\u10e2\u10e3\u10ea\u10d8\u10e3\u10e0 \u10da\u10d8\u10d3\u10d4\u10e0\u10dd\u10d1\u10d0\u10e8\u10d8'}</p>
          </div>
          <div className="hidden lg:block">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="aspect-[3/4] max-w-sm mx-auto rounded-2xl overflow-hidden shadow-2xl" style={{ border: `2px solid ${d.accent}30` }}>
              <img src={c?.hero_image_url || "https://i.postimg.cc/s2XRbv8m/506208349-10020878614662192-2846366780113441950-n.jpg"} alt="" className="w-full h-full object-cover" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>

    <section className="py-10" style={{ backgroundColor: d.bg2 || '#f8fafc' }}><Timeline milestones={milestones} /></section>

    <section className="py-20" style={{ backgroundColor: d.bg || '#fff' }}>
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-8">
          {bioSections.map((section, idx) => (
            <motion.div key={section.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.08 }} className="rounded-2xl overflow-hidden border shadow-lg" style={{ backgroundColor: d.cardBg || '#fff', borderColor: d.cardBorder || '#e2e8f0' }}>
              {section.image && <img src={section.image} alt={section.title} className="w-full h-48 object-cover" />}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-sm font-bold px-3 py-1 rounded-full" style={{ backgroundColor: d.accentBg, color: d.accent }}>0{idx + 1}</span>
                  <h3 className="text-xl font-bold heading-font" style={{ color: d.heading }}>{section.title}</h3>
                </div>
                <p className="body-font leading-relaxed" style={{ color: d.textMuted }}>{section.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

/* cinematic layout - Full-bleed, side numbers */
const CinematicFounder = ({ d, c, milestones, bioSections }) => (
  <div style={{ backgroundColor: d.bg || '#faf9f7' }}>
    <section className="relative min-h-screen w-full overflow-hidden flex items-end">
      <div className="absolute inset-0">
        <img src={c?.hero_image_url || "https://i.postimg.cc/s2XRbv8m/506208349-10020878614662192-2846366780113441950-n.jpg"} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${d.heroBg || d.bg} 0%, ${d.heroBg || d.bg}99 30%, transparent 70%)` }} />
      </div>
      <div className="relative z-10 container mx-auto px-6 pb-24">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="max-w-4xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 max-w-[80px]" style={{ backgroundColor: d.accent }} />
            <span className="text-sm uppercase tracking-[0.3em] heading-font" style={{ color: d.heroAccent || d.accent }}>{'\u10d3\u10d0\u10db\u10e4\u10e3\u10eb\u10dc\u10d4\u10d1\u10d4\u10da\u10d8'}</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold heading-font leading-none mb-6" style={{ color: d.heroText || '#fff' }}>{c?.hero_name || '\u10ea\u10d4\u10d6\u10d0\u10e0 \u10e9\u10dd\u10e9\u10d4\u10da\u10d8'}</h1>
          <p className="text-2xl md:text-3xl body-font max-w-2xl" style={{ color: (d.heroText || '#fff') + 'CC' }}>{c?.hero_subtitle_ka || '30+ \u10ec\u10da\u10d8\u10d0\u10dc\u10d8 \u10e8\u10d4\u10e1\u10e0\u10e3\u10da\u10d4\u10d1\u10d0 \u10d1\u10d8\u10d6\u10dc\u10d4\u10e1\u10e8\u10d8, \u10ec\u10d0\u10e0\u10db\u10dd\u10d4\u10d1\u10d0\u10e8\u10d8 \u10d3\u10d0 \u10d8\u10dc\u10e1\u10e2\u10d8\u10e2\u10e3\u10ea\u10d8\u10e3\u10e0 \u10da\u10d8\u10d3\u10d4\u10e0\u10dd\u10d1\u10d0\u10e8\u10d8'}</p>
        </motion.div>
      </div>
    </section>

    <section className="py-10" style={{ backgroundColor: d.bg2 || '#f8fafc' }}><Timeline milestones={milestones} /></section>

    <div style={{ backgroundColor: d.bg || '#faf9f7' }}>
      {bioSections.map((section, index) => (
        <section key={section.id} className="py-20 overflow-hidden" style={{ borderBottom: `1px solid ${d.cardBorder || '#e8e0d8'}` }}>
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-1 flex lg:flex-col items-center gap-2">
                <div className="text-5xl font-bold heading-font" style={{ color: d.accent }}>0{index + 1}</div>
                <div className="hidden lg:block w-px h-20" style={{ backgroundColor: d.cardBorder || '#e8e0d8' }} />
              </div>
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className={`lg:col-span-5 ${index % 2 === 0 ? 'lg:order-first' : 'lg:order-last'}`}>
                <h3 className="text-3xl font-bold heading-font mb-6" style={{ color: d.heading }}>{section.title}</h3>
                <div className="w-16 h-[2px] mb-6" style={{ background: `linear-gradient(to right, ${d.accent}, transparent)` }} />
                <p className="text-lg body-font leading-8" style={{ color: d.textMuted }}>{section.text}</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className={`lg:col-span-6 ${index % 2 === 0 ? 'lg:order-last' : 'lg:order-first'}`}>
                {section.image ? (
                  <div className="aspect-[16/10] rounded-xl overflow-hidden shadow-xl">
                    <img src={section.image} alt={section.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="aspect-[16/10] rounded-xl flex items-center justify-center" style={{ backgroundColor: d.bg2 || '#f8fafc', border: `1px dashed ${d.cardBorder || '#e8e0d8'}` }}>
                    <span className="heading-font tracking-widest uppercase" style={{ color: (d.textMuted || '#666') + '44' }}>{'\u10db\u10d0\u10da\u10d4'}</span>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>
      ))}
    </div>
  </div>
);

const LAYOUTS = { classic: ClassicFounder, modern: ModernFounder, cinematic: CinematicFounder };

const FounderPageKA = () => {
  const { setLanguage } = useLanguage();
  const { content: c } = useSiteContent('founder_page');
  const { getDesign, getLayout } = useDesign();
  const d = getDesign('page_founder');
  const layout = getLayout('page_founder');

  const milestones = c?.milestones?.map(m => ({ year: m.year, title: m.title_ka })) || defaultMilestones;
  const bioSections = c?.bio_sections?.map(s => ({ id: s.id, title: s.title_ka, text: s.text_ka, image: s.image_url })) || defaultBioSections;

  useEffect(() => { if (setLanguage) setLanguage('ka'); }, [setLanguage]);

  const LayoutComponent = LAYOUTS[layout] || ClassicFounder;

  return (
    <Layout>
      <LayoutComponent d={d} c={c} milestones={milestones} bioSections={bioSections} />
    </Layout>
  );
};

export default FounderPageKA;
