
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Loader2, GripVertical, Eye } from 'lucide-react';
import MenuForm from './MenuForm';
import { useToast } from '@/components/ui/use-toast';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Badge } from '@/components/ui/badge';

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

const MenuManager = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { toast } = useToast();

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('sort_order');
      
      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load menu", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleCreate = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this menu item?')) return;
    const { error } = await supabase.from('menu_items').delete().eq('id', id);
    if (!error) {
       toast({ title: "Deleted", className: "bg-green-600 text-white" });
       fetchItems();
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    
    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    setItems(newItems);

    const updates = newItems.map((item, index) => ({
      id: item.id,
      label_ka: item.label_ka,
      label_en: item.label_en,
      path: item.path,
      sort_order: index
    }));

    try {
      await supabase.from('menu_items').upsert(updates);
      toast({ title: "Order saved", className: "bg-green-600 text-white" });
    } catch (err) {
      fetchItems();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-900">Menu Management</h2>
           <p className="text-slate-500">Configure site navigation links.</p>
        </div>
        <Button onClick={handleCreate} className="bg-pink-600 hover:bg-pink-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
            <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Drag to reorder</span>
            <span className="text-xs text-slate-400">Updates automatically</span>
        </div>
        
        {loading ? (
           <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-pink-500" /></div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <StrictModeDroppable droppableId="menu-items">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="divide-y divide-slate-100">
                  {items.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="grid grid-cols-12 gap-4 p-4 items-center bg-white hover:bg-slate-50"
                        >
                          <div className="col-span-1 text-slate-400 cursor-grab" {...provided.dragHandleProps}>
                            <GripVertical size={20} />
                          </div>
                          <div className="col-span-4">
                             <div className="font-semibold text-slate-900">{item.label_en}</div>
                             <div className="text-xs text-slate-500">{item.label_ka}</div>
                          </div>
                          <div className="col-span-4">
                             <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">{item.path}</code>
                          </div>
                          <div className="col-span-1">
                             {item.is_active ? <Badge className="bg-green-100 text-green-700">Active</Badge> : <Badge variant="secondary">Inactive</Badge>}
                          </div>
                          <div className="col-span-2 flex justify-end gap-2">
                             <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}><Edit className="w-4 h-4 text-slate-500" /></Button>
                             <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}><Trash2 className="w-4 h-4 text-red-400" /></Button>
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

      <MenuForm 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={selectedItem}
        onSuccess={fetchItems}
      />
    </div>
  );
};

export default MenuManager;
