try { require('puppeteer'); console.log('puppeteer ok'); } catch(e) { console.log('no puppeteer'); }
try { require('playwright'); console.log('playwright ok'); } catch(e) { console.log('no playwright'); }
try { require('puppeteer-core'); console.log('puppeteer-core ok'); } catch(e) { console.log('no puppeteer-core'); }
console.log('node:', process.version);
