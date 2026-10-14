// localStorage utilities for the Mall Management System

export interface User {
  username: string;
  password: string;
  role: "Mall Manager" | "Inventory Manager" | "Cashier" | "Sales Executive";
}

export interface Product {
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  reorder_level: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalPurchases?: number;
}

export interface SaleItem {
  sku: string;
  qty: number;
  price: number;
  name?: string;
}

export interface Sale {
  id: string;
  date: string;
  items: SaleItem[];
  total: number;
  cashier: string;
  customerId?: string;
  subtotal?: number;
  tax?: number;
  discount?: number;
}

export interface MonthlySale {
  month: string;
  revenue: number;
}

export interface AppData {
  users: User[];
  products: Product[];
  customers: Customer[];
  sales: Sale[];
  monthlySales: MonthlySale[];
  categories: string[];
}

const STORAGE_KEY = "mallManagementData";
const SESSION_KEY = "mallManagementSession";

const initialData: AppData = {
  users: [
    { username: "manager", password: "1234", role: "Mall Manager" },
    { username: "inventory", password: "1234", role: "Inventory Manager" },
    { username: "cashier", password: "1234", role: "Cashier" },
    { username: "sales", password: "1234", role: "Sales Executive" },
  ],
  products: [
    { sku: "P001", name: "Wireless Earbuds", category: "Electronics", price: 2999, stock: 25, reorder_level: 10 },
    { sku: "P002", name: "Bluetooth Speaker", category: "Electronics", price: 4499, stock: 15, reorder_level: 8 },
    { sku: "P003", name: "Leather Wallet", category: "Fashion", price: 999, stock: 40, reorder_level: 10 },
    { sku: "P004", name: "Men's Sneakers", category: "Fashion", price: 2999, stock: 12, reorder_level: 5 },
    { sku: "P005", name: "LED Lamp", category: "Home", price: 1499, stock: 20, reorder_level: 8 },
    { sku: "P006", name: "Cereal Box", category: "Food", price: 499, stock: 30, reorder_level: 10 },
    { sku: "P007", name: "Chocolate Bar", category: "Food", price: 199, stock: 50, reorder_level: 15 },
    { sku: "P008", name: "Smart Watch", category: "Electronics", price: 6999, stock: 10, reorder_level: 5 },
    { sku: "P009", name: "Coffee Mug", category: "Home", price: 799, stock: 18, reorder_level: 6 },
    { sku: "P010", name: "T-shirt", category: "Fashion", price: 1299, stock: 22, reorder_level: 8 },
    { sku: "P011", name: "Notebook", category: "Stationery", price: 299, stock: 35, reorder_level: 12 },
    { sku: "P012", name: "Pen Set", category: "Stationery", price: 199, stock: 45, reorder_level: 15 },
  ],
  customers: [
    { id: "C001", name: "Riya Sharma", phone: "9123456780", email: "riya@example.com", totalPurchases: 12500 },
    { id: "C002", name: "Arjun Mehta", phone: "9876543210", email: "arjun@example.com", totalPurchases: 8900 },
    { id: "C003", name: "Priya Patel", phone: "9999999999", email: "priya@example.com", totalPurchases: 15200 },
    { id: "C004", name: "Vikram Singh", phone: "9123456720", email: "vikram@example.com", totalPurchases: 6700 },
    { id: "C005", name: "Neha Kapoor", phone: "9812345678", email: "neha@example.com", totalPurchases: 9800 },
    { id: "C006", name: "Karan Gupta", phone: "9786543210", email: "karan@example.com", totalPurchases: 11400 },
  ],
  sales: [
    { id: "S001", date: "2025-01-15", items: [{ sku: "P001", qty: 1, price: 2999, name: "Wireless Earbuds" }], total: 2999, cashier: "cashier", customerId: "C001" },
    { id: "S002", date: "2025-02-10", items: [{ sku: "P004", qty: 2, price: 2999, name: "Men's Sneakers" }], total: 5998, cashier: "cashier", customerId: "C002" },
    { id: "S003", date: "2025-03-05", items: [{ sku: "P008", qty: 1, price: 6999, name: "Smart Watch" }], total: 6999, cashier: "cashier", customerId: "C003" },
    { id: "S004", date: "2025-04-20", items: [{ sku: "P002", qty: 1, price: 4499, name: "Bluetooth Speaker" }, { sku: "P007", qty: 5, price: 199, name: "Chocolate Bar" }], total: 5494, cashier: "cashier", customerId: "C001" },
    { id: "S005", date: "2025-05-12", items: [{ sku: "P003", qty: 3, price: 999, name: "Leather Wallet" }], total: 2997, cashier: "cashier", customerId: "C004" },
    { id: "S006", date: "2025-06-18", items: [{ sku: "P010", qty: 4, price: 1299, name: "T-shirt" }], total: 5196, cashier: "cashier", customerId: "C005" },
    { id: "S007", date: "2025-07-22", items: [{ sku: "P005", qty: 2, price: 1499, name: "LED Lamp" }], total: 2998, cashier: "cashier", customerId: "C006" },
    { id: "S008", date: "2025-08-08", items: [{ sku: "P009", qty: 3, price: 799, name: "Coffee Mug" }], total: 2397, cashier: "cashier", customerId: "C002" },
    { id: "S009", date: "2025-09-14", items: [{ sku: "P001", qty: 2, price: 2999, name: "Wireless Earbuds" }], total: 5998, cashier: "cashier", customerId: "C003" },
    { id: "S010", date: "2025-10-01", items: [{ sku: "P006", qty: 5, price: 499, name: "Cereal Box" }, { sku: "P007", qty: 10, price: 199, name: "Chocolate Bar" }], total: 4485, cashier: "cashier", customerId: "C001" },
  ],
  monthlySales: [
    { month: "May", revenue: 85000 },
    { month: "June", revenue: 92000 },
    { month: "July", revenue: 108000 },
    { month: "August", revenue: 98000 },
    { month: "September", revenue: 115000 },
    { month: "October", revenue: 127000 },
  ],
  categories: ["Electronics", "Fashion", "Food", "Home", "Stationery"],
};

