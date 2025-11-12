# Admin Features Documentation

## Overview
Comprehensive admin system with God-like abilities to manage all aspects of the e-commerce platform.

## Features Implemented

### 1. Product Management

#### Pages Created:
- `/admin/products` - Product listing with filters and bulk actions
- `/admin/products/create` - Create new product (manual + Excel import)
- `/admin/products/[id]` - Product detail view
- `/admin/products/[id]/edit` - Edit product

#### Capabilities:
- ✅ View all products with advanced filtering (search, category, stock status)
- ✅ Create products manually via form
- ✅ Import products via Excel (.xlsx) file
- ✅ Edit product details (name, price, stock, images, category, etc.)
- ✅ Delete individual products
- ✅ Bulk delete products
- ✅ View product statistics (orders, reviews)
- ✅ Preview products on storefront
- ✅ Duplicate products (UI ready)

#### API Routes:
- `GET /api/admin/products` - List all products
- `POST /api/admin/products` - Create product
- `GET /api/admin/products/[id]` - Get product details
- `PUT /api/admin/products/[id]` - Update product
- `DELETE /api/admin/products/[id]` - Delete product
- `POST /api/admin/products/import` - Import from Excel
- `POST /api/admin/products/bulk-delete` - Bulk delete

### 2. Order Management

#### Pages Created:
- `/admin/orders` - Order listing (existing)
- `/admin/orders/[id]` - Order detail view with full management

#### Capabilities:
- ✅ View all orders with filters
- ✅ View complete order details (items, customer, shipping, payment)
- ✅ Update order status (Pending, Processing, Shipped, Delivered, Cancelled, Refunded)
- ✅ Update payment status (Pending, Processing, Completed, Failed, Cancelled)
- ✅ View customer information
- ✅ View shipping address
- ✅ View order items with product details
- ✅ Delete orders

#### API Routes:
- `GET /api/admin/orders/[id]` - Get order details
- `PUT /api/admin/orders/[id]` - Update order status/payment
- `DELETE /api/admin/orders/[id]` - Delete order

### 3. User Management

#### Pages Created:
- `/admin/users` - User listing (existing)
- `/admin/users/[id]` - User detail view with role management

#### Capabilities:
- ✅ View all users
- ✅ View user details (email, phone, join date)
- ✅ Change user role (USER ↔ ADMIN)
- ✅ Toggle verification status
- ✅ View user statistics (orders, reviews, saved items)
- ✅ View user's recent orders
- ✅ Navigate to user's orders
- ✅ Delete users

#### API Routes:
- `GET /api/admin/users/[id]` - Get user details
- `PUT /api/admin/users/[id]` - Update user (role, verification, profile)
- `DELETE /api/admin/users/[id]` - Delete user

### 4. Excel Import Feature

#### Format Requirements:
```
Column A: Product Name (required)
Column B: Description (required)
Column C: Price (required, number)
Column D: Stock (required, number)
Column E: SKU (optional)
Column F: Category Name (required)
Column G: Age Category (ADULT_18 or ADULT_21)
Column H: Image URLs (comma-separated)
```

#### Features:
- ✅ Upload .xlsx files
- ✅ Automatic category matching
- ✅ Slug generation
- ✅ Error reporting per row
- ✅ Success count
- ✅ Template download (UI ready)

## Admin Access Control

### Authentication:
- All admin routes protected by role check
- Only users with `role = "ADMIN"` can access
- Unauthorized users redirected to home page

### Setting Admin Role:
```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@example.com';
```

## Database Schema Updates

### User Model:
- Added `role` field (UserRole enum: USER, ADMIN)
- Default: USER

### Enums Added:
- `UserRole` - USER, ADMIN

## Navigation

### Admin Sidebar:
- Dashboard
- Products
- Orders
- Users
- Categories
- Payments
- Verifications

### Quick Actions:
- Create Product (with Excel import option)
- View Product on Store
- Duplicate Product
- Update Order Status
- Update Payment Status
- Change User Role
- Toggle Verification

## Statistics & Analytics

### Product Stats:
- Total orders containing product
- Review count
- Stock status
- Created/Updated dates

### User Stats:
- Total orders
- Reviews written
- Saved items count
- Join date

### Order Stats:
- Order items
- Total amount
- Payment method
- Shipping address

## Security Features

1. **Role-Based Access Control (RBAC)**
   - Admin layout checks session role
   - API routes verify admin role
   - Unauthorized access blocked

2. **Session Management**
   - Role included in JWT token
   - Role refreshed on session update
   - Secure session storage

3. **Data Validation**
   - Input validation on all forms
   - Type checking on API routes
   - Error handling throughout

## Future Enhancements

### Potential Additions:
- [ ] Category CRUD operations
- [ ] Payment detail management
- [ ] Review moderation
- [ ] Bulk product updates
- [ ] Export functionality (CSV/Excel)
- [ ] Advanced analytics dashboard
- [ ] Inventory alerts
- [ ] Email notifications
- [ ] Activity logs
- [ ] Multi-image upload
- [ ] Product variants

## Usage Instructions

### Creating Products:

**Manual Entry:**
1. Navigate to `/admin/products`
2. Click "Add Product"
3. Choose "Manual Entry" tab
4. Fill in product details
5. Add image URLs
6. Click "Create Product"

**Excel Import:**
1. Navigate to `/admin/products`
2. Click "Add Product"
3. Choose "Excel Import" tab
4. Download template (optional)
5. Upload filled Excel file
6. Review import results

### Managing Orders:
1. Navigate to `/admin/orders`
2. Click on order to view details
3. Update status using dropdown
4. Changes save automatically

### Managing Users:
1. Navigate to `/admin/users`
2. Click on user to view details
3. Change role using dropdown
4. Toggle verification as needed

## Technical Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL (Prisma ORM)
- **Auth**: NextAuth.js with role support
- **UI**: shadcn/ui components
- **Excel**: xlsx library
- **Styling**: Tailwind CSS

## API Response Formats

### Success Response:
```json
{
  "id": "...",
  "name": "...",
  ...
}
```

### Error Response:
```json
{
  "message": "Error description"
}
```

### Import Response:
```json
{
  "message": "Import completed",
  "count": 10,
  "errors": ["Row 5: Missing category", ...]
}
```

## Notes

- All timestamps in ISO 8601 format
- Prices in Nigerian Naira (₦)
- Images stored as URL arrays
- Slugs auto-generated from names
- Unique constraints on SKU and slug
- Cascade deletes configured
- Optimistic UI updates
- Toast notifications for all actions
