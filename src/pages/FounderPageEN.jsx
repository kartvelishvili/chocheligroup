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
    image: "https://i.postimg.cc/L5fSvwW3/506835830-10014646511952069-4363242619380959237-n.jpg"
  },
  {
    id: 2,
    title: "First Business Steps",
    text: "In the early 90s, amidst complete economic stagnation, Tsezar Chocheli took bold steps into the private sector. Starting with small-scale trading operations, his ventures quickly evolved into more organized structures. This era became the cornerstone of his entrepreneurial experience, where he mastered crisis management and effective resource mobilization under difficult circumstances.",
    image: "https://i.postimg.cc/x1g2sKsX/505897957-10014646788618708-2502156204642059171-n.jpg"
  },
  {
    id: 3,
    title: "Scaling Manufacturing",
    text: "The 2000s proved to be a turning point. The establishment of 'Lomisi' and subsequently 'Natakhtari' completely transformed the Georgian market. This was not just business; it was a statement that producing European-standard products in Georgia was possible. Scaling manufacturing created thousands of jobs and contributed significantly to the state budget.",
    image: "https://i.postimg.cc/SsYbNHmb/506372066-10013430508740336-349768235636487541-n.jpg"
  },
  {
    id: 4,
    title: "Public Service & Leadership",
    text: "Tsezar Chocheli transferred his immense business experience to public service. As a regional governor, he implemented effective management models. Under his leadership, numerous infrastructure projects were executed, including regional gasification and road infrastructure rehabilitation, which helped revitalize the local economy.",
    image: "https://i.postimg.cc/0jgR6ZNb/506648127-10020319648051422-783754334374978744-n.jpg"
  },
  {
    id: 5,
    title: "Industrial Diversification",
    text: "Limiting operations to beverage production was not enough. Part of the strategic vision was business diversification. Thus, 'Barambo' was founded—the first large-scale Georgian chocolate factory—and a partnership with the global giant Knauf was initiated. These steps confirmed the group's readiness to operate across various sectors with the highest standards.",
    image: "https://i.postimg.cc/66RNssH4/508447183-10045627062187347-4692553886682053883-n.jpg"
  },
  {
    id: 6,
    title: "Retail & National Scale",
    text: "To communicate directly with consumers, 'Magniti' was created, which today counts hundreds of branches across Georgia. Entering the retail sector completed the vertical integration chain—from production to consumer. The 2024 merger with 'Daily' Group created an undisputed market leader, opening new opportunities for development.",
    image: "https://i.postimg.cc/BQ0f4hkq/508418937-10043544265728960-2290390415442953318-n.jpg"
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
        <section className="relative h-screen w-full overflow-hidden">
          <div className="absolute inset-0 w-full h-full">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 via-transparent to-transparent z-10" />
            <img 
              src={c?.hero_image_url || "https://i.postimg.cc/s2XRbv8m/506208349-10020878614662192-2846366780113441950-n.jpg"}
              alt={c?.hero_name_en || "Tsezar Chocheli"}
              className="w-full h-full object-cover object-center"
            />
          </div>

          <div className="absolute inset-0 z-20 flex flex-col justify-end pb-32 px-6 md:px-20 container mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="max-w-4xl"
            >
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 drop-shadow-lg">
                {c?.hero_name_en || 'Tsezar Chocheli'}
              </h1>
              <div className="h-1.5 w-32 bg-corporate-yellow rounded-full mb-8" />
              <p className="text-xl md:text-3xl text-white/95 font-light leading-relaxed max-w-3xl drop-shadow-md">
                {c?.hero_subtitle_en || '30+ Years of Excellence in Business, Manufacturing & Institutional Leadership'}
              </p>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1, repeat: Infinity, repeatType: 'reverse' }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white"
          >
            <ArrowDown className="w-8 h-8 opacity-80" />
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
        
      </div>
    </Layout>
  );
};

export default FounderPageEN;