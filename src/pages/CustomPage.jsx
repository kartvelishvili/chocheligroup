import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { useLanguage } from '@/contexts/LanguageContext';
import { Helmet } from 'react-helmet';
import { Loader2 } from 'lucide-react';

const CustomPage = () => {
  const { slug } = useParams();
  const { language } = useLanguage();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('custom_pages')
          .select('*')
          .eq('slug', slug)
          .eq('is_published', true)
          .single();

        if (error || !data) {
          setNotFound(true);
          return;
        }

        // If it's a link type, redirect
        if (data.page_type === 'link' && data.link_url) {
          if (data.link_target === '_blank') {
            window.open(data.link_url, '_blank');
            window.history.back();
          } else {
            window.location.href = data.link_url;
          }
          return;
        }

        setPage(data);
      } catch (err) {
        console.error('Error fetching custom page:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (notFound) {
    return <Navigate to="/" replace />;
  }

  if (!page) return null;

  const isKa = language === 'ka';
  const title = isKa ? (page.title_ka || page.title_en) : (page.title_en || page.title_ka);
  const content = isKa ? (page.content_ka || page.content_en) : (page.content_en || page.content_ka);
  const metaDesc = isKa ? (page.meta_description_ka || page.meta_description_en) : (page.meta_description_en || page.meta_description_ka);

  return (
    <>
      <Helmet>
        <title>{title} — Chocheli Investment Group</title>
        {metaDesc && <meta name="description" content={metaDesc} />}
      </Helmet>
      <div className="min-h-screen pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-slate-900 mb-8">{title}</h1>
          {content && (
            <div className="prose prose-lg max-w-none text-slate-700 whitespace-pre-wrap leading-relaxed">
              {content}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CustomPage;
