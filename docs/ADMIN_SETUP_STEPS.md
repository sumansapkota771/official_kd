# Admin Setup Steps - Hackathon Slideshow

## 🚀 Getting Started (5 minutes)

### Prerequisites
- ✓ Admin access to the website
- ✓ Images ready (JPG or PNG, recommended 1200×600px)
- ✓ Access to `/admin` panel

---

## Step-by-Step Setup

### **STEP 1: Configure Slideshow Settings**
*Time: 1 minute*

1. **Open Admin Panel**
   - Go to: `http://your-site.com/admin`
   - Click: **Content** (in sidebar)

2. **Find Hackathon Group**
   - Scroll down to **"Hackathon"** section
   - Look for card: **"Hackathon slideshow"** 
   - This is a singleton (only one settings item)

3. **Click Edit**
   - Click the card to open editor
   - You should see two fields:

   | Field | Value | Example |
   |-------|-------|---------|
   | Slide Interval (seconds) | Number | `5` |
   | Auto-play on Load | Checkbox | ✓ Checked |

4. **Set Your Preferences**
   ```
   Slide Interval: 5
   Auto-play: ✓ (checked)
   ```
   
   **Timing Guide:**
   - 3-4 seconds = Fast-paced, high impact
   - 5-7 seconds = Balanced (recommended)
   - 8-10 seconds = Slower, more time to read

5. **Save**
   - Click: **"Publish"** button
   - Click: **"Save"** button
   - See: ✓ Success message

---

### **STEP 2: Upload Images to Media Library**
*Time: 2 minutes*

1. **Go to Media Library**
   - Click: **Media** (in sidebar)
   - Button: **"Upload image"** (top right)

2. **Select Image**
   - Choose from your computer
   - Recommended size: **1200×600px** (or wider)
   - File format: **JPG** (best) or **PNG**
   - Max file size: **500KB**

3. **Upload**
   - Click image button to select file
   - Wait for upload ✓
   - Copy the **image URL** or note the filename

4. **Repeat for All Images**
   - Upload 3-5 images for best effect
   - Keep consistent aspect ratio
   - Examples:
     - Hackathon kickoff photo
     - Winners celebrating
     - Participants coding
     - Judges panel
     - Award ceremony

**Pro Tip:** Upload images in order, then create content items in same order

---

### **STEP 3: Create Slideshow Image Entries**
*Time: 3 minutes (1 minute per image)*

1. **Go to Slideshow Images**
   - Click: **Content** (sidebar)
   - Scroll to: **Hackathon** group
   - Click: **"Hackathon slideshow images"** card

2. **Add First Image**
   - Click: **"Add"** or **"Create"** button
   - Opens new editor form

3. **Fill the Form**
   
   | Field | What to Do |
   |-------|-----------|
   | Desktop image | Click → Select from Media Library |
   | Mobile image | Optional - crop for mobile |
   | Display order | `1` (for first image) |

4. **Desktop Image Selection**
   - Click on "Desktop image" field
   - Browse Media Library
   - Click to select image you uploaded
   - Image URL appears in field

5. **Mobile Image (Optional)**
   - Click "Mobile image" field
   - Select same or different cropped version
   - If empty, uses desktop image on mobile

6. **Display Order**
   - Enter: `1` (for first slide)
   - Enter: `2` (for second slide)
   - Enter: `3` (etc.)
   - This controls slide sequence

7. **Publish & Save**
   - Click: **"Publish"** checkbox (make it visible)
   - Click: **"Save"** button
   - See: ✓ Success message

8. **Repeat for Each Image**
   - Add image #2 with Display Order `2`
   - Add image #3 with Display Order `3`
   - Add image #4 with Display Order `4`
   - Add image #5 with Display Order `5`

---

## 📋 Verification Checklist

After setup, verify everything works:

- [ ] Navigate to homepage
- [ ] See slideshow in Hackathon section (right side panel)
- [ ] Images appear in correct order (1, 2, 3...)
- [ ] Slides auto-rotate after interval (5 sec by default)
- [ ] Arrow buttons work (previous/next)
- [ ] Dot indicators show current slide
- [ ] Play/Pause button stops/starts rotation
- [ ] On mobile, slideshow is full width and centered
- [ ] No errors in browser console (F12)

