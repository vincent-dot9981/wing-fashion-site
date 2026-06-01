/**
 * 阿 Wing 服裝站 - i18n / 中英雙語
 */

const I18N = {
    current: 'zh',
    strings: {
        zh: {
            nav_home: '首頁',
            nav_about: '關於我',
            hero_title: '阿 Wing 服裝站',
            hero_sub: '香港本地時尚達人 · ITeSell 服裝銷售顧問',
            hero_desc: '幫你搵最啱嘅衫，襯出最型嘅 look 💫',
            hero_cta: '即刻 WhatsApp 我搵靚衫',
            search_placeholder: '🔍 搜尋品牌、產品...',
            all_genders: '全部性別',
            gender_all: '所有性別',
            all_brands: '全部品牌',
            all_occasions: '全部場合',
            all_discounts: '全部折扣',
            reset: '重設',
            featured_title: '🔥 限時優惠精選',
            no_results: '😅 搵唔到相關產品，試下其他關鍵字啦！',
            buy_now: '🛒 立即購買',
            free: '免費',
            about_title: '關於阿 Wing',
            about_tagline: '你嘅私人時尚顧問 · ITeSell 香港 affiliate',
            about_who_title: '👋 我係阿 Wing',
            about_who_text1: '土生土長香港女仔，對時裝有著一份執著同熱愛。由細到大都鍾意襯衫、研究潮流，慢慢發現 — 著得靚唔係因為件衫貴，而係因為適合自己。',
            about_who_text2: '我係 ITeSell 平台嘅 affiliate（Staff ID: hk10071365），同 ITeSHOP 合作，幫大家搵到最抵嘅名牌服裝優惠。',
            about_offer_title: '🤝 我幫你做咩？',
            about_offer1: '✅ 幫你揀最啱你身形、風格嘅衫',
            about_offer2: '✅ 提供穿搭建議，由 head-to-toe 襯到最靚',
            about_offer3: '✅ 推介最新、最抵嘅名牌優惠',
            about_offer4: '✅ 全程透過 WhatsApp 溝通，真正個人化服務',
            about_brands_title: '🏷️ 我推介嘅品牌',
            about_brands_note: '仲有其他 brand 優惠，直接 WhatsApp 問我最快！',
            about_cta_title: '💬 直接搵我',
            about_cta_text: '唔使猶豫，有咩想問就 WhatsApp 我啦！',
            about_cta_btn: 'WhatsApp 阿 Wing',
            footer_brand: '阿 Wing 服裝站',
            footer_tag: '香港時尚顧問 · ITeSell affiliate (Staff ID: hk10071365)',
            footer_disclaimer: '* 使用 affiliate link 購物，我會獲得小額佣金，但唔會影響你嘅價格。多謝支持！'
        },
        en: {
            nav_home: 'Home',
            nav_about: 'About',
            hero_title: 'Wing\'s Fashion Hub',
            hero_sub: 'HK Fashion Enthusiast · ITeSell Style Consultant',
            hero_desc: 'Find your perfect look with curated fashion picks 💫',
            hero_cta: 'WhatsApp Me Now',
            search_placeholder: '🔍 Search brands, products...',
            all_genders: 'All Genders',
            gender_all: 'All',
            all_brands: 'All Brands',
            all_occasions: 'All Occasions',
            all_discounts: 'All Discounts',
            reset: 'Reset',
            featured_title: '🔥 Limited Time Deals',
            no_results: '😅 No products found. Try different keywords!',
            buy_now: '🛒 Shop Now',
            free: 'Free',
            about_title: 'About Wing',
            about_tagline: 'Your Personal Style Consultant · ITeSell HK Affiliate',
            about_who_title: '👋 Hey, I\'m Wing',
            about_who_text1: 'Born and raised in Hong Kong, I have a deep passion for fashion. I\'ve always loved styling outfits and exploring trends. I\'ve learned that looking good isn\'t about expensive clothes — it\'s about what suits you.',
            about_who_text2: 'I\'m an affiliate of ITeSell (Staff ID: hk10071365), partnering with ITeSHOP to help you find the best designer fashion deals.',
            about_offer_title: '🤝 What I Do',
            about_offer1: '✅ Help you pick clothes that fit your body & style',
            about_offer2: '✅ Provide head-to-toe styling advice',
            about_offer3: '✅ Share the latest & best designer deals',
            about_offer4: '✅ 100% WhatsApp-based, truly personal service',
            about_brands_title: '🏷️ Brands I Recommend',
            about_brands_note: 'More brands available — just ask me on WhatsApp!',
            about_cta_title: '💬 Get in Touch',
            about_cta_text: 'Don\'t hesitate, message me anytime on WhatsApp!',
            about_cta_btn: 'Chat with Wing',
            footer_brand: 'Wing\'s Fashion Hub',
            footer_tag: 'HK Fashion Consultant · ITeSell affiliate (Staff ID: hk10071365)',
            footer_disclaimer: '* Using my affiliate links helps support me with a small commission at no extra cost to you. Thanks for your support!'
        }
    },

    get(key) {
        return this.strings[this.current][key] || key;
    },

    toggle() {
        this.current = this.current === 'zh' ? 'en' : 'zh';
        this.apply();
        return this.current;
    },

    apply() {
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (this.strings[this.current][key]) {
                el.textContent = this.strings[this.current][key];
            }
        });
        // Update lang toggle button
        const btn = document.getElementById('langToggle');
        if (btn) btn.textContent = this.current === 'zh' ? 'EN' : '中';
        // Update placeholder
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.placeholder = this.get('search_placeholder');
        }
        // Update select option labels (they're fixed, but we can update default text)
        document.querySelectorAll('select option[data-i18n]').forEach(opt => {
            const key = opt.dataset.i18n;
            if (this.strings[this.current][key]) {
                opt.textContent = this.strings[this.current][key];
            }
        });
        // Update document lang
        document.documentElement.lang = this.current === 'zh' ? 'zh-HK' : 'en';
    }
};

function toggleLang() {
    I18N.toggle();
}
