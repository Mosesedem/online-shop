# Admin Quick Start Guide

## Getting Started

### 1. Set Up Admin Access

First, you need to grant admin privileges to a user account:

```sql
-- Connect to your database and run:
UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

### 2. Access Admin Panel

Navigate to: `http://localhost:3000/admin`

You'll be automatically redirected to login if not authenticated, or to the homepage if you don't have admin role.

## Product Management

### Add Product Manually

1. Go to `/admin/products`
2. Click **"Add Product"** button
3. Select **"Manual Entry"** tab
4. Fill in the form:
   - **Product Name** (required)
   - **Description** (required)
   - **Price** (required)
   - **Stock** (required)
   - **Category** (required)
   - **Age Category** (18+ or 21+)
   - **SKU** (optional)
   - **Images** (add URLs one by one)
5. Click **"Create Product"**

### Import Products from Excel

1. Go to `/admin/products`
2. Click **"Add Product"** button
3. Select **"Excel Import"** tab
4. (Optional) Download the template
5. Prepare your Excel file with these columns:
   - Product Name
   - Description
   - Price
   - Stock
   - SKU (optional)
   - Category Name
   - Age Category (ADULT_18 or ADULT_21)
   - Image URLs (comma-separated)
6. Upload the file
7. Review the import results

### Edit Product

1. Go to `/admin/products`
2. Click the **Edit** icon on any product
3. Or click on a product to view details, then click **"Edit"**
4. Update the fields
5. Click **"Save Changes"**

### Delete Product

1. Go to `/admin/products`
2. Click the **Trash** icon on any product
3. Or view product details and click **"Delete"**
4. Confirm deletion

### Bulk Delete Products

1. Go to `/admin/products`
2. Check the boxes next to products you want to delete
3. Click **"Bulk Delete"** in the action bar
4. Confirm deletion

## Order Management

### View Order Details

1. Go to `/admin/orders`
2. Click on any order to view full details

### Update Order Status

1. View order details
2. In the sidebar, use the **"Order Status"** dropdown
3. Select new status:
   - Pending
   - Processing
   - Shipped
   - Delivered
   - Cancelled
   - Refunded
4. Status updates automatically

### Update Payment Status

1. View order details
2. In the sidebar, use the **"Payment Status"** dropdown
3. Select new status:
   - Pending
   - Processing
   - Completed
   - Failed
   - Cancelled
4. Status updates automatically

## User Management

### View User Details

1. Go to `/admin/users`
2. Click on any user to view details

### Change User Role

1. View user details
2. In the sidebar, use the **"Role"** dropdown
3. Select:
   - **User** - Regular customer
   - **Admin** - Full admin access
4. Role updates automatically

### Toggle Verification Status

1. View user details
2. In the sidebar, click **"Mark as Verified"** or **"Mark as Unverified"**
3. Status updates automatically

### View User's Orders

1. View user details
2. Scroll to **"Recent Orders"** section
3. Click on any order to view details

## Filtering & Search

### Products

- **Search**: Enter product name or SKU
- **Category**: Filter by category
- **Stock**: Filter by stock status (All, In Stock, Low Stock, Out of Stock)
- **Sort**: Sort by name, price, or stock

### Orders

- Filter by status
- Search by order number or customer email

### Users

- Search by name or email
- Filter by role or verification status

## Tips & Best Practices

### Products

- Always add at least one image URL
- Use descriptive product names
- Keep SKUs unique
- Set appropriate age categories
- Monitor stock levels regularly

### Orders

- Update order status promptly
- Mark payment as completed when verified
- Add notes for special instructions
- Ship orders within 24-48 hours

### Users

- Only grant admin role to trusted users
- Verify age verification status before approving
- Monitor user activity for suspicious behavior
- Respond to support tickets promptly

## Keyboard Shortcuts

- **Esc** - Close modals/dialogs
- **Enter** - Submit forms (when focused)
- **Tab** - Navigate form fields

## Common Tasks

### Check Low Stock Products

1. Go to `/admin/products`
2. Select **"Low Stock (1-9)"** from stock filter
3. Review and restock as needed

### Process Pending Orders

1. Go to `/admin/orders`
2. Filter by **"Pending"** status
3. Review and update to **"Processing"**
4. Update payment status if needed

### Review Unverified Users

1. Go to `/admin/users`
2. Filter by **"Unverified"**
3. Review verification status
4. Approve or reject as appropriate

## Troubleshooting

### Can't Access Admin Panel

- Verify your user role is set to ADMIN in database
- Clear browser cache and cookies
- Log out and log back in
- Check console for errors

### Excel Import Fails

- Verify file format is .xlsx
- Check all required columns are present
- Ensure category names match exactly
- Review error messages for specific rows

### Product Not Showing on Store

- Check stock is greater than 0
- Verify product is published
- Check category is active
- Clear cache

### Order Status Won't Update

- Check your admin role
- Verify order exists
- Check network connection
- Review console for errors

## Security Notes

- Never share admin credentials
- Use strong passwords
- Log out when finished
- Monitor admin activity logs
- Regularly backup database
- Keep software updated

## Support

For technical issues or questions:
- Check documentation: `/ADMIN_FEATURES.md`
- Review error messages
- Check browser console
- Contact development team

## Quick Links

- **Dashboard**: `/admin`
- **Products**: `/admin/products`
- **Add Product**: `/admin/products/create`
- **Orders**: `/admin/orders`
- **Users**: `/admin/users`
- **Categories**: `/admin/categories`
- **Payments**: `/admin/payments`
- **Verifications**: `/admin/verifications`

---

**Last Updated**: November 2025
**Version**: 1.0
