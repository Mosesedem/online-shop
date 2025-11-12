# Cloudinary Setup Guide

## 1. Create Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Verify your email

## 2. Get Your Credentials

From your Cloudinary Dashboard, you'll need:

- **Cloud Name**
- **API Key**
- **API Secret**

## 3. Create Upload Preset

1. Go to Settings → Upload
2. Scroll to "Upload presets"
3. Click "Add upload preset"
4. Set the following:
   - **Preset name**: `online-shop-products` (or any name you prefer)
   - **Signing Mode**: `Unsigned`
   - **Folder**: `online-shop` (optional, for organization)
   - **Access mode**: `Public`
5. Save the preset

## 4. Add Environment Variables

Add these to your `.env.local` file:

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=online-shop-products


# Optional: For server-side operations
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

**Important**:

- Replace `your_cloud_name_here` with your actual Cloud Name
- Replace `online-shop-products` with your upload preset name
- The `NEXT_PUBLIC_` prefix makes these available in the browser

## 5. Restart Development Server

After adding environment variables:

```bash
# Stop the server (Ctrl+C)
# Then restart
pnpm dev
```

## 6. Test the Upload

1. Go to `/admin/products/create`
2. Click on the "Upload" tab under Images
3. Click "Upload Image"
4. Select an image from your device
5. The image should upload to Cloudinary and appear in the preview

## Features

### Image Upload Component

The `ImageUpload` component provides:

- **Upload Tab**: Upload images directly from device
- **URL Tab**: Enter image URLs manually
- **Preview Grid**: See all uploaded images
- **Remove Images**: Click X button on hover
- **Main Image**: First image is marked as main
- **Max Limit**: Configurable max images (default: 5)

### Used In

- Product creation (`/admin/products/create`)
- Product editing (`/admin/products/[id]/edit`)
- Category creation (`/admin/categories/create`)
- Category editing (`/admin/categories/[id]`)

## Cloudinary Features

### Automatic Optimizations

Cloudinary automatically:

- Optimizes image size
- Converts to modern formats (WebP, AVIF)
- Generates responsive images
- Provides CDN delivery

### Image Transformations

You can transform images on-the-fly by modifying URLs:

```
# Original
https://res.cloudinary.com/demo/image/upload/sample.jpg

# Resize to 300x300
https://res.cloudinary.com/demo/image/upload/w_300,h_300,c_fill/sample.jpg

# Add quality optimization
https://res.cloudinary.com/demo/image/upload/q_auto,f_auto/sample.jpg
```

## Troubleshooting

### Upload button doesn't work

- Check that `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` is set
- Verify the upload preset is set to "Unsigned"
- Check browser console for errors

### Images not displaying

- Verify the Cloud Name is correct
- Check that images are set to "Public" access mode
- Inspect the image URL in browser dev tools

### "Upload preset not found"

- Go to Cloudinary Dashboard → Settings → Upload
- Verify the preset name matches your `.env.local`
- Make sure the preset is saved and active

## Security Notes

1. **Unsigned Presets**: Safe for client-side uploads but anyone can upload
2. **Folder Organization**: Use folders to organize uploads
3. **Upload Limits**: Set upload limits in Cloudinary dashboard
4. **Moderation**: Enable moderation for user-uploaded content

## Free Tier Limits

Cloudinary free tier includes:

- 25 GB storage
- 25 GB bandwidth/month
- 25,000 transformations/month

This is sufficient for most small to medium e-commerce sites.

## Next Steps

1. Set up your Cloudinary account
2. Add environment variables
3. Test image uploads
4. Configure upload presets for different use cases
5. Set up image transformations for product thumbnails

For more information, visit [Cloudinary Documentation](https://cloudinary.com/documentation)
