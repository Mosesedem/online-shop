# Shop Feature Guide

## Quick Start

### Running the Shop
```bash
npm run dev
# or
pnpm dev
```

Visit: `http://localhost:3000/shop`

## User Journey

### 1. Browse Products
**Path**: `/shop`

**Features Available**:
- Search products by name
- Filter by category (pills on desktop, sheet on mobile)
- Sort products (Featured, Price, Name)
- Adjust price range with slider
- View 12 products per page with pagination

**Mobile**: 
- Tap "Filters" button to open filter sheet
- Swipe to dismiss filter sheet

**Desktop**:
- Filters always visible in left sidebar
- Category pills at top
- Sort dropdown in header

### 2. View Product Details

**Two Ways to Access**:

#### A. Click Product Card
- Navigates to `/products/[id]`
- Full page view with complete details
- Back button to return to shop

#### B. Click "Details/Info" Button
- Opens sheet overlay
- Mobile: Slides up from bottom (85% screen height)
- Desktop: Slides in from right (400-450px width)
- Scrollable content
- Close with X button or click outside

### 3. Add to Cart

**Three Ways**:
1. **Product Card**: Click "Add" button (adds 1 item)
2. **Product Detail Page**: Select quantity, click "Add to Cart"
3. **Product Sheet**: Select quantity, click "Add to Cart"

**Feedback**: Toast notification confirms addition

### 4. Save Items

**Available On**:
- Product cards (heart icon)
- Product detail page
- Product detail sheet

**Requirements**: Must be logged in

**Behavior**:
- Click heart icon to save/unsave
- Filled heart = saved
- Outline heart = not saved
- Toast notification for feedback

### 5. View Cart

**Access**: Click cart icon in header

**Features**:
- Real-time item count badge
- Badge shows total quantity (max display: 9+)

## Component Behavior

### Product Card

**Click Areas**:
- **Card Background**: Navigate to product page
- **Info/Details Button**: Open detail sheet
- **Add Button**: Add to cart (1 quantity)
- **Heart Icon**: Toggle save status

**Mobile Optimizations**:
- Action buttons always visible
- Larger touch targets
- Optimized image sizes

**Desktop Enhancements**:
- Hover effects
- Action buttons appear on hover
- Smooth transitions

### Product Detail Sheet

**Opening**:
- Click "Details/Info" on product card
- Does NOT navigate away from shop page

**Content**:
- Product images with gallery
- Full description
- Price and category
- Star rating
- Quantity selector
- Add to cart button
- Save/wishlist button
- Stock status

**Scrolling**:
- Fully scrollable content
- Custom scrollbar styling
- Smooth scroll behavior

**Closing**:
- Click X button (top right)
- Click outside sheet
- Press Escape key

### Filters (Mobile)

**Opening**: Tap "Filters" button

**Content**:
- Sort dropdown
- Price range slider
- Category buttons
- Clear filters button

**Height**: 80% of viewport
**Scrollable**: Yes
**Closing**: Swipe down or tap outside

### Filters (Desktop)

**Location**: Left sidebar
**Sticky**: Yes (stays visible when scrolling)
**Width**: 256px (16rem)
**Always Visible**: Yes

## Search Behavior

**Type**: Debounced (300ms delay)
**Triggers**: 
- Automatic after typing stops
- Press Enter key

**Searches**: Product names and descriptions

**Clears**: Click "Clear Filters" button

## Pagination

**Items Per Page**: 12

**Controls**:
- Previous button (disabled on page 1)
- Page number buttons (1, 2, 3, etc.)
- Next button (disabled on last page)

**Display**: Shows "X-Y of Z products"

**Resets When**:
- Changing filters
- Changing sort order
- New search query

## Cart Integration

### Global State
- Managed by CartContext
- Persisted in localStorage
- Survives page refreshes

### Cart Badge
- Shows total quantity of all items
- Updates in real-time
- Maximum display: "9+"

### Adding Items
```typescript
// Automatic from any add to cart action
{
  productId: string,
  productName: string,
  price: number,
  quantity: number,
  image: string
}
```

## Saved Items

### Storage
- Saved to database via API
- Requires authentication
- Persists across sessions

### API Endpoints
- **POST** `/api/saved-items` - Save item
- **DELETE** `/api/saved-items/[id]` - Remove item
- **GET** `/api/saved-items` - List saved items

### Checking Status
- Fetched on component mount
- Checked against user's saved items
- Updates icon fill state

## Responsive Breakpoints

```css
/* Mobile First */
default: 0px - 639px

/* Small (sm) */
640px: Tablet portrait

/* Medium (md) */
768px: Tablet landscape / Small desktop

/* Large (lg) */
1024px: Desktop

/* Extra Large (xl) */
1280px: Large desktop
```

## Keyboard Navigation

### Shop Page
- **Tab**: Navigate through filters and products
- **Enter**: Activate buttons and links
- **Escape**: Close sheets/modals

### Product Detail Sheet
- **Tab**: Navigate through controls
- **Escape**: Close sheet
- **Arrow Keys**: Navigate image gallery (future)

## Toast Notifications

**Position**: Top center
**Duration**: Auto-dismiss (3-5 seconds)
**Types**:
- Success (green)
- Error (red)
- Info (blue)

**Triggers**:
- Add to cart
- Save/unsave item
- API errors
- Authentication required

## Error Handling

### No Products Found
- Shows empty state message
- "Clear Filters" button
- Suggests removing filters

### Product Not Found
- Shows error message
- "Back to Shop" button

### API Errors
- Toast notification
- Console error logging
- Graceful fallback

### Loading States
- "Loading products..." message
- Centered display
- Prevents interaction during load

## Performance Tips

1. **Images**: Optimized with Next.js Image component
2. **Search**: Debounced to reduce API calls
3. **Filtering**: Client-side for instant results
4. **Pagination**: Limits rendered products
5. **Lazy Loading**: Images load as needed

## Accessibility Features

1. **Screen Readers**: 
   - ARIA labels on all interactive elements
   - Hidden titles for sheets
   - Semantic HTML structure

2. **Keyboard Navigation**:
   - All features accessible via keyboard
   - Visible focus indicators
   - Logical tab order

3. **Color Contrast**:
   - WCAG AA compliant
   - Clear visual hierarchy
   - Readable text sizes

4. **Touch Targets**:
   - Minimum 44x44px on mobile
   - Adequate spacing between elements
   - Clear visual feedback

## Troubleshooting

### Cart Count Not Updating
- Check CartProvider is wrapping app
- Verify localStorage permissions
- Check browser console for errors

### Filters Not Working
- Clear browser cache
- Check API endpoint responses
- Verify category data exists

### Sheet Not Opening
- Check z-index conflicts
- Verify Radix UI dependencies
- Check console for errors

### Images Not Loading
- Verify image URLs are valid
- Check Next.js image domains config
- Use placeholder for missing images

## Development Notes

### Adding New Filters
1. Add state in `shop/page.tsx`
2. Add UI in `FilterContent` component
3. Update `fetchProducts` logic
4. Add to `clearFilters` function

### Customizing Pagination
- Change `itemsPerPage` constant
- Adjust grid columns in `product-grid.tsx`
- Update responsive breakpoints

### Styling
- Uses Tailwind CSS
- Custom colors in `globals.css`
- Component variants in UI components
- Responsive utilities throughout

### API Integration
- All product APIs in `/api/products`
- Saved items in `/api/saved-items`
- Cart managed client-side
- Authentication via NextAuth
