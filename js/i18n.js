/**
 * WING Fashion Hub - i18n / 中英雙語
 */

const I18N = {
    current: 'zh',
    strings: {
        zh: {
            nav_home: '首頁',
            nav_about: '關於我',
            hero_title: 'WING',
            hero_sub: '你的時尚顧問',
            hero_cta: 'WhatsApp我\n更多隱藏優惠',
            sidebar_categories: '類別',
            featured_title: '限時優惠精選',
            no_results: '找不到相關產品，請嘗試其他關鍵字',
            about_title: '關於 Wing',
            about_tagline: '你的私人時尚顧問',
            about_who_title: '我是 Wing',
            about_who_text1: '土生土長香港女生，對時裝有著一份執著與熱愛。從小到大都喜歡襯衫、研究潮流，慢慢發現 — 穿得漂亮不是因為衣服貴，而是因為適合自己。',
            about_who_text2: '幫大家找到最划算的名牌服裝優惠，通過我的專屬連結下單即可。',
            about_offer_title: '我幫你做什麼？',
            about_offer1: '幫你挑選最適合你身形、風格的服裝',
            about_offer2: '提供穿搭建議，從頭到腳搭配到最好看',
            about_offer3: '推介最新、最划算的名牌優惠',
            about_offer4: '全程透過 WhatsApp 溝通，真正個人化服務',
            about_brands_title: '我推薦的品牌',
            about_brands_note: '還有其他品牌優惠，直接 WhatsApp 問我最方便',
            about_cta_title: '直接找我',
            about_cta_text: '有問題就 WhatsApp 問我',
            about_cta_btn: 'WhatsApp Wing',
            footer_brand: 'WING',
            footer_tag: '',
            footer_disclaimer: '使用聯盟連結購物，我會獲得小額佣金，但不會影響你的價格。感謝支持！'
        },
        en: {
            nav_home: 'Home',
            nav_about: 'About',
            hero_title: 'WING',
            hero_sub: 'Your Style Consultant',
            hero_cta: 'WhatsApp Me\nMore Hidden Deals',
            sidebar_categories: 'Categories',
            featured_title: 'Limited Time Offers',
            no_results: 'No products found. Try different keywords.',
            about_title: 'About Wing',
            about_tagline: 'Your Personal Style Consultant',
            about_who_title: "Hey, I'm Wing",
            about_who_text1: "Born and raised in Hong Kong, I have a deep passion for fashion. I've always loved styling outfits and exploring trends. I've learned that looking good isn't about expensive clothes — it's about what suits you.",
            about_who_text2: 'I help you find the best designer fashion deals through my exclusive links.',
            about_offer_title: 'What I Do',
            about_offer1: 'Help you pick clothes that fit your body & style',
            about_offer2: 'Provide head-to-toe styling advice',
            about_offer3: 'Share the latest & best designer deals',
            about_offer4: '100% WhatsApp-based, truly personal service',
            about_brands_title: 'Brands I Recommend',
            about_brands_note: 'More brands available — just ask me on WhatsApp',
            about_cta_title: 'Get in Touch',
            about_cta_text: "Don't hesitate, message me anytime on WhatsApp",
            about_cta_btn: 'Chat with Wing',
            footer_brand: "WING",
            footer_tag: '',
            footer_disclaimer: "Using affiliate links helps support me with a small commission at no extra cost to you. Thanks for your support!"
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
