import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import Timeline from '@/components/Timeline';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowDown } from 'lucide-react';
import { useSiteContent } from '@/hooks/useSiteContent';

const defaultMilestones = [
  { year: "1991", title: "Establishment of Lomisi" },
  { year: "2005", title: "Launch of Natakhtari" },
  { year: "2006", title: "Partnership with Knauf" },
  { year: "2009", title: "Establishment of Barambo" },
  { year: "2011", title: "Launch of Zedazeni" },
  { year: "2017", title: "Magniti Retail Launch" },
  { year: "2024", title: "Daily Group Merger" },
  { year: "2025", title: "EV & Qabala Expansion" }
];

const defaultBioSections = [
  {
    id: 1,
    title: "Early Life & Education",
    text: "Tsezar Chocheli's journey began during one of Georgia's most challenging transitional periods. Distinguished by leadership qualities and an exceptional work ethic from a young age, he pursued his education while keenly observing economic processes. This period shaped his future vision—to create Georgian manufacturing that could compete with imports and restore national industrial pride.",
    image: "https://s3.ihost.ge/site-chocheligroup-com/founder/506835830-10014646511952069-4363242619380959237-n.jpg"
  },
  {
    id: 2,
    title: "First Business Steps",
    text: "In the early 90s, amidst complete economic stagnation, Tsezar Chocheli took bold steps into the private sector. Starting with small-scale trading operations, his ventures quickly evolved into more organized structures. This era became the cornerstone of his entrepreneurial experience, where he mastered crisis management and effective resource mobilization under difficult circumstances.",
    image: "https://s3.ihost.ge/site-chocheligroup-com/founder/505897957-10014646788618708-2502156204642059171-n.jpg"
  },
  {
    id: 3,
    title: "Scaling Manufacturing",
    text: "The 2000s proved to be a turning point. The establishment of 'Lomisi' and subsequently 'Natakhtari' completely transformed the Georgian market. This was not just business; it was a statement that producing European-standard products in Georgia was possible. Scaling manufacturing created thousands of jobs and contributed significantly to the state budget.",
    image: "https://s3.ihost.ge/site-chocheligroup-com/founder/506372066-10013430508740336-349768235636487541-n.jpg"
  },
  {
    id: 4,
    title: "Public Service & Leadership",
    text: "Tsezar Chocheli transferred his immense business experience to public service. As a regional governor, he implemented effective management models. Under his leadership, numerous infrastructure projects were executed, including regional gasification and road infrastructure rehabilitation, which helped revitalize the local economy.",
    image: "https://s3.ihost.ge/site-chocheligroup-com/founder/506648127-10020319648051422-783754334374978744-n.jpg"
  },
  {
    id: 5,
    title: "Industrial Diversification",
    text: "Limiting operations to beverage production was not enough. Part of the strategic vision was business diversification. Thus, 'Barambo' was founded—the first large-scale Georgian chocolate factory—and a partnership with the global giant Knauf was initiated. These steps confirmed the group's readiness to operate across various sectors with the highest standards.",
    image: "https://s3.ihost.ge/site-chocheligroup-com/founder/508447183-10045627062187347-4692553886682053883-n.jpg"
  },
  {
    id: 6,
    title: "Retail & National Scale",
    text: "To communicate directly with consumers, 'Magniti' was created, which today counts hundreds of branches across Georgia. Entering the retail sector completed the vertical integration chain—from production to consumer. The 2024 merger with 'Daily' Group created an undisputed market leader, opening new opportunities for development.",
    image: "https://s3.ihost.ge/site-chocheligroup-com/founder/508418937-10043544265728960-2290390415442953318-n.jpg"
  },
  {
    id: 7,
    title: "Present Day",
    text: "Today, Tsezar Chocheli continues his active work in both business development and legislative directions. His current projects include green energy, electric vehicle infrastructure, and agrotechnologies. He remains committed to innovation, constantly seeking new ways to strengthen the country's economy.",
    image: null
  }
];

