import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Send, Loader2, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSiteContent } from '@/hooks/useSiteContent';

const CONTACT_ICONS = { address: MapPin, phone: Phone, email: Mail };

const ContactPage = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const { content: c } = useSiteContent('contact_page');
  const lang = language === 'ka' ? 'ka' : 'en';
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setLoading(false);
    toast({
      title: language === 'ka' ? "შეტყობინება გაიგზავნა" : "Message Sent Successfully",
      description: language === 'ka' ? "ჩვენ მალე დაგიკავშირდებით" : "We'll get back to you as soon as possible.",
      className: "bg-green-600 text-white border-none"
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const defaultContacts = [
    { type: 'address', title_en: "Headquarters", title_ka: "სათაო ოფისი", value_en: "12 Freedom Square, Tbilisi, Georgia", value_ka: "თავისუფლების მოედანი 12, თბილისი", sub_en: "Business Center 'Merani'", sub_ka: "ბიზნეს ცენტრი 'მერანი'" },
    { type: 'phone', title_en: "Phone", title_ka: "ტელეფონი", value_en: "+995 32 2 123 456", value_ka: "+995 32 2 123 456", sub_en: "Mon-Fri, 9am - 6pm", sub_ka: "ორშ-პარ, 09:00 - 18:00" },
    { type: 'email', title_en: "Email", title_ka: "ელ-ფოსტა", value_en: "info@chocheli-group.ge", value_ka: "info@chocheli-group.ge", sub_en: "For general inquiries", sub_ka: "ზოგადი კითხვებისთვის" }
  ];

  const contactInfo = c?.contacts || defaultContacts;
  const socialLinks = c?.social_links || ['LinkedIn', 'Facebook', 'Twitter'];

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-corporate-blue/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-corporate-yellow/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />

      {/* Header Section */}
      <section className="bg-corporate-blue text-white pt-32 pb-24 relative z-10">
        <div className="container mx-auto px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold heading-font mb-6"
          >
            {c?.[`hero_title_${lang}`] || t({ en: 'Get in Touch', ka: 'დაგვიკავშირდით' })}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto body-font"
          >
            {c?.[`hero_subtitle_${lang}`] || t({ 
              en: 'Have questions about our portfolio or investment opportunities? We are here to help.',
              ka: 'გაქვთ კითხვები ჩვენს პორტფელთან ან საინვესტიციო შესაძლებლობებთან დაკავშირებით? ჩვენ მზად ვართ დაგეხმაროთ.'
            })}
          </motion.p>
        </div>
      </section>

      {/* Content Section */}
      <section className="container mx-auto px-6 -mt-16 pb-24 relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[600px]"
        >
          {/* Left Column: Contact Info */}
          <div className="lg:w-2/5 bg-gradient-to-br from-corporate-blue to-blue-900 p-10 md:p-14 text-white relative overflow-hidden">
             {/* Decorative circles */}
             <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
             <div className="absolute bottom-10 left-10 w-24 h-24 bg-corporate-yellow/20 rounded-full blur-xl" />
             
             <h2 className="text-2xl font-bold mb-8 heading-font relative z-10">
               {t({ en: 'Contact Information', ka: 'საკონტაქტო ინფორმაცია' })}
             </h2>
             
             <div className="space-y-10 relative z-10">
               {contactInfo.map((item, idx) => {
                 const ItemIcon = CONTACT_ICONS[item.type] || MapPin;
                 return (
                 <div key={idx} className="flex gap-5 items-start group">
                   <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-corporate-yellow/20 transition-colors duration-300">
                     <ItemIcon className="w-6 h-6 text-corporate-yellow" />
                   </div>
                   <div>
                     <h3 className="font-bold text-lg mb-1">{item[`title_${lang}`]}</h3>
                     <p className="text-white/90 leading-relaxed font-light">{item[`value_${lang}`]}</p>
                     <p className="text-white/50 text-sm mt-1">{item[`sub_${lang}`]}</p>
                   </div>
                 </div>
                 );
               })}
             </div>

             <div className="mt-20 relative z-10">
                <p className="text-white/60 text-sm mb-4">
                  {t({ en: 'Follow us on social media', ka: 'გამოგვყევით სოციალურ ქსელებში' })}
                </p>
                <div className="flex gap-4">
                  {socialLinks.map(social => (
                    <a key={social} href="#" className="px-4 py-2 rounded-full border border-white/20 hover:bg-white hover:text-corporate-blue transition-all text-sm font-medium">
                      {social}
                    </a>
                  ))}
                </div>
             </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:w-3/5 p-10 md:p-14 bg-white">
            <h2 className="text-2xl font-bold text-slate-800 mb-2 heading-font">
              {c?.[`form_title_${lang}`] || t({ en: 'Send us a Message', ka: 'მოგვწერეთ შეტყობინება' })}
            </h2>
            <p className="text-slate-500 mb-8 body-font">
              {c?.[`form_subtitle_${lang}`] || t({ en: 'Fill out the form below and our team will respond within 24 hours.', ka: 'შეავსეთ ფორმა და ჩვენი გუნდი 24 საათში გიპასუხებთ.' })}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-700">
                    {t({ en: 'Full Name', ka: 'სრული სახელი' })}
                  </Label>
                  <Input 
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="h-12 bg-slate-50 border-slate-200 focus:border-corporate-blue focus:ring-corporate-blue/20"
                    placeholder={language === 'ka' ? 'გიორგი ბერიძე' : 'John Doe'}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700">
                    {t({ en: 'Email Address', ka: 'ელ-ფოსტა' })}
                  </Label>
                  <Input 
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="h-12 bg-slate-50 border-slate-200 focus:border-corporate-blue focus:ring-corporate-blue/20"
                    placeholder="example@company.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-slate-700">
                  {t({ en: 'Subject', ka: 'თემა' })}
                </Label>
                <Input 
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="h-12 bg-slate-50 border-slate-200 focus:border-corporate-blue focus:ring-corporate-blue/20"
                  placeholder={language === 'ka' ? 'ინვესტიცია, პარტნიორობა...' : 'Investment, Partnership...'}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-slate-700">
                  {t({ en: 'Message', ka: 'შეტყობინება' })}
                </Label>
                <textarea 
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full p-4 rounded-md bg-slate-50 border border-slate-200 focus:border-corporate-blue focus:ring-4 focus:ring-corporate-blue/10 outline-none transition-all resize-none text-sm"
                  placeholder={language === 'ka' ? 'თქვენი შეტყობინება...' : 'Your message here...'}
                />
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-12 bg-corporate-blue hover:bg-corporate-blue/90 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <span className="flex items-center gap-2">
                    {t({ en: 'Send Message', ka: 'გაგზავნა' })}
                    <Send size={18} />
                  </span>
                )}
              </Button>
            </form>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default ContactPage;