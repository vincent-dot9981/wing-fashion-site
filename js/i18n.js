/**
 * 尋寶圖_服裝部 — i18n / 中英雙語
 */

const I18N = {
    current: 'zh',
    strings: {
        zh: {
            nav_home: '首頁',
            nav_about: '關於我們',
            hero_title: '尋寶圖_服裝部',
            hero_sub: '點解你衣櫃永遠少左一件衫',
            hero_cta: 'WhatsApp我哋\n更多隱藏優惠',
            sidebar_categories: '類別',
            featured_title: '限時優惠精選',
            no_results: '找不到相關產品，請嘗試其他關鍵字',
            about_title: '關於尋寶圖_服裝部',
            about_tagline: '你嘅時尚顧問團隊',
            about_who_title: '我們的使命',
            about_who_text1: '幫你喺眾多名牌中，快速搵到最適合你身形、風格嘅服裝。唔需要自己逐個品牌慢慢睇，我哋幫你篩選好。',
            about_who_text2: '每日更新最新名牌優惠，獨家折扣連結直接落單，簡單快捷。',
            about_offer_title: '我們幫你做什麼？',
            about_offer1: '幫你挑選最適合你身形、風格的服裝',
            about_offer2: '提供穿搭建議，從頭到腳搭配到最好看',
            about_offer3: '推介最新、最划算的名牌優惠',
            about_offer4: '全程透過 WhatsApp 溝通，真正個人化服務',
            about_brands_title: '推薦品牌',
            about_brands_note: '仲有其他品牌優惠，直接 WhatsApp 問我哋最方便',
            about_cta_title: '直接搵我哋',
            about_cta_text: '有問題就 WhatsApp 問我哋',
            about_cta_btn: 'WhatsApp 查詢',
            footer_brand: '尋寶圖_服裝部',
            footer_tag: '',
            footer_disclaimer: '使用聯盟連結購物，我哋會獲得小額佣金，但不會影響你的價格。感謝支持！'
        },
        en: {
            nav_home: 'Home',
            nav_about: 'About Us',
            hero_title: 'Treasure Map_Fashion',
            hero_sub: 'Why is your wardrobe always missing that one piece',
            hero_cta: 'WhatsApp Us\nMore Hidden Deals',
            sidebar_categories: 'Categories',
            featured_title: 'Limited Time Offers',
            no_results: 'No products found. Try different keywords.',
            about_title: 'About Treasure Map_Fashion',
            about_tagline: 'Your Style Consultant Team',
            about_who_title: 'Our Mission',
            about_who_text1: 'We help you find the best-fitting, most stylish pieces across top designer brands — no need to browse every brand yourself. Let us curate for you.',
            about_who_text2: 'Daily updated designer deals, exclusive discount links, one-click ordering.',
            about_offer_title: 'What We Do',
            about_offer1: 'Help you pick clothes that fit your body & style',
            about_offer2: 'Provide head-to-toe styling advice',
            about_offer3: 'Share the latest & best designer deals',
            about_offer4: '100% WhatsApp-based, truly personal service',
            about_brands_title: 'Featured Brands',
            about_brands_note: 'More brands available — just ask us on WhatsApp',
            about_cta_title: 'Get in Touch',
            about_cta_text: "Got questions? Message us on WhatsApp",
            about_cta_btn: 'Chat with Us',
            footer_brand: "Treasure Map_Fashion",
            footer_tag: '',
            footer_disclaimer: "Using affiliate links helps support us with a small commission at no extra cost to you. Thanks for your support!"
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
        // Update select option labels (legacy support)
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
