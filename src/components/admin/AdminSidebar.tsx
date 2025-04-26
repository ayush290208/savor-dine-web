
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Menu, LogOut } from 'lucide-react';

interface AdminSidebarProps {
  activeTab: 'orders' | 'menu';
  onTabChange: (tab: 'orders' | 'menu') => void;
}

const AdminSidebar = ({ activeTab, onTabChange }: AdminSidebarProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  return (
    <div className="w-64 bg-card border-r p-4">
      <div className="space-y-2">
        <Button
          variant={activeTab === 'orders' ? 'default' : 'ghost'}
          className="w-full justify-start"
          onClick={() => onTabChange('orders')}
        >
          <ClipboardList className="mr-2 h-4 w-4" />
          Orders
        </Button>
        <Button
          variant={activeTab === 'menu' ? 'default' : 'ghost'}
          className="w-full justify-start"
          onClick={() => onTabChange('menu')}
        >
          <Menu className="mr-2 h-4 w-4" />
          Menu
        </Button>
      </div>
      <div className="absolute bottom-4 w-56">
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
