#!/usr/bin/env python3
"""
PDP Health Check - 每60分鐘檢查產品頁面是否正常運作
"""
import json
import random
import re
import urllib.request
import urllib.error
import ssl

# 讀取 products.js
with open('/Users/win/.hermes/sitebuilder/js/products.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract all product codes - pattern is "code": "XXXXX"
codes = re.findall(r'"code"\s*:\s*"([^"]+)"', content)
print(f"Total product codes found: {len(codes)}")

# Also extract pdp_url for reference to know BIT vs SIT
# Find all code+url pairs
code_url_pairs = re.findall(r'"code"\s*:\s*"([^"]+)".*?"pdp_url"\s*:\s*"([^"]+)"', content, re.DOTALL)

# Create a map of code -> preferred URL (from the JSON, use the pdp_url from the same product block)
# Actually, let's just use the pattern: if pdp_url contains /bit/ use BIT, if /sit/ use SIT
code_to_url = {}
for code, url in code_url_pairs:
    if code not in code_to_url:
        code_to_url[code] = url

# Randomly select 3 codes
random.seed()  # Use actual randomness
selected = random.sample(codes, min(3, len(codes)))
print(f"\nSelected codes: {selected}")

def check_pdp(code, domain="bit"):
    """Check a PDP page and return (code, domain, title, ok)"""
    url = f"https://hk.iteshop.com/{domain}/item/{code}"
    req = urllib.request.Request(url, headers={
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    })
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    try:
        resp = urllib.request.urlopen(req, timeout=15, context=ctx)
        html = resp.read().decode('utf-8', errors='replace')
        title_match = re.search(r'<title>([^<]*)</title>', html)
        title = title_match.group(1).strip() if title_match else "NO_TITLE"
        
        # Check if it's a soft 404 (title is just "ITeSHOP Hong Kong")
        if title == "ITeSHOP Hong Kong":
            return (code, domain, title, False, "SOFT_404")
        
        # Normal - title contains product info
        return (code, domain, title, True, "OK")
    except urllib.error.HTTPError as e:
        return (code, domain, f"HTTP_{e.code}", False, f"HTTP_ERROR_{e.code}")
    except Exception as e:
        return (code, domain, str(e)[:80], False, "EXCEPTION")

results = []
for code in selected:
    # Determine which domain to try first based on the pdp_url in the JSON
    pref_url = code_to_url.get(code, "")
    if "/sit/" in pref_url:
        first_domain = "sit"
        second_domain = "bit"
    else:
        first_domain = "bit"
        second_domain = "sit"
    
    # Try primary domain
    code_res, domain, title, ok, status = check_pdp(code, first_domain)
    print(f"\nTrying {code} on {first_domain}... title='{title}' ok={ok} status={status}")
    
    if not ok and status == "SOFT_404":
        # Try fallback domain
        code_res2, domain2, title2, ok2, status2 = check_pdp(code, second_domain)
        print(f"  -> Fallback to {second_domain}... title='{title2}' ok={ok2} status={status2}")
        results.append((code, domain2, title2, ok2, status2))
    else:
        results.append((code, domain, title, ok, status))

print("\n" + "=" * 60)
print("PDP HEALTH CHECK RESULTS")
print("=" * 60)

ok_count = sum(1 for r in results if r[3])
failures = [r for r in results if not r[3]]

print(f"PDP [{ok_count}/{len(results)} OK]")
if failures:
    for code, domain, title, ok, status in failures:
        print(f"  FAIL: {code} on {domain} -> {status}: {title}")
else:
    print("  All PDPs healthy!")

print("=" * 60)
