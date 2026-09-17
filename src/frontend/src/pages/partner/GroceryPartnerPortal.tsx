/**
 * EZY1 Grocery Partner Portal
 * Full self-service management portal for Grocery/Retail/Fruit/Vegetable partners
 */
import { useState, useEffect } from "react";
import PartnerLayout, { type NavItem } from "./PartnerLayout";
import { usePartnerAuth } from "../../lib/partnerAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  LayoutDashboard, Package, ShoppingCart, BarChart3, Bell,
  Tag, Plus, Edit2, Trash2, TrendingUp, IndianRupee,
  CheckCircle, XCircle, AlertCircle, RefreshCw, Store, Image as ImageIcon
} from "lucide-react";
import { toast } from "sonner";

const NAV: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: Package, label: "Products", id: "products" },
  { icon: ShoppingCart, label: "Orders", id: "orders" },
  { icon: Tag, label: "Inventory", id: "inventory" },
  { icon: TrendingUp, label: "Analytics", id: "analytics" },
  { icon: Bell, label: "Notifications", id: "notifications" },
  { icon: Store, label: "Store Profile", id: "profile" },
];

function StatCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color: string }) {
  return (
    <Card className="rounded-2xl border-border">
      <CardContent className="p-5">
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
        <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </CardContent>
    </Card>
  );
}