const FounderPageEN = () => {
  const { setLanguage } = useLanguage();
  const { content: c } = useSiteContent('founder_page');

  // Build milestones from DB content
  const milestones = c?.milestones?.map(m => ({ year: m.year, title: m.title_en })) || defaultMilestones;
  
  // Build bio sections from DB content
  const bioSections = c?.bio_sections?.map(s => ({
    id: s.id,
    title: s.title_en,
    text: s.text_en,
    image: s.image_url
  })) || defaultBioSections;

  // Force language context to EN when this page mounts
  useEffect(() => {
    if (setLanguage) {
      setLanguage('en');
    }
  }, [setLanguage]);

  return (
    <Layout>
      <div className="bg-slate-50 min-h-screen font-sans">
        
        {/* Hero Section */}
        <section className="relative min-h-[85vh] w-full overflow-hidden flex items-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 75% 50%, rgba(30,64,175,0.15), transparent 65%)' }} />
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-corporate-blue to-transparent" />
          <div className="container mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="order-2 lg:order-1">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold mb-8 bg-corporate-blue/15 text-corporate-blue border border-corporate-blue/30">
                  Founder & Chairman
                </motion.div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 heading-font leading-tight">
                  {c?.hero_name_en || 'Tsezar Chocheli'}
                </h1>
                <div className="h-1.5 w-24 rounded-full mb-8 bg-gradient-to-r from-corporate-yellow to-corporate-yellow/30" />
                <p className="text-xl md:text-2xl text-white/75 font-light leading-relaxed body-font max-w-xl">
                  {c?.hero_subtitle_en || '30+ Years of Excellence in Business, Manufacturing & Institutional Leadership'}
                </p>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="flex items-center gap-8 mt-10">
                  <div className="text-center"><div className="text-3xl font-bold heading-font text-corporate-yellow">30+</div><div className="text-xs uppercase tracking-wider mt-1 text-white/50">Years</div></div>
                  <div className="w-px h-10 bg-white/15" />
                  <div className="text-center"><div className="text-3xl font-bold heading-font text-corporate-yellow">13+</div><div className="text-xs uppercase tracking-wider mt-1 text-white/50">Companies</div></div>
                  <div className="w-px h-10 bg-white/15" />
                  <div className="text-center"><div className="text-3xl font-bold heading-font text-corporate-yellow">#1</div><div className="text-xs uppercase tracking-wider mt-1 text-white/50">Retail</div></div>
                </motion.div>
              </motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="order-1 lg:order-2 flex justify-center">
                <div className="relative">
                  <div className="absolute -inset-3 rounded-3xl bg-corporate-blue/30 blur-2xl" />
                  <div className="relative aspect-[3/4] w-72 md:w-80 lg:w-96 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                    <img src={c?.hero_image_url || "https://s3.ihost.ge/site-chocheligroup-com/founder/506208349-10020878614662192-2846366780113441950-n.jpg"} alt={c?.hero_name_en || 'Tsezar Chocheli'} className="w-full h-full object-cover object-top" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1, repeat: Infinity, repeatType: 'reverse' }} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-white/60">
            <ArrowDown className="w-7 h-7" />
          </motion.div>
        </section>

        {/* Introduction */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-8">
              A History That Shapes The Future
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Tsezar Chocheli's biography is an example of how vision, hard work, and perseverance can create national values. Below are the key milestones that defined his path.
            </p>
          </div>
        </section>

        {/* Timeline */}
        <section className="bg-slate-50 py-10">
           <Timeline milestones={milestones} />
        </section>

        {/* Biography Sections */}
        <div className="bg-white">
          {bioSections.map((section, index) => (
            <section key={section.id} className="py-20 border-b border-slate-100 last:border-0 overflow-hidden">
              <div className="container mx-auto px-6 max-w-7xl">
                <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16`}>
                  
                  {/* Text Content */}
                  <motion.div 
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 0.8 }}
                    className="flex-1 space-y-6"
                  >
                    <div className="flex items-center gap-4 mb-2">
                       <span className="text-6xl font-serif text-slate-100 font-bold -ml-4 select-none">0{index + 1}</span>
                       <h3 className="text-3xl md:text-4xl font-bold text-slate-900 relative z-10">
                          {section.title}
                       </h3>
                    </div>
                    <div className="h-1 w-20 bg-corporate-yellow rounded-full" />
                    <p className="text-lg text-slate-600 leading-8 text-justify">
                      {section.text}
                    </p>
                  </motion.div>

                  {/* Image Content (if exists) */}
                  {section.image && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: "-10%" }}
                      transition={{ duration: 0.8 }}
                      className="flex-1 w-full"
                    >
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl group">
                        <div className="absolute inset-0 bg-corporate-blue/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                        <img 
                          src={section.image} 
                          alt={section.title}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                    </motion.div>
                  )}
                  
                  {/* No Image Layout Adjustment */}
                  {!section.image && (
                     <div className="flex-1 hidden lg:block relative">
                        <div className="absolute inset-0 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center">
                           <span className="text-slate-300 font-bold text-xl uppercase tracking-widest">
                              To Be Continued...
                           </span>
                        </div>
                     </div>
                  )}
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* Management Team */}
        <section className="py-20 bg-white border-t border-slate-100">
          <div className="container mx-auto px-6 max-w-5xl">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 heading-font mb-4">Leadership</h2>
              <div className="w-20 h-1 bg-corporate-blue mx-auto rounded-full" />
            </motion.div>

            {/* Founder - compact, centered */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col items-center text-center mb-6">
              <div className="w-28 h-28 rounded-full overflow-hidden shadow-xl border-4 border-white mb-4" style={{ boxShadow: '0 10px 30px -5px rgba(30,64,175,0.2)' }}>
                <img src="https://s3.ihost.ge/site-chocheligroup-com/founder/506208349-10020878614662192-2846366780113441950-n.jpg" alt="Tsezar Chocheli" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-2xl font-bold heading-font text-slate-900">Tsezar Chocheli</h3>
              <span className="text-sm font-semibold uppercase tracking-wider mt-2 px-4 py-1 rounded-full text-corporate-blue bg-blue-50">Founder</span>
            </motion.div>

            {/* Connecting line */}
            <div className="flex justify-center mb-10">
              <div className="w-px h-12 bg-slate-200" />
            </div>

            {/* Two leaders - balanced */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
              {[
                { name: 'Shalva Chocheli', role: 'Chairman', image: 'https://s3.ihost.ge/site-chocheligroup-com/founder/chocheli-shalva.jpg', color: '#1e40af' },
                { name: 'Saba Chocheli', role: 'Managing Partner', image: 'https://s3.ihost.ge/site-chocheligroup-com/founder/saba-chocheli.jpg', color: '#ca8a04' }
              ].map((leader, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.15 }} className="flex flex-col items-center text-center">
                  <div className="relative mb-6 group">
                    <div className="absolute -inset-2 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" style={{ backgroundColor: leader.color }} />
                    <div className="w-44 h-44 rounded-2xl overflow-hidden shadow-2xl border-4 border-white relative z-10 transform transition-transform duration-500 group-hover:-translate-y-1">
                      <img src={leader.image} alt={leader.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold heading-font text-slate-900">{leader.name}</h3>
                  <span className="text-sm font-semibold uppercase tracking-wider mt-2 px-4 py-1 rounded-full text-corporate-blue bg-blue-50">{leader.role}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
      </div>
    </Layout>
  );
};

export default FounderPageEN;