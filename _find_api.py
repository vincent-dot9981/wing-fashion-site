import re

with open('/tmp/sit_sale.html', 'r', errors='ignore') as f:
    html = f.read()

# Find all API endpoints
api_endpoints = re.findall(r'https?://api[^"\' ]+', html)
for ep in set(api_endpoints):
    print(ep)

print("\n--- Looking for search/listing APIs ---")
# Look for patterns like /api/search or /product/search or /listing
search_apis = re.findall(r'["\'](/api/[^"\']*)["\']', html)
for sa in set(search_apis):
    print(sa)
