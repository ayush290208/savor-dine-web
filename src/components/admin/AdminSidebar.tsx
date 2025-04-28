
import { Button } from "@/components/ui/button";
import { ShoppingBag, CreditCard, Package, MapPin } from "lucide-react";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: 'orders' | 'menu' | 'stripe' | 'maps') => void;
}

const AdminSidebar = ({ activeTab, onTabChange }: AdminSidebarProps) => {
  return (
    <div className="w-64 bg-muted border-r p-4 hidden md:block">
      <div className="space-y-1">
        <h2 className="text-xl font-bold mb-6 px-2">Admin Dashboard</h2>
        
        <Button
          variant={activeTab === 'orders' ? 'secondary' : 'ghost'}
          className="w-full justify-start"
          onClick={() => onTabChange('orders')}
        >
          <ShoppingBag className="mr-2 h-4 w-4" />
          Orders
        </Button>
        
        <Button
          variant={activeTab === 'menu' ? 'secondary' : 'ghost'}
          className="w-full justify-start"
          onClick={() => onTabChange('menu')}
        >
          <Package className="mr-2 h-4 w-4" />
          Menu Management
        </Button>
        
        <Button
          variant={activeTab === 'stripe' ? 'secondary' : 'ghost'}
          className="w-full justify-start"
          onClick={() => onTabChange('stripe')}
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Payment Settings
        </Button>
        
        <Button
          variant={activeTab === 'maps' ? 'secondary' : 'ghost'}
          className="w-full justify-start"
          onClick={() => onTabChange('maps')}
        >
          <MapPin className="mr-2 h-4 w-4" />
          Maps Settings
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
