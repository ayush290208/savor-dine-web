
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
  available: boolean;
}

const AdminMenu = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    price: 0,
    category: '',
    available: true
  });

  useEffect(() => {
    fetchMenuItems();
    subscribeToMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('category', { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch menu items",
        variant: "destructive"
      });
      return;
    }

    setItems(data);
  };

  const subscribeToMenuItems = () => {
    const channel = supabase
      .channel('menu-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'menu_items' },
        () => fetchMenuItems()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleAddItem = async () => {
    const { error } = await supabase
      .from('menu_items')
      .insert([newItem]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add menu item",
        variant: "destructive"
      });
      return;
    }

    setNewItem({
      name: '',
      description: '',
      price: 0,
      category: '',
      available: true
    });

    toast({
      title: "Success",
      description: "Menu item added successfully",
    });
  };

  const handleUpdateItem = async () => {
    if (!editingItem) return;

    const { error } = await supabase
      .from('menu_items')
      .update(editingItem)
      .eq('id', editingItem.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update menu item",
        variant: "destructive"
      });
      return;
    }

    setEditingItem(null);
    toast({
      title: "Success",
      description: "Menu item updated successfully",
    });
  };

  const handleDeleteItem = async (id: string) => {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete menu item",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Menu item deleted successfully",
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Add New Menu Item</h2>
        <div className="grid grid-cols-2 gap-4">
          <Input
            placeholder="Name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          />
          <Input
            placeholder="Category"
            value={newItem.category}
            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Price"
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
          />
          <Input
            placeholder="Image URL"
            value={newItem.image_url}
            onChange={(e) => setNewItem({ ...newItem, image_url: e.target.value })}
          />
          <Textarea
            placeholder="Description"
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            className="col-span-2"
          />
          <Button onClick={handleAddItem} className="col-span-2">
            Add Item
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Menu Items</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Available</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>${item.price}</TableCell>
                <TableCell>{item.available ? 'Yes' : 'No'}</TableCell>
                <TableCell className="space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingItem(item)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editingItem && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-card p-6 rounded-lg shadow-lg w-96 space-y-4">
            <h3 className="text-lg font-bold">Edit Menu Item</h3>
            <Input
              placeholder="Name"
              value={editingItem.name}
              onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
            />
            <Input
              placeholder="Category"
              value={editingItem.category}
              onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Price"
              value={editingItem.price}
              onChange={(e) => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) })}
            />
            <Input
              placeholder="Image URL"
              value={editingItem.image_url}
              onChange={(e) => setEditingItem({ ...editingItem, image_url: e.target.value })}
            />
            <Textarea
              placeholder="Description"
              value={editingItem.description}
              onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditingItem(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateItem}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMenu;
