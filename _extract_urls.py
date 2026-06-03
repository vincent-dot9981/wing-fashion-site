import re, random, json
with open('js/products.js', 'r') as f:
    content = f.read()
urls = re.findall(r'"pdp_url":\s*"([^"]+)"', content)
unique = list(set(urls))
random.seed(42)
sampled = random.sample(unique, min(3, len(unique)))
result = {"total": len(unique), "sampled": sampled}
print(json.dumps(result))
