import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getProducts, getCustomers, addSale, getSession, Product, Customer, SaleItem, Sale } from "@/utils/storage";
import { toast } from "sonner";
import { Plus, Trash2, Receipt, Search } from "lucide-react";

const Billing = () => {
  const user = getSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [discount, setDiscount] = useState(0);
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceData, setInvoiceData] = useState<Sale | null>(null);

  useEffect(() => {
    setProducts(getProducts());
    setCustomers(getCustomers());
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [searchTerm, products]);

  const addToCart = (product: Product) => {
    const existing = cart.find((item) => item.sku === product.sku);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.sku === product.sku ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      setCart([...cart, { sku: product.sku, qty: 1, price: product.price, name: product.name }]);
    }
    setSearchTerm("");
    setFilteredProducts([]);
  };

  const updateQuantity = (sku: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(sku);
      return;
    }
    setCart(cart.map((item) => (item.sku === sku ? { ...item, qty } : item)));
  };

  const removeFromCart = (sku: string) => {
    setCart(cart.filter((item) => item.sku !== sku));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = subtotal * 0.18; // 18% GST
  const discountAmount = (subtotal * discount) / 100;
  const grandTotal = subtotal + tax - discountAmount;

  const generateInvoice = () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    const saleId = `S${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`;
    const sale: Sale = {
      id: saleId,
      date: new Date().toISOString().split("T")[0],
      items: cart,
      total: grandTotal,
      subtotal,
      tax,
      discount: discountAmount,
      cashier: user?.username || "cashier",
      customerId: selectedCustomer || undefined,
    };

    addSale(sale);
    setInvoiceData(sale);
    setShowInvoice(true);
    toast.success("Invoice generated successfully");
    setCart([]);
    setDiscount(0);
    setSelectedCustomer("");
  };

  const printInvoice = () => {
    window.print();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Point of Sale</h1>
          <p className="text-muted-foreground">Create new sales invoices</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left - Product Search & Cart */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search */}
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle>Search Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or SKU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {filteredProducts.length > 0 && (
                  <div className="mt-4 border rounded-lg max-h-60 overflow-y-auto">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.sku}
                        className="p-3 hover:bg-muted/50 cursor-pointer border-b last:border-b-0 flex justify-between items-center"
                        onClick={() => addToCart(product)}
                      >
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {product.sku} • Stock: {product.stock}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{product.price}</p>
                          <Button size="sm" variant="outline">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Cart */}
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle>Shopping Cart</CardTitle>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Receipt className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Cart is empty. Search and add products to start billing.</p>
                  </div>
                ) : (
                  <div className="rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead>Product</TableHead>
                          <TableHead className="text-center">Qty</TableHead>
                          <TableHead className="text-right">Price</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cart.map((item) => (
                          <TableRow key={item.sku}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-muted-foreground">{item.sku}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="1"
                                value={item.qty}
                                onChange={(e) => updateQuantity(item.sku, Number(e.target.value))}
                                className="w-20 text-center"
                              />
                            </TableCell>
                            <TableCell className="text-right">₹{item.price}</TableCell>
                            <TableCell className="text-right font-semibold">
                              ₹{item.price * item.qty}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFromCart(item.sku)}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right - Checkout */}
          <div className="space-y-6">
            <Card className="border-0 shadow-soft gradient-card">
              <CardHeader>
                <CardTitle>Checkout</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Customer (Optional)</Label>
                  <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Discount (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                  />
                </div>

                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">GST (18%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-success">
                      <span>Discount ({discount}%)</span>
                      <span>-₹{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold border-t pt-3">
                    <span>Grand Total</span>
                    <span>₹{grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  className="w-full h-12 text-base"
                  onClick={generateInvoice}
                  disabled={cart.length === 0}
                >
                  <Receipt className="w-5 h-5 mr-2" />
                  Generate Invoice
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Invoice Dialog */}
        <Dialog open={showInvoice} onOpenChange={setShowInvoice}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Invoice Generated</DialogTitle>
            </DialogHeader>
            {invoiceData && (
              <div className="space-y-6 py-4" id="invoice-content">
                <div className="text-center border-b pb-4">
                  <h2 className="text-2xl font-bold text-primary">Mall Management System</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Invoice #{invoiceData.id}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Date: {new Date(invoiceData.date).toLocaleDateString()}
                  </p>
                </div>

                {selectedCustomer && (
                  <div>
                    <h3 className="font-semibold mb-2">Customer Details</h3>
                    <p className="text-sm">
                      {customers.find((c) => c.id === selectedCustomer)?.name}
                    </p>
                  </div>
                )}

                <div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead className="text-center">Qty</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoiceData.items.map((item) => (
                        <TableRow key={item.sku}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell className="text-center">{item.qty}</TableCell>
                          <TableCell className="text-right">₹{item.price}</TableCell>
                          <TableCell className="text-right">₹{item.price * item.qty}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{invoiceData.subtotal?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (18%)</span>
                    <span>₹{invoiceData.tax?.toFixed(2)}</span>
                  </div>
                  {invoiceData.discount && invoiceData.discount > 0 && (
                    <div className="flex justify-between text-success">
                      <span>Discount</span>
                      <span>-₹{invoiceData.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-bold border-t pt-2">
                    <span>Grand Total</span>
                    <span>₹{invoiceData.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1" onClick={printInvoice}>
                    Print Invoice
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => setShowInvoice(false)}>
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Billing;
