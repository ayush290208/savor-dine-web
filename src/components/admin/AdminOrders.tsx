
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Card,
  CardContent,
} from '@/components/ui/card';

interface Order {
  id: string;
  customer_name: string;
  total_amount: number;
  status: string;
  created_at: string;
}

interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  price_at_purchase: number;
  created_at: string;
  notes: string | null;
  menu_item_name: string;
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem[]>>({});
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [notificationSound] = useState(new Audio('/notification.mp3'));

  useEffect(() => {
    fetchOrders();
    const subscription = setupRealtimeSubscription();
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchOrders = async () => {
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (ordersError) {
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive"
      });
      return;
    }

    setOrders(ordersData || []);

    // Fetch all order items for these orders
    await fetchOrderItems(ordersData?.map(order => order.id) || []);
  };

  const fetchOrderItems = async (orderIds: string[]) => {
    if (orderIds.length === 0) return;

    try {
      // Get all order items for these orders
      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .in('order_id', orderIds);

      if (itemsError) throw itemsError;

      // Get all menu item IDs
      const menuItemIds = [...new Set(items?.map(item => item.menu_item_id) || [])];
      
      // Get menu item details
      const { data: menuItems, error: menuError } = await supabase
        .from('menu_items')
        .select('id, name')
        .in('id', menuItemIds);

      if (menuError) throw menuError;

      // Create a menu item lookup map
      const menuItemsMap = (menuItems || []).reduce((acc, item) => {
        acc[item.id] = item.name;
        return acc;
      }, {} as Record<string, string>);

      // Organize items by order ID with menu item names
      const itemsByOrder = (items || []).reduce((acc, item) => {
        const enhancedItem = {
          ...item,
          menu_item_name: menuItemsMap[item.menu_item_id] || 'Unknown Item'
        };
        
        if (!acc[item.order_id]) {
          acc[item.order_id] = [];
        }
        acc[item.order_id].push(enhancedItem);
        return acc;
      }, {} as Record<string, OrderItem[]>);

      setOrderItems(itemsByOrder);
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to fetch order details: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const setupRealtimeSubscription = () => {
    return supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        async (payload) => {
          // Play notification sound
          notificationSound.play().catch(console.error);
          
          // Show toast notification
          toast({
            title: "New Order!",
            description: `New order from ${payload.new.customer_name}`,
          });

          // Trigger webhook if URL is set
          if (webhookUrl) {
            try {
              await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                mode: 'no-cors',
                body: JSON.stringify({
                  event: 'new_order',
                  order: payload.new
                })
              });
            } catch (error) {
              console.error('Failed to trigger webhook:', error);
            }
          }

          // Update orders list
          fetchOrders();
        }
      )
      .subscribe();
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: `Order ${status.toLowerCase()}`,
    });
    
    // Update local state
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
  };

  const toggleOrderDetails = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Orders</h2>
        
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Notifications</AlertTitle>
          <AlertDescription>
            Enter a webhook URL below to receive notifications for new orders. You can use services like Zapier to send SMS or emails.
          </AlertDescription>
        </Alert>

        <Input
          type="url"
          placeholder="Enter webhook URL for notifications (optional)"
          value={webhookUrl}
          onChange={(e) => setWebhookUrl(e.target.value)}
          className="max-w-xl"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <Collapsible key={order.id} asChild open={expandedOrder === order.id}>
              <>
                <TableRow className={expandedOrder === order.id ? 'border-b-0' : ''}>
                  <TableCell>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="p-0 h-6 w-6">
                        {expandedOrder === order.id ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                  </TableCell>
                  <TableCell className="font-mono">{order.id.slice(0, 8)}</TableCell>
                  <TableCell>{order.customer_name}</TableCell>
                  <TableCell>${order.total_amount}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      size="sm"
                      onClick={() => updateOrderStatus(order.id, 'confirmed')}
                      disabled={order.status !== 'pending'}
                    >
                      Confirm
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => updateOrderStatus(order.id, 'cancelled')}
                      disabled={order.status !== 'pending'}
                    >
                      Cancel
                    </Button>
                  </TableCell>
                </TableRow>
                
                <CollapsibleContent asChild>
                  <TableRow className="bg-muted/50">
                    <TableCell colSpan={7} className="p-0">
                      <Card className="border-0 shadow-none">
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-2">Order Details</h4>
                          {orderItems[order.id] && orderItems[order.id].length > 0 ? (
                            <div className="space-y-2">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Subtotal</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {orderItems[order.id].map((item) => (
                                    <TableRow key={item.id}>
                                      <TableCell>{item.menu_item_name}</TableCell>
                                      <TableCell>{item.quantity}</TableCell>
                                      <TableCell>${item.price_at_purchase}</TableCell>
                                      <TableCell>${(item.quantity * item.price_at_purchase).toFixed(2)}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                              {orderItems[order.id][0]?.notes && (
                                <div className="mt-2 p-2 bg-muted rounded">
                                  <p className="font-medium text-sm">Special Instructions:</p>
                                  <p className="text-sm">{orderItems[order.id][0].notes}</p>
                                </div>
                              )}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">No items found for this order.</p>
                          )}
                        </CardContent>
                      </Card>
                    </TableCell>
                  </TableRow>
                </CollapsibleContent>
              </>
            </Collapsible>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminOrders;
