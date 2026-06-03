import re, json, sys

with open(sys.argv[1], 'r', errors='ignore') as f:
    html = f.read()

# Find product tile links with codes
codes = re.findall(r'data-growing-title="/bit/item/([A-Z0-9]+)"', html)
print(f"Product codes found: {len(codes)}")
# Print first 10
for c in codes[:10]:
    print(c)