export default function GroceryPartnerPortal() {
  const [section, setSection] = useState("dashboard");
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    discountPrice: "",
    stock: "",
    unit: "kg",
    category: "Grocery",
    image: "",
    variants: "",
  });
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    discountPrice: "",
    stock: "",
    unit: "kg",
    category: "Grocery",
    image: "",
    variants: "",
  });
  const { token } = usePartnerAuth();

  const authHeaders = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, prodRes, ordersRes] = await Promise.all([
        fetch("/api/grocery/dashboard", { headers: authHeaders }),
        fetch("/api/grocery/products", { headers: authHeaders }),
        fetch("/api/grocery/orders", { headers: authHeaders }),
      ]);
      if (statsRes.ok) setStats(await statsRes.json());
      if (prodRes.ok) setProducts(await prodRes.json());
      if (ordersRes.ok) setOrders(await ordersRes.json());
    } catch (err) {
      toast.error("Failed to load data. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;
    try {
      const res = await fetch("/api/grocery/products", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          name: newProduct.name,
          price: parseFloat(newProduct.price),
          description: newProduct.variants ? `Variants: ${newProduct.variants}` : "",
          category: newProduct.category || "Grocery",
          image: newProduct.image || "",
          stock: parseInt(newProduct.stock) || 0,
          unit: newProduct.unit,
        }),
      });
      if (res.ok) {
        toast.success("Product added successfully!");
        setNewProduct({
          name: "",
          price: "",
          discountPrice: "",
          stock: "",
          unit: "kg",
          category: "Grocery",
          image: "",
          variants: "",
        });
        fetchData();
      } else {
        const d = await res.json();
        toast.error(d.error || "Failed to add product");
      }
    } catch { toast.error("Network error"); }
  };

  const openEditModal = (p: any) => {
    setEditingProduct(p);
    setEditForm({
      name: p.name || "",
      price: String(p.price || ""),
      discountPrice: String(p.discountPrice || p.mrp || ""),
      stock: String(p.stock ?? 10),
      unit: p.unit || "kg",
      category: p.category || "Grocery",
      image: p.image || "",
      variants: p.description?.replace("Variants: ", "") || "",
    });
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editForm.name || !editForm.price) return;
    try {
      const res = await fetch(`/api/grocery/products/${editingProduct.id}`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify({
          name: editForm.name,
          price: parseFloat(editForm.price),
          description: editForm.variants ? `Variants: ${editForm.variants}` : "",
          category: editForm.category,
          image: editForm.image,
          stock: parseInt(editForm.stock) || 0,
          unit: editForm.unit,
        }),
      });
      if (res.ok) {
        toast.success("Product updated successfully!");
        setEditingProduct(null);
        fetchData();
      } else {
        const d = await res.json();
        toast.error(d.error || "Failed to update product");
      }
    } catch {
      toast.error("Network error updating product");
    }
  };

  const handleDeleteProduct = async (productId: number, productName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${productName}"?`)) return;
    try {
      const res = await fetch(`/api/grocery/products/${productId}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      if (res.ok) {
        toast.success(`Deleted ${productName}`);
        fetchData();
      } else {
        const d = await res.json();
        toast.error(d.error || "Failed to delete product");
      }
    } catch {
      toast.error("Network error deleting product");
    }
  };

  return (
    <PartnerLayout navItems={NAV} activeSection={section} onSectionChange={setSection} portalTitle="Grocery & Retail Portal">

      {/* Dashboard */}
      {section === "dashboard" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Store Overview</h1>
            <Button variant="outline" size="sm" onClick={fetchData} className="gap-2 rounded-xl">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Products" value={String(stats?.totalProducts ?? products.length)} color="text-primary" />
            <StatCard label="Pending Orders" value={String(stats?.pendingOrders ?? orders.filter(o => o.status === "pending").length)} color="text-amber-600" />
            <StatCard label="Today Revenue" value={`₹${stats?.todayRevenue ?? 0}`} color="text-emerald-600" />
            <StatCard label="Low Stock Items" value={String(stats?.lowStockCount ?? 0)} color="text-rose-600" sub="Need restock" />
          </div>
          {/* Recent Orders Quick View */}
          <div>
            <h2 className="text-base font-semibold mb-3">Recent Orders</h2>
            {orders.length === 0 ? (
              <Card className="rounded-2xl"><CardContent className="p-8 text-center text-sm text-muted-foreground">No orders yet</CardContent></Card>
            ) : (
              <div className="space-y-2">
                {orders.slice(0, 5).map((order: any, i: number) => (
                  <Card key={order.id || i} className="rounded-xl border-border">
                    <CardContent className="p-4 flex items-center gap-4">
                      <ShoppingCart className="w-4 h-4 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{order.customerName || "Customer"}</p>
                        <p className="text-xs text-muted-foreground">{order.items || "—"}</p>
                      </div>
                      <p className="text-sm font-semibold shrink-0">₹{order.totalAmount || order.amount || 0}</p>
                      <Badge variant={order.status === "completed" ? "default" : order.status === "pending" ? "secondary" : "outline"}
                        className="text-[10px] shrink-0">
                        {order.status}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Products */}
      {section === "products" && (
        <div className="space-y-6">
          <h1 className="text-xl font-bold">Product Catalogue</h1>

          {/* Add Product Form */}
          <Card className="rounded-2xl border-border shadow-xs">
            <CardContent className="p-5">
              <h2 className="text-sm font-bold mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-primary" /> Add New Product
              </h2>
              <form onSubmit={handleAddProduct} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <Input
                  placeholder="Product name *"
                  value={newProduct.name}
                  onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))}
                  className="rounded-xl"
                  required
                />
                <Input
                  type="number"
                  placeholder="Selling Price (₹) *"
                  value={newProduct.price}
                  onChange={e => setNewProduct(p => ({ ...p, price: e.target.value }))}
                  className="rounded-xl"
                  required
                />
                <Input
                  type="number"
                  placeholder="MRP / Discount Price (₹)"
                  value={newProduct.discountPrice}
                  onChange={e => setNewProduct(p => ({ ...p, discountPrice: e.target.value }))}
                  className="rounded-xl"
                />
                <Input
                  type="number"
                  placeholder="Stock qty"
                  value={newProduct.stock}
                  onChange={e => setNewProduct(p => ({ ...p, stock: e.target.value }))}
                  className="rounded-xl"
                />
                <Input
                  placeholder="Unit (kg, g, piece, pack, ltr...)"
                  value={newProduct.unit}
                  onChange={e => setNewProduct(p => ({ ...p, unit: e.target.value }))}
                  className="rounded-xl"
                />
                <Input
                  placeholder="Category (Grocery, Produce, Dairy...)"
                  value={newProduct.category}
                  onChange={e => setNewProduct(p => ({ ...p, category: e.target.value }))}
                  className="rounded-xl"
                />
                <Input
                  placeholder="Image URL (https://...)"
                  value={newProduct.image}
                  onChange={e => setNewProduct(p => ({ ...p, image: e.target.value }))}
                  className="rounded-xl"
                />
                <Input
                  placeholder="Variants (e.g. 500g, 1kg, 2kg)"
                  value={newProduct.variants}
                  onChange={e => setNewProduct(p => ({ ...p, variants: e.target.value }))}
                  className="rounded-xl"
                />
                <div className="sm:col-span-2 md:col-span-4 flex justify-end pt-1">
                  <Button type="submit" className="rounded-xl bg-primary text-primary-foreground font-bold px-6">
                    <Plus className="w-4 h-4 mr-1.5" /> Add Product to Store
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Product List */}
          {loading ? (
            <div className="text-center py-8 text-sm text-muted-foreground">Loading products...</div>
          ) : products.length === 0 ? (
            <Card className="rounded-2xl border-border">
              <CardContent className="p-8 text-center text-sm text-muted-foreground">
                No products found. Add your first product using the form above.
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {products.map((p: any, i: number) => (
                <Card key={p.id || i} className="rounded-2xl border-border overflow-hidden hover:shadow-subtle transition-smooth flex flex-col justify-between">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="w-16 h-16 rounded-xl object-cover bg-muted shrink-0 border border-border" />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20">
                          <Package className="w-7 h-7" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-sm font-bold text-foreground truncate">{p.name}</h4>
                          <Badge variant={p.stock > 10 ? "default" : p.stock > 0 ? "secondary" : "destructive"} className="text-[9px] shrink-0">
                            {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{p.category || "Grocery"} · {p.unit || "kg"}</p>
                        {p.description && p.description.includes("Variants:") && (
                          <p className="text-[10px] text-primary/80 font-medium truncate mt-0.5">
                            {p.description}
                          </p>
                        )}
                        <div className="flex items-baseline gap-2 mt-2">
                          <span className="text-base font-extrabold text-foreground">₹{p.price}</span>
                          {p.discountPrice && (
                            <span className="text-xs text-muted-foreground line-through">₹{p.discountPrice}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-border">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditModal(p)}
                        className="h-8 text-xs font-semibold rounded-xl"
                      >
                        <Edit2 className="w-3.5 h-3.5 mr-1 text-primary" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteProduct(p.id, p.name)}
                        className="h-8 text-xs font-semibold rounded-xl text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Edit Product Dialog */}
          <Dialog open={Boolean(editingProduct)} onOpenChange={(open) => !open && setEditingProduct(null)}>
            <DialogContent className="sm:max-w-md rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-base font-bold flex items-center gap-2">
                  <Edit2 className="w-4 h-4 text-primary" /> Edit Product
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Update pricing, inventory, image and variants for {editingProduct?.name}.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleUpdateProduct} className="space-y-3 py-2">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">Product Name *</label>
                  <Input
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    required
                    className="rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1 block">Selling Price (₹) *</label>
                    <Input
                      type="number"
                      value={editForm.price}
                      onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                      required
                      className="rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1 block">MRP (₹)</label>
                    <Input
                      type="number"
                      value={editForm.discountPrice}
                      onChange={(e) => setEditForm({ ...editForm, discountPrice: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1 block">Stock Quantity</label>
                    <Input
                      type="number"
                      value={editForm.stock}
                      onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1 block">Unit</label>
                    <Input
                      value={editForm.unit}
                      onChange={(e) => setEditForm({ ...editForm, unit: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">Category</label>
                  <Input
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">Image URL</label>
                  <Input
                    value={editForm.image}
                    onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                    placeholder="https://..."
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">Variants / Pack Sizes</label>
                  <Input
                    value={editForm.variants}
                    onChange={(e) => setEditForm({ ...editForm, variants: e.target.value })}
                    placeholder="e.g. 500g, 1kg, 2kg"
                    className="rounded-xl"
                  />
                </div>

                <DialogFooter className="pt-3 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingProduct(null)}
                    className="rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="rounded-xl bg-primary text-primary-foreground font-bold"
                  >
                    Save Changes
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Orders */}
      {section === "orders" && (
        <div className="space-y-4">
          <h1 className="text-xl font-bold">Order Management</h1>
          {orders.length === 0 ? (
            <Card className="rounded-2xl"><CardContent className="p-8 text-center text-sm text-muted-foreground">No orders found</CardContent></Card>
          ) : (
            orders.map((order: any, i: number) => (
              <Card key={order.id || i} className="rounded-2xl border-border">
                <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{order.customerName || "Customer"}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{order.items || "Items"} · {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ""}</p>
                  </div>
                  <p className="text-base font-bold">₹{order.totalAmount || order.amount || 0}</p>
                  <Badge variant={order.status === "completed" ? "default" : order.status === "pending" ? "secondary" : "outline"}>
                    {order.status}
                  </Badge>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Analytics */}
      {section === "analytics" && (
        <div className="space-y-6">
          <h1 className="text-xl font-bold">Store Analytics</h1>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard label="This Month Revenue" value={`₹${stats?.monthlyRevenue ?? 0}`} color="text-primary" />
            <StatCard label="Total Orders" value={String(orders.length)} color="text-emerald-600" />
            <StatCard label="Avg Order Value" value={orders.length > 0 ? `₹${Math.round(orders.reduce((s: number, o: any) => s + (o.totalAmount || 0), 0) / orders.length)}` : "₹0"} color="text-violet-600" />
          </div>
          <Card className="rounded-2xl border-border">
            <CardContent className="p-6 text-center text-sm text-muted-foreground">
              Detailed charts & sales trends are being loaded. Check back shortly.
            </CardContent>
          </Card>
        </div>
      )}

      {/* Inventory */}
      {section === "inventory" && (
        <div className="space-y-6">
          <h1 className="text-xl font-bold">Inventory Management</h1>
          {products.length === 0 ? (
            <Card className="rounded-2xl"><CardContent className="p-8 text-center text-sm text-muted-foreground">No products to manage. Add products first.</CardContent></Card>
          ) : (
            <div className="space-y-2">
              {products.map((p: any, i: number) => (
                <Card key={p.id || i} className="rounded-xl border-border">
                  <CardContent className="p-4 flex items-center gap-4">
                    <Package className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.category} · ₹{p.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={p.stock > 10 ? "default" : p.stock > 0 ? "secondary" : "destructive"} className="text-xs">
                        {p.stock} {p.unit}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Notifications */}
      {section === "notifications" && (
        <div className="space-y-4">
          <h1 className="text-xl font-bold">Notifications</h1>
          <Card className="rounded-2xl"><CardContent className="p-8 text-center text-sm text-muted-foreground">No new notifications</CardContent></Card>
        </div>
      )}

      {/* Profile / Settings */}
      {(section === "profile" || section === "settings") && (
        <div className="space-y-6">
          <h1 className="text-xl font-bold">{section === "profile" ? "Store Profile" : "Settings"}</h1>
          <Card className="rounded-2xl border-border">
            <CardContent className="p-6 text-center text-sm text-muted-foreground">
              Profile management and settings are coming soon. Contact EZY1 support to update store details.
            </CardContent>
          </Card>
        </div>
      )}

    </PartnerLayout>
  );
}
