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
| ⚡ **Performance** | **99 - 100** | **99-100** |
| ♿ **Accessibility** | **96** | **96** |
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

## 🛠️ Technical Decisions & AI Reflection

### Technical Choices (Performance & Accessibility)
* **Semantic HTML5 Architecture:** Utilized native landmarks (`<header>`, `<main>`, `<section>`, `<nav>`, `<footer>`) and strict heading hierarchy to build a accessible page structure for screen readers and search crawlers.
* **Vanilla JavaScript (Zero Heavy Frameworks):** Built interactive components (dark/light theme toggle, mobile navigation menu, interactive chatbot, and client-side form validation) purely with vanilla ES6+ JS to minimize main-thread work and eliminate bundle overhead.
* **Modern CSS3 Layout System:** Leveraged native CSS custom properties (variables), Flexbox, and CSS Grid to handle layout switching smoothly without external UI libraries.
* **Accessible Form Design:** Integrated explicit form labeling, visual error indicators, and live screen-reader feedback using `aria-describedby` and dynamic focus states.
* **Optimized Meta & Engine Infrastructure:** Configured canonical links (`<link rel="canonical">`), structured `robots.txt`, and asynchronous Google Font loading to maintain near-perfect Lighthouse scores (99 Performance / 96 Accessibility / 100 Best Practices / 100 SEO).

### AI Collaboration Reflection
> AI was used throughout development as a collaborative assistant to structure, refine, and test the platform. It helped establish standard semantic patterns, assist with cross-browser CSS variable architecture, construct the lightweight client-side chatbot logic, and write clear, maintainable project documentation. Additionally, AI was leveraged during the deployment phase to debug Git rebase workflows and optimize accessibility attributes.

## 📝 Task B Optimization Changelog

| What Was Changed | Technical Implementation | What It Bought Us (Impact / Gain) |
| :--- | :--- | :--- |
| **Switched to Vanilla JS** | Removed heavy JavaScript libraries/frameworks in favor of native ES6+ modules for mobile menu, theme toggle, and chatbot. | **Zero bundle overhead & faster execution:** Reduced main-thread blocking time, helping achieve a **99/100 Performance** score on Lighthouse. |
| **Semantic Landmarks & Heading Hierarchy** | Refactored layout to use native semantic elements (`<header>`, `<main>`, `<section>`, `<nav>`, `<footer>`) with sequential `<h1>`–`<h3>` tags. | **Enhanced Screen Reader Navigation:** Solved landmark audit flags and elevated Accessibility score to **96/100**. |
| **Dynamic Form Validation with ARIA Attributes** | Added `role="status"`, `aria-live="polite"`, and `aria-describedby` links to the contact form inputs and error messages. | **Accessible Error Feedback:** Screen readers now announce validation errors instantly without breaking user focus. |
| **CSS Variables & Native Layouts (Grid/Flexbox)** | Replaced external UI frameworks with native CSS custom properties for dark/light themes and pure CSS Grid/Flexbox for layout responsiveness. | **Minimal CSS Payload:** Decreased render-blocking stylesheet sizes and achieved near-instant First Contentful Paint (FCP). |
| **Canonical Link & Meta Tags** | Added `<link rel="canonical" href="https://northpeak-digital-zeta.vercel.app/">` and structured metadata in `<head>`. | **100/100 SEO Score:** Prevents duplicate content issues and signals clear indexing instructions to search crawlers. |
| **Optimized Font & Asset Loading** | Embedded Google Fonts (`Zilla Slab`, `Inter`, `JetBrains Mono`) with `display=swap` and preconnect hints. | **Eliminated Layout Shifts (CLS):** Prevents flash of unstyled text (FOUT) and stabilizes Largest Contentful Paint (LCP). |

## 📊 Task B Deliverables & Lighthouse Audit Results

* 🎬 **Loom / Video Walkthrough:** [Watch Video Walkthrough](https://drive.google.com/file/d/14ihB3wHDAWwvOXBGgEmpunZ5dE_SPOzk/view?usp=sharing)
* 🌐 **Live Website:** [https://northpeak-digital-zeta.vercel.app/](https://northpeak-digital-zeta.vercel.app/)

| Category | Mobile | Desktop |
| :--- | :---: | :---: |
| ⚡ **Performance** | **99** | **99** |
| ♿ **Accessibility** | **96** | **96** |
| 🛡️ **Best Practices** | **100** | **100** |
| 🔍 **SEO** | **100** | **100** |

<div align="center">
  <img src="./Screenshots/Lighthouse-%20Desktop.png" alt="Lighthouse Desktop Score" width="48%">
  <img src="./Screenshots/Lighthouse-%20Mobile.png" alt="Lighthouse Mobile Score" width="48%">
</div>