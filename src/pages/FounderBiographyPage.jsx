import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/Layout';
import { ArrowDown } from 'lucide-react';

const sections = [
  {
    id: 1,
    titleKa: "ადრეული წლები და საწყისები",
    titleEn: "Early Life & Foundations",
    descriptionKa: "ცეზარ ჩოჩელის გზა იწყება საქართველოს გარდამავალი პერიოდის რთულ წლებში. ახალგაზრდობიდანვე გამოირჩეოდა ლიდერული თვისებებითა და შრომისმოყვარეობით. ეს პერიოდი გახდა ფუნდამენტი მისი მომავალი სამეწარმეო ხედვისთვის, სადაც მან ისწავლა პასუხისმგებლობის აღება და რთულ სიტუაციებში გამოსავლის ძიება.",
    descriptionEn: "Tsezar Chocheli's journey began during the challenging transitional years of Georgia. From a young age, he distinguished himself with leadership qualities and diligence. This period became the foundation for his future entrepreneurial vision, where he learned to take responsibility and find solutions in difficult situations.",
    image: "https://i.postimg.cc/s2XRbv8m/506208349-10020878614662192-2846366780113441950-n.jpg",
    alignment: "left"
  },
  {
    id: 2,
    titleKa: "პირველი ბიზნეს ნაბიჯები",
    titleEn: "First Business Ventures",
    descriptionKa: "90-იანების დასაწყისში, როდესაც ეკონომიკა კრიზისში იყო, ცეზარ ჩოჩელმა გადადგა პირველი ნაბიჯები კერძო სექტორში. მცირე სავაჭრო ოპერაციებით დაწყებული საქმე მალევე გადაიზარდა უფრო მსხვილ ინიციატივებში. ეს იყო დრო, როდესაც ყალიბდებოდა მისი ბიზნეს-ფილოსოფია: საქმის კეთება პატიოსნებით და გრძელვადიანი გათვლებით.",
    descriptionEn: "In the early 90s, amidst economic crisis, Tsezar Chocheli took his first steps in the private sector. Starting with small trading operations, the ventures soon grew into larger initiatives. This was the time when his business philosophy was formed: doing business with integrity and long-term vision.",
    image: "https://i.postimg.cc/L5fSvwW3/506835830-10014646511952069-4363242619380959237-n.jpg",
    alignment: "right"
  },
  {
    id: 3,
    titleKa: "ინდუსტრიული მასშტაბები",
    titleEn: "Scaling Industrial Heights",
    descriptionKa: "2000-იანების დასაწყისი აღინიშნა წარმოების მასშტაბური ზრდით. ლუდსახარში „ლომისი“ და შემდგომში სხვა საწარმოები გახდა ქართული მრეწველობის აღორძინების სიმბოლო. ცეზარ ჩოჩელის ხელმძღვანელობით, ქართულმა წარმოებამ დაიბრუნა ნდობა და ხარისხის სტანდარტი, შექმნა რა ათასობით სამუშაო ადგილი.",
    descriptionEn: "The early 2000s marked a massive growth in manufacturing. The 'Lomisi' brewery and subsequent factories became symbols of Georgian industrial revival. Under Tsezar Chocheli's leadership, Georgian manufacturing regained trust and quality standards, creating thousands of jobs.",
    image: "https://i.postimg.cc/x1g2sKsX/505897957-10014646788618708-2502156204642059171-n.jpg",
    alignment: "left"
  },
  {
    id: 4,
    titleKa: "სახელმწიფო სამსახური",
    titleEn: "Public Service & Governance",
    descriptionKa: "ბიზნესში მიღებული გამოცდილება ცეზარ ჩოჩელმა სახელმწიფო სამსახურში გადაიტანა. როგორც რეგიონის გუბერნატორმა, მან შეძლო ეფექტური მმართველობის სისტემის დანერგვა, ინფრასტრუქტურული პროექტების განხორციელება და რეგიონის ეკონომიკური პოტენციალის ზრდა.",
    descriptionEn: "Tsezar Chocheli transferred his business experience to public service. As a regional governor, he implemented effective governance systems, executed infrastructure projects, and grew the region's economic potential.",
    image: "https://i.postimg.cc/SsYbNHmb/506372066-10013430508740336-349768235636487541-n.jpg",
    alignment: "right"
  },
  {
    id: 5,
    titleKa: "სტრატეგიული დივერსიფიკაცია",
    titleEn: "Strategic Diversification",
    descriptionKa: "სახელმწიფო სამსახურის შემდეგ, აქცენტი გაკეთდა ბიზნესის დივერსიფიკაციაზე. სამშენებლო სექტორი, ლოჯისტიკა და სოფლის მეურნეობა დაემატა პორტფელს. რისკების გადანაწილებამ და ახალ სფეროებში შესვლამ ჯგუფს მისცა საშუალება ყოფილიყო მდგრადი ნებისმიერი ეკონომიკური გამოწვევის წინაშე.",
    descriptionEn: "After public service, the focus shifted to business diversification. Construction, logistics, and agriculture were added to the portfolio. Risk distribution and entering new sectors allowed the group to remain resilient against any economic challenge.",
    image: "https://i.postimg.cc/0jgR6ZNb/506648127-10020319648051422-783754334374978744-n.jpg",
    alignment: "left"
  },
  {
    id: 6,
    titleKa: "საცალო ვაჭრობის რევოლუცია",
    titleEn: "Retail Revolution",
    descriptionKa: "მომხმარებელთან პირდაპირი კომუნიკაციის მიზნით, შეიქმნა საცალო ვაჭრობის ქსელები. ამ ნაბიჯმა არა მხოლოდ გაზარდა ბრენდების ცნობადობა, არამედ დააწესა მომსახურების ახალი სტანდარტები ქართულ ბაზარზე.",
    descriptionEn: "To communicate directly with consumers, retail chains were established. This step not only increased brand awareness but also set new service standards in the Georgian market.",
    image: "https://i.postimg.cc/66RNssH4/508447183-10045627062187347-4692553886682053883-n.jpg",
    alignment: "right"
  },
  {
    id: 7,
    titleKa: "საპარლამენტო საქმიანობა",
    titleEn: "Parliamentary Leadership",
    descriptionKa: "დღეს ცეზარ ჩოჩელი აქტიურად არის ჩართული საკანონმდებლო საქმიანობაში. მისი მიზანია შექმნას ისეთი ბიზნეს გარემო, რომელიც ხელს შეუწყობს ინვესტიციებს და სამუშაო ადგილების შექმნას. მისი გამოცდილება როგორც კერძო, ისე საჯარო სექტორში, მას უნიკალურ ხედვას აძლევს ქვეყნის ეკონომიკური განვითარებისთვის.",
    descriptionEn: "Today, Tsezar Chocheli is actively involved in legislative activities. His goal is to create a business environment that fosters investment and job creation. His experience in both private and public sectors gives him a unique vision for the country's economic development.",
    image: "https://i.postimg.cc/BQ0f4hkq/508418937-10043544265728960-2290390415442953318-n.jpg",
    alignment: "left"
  }
];

