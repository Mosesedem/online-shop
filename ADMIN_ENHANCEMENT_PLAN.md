# Admin Dashboard Enhancement Plan

## Completed ✅
1. **Enhanced Dashboard** (`/app/admin/page.tsx`)
   - Comprehensive stats cards (orders, users, products, revenue)
   - Alert cards (pending orders, low stock, verifications, tickets)
   - Revenue trend chart (6 months)
   - Orders by status pie chart
   - Top selling products
   - Recent orders with status badges
   - Quick action buttons

2. **Enhanced Stats API** (`/app/api/admin/stats/route.ts`)
   - All basic counts
   - Pending orders count
   - Low stock products
   - Pending verifications
   - Open support tickets
   - Revenue by month (6 months)
   - Orders grouped by status
   - Top 5 products this month
   - Average rating calculation

## To Implement

### 1. Products Management (Priority: HIGH)
**File**: `/app/admin/products/page.tsx`

**Features Needed**:
- ✅ List all products with pagination
- ❌ Bulk selection (checkboxes)
- ❌ Bulk actions:
  - Delete multiple products
  - Update stock for multiple
  - Change category for multiple
  - Update price (percentage increase/decrease)
- ❌ Advanced filtering:
  - By category
  - By stock level (low, medium, high, out of stock)
  - By price range
  - By age category
- ❌ Search by name/SKU
- ❌ Sort by: name, price, stock, created date
- ❌ Export to CSV
- ❌ Import from CSV
- ❌ Quick edit inline
- ❌ Stock alerts

**API Endpoints Needed**:
- `POST /api/admin/products/bulk-delete`
- `PUT /api/admin/products/bulk-update`
- `POST /api/admin/products/import`
- `GET /api/admin/products/export`

### 2. Orders Management (Priority: HIGH)
**File**: `/app/admin/orders/page.tsx`

**Features Needed**:
- ✅ List all orders
- ❌ Bulk selection
- ❌ Bulk actions:
  - Update status (PENDING → PROCESSING → SHIPPED → DELIVERED)
  - Cancel multiple orders
  - Generate invoices
  - Export selected
- ❌ Advanced filtering:
  - By status
  - By payment status
  - By date range
  - By customer email
  - By order number
  - By total amount range
- ❌ Search functionality
- ❌ Order details modal/page
- ❌ Print packing slips
- ❌ Track shipments
- ❌ Refund processing

**API Endpoints Needed**:
- `PUT /api/admin/orders/bulk-status`
- `POST /api/admin/orders/bulk-cancel`
- `POST /api/admin/orders/[id]/refund`
- `GET /api/admin/orders/export`

### 3. Categories Management (Priority: MEDIUM)
**File**: `/app/admin/categories/page.tsx` (NEW)

**Features Needed**:
- ❌ List all categories
- ❌ Create new category
- ❌ Edit category (name, slug, image)
- ❌ Delete category (with product reassignment)
- ❌ Reorder categories (drag & drop)
- ❌ View product count per category
- ❌ Bulk delete

**API Endpoints Needed**:
- `GET /api/admin/categories`
- `POST /api/admin/categories`
- `PUT /api/admin/categories/[id]`
- `DELETE /api/admin/categories/[id]`
- `POST /api/admin/categories/bulk-delete`

### 4. Users Management (Priority: MEDIUM)
**File**: `/app/admin/users/page.tsx`

**Features Needed**:
- ✅ List all users
- ❌ Bulk selection
- ❌ Bulk actions:
  - Delete users
  - Verify users manually
  - Send email to selected
- ❌ Advanced filtering:
  - By verification status
  - By registration date
  - By order count
  - By total spent
- ❌ Search by email/name
- ❌ User details view:
  - Order history
  - Verification logs
  - Support tickets
  - Addresses
- ❌ Manual verification approval
- ❌ Export user data

**API Endpoints Needed**:
- `PUT /api/admin/users/bulk-verify`
- `DELETE /api/admin/users/bulk-delete`
- `GET /api/admin/users/[id]/details`
- `GET /api/admin/users/export`

### 5. Reviews Management (Priority: MEDIUM)
**File**: `/app/admin/reviews/page.tsx` (NEW)

**Features Needed**:
- ❌ List all reviews
- ❌ Filter by:
  - Rating (1-5 stars)
  - Product
  - Date
  - Status (approved/pending)
- ❌ Bulk actions:
  - Approve reviews
  - Delete reviews
  - Mark as spam
- ❌ Moderate reviews
- ❌ Respond to reviews
- ❌ Export reviews

**API Endpoints Needed**:
- `GET /api/admin/reviews`
- `PUT /api/admin/reviews/[id]/approve`
- `DELETE /api/admin/reviews/bulk-delete`
- `POST /api/admin/reviews/[id]/respond`

### 6. Support Tickets (Priority: MEDIUM)
**File**: `/app/admin/support/page.tsx` (NEW)

**Features Needed**:
- ❌ List all tickets
- ❌ Filter by status (open/closed/pending)
- ❌ Assign tickets to admin
- ❌ Respond to tickets
- ❌ Close tickets
- ❌ Bulk close
- ❌ Priority levels
- ❌ Search by user/subject

