import re

# Read SIT sale HTML to check for Nuxt data
with open('/tmp/sit_sale.html', 'r', errors='ignore') as f:
    html = f.read()

# Look for __NUXT__ or __INITIAL_STATE__
nuxt_match = re.search(r'window\.__NUXT__\s*=\s*({.*?});', html, re.DOTALL)
if nuxt_match:
    data = nuxt_match.group(1)[:2000]
    print("Found __NUXT__ data:", data[:500])
else:
    print("No __NUXT__ found")
    
# Check page title
title = re.search(r'<title>([^<]+)', html)
if title:
    print("Title:", title.group(1))

# Check for product count
results = re.search(r'([0-9,]+)\s*RESULTS', html)
if results:
    print("Results:", results.group(1))