// Initialize data if not exists
export const initializeData = (): void => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
  }
};

// Get all data
export const getData = (): AppData => {
  initializeData();
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : initialData;
};

// Save data
export const saveData = (data: AppData): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// Reset to initial data
export const resetData = (): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
};

// Session management
export const setSession = (user: User): void => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
};

export const getSession = (): User | null => {
  const session = localStorage.getItem(SESSION_KEY);
  return session ? JSON.parse(session) : null;
};

export const clearSession = (): void => {
  localStorage.removeItem(SESSION_KEY);
};

// Product operations
export const getProducts = (): Product[] => getData().products;

export const addProduct = (product: Product): void => {
  const data = getData();
  data.products.push(product);
  saveData(data);
};

export const updateProduct = (sku: string, updates: Partial<Product>): void => {
  const data = getData();
  const index = data.products.findIndex(p => p.sku === sku);
  if (index !== -1) {
    data.products[index] = { ...data.products[index], ...updates };
    saveData(data);
  }
};

export const deleteProduct = (sku: string): void => {
  const data = getData();
  data.products = data.products.filter(p => p.sku !== sku);
  saveData(data);
};

// Customer operations
export const getCustomers = (): Customer[] => getData().customers;

export const addCustomer = (customer: Customer): void => {
  const data = getData();
  data.customers.push(customer);
  saveData(data);
};

export const updateCustomer = (id: string, updates: Partial<Customer>): void => {
  const data = getData();
  const index = data.customers.findIndex(c => c.id === id);
  if (index !== -1) {
    data.customers[index] = { ...data.customers[index], ...updates };
    saveData(data);
  }
};

// Sales operations
export const getSales = (): Sale[] => getData().sales;

export const addSale = (sale: Sale): void => {
  const data = getData();
  data.sales.push(sale);
  
  // Update product stock
  sale.items.forEach(item => {
    const product = data.products.find(p => p.sku === item.sku);
    if (product) {
      product.stock -= item.qty;
    }
  });
  
  saveData(data);
};
