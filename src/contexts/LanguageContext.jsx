import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Expanded dictionary for new pages
const translations = {
  en: {
    'Home': 'Home',
    'About': 'About',
    'About Us': 'About Us',
    'aboutUs': 'About Us',
    'Portfolio': 'History',
    'History': 'History',
    'history': 'History',
    'Founder': 'Founder',
    'founder': 'Founder',
    'Industries': 'Brands',
    'Brands': 'Brands',
    'Brand Catalog': 'Brand Catalog',
    'brands': 'Brands',
    'News': 'News',
    'news': 'News',
    'Current Projects': 'Current Projects',
    'currentProjects': 'Current Projects',
    'Projects': 'Projects',
    'Careers': 'Careers',
    'careers': 'Careers',
    'Contact': 'Contact',
    'contact': 'Contact',
    'Language': 'Language',
    'Quick Links': 'Quick Links',
    'All rights reserved.': 'All rights reserved.',
    '30+ Years of Execution Excellence': '30+ Years of Execution Excellence',
    'View Company': 'View Company',
    'View All': 'View All',
    'Filter by Industry': 'Filter by Industry',
    'All Industries': 'All Industries',
    'Founded': 'Founded',
    'Scale': 'Scale',
    'Industry': 'Industry',
    'Milestones': 'Milestones',
    'Market Position': 'Market Position',
    'Apply Now': 'Apply Now',
    'Name': 'Name',
    'Email': 'Email',
    'Phone': 'Phone',
    'Message': 'Message',
    'Submit': 'Submit',
    'Position': 'Position',
    'Upload CV': 'Upload CV',
    'Cover Letter': 'Cover Letter',
    'Investor Inquiries': 'Investor Inquiries',
    'B2B Partnerships': 'B2B Partnerships',
    'General Contact': 'General Contact',
    'Read More': 'Read More',
    'Back to Portfolio': 'Back to History',
    'Back to Projects': 'Back to Projects',
    'Related News': 'Related News',
    'Open Vacancies': 'Open Vacancies',
    'Send Message': 'Send Message',
    'Job Type': 'Job Type',
    'Location': 'Location',
    'Description': 'Description',
    'Key Facts': 'Key Facts',
    'Timeline': 'Timeline',
    'About the Group': 'About the Group',
    'Who We Are': 'Who We Are',
    'Execution DNA': 'Execution DNA',
    'Founder Biography': 'Founder Biography',
    'Our Brands': 'Our Brands',
    'International Partners': 'International Partners',
    'Gallery': 'Gallery',
    'Exit Strategy': 'Exit Strategy',
    'Strategic Exit': 'Strategic Exit',
    'Employees': 'Employees',
    'Locations': 'Locations',
    'Key Achievement': 'Key Achievement',
    'More in': 'More in',
    'Visit Website': 'Visit Website',
    'Sub-Brands': 'Sub-Brands',
    'Global Reach': 'Global Reach',
    'Strategic Milestone': 'Strategic Milestone',
    'Products & Services': 'Products & Services',
    // Project Specific
    'Ongoing': 'Ongoing',
    'In Progress': 'In Progress',
    'Status': 'Status',
    'Project Details': 'Project Details',
    'View Project': 'View Project',
    'Project Gallery': 'Project Gallery'
  },
  ka: {
    'Home': 'მთავარი',
    'About': 'ჩვენ შესახებ',
    'About Us': 'ჩვენ შესახებ',
    'aboutUs': 'ჩვენ შესახებ',
    'Portfolio': 'ისტორია',
    'History': 'ისტორია',
    'history': 'ისტორია',
    'Founder': 'დამფუძნებელი',
    'founder': 'დამფუძნებელი',
    'Industries': 'ბრენდები',
    'Brands': 'ბრენდები',
    'Brand Catalog': 'ბრენდების კატალოგი',
    'brands': 'ბრენდები',
    'News': 'სიახლეები',
    'news': 'სიახლეები',
    'Current Projects': 'მიმდინარე პროექტები',
    'currentProjects': 'მიმდინარე პროექტები',
    'Projects': 'პროექტები',
    'Careers': 'კარიერა',
    'careers': 'კარიერა',
    'Contact': 'კონტაქტი',
    'contact': 'კონტაქტი',
    'Language': 'ენა',
    'Quick Links': 'სწრაფი ბმულები',
    'All rights reserved.': 'ყველა უფლება დაცულია.',
    '30+ Years of Execution Excellence': '30+ წელი შესრულების ბრწყინვალება',
    'View Company': 'ნახვა',
    'View All': 'ყველა',
    'Filter by Industry': 'ფილტრი ინდუსტრიით',
    'All Industries': 'ყველა ინდუსტრია',
    'Founded': 'დაარსდა',
    'Scale': 'მასშტაბი',
    'Industry': 'ინდუსტრია',
    'Milestones': 'ეტაპები',
    'Market Position': 'ბაზრის პოზიცია',
    'Apply Now': 'განაცხადის გაგზავნა',
    'Name': 'სახელი',
    'Email': 'ელ-ფოსტა',
    'Phone': 'ტელეფონი',
    'Message': 'შეტყობინება',
    'Submit': 'გაგზავნა',
    'Position': 'პოზიცია',
    'Upload CV': 'ატვირთეთ CV',
    'Cover Letter': 'სამოტივაციო წერილი',
    'Investor Inquiries': 'ინვესტორები',
    'B2B Partnerships': 'B2B პარტნიორობა',
    'General Contact': 'ზოგადი კონტაქტი',
    'Read More': 'სრულად',
    'Back to Portfolio': 'ისტორიაზე დაბრუნება',
    'Back to Projects': 'პროექტებზე დაბრუნება',
    'Related News': 'დაკავშირებული სიახლეები',
    'Open Vacancies': 'ვაკანსიები',
    'Send Message': 'შეტყობინების გაგზავნა',
    'Job Type': 'განაკვეთი',
    'Location': 'ლოკაცია',
    'Description': 'აღწერა',
    'Key Facts': 'ფაქტები',
    'Timeline': 'ქრონოლოგია',
    'About the Group': 'ჯგუფის შესახებ',
    'Who We Are': 'ვინ ვართ ჩვენ',
    'Execution DNA': 'შესრულების DNA',
    'Founder Biography': 'დამფუძნებლის ბიოგრაფია',
    'Our Brands': 'ჩვენი ბრენდები',
    'International Partners': 'საერთაშორისო პარტნიორები',
    'Gallery': 'გალერეა',
    'Exit Strategy': 'გასვლის სტრატეგია',
    'Strategic Exit': 'სტრატეგიული გასვლა',
    'Employees': 'თანამშრომელი',
    'Locations': 'ობიექტი',
    'Key Achievement': 'მთავარი მიღწევა',
    'More in': 'მეტი',
    'Visit Website': 'ვებგვერდი',
    'Sub-Brands': 'ქვე-ბრენდები',
    'Global Reach': 'გლობალური წვდომა',
    'Strategic Milestone': 'სტრატეგიული ეტაპი',
    'Products & Services': 'პროდუქტები და სერვისები',
    // Project Specific
    'Ongoing': 'მიმდინარე',
    'In Progress': 'პროცესშია',
    'Status': 'სტატუსი',
    'Project Details': 'პროექტის დეტალები',
    'View Project': 'პროექტის ნახვა',
    'Project Gallery': 'პროექტის გალერეა'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ka' : 'en');
  };

  const t = (key) => {
    if (typeof key === 'object' && key !== null) {
      return key[language] || key['en'] || '';
    }
    return translations[language]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};