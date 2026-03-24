import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Send, Loader2, Clock, Globe, Building2, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSiteContent } from '@/hooks/useSiteContent';
import { contactMessagesApi } from '@/lib/apiClient';

const CONTACT_ICONS = { address: MapPin, phone: Phone, email: Mail };

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay }
});

const ContactPage = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const { content: c } = useSiteContent('contact_page');
  const lang = language === 'ka' ? 'ka' : 'en';
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
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

    try {
      await contactMessagesApi.create({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      });

      toast({
        title: language === 'ka' ? "შეტყობინება გაიგზავნა" : "Message Sent Successfully",
        description: language === 'ka' ? "ჩვენ მალე დაგიკავშირდებით" : "We'll get back to you as soon as possible.",
        className: "bg-green-600 text-white border-none"
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSent(true);
      setTimeout(() => setSent(false), 5000);
    } catch (err) {
      toast({
        title: language === 'ka' ? "შეცდომა" : "Error",
        description: language === 'ka' ? "შეტყობინება ვერ გაიგზავნა" : "Failed to send message",
        variant: 'destructive'
      });
    }
    setLoading(false);
  };

  const defaultContacts = [
    { type: 'address', title_en: "Headquarters", title_ka: "სათაო ოფისი", value_en: "12 Freedom Square, Tbilisi, Georgia", value_ka: "თავისუფლების მოედანი 12, თბილისი", sub_en: "Business Center 'Merani'", sub_ka: "ბიზნეს ცენტრი 'მერანი'" },
    { type: 'phone', title_en: "Phone", title_ka: "ტელეფონი", value_en: "+995 32 2 123 456", value_ka: "+995 32 2 123 456", sub_en: "Mon-Fri, 9am - 6pm", sub_ka: "ორშ-პარ, 09:00 - 18:00" },
    { type: 'email', title_en: "Email", title_ka: "ელ-ფოსტა", value_en: "info@chocheli-group.ge", value_ka: "info@chocheli-group.ge", sub_en: "For general inquiries", sub_ka: "ზოგადი კითხვებისთვის" }
  ];

  const contactInfo = c?.contacts || defaultContacts;
  const socialLinks = c?.social_links || ['LinkedIn', 'Facebook', 'Twitter'];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* ═══ HERO ═══ */}
      <section className="relative pt-16 pb-32 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(59,130,246,0.15),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(234,179,8,0.08),_transparent_50%)]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold mb-8 bg-corporate-blue/20 text-blue-300 border border-corporate-blue/30">
              <Mail className="w-4 h-4" />
              {t({ en: 'Contact Us', ka: 'კონტაქტი' })}
            </motion.div>
            <motion.h1 {...fadeUp(0.1)} className="text-4xl md:text-6xl font-bold heading-font mb-6 text-white">
              {c?.[`hero_title_${lang}`] || t({ en: 'Get in Touch', ka: 'დაგვიკავშირდით' })}
            </motion.h1>
            <motion.p {...fadeUp(0.2)} className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed body-font">
              {c?.[`hero_subtitle_${lang}`] || t({
                en: 'Have questions about our portfolio or investment opportunities? We are here to help.',
                ka: 'გაქვთ კითხვები ჩვენს პორტფელთან ან საინვესტიციო შესაძლებლობებთან დაკავშირებით? ჩვენ მზად ვართ დაგეხმაროთ.'
              })}
            </motion.p>
          </div>

          {/* Quick Stats Row */}
          <motion.div {...fadeUp(0.3)} className="flex flex-wrap justify-center gap-8 mt-12">
            {[
              { icon: Clock, label: t({ en: '24h Response', ka: '24სთ პასუხი' }) },
              { icon: Globe, label: t({ en: 'Global Reach', ka: 'გლობალური' }) },
              { icon: Building2, label: t({ en: 'Tbilisi HQ', ka: 'თბილისი' }) },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-slate-400">
                <item.icon className="w-4 h-4 text-corporate-yellow" />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ MAIN CONTENT ═══ */}
      <section className="container mx-auto px-6 -mt-20 pb-24 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* ── LEFT: Contact Cards ── */}
          <div className="lg:col-span-2 space-y-5">
            {contactInfo.map((item, idx) => {
              const ItemIcon = CONTACT_ICONS[item.type] || MapPin;
              return (
                <motion.div
                  key={idx}
                  {...fadeUp(0.1 * idx)}
                  className="group bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl hover:border-corporate-blue/20 transition-all duration-300"
                >
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-corporate-blue to-blue-700 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <ItemIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-800 mb-1">{item[`title_${lang}`]}</h3>
                      <p className="text-slate-600 leading-relaxed">{item[`value_${lang}`]}</p>
                      <p className="text-slate-400 text-sm mt-1">{item[`sub_${lang}`]}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Social Links Card */}
            <motion.div {...fadeUp(0.4)} className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 shadow-lg text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-corporate-blue/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-corporate-yellow/10 rounded-full blur-xl translate-y-1/2 -translate-x-1/2" />
              <div className="relative z-10">
                <p className="text-slate-400 text-sm mb-4 font-medium">
                  {t({ en: 'Follow us on social media', ka: 'გამოგვყევით სოციალურ ქსელებში' })}
                </p>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map(social => (
                    <a key={social} href="#" className="px-4 py-2 rounded-full border border-white/15 hover:bg-corporate-blue hover:border-corporate-blue text-sm font-medium transition-all duration-300">
                      {social}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT: Form ── */}
          <motion.div {...fadeUp(0.2)} className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 p-8 md:p-10">
              {sent ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2 heading-font">
                    {t({ en: 'Message Sent!', ka: 'შეტყობინება გაიგზავნა!' })}
                  </h3>
                  <p className="text-slate-500 max-w-sm">
                    {t({ en: 'Thank you for reaching out. Our team will get back to you within 24 hours.', ka: 'გმადლობთ რომ დაგვიკავშირდით. ჩვენი გუნდი 24 საათში გიპასუხებთ.' })}
                  </p>
                </motion.div>
              ) : (
                <>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-800 heading-font">
                      {c?.[`form_title_${lang}`] || t({ en: 'Send us a Message', ka: 'მოგვწერეთ შეტყობინება' })}
                    </h2>
                    <p className="text-slate-500 mt-2 body-font">
                      {c?.[`form_subtitle_${lang}`] || t({ en: 'Fill out the form below and our team will respond within 24 hours.', ka: 'შეავსეთ ფორმა და ჩვენი გუნდი 24 საათში გიპასუხებთ.' })}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-slate-700 font-medium text-sm">
                          {t({ en: 'Full Name', ka: 'სრული სახელი' })}
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="h-12 bg-slate-50/80 border-slate-200 rounded-xl focus:border-corporate-blue focus:ring-corporate-blue/20 transition-all"
                          placeholder={language === 'ka' ? 'გიორგი ბერიძე' : 'John Doe'}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-slate-700 font-medium text-sm">
                          {t({ en: 'Email Address', ka: 'ელ-ფოსტა' })}
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="h-12 bg-slate-50/80 border-slate-200 rounded-xl focus:border-corporate-blue focus:ring-corporate-blue/20 transition-all"
                          placeholder="example@company.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-slate-700 font-medium text-sm">
                        {t({ en: 'Subject', ka: 'თემა' })}
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="h-12 bg-slate-50/80 border-slate-200 rounded-xl focus:border-corporate-blue focus:ring-corporate-blue/20 transition-all"
                        placeholder={language === 'ka' ? 'ინვესტიცია, პარტნიორობა...' : 'Investment, Partnership...'}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-slate-700 font-medium text-sm">
                        {t({ en: 'Message', ka: 'შეტყობინება' })}
                      </Label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={5}
                        className="w-full p-4 rounded-xl bg-slate-50/80 border border-slate-200 focus:border-corporate-blue focus:ring-4 focus:ring-corporate-blue/10 outline-none transition-all resize-none text-sm"
                        placeholder={language === 'ka' ? 'თქვენი შეტყობინება...' : 'Your message here...'}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-13 bg-gradient-to-r from-corporate-blue to-blue-700 hover:from-corporate-blue/90 hover:to-blue-600 text-white font-bold text-base rounded-xl shadow-lg shadow-corporate-blue/25 hover:shadow-xl hover:shadow-corporate-blue/30 transition-all duration-300"
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
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;