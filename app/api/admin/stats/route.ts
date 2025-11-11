import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    // Check admin authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get current date ranges
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Fetch all stats in parallel
    const [
      totalOrders,
      totalUsers,
      totalProducts,
      pendingOrders,
      lowStockProducts,
      totalReviews,
      pendingVerifications,
      openTickets,
      allOrders,
      recentOrders,
      ordersByStatus,
      topProducts,
    ] = await Promise.all([
      // Basic counts
      prisma.order.count(),
      prisma.user.count(),
      prisma.product.count(),
      
      // Pending orders
      prisma.order.count({
        where: { status: "PENDING" },
      }),
      
      // Low stock products (less than 10 units)
      prisma.product.count({
        where: { stock: { lt: 10 } },
      }),
      
      // Total reviews
      prisma.review.count(),
      
      // Pending verifications
      prisma.user.count({
        where: { isVerified: false },
      }),
      
      // Open support tickets
      prisma.supportTicket.count({
        where: { status: "open" },
      }),
      
      // All orders for revenue calculation
      prisma.order.findMany({
        where: {
          paymentStatus: "COMPLETED",
        },
        select: {
          totalAmount: true,
          createdAt: true,
        },
      }),
      
      // Recent orders
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          orderNumber: true,
          totalAmount: true,
          status: true,
          createdAt: true,
          email: true,
        },
      }),
      
      // Orders by status
      prisma.order.groupBy({
        by: ["status"],
        _count: true,
      }),
      
      // Top products (this month)
      prisma.orderItem.groupBy({
        by: ["productId"],
        _sum: {
          quantity: true,
          price: true,
        },
        where: {
          createdAt: {
            gte: startOfMonth,
          },
        },
        orderBy: {
          _sum: {
            quantity: "desc",
          },
        },
        take: 5,
      }),
    ]);

    // Calculate total revenue
    const totalRevenue = allOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Calculate average rating
    const reviewsWithRating = await prisma.review.aggregate({
      _avg: {
        rating: true,
      },
    });
    const averageRating = reviewsWithRating._avg.rating || 0;

    // Generate revenue by month (last 6 months)
    const revenueByMonth = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonthDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      
      const monthOrders = allOrders.filter(
        (order) => order.createdAt >= monthDate && order.createdAt < nextMonthDate
      );
      
      const monthRevenue = monthOrders.reduce((sum, order) => sum + order.totalAmount, 0);
      
      revenueByMonth.push({
        month: monthDate.toLocaleDateString("en-US", { month: "short" }),
        revenue: monthRevenue,
      });
    }

    // Format orders by status
    const formattedOrdersByStatus = ordersByStatus.map((item) => ({
      status: item.status,
      count: item._count,
    }));

    // Get product details for top products
    const topProductIds = topProducts.map((p) => p.productId);
    const productDetails = await prisma.product.findMany({
      where: {
        id: { in: topProductIds },
      },
      select: {
        id: true,
        name: true,
      },
    });

    const formattedTopProducts = topProducts.map((item) => {
      const product = productDetails.find((p) => p.id === item.productId);
      return {
        id: item.productId,
        name: product?.name || "Unknown",
        sales: item._sum.quantity || 0,
        revenue: item._sum.price || 0,
      };
    });

    return NextResponse.json({
      totalOrders,
      totalUsers,
      totalProducts,
      totalRevenue,
      pendingOrders,
      lowStockProducts,
      totalReviews,
      averageRating: Number(averageRating.toFixed(1)),
      pendingVerifications,
      openTickets,
      recentOrders,
      revenueByMonth,
      ordersByStatus: formattedOrdersByStatus,
      topProducts: formattedTopProducts,
    });
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    return NextResponse.json({ message: "Failed to fetch stats" }, { status: 500 });
  }
}
