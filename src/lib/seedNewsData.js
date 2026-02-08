
import { supabase } from '@/lib/customSupabaseClient';

export const seedDemoNews = async () => {
  try {
    // 1. Ensure we have at least one category
    let { data: categories, error: catError } = await supabase
      .from('news_categories')
      .select('id')
      .limit(1);

    if (catError) throw catError;

    let categoryId;
    if (!categories || categories.length === 0) {
      const { data: newCat, error: createCatError } = await supabase
        .from('news_categories')
        .insert({
          name_ka: 'ზოგადი',
          name_en: 'General',
          slug: 'general',
          is_active: true,
          sort_order: 1
        })
        .select()
        .single();
      
      if (createCatError) throw createCatError;
      categoryId = newCat.id;
    } else {
      categoryId = categories[0].id;
    }

    // 2. Define Demo Data
    const demoArticles = [
      {
        title_ka: "ჩოჩელი ინვესტმენტი - ახალი პროექტი",
        title_en: "Chocheli Investment - New Project",
        slug: "chocheli-investment-new-project",
        excerpt_ka: "ჩვენი კომპანია იწყებს ახალ მასშტაბურ პროექტს, რომელიც შეცვლის ბაზრის სტანდარტებს.",
        excerpt_en: "Our company is launching a new large-scale project that will change market standards.",
        content_ka: "ჩვენი კომპანია მოხარულია გაცნობოთ ახალი სტრატეგიული პროექტის შესახებ. ეს ინიციატივა მიზნად ისახავს ინოვაციების დანერგვას და ახალი სამუშაო ადგილების შექმნას. დეტალები მალე გახდება ცნობილი.",
        content_en: "We are pleased to announce a new strategic project. This initiative aims to implement innovations and create new jobs. Details will be announced soon.",
        image_url: "https://images.unsplash.com/photo-1551135049-8a33b5883817",
        category_id: categoryId,
        published: true,
        created_at: new Date().toISOString()
      },
      {
        title_ka: "ბიზნეს განვითარება 2024",
        title_en: "Business Development 2024",
        slug: "business-development-2024",
        excerpt_ka: "2024 წლის სტრატეგიული გეგმები და მიზნები კომპანიის განვითარებისთვის.",
        excerpt_en: "Strategic plans and goals for 2024 regarding company development.",
        content_ka: "2024 წელი დატვირთული იქნება სიახლეებით. ჩვენ ვგეგმავთ საერთაშორისო ბაზარზე პოზიციების გამყარებას და ახალი პარტნიორების მოძიებას. ჩვენი მთავარი მიზანია მდგრადი განვითარება.",
        content_en: "2024 will be full of news. We plan to strengthen our positions in the international market and find new partners. Our main goal is sustainable development.",
        image_url: "https://images.unsplash.com/photo-1689732888407-310424e3a372",
        category_id: categoryId,
        published: true,
        created_at: new Date(Date.now() - 86400000).toISOString()
      },
      {
        title_ka: "ინოვაციური ტექნოლოგიები",
        title_en: "Innovative Technologies",
        slug: "innovative-technologies",
        excerpt_ka: "თანამედროვე ტექნოლოგიების დანერგვა წარმოებაში ეფექტურობის გასაზრდელად.",
        excerpt_en: "Implementation of modern technologies in production to increase efficiency.",
        content_ka: "ტექნოლოგიური პროგრესი ჩვენი პრიორიტეტია. ახალი დანადგარები და ციფრული სისტემები საშუალებას გვაძლევს გავაუმჯობესოთ ხარისხი და შევამციროთ დანახარჯები.",
        content_en: "Technological progress is our priority. New equipment and digital systems allow us to improve quality and reduce costs.",
        image_url: "https://images.unsplash.com/photo-1692976001563-41fa7497d81d",
        category_id: categoryId,
        published: true,
        created_at: new Date(Date.now() - 172800000).toISOString()
      },
      {
        title_ka: "კორპორატიული პასუხისმგებლობა",
        title_en: "Corporate Responsibility",
        slug: "corporate-responsibility",
        excerpt_ka: "ჩვენი წვლილი საზოგადოების განვითარებაში და გარემოს დაცვაში.",
        excerpt_en: "Our contribution to community development and environmental protection.",
        content_ka: "ბიზნესის კეთება პასუხისმგებლობას ნიშნავს. ჩვენ აქტიურად ვართ ჩართული სოციალურ პროექტებში, განათლების მხარდაჭერასა და ეკოლოგიურ აქტივობებში.",
        content_en: "Doing business means responsibility. We are actively involved in social projects, educational support, and ecological activities.",
        image_url: "https://images.unsplash.com/photo-1696041757950-62e2c030283b",
        category_id: categoryId,
        published: true,
        created_at: new Date(Date.now() - 259200000).toISOString()
      },
      {
        title_ka: "ინვესტიციის შესაძლებლობები",
        title_en: "Investment Opportunities",
        slug: "investment-opportunities",
        excerpt_ka: "ახალი საინვესტიციო პაკეტები და შეთავაზებები დაინტერესებული პირებისთვის.",
        excerpt_en: "New investment packages and offers for interested parties.",
        content_ka: "ჩვენ ვქმნით გარემოს, სადაც ინვესტიცია დაცულია და მომგებიანი. გაეცანით ჩვენს ახალ შეთავაზებებს ვებ-გვერდზე ან დაგვიკავშირდით პირადად.",
        content_en: "We create an environment where investment is protected and profitable. Check out our new offers on the website or contact us directly.",
        image_url: "https://images.unsplash.com/photo-1644995520656-e9b9a807ffbe",
        category_id: categoryId,
        published: true,
        created_at: new Date(Date.now() - 345600000).toISOString()
      }
    ];

    // 3. Upsert articles (using slug as unique key conceptually, though ID is PK)
    // Supabase upsert requires a unique constraint on the columns used for conflict. 
    // Assuming slug might not be unique constraint in DB, we'll check existence first.

    for (const article of demoArticles) {
      const { data: existing } = await supabase
        .from('news')
        .select('id')
        .eq('slug', article.slug)
        .single();

      if (!existing) {
        await supabase.from('news').insert(article);
      }
    }

    return { success: true, message: "Demo news seeded successfully" };
  } catch (error) {
    console.error("Seeding error:", error);
    return { success: false, message: error.message };
  }
};