---

## 🎯 Best Practices

### Image Selection
✓ Show **people** (participants, judges)
✓ Show **action** (coding, building)
✓ Show **results** (winners, demos)
✓ Show **brand** (KodeDristi logos, colors)

### Image Quality
✓ Well-lit, clear photos
✓ Consistent aspect ratio (2:1 or 16:9)
✓ Optimized file size (<300KB)
✓ High resolution (1200px+ width)

### Timing
✓ 5-7 seconds per slide (balanced)
✓ Enable auto-play for discoverability
✓ At least 3 images (5+ ideal)

---

## ⚠️ Common Issues

### **Issue: Images not showing**
```
Solution:
1. Check Media Library - images uploaded?
2. Verify Display Order is set (1, 2, 3...)
3. Publish content items (not draft)
4. Hard refresh browser (Ctrl+Shift+Delete)
```

### **Issue: Slideshow not auto-playing**
```
Solution:
1. Check "Auto-play on Load" is ✓ enabled
2. Verify interval > 0 (not 0 seconds)
3. Have at least 2 images
4. Check browser console for errors
```

### **Issue: Images look stretched**
```
Solution:
1. Upload 1200×600px images
2. Keep aspect ratio consistent
3. Use image compression tool (TinyPNG)
```

---

## 🔄 Updating Content

### **To Change Timing**
1. Go: **Content** → **Hackathon slideshow**
2. Edit: Change "Slide Interval" (e.g., 3, 5, or 10)
3. Save and publish
4. Changes live immediately

### **To Add New Image**
1. Go: **Media** → Upload new image
2. Go: **Content** → **Hackathon slideshow images** → **Add**
3. Select image, set display order
4. Publish and save

### **To Remove Image**
1. Go: **Content** → **Hackathon slideshow images**
2. Find image in list
3. Click **Delete** button
4. Confirm deletion

### **To Reorder Images**
1. Go: **Content** → **Hackathon slideshow images**
2. Edit each image
3. Change "Display Order" (1, 2, 3...)
4. Save each one

---

## 📱 Mobile Testing

### **On Desktop**
- Resize browser to ~375px wide
- See mobile image if uploaded
- Controls should be compact

### **On Real Mobile**
1. On phone, visit: `http://your-site.com`
2. Scroll to Hackathon section
3. Verify:
   - Images display full width
   - Controls are touch-friendly
   - Text doesn't overlap carousel

---

## 🎨 Design Specifications

### **Panel Layout**
- Left: Blue panel with text (330px)
- Right: Carousel with images (flex-grow)
- Gap: 32px (md:48px)

### **Image Carousel**
- Desktop: 500-600px height
- Tablet: Maintains aspect ratio
- Mobile: Full width, centered
- Aspect ratio: 2:1 (1200×600px)

### **Controls**
- Arrows: Left/right navigation
- Dots: Visual indicators + direct navigation
- Play/Pause: Top-right corner
- All with hover effects

### **Colors**
- Panel background: Brand blue (#003366)
- Text: White
- Buttons: White with 20% opacity
- Hover: White with 30% opacity + blur effect

---

## ✅ Final Checklist

After completing setup:

1. **Settings Created**
   - [ ] Interval set (recommended: 5 seconds)
   - [ ] Auto-play enabled

2. **Images Uploaded**
   - [ ] At least 3 images in Media Library
   - [ ] Each 1200×600px minimum
   - [ ] Optimized (<300KB each)

3. **Content Items Created**
   - [ ] All images have slideshow entries
   - [ ] Display order set correctly (1, 2, 3...)
   - [ ] All published (not draft)

4. **Testing Complete**
   - [ ] Homepage shows slideshow
   - [ ] Auto-play works
   - [ ] Manual navigation works
   - [ ] Responsive on mobile
   - [ ] No console errors

5. **Go Live**
   - [ ] Content published
   - [ ] Team notified
   - [ ] Share with stakeholders

---

## 🆘 Need Help?

**Check:**
1. Browser console (F12 → Console) for errors
2. Media Library for uploaded images
3. Content list for published items
4. Settings are saved and published

**Contact dev team if:**
- Slideshow component not rendering
- Images won't upload
- Database connection issues
- Permission/auth problems
