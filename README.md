# Hostino - Hosting Provider Demo Website

A professional, fully responsive hosting provider demo website built for demonstrating **Cryptomus Payment Gateway** integration in YouTube tutorials.

![Hostino](https://img.shields.io/badge/Hostino-Demo-blue) ![Status](https://img.shields.io/badge/Status-Ready-green) ![License](https://img.shields.io/badge/License-MIT-orange)

---

## 🌟 Features

### Design & UI
- ✨ **Modern, Professional Design** - Similar to Hostinger, GoDaddy, and Namecheap
- 🎨 **Blue & White Gradient Theme** - Tech-inspired color palette
- 📱 **Fully Responsive** - Works seamlessly on mobile, tablet, and desktop
- 🌊 **Smooth Animations** - Fade-in, hover effects, and glassmorphism
- ⚡ **Performance Optimized** - Fast loading with CDN resources

### Pages
1. **Home Page** (`index.html`)
   - Hero section with call-to-action
   - Features showcase
   - Domain search (mockup)
   - Customer testimonials
   - Why choose us section

2. **Pricing Page** (`pricing.html`)
   - 3 pricing tiers (Basic, Pro, Business)
   - Feature comparison table
   - FAQ section
   - Hover effects on cards

3. **Checkout Page** (`checkout.html`)
   - Customer information form
   - Order summary with dynamic plan selection
   - Cryptomus payment integration placeholder
   - Secure checkout indicators

4. **Thank You Page** (`thankyou.html`)
   - Success confirmation
   - Order details display
   - Confetti animation
   - Setup progress simulation

### Technology Stack
- **HTML5** - Semantic markup
- **CSS3** - Custom styles with animations
- **TailwindCSS** - Utility-first CSS framework (via CDN)
- **JavaScript (Vanilla)** - No frameworks, pure JS
- **Font Awesome** - Icons library
- **Inter Font** - Modern, professional typography

---

## 📁 Project Structure

```
Cryptomus_Test/
│
├── index.html              # Home page
├── pricing.html            # Pricing page
├── checkout.html           # Checkout page
├── thankyou.html           # Success/Thank you page
│
├── styles.css              # Main stylesheet
├── script.js               # Main JavaScript file
├── checkout.js             # Checkout page logic
├── thankyou.js             # Thank you page logic
│
├── README.md               # This file
└── INTEGRATION_GUIDE.md    # Cryptomus integration guide
```

---

## 🚀 Getting Started

### Option 1: Direct File Access
1. Download or clone this repository
2. Open `index.html` in your browser
3. Navigate through the website

### Option 2: Local Server (Recommended)
```bash
# Using Python
python -m http.server 8000

# Using Node.js (http-server)
npx http-server -p 8000

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

---

## 💳 Cryptomus Payment Integration

### Current Status
The checkout page includes a **placeholder** for Cryptomus integration. The commented section in `checkout.html` shows where the integration code will be placed.

### Integration Location
File: `checkout.html`  
Search for: `<!-- Cryptomus Integration Code Here -->`

### Quick Integration Steps
1. Sign up at [Cryptomus.com](https://cryptomus.com)
2. Get your Merchant ID and API Key
3. Add the Cryptomus SDK to `checkout.html`
4. Initialize the payment gateway
5. Handle payment callbacks
6. Redirect to `thankyou.html` on success

For detailed integration instructions, see [`INTEGRATION_GUIDE.md`](INTEGRATION_GUIDE.md)

---

## 🎨 Customization

### Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-blue: #007BFF;
    --primary-cyan: #00D4FF;
    --dark-gray: #1a1a1a;
    --light-gray: #F8F9FA;
}
```

### Pricing Plans
Modify the pricing in both:
- `pricing.html` - Visual display
- `checkout.js` - Plan details object

### Logo
Replace "Hostino" text in navigation with your logo image

### Content
All content is in HTML files and can be easily modified

---

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

---

## ✨ Key Features Implemented

### Navigation
- Sticky navigation with scroll effect
- Mobile hamburger menu
- Active link highlighting
- Smooth scroll to sections

### Animations
- Fade-in on scroll
- Hover effects on cards
- Floating elements
- Staggered card animations
- Success confetti animation

### Forms
- Real-time validation
- Error messages
- Loading states
- Auto-formatting

### Interactive Elements
- Domain search mockup
- Plan selection via URL parameters
- Dynamic order summary
- Copy order ID functionality

---

## 🎯 Use Cases

1. **YouTube Tutorials** - Demonstrate payment integration
2. **Portfolio Projects** - Showcase web development skills
3. **Learning Resource** - Study modern web design
4. **Template** - Base for real hosting websites
5. **Client Demos** - Present to potential clients

---

## 🐛 Known Limitations

1. **Static Only** - No backend functionality
2. **Mock Data** - Domain search and payment are simulated
3. **No Database** - Order data stored in sessionStorage
4. **No Real Payments** - Cryptomus integration is placeholder only

---

## 📝 TODO for Production

- [ ] Connect to real Cryptomus API
- [ ] Add backend server (Node.js/PHP)
- [ ] Implement database for orders
- [ ] Add email confirmation system
- [ ] Implement user authentication
- [ ] Add customer dashboard
- [ ] Set up SSL certificate
- [ ] Add analytics tracking
- [ ] Implement SEO optimization
- [ ] Add multi-language support

---

## 🤝 Contributing

This is a demo project for educational purposes. Feel free to:
- Fork the repository
- Make improvements
- Submit pull requests
- Share with others

---

## 📄 License

MIT License - Free to use for personal and commercial projects.

---

## 🔗 Resources

- [Cryptomus Documentation](https://doc.cryptomus.com/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Font Awesome Icons](https://fontawesome.com/icons)
- [Google Fonts](https://fonts.google.com/)

---

## 👨‍💻 Author

Created for Cryptomus integration demonstration.

---

## 📞 Support

For questions about Cryptomus integration:
- Visit [Cryptomus Support](https://cryptomus.com/support)
- Check [Documentation](https://doc.cryptomus.com/)
- Join their community

---

## ⭐ Acknowledgments

- Design inspired by Hostinger, GoDaddy, and Namecheap
- Icons by Font Awesome
- Typography by Google Fonts (Inter)
- Payment processing by Cryptomus

---

**Built with ❤️ for the developer community**


