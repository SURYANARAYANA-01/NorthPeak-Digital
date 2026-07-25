/* ==========================================================
   NorthPeak Project Assistant
   Conversation Data
========================================================== */

const chatbotData = {

    start: {
        id: "start",
        message: "👋 Welcome to NorthPeak Digital!\n\nI'm here to understand your project and recommend the most suitable solution.\n\nWhat are you planning to build?",
        options: [
            {
                text: "🌐 Business Website",
                value: "Business Website",
                next: "businessType"
            },
            {
                text: "🛒 E-commerce Store",
                value: "E-commerce Store",
                next: "ecommerceType"
            },
            {
                text: "💻 Web Application",
                value: "Web Application",
                next: "webAppBuildType"
            },
            {
                text: "🎨 Portfolio",
                value: "Portfolio",
                next: "portfolioBuildType"
            },
            {
                text: "📄 Landing Page",
                value: "Landing Page",
                next: "landingBuildType"
            },
            {
                text: "📱 Other",
                value: "Other",
                next: "otherProject"
            }
        ]
    },

    /* ================================
       BUSINESS WEBSITE
    ================================= */

    businessType: {
        message: "Is this a new website or a redesign?",
        save: "Website Type",
        options: [
            { text: "New Website", value: "New Website", next: "businessPages" },
            { text: "Redesign", value: "Redesign", next: "businessPages" }
        ]
    },

    businessPages: {
        message: "Approximately how many pages do you need?",
        save: "Pages",
        options: [
            { text: "1–5 Pages", value: "1–5 Pages", next: "businessFeatures" },
            { text: "6–10 Pages", value: "6–10 Pages", next: "businessFeatures" },
            { text: "10+ Pages", value: "10+ Pages", next: "businessFeatures" }
        ]
    },

    businessFeatures: {
        message: "Which features are important to you? (Select all that apply)",
        save: "Main Features",
        multiSelect: true,
        next: "budget",
        options: [
            { text: "Contact Form", value: "Contact Form" },
            { text: "Blog", value: "Blog" },
            { text: "Booking System", value: "Booking System" },
            { text: "CMS", value: "CMS" },
            { text: "SEO Optimization", value: "SEO Optimization" }
        ]
    },

    /* ================================
       E-COMMERCE
    ================================= */

    ecommerceType: {
        message: "Is this a new store or a redesign?",
        save: "Website Type",
        options: [
            { text: "New Store", value: "New Store", next: "products" },
            { text: "Redesign", value: "Redesign", next: "products" }
        ]
    },

    products: {
        message: "How many products do you expect to sell?",
        save: "Products",
        options: [
            { text: "Under 50", value: "Under 50", next: "ecommerceFeatures" },
            { text: "50–500", value: "50–500", next: "ecommerceFeatures" },
            { text: "500+", value: "500+", next: "ecommerceFeatures" }
        ]
    },

    ecommerceFeatures: {
        message: "Which features are your highest priority? (Select all that apply)",
        save: "Main Features",
        multiSelect: true,
        next: "budget",
        options: [
            { text: "Secure Payments", value: "Secure Payments" },
            { text: "Inventory Management", value: "Inventory Management" },
            { text: "User Accounts", value: "User Accounts" },
            { text: "Product Reviews", value: "Product Reviews" },
            { text: "Discount Coupons", value: "Discount Coupons" }
        ]
    },

    /* ================================
       WEB APPLICATION
    ================================= */

    webAppBuildType: {
        message: "Is this a new web app or a redesign/rebuild of an existing app?",
        save: "Website Type",
        options: [
            { text: "New Web App", value: "New Web App", next: "webAppType" },
            { text: "Redesign / Rebuild", value: "Redesign / Rebuild", next: "webAppType" }
        ]
    },

    webAppType: {
        message: "What type of web application are you planning?",
        save: "Application Type",
        options: [
            { text: "Internal Tool", value: "Internal Tool", next: "webAppFeature" },
            { text: "Customer Portal", value: "Customer Portal", next: "webAppFeature" },
            { text: "Booking Platform", value: "Booking Platform", next: "webAppFeature" },
            { text: "SaaS Platform", value: "SaaS Platform", next: "webAppFeature" }
        ]
    },

    webAppFeature: {
        message: "Which features matter most? (Select all that apply)",
        save: "Main Features",
        multiSelect: true,
        next: "budget",
        options: [
            { text: "Authentication", value: "Authentication" },
            { text: "Dashboard", value: "Dashboard" },
            { text: "Payment Integration", value: "Payment Integration" },
            { text: "Reporting", value: "Reporting" }
        ]
    },

    /* ================================
       PORTFOLIO
    ================================= */

    portfolioBuildType: {
        message: "Is this a new portfolio or a redesign?",
        save: "Website Type",
        options: [
            { text: "New Portfolio", value: "New Portfolio", next: "portfolioType" },
            { text: "Redesign", value: "Redesign", next: "portfolioType" }
        ]
    },

    portfolioType: {
        message: "Who is this portfolio for?",
        save: "Portfolio Type",
        options: [
            { text: "Personal", value: "Personal", next: "portfolioGoal" },
            { text: "Freelancer", value: "Freelancer", next: "portfolioGoal" },
            { text: "Agency", value: "Agency", next: "portfolioGoal" }
        ]
    },

    portfolioGoal: {
        message: "What's your primary goal?",
        save: "Goal",
        options: [
            { text: "Showcase Work", value: "Showcase Work", next: "budget" },
            { text: "Generate Leads", value: "Generate Leads", next: "budget" },
            { text: "Personal Branding", value: "Personal Branding", next: "budget" }
        ]
    },

    /* ================================
       LANDING PAGE
    ================================= */

    landingBuildType: {
        message: "Is this a new landing page or a redesign?",
        save: "Website Type",
        options: [
            { text: "New Landing Page", value: "New Landing Page", next: "landingType" },
            { text: "Redesign", value: "Redesign", next: "landingType" }
        ]
    },

    landingType: {
        message: "What's the purpose of the landing page?",
        save: "Purpose",
        options: [
            { text: "Product Launch", value: "Product Launch", next: "budget" },
            { text: "Lead Generation", value: "Lead Generation", next: "budget" },
            { text: "Marketing Campaign", value: "Marketing Campaign", next: "budget" },
            { text: "Event Promotion", value: "Event Promotion", next: "budget" }
        ]
    },

    /* ================================
       OTHER
    ================================= */

    otherProject: {
        message: "No problem! We work on many custom digital solutions.\n\nWe'll be happy to learn more about your project through the contact form.",
        next: "budget"
    },

    /* ================================
       BUDGET (Dynamic per currency)
    ================================= */

    budget: {
        message: "What's your estimated budget?",
        save: "Budget",
        options: {
            INR: [
                { text: "Under ₹15,000", value: "Under ₹15,000", next: "summary" },
                { text: "₹15,000 – ₹35,000", value: "₹15,000 – ₹35,000", next: "summary" },
                { text: "₹35,000 – ₹75,000", value: "₹35,000 – ₹75,000", next: "summary" },
                { text: "₹75,000+", value: "₹75,000+", next: "summary" },
                { text: "Not Sure Yet", value: "Not Sure Yet", next: "summary" }
            ],
            USD: [
                { text: "Under $200", value: "Under $200", next: "summary" },
                { text: "$200 – $500", value: "$200 – $500", next: "summary" },
                { text: "$500 – $1,000", value: "$500 – $1,000", next: "summary" },
                { text: "$1,000+", value: "$1,000+", next: "summary" },
                { text: "Not Sure Yet", value: "Not Sure Yet", next: "summary" }
            ]
        }
    },

    /* ================================
       SUMMARY
    ================================= */

    summary: {
        message:
            "Thank you for sharing your project details.\n\nI'll prepare a summary and guide you to our contact form so our team can provide a personalized proposal.",
        end: true
    }

};

if (typeof window !== 'undefined') {
    window.chatbotData = chatbotData;
}