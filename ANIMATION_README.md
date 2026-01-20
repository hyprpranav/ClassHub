# Light Pillar Animation - Removal Guide

## 🎨 About
The Light Pillar Animation is an **OPTIONAL** ethereal background effect that adapts to your theme:
- **Dark Theme:** Light purple/pink pillars (#5227FF to #FF9FFC)
- **Light Theme:** Dark navy pillars (#1a1a2e to #16213e)

## ✅ Features
- Theme-aware colors (automatically switches)
- WebGL-powered 3D animation
- Performance optimized (low/medium/high quality)
- Mobile-friendly with reduced quality on slow devices

## 🗑️ How to Remove Animation

If you find the animation distracting or performance-heavy, **follow these 3 simple steps:**

### Step 1: Delete Files
Delete these files:
```
js/lightpillar.js
ANIMATION_README.md (this file)
```

### Step 2: Remove from HTML
Open `index.html` and **delete these lines:**

**Line ~11** (Animation container):
```html
<!-- OPTIONAL: Light Pillar Animation Background (can be removed) -->
<div id="lightPillarContainer" class="light-pillar-bg"></div>
```

**Line ~203** (Three.js library):
```html
<!-- OPTIONAL: Three.js for Light Pillar Animation (can be removed with js/lightpillar.js) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
```

**Line ~220** (Animation script):
```html
<!-- OPTIONAL: Light Pillar Animation (Delete this line + js/lightpillar.js to remove animation) -->
<script src="js/lightpillar.js"></script>
```

### Step 3: Remove from CSS
Open `css/style.css` and **delete the section** marked:
```css
/* === OPTIONAL: LIGHT PILLAR ANIMATION BACKGROUND === */
/* This section can be deleted along with js/lightpillar.js to remove animation */
... (all the code until "END OPTIONAL ANIMATION STYLES")
/* === END OPTIONAL ANIMATION STYLES === */
```

**Lines to delete:** Approximately lines 75-112 in `style.css`

### Step 4: Clean Git (Optional)
```bash
git add .
git commit -m "Remove light pillar animation"
git push
```

---

## 🎮 Performance Settings

The animation automatically adjusts quality based on device:
- **Mobile devices:** Low quality (24 iterations)
- **Desktop:** Medium quality (40 iterations)
- **High-performance mode:** Available but disabled by default

### Manual Quality Adjustment
Edit `js/lightpillar.js` line ~9:
```javascript
quality: options.quality || 'medium'  // Change to 'low' or 'high'
```

---

## 🎨 Color Customization

To change animation colors, edit `js/lightpillar.js` around line ~220:

```javascript
const colors = isDarkTheme 
    ? { topColor: '#5227FF', bottomColor: '#FF9FFC' }  // Dark theme colors
    : { topColor: '#1a1a2e', bottomColor: '#16213e' }; // Light theme colors
```

---

## ⚠️ Troubleshooting

**Animation not showing?**
- Check browser console for errors (F12)
- Ensure WebGL is supported (most modern browsers)
- Try refreshing the page

**Performance issues?**
- Reduce quality to 'low'
- Disable on mobile devices
- Or simply remove it following the steps above

---

## 📝 Technical Details
- **Library:** Three.js r128
- **Rendering:** WebGL with custom shaders
- **Size:** ~15KB (lightpillar.js) + 580KB (Three.js CDN)
- **Browser Support:** Chrome 56+, Firefox 52+, Safari 11+, Edge 79+

---

**Remember:** This animation is purely cosmetic. Removing it **will not affect** any ClassHub functionality.
