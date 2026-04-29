# Project Setup Guide

## ✅ Project Status

Your Real Estate Global website is fully set up and ready for development!

## 🚀 Quick Start

### Option 1: Using VS Code Terminal (Recommended)

1. **Open VS Code Terminal**:
   - Press `Ctrl + `` or go to Terminal > New Terminal

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Access the website**:
   - The dev server will open automatically at `http://localhost:3000`
   - If not, manually navigate to the URL shown in the terminal

### Option 2: Using Command Prompt/PowerShell

1. **Open Command Prompt** (not PowerShell)
2. **Navigate to project**:
   ```bash
   cd "c:\Users\bolli\OneDrive\Desktop\New website"
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

## 📋 Available Commands

```bash
# Start development server with hot-reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint
npm run lint
```

## 🛠️ Development Workflow

1. **Edit files** in the `src/` folder
2. **Changes auto-refresh** in the browser (HMR - Hot Module Replacement)
3. **Check console** for any errors
4. **Test all pages** via navigation

## 📝 Project Structure

```
src/
├── pages/          # Page components
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   └── About.tsx
├── components/     # Reusable components
│   ├── Navbar.tsx
│   ├── Carousel.tsx
│   ├── VentureDetails.tsx
│   └── Footer.tsx
├── styles/         # CSS files
│   └── *.css
├── App.tsx         # Main App component
└── main.tsx        # Entry point
```

## 🎨 Key Features

### Pages
- **Home**: Featured properties carousel and venture showcase
- **Login**: User authentication form
- **Register**: New user registration
- **About Us**: Company information and contact details

### Components
- **Navbar**: Responsive navigation with user session management
- **Carousel**: Auto-scrolling with 3 featured property slides
- **VentureDetails**: Grid of 6 featured properties
- **Footer**: Quick links and contact information

## 🔧 Customization Tips

### Add New Property
Edit `src/components/VentureDetails.tsx`:
```tsx
const ventures = [
  {
    id: 7,
    name: 'Your Property Name',
    location: 'City, State',
    price: '$Price Range',
    // ... other fields
  },
]
```

### Change Colors
Edit `src/styles/index.css` CSS variables:
```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --accent-color: #f5576c;
}
```

### Add New Route
Edit `src/App.tsx`:
```tsx
<Route path="/your-page" element={<YourComponent />} />
```

## 🐛 Troubleshooting

### "npm command not found"
- **Solution**: Use the full path or add Node.js to PATH
- Or use: `"C:\Program Files\nodejs\npm.cmd" run dev`

### Port 3000 already in use
- **Solution**: Change port in `vite.config.ts`
```ts
server: {
  port: 3001, // Change this
}
```

### Blank page in browser
- **Solution**: Check browser console (F12) for errors
- Clear cache and refresh (Ctrl + Shift + Delete)

### CSS not loading
- **Solution**: Restart dev server
- Clear node_modules cache: `npm cache clean --force`

## 📦 Build for Production

1. **Build**:
   ```bash
   npm run build
   ```

2. **Output files** are in `dist/` folder

3. **Deploy** the `dist/` folder to your hosting

## 🌐 Deployment Options

- **Vercel**: Zero-config deployment
- **Netlify**: Drag-and-drop deployment
- **GitHub Pages**: Static hosting
- **AWS S3**: Cloud storage deployment

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [React Router Documentation](https://reactrouter.com)

## ✨ Next Steps

1. Start the development server
2. Explore all pages (Home, Login, Register, About)
3. Customize colors and content to match your brand
4. Add your own property listings
5. Deploy to your hosting platform

---

**Need help?** Check the README.md for more information or the individual component files for code documentation.
