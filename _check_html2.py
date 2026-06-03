with open('/tmp/bit_sale_p2.html', 'r', errors='ignore') as f:
    html = f.read()

# Look for m-pagination
idx = html.find('m-pagination')
if idx >= 0:
    print('Found m-pagination at', idx)
    print(html[idx:idx+2000])
else:
    idx = html.find('pagination')
    if idx >= 0:
        print('Found pagination at', idx)
        print(html[idx:idx+500])
    else:
        idx = html.find('u-item')
        if idx >= 0:
            print('Found u-item at', idx)
            start = max(0, idx-500)
            end = min(len(html), idx+2000)
            print(html[start:end])
        else:
            # Search for data-growing-title
            idx = html.find('data-growing-title')
            print('data-growing-title at', idx)
            if idx >= 0:
                print(html[idx:idx+500])
