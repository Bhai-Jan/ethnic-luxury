document.addEventListener('DOMContentLoaded', () => {
    let currentProducts = [];

    const translations = {
        en: {
            brand_slogan: "Wherever we go, tradition follows.",
            nav_home: "Home",
            nav_why_us: "Why Us",
            nav_shop: "Shop",
            nav_about: "About",
            nav_values: "Sustainability",
            nav_contact: "Contact",
            hero_title: "Rediscover Your Roots with Ethnic Luxury",
            hero_slogan: "Wherever we go, tradition follows.",
            hero_value: "We connect people in Sweden to the rich textile heritage of Asia and Africa. Discover authentic, handpicked traditional garments—saris, kaftans, dashikis and more—delivered to your door at fair prices with no unnecessary markups. Founded by a team with roots in Pakistan, Afghanistan, the Middle East and Africa, we offer more than clothes: representation, pride, and a piece of home. No premium prices. Just genuine, accessible garments to wear your culture with pride—every day or on special occasions.",
            hero_cta: "Explore the Collection",
            usp_title: "What Makes Us Different",
            usp_authentic_title: "Curated Authenticity",
            usp_authentic_desc: "Unlike generic marketplaces, every item is carefully chosen based on our deep roots in Pakistan, Afghanistan, the Middle East, and Africa. We ensure cultural integrity and relevance, offering products that celebrate heritage for everyone.",
            usp_accessible_title: "Accessible Authenticity",
            usp_accessible_desc: "We make traditional cultural fashion—often hard to find in Sweden—easy to access. Through direct dropshipping from trusted suppliers, we cut unnecessary costs for timeless styles at affordable prices, making cultural pride simple to express.",
            usp_unique_title: "Beyond Fast Fashion",
            usp_unique_desc: "Say goodbye to mass-produced trends. We blend tradition with modern style for durable garments that celebrate your heritage and last for years. Careful selection and on-demand production minimize waste while keeping prices fair.",
            products_title: "Our Collection",
            filter_all_types: "All Types",
            filter_all_regions: "All Regions",
            price_all: "All Prices",
            price_under500: "< 500 SEK",
            price_500_1000: "500-1000 SEK",
            no_results: "No products found matching your criteria.",
            add_to_cart: "Add to Cart",
            continue_shopping: "Continue Shopping",
            audience_title: "Our Community",
            audience_text1: "Ethnic Luxury is for women and men in Sweden with roots in Asia and Africa. Our goal is to make authentic cultural clothing that represents your background and identity easy to find.",
            audience_text2: "Founded by a team with roots in Pakistan, Afghanistan, the Middle East, and Africa, we understand the difficulty of finding traditional fashion in Scandinavia. That’s why we offer carefully selected collections for everyday life and celebrations.",
            audience_text3: "Ethnic Luxury is more than a store—we create a place for cultural pride and belonging.",
            celebrating_diversity: "Celebrating Diversity",
            values_title: "Why Choose Us?",
            value_quality: "Quality",
            value_quality_desc: "Premium fabrics and craftsmanship.",
            value_authenticity: "Authenticity",
            value_authenticity_desc: "Genuine cultural designs.",
            value_accessibility: "Accessibility",
            value_accessibility_desc: "Direct shipping to your door.",
            value_community: "Community",
            value_community_desc: "Join a family that values heritage.",
            sustain_title: "Conscious Fashion, Minimal Waste",
            sustain_text_1: "We are committed to smarter shopping. Our direct-to-consumer dropshipping model avoids large warehouses and overproduction.",
            sustain_text_2: "Every item ships only after your order, reducing textile waste and excess inventory. We focus on carefully selected collections of authentic African and Asian clothing for quality, cultural authenticity, and responsible consumption.",
            testimonials_title: "What Our Customers Say",
            testi_1: "\"Finally, I can find beautiful sarees in Stockholm without waiting months for shipping from home!\"",
            testi_2: "\"The quality of the kurta I bought was amazing. It feels so authentic and luxurious.\"",
            testi_3: "\"Love the customer club perks! Ethnic Luxury really understands what we need.\"",
            faq_title: "Frequently Asked Questions",
            faq_q1: "How long is shipping?",
            faq_a1: "Shipping typically takes 7-14 days as we source directly from our artisans to your door.",
            faq_q2: "What is your return policy?",
            faq_a2: "We offer a 30-day return policy for any unworn items in original packaging.",
            faq_q3: "How do I join the Customer Club?",
            faq_a3: "Simply sign up with your email below to get 10-15% off your first order!",
            cta_title: "Join the Ethnic Luxury Club",
            cta_text: "Unlock exclusive access to new arrivals of authentic African and Asian clothing, cultural style inspiration, and 15% off your first purchase.",
            btn_join: "Join Now",
            contact_title: "Contact Us",
            label_name: "Name",
            label_email: "Email",
            label_message: "Message",
            label_newsletter: "Sign up for our newsletter and get updates!",
            btn_send: "Send Message",
            follow_us: "Follow Us",
            rights_reserved: "All rights reserved."
        },
        sv: {
            brand_slogan: "Vart vi än går följer traditionen.",
            nav_home: "Hem",
            nav_why_us: "Varför Oss",
            nav_shop: "Butik",
            nav_about: "Om oss",
            nav_values: "Hållbarhet",
            nav_contact: "Kontakt",
            hero_title: "Återupptäck Dina Rötter med Ethnic Luxury",
            hero_slogan: "Vart vi än går följer traditionen.",
            hero_value: "Vi kopplar samman människor i Sverige med det rika textilarvet från Asien och Afrika. Upptäck autentiska, handplockade traditionella plagg – saris, kaftaner, dashikis och mer – levererade till din dörr till rättvisa priser utan onödiga pålägg. Grundat av ett team med rötter i Pakistan, Afghanistan, Mellanöstern och Afrika. Vi erbjuder mer än bara kläder: vi erbjuder representation, stolthet och en bit av hemmet. Inga premiumpriser. Bara äkta, tillgängliga plagg för att bära din kultur med stolthet – varje dag eller vid speciella tillfällen.",
            hero_cta: "Utforska Kollektionen",
            usp_title: "Vad Gör Oss Unika",
            usp_authentic_title: "Utvald Autenticitet",
            usp_authentic_desc: "Till skillnad från generiska marknadsplatser väljs varje plagg noggrant ut baserat på våra djupa rötter i Pakistan, Afghanistan, Mellanöstern och Afrika. Vi garanterar kulturell integritet och relevans och erbjuder produkter som hyllar arvet för alla.",
            usp_accessible_title: "Tillgänglig Autenticitet",
            usp_accessible_desc: "Vi gör det lättare att hitta traditionellt kulturellt mode – ofta svårt att hitta i Sverige – lätt att få tillgång till. Genom direkt dropshipping från pålitliga leverantörer minskar vi onödiga kostnader för tidlösa stilar till överkomliga priser, vilket gör kulturell stolthet enkel att uttrycka.",
            usp_unique_title: "Bortom Fast Fashion",
            usp_unique_desc: "Säg adjö till massproducerade trender. Vi blandar tradition med modern stil för hållbara plagg som firar ditt arv och håller i åratal. Noggrant urval och on-demand-produktion minimerar avfall samtidigt som priserna hålls rättvisa.",
            products_title: "Vår Kollektion",
            filter_all_types: "Alla Typer",
            filter_all_regions: "Alla Regioner",
            price_all: "Alla Priser",
            price_under500: "< 500 SEK",
            price_500_1000: "500-1000 SEK",
            no_results: "Inga produkter hittades med dina kriterier.",
            add_to_cart: "Lägg i varukorg",
            continue_shopping: "Fortsätt Handla",
            audience_title: "Vår Gemenskap",
            audience_text1: "Ethnic Luxury är för kvinnor och män i Sverige med rötter i Asien och Afrika. Vårt mål är att göra autentiska kulturella kläder som representerar din bakgrund och identitet lätta att hitta.",
            audience_text2: "Grundat av ett team med rötter i Pakistan, Afghanistan, Mellanöstern och Afrika, förstår vi svårigheten att hitta traditionellt mode i Skandinavien. Det är därför vi erbjuder noggrant utvalda kollektioner för vardag och firande.",
            audience_text3: "Ethnic Luxury är mer än en butik – vi skapar en plats för kulturell stolthet och tillhörighet.",
            celebrating_diversity: "Firar Mångfald",
            values_title: "Varför Välja Oss?",
            value_quality: "Kvalitet",
            value_quality_desc: "Premiumtyger och hantverk.",
            value_authenticity: "Autenticitet",
            value_authenticity_desc: "Äkta kulturell design.",
            value_accessibility: "Tillgänglighet",
            value_accessibility_desc: "Direktleverans till din dörr.",
            value_community: "Gemenskap",
            value_community_desc: "Gå med i en familj som värdesätter arv.",
            sustain_title: "Medvetet Mode, Minimalt Avfall",
            sustain_text_1: "Vi är engagerade i smartare shopping. Vår direkt-till-konsument dropshipping-modell undviker stora lager och onödig överproduktion.",
            sustain_text_2: "Varje vara skickas först efter din beställning, vilket minskar textilavfall och överskottslager. Vi fokuserar på noggrant utvalda kollektioner av autentiska afrikanska och asiatiska kläder for kvalitet, kulturell autenticitet och ansvarsfull konsumtion.",
            testimonials_title: "Vad Våra Kunder Säger",
            testi_1: "\"Äntligen kan jag hitta vackra sarees i Stockholm utan att vänta månader på leverans hemifrån!\"",
            testi_2: "\"Kvaliteten på kurtan jag köpte var fantastisk. Det känns så autentiskt och lyxigt.\"",
            testi_3: "\"Älskar förmånerna i kundklubben! Ethnic Luxury förstår verkligen vad vi behöver.\"",
            faq_title: "Vanliga Frågor",
            faq_q1: "Hur lång är leveranstiden?",
            faq_a1: "Leverans tar vanligtvis 7-14 dagar då vi skickar direkt från våra hantverkare till din dörr.",
            faq_q2: "Vad är er returpolicy?",
            faq_a2: "Vi erbjuder 30 dagars returrätt för oanvända varor i originalförpackning.",
            faq_q3: "Hur går jag med i Kundklubben?",
            faq_a3: "Registrera dig enkelt med din e-post nedan för att få 10-15% rabatt på din första beställning!",
            cta_title: "Gå med i Ethnic Luxury-klubben",
            cta_text: "Lås upp exklusiv tillgång till nyheter av autentiska afrikanska och asiatiska kläder, kulturell stilinspiration och 15% rabatt på ditt första köp.",
            btn_join: "Gå Med Nu",
            contact_title: "Kontakta Oss",
            label_name: "Namn",
            label_email: "E-post",
            label_message: "Meddelande",
            label_newsletter: "Registrera dig för nyhetsbrev och uppdateringar!",
            btn_send: "Skicka Meddelande",
            follow_us: "Följ Oss",
            rights_reserved: "Alla rättigheter reserverade."
        }
    };

    let currentLang = 'en';

    // --- Selectors ---
    const productGrid = document.getElementById('productGrid');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const typeFilter = document.getElementById('typeFilter');
    const regionFilter = document.getElementById('regionFilter');
    const priceFilters = document.querySelectorAll('.filter-btn');
    const noResultsMsg = document.getElementById('noResults');
    const langToggle = document.getElementById('lang-toggle');
    const modal = document.getElementById('productModal');
    const closeModal = document.querySelector('.close-modal');

    // --- Init ---
    filterProducts();

    // --- Functions ---

    function renderProducts(items) {
        productGrid.innerHTML = '';
        
        if (items.length === 0) {
            noResultsMsg.style.display = 'block';
            return;
        } else {
            noResultsMsg.style.display = 'none';
        }

        items.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.onclick = () => openModal(product);
            card.setAttribute('role', 'listitem');
            card.innerHTML = `
                <div class="product-image-container">
                    <img src="${product.image_url}" alt="${product.name}" class="product-image">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="product-region">${product.region}</div>
                    <span class="price">${product.price} SEK</span>
                </div>
            `;
            productGrid.appendChild(card);
        });
    }

    async function filterProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedType = typeFilter.value;
        const selectedRegion = regionFilter.value;
        const selectedPrice = document.querySelector('.filter-btn.active').dataset.price;

        const params = new URLSearchParams();
        if (searchTerm) params.set('q', searchTerm);
        if (selectedType && selectedType !== 'all') params.set('type', selectedType);
        if (selectedRegion && selectedRegion !== 'all') params.set('region', selectedRegion);
        if (selectedPrice === 'under500') {
            params.set('maxPrice', '499');
        } else if (selectedPrice === '500to1000') {
            params.set('minPrice', '500');
            params.set('maxPrice', '1000');
        }
        const url = '/api/products' + (params.toString() ? `?${params.toString()}` : '');
        try {
            const resp = await fetch(url);
            currentProducts = await resp.json();
            renderProducts(currentProducts);
        } catch (e) {
            currentProducts = [];
            renderProducts(currentProducts);
        }
    }

    // --- Event Listeners ---

    // Search
    searchBtn.addEventListener('click', filterProducts);
    searchInput.addEventListener('keyup', filterProducts);

    // Filters
    typeFilter.addEventListener('change', filterProducts);
    regionFilter.addEventListener('change', filterProducts);

    // Price Filter Buttons
    priceFilters.forEach(btn => {
        btn.addEventListener('click', () => {
            priceFilters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterProducts();
        });
    });

    // Language Toggle
    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'sv' : 'en';
        langToggle.textContent = currentLang === 'en' ? 'SV' : 'EN';
        updateLanguage();
    });

    function updateLanguage() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[currentLang][key]) {
                // Check if element has child elements (like the sustainability section with markdown-like syntax)
                // For simplicity, we just replace text content here. 
                // For more complex HTML structures, we might need innerHTML, but textContent is safer.
                // Exception for bold tags in sustainability text
                if (key === 'sustain_text_1' || key === 'sustain_text_2') {
                     // Simple markdown parser for **bold**
                     el.innerHTML = translations[currentLang][key].replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                } else {
                    el.textContent = translations[currentLang][key];
                }
            }
        });
        
        // Update placeholders
        if(currentLang === 'sv') {
            searchInput.placeholder = "Sök kläder...";
        } else {
            searchInput.placeholder = "Search clothes...";
        }
    }

    // Modal Logic
    function openModal(product) {
        document.getElementById('modalImg').src = product.image_url;
        document.getElementById('modalTitle').textContent = product.name;
        document.getElementById('modalRegion').textContent = product.region;
        document.getElementById('modalDesc').textContent = product.description;
        document.getElementById('modalPrice').textContent = product.price + " SEK";
        modal.style.display = "block";
        // Focus management for accessibility
        closeModal.focus();
    }

    closeModal.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Expose filterByRegion to global scope for Featured section clicks
    window.filterByRegion = function(region) {
        regionFilter.value = region;
        filterProducts();
        document.getElementById('products').scrollIntoView({behavior: 'smooth'});
    }

    // Mobile Navigation (Existing)
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Accessibility
            const expanded = navToggle.getAttribute('aria-expanded') === 'true' || false;
            navToggle.setAttribute('aria-expanded', !expanded);
        });
    }

    // Smooth Scrolling (Existing)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });

    // Dynamic FAQs & Testimonials
    const faqAccordion = document.getElementById('faqAccordion');
    const testimonialsGrid = document.getElementById('testimonialsGrid');

    async function loadFaqs() {
        if (!faqAccordion) return;
        try {
            const resp = await fetch('/api/faqs');
            const items = await resp.json();
            faqAccordion.innerHTML = '';
            items.forEach(f => {
                const item = document.createElement('div');
                item.className = 'accordion-item';
                item.innerHTML = `
                    <button class="accordion-header" aria-expanded="false">${f.question}</button>
                    <div class="accordion-content"><p>${f.answer}</p></div>
                `;
                faqAccordion.appendChild(item);
            });
            attachAccordionHandlers();
        } catch {
            // fail silently
        }
    }

    function attachAccordionHandlers() {
        const headers = document.querySelectorAll('.accordion-header');
        headers.forEach(h => {
            h.addEventListener('click', function () {
                this.classList.toggle('active');
                const expanded = this.getAttribute('aria-expanded') === 'true' || false;
                this.setAttribute('aria-expanded', !expanded);
                const content = this.nextElementSibling;
                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                } else {
                    content.style.maxHeight = content.scrollHeight + "px";
                }
            });
        });
    }

    async function loadTestimonials() {
        if (!testimonialsGrid) return;
        try {
            const resp = await fetch('/api/testimonials');
            const items = await resp.json();
            testimonialsGrid.innerHTML = '';
            items.forEach(t => {
                const card = document.createElement('div');
                card.className = 'testimonial-card';
                card.innerHTML = `
                    <p class="quote">"${t.quote}"</p>
                    <div class="author">- ${t.cite}</div>
                `;
                testimonialsGrid.appendChild(card);
            });
        } catch {
            // fail silently
        }
    }

    // Back to Top (Existing)
    const backToTopBtn = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.style.display = 'flex';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Club signup
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());
            if (!valid) {
                alert(currentLang === 'en' ? 'Please enter a valid email.' : 'Ange en giltig e-post.');
                return;
            }
            try {
                const resp = await fetch('/api/members', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });
                if (resp.ok) {
                    alert(currentLang === 'en' ? 'Thank you for joining!' : 'Tack för att du gick med!');
                    newsletterForm.reset();
                } else {
                    const err = await resp.json().catch(() => ({}));
                    alert(err.error || (currentLang === 'en' ? 'Subscription failed.' : 'Prenumerationen misslyckades.'));
                }
            } catch {
                alert(currentLang === 'en' ? 'Network error.' : 'Nätverksfel.');
            }
        });
    }

    // Initialize with correct text (handles bolding)
    updateLanguage();
    loadFaqs();
    loadTestimonials();
});
