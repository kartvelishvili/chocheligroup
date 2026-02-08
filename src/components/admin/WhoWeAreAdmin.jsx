import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Save, RefreshCcw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const WhoWeAreAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    id: null,
    title_en: '',
    title_ka: '',
    description_en: '',
    description_ka: '',
    content_en: '',
    content_ka: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('who_we_are_content')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setFormData(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load content",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const dataToSave = {
        title_en: formData.title_en,
        title_ka: formData.title_ka,
        description_en: formData.description_en,
        description_ka: formData.description_ka,
        content_en: formData.content_en,
        content_ka: formData.content_ka,
        updated_at: new Date().toISOString()
      };

      let error;
      if (formData.id) {
        const { error: updateError } = await supabase
          .from('who_we_are_content')
          .update(dataToSave)
          .eq('id', formData.id);
        error = updateError;
      } else {
        const { data: newData, error: insertError } = await supabase
          .from('who_we_are_content')
          .insert([dataToSave])
          .select()
          .single();
        
        if (newData) {
          setFormData(prev => ({ ...prev, id: newData.id }));
        }
        error = insertError;
      }

      if (error) throw error;

      toast({
        title: "Success",
        description: "Content updated successfully",
        className: "bg-green-600 text-white border-none"
      });
    } catch (error) {
      console.error('Error saving data:', error);
      toast({
        title: "Error",
        description: "Failed to save content",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-corporate-blue" />
      </div>
    );
  }

  return (
    <Card className="w-full bg-white shadow-sm border-slate-200">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-slate-800">Who We Are - Content Management</CardTitle>
            <CardDescription>Update the content for the "Who We Are" section on the homepage.</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchData} title="Reload Data">
            <RefreshCcw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSave} className="space-y-8">
          
          {/* Section Titles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title_en" className="text-slate-700 font-medium">Title (English)</Label>
              <Input
                id="title_en"
                name="title_en"
                value={formData.title_en}
                onChange={handleChange}
                placeholder="Who We Are"
                className="bg-white border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title_ka" className="text-slate-700 font-medium">Title (Georgian)</Label>
              <Input
                id="title_ka"
                name="title_ka"
                value={formData.title_ka}
                onChange={handleChange}
                placeholder="ჩვენს შესახებ"
                className="bg-white border-slate-200"
              />
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Description Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="description_en" className="text-slate-700 font-medium">Main Description (English)</Label>
              <textarea
                id="description_en"
                name="description_en"
                value={formData.description_en}
                onChange={handleChange}
                rows={4}
                className="flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Chocheli Invest Group is..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description_ka" className="text-slate-700 font-medium">Main Description (Georgian)</Label>
              <textarea
                id="description_ka"
                name="description_ka"
                value={formData.description_ka}
                onChange={handleChange}
                rows={4}
                className="flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="ჩოჩელი ინვესტ გრუპი არის..."
              />
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Secondary Content Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="content_en" className="text-slate-700 font-medium">Additional Content (English)</Label>
              <textarea
                id="content_en"
                name="content_en"
                value={formData.content_en}
                onChange={handleChange}
                rows={4}
                className="flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Founded on principles of..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content_ka" className="text-slate-700 font-medium">Additional Content (Georgian)</Label>
              <textarea
                id="content_ka"
                name="content_ka"
                value={formData.content_ka}
                onChange={handleChange}
                rows={4}
                className="flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="დაფუძნებული ოპერაციული ბრწყინვალებისა..."
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              disabled={saving}
              className="bg-corporate-blue hover:bg-corporate-blue/90 w-full sm:w-auto"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default WhoWeAreAdmin;