/**
 * WING Fashion Hub - Main Application
 * H&M inspired: simplified cards, filter drawer, campaign hero
 */

// ========== STATE ==========
const FILTER_STATE = {
    search: '',
    gender: 'all',
    brand: 'all',
    occasion: 'all',
    discount: 'all'
};

// ========== NAVIGATION ==========
function navigate(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(`page-${page}`);
    if (target) target.classList.add('active');
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.page === page);
    });
    closeMenu();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleMenu() {
    const links = document.getElementById('navLinks');
    const btn = document.getElementById('menuToggle');
    links.classList.toggle('open');
    btn.classList.toggle('active');
}

function closeMenu() {
    const links = document.getElementById('navLinks');
    const btn = document.getElementById('menuToggle');
    links.classList.remove('open');
    btn.classList.remove('active');
}

// ========== FILTER DRAWER ==========
function toggleFilterDrawer() {
    const drawer = document.getElementById('filterDrawer');
    const overlay = document.getElementById('filterOverlay');
    drawer.classList.toggle('open');
    overlay.classList.toggle('open');
    document.body.style.overflow = drawer.classList.contains('open') ? 'hidden' : '';
}

function closeFilterDrawer() {
    const drawer = document.getElementById('filterDrawer');
    const overlay = document.getElementById('filterOverlay');
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
}

function setFilter(type, value) {
    FILTER_STATE[type] = value;

    // Update UI: highlight active option
    const sectionId = type === 'gender' ? 'filterSectionGender' :
                      type === 'brand' ? 'filterSectionBrand' :
                      type === 'occasion' ? 'filterSectionOccasion' :
                      type === 'discount' ? 'filterSectionDiscount' : null;
    if (sectionId) {
        const section = document.getElementById(sectionId);
        section.querySelectorAll('.filter-option').forEach(opt => {
            opt.classList.toggle('active', opt.dataset.value === value);
        });
    }

    // Update search input
    if (type === 'search') {
        document.getElementById('searchInput').value = value;
    }

    filterProducts();
}

function setFilterFromDrawer(type, value) {
    setFilter(type, value);
}

// ========== PRODUCT RENDERING ==========
function renderProducts(products) {
    const grid = document.getElementById('productGrid');
    const countEl = document.getElementById('productCount');
    const noResults = document.getElementById('noResults');

    if (products.length === 0) {
        grid.innerHTML = '';
        noResults.style.display = 'block';
        countEl.textContent = '0';
        return;
    }

    noResults.style.display = 'none';
    countEl.textContent = products.length;

    grid.innerHTML = products.map(p => {
        const imgSrc = p.image || '';
        const displayName = p.displayName || p.name;
        const originalName = p.originalName || p.name;
        const imgAlt = displayName || 'Fashion';
        const discount = p.discount_clean;
        const priceText = p.price_display || '';

        // Determine the primary link: first product's PDP URL, or fallback to affiliate_link
        const productsArr = p.products || [];
        const primaryLink = (productsArr.length > 0 && productsArr[0].pdp_url)
            ? productsArr[0].pdp_url
            : p.affiliate_link;

        // Build product sub-items HTML
        let subItemsHtml = '';
        if (productsArr.length > 0) {
            subItemsHtml = `<div class="product-sub-items">` +
                productsArr.map((prod, idx) => {
                    const prodUrl = prod.pdp_url || primaryLink;
                    const prodName = prod.name || 'Product';
                    const prodBrand = prod.brand || '';
                    const prodPrice = prod.price || '';
                    return `<a href="${escHtml(prodUrl)}" target="_blank" rel="noopener" class="product-sub-item">
                        <div class="sub-item-info">
                            <div class="sub-item-name">${escHtml(prodName)}</div>
                            <div class="sub-item-brand">${escHtml(prodBrand)}</div>
                            <div class="sub-item-price">${escHtml(prodPrice)}</div>
                        </div>
                    </a>`;
                }).join('') +
                `</div>`;
        }

        return `
        <div class="product-card">
            <a href="${escHtml(primaryLink)}" target="_blank" rel="noopener" class="card-main-link">
                <div class="card-image">
                    ${imgSrc ? `<img src="${escHtml(imgSrc)}" alt="${escHtml(imgAlt)}" loading="lazy" onerror="this.style.display='none';this.parentElement.classList.add('card-image-placeholder')">` : '<div class="card-image-placeholder"></div>'}
                </div>
                <div class="card-body">
                    <div class="card-title">${escHtml(displayName)}</div>
                    ${originalName && originalName !== displayName ? `<div class="card-subtitle">${escHtml(originalName)}</div>` : ''}
                    ${discount ? `<div class="card-discount">${escHtml(discount)}</div>` : ''}
                    <div class="card-price">${priceText ? escHtml(priceText) : 'SHOP NOW'}</div>
                </div>
            </a>
            ${subItemsHtml}
        </div>`;
    }).join('');
}

function escHtml(s) {
    if (!s) return '';
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
}

// ========== FILTERING ==========
function filterProducts() {
    const search = document.getElementById('searchInput').value;
    FILTER_STATE.search = search || '';

    const results = DATA.getFiltered({
        search: FILTER_STATE.search,
        gender: FILTER_STATE.gender,
        brand: FILTER_STATE.brand,
        occasion: FILTER_STATE.occasion,
        discount: FILTER_STATE.discount
    });

    renderProducts(results);
    updateActiveTags();
}

