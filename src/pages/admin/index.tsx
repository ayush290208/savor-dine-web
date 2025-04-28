
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminOrders from '@/components/admin/AdminOrders';
import AdminMenu from '@/components/admin/AdminMenu';
import AdminMapsSettings from '@/components/admin/AdminMapsSettings';
import { toast } from '@/components/ui/use-toast';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'maps'>('orders');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/admin/login');
        return;
      }
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check authentication status",
        variant: "destructive"
      });
      navigate('/admin/login');
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 p-8 overflow-auto">
        <div className="mb-4">
          <Button 
            variant="outline" 
            onClick={handleBackToHome}
            className="mb-4"
          >
            <Home className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </div>
        {activeTab === 'orders' && <AdminOrders />}
        {activeTab === 'menu' && <AdminMenu />}
        {activeTab === 'maps' && <AdminMapsSettings />}
      </main>
    </div>
  );
};

export default AdminDashboard;
