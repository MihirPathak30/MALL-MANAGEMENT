import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getData, getSession } from "@/utils/storage";
import LineChart from "@/components/charts/LineChart";
import PieChart from "@/components/charts/PieChart";
import { DollarSign, Users, Package, TrendingUp, AlertCircle } from "lucide-react";

const Dashboard = () => {
  const user = getSession();
  const [stats, setStats] = useState({
    totalSales: 0,
    activeCustomers: 0,
    lowStockItems: 0,
    todayRevenue: 0,
  });

  useEffect(() => {
    const data = getData();
    
    // Calculate stats
    const totalSales = data.sales.reduce((sum, sale) => sum + sale.total, 0);
    const activeCustomers = data.customers.length;
    const lowStockItems = data.products.filter(p => p.stock <= p.reorder_level).length;
    
    // Today's revenue (mock data)
    const today = new Date().toISOString().split('T')[0];
    const todayRevenue = data.sales
      .filter(s => s.date === today)
      .reduce((sum, sale) => sum + sale.total, 0);

    setStats({
      totalSales,
      activeCustomers,
      lowStockItems,
      todayRevenue: todayRevenue || 15420,
    });
  }, []);

  const data = getData();

  // Category distribution for pie chart
  const categoryData = data.categories.map((cat, index) => ({
    label: cat,
    value: data.products.filter(p => p.category === cat).length,
    color: [
      "#b794f4",
      "#d8b4fe",
      "#c084fc",
      "#a78bfa",
      "#e9d5ff"
    ][index] || "#b794f4",
  }));

  const statCards = [
    {
      title: "Total Sales",
      value: `₹${stats.totalSales.toLocaleString()}`,
      description: "All time revenue",
      icon: <DollarSign className="w-5 h-5" />,
      gradient: "gradient-primary",
    },
    {
      title: "Active Customers",
      value: stats.activeCustomers,
      description: "Registered customers",
      icon: <Users className="w-5 h-5" />,
      gradient: "gradient-accent",
    },
    {
      title: "Low Stock Items",
      value: stats.lowStockItems,
      description: "Need reordering",
      icon: <AlertCircle className="w-5 h-5" />,
      gradient: "bg-gradient-to-br from-orange-400 to-red-500",
    },
    {
      title: "Today's Revenue",
      value: `₹${stats.todayRevenue.toLocaleString()}`,
      description: "Sales today",
      icon: <TrendingUp className="w-5 h-5" />,
      gradient: "bg-gradient-to-br from-green-400 to-emerald-500",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user?.role}!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your mall today
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <Card
              key={index}
              className="border-0 shadow-soft hover:shadow-medium transition-shadow duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.gradient} text-white`}>
                  {stat.icon}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Sales by Month */}
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle>Sales by Month</CardTitle>
              <CardDescription>Revenue trend over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <LineChart
                data={data.monthlySales.map(m => ({ label: m.month, value: m.revenue }))}
                color="#b794f4"
              />
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle>Inventory Distribution</CardTitle>
              <CardDescription>Products by category</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <PieChart data={categoryData} />
            </CardContent>
          </Card>
        </div>

        {/* Low Stock Alert */}
        {stats.lowStockItems > 0 && (
          <Card className="border-l-4 border-l-warning bg-warning/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-warning" />
                <div>
                  <CardTitle className="text-warning">Low Stock Alert</CardTitle>
                  <CardDescription>
                    {stats.lowStockItems} items need immediate attention
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
