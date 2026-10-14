import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getData } from "@/utils/storage";
import LineChart from "@/components/charts/LineChart";
import BarChart from "@/components/charts/BarChart";
import PieChart from "@/components/charts/PieChart";
import { BarChart3, TrendingUp, Package } from "lucide-react";

const Reports = () => {
  const data = getData();
  const [activeTab, setActiveTab] = useState("sales");

  // Sales data
  const salesByMonth = data.monthlySales.map((m) => ({ label: m.month, value: m.revenue }));
  const topProducts = data.products
    .map((p) => {
      const soldQty = data.sales.reduce((sum, sale) => {
        const item = sale.items.find((i) => i.sku === p.sku);
        return sum + (item?.qty || 0);
      }, 0);
      return { label: p.name, value: soldQty * p.price };
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  // Inventory data
  const lowStockProducts = data.products.filter((p) => p.stock <= p.reorder_level);
  const categoryDistribution = data.categories.map((cat, index) => ({
    label: cat,
    value: data.products.filter((p) => p.category === cat).reduce((sum, p) => sum + p.stock, 0),
    color: ["#b794f4", "#d8b4fe", "#c084fc", "#a78bfa", "#e9d5ff"][index] || "#b794f4",
  }));

  // Customer data
  const topCustomers = data.customers
    .sort((a, b) => (b.totalPurchases || 0) - (a.totalPurchases || 0))
    .slice(0, 10);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive business insights and metrics</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
          </TabsList>

          {/* Sales Reports */}
          <TabsContent value="sales" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="gradient-card border-0 shadow-soft">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Revenue</p>
                      <h3 className="text-2xl font-bold mt-1">
                        ₹{data.monthlySales.reduce((sum, m) => sum + m.revenue, 0).toLocaleString()}
                      </h3>
                    </div>
                    <div className="p-3 gradient-primary rounded-lg">
                      <BarChart3 className="w-6 h-6 text-primary-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="gradient-card border-0 shadow-soft">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Transactions</p>
                      <h3 className="text-2xl font-bold mt-1">{data.sales.length}</h3>
                    </div>
                    <div className="p-3 gradient-accent rounded-lg">
                      <TrendingUp className="w-6 h-6 text-accent-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="gradient-card border-0 shadow-soft">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg. Transaction</p>
                      <h3 className="text-2xl font-bold mt-1">
                        ₹
                        {(
                          data.sales.reduce((sum, s) => sum + s.total, 0) / data.sales.length
                        ).toFixed(0)}
                      </h3>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle>Monthly Revenue Trend</CardTitle>
                <CardDescription>Revenue performance over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart data={salesByMonth} color="#b794f4" />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
                <CardDescription>Best performers by revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart data={topProducts} color="#c084fc" />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Invoice ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Cashier</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.sales.slice(-10).reverse().map((sale) => (
                        <TableRow key={sale.id}>
                          <TableCell className="font-medium">{sale.id}</TableCell>
                          <TableCell>{new Date(sale.date).toLocaleDateString()}</TableCell>
                          <TableCell>{sale.items.length} items</TableCell>
                          <TableCell className="capitalize">{sale.cashier}</TableCell>
                          <TableCell className="text-right font-semibold">
                            ₹{sale.total.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inventory Reports */}
          <TabsContent value="inventory" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="gradient-card border-0 shadow-soft">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Products</p>
                      <h3 className="text-2xl font-bold mt-1">{data.products.length}</h3>
                    </div>
                    <div className="p-3 gradient-primary rounded-lg">
                      <Package className="w-6 h-6 text-primary-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="gradient-card border-0 shadow-soft">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Low Stock Items</p>
                      <h3 className="text-2xl font-bold mt-1">{lowStockProducts.length}</h3>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="gradient-card border-0 shadow-soft">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Stock Value</p>
                      <h3 className="text-2xl font-bold mt-1">
                        ₹
                        {data.products
                          .reduce((sum, p) => sum + p.price * p.stock, 0)
                          .toLocaleString()}
                      </h3>
                    </div>
                    <div className="p-3 gradient-accent rounded-lg">
                      <Package className="w-6 h-6 text-accent-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle>Stock Distribution by Category</CardTitle>
                <CardDescription>Current inventory breakdown</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <PieChart data={categoryDistribution} />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle>Low Stock Alert</CardTitle>
                <CardDescription>Products that need reordering</CardDescription>
              </CardHeader>
              <CardContent>
                {lowStockProducts.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>All products are well stocked!</p>
                  </div>
                ) : (
                  <div className="rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead>SKU</TableHead>
                          <TableHead>Product Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead className="text-right">Current Stock</TableHead>
                          <TableHead className="text-right">Reorder Level</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {lowStockProducts.map((product) => (
                          <TableRow key={product.sku} className="bg-warning/5">
                            <TableCell className="font-medium">{product.sku}</TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>
                              <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
                                {product.category}
                              </span>
                            </TableCell>
                            <TableCell className="text-right text-warning font-semibold">
                              {product.stock}
                            </TableCell>
                            <TableCell className="text-right">{product.reorder_level}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customer Reports */}
          <TabsContent value="customers" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="gradient-card border-0 shadow-soft">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Customers</p>
                      <h3 className="text-2xl font-bold mt-1">{data.customers.length}</h3>
                    </div>
                    <div className="p-3 gradient-primary rounded-lg">
                      <TrendingUp className="w-6 h-6 text-primary-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="gradient-card border-0 shadow-soft">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Customer Value</p>
                      <h3 className="text-2xl font-bold mt-1">
                        ₹
                        {data.customers
                          .reduce((sum, c) => sum + (c.totalPurchases || 0), 0)
                          .toLocaleString()}
                      </h3>
                    </div>
                    <div className="p-3 gradient-accent rounded-lg">
                      <BarChart3 className="w-6 h-6 text-accent-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="gradient-card border-0 shadow-soft">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg. Customer Value</p>
                      <h3 className="text-2xl font-bold mt-1">
                        ₹
                        {(
                          data.customers.reduce((sum, c) => sum + (c.totalPurchases || 0), 0) /
                          data.customers.length
                        ).toFixed(0)}
                      </h3>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle>Top Customers by Purchase Value</CardTitle>
                <CardDescription>Most valuable customers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Rank</TableHead>
                        <TableHead>Customer ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="text-right">Total Purchases</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topCustomers.map((customer, index) => (
                        <TableRow key={customer.id}>
                          <TableCell className="font-bold">#{index + 1}</TableCell>
                          <TableCell className="font-medium">{customer.id}</TableCell>
                          <TableCell className="font-medium">{customer.name}</TableCell>
                          <TableCell>{customer.phone}</TableCell>
                          <TableCell>{customer.email}</TableCell>
                          <TableCell className="text-right font-semibold text-success">
                            ₹{customer.totalPurchases?.toLocaleString() || 0}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
