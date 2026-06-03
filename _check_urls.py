import urllib.request, sys

urls = [
    "https://hk.iteshop.com/bit/item/PPATE980019MQBLX?tscode=affhr_hk10071365",
    "https://hk.iteshop.com/bit/item/SGESPPSDBLCMQBLX?tscode=affhr_hk10071365",
    "https://hk.iteshop.com/bit/item/VALSTAEBAD6XQIVX?tscode=affhr_hk10071365"
]

for url in urls:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        resp = urllib.request.urlopen(req, timeout=10)
        html = resp.read().decode('utf-8', errors='ignore')
        start = html.find('<title>')
        end = html.find('</title>')
        title = html[start+7:end] if start != -1 else "NO TITLE FOUND"
        print(f"URL: {url[:60]}...")
        print(f"Title: {title}")
        print()
    except Exception as e:
        print(f"URL: {url[:60]}...")
        print(f"ERROR: {e}")
        print()
