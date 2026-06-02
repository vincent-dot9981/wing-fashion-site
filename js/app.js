/**
 * WING Fashion Hub - Main Application
 * H&M inspired: simplified cards, sidebar category filtering, campaign hero
 */

// ========== STATE ==========

// Sidebar-selected category
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

// ========== PRODUCT RENDERING ==========

/** Flatten campaign entries into standalone product items (deduped by code) */
function flattenProducts(campaignEntries) {
    const seen = new Set();
    const items = [];
    campaignEntries.forEach(entry => {
        (entry.products || []).forEach(prod => {
            const code = prod.code || '';
            if (code && seen.has(code)) return;
            if (code) seen.add(code);
            items.push({
                code: code,
                name: prod.name || 'Product',
                brand: prod.brand || '',
                price: prod.price || '',
                original_price: prod.original_price || '',
                pdp_url: prod.pdp_url || entry.affiliate_link || '',
                image: code ? 'images/products_sub/' + encodeURIComponent(code) + '.jpg' : '',
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
    const noResults = document.getElementById('noResults');

    if (products.length === 0) {
        grid.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }

    noResults.style.display = 'none';

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
    // Flatten all products
    let allFlat = flattenProducts(DATA.products);

    // Apply sidebar category filter
    if (selectedCategory === 'sale') {
        allFlat = allFlat.filter(p => p.original_price);
    } else if (selectedCategory !== 'all') {
        allFlat = allFlat.filter(p => p.category === selectedCategory);
    }

    if (selectedCategory === 'all') {
        // Shuffle all products randomly every refresh
        const shuffled = [...allFlat];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        allFlat = shuffled;
    }

    renderProducts(allFlat);
}

// ========== CATEGORY SIDEBAR ==========
function selectCategory(category) {
    selectedCategory = category;

    // Update sidebar active state
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.toggle('active', item.dataset.category === category);
    });

    filterProducts();
}

function populateSidebar() {
    const sidebar = document.getElementById('categorySidebar');

    let html = '<div class="category-sidebar-label" data-i18n="sidebar_categories">類別</div>';

    // "全部" (All) option
    html += '<button class="sidebar-item active" data-category="all" onclick="selectCategory(\'all\')">'
        + '全部</button>';

    // "減價產品" (Sale) option
    const saleCount = DATA.getSaleCount();
    if (saleCount > 0) {
        html += '<button class="sidebar-item" data-category="sale" onclick="selectCategory(\'sale\')">'
            + '減價產品</button>';
    }

    // Each actual category from data
    const categories = DATA.getCategories();
    categories.forEach(cat => {
        html += '<button class="sidebar-item" data-category="' + cat + '" onclick="selectCategory(\'' + cat + '\')">'
            + cat + '</button>';
    });

    sidebar.innerHTML = html;
}

// ========== INIT ==========
async function init() {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = `<div class="loading-grid"><div class="spinner"></div></div>`;

    try {
        await DATA.load();
        populateSidebar();
        // filterProducts will handle the initial render (flattened, limited to 20)
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
