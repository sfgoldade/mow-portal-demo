import React, { useState } from 'react';
import { 
  Activity, Bell, Box, Calendar, Check, CheckCircle, Circle, Clock,
  CreditCard, DollarSign, Download, Eye, FileText, MapPin, Menu,
  Package, Printer, RefreshCw, Search, Settings, Shield, ShoppingCart,
  Tag, Truck, User, Wrench, X, Zap, BarChart3, ExternalLink, Receipt,
  Building2, PackageCheck, Timer
, Sun, Moon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../components/ThemeContext';

// Mock Data
const orderStats = {
  activeOrders: 4,
  inTransit: 3,
  delivered30Days: 12,
  totalSpend30Days: 47250,
  avgDeliveryDays: 3.2
};

const orders = [
  {
    id: 'ORD-2024-1847',
    date: 'Jan 2, 2026',
    status: 'shipped',
    items: [
      { name: 'Hydraulic Seal Kit - Titan TSD', sku: 'TSD-HYD-SEAL-01', qty: 2, price: 245 },
      { name: 'Workhead Bearing Assembly', sku: 'TSD-WH-BEAR-03', qty: 1, price: 892 }
    ],
    subtotal: 1382,
    shipping: 45,
    tax: 114.02,
    total: 1541.02,
    shipments: [{
      id: 'SHP-78924',
      carrier: 'FedEx Ground',
      tracking: '789234567890',
      status: 'in_transit',
      estimatedDelivery: 'Jan 6, 2026',
      lastUpdate: 'In transit - Kansas City, MO'
    }],
    shippingAddress: 'BNSF Maintenance Yard, 1234 Rail Ave, Amarillo, TX 79101',
    paymentMethod: 'Net 30 - PO #BN-2024-4521',
    invoiceId: 'INV-2024-1847'
  },
  {
    id: 'ORD-2024-1842',
    date: 'Dec 30, 2025',
    status: 'delivered',
    items: [
      { name: 'Control Panel Display Module', sku: 'GEN-DISP-MOD-02', qty: 1, price: 1245 },
      { name: 'Wiring Harness - Standard', sku: 'GEN-WIRE-STD-01', qty: 3, price: 89 }
    ],
    subtotal: 1512,
    shipping: 35,
    tax: 124.74,
    total: 1671.74,
    shipments: [{
      id: 'SHP-78456',
      carrier: 'UPS Ground',
      tracking: '1Z999AA10123456784',
      status: 'delivered',
      deliveredDate: 'Jan 2, 2026',
      deliveredTime: '2:34 PM',
      signature: 'M. JOHNSON'
    }],
    shippingAddress: 'UP Denver Maintenance Facility, 5678 Track Blvd, Denver, CO 80216',
    paymentMethod: 'Net 30 - PO #UP-2024-8847',
    invoiceId: 'INV-2024-1842'
  },
  {
    id: 'ORD-2024-1839',
    date: 'Dec 28, 2025',
    status: 'processing',
    items: [
      { name: 'LiDAR Sensor Unit - Replacement', sku: 'SAF-LIDAR-01', qty: 1, price: 4500 },
      { name: 'Calibration Tool Kit', sku: 'SAF-CAL-KIT-01', qty: 1, price: 350 }
    ],
    subtotal: 4850,
    shipping: 0,
    tax: 400.13,
    total: 5250.13,
    shipments: [],
    shippingAddress: 'CSX Atlanta Terminal, 9012 Freight Way, Atlanta, GA 30318',
    paymentMethod: 'Net 30 - PO #CSX-2024-2234',
    invoiceId: null,
    note: 'LiDAR unit undergoing final QC inspection. Expected ship date: Jan 4, 2026'
  },
  {
    id: 'ORD-2024-1835',
    date: 'Dec 27, 2025',
    status: 'shipped',
    items: [
      { name: 'Engine Oil Filter - Heavy Duty', sku: 'ENG-FILT-HD-01', qty: 6, price: 42 },
      { name: 'Air Filter Element', sku: 'ENG-AIR-FILT-02', qty: 6, price: 68 },
      { name: 'Fuel Filter Assembly', sku: 'ENG-FUEL-ASM-01', qty: 3, price: 156 }
    ],
    subtotal: 1128,
    shipping: 55,
    tax: 93.06,
    total: 1276.06,
    shipments: [{
      id: 'SHP-78234',
      carrier: 'FedEx Freight',
      tracking: '456789012345',
      status: 'in_transit',
      estimatedDelivery: 'Jan 4, 2026',
      lastUpdate: 'Departed - Dallas, TX'
    }],
    shippingAddress: 'NS Chicago Maintenance Hub, 3456 Junction Rd, Chicago, IL 60609',
    paymentMethod: 'Credit Card ending 4521',
    invoiceId: 'INV-2024-1835'
  }
];

const recentInvoices = [
  { id: 'INV-2024-1847', orderId: 'ORD-2024-1847', date: 'Jan 2, 2026', amount: 1541.02, status: 'pending', dueDate: 'Feb 1, 2026' },
  { id: 'INV-2024-1842', orderId: 'ORD-2024-1842', date: 'Dec 30, 2025', amount: 1671.74, status: 'pending', dueDate: 'Jan 29, 2026' },
  { id: 'INV-2024-1835', orderId: 'ORD-2024-1835', date: 'Dec 27, 2025', amount: 1276.06, status: 'paid', paidDate: 'Jan 2, 2026' }
];

const quickOrderItems = [
  { sku: 'TSD-HYD-SEAL-01', name: 'Hydraulic Seal Kit - Titan TSD', price: 245, inStock: true },
  { sku: 'TSD-WH-BEAR-03', name: 'Workhead Bearing Assembly', price: 892, inStock: true },
  { sku: 'ENG-FILT-HD-01', name: 'Engine Oil Filter - Heavy Duty', price: 42, inStock: true },
  { sku: 'GEN-DISP-MOD-02', name: 'Control Panel Display Module', price: 1245, inStock: false, eta: 'Jan 15' }
];

// Components
const StatusBadge = ({ status }) => {
  const styles = {
    processing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    shipped: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    in_transit: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    delivered: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    paid: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
  };
  const labels = {
    processing: 'Processing',
    shipped: 'Shipped',
    in_transit: 'In Transit',
    delivered: 'Delivered',
    pending: 'Pending',
    paid: 'Paid'
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

const NavItem = ({ to, icon: Icon, label, active, badge }) => {
  const location = useLocation();
  const isActive = active !== undefined ? active : (to ? location.pathname === to : false);
  const className = `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
    isActive 
      ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
  }`;
  const content = (
    <>
      <Icon className="w-5 h-5" />
      <span className="flex-1 text-left">{label}</span>
      {badge && (
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-rose-500/20 text-rose-400">
          {badge}
        </span>
      )}
    </>
  );
  if (to) {
    return <Link to={to} className={className}>{content}</Link>;
  }
  return <button className={className}>{content}</button>;
};

const TabButton = ({ active, onClick, children, count }) => (
  <button onClick={onClick} className={`px-4 py-3 text-sm font-medium border-b-2 transition-all flex items-center gap-2 ${
    active ? 'border-amber-500 text-amber-500' : 'border-transparent text-slate-400 hover:text-slate-200'
  }`}>
    {children}
    {count !== undefined && <span className={`px-1.5 py-0.5 rounded text-xs ${active ? 'bg-amber-500/20' : 'bg-slate-700'}`}>{count}</span>}
  </button>
);

const StatCard = ({ icon: Icon, label, value, color = 'amber' }) => {
  const colors = {
    amber: 'text-amber-500 bg-amber-500/10',
    emerald: 'text-emerald-500 bg-emerald-500/10',
    blue: 'text-blue-500 bg-blue-500/10'
  };
  const colorClass = colors[color] || colors.amber;
  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
      <div className={`p-2 rounded-lg ${colorClass} w-fit mb-2`}>
        <Icon className={`w-4 h-4 ${colorClass.split(' ')[0]}`} />
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-slate-400 mt-1">{label}</p>
    </div>
  );
};

const ShipmentTracker = ({ shipment }) => {
  const steps = [
    { label: 'Ordered', complete: true },
    { label: 'Processing', complete: true },
    { label: 'Shipped', complete: shipment.status !== 'processing' },
    { label: 'In Transit', complete: shipment.status === 'in_transit' || shipment.status === 'delivered' },
    { label: 'Delivered', complete: shipment.status === 'delivered' }
  ];
  const currentStep = steps.findIndex(s => !s.complete);
  
  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        {steps.map((step, i) => (
          <div key={step.label} className="flex flex-col items-center relative z-10">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step.complete ? 'bg-emerald-500 text-white' : i === currentStep ? 'bg-amber-500 text-white animate-pulse' : 'bg-slate-700 text-slate-500'
            }`}>
              {step.complete ? <Check className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
            </div>
            <span className={`text-xs mt-2 ${step.complete ? 'text-slate-300' : 'text-slate-500'}`}>{step.label}</span>
          </div>
        ))}
      </div>
      <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-700 -z-0">
        <div className="h-full bg-emerald-500 transition-all" style={{ width: `${(steps.filter(s => s.complete).length - 1) / (steps.length - 1) * 100}%` }} />
      </div>
    </div>
  );
};

const OrderCard = ({ order, onViewDetails }) => (
  <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 hover:border-amber-500/30 transition-all cursor-pointer" onClick={() => onViewDetails(order)}>
    <div className="flex items-start justify-between mb-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-white">{order.id}</span>
          <StatusBadge status={order.status} />
        </div>
        <p className="text-sm text-slate-400">Ordered {order.date}</p>
      </div>
      <p className="text-xl font-bold text-white">${order.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
    </div>
    
    <div className="space-y-2 mb-4">
      {order.items.slice(0, 2).map((item, i) => (
        <div key={i} className="flex items-center justify-between text-sm">
          <span className="text-slate-300">{item.name}</span>
          <span className="text-slate-500">x{item.qty}</span>
        </div>
      ))}
      {order.items.length > 2 && <p className="text-xs text-slate-500">+{order.items.length - 2} more items</p>}
    </div>
    
    {order.shipments.length > 0 && order.status !== 'delivered' && (
      <div className="pt-4 border-t border-slate-700/50">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-slate-400">{order.shipments[0].carrier}</span>
          <span className="text-amber-400">{order.shipments[0].estimatedDelivery}</span>
        </div>
        <p className="text-xs text-slate-500">{order.shipments[0].lastUpdate}</p>
      </div>
    )}
    
    {order.status === 'delivered' && order.shipments[0] && (
      <div className="pt-4 border-t border-slate-700/50">
        <div className="flex items-center gap-2 text-emerald-400 text-sm">
          <CheckCircle className="w-4 h-4" />
          <span>Delivered {order.shipments[0].deliveredDate}</span>
        </div>
      </div>
    )}
    
    {order.status === 'processing' && (
      <div className="pt-4 border-t border-slate-700/50">
        <div className="flex items-center gap-2 text-blue-400 text-sm">
          <Clock className="w-4 h-4" />
          <span>Processing</span>
        </div>
        {order.note && <p className="text-xs text-slate-500 mt-1">{order.note}</p>}
      </div>
    )}
  </div>
);

const InvoiceRow = ({ invoice }) => (
  <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg hover:bg-slate-900/80 transition-colors">
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${invoice.status === 'paid' ? 'bg-emerald-500/20' : 'bg-amber-500/20'}`}>
        <Receipt className={`w-5 h-5 ${invoice.status === 'paid' ? 'text-emerald-400' : 'text-amber-400'}`} />
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-white">{invoice.id}</span>
          <StatusBadge status={invoice.status} />
        </div>
        <p className="text-xs text-slate-500">Order: {invoice.orderId} • {invoice.date}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="font-semibold text-white">${invoice.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
      <p className="text-xs text-slate-500">{invoice.status === 'paid' ? `Paid ${invoice.paidDate}` : `Due ${invoice.dueDate}`}</p>
    </div>
    <div className="flex items-center gap-2 ml-4">
      <button className="p-2 hover:bg-slate-700 rounded transition-colors"><Eye className="w-4 h-4 text-slate-400" /></button>
      <button className="p-2 hover:bg-slate-700 rounded transition-colors"><Download className="w-4 h-4 text-slate-400" /></button>
    </div>
  </div>
);

const QuickOrderItem = ({ item }) => (
  <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
    <div>
      <p className="text-sm text-white">{item.name}</p>
      <p className="text-xs text-slate-500">{item.sku}</p>
    </div>
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-white">${item.price}</span>
      {item.inStock ? (
        <span className="text-xs text-emerald-400">In Stock</span>
      ) : (
        <span className="text-xs text-amber-400">ETA {item.eta}</span>
      )}
      <button className="px-3 py-1.5 bg-amber-500/20 text-amber-400 rounded text-xs hover:bg-amber-500/30 transition-colors">Add</button>
    </div>
  </div>
);

// Main Component
export default function OrdersShipmentsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { isDark, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('orders');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const activeOrders = orders.filter(o => o.status !== 'delivered');
  const completedOrders = orders.filter(o => o.status === 'delivered');

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-gray-50 text-gray-900'}`} style={{ fontFamily: "'IBM Plex Sans', -apple-system, sans-serif" }}>
      {/* Header */}
      <header className={`h-16 border-b backdrop-blur-sm fixed top-0 left-0 right-0 z-50 transition-colors ${isDark ? 'bg-slate-800/80 border-slate-700/50' : 'bg-white/80 border-gray-200'}`}>
        <div className="h-full flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
              <Menu className="w-5 h-5 text-slate-400" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/20">
                <span className="text-slate-900 font-bold text-lg">M</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-tight">MOW-Tel</h1>
                <p className="text-xs text-slate-500 -mt-0.5">Customer Portal</p>
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input type="text" placeholder="Search orders, tracking numbers..." className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className={`relative p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700/50' : 'hover:bg-gray-100'}`}>
              <Bell className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-gray-500'}`} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
            </button>
            <button onClick={toggleTheme} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700/50' : 'hover:bg-gray-100'}`}>
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-gray-500" />}
            </button>
            <div className="flex items-center gap-3 pl-3 border-l border-slate-700">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-200">Demo User</p>
                <p className="text-xs text-slate-500">BNSF Railway</p>
              </div>
              <div className="w-9 h-9 bg-slate-700 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} border-r transition-colors ${isDark ? 'bg-slate-800/30 border-slate-700/50' : 'bg-white border-gray-200'} h-[calc(100vh-4rem)] fixed left-0 overflow-hidden transition-all duration-300`}>
          <nav className="p-4 space-y-1">
            <NavItem to="/" icon={Activity} label="Rail Ops Overview" />
            <NavItem to="/fleet" icon={Truck} label="Fleet & Assets" />
            <NavItem to="/analytics" icon={BarChart3} label="Analytics" />
            <NavItem to="/safety" icon={Shield} label="Safety Center" badge="2" />
            <NavItem to="/service" icon={Wrench} label="Service & Maintenance" badge="7" />
            <NavItem to="/orders" icon={Package} label="Parts & Orders" active />
            <NavItem to="/documents" icon={FileText} label="Documents" />
          </nav>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-0'} transition-all duration-300`}>
          <div className="p-6">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Orders & Shipments</h2>
                <p className="text-slate-400 mt-1">Track orders, shipments, and manage invoices</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Request Quote
                </button>
                <button className="px-4 py-2 bg-amber-500 hover:bg-amber-400 rounded-lg text-sm text-slate-900 font-medium transition-colors flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  New Order
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-5 gap-4 mb-6">
              <StatCard icon={ShoppingCart} label="Active Orders" value={orderStats.activeOrders} color="amber" />
              <StatCard icon={Truck} label="In Transit" value={orderStats.inTransit} color="blue" />
              <StatCard icon={PackageCheck} label="Delivered (30 days)" value={orderStats.delivered30Days} color="emerald" />
              <StatCard icon={Timer} label="Avg Delivery" value={`${orderStats.avgDeliveryDays} days`} color="blue" />
              <StatCard icon={DollarSign} label="Total Spend (30 days)" value={`$${(orderStats.totalSpend30Days / 1000).toFixed(1)}K`} color="amber" />
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-700/50 mb-6">
              <div className="flex gap-1">
                <TabButton active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} count={activeOrders.length}>
                  <ShoppingCart className="w-4 h-4" /> Active Orders
                </TabButton>
                <TabButton active={activeTab === 'history'} onClick={() => setActiveTab('history')} count={completedOrders.length}>
                  <Package className="w-4 h-4" /> Order History
                </TabButton>
                <TabButton active={activeTab === 'invoices'} onClick={() => setActiveTab('invoices')} count={recentInvoices.filter(i => i.status === 'pending').length}>
                  <Receipt className="w-4 h-4" /> Invoices
                </TabButton>
                <TabButton active={activeTab === 'quick'} onClick={() => setActiveTab('quick')}>
                  <Zap className="w-4 h-4" /> Quick Order
                </TabButton>
              </div>
            </div>

            {/* Tab Content */}
            {(activeTab === 'orders' || activeTab === 'history') && (
              <div className="grid grid-cols-2 gap-4">
                {(activeTab === 'orders' ? activeOrders : completedOrders).map(order => (
                  <OrderCard key={order.id} order={order} onViewDetails={setSelectedOrder} />
                ))}
                {(activeTab === 'orders' ? activeOrders : completedOrders).length === 0 && (
                  <div className="col-span-2 text-center py-12 text-slate-500">
                    <Package className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                    <p>No {activeTab === 'orders' ? 'active' : 'completed'} orders</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'invoices' && (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-400">Outstanding</span>
                      <span className="text-xs text-amber-400">{recentInvoices.filter(i => i.status === 'pending').length} invoices</span>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      ${recentInvoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-400">Paid This Month</span>
                      <span className="text-xs text-emerald-400">{recentInvoices.filter(i => i.status === 'paid').length} invoices</span>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      ${recentInvoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
                    <span className="text-sm text-slate-400">Payment Terms</span>
                    <p className="text-2xl font-bold text-white mt-2">Net 30</p>
                    <p className="text-xs text-slate-500">Account in good standing</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-white">Recent Invoices</h3>
                  {recentInvoices.map(invoice => (
                    <InvoiceRow key={invoice.id} invoice={invoice} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'quick' && (
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2">
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-white">Frequently Ordered Parts</h3>
                      <button className="text-amber-500 text-sm hover:text-amber-400">View All Parts</button>
                    </div>
                    <div className="space-y-2">
                      {quickOrderItems.map(item => (
                        <QuickOrderItem key={item.sku} item={item} />
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                    <h3 className="font-semibold text-white mb-4">Shopping Cart</h3>
                    <div className="text-center py-8 text-slate-500">
                      <ShoppingCart className="w-10 h-10 mx-auto mb-2 text-slate-600" />
                      <p className="text-sm">Your cart is empty</p>
                    </div>
                  </div>
                  
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                    <h3 className="font-semibold text-white mb-4">Need Help?</h3>
                    <div className="space-y-3">
                      <button className="w-full px-4 py-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors flex items-center gap-3">
                        <FileText className="w-4 h-4 text-amber-500" />
                        Request Parts Catalog
                      </button>
                      <button className="w-full px-4 py-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors flex items-center gap-3">
                        <Building2 className="w-4 h-4 text-amber-500" />
                        Contact Sales Rep
                      </button>
                      <div className="text-center pt-2">
                        <p className="text-xs text-slate-500">Parts Hotline</p>
                        <p className="text-amber-400 font-medium">855-669-4264</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <p>MOW-Tel Customer Portal Demo • Built with mock data for demonstration purposes</p>
              <p>Data refreshed: {new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </main>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white">{selectedOrder.id}</h3>
                    <StatusBadge status={selectedOrder.status} />
                  </div>
                  <p className="text-slate-400">Ordered {selectedOrder.date}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {selectedOrder.shipments.length > 0 && (
                <div>
                  <h4 className="font-semibold text-white mb-4">Shipment Tracking</h4>
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <ShipmentTracker shipment={selectedOrder.shipments[0]} />
                    <div className="mt-4 pt-4 border-t border-slate-700/50">
                      <div className="flex items-center justify-between text-sm">
                        <div>
                          <p className="text-slate-400">{selectedOrder.shipments[0].carrier}</p>
                          <p className="text-xs text-slate-500">Tracking: {selectedOrder.shipments[0].tracking}</p>
                        </div>
                        <button className="flex items-center gap-1 text-amber-400 hover:text-amber-300">
                          <ExternalLink className="w-4 h-4" />
                          Track Package
                        </button>
                      </div>
                      {selectedOrder.shipments[0].lastUpdate && (
                        <p className="text-sm text-slate-300 mt-2">{selectedOrder.shipments[0].lastUpdate}</p>
                      )}
                      {selectedOrder.shipments[0].deliveredDate && (
                        <div className="flex items-center gap-2 mt-2 text-emerald-400">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm">Delivered {selectedOrder.shipments[0].deliveredDate} at {selectedOrder.shipments[0].deliveredTime}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-semibold text-white mb-4">Order Items</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                      <div>
                        <p className="text-sm text-white">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.sku}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-white">${item.price.toFixed(2)} x {item.qty}</p>
                        <p className="text-xs text-slate-400">${(item.price * item.qty).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-white mb-2">Shipping Address</h4>
                  <p className="text-sm text-slate-300">{selectedOrder.shippingAddress}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Payment</h4>
                  <p className="text-sm text-slate-300">{selectedOrder.paymentMethod}</p>
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-slate-400">Subtotal</span><span className="text-slate-300">${selectedOrder.subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Shipping</span><span className="text-slate-300">{selectedOrder.shipping === 0 ? 'Free' : `$${selectedOrder.shipping.toFixed(2)}`}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Tax</span><span className="text-slate-300">${selectedOrder.tax.toFixed(2)}</span></div>
                  <div className="flex justify-between pt-2 border-t border-slate-700/50"><span className="font-semibold text-white">Total</span><span className="font-semibold text-white">${selectedOrder.total.toFixed(2)}</span></div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {selectedOrder.invoiceId && (
                  <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-slate-200 transition-colors flex items-center gap-2">
                    <Receipt className="w-4 h-4" />
                    View Invoice
                  </button>
                )}
                <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-slate-200 transition-colors flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Reorder
                </button>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="px-4 py-2 bg-amber-500 hover:bg-amber-400 rounded-lg text-sm text-slate-900 font-medium transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
