# Quick Fix: Cloudinary Upload Not Working

## Problem
The upload button shows but doesn't work when clicked.

## Cause
Cloudinary environment variables are not configured.

## Solution (5 minutes)

### Step 1: Create Cloudinary Account
1. Go to https://cloudinary.com/users/register_free
2. Sign up (free account)
3. Verify your email

### Step 2: Get Your Credentials
1. Login to Cloudinary Dashboard
2. You'll see your **Cloud Name** on the dashboard
3. Copy it (example: `dxyz123abc`)

### Step 3: Create Upload Preset
1. Click **Settings** (gear icon) → **Upload**
2. Scroll to **Upload presets** section
3. Click **Add upload preset**
4. Configure:
   - **Preset name**: `online-shop` (or any name)
   - **Signing Mode**: Select **Unsigned** ⚠️ IMPORTANT
   - **Folder**: `products` (optional)
5. Click **Save**
6. Copy the preset name

### Step 4: Add to Environment Variables
1. Open your project root folder
2. Create or edit `.env.local` file
3. Add these lines:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=online-shop
```

**Replace `your_cloud_name_here` with your actual Cloud Name from Step 2**

Example:
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dxyz123abc
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=online-shop
```

### Step 5: Restart Server
```bash
# Stop the server (Ctrl+C or Cmd+C)
# Then restart:
pnpm dev
```

### Step 6: Test Upload
1. Go to `/admin/products/create`
2. Scroll to "Product Images"
3. Click **Upload** tab
4. Click **Upload Image** button
5. Select an image from your device
6. It should upload and appear in the preview!

## Troubleshooting

### Upload button still doesn't work
- Check browser console for errors (F12)
- Verify `.env.local` is in the project root
- Make sure you restarted the dev server
- Check that preset is set to "Unsigned"

### "Upload preset not found" error
- Go back to Cloudinary → Settings → Upload
- Verify the preset name matches exactly
- Make sure it's saved and active

### Images upload but don't show
- Check that Cloud Name is correct
- Verify images are set to "Public" in Cloudinary

## Alternative: Use URL Tab
While setting up Cloudinary, you can still add images via URL:
1. Click **URL** tab instead of Upload
2. Paste image URL (from Imgur, your server, etc.)
3. Click **Add**

## Need Help?
See full guide: `CLOUDINARY_SETUP.md`

## Quick Reference
- **Dashboard**: https://cloudinary.com/console
- **Upload Settings**: Settings → Upload → Upload presets
- **Free Tier**: 25GB storage, 25GB bandwidth/month
