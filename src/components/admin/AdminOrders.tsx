
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
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';

interface Order {
  id: string;
  customer_name: string;
  total_amount: number;
  status: string;
  created_at: string;
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
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
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive"
      });
      return;
    }

    setOrders(data);
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
            <TableRow key={order.id}>
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminOrders;
