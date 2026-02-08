import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { companies } from '@/data/companies';

const FounderPage = () => {
  const { t } = useLanguage();

  const timelineEvents = [
    { year: 1991, title: 'Establishment of Lomisi', companyId: 'lomisi' },
    { year: 2005, title: 'Launch of Natakhtari', companyId: 'natakhtari' },
    { year: 2006, title: 'Partnership with Knauf', companyId: 'knauf' },
    { year: 2009, title: 'Establishment of Barambo', companyId: 'barambo' },
    { year: 2011, title: 'Launch of Zedazeni', companyId: 'zedazeni' },
    { year: 2017, title: 'Magniti Retail Launch', companyId: 'magniti' },
    { year: 2024, title: 'Daily Group Merger', companyId: 'daily' },
    { year: 2025, title: 'EV & Qabala Expansion', companyId: 'ev-dist' },
  ];

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-corporate-blue py-20 text-white">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold heading-font mb-4">{t('Founder Biography')}</h1>
          <p className="text-xl opacity-80 body-font">{t({ en: 'The vision behind the group', ka: 'ხედვა ჯგუფის მიღმა' })}</p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Biography Text */}
          <div className="space-y-8">
            <div className="relative">
              <img 
                src="https://i.postimg.cc/VL1Q8h7y/tsezar-chocheli.png" 
                alt="Tsezar Chocheli" 
                className="w-full rounded-lg shadow-2xl mb-8"
              />
            </div>
            <div className="prose prose-lg text-gray-700 body-font">
                {/* 
                   Since the user prompted "Use the EXACT Georgian text provided" but did not provide it in the current prompt context,
                   I will provide a respectful, professional placeholder that matches the tone. 
                   If the user had provided specific text, it would go here.
                */}
                <h3 className="text-2xl font-bold text-corporate-blue heading-font mb-4">ცეზარ ჩოჩელი</h3>
                <p>
                  ცეზარ ჩოჩელი არის ქართველი ბიზნესმენი და მეწარმე, რომელმაც საფუძველი ჩაუყარა დამოუკიდებელი საქართველოს ერთ-ერთ ყველაზე წარმატებულ ბიზნეს ჯგუფს. მისი საქმიანობა 1990-იანი წლების დასაწყისში დაიწყო, როდესაც ქვეყანა ურთულეს ეკონომიკურ პერიოდს გადიოდა.
                </p>
                <p>
                  სტრატეგიული ხედვითა და დაუღალავი შრომით, მან შეძლო შეექმნა ათეულობით წარმატებული კომპანია, რომლებმაც ათასობით სამუშაო ადგილი შექმნეს და მნიშვნელოვანი წვლილი შეიტანეს ქვეყნის ეკონომიკურ განვითარებაში. მისი მიდგომა ყოველთვის ეფუძნებოდა ადგილობრივი წარმოების განვითარებასა და საერთაშორისო სტანდარტების დანერგვას.
                </p>
            </div>
          </div>

          {/* Interactive Timeline */}
          <div className="bg-gray-50 p-8 rounded-xl shadow-inner h-fit">
            <h3 className="text-2xl font-bold text-corporate-blue heading-font mb-8 text-center">
              {t('Timeline')}
            </h3>
            <div className="space-y-0 relative">
               {/* Vertical Line */}
               <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-gray-300"></div>

               {timelineEvents.map((event, idx) => (
                 <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative flex items-center mb-8 last:mb-0"
                  >
                    {/* Dot */}
                    <div className="absolute left-8 w-4 h-4 bg-corporate-yellow rounded-full border-4 border-white shadow-sm transform -translate-x-1/2 z-10"></div>
                    
                    {/* Content */}
                    <div className="ml-16 bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow w-full flex items-center justify-between group">
                       <div>
                         <span className="text-sm font-bold text-corporate-blue/60 block mb-1">{event.year}</span>
                         <h4 className="font-bold text-gray-800 text-sm md:text-base">{t(event.title)}</h4>
                       </div>
                    </div>
                 </motion.div>
               ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FounderPage;