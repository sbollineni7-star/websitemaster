# 🚀 Quick Reference Guide

## Start Development Server

```bash
npm run dev
```
Then open: `http://localhost:3000`

---

## Build for Production

```bash
npm run build
```

---

## Verify Build Works

```bash
npm run preview
```

---

## Update Dependencies

```bash
npm update
```

---

## Add New Package

```bash
npm install package-name
```

---

## Fix Security Vulnerabilities

```bash
npm audit fix
```

---

## Clear Cache

```bash
npm cache clean --force
```

---

## Project Layout

```
Home → Navbar, Carousel, Properties, Footer
Login → Authentication form
Register → User registration form
About → Company info + Contact
```

---

## Key Files to Modify

| What You Want | Edit This |
|---|---|
| Change colors | `src/styles/index.css` |
| Add properties | `src/components/VentureDetails.tsx` |
| Change company name | `src/components/Navbar.tsx` `src/components/Footer.tsx` |
| Add new page | Create in `src/pages/` + Add route in `src/App.tsx` |
| Change navbar links | `src/components/Navbar.tsx` |
| Update carousel slides | `src/components/Carousel.tsx` |
| Modify contact info | `src/pages/About.tsx` + `src/components/Footer.tsx` |

---

## Responsive Breakpoints

- Desktop: 1200px and above
- Tablet: 768px - 1199px
- Mobile: Below 768px

---

## Color Palette

```
Primary (Buttons):      #667eea
Secondary (Gradients):  #764ba2
Accent (Highlights):    #f5576c
Background:             #f8f9fa
Text:                   #333333
```

---

## Project Statistics

- Build size: 175.46 KB (56.38 KB gzipped)
- Build time: ~1.5 seconds
- Dependencies: 203 packages
- React version: 18.3.1
- TypeScript: ✅ Enabled
- Responsive: ✅ Mobile-ready

---

## Deployment Checklist

- [ ] Test all pages in browser
- [ ] Check mobile responsiveness
- [ ] Update company information
- [ ] Add your property listings
- [ ] Test form submissions
- [ ] Check all links work
- [ ] Review colors and branding
- [ ] Run `npm run build`
- [ ] Upload `dist/` to hosting

---

## Troubleshooting

**Dev server won't start?**
```bash
npm cache clean --force
npm install
npm run dev
```

**Changes not showing?**
- Hard refresh: Ctrl + Shift + Delete
- Or restart dev server

**Build fails?**
- Check console for errors
- Try: `npm install` then `npm run build`

---

## Hosting Options (Ranked)

1. **Vercel** - Best for React apps (connects to GitHub)
2. **Netlify** - Easy drag-and-drop deployment
3. **GitHub Pages** - Free, simple static hosting
4. **AWS S3 + CloudFront** - Scalable, professional

---

## Performance Tips

✅ Build minifies automatically
✅ CSS is optimized
✅ Code splitting enabled
✅ Images use gradients (no upload needed)
✅ Lazy loading configured

---

## Browser Support

- Chrome/Edge: Latest ✅
- Firefox: Latest ✅
- Safari: Latest ✅
- Mobile browsers: All modern ✅

---

## Need Help?

1. Check `README.md` for features
2. Read `SETUP_GUIDE.md` for setup issues
3. Review `PROJECT_SUMMARY.md` for overview
4. Check component comments in source code
5. Search React/Vite documentation

---

## VS Code Recommended Extensions

- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- TypeScript Vue Plugin
- ES7+ React/Redux/React-Native snippets

---

## Git Commands (Optional)

```bash
git init                           # Initialize repository
git add .                          # Add all files
git commit -m "Initial commit"     # Create commit
git remote add origin <URL>        # Connect to GitHub
git push -u origin main            # Push to GitHub
```

---

## Environmental Variables

Create `.env.local` for sensitive data:
```
VITE_APP_TITLE=Real Estate Global
VITE_APP_API_URL=https://api.example.com
```

Then access in code:
```tsx
import.meta.env.VITE_APP_TITLE
```

---

*Last Updated: April 28, 2026*
*Project: Real Estate Global Website*