**API Endpoints Needed**:
- `GET /api/admin/support`
- `PUT /api/admin/support/[id]/respond`
- `PUT /api/admin/support/[id]/close`
- `POST /api/admin/support/bulk-close`

### 7. Verifications Management (Priority: HIGH)
**File**: `/app/admin/verifications/page.tsx`

**Features Needed**:
- ✅ List pending verifications
- ❌ View verification details
- ❌ Approve/reject verifications
- ❌ Bulk approve/reject
- ❌ View verification logs
- ❌ Manual verification upload
- ❌ Filter by status/provider

### 8. Settings (Priority: LOW)
**File**: `/app/admin/settings/page.tsx` (NEW)

**Features Needed**:
- ❌ Store settings:
  - Store name
  - Contact email
  - Phone number
  - Address
- ❌ Payment settings:
  - Paystack keys
  - Currency
- ❌ Shipping settings:
  - Shipping rates
  - Free shipping threshold
- ❌ Email settings:
  - SMTP configuration
  - Email templates
- ❌ Age verification settings:
  - Providers
  - Required age
- ❌ Tax settings

## Bulk Operations Implementation

### Bulk Delete Pattern
```typescript
// API Route
export async function POST(request: Request) {
  const { ids } = await request.json();
  
  await prisma.product.deleteMany({
    where: { id: { in: ids } }
  });
  
  return NextResponse.json({ success: true });
}

// Frontend
const handleBulkDelete = async () => {
  await fetch('/api/admin/products/bulk-delete', {
    method: 'POST',
    body: JSON.stringify({ ids: selectedIds })
  });
};
```

### Bulk Update Pattern
```typescript
// API Route
export async function PUT(request: Request) {
  const { ids, updates } = await request.json();
  
  await prisma.product.updateMany({
    where: { id: { in: ids } },
    data: updates
  });
  
  return NextResponse.json({ success: true });
}
```

## UI Components Needed

### 1. Bulk Action Bar
```tsx
<div className="flex items-center gap-2 p-4 bg-muted">
  <span>{selectedCount} selected</span>
  <Button onClick={handleBulkDelete}>Delete</Button>
  <Button onClick={handleBulkUpdate}>Update</Button>
  <Button onClick={clearSelection}>Clear</Button>
</div>
```

### 2. Data Table with Selection
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>
        <Checkbox 
          checked={allSelected}
          onCheckedChange={toggleSelectAll}
        />
      </TableHead>
      {/* Other headers */}
    </TableRow>
  </TableHeader>
  <TableBody>
    {items.map(item => (
      <TableRow key={item.id}>
        <TableCell>
          <Checkbox 
            checked={selected.includes(item.id)}
            onCheckedChange={() => toggleSelect(item.id)}
          />
        </TableCell>
        {/* Other cells */}
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### 3. Advanced Filter Panel
```tsx
<Card>
  <CardHeader>
    <CardTitle>Filters</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      <Select onValueChange={setCategory}>
        <SelectTrigger>
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map(cat => (
            <SelectItem key={cat.id} value={cat.id}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Input 
        placeholder="Search..." 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      
      <Button onClick={applyFilters}>Apply</Button>
      <Button variant="outline" onClick={clearFilters}>Clear</Button>
    </div>
  </CardContent>
</Card>
```

## Database Indexes Needed

Add to `schema.prisma`:
```prisma
model Product {
  // ... existing fields
  
  @@index([categoryId, stock])
  @@index([price])
  @@index([createdAt])
}

model Order {
  // ... existing fields
  
  @@index([status, paymentStatus])
  @@index([createdAt])
  @@index([totalAmount])
}

model User {
  // ... existing fields
  
  @@index([isVerified])
  @@index([createdAt])
}
```

## Security Considerations

1. **Admin Role Check**: Add middleware to verify admin role
2. **Rate Limiting**: Implement rate limiting for bulk operations
3. **Audit Logs**: Log all admin actions
4. **CSRF Protection**: Ensure CSRF tokens for sensitive operations
5. **Input Validation**: Validate all bulk operation inputs
6. **Transaction Rollback**: Use database transactions for bulk operations

## Performance Optimizations

1. **Pagination**: Implement cursor-based pagination for large datasets
2. **Lazy Loading**: Load data on demand
3. **Caching**: Cache frequently accessed data (categories, stats)
4. **Batch Processing**: Process bulk operations in batches of 100
5. **Background Jobs**: Use queue for large bulk operations

## Testing Checklist

- [ ] Dashboard loads with correct stats
- [ ] All charts render properly
- [ ] Bulk selection works
- [ ] Bulk delete works
- [ ] Bulk update works
- [ ] Filters work correctly
- [ ] Search works
- [ ] Pagination works
- [ ] Export works
- [ ] Import works
- [ ] Mobile responsive
- [ ] Error handling
- [ ] Loading states
- [ ] Empty states

## Priority Order

1. **Phase 1** (Critical - Week 1):
   - ✅ Enhanced Dashboard
   - ✅ Enhanced Stats API
   - Products bulk operations
   - Orders bulk operations
   - Categories CRUD

2. **Phase 2** (Important - Week 2):
   - Users management enhancements
   - Verifications workflow
   - Reviews management
   - Support tickets

3. **Phase 3** (Nice to have - Week 3):
   - Settings page
   - Advanced analytics
   - Export/Import features
   - Email notifications
