#!/usr/bin/env python3
import random, re

with open('js/products.js') as f:
    content = f.read()

urls = re.findall(r'"pdp_url":\s*"([^"]+)"', content)
print(f'Total PDP URLs found: {len(urls)}')
print(f'Unique PDP URLs: {len(set(urls))}')

random.seed()
selected = random.sample(list(set(urls)), min(3, len(set(urls))))
for i, url in enumerate(selected):
    print(f'{i+1}. {url}')