function updateActiveTags() {
    const container = document.getElementById('filterActiveTags');
    const tags = [];

    if (FILTER_STATE.gender !== 'all') {
        const label = I18N.current === 'zh' ?
            (FILTER_STATE.gender === 'men' ? '男裝' : FILTER_STATE.gender === 'women' ? '女裝' : '童裝') :
            FILTER_STATE.gender;
        tags.push({ type: 'gender', label });
    }
    if (FILTER_STATE.brand !== 'all') {
        tags.push({ type: 'brand', label: FILTER_STATE.brand });
    }
    if (FILTER_STATE.occasion !== 'all') {
        const occasionLabel = FILTER_STATE.occasion;
        tags.push({ type: 'occasion', label: occasionLabel });
    }
    if (FILTER_STATE.discount !== 'all') {
        const discountLabels = { 'high': '低至2折', 'mid': '3-6折', 'low': '7折以上' };
        const enDiscountLabels = { 'high': 'Up to 80%', 'mid': '40-70%', 'low': '30%+' };
        const dLabel = I18N.current === 'zh' ? discountLabels[FILTER_STATE.discount] : enDiscountLabels[FILTER_STATE.discount];
        tags.push({ type: 'discount', label: dLabel || FILTER_STATE.discount });
    }
    if (FILTER_STATE.search) {
        tags.push({ type: 'search', label: `"${FILTER_STATE.search}"` });
    }

    if (tags.length === 0) {
        container.innerHTML = '';
        return;
    }

    container.innerHTML = tags.map(t => `
        <span class="filter-tag" onclick="clearFilterTag('${t.type}')">${escHtml(t.label)}</span>
    `).join('');
}

function clearFilterTag(type) {
    if (type === 'gender') {
        FILTER_STATE.gender = 'all';
        document.querySelectorAll('#filterSectionGender .filter-option').forEach(opt => {
            opt.classList.toggle('active', opt.dataset.value === 'all');
        });
    } else if (type === 'brand') {
        FILTER_STATE.brand = 'all';
        document.querySelectorAll('#filterSectionBrand .filter-option').forEach(opt => {
            opt.classList.toggle('active', opt.dataset.value === 'all');
        });
    } else if (type === 'occasion') {
        FILTER_STATE.occasion = 'all';
        document.querySelectorAll('#filterSectionOccasion .filter-option').forEach(opt => {
            opt.classList.toggle('active', opt.dataset.value === 'all');
        });
    } else if (type === 'discount') {
        FILTER_STATE.discount = 'all';
        document.querySelectorAll('#filterSectionDiscount .filter-option').forEach(opt => {
            opt.classList.toggle('active', opt.dataset.value === 'all');
        });
    } else if (type === 'search') {
        FILTER_STATE.search = '';
        document.getElementById('searchInput').value = '';
    }
    filterProducts();
}

function resetFilters() {
    FILTER_STATE.search = '';
    FILTER_STATE.gender = 'all';
    FILTER_STATE.brand = 'all';
    FILTER_STATE.occasion = 'all';
    FILTER_STATE.discount = 'all';

    document.getElementById('searchInput').value = '';

    // Reset all filter options to active (all)
    document.querySelectorAll('[id^="filterSection"]').forEach(section => {
        section.querySelectorAll('.filter-option').forEach(opt => {
            opt.classList.toggle('active', opt.dataset.value === 'all');
        });
    });

    filterProducts();
}

// Initialize brand options in drawer
function populateBrandOptions() {
    const container = document.getElementById('brandOptionsContainer');
    const brands = DATA.getBrands();
    brands.forEach(b => {
        const btn = document.createElement('button');
        btn.className = 'filter-option';
        btn.dataset.value = b;
        btn.dataset.filter = 'brand';
        btn.innerHTML = `<span class="filter-option-indicator"></span><span>${escHtml(b)}</span>`;
        btn.onclick = function() { setFilter('brand', b); };
        container.appendChild(btn);
    });
}

// ========== HERO BANNER ==========
function setupCampaignHero() {
    // Use a campaign image as hero background
    const products = DATA.products;
    if (!products || products.length === 0) return;

    // Use campaign images from data (original_image URLs or images array)
    const campaignImages = products
        .map(p => p.image)
        .filter(img => img && img.length > 0);

    if (campaignImages.length > 0) {
        let heroImg = campaignImages[0];
        // Try to find an outlet/mega sale image as it's typically more hero-like
        const preferred = campaignImages.filter(img =>
            img.includes('OUTLET') || img.includes('MEGA') || img.includes('outlet'));
        if (preferred.length > 0) {
            heroImg = preferred[Math.floor(Math.random() * preferred.length)];
        } else {
            heroImg = campaignImages[Math.floor(Math.random() * campaignImages.length)];
        }

        const heroBg = document.getElementById('heroBg');
        if (heroBg) {
            heroBg.src = heroImg;
            heroBg.alt = 'Campaign';
        }
    }
}

// ========== INIT ==========
async function init() {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = `<div class="loading-grid"><div class="spinner"></div></div>`;

    try {
        await DATA.load();
        setupCampaignHero();
        populateBrandOptions();
        renderProducts(DATA.products);
        updateActiveTags();
    } catch (err) {
        console.error('Init error:', err);
        grid.innerHTML = `<div class="no-results"><p>載入失敗: ${err.message}</p></div>`;
    }
}

// ========== START ==========
document.addEventListener('DOMContentLoaded', () => {
    init();
    I18N.apply();
});
