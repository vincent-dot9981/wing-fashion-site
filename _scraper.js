// Run this in the browser console to scrape ALL pages
// It navigates through pagination and collects all product codes
(async function() {
  const allProducts = {};
  let pageNum = 1;
  const MAX_PAGES = 117; // as seen in pagination
  
  while (pageNum <= MAX_PAGES) {
    // Wait for products to render
    await new Promise(r => setTimeout(r, 1500));
    
    // Extract products from current page
    const products = document.querySelectorAll('[class*="product-tile"]');
    products.forEach(p => {
      const link = p.getAttribute('href') || '';
      const code = link.replace('/bit/item/', '').replace('/sit/item/', '');
      if (!code) return;
      
      const text = p.textContent.replace(/\s+/g, ' ').trim();
      // Parse prices
      const priceMatch = text.match(/HK\$[\d,]+\.\d{2}/g);
      const salePrice = priceMatch && priceMatch.length > 0 ? priceMatch[0] : '';
      const origPrice = priceMatch && priceMatch.length > 1 ? priceMatch[1] : '';
      
      if (!allProducts[code]) {
        allProducts[code] = { code, salePrice, origPrice, page: pageNum };
      }
    });
    
    // Try to go to next page
    const pageBtns = document.querySelectorAll('.m-pagination-wrap .u-item');
    let nextBtn = null;
    pageBtns.forEach(btn => {
      if (btn.classList.contains('active')) {
        const currentText = btn.textContent.trim();
        // Find the next page button
        for (let i = 0; i < pageBtns.length; i++) {
          const btn2 = pageBtns[i];
          if (btn2.textContent.trim() === String(pageNum + 1) && !btn2.classList.contains('active')) {
            nextBtn = btn2;
          }
        }
        // Also check the "next" arrow button
        if (!nextBtn) {
          const nextArrow = document.querySelector('.u-item.u-arrow:not(.disabled) i.icon-b-PLP-nextPage');
          if (nextArrow) nextBtn = nextArrow.closest('.u-item');
        }
      }
    });
    
    if (nextBtn) {
      nextBtn.click();
      pageNum++;
      console.log(`Navigating to page ${pageNum}, collected ${Object.keys(allProducts).length} unique products`);
    } else {
      console.log(`No more pages. Last page: ${pageNum}, products: ${Object.keys(allProducts).length}`);
      break;
    }
  }
  
  return JSON.stringify({
    totalPages: pageNum,
    totalProducts: Object.keys(allProducts).length,
    products: Object.values(allProducts).slice(0, 100) // first 100 as sample
  });
})()
