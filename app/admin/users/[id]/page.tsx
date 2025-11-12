"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, User, Mail, Phone, Shield, ShoppingBag, Calendar } from "lucide-react";
import { toast } from "sonner";

interface UserDetail {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: string;
  isVerified: boolean;
  createdAt: string;
  _count: {
    orders: number;
    reviews: number;
    savedItems: number;
  };
  orders: Array<{
    id: string;
    orderNumber: string;
    totalAmount: number;
    status: string;
    createdAt: string;
  }>;
}

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [params.id]);

  const fetchUser = async () => {
    try {
      const res = await fetch(`/api/admin/users/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        toast.error("User not found");
        router.push("/admin/users");
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      toast.error("Failed to load user");
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserRole = async (role: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/users/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      if (res.ok) {
        toast.success("User role updated");
        fetchUser();
      } else {
        toast.error("Failed to update user role");
      }
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error("Failed to update user");
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleVerification = async () => {
    if (!user) return;
    
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/users/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVerified: !user.isVerified }),
      });

      if (res.ok) {
        toast.success("Verification status updated");
        fetchUser();
      } else {
        toast.error("Failed to update verification status");
      }
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error("Failed to update user");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading user...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="p-4 sm:p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Users
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{user.name || "User"}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
        <div className="flex gap-2">
          <Badge className={user.role === "ADMIN" ? "bg-purple-500" : "bg-blue-500"}>
            {user.role}
          </Badge>
          <Badge className={user.isVerified ? "bg-green-500" : "bg-yellow-500"}>
            {user.isVerified ? "Verified" : "Unverified"}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* User Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                User Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Email</span>
                  </div>
                  <p className="font-medium">{user.email}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Phone</span>
                  </div>
                  <p className="font-medium">{user.phone || "N/A"}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Joined</span>
                  </div>
                  <p className="font-medium">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Total Orders</span>
                  </div>
                  <p className="font-medium">{user._count.orders}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {user.orders.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No orders yet</p>
              ) : (
                <div className="space-y-3">
                  {user.orders.slice(0, 5).map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer"
                      onClick={() => router.push(`/admin/orders/${order.id}`)}
                    >
                      <div>
                        <p className="font-medium">{order.orderNumber}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₦{order.totalAmount.toLocaleString()}</p>
                        <Badge className="text-xs">{order.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* User Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Role</label>
                <Select
                  value={user.role}
                  onValueChange={updateUserRole}
                  disabled={isUpdating}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">User</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Verification Status</label>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={toggleVerification}
                  disabled={isUpdating}
                >
                  {user.isVerified ? "Mark as Unverified" : "Mark as Verified"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Orders</span>
                <span className="font-semibold">{user._count.orders}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Reviews</span>
                <span className="font-semibold">{user._count.reviews}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Saved Items</span>
                <span className="font-semibold">{user._count.savedItems}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
