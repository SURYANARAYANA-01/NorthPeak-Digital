# 🏔️ NorthPeak Digital — Modern Studio Website

A fast, high-converting, and fully responsive website designed and developed for **NorthPeak Digital**, a web development studio. Built with clean semantic HTML5, modern CSS3 layout techniques, and lightweight vanilla JavaScript, delivering peak performance and accessibility across all screen sizes.

---

## 🚀 Key Features

* **⚡ Ultra-Fast Performance:** Achieves **100/100 across core Web Vitals & Lighthouse metrics** (Performance, Accessibility, Best Practices, SEO).
* **🎨 Modern UI & UX:** Features custom dark/light theme toggle, custom SVG vector graphics, fluid contour backgrounds, and sleek mockup components.
* **📱 Fully Responsive:** Fluid mobile-first layout utilizing CSS Grid and Flexbox for seamless cross-device compatibility.
* **♿ Accessibility First:** Uses strict semantic HTML heading hierarchy, high-contrast color palette, focus-visible outlines, and ARIA attributes for screen reader compatibility.
* **🤖 Integrated AI Chatbot:** Custom lightweight chatbot interface (`/Chatbot/`) to answer project inquiries and client questions dynamically.
* **📋 Validated Contact Form:** Interactive form featuring instant client-side validation and screen-reader accessible error reporting (`aria-describedby` / `role="status"`).

---

## 🛠️ Built With

* **HTML5:** Semantic structure, accessible landmarks, optimized meta tags.
* **CSS3:** Native custom properties (CSS variables), Grid, Flexbox, media queries, CSS keyframe animations.
* **JavaScript (ES6+):** Modular vanilla JS for interactive elements (theme switching, mobile menu drawer, form validation, and chatbot logic).
* **Typography:** Embedded via Google Fonts (`Zilla Slab`, `Inter`, `JetBrains Mono`).

---

## 📊 Lighthouse Audit Results

| Category | Mobile | Desktop |
| :--- | :---: | :---: |
| ⚡ **Performance** | **99 - 100** | **100** |
| ♿ **Accessibility** | **100** | **100** |
| 🛡️ **Best Practices** | **100** | **100** |
| 🔍 **SEO** | **100** | **100** |

---

## 📂 Project Structure

- index.html                  # Main semantic HTML structure
- northpeak-main.css          # Main site design system & layout styles
- northpeak-core.js           # Theme toggle, mobile menu, form validation logic
- robots.txt                  # Search engine crawler instructions
- LICENSE                     # MIT License file
- Chatbot/
  - northpeak-chatbot.css     # Chatbot UI styling & animations
  - northpeak-chatbot.js      # Interactive chatbot logic
  - northpeak-chatbot-data.js # Intent matching & chatbot knowledge base
- README.md                   # Project documentation

---

## ⚙️ Local Development Setup

To inspect or run this project locally:

1. **Clone the repository:**
   `git clone https://github.com/SURYANARAYANA-01/NorthPeak-Digital.git`
   `cd NorthPeak-Digital`

2. **Launch with a Local Server:**
   * **VS Code:** Install the **Live Server** extension, right-click `index.html`, and select **"Open with Live Server"** (default port `5500`).
   * **Python:** Run `python3 -m http.server 8000` in the project root directory and navigate to `http://localhost:8000`.

---

## 🌐 Deployment & Live Site

1. Replace the placeholder canonical link in `index.html` with your live domain:
   `<link rel="canonical" href="https://northpeak-digital-zeta.vercel.app/">`

2. Deploy the root files directly via **GitHub Pages**, **Vercel**, or **Netlify**.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

*Built for the Digital Heroes Training Task — [digitalheroesco.com](https://digitalheroesco.com)*
