/**
 * 阿 Wing 服裝站 - Main Application
 * Handles navigation, product rendering, filtering
 */

// ========== NAVIGATION ==========
function navigate(page) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    // Show target page
    const target = document.getElementById(`page-${page}`);
    if (target) target.classList.add('active');
    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.page === page);
    });
    // Close mobile menu
    closeMenu();
    // Scroll to top
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
        const brand = p.brand;
        const discount = p.discount_clean;
        const selling = p.selling;
        const imgSrc = p.image || '';
        const displayName = p.displayName || p.name;
        const originalName = p.originalName || p.name;
        const imgAlt = displayName || 'Product';

        return `
        <div class="product-card">
            <div class="card-image">
                ${imgSrc ? `<img src="${escHtml(imgSrc)}" alt="${escHtml(imgAlt)}" loading="lazy" onerror="this.parentElement.innerHTML='<div style=\\'display:flex;align-items:center;justify-content:center;height:100%;color:#ccc;font-size:24px\\'>W</div>'">` : '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#ccc;font-size:24px">W</div>'}
            </div>
            <div class="card-body">
                <div class="card-title">${escHtml(displayName)}</div>
                ${brand ? `<div class="card-subtitle">${escHtml(brand)}</div>` : `<div class="card-subtitle">${escHtml(originalName)}</div>`}
                ${selling ? `<div class="card-selling">${escHtml(selling)}</div>` : ''}
                ${discount ? `<div class="card-discount">${escHtml(discount)}</div>` : ''}
                <div class="card-meta">
                    <span class="card-tag">${genderLabel(p.gender)}</span>
                </div>
                <div class="card-actions">
                    <a href="${escHtml(p.affiliate_link)}" target="_blank" rel="noopener" class="buy-btn">
                        ${I18N.get('buy_now')}
                    </a>
                </div>
            </div>
        </div>`;
    }).join('');
}

function genderLabel(g) {
    const map = { 'men': 'Men', 'women': 'Women', 'kids': 'Kids', 'all': 'Unisex' };
    return map[g] || 'Unisex';
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
    const gender = document.getElementById('filterGender').value;
    const brand = document.getElementById('filterBrand').value;
    const occasion = document.getElementById('filterOccasion').value;
    const discount = document.getElementById('filterDiscount').value;

    const results = DATA.getFiltered({ search, gender, brand, occasion, discount });
    renderProducts(results);
}

function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('filterGender').value = 'all';
    document.getElementById('filterBrand').value = 'all';
    document.getElementById('filterOccasion').value = 'all';
    document.getElementById('filterDiscount').value = 'all';
    filterProducts();
}

// Initialize brand select
function populateBrandSelect() {
    const select = document.getElementById('filterBrand');
    const brands = DATA.getBrands();
    brands.forEach(b => {
        const opt = document.createElement('option');
        opt.value = b;
        opt.textContent = b;
        select.appendChild(opt);
    });
}

// ========== INIT ==========
async function init() {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = `<div class="loading-grid"><div class="spinner"></div></div>`;

    try {
        await DATA.load();
        populateBrandSelect();
        renderProducts(DATA.products);
        updateProductCount(DATA.products.length);
    } catch (err) {
        console.error('Init error:', err);
        grid.innerHTML = `<div class="no-results"><p>載入失敗: ${err.message}</p></div>`;
    }
}

function updateProductCount(count) {
    const el = document.getElementById('productCount');
    if (el) el.textContent = count;
}

// ========== START ==========
document.addEventListener('DOMContentLoaded', () => {
    init();
    I18N.apply();
});
