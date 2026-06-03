import re

with open('/tmp/bit_sale_p2.html', 'r', errors='ignore') as f:
    html = f.read()

# Look for any product links
matches = re.findall(r'/bit/item/([A-Z0-9]+)', html)
print(f'Found {len(matches)} product code references')
if matches:
    print('First 15:', matches[:15])
# Check if page=2 worked
title = re.search(r'<title>([^<]+)', html)
if title:
    print('Title:', title.group(1))
# Check total results
results = re.search(r'([0-9,]+)\s*RESULTS', html)
if results:
    print('Results:', results.group(1))
# Check for pagination
if 'page=' in html:
    print('page= parameter found in HTML')
# Check if we have the right page
actives = html.count('u-item active')
print(f'Active page count: {actives}')