const EditorialSection = ({ section, index }) => {
  const isLeft = section.alignment === 'left';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`py-20 flex flex-col ${isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-24`}
    >
      {/* Text Content */}
      <div className="flex-1 space-y-8">
        <div className="space-y-4">
          <span className="text-slate-400 font-mono text-sm tracking-widest uppercase">
            Chapter 0{index + 1}
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 leading-tight">
            {section.titleKa}
          </h2>
          <h3 className="text-xl text-slate-500 font-light">
            {section.titleEn}
          </h3>
        </div>
        
        <div className="space-y-6">
          <p className="text-lg text-slate-700 leading-relaxed font-sans">
            {section.descriptionKa}
          </p>
          <p className="text-base text-slate-500 leading-relaxed font-sans border-l-2 border-slate-200 pl-4">
            {section.descriptionEn}
          </p>
        </div>
      </div>

      {/* Image Content */}
      <div className="flex-1 w-full">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg shadow-2xl bg-slate-100 group">
          <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
          <motion.img 
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src={section.image} 
            alt={section.titleEn}
            className="w-full h-full object-cover object-top"
          />
        </div>
      </div>
    </motion.div>
  );
};

const FounderBiographyPage = () => {
  const { language } = useLanguage();
  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);

  return (
    <Layout>
      <div className="bg-white min-h-screen">
        
        {/* Premium Hero Section */}
        <section ref={heroRef} className="relative h-screen w-full overflow-hidden">
          <motion.div 
            style={{ y: y1 }}
            className="absolute inset-0 w-full h-full"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-transparent to-transparent z-10" />
            
            <img 
              src="https://i.postimg.cc/BQ0f4hkq/508418937-10043544265728960-2290390415442953318-n.jpg"
              alt="Tsezar Chocheli"
              className="w-full h-full object-cover object-top"
            />
          </motion.div>

          <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-20 container mx-auto">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="max-w-4xl space-y-6"
            >
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white tracking-tight leading-none">
                ცეზარ ჩოჩელი
              </h1>
              <div className="h-1 w-32 bg-corporate-yellow rounded-full" />
              <p className="text-xl md:text-3xl text-white/90 font-light leading-snug max-w-2xl">
                30+ წლიანი შესრულება ბიზნესში, წარმოებაში და ინსტიტუციურ ლიდერობაში
              </p>
              <p className="text-lg md:text-xl text-white/60 font-light max-w-2xl border-l-2 border-white/30 pl-4">
                30+ Years of Execution in Business, Manufacturing, and Institutional Leadership
              </p>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white flex flex-col items-center gap-2 animate-bounce"
          >
            <span className="text-xs uppercase tracking-widest opacity-70">Scroll to Explore</span>
            <ArrowDown className="w-5 h-5 opacity-70" />
          </motion.div>
        </section>

        {/* Editorial Content Sections */}
        <div className="container mx-auto px-6 max-w-7xl py-12">
          {sections.map((section, index) => (
            <EditorialSection key={section.id} section={section} index={index} />
          ))}
        </div>

        {/* Closing Statement */}
        <section className="bg-slate-50 py-32 border-t border-slate-200">
           <div className="container mx-auto px-6 max-w-4xl text-center space-y-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h3 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-6">
                  მომავლის ხედვა
                </h3>
                <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-light italic">
                  "ჩვენი წარმატება იზომება არა მხოლოდ ციფრებით, არამედ იმ გავლენით, რასაც ჩვენ ვახდენთ ჩვენს ქვეყანაზე და ხალხზე."
                </p>
                <div className="mt-8 text-slate-400 text-sm uppercase tracking-widest font-semibold">
                   Vision for the Future
                </div>
              </motion.div>
           </div>
        </section>

      </div>
    </Layout>
  );
};

export default FounderBiographyPage;