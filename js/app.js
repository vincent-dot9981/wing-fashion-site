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
    category: 'all',
    discount: 'all'
};

// Sidebar-selected category (separate from draw filter)
let selectedCategory = 'all';

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
                      type === 'category' ? 'filterSectionCategory' :
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

/** Flatten campaign entries into standalone product items */
function flattenProducts(campaignEntries) {
    const items = [];
    campaignEntries.forEach(entry => {
        (entry.products || []).forEach(prod => {
            items.push({
                code: prod.code || '',
                name: prod.name || 'Product',
                brand: prod.brand || '',
                price: prod.price || '',
                original_price: prod.original_price || '',
                pdp_url: prod.pdp_url || entry.affiliate_link || '',
                image: prod.code ? 'images/products_sub/' + encodeURIComponent(prod.code) + '.jpg' : '',
                // Inherit category from parent campaign for filtering
                category: entry.category || '',
                occasion: entry.occasion || [],
                gender: entry.gender || 'all',
                tags: entry.tags || [],
                discount_clean: entry.discount_clean || ''
            });
        });
    });
    return items;
}

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

    grid.innerHTML = products.map(prod => {
        const imgSrc = prod.image || '';
        const prodUrl = prod.pdp_url || '';
        const prodName = prod.name || 'Product';
        const prodBrand = prod.brand || '';
        const prodPrice = prod.price || '';
        const origPrice = prod.original_price || '';

        let priceHtml;
        if (origPrice) {
            priceHtml = `<span class="original-price">${escHtml(origPrice)}</span><span class="sale-price">${escHtml(prodPrice)}</span>`;
        } else {
            priceHtml = `<span class="product-flat-price">${escHtml(prodPrice)}</span>`;
        }

        return `
        <div class="product-card product-card-flat">
            <a href="${escHtml(prodUrl)}" target="_blank" rel="noopener" class="product-flat-link">
                <div class="product-flat-image">
                    ${imgSrc ? `<img src="${escHtml(imgSrc)}" alt="${escHtml(prodName)}" loading="lazy" onerror="this.style.display='none';this.parentElement.classList.add('product-flat-placeholder')">` : '<div class="product-flat-placeholder"></div>'}
                </div>
                <div class="product-flat-body">
                    <div class="product-flat-name">${escHtml(prodName)}</div>
                    <div class="product-flat-brand">${escHtml(prodBrand)}</div>
                    ${priceHtml}
                </div>
            </a>
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

    let results = DATA.getFiltered({
        search: FILTER_STATE.search,
        gender: FILTER_STATE.gender,
        brand: FILTER_STATE.brand,
        occasion: FILTER_STATE.occasion,
        category: FILTER_STATE.category,
        discount: FILTER_STATE.discount
    });

    // Apply sidebar category filter (overrides drawer category)
    if (selectedCategory === 'sale') {
        results = results.filter(p => p.original_price);
    } else if (selectedCategory !== 'all') {
        results = results.filter(p => p.category === selectedCategory);
    }

    // Default 'all' view: show max 20 PRODUCTs (not campaigns)
    // We flatten first to count actual products
    const allFlat = flattenProducts(results);
    let displayFlat = allFlat;

    if (selectedCategory === 'all' && FILTER_STATE.category === 'all'
        && FILTER_STATE.gender === 'all' && FILTER_STATE.brand === 'all'
        && FILTER_STATE.occasion === 'all' && FILTER_STATE.discount === 'all'
        && !FILTER_STATE.search) {
        // Shuffle and take 20 individual products
        const shuffled = [...allFlat];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        displayFlat = shuffled.slice(0, 20);
    }

    renderProducts(displayFlat);
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
    if (FILTER_STATE.category !== 'all') {
        tags.push({ type: 'category', label: FILTER_STATE.category });
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
    } else if (type === 'category') {
        FILTER_STATE.category = 'all';
        document.querySelectorAll('#filterSectionCategory .filter-option').forEach(opt => {
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
    FILTER_STATE.category = 'all';
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

// Initialize category options in drawer
function populateCategoryOptions() {
    const container = document.getElementById('categoryOptionsContainer');
    const counts = DATA.getCategoryCounts();
    const categories = DATA.getCategories();
    categories.forEach(cat => {
        const count = counts[cat] || 0;
        const btn = document.createElement('button');
        btn.className = 'filter-option';
        btn.dataset.value = cat;
        btn.dataset.filter = 'category';
        btn.innerHTML = `<span class="filter-option-indicator"></span><span>${escHtml(cat)} (${count})</span>`;
        btn.onclick = function() { setFilter('category', cat); };
        container.appendChild(btn);
    });
}

// ========== CATEGORY SIDEBAR ==========
function selectCategory(category) {
    selectedCategory = category;

    // Update sidebar active state
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.toggle('active', item.dataset.category === category);
    });

    // Reset drawer category when switching to sale view
    if (category === 'sale') {
        FILTER_STATE.category = 'all';
        document.querySelectorAll('#filterSectionCategory .filter-option').forEach(opt => {
            opt.classList.toggle('active', opt.dataset.value === 'all');
        });
    }

    filterProducts();
}

function populateSidebar() {
    const sidebar = document.getElementById('categorySidebar');
    const counts = DATA.getCategoryCounts();
    const totalCount = DATA.products.length;
    const saleCount = DATA.getSaleCount();

    let html = '<div class="category-sidebar-label" data-i18n="sidebar_categories">類別</div>';

    // "全部" (All) option
    html += '<button class="sidebar-item active" data-category="all" onclick="selectCategory(\'all\')">'
        + '全部 <span class="sidebar-item-count">(' + totalCount + ')</span></button>';

    // "減價產品" (Sale) option
    if (saleCount > 0) {
        html += '<button class="sidebar-item" data-category="sale" onclick="selectCategory(\'sale\')">'
            + '減價產品 <span class="sidebar-item-count">(' + saleCount + ')</span></button>';
    }

    // Each actual category from data
    const categories = DATA.getCategories();
    categories.forEach(cat => {
        const count = counts[cat] || 0;
        html += '<button class="sidebar-item" data-category="' + cat + '" onclick="selectCategory(\'' + cat + '\')">'
            + cat + ' <span class="sidebar-item-count">(' + count + ')</span></button>';
    });

    sidebar.innerHTML = html;
}

// ========== INIT ==========
async function init() {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = `<div class="loading-grid"><div class="spinner"></div></div>`;

    try {
        await DATA.load();
        populateBrandOptions();
        populateCategoryOptions();
        populateSidebar();
        // filterProducts will handle the initial render (flattened, limited to 20)
        updateActiveTags();
        // Apply sidebar filtering (show 20 default)
        filterProducts();
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
