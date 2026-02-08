
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Loader2, GripVertical, Check, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import CategoriesForm from './CategoriesForm';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Badge } from '@/components/ui/badge';

// Safe Droppable wrapper for React 18 StrictMode compatibility
const StrictModeDroppable = ({ children, ...props }) => {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);
  if (!enabled) return null;
  return <Droppable {...props}>{children}</Droppable>;
};

const CategoriesManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const { toast } = useToast();

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('news_categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      toast({ title: "Error", description: "Failed to load categories", variant: "destructive" });
    } else {
      setCategories(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    
    const items = Array.from(categories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setCategories(items);

    // Update orders in DB
    const updates = items.map((item, index) => ({
      id: item.id,
      name_ka: item.name_ka,
      name_en: item.name_en,
      slug: item.slug,
      sort_order: index
    }));

    // We have to update one by one or upsert if supported and safe
    // Upsert is safer
    try {
      const { error } = await supabase
        .from('news_categories')
        .upsert(updates);
      
      if (error) throw error;
      toast({ title: "Success", description: "Order updated", className: "bg-green-600 text-white" });
    } catch (err) {
       console.error(err);
       toast({ title: "Error", description: "Failed to save order", variant: "destructive" });
       fetchCategories(); // revert
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-slate-900">Categories</h2>
           <p className="text-slate-500">Organize your news with categories.</p>
        </div>
        <Button onClick={handleCreate} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="mr-2 h-4 w-4" /> New Category
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 border-b bg-slate-50 font-semibold text-xs uppercase text-slate-500 tracking-wider">
          <div className="col-span-1"></div>
          <div className="col-span-4">Name (KA / EN)</div>
          <div className="col-span-3">Slug</div>
          <div className="col-span-2">Active</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>
        
        {loading ? (
          <div className="p-8 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <StrictModeDroppable droppableId="categories">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="divide-y divide-slate-100"
                >
                  {categories.map((cat, index) => (
                    <Draggable key={cat.id} draggableId={cat.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="grid grid-cols-12 gap-4 p-4 items-center bg-white hover:bg-slate-50 transition-colors"
                        >
                          <div className="col-span-1 text-slate-400 cursor-grab active:cursor-grabbing" {...provided.dragHandleProps}>
                            <GripVertical size={20} />
                          </div>
                          <div className="col-span-4">
                            <div className="font-medium text-slate-900">{cat.name_ka}</div>
                            <div className="text-sm text-slate-500">{cat.name_en}</div>
                          </div>
                          <div className="col-span-3 text-sm font-mono text-slate-600 bg-slate-100 w-fit px-2 py-1 rounded">
                            {cat.slug}
                          </div>
                          <div className="col-span-2">
                             {cat.is_active ? (
                                <Badge className="bg-green-100 text-green-700 hover:bg-green-100"><Check size={12} className="mr-1" /> Active</Badge>
                             ) : (
                                <Badge variant="secondary"><X size={12} className="mr-1" /> Inactive</Badge>
                             )}
                          </div>
                          <div className="col-span-2 flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(cat)}>
                              <Edit className="h-4 w-4 text-slate-500 hover:text-blue-600" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </StrictModeDroppable>
          </DragDropContext>
        )}
      </div>

      <CategoriesForm 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={editingCategory}
        onSuccess={fetchCategories}
      />
    </div>
  );
};

export default CategoriesManager;
