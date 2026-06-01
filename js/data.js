/**
 * WING Fashion Hub - Data Loader
 * Loads product data from campaign_product_map.json or inline products.js
 * Each entry has a 'products' array with specific product PDP links.
 */

const DATA = {
    products: [],
    brands: new Set(),
    loaded: false,

    async load() {
        if (this.loaded) return;
        try {
            let raw;
            // Try fetching campaign_product_map.json first (primary source for daily updates)
            try {
                const resp = await fetch('./campaign_product_map.json');
                if (resp.ok) {
                    raw = await resp.json();
                    console.log('Loaded campaign_product_map.json (' + raw.length + ' entries)');
                } else {
                    throw new Error('HTTP error');
                }
            } catch (fetchErr) {
                // Fallback: use inline data from products.js
                if (window.__PRODUCT_DATA) {
                    raw = window.__PRODUCT_DATA;
                    console.log('Using inline product data (' + raw.length + ' entries)');
                } else {
                    throw fetchErr;
                }
            }

            this.products = raw.map(p => {
                const strippedName = this._stripEmoji(p.name || '');
                // Determine image: use original_image if available, else first image from images array
                const imgSrc = p.original_image || (p.images && p.images.length > 0 ? p.images[0] : '');
                return {
                    ...p,
                    name: strippedName,
                    // Clean up discount text
                    discount_clean: this._cleanDiscount(p.discount || ''),
                    // Extract brand from tags
                    brand: this._extractBrand(p.tags || []),
                    // Image URL: use original campaign image URL directly
                    image: imgSrc,
                    // Price display
                    price_display: p.price > 0 ? `HK$${p.price}` : null,
                    // Short selling point
                    selling: this._stripEmoji(p.selling_point || ''),
                    // User-friendly display name + original name for subtitle
                    displayName: this._generateDisplayName(strippedName, this._extractBrand(p.tags || []), p.tags || []),
                    originalName: strippedName,
                    // Preserve the products array (specific product PDP items) with affiliate tracking
                    products: (p.products || []).map(prod => ({
                        ...prod,
                        pdp_url: prod.pdp_url 
                            ? (prod.pdp_url.includes('?') 
                                ? prod.pdp_url + '&tscode=affhr_hk10071365' 
                                : prod.pdp_url + '?tscode=affhr_hk10071365')
                            : prod.pdp_url
                    }))
                };
            });

            // Collect all brands
            this.products.forEach(p => {
                if (p.brand) this.brands.add(p.brand);
            });
            this.loaded = true;
            return this.products;
        } catch (err) {
            console.error('Data load error:', err);
            // Fallback: show error in UI
            const grid = document.getElementById('productGrid');
            if (grid) {
                grid.innerHTML =
                    `<div class="no-results"><p>數據載入失敗: ${err.message}</p></div>`;
            }
            return [];
        }
    },

    _extractBrand(tags) {
        // Map of known brand tags to display names
        const brandMap = {
            'aape': 'AAPE',
            'acne': 'Acne Studios',
            'alexander_wang': 'Alexander Wang',
            'off_white': 'Off-White',
            'palm_angels': 'Palm Angels',
            'valentino': 'Valentino',
            'marine_serre': 'Marine Serre',
            'mm6': 'MM6',
            'salomon': 'Salomon',
            'timberland': 'Timberland',
            'beams': 'BEAMS',
            'crocs': 'Crocs'
        };
        for (const tag of tags) {
            if (brandMap[tag]) return brandMap[tag];
        }
        return '';
    },

    _cleanDiscount(d) {
        if (!d) return '';
        // Take the shortest/most meaningful part
        let parts = d.split(';').map(s => s.trim()).filter(s => s);
        if (parts.length === 0) return '';
        // Pick the shortest meaningful one
        parts.sort((a, b) => a.length - b.length);
        let best = parts[0];
        // Clean up excessive punctuation and emoji
        best = best.replace(/‼+/g, '').replace(/!{2,}/g, '').replace(/\s+/g, ' ').trim();
        // Remove emoji characters
        best = best.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{200D}\u{2934}\u{2935}\u{25AA}\u{25AB}\u{25FB}\u{25FC}\u{25FD}\u{25FE}\u{2B05}\u{2B06}\u{2B07}\u{2B1B}\u{2B1C}\u{2B50}\u{2B55}\u{3030}\u{303D}\u{3297}\u{3299}]/gu, '');
        if (best.length > 40) {
            // Try shorter alternatives
            for (const p of parts) {
                if (p.length < 30 && p.length > 3) {
                    best = p;
                    break;
                }
            }
            if (best.length > 40) best = best.substring(0, 40) + '...';
        }
        return best;
    },

    _stripEmoji(s) {
        if (!s) return '';
        return s.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{200D}\u{2934}\u{2935}\u{25AA}\u{25AB}\u{25FB}\u{25FC}\u{25FD}\u{25FE}\u{2B05}\u{2B06}\u{2B07}\u{2B1B}\u{2B1C}\u{2B50}\u{2B55}\u{3030}\u{303D}\u{3297}\u{3299}]/gu, '').trim();
    },

    /**
     * Generate a user-friendly display name from campaign code
     */
    _generateDisplayName(name, brand, tags) {
        // Remove brackets and clean
        const clean = name.replace(/^【\s*/, '').replace(/\s*】$/, '').trim();
        const upper = clean.toUpperCase();

        // Helper: case-insensitive check
        const has = (s) => upper.includes(s.toUpperCase());

        // ---- DETECT BRAND(S) IN THE NAME ----
        // Priority-ordered: the first match wins over brand from tags
        const nameBrandPatterns = [
            [/ALEXANDER\s+WANG/i, 'Alexander Wang'],
            [/ACNE\s*STUDIOS/i, 'Acne Studios'],
            [/PALM\s+ANGELS/i, 'Palm Angels'],
            [/MARINE\s+SERRE/i, 'Marine Serre'],
            [/OFF.WHITE/i, 'Off-White'],
            [/VALENTINO/i, 'Valentino'],
            [/SIMONE\s+ROCHA/i, 'Simone Rocha'],
            [/TIMBERLAND/i, 'Timberland'],
            [/BEAMS/i, 'BEAMS'],
            [/CROCS/i, 'Crocs'],
            [/SALOMON/i, 'Salomon'],
            [/MM6/i, 'MM6'],
            [/SOPH\.?/i, 'SOPH.'],
            [/TOTME/i, 'TOTME'],
            [/AAPE/i, 'AAPE'],
        ];

        let displayBrand = brand;
        // Only override brand from tags if we find a brand in the name
        // (name-level detection is more specific)
        if (!displayBrand) {
            for (const [pattern, display] of nameBrandPatterns) {
                if (pattern.test(clean)) {
                    displayBrand = display;
                    break;
                }
            }
        }

        // Also check for i.t / I.T specifically (careful: case matters for display)
        if (!displayBrand) {
            if (has('I.T') && !/i\.t/i.test(clean.replace(/I\.T/i, ''))) {
                // Check if it's truly I.T (uppercase) vs i.t (lowercase)
                if (/\bI\.T\b/.test(clean)) displayBrand = 'I.T';
                else if (/\bi\.t\b/.test(clean)) displayBrand = 'i.t';
            } else if (has('BIT') && !has('I.T') && !has('i.t')) {
                // BIT alone isn't really a brand in this context
            }
        }

        // ---- CLASSIFY AND GENERATE NAME ----

        // 1. Rainy day styling
        if (has('雨天')) {
            return '雨天造型穿搭特集';
        }

        // 2. ITeSHOP Outlet with 低至2折 (I.T / i.t version)
        if ((has('ITEShop') || has('ITeSHOP')) && has('OUTLET') && has('低至2折')) {
            const prefix = (has('I.T') && !/i\.t/i.test(clean.replace(/I\.T/i, '')) && /\bI\.T\b/.test(clean)) ? 'I.T' : 'i.t';
            return `${prefix} Outlet 低至2折`;
        }

        // 3. Outlet with 2折 (generic)
        if (has('OUTLET') && (has('低至2折') || has('2折'))) {
            const prefix = displayBrand || (has('I.T') ? 'I.T' : '');
            return prefix ? `${prefix} Outlet 低至2折` : 'Outlet 低至2折';
        }

        // 4. BIT / i.t outlet mega sale
        if (has('OUTLET MEGA SALE')) {
            if (has('BIT')) {
                return has('超荀') ? 'BIT Outlet 超荀特賣' : 'BIT Outlet 激安特賣';
            }
            if (has('i.t')) {
                return has('超荀') ? 'i.t Outlet 超荀特賣' : 'i.t Outlet 激安特賣';
            }
            if (displayBrand) {
                return has('超荀') ? `${displayBrand} Outlet 超荀特賣` : `${displayBrand} Outlet 激安特賣`;
            }
            return 'Outlet 激安特賣';
        }

        // 5. SS26 xxx 520 PROMOTION
        if (has('520') && has('PROMOTION')) {
            const prefix = displayBrand || (has('I.T') ? 'I.T' : has('i.t') ? 'i.t' : '');
            return prefix ? `${prefix} 520 限時優惠` : '520 限時優惠';
        }

        // 6. PRE & OPEN SALE / OPEN SALE
        if (has('PRE & OPEN') || has('PRE SALE') || (has('OPEN SALE') && !has('OUTLET'))) {
            const seasonText = has('SS26') ? '春夏' : '';
            if (displayBrand) {
                return seasonText ? `${displayBrand} ${seasonText}開季大減價` : `${displayBrand} 開季大減價`;
            }
            return seasonText ? `${seasonText}開季大減價` : '開季大減價';
        }

        // 7. MEMBER PROMOTION (SOPH.)
        if (has('MEMBER PROMOTION') || has('MEMBER')) {
            const prefix = displayBrand || '';
            return prefix ? `${prefix} 會員限定優惠` : '會員限定優惠';
        }

        // 8. LAUNCH / New Launch (collaborations)
        if (has('LAUNCH') || has('NEW LAUNCH')) {
            // Strip SS26 prefix for cleaner collab detection
            const cleanForCollab = clean.replace(/^SS26\s*/i, '').trim();
            // Check for collaboration (X)
            const collabMatch = cleanForCollab.match(/([\w\s.'&]+?)\s*[xX]\s*([\w\s.'&]+?)(?:\s+(?:SNEAKER\s+)?(?:LAUNCH|New\s+Launch))/i);
            if (collabMatch) {
                const b1 = collabMatch[1].trim();
                const b2 = collabMatch[2].trim();
                // If collab involves I.T/i.t (the store, not a real brand) AND we have
                // a specific brand tag, use the brand tag instead (e.g. I.T x MARINE SERRE → Marine Serre)
                const isStoreCollab = /^I\.T$/i.test(b1) || /^I\.T$/i.test(b2) || /^i\.t$/i.test(b1) || /^i\.t$/i.test(b2);
                if (isStoreCollab && displayBrand && displayBrand !== 'I.T' && displayBrand !== 'i.t') {
                    if (has('SNEAKER')) return `${displayBrand} 波鞋新品登場`;
                    return `${displayBrand} 新品登場`;
                }
                // Otherwise show the collaboration name
                return `${this._capBrand(b1)} x ${this._capBrand(b2)} 聯乘登場`;
            }
            // Single brand launch (no X in name)
            if (displayBrand) {
                if (has('SNEAKER')) return `${displayBrand} 波鞋新品登場`;
                return `${displayBrand} 新品登場`;
            }
            return '新品登場';
        }

        // 9. New Arrivals (style guides)
        if (has('NEW ARRIVALS')) {
            const descMatch = clean.match(/New Arrivals\s*[-–—]\s*(.+)/i);
            if (descMatch) {
                let desc = descMatch[1].trim();
                // Clean up seasonal prefixes
                desc = desc.replace(/^2026/, '').replace(/^26年\s*/, '').replace(/^春夏[,，]?\s*/, '').trim();
                return desc || '春夏新品推介';
            }
            return '春夏新品推介';
        }

        // 10. OOTD (Outfit of the Day)
        if (has('OOTD')) {
            const prefix = displayBrand || 'I.T';
            return `${prefix} 春夏穿搭推介`;
        }

        // 11. Mix & Match
        if (has('MIX & MATCH') || has('MIX AND MATCH')) {
            const monthMatch = clean.match(/(\d+)月/);
            const monthText = monthMatch ? `${monthMatch[1]}月` : '';
            return `BIT x SIT ${monthText}混搭造型`;
        }

        // 12. 專題推介 (featured recommendations)
        if (has('專題推介')) {
            const monthMatch = clean.match(/(\d+)月/);
            const monthText = monthMatch ? `${monthMatch[1]}月` : '';
            if (displayBrand) {
                return `${displayBrand} ${monthText}新品推介`;
            }
            return `${monthText}專題推介`;
        }

        // ---- FALLBACK: clean up the original name ----
        let fallback = clean
            .replace(/^SS26\s*/i, '')
            .replace(/[-–—]\s*BIT\s*\/?\s*HK\s*/gi, '')
            .replace(/[-–—]\s*SIT\s*/gi, '')
            .replace(/[-–—]\s*BIT\s*/gi, '')
            .replace(/\s*\/\s*HK\s*/gi, '')
            .replace(/\s*BIT\s+outlet\s+mega\s+sale\s*/gi, '')
            .trim();

        if (fallback && fallback !== clean && fallback.length > 3) {
            return fallback;
        }

        // Last resort: return cleaned name
        return clean;
    },

    /**
     * Capitalize a brand name nicely
     */
    _capBrand(name) {
        const known = {
            'AAPE': 'AAPE', 'ACNE': 'Acne', 'ALEXANDER': 'Alexander',
            'WANG': 'Wang', 'STUDIOS': 'Studios', 'PALM': 'Palm',
            'ANGELS': 'Angels', 'VALENTINO': 'Valentino', 'MARINE': 'Marine',
            'SERRE': 'Serre', 'OFF-WHITE': 'Off-White', 'MM6': 'MM6',
            'SALOMON': 'Salomon', 'TIMBERLAND': 'Timberland', 'BEAMS': 'BEAMS',
            'CROCS': 'Crocs', 'SIMONE': 'Simone', 'ROCHA': 'Rocha',
            'I.T': 'I.T',
        };
        const upper = name.toUpperCase().trim();
        if (known[upper]) return known[upper];
        // Split into words and capitalize each properly
        return name.split(/\s+/).map(w => {
            const wUpper = w.toUpperCase();
            if (known[wUpper]) return known[wUpper];
            if (w === wUpper && w.length > 1 && w.length <= 3) return w; // Acronyms (short, all-caps)
            if (w === wUpper && w.length > 1 && !/^[A-Z]{2,}$/.test(w)) return w; // Already mixed case
            // Title-case if all uppercase
            if (/^[A-Z]+$/.test(w)) return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
            return w;
        }).join(' ');
    },

    getFiltered({ search = '', gender = 'all', brand = 'all', occasion = 'all', discount = 'all' } = {}) {
        let results = [...this.products];

        // Search
        if (search.trim()) {
            const q = search.toLowerCase().trim();
            results = results.filter(p =>
                (p.name && p.name.toLowerCase().includes(q)) ||
                (p.displayName && p.displayName.toLowerCase().includes(q)) ||
                (p.brand && p.brand.toLowerCase().includes(q)) ||
                (p.selling && p.selling.toLowerCase().includes(q)) ||
                (p.tags && p.tags.some(t => t.toLowerCase().includes(q))) ||
                (p.discount_clean && p.discount_clean.toLowerCase().includes(q))
            );
        }

        // Gender
        if (gender !== 'all') {
            results = results.filter(p => p.gender === gender || p.gender === 'all');
        }

        // Brand
        if (brand !== 'all') {
            results = results.filter(p => p.brand === brand);
        }

        // Occasion
        if (occasion !== 'all') {
            results = results.filter(p => p.occasion && p.occasion.includes(occasion));
        }

        // Discount level
        if (discount !== 'all') {
            results = results.filter(p => {
                const d = p.discount_clean || '';
                if (discount === 'high') {
                    // "2折", "3折", "低至2折" → high discount (80%+ off)
                    return /[2-3]折/.test(d) || /低至/.test(d);
                } else if (discount === 'mid') {
                    // 4-6折
                    return /[4-6]折/.test(d) || /6折/.test(d);
                } else if (discount === 'low') {
                    // 7折 or 20% off etc
                    return /7折/.test(d) || /8折/.test(d) || /9折/.test(d) || /20%/.test(d) || /85折/.test(d) || d === '';
                }
                return true;
            });
        }

        return results;
    },

    getBrands() {
        return Array.from(this.brands).sort();
    }
};
