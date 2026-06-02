#!/usr/bin/env python3
import json

with open('/Users/win/.hermes/scripts/sale_price_data.json') as f:
    existing = json.load(f)

# BIT live data (scraped from page 1)
bit_live = {
    "SMRTE5397B3XQPKX": {"salePrice": "HK$2,400.00", "origPrice": "HK$3,999.00"},
    "NEDJKSX2176MQBKX": {"salePrice": "HK$1,610.00", "origPrice": "HK$2,299.00"},
    "NXXJKK24004MQBGX": {"salePrice": "HK$3,600.00", "origPrice": "HK$4,499.00"},
    "NEDSTSX4856MQBKX": {"salePrice": "HK$1,190.00", "origPrice": "HK$1,699.00"},
    "NEDSTSX4836MQMLX": {"salePrice": "HK$1,190.00", "origPrice": "HK$1,699.00"},
    "CXETES29T17MQBKX": {"salePrice": "HK$490.00", "origPrice": "HK$699.00"},
    "CXETES29T20MQWHX": {"salePrice": "HK$560.00", "origPrice": "HK$799.00"},
    "CXETES29T13MQBKX": {"salePrice": "HK$630.00", "origPrice": "HK$899.00"},
    "CXETES29T11MQBKX": {"salePrice": "HK$630.00", "origPrice": "HK$899.00"},
    "AGDSPA0371XXQBLL": {"salePrice": "HK$1,120.00", "origPrice": "HK$1,599.00"},
    "PWOBTWL0002XQBKX": {"salePrice": "HK$1,600.00", "origPrice": "HK$1,999.00"},
    "SGESPPSDBLCMQBLX": {"salePrice": "HK$1,960.00", "origPrice": "HK$2,799.00"},
    "MGGKN6KN101XQGYX": {"salePrice": "HK$2,310.00", "origPrice": "HK$3,299.00"},
    "MGGCD8KN610XQBWX": {"salePrice": "HK$1,820.00", "origPrice": "HK$2,599.00"},
    "XAMST899122MQNYX": {"salePrice": "HK$3,150.00", "origPrice": "HK$4,500.00"},
    "AJXBO4078028QBWX": {"salePrice": "HK$10,290.00", "origPrice": "HK$14,699.00"},
    "TNTSPSO5S01MQBLX": {"salePrice": "HK$840.00", "origPrice": "HK$1,199.00"},
    "TNTJNPA5P02MQBKX": {"salePrice": "HK$1,050.00", "origPrice": "HK$1,499.00"},
    "TNTSPSOCS01MQBWX": {"salePrice": "HK$980.00", "origPrice": "HK$1,399.00"},
    "TNTTPTOSP01MQORX": {"salePrice": "HK$840.00", "origPrice": "HK$1,199.00"},
    "TNTSTSHTL01MQBLX": {"salePrice": "HK$910.00", "origPrice": "HK$1,299.00"},
    "TNTTETSST44MQWHX": {"salePrice": "HK$420.00", "origPrice": "HK$599.00"},
    "TNTPOTSPS01MQBKX": {"salePrice": "HK$560.00", "origPrice": "HK$799.00"},
    "TNTTETSST03MQNYX": {"salePrice": "HK$420.00", "origPrice": "HK$599.00"},
    "TNTPTPA5P04MQGYX": {"salePrice": "HK$1,050.00", "origPrice": "HK$1,499.00"},
    "TNTTETSST34MQIVX": {"salePrice": "HK$420.00", "origPrice": "HK$599.00"},
    "TNTTETSST02MQWHX": {"salePrice": "HK$350.00", "origPrice": "HK$499.00"},
    "TNTSTSHTL03MQBKX": {"salePrice": "HK$910.00", "origPrice": "HK$1,299.00"},
    "PPATE900138MQWHX": {"salePrice": "HK$390.00", "origPrice": "HK$599.00"},
    "PPALT990015MQWHX": {"salePrice": "HK$520.00", "origPrice": "HK$799.00"},
    "MGGCD8KN101XQGYX": {"salePrice": "HK$1,820.00", "origPrice": "HK$2,599.00"},
    "MGGKN7KN101XQGYX": {"salePrice": "HK$1,960.00", "origPrice": "HK$2,799.00"},
    "FEVTE170154MQGYX": {"salePrice": "HK$420.00", "origPrice": "HK$599.00"},
    "FEVTE170151MQGYX": {"salePrice": "HK$420.00", "origPrice": "HK$599.00"},
    "FEVSP140258MQBKX": {"salePrice": "HK$980.00", "origPrice": "HK$1,399.00"},
    "FEVTE170152MQGYX": {"salePrice": "HK$420.00", "origPrice": "HK$599.00"},
    "CMFCP01AC04MQBLX": {"salePrice": "HK$390.00", "origPrice": "HK$599.00"},
    "CMFPT601P04MQBKX": {"salePrice": "HK$1,300.00", "origPrice": "HK$1,999.00"},
    "MRRJKWJA076XQBLL": {"salePrice": "HK$4,200.00", "origPrice": "HK$5,999.00"},
    "MRRJNWPA128XQBLL": {"salePrice": "HK$3,500.00", "origPrice": "HK$4,999.00"},
    "MRRJNPA174DXQBLL": {"salePrice": "HK$3,920.00", "origPrice": "HK$5,599.00"},
    "CMFTE601C19MQBKX": {"salePrice": "HK$650.00", "origPrice": "HK$999.00"},
    "CMFTE601C10MQBKX": {"salePrice": "HK$975.00", "origPrice": "HK$1,499.00"},
    "MRRSR2ARDENMQBLX": {"salePrice": "HK$3,575.00", "origPrice": "HK$5,499.00"},
    "MRRSPWSH18DXQBLX": {"salePrice": "HK$2,800.00", "origPrice": "HK$3,999.00"},
    "CMFTE601C17MQBKX": {"salePrice": "HK$975.00", "origPrice": "HK$1,499.00"},
    "MRRSKWSK135XQBLL": {"salePrice": "HK$2,590.00", "origPrice": "HK$3,699.00"},
    "MRRHAWHA002XQMLX": {"salePrice": "HK$700.00", "origPrice": "HK$999.00"},
    "MRRSP3ACWOVMQBKX": {"salePrice": "HK$1,625.00", "origPrice": "HK$2,499.00"},
}

# SIT live data (scraped from page 1)
sit_live = {
    "AMLTPH143550QBKX": {"salePrice": "HK$179.00", "origPrice": "HK$199.00"},
    "AMLTPH151510QGYL": {"salePrice": "HK$179.00", "origPrice": "HK$199.00"},
    "FFXTEF0001120GYD": {"salePrice": "HK$99.00", "origPrice": "HK$359.00"},
    "B1XTEF0003920GYD": {"salePrice": "HK$99.00", "origPrice": "HK$359.00"},
    "FFXTEF0001510BKX": {"salePrice": "HK$89.00", "origPrice": "HK$329.00"},
    "B1XTEF0003860GYD": {"salePrice": "HK$89.00", "origPrice": "HK$329.00"},
    "FFXTEF0001140GYD": {"salePrice": "HK$89.00", "origPrice": "HK$329.00"},
    "IZXTEF0000590GYD": {"salePrice": "HK$79.00", "origPrice": "HK$299.00"},
    "IZXTEF0000740GY2": {"salePrice": "HK$99.00", "origPrice": "HK$359.00"},
    "IZXTEF0000620BKX": {"salePrice": "HK$89.00", "origPrice": "HK$329.00"},
    "IZXTEF0000880BKX": {"salePrice": "HK$99.00", "origPrice": "HK$359.00"},
    "IZXTEF0000510GYD": {"salePrice": "HK$79.00", "origPrice": "HK$299.00"},
    "IZXTEF0000650BKX": {"salePrice": "HK$89.00", "origPrice": "HK$329.00"},
    "IZXTEF0000530GY2": {"salePrice": "HK$89.00", "origPrice": "HK$329.00"},
    "FFXTEF0000550GY2": {"salePrice": "HK$99.00", "origPrice": "HK$359.00"},
    "FFXTEF0000720GY2": {"salePrice": "HK$99.00", "origPrice": "HK$359.00"},
    "FFXTEF0000710GY2": {"salePrice": "HK$99.00", "origPrice": "HK$359.00"},
    "FFXTEF0000840GY2": {"salePrice": "HK$89.00", "origPrice": "HK$329.00"},
    "FFXTEF0000220WHX": {"salePrice": "HK$99.00", "origPrice": "HK$359.00"},
    "FFXTEF0000750GY2": {"salePrice": "HK$89.00", "origPrice": "HK$329.00"},
    "FFXTEF0000010WHX": {"salePrice": "HK$99.00", "origPrice": "HK$359.00"},
    "IZXTEF0000490GY2": {"salePrice": "HK$99.00", "origPrice": "HK$359.00"},
    "IZXTEF0000250GY2": {"salePrice": "HK$99.00", "origPrice": "HK$359.00"},
    "IZXTEF0000190GY2": {"salePrice": "HK$99.00", "origPrice": "HK$359.00"},
    "IZXTEF0000100GY2": {"salePrice": "HK$89.00", "origPrice": "HK$329.00"},
    "EMXTK1177030QBKX": {"salePrice": "HK$413.00", "origPrice": "HK$459.00"},
    "EMXTK1176030QBWZ": {"salePrice": "HK$413.00", "origPrice": "HK$459.00"},
    "DZXDS6203027QNYX": {"salePrice": "HK$629.00", "origPrice": "HK$699.00"},
    "DZXSK6208009QBKZ": {"salePrice": "HK$863.00", "origPrice": "HK$959.00"},
    "DZXSP6208018QGYL": {"salePrice": "HK$593.00", "origPrice": "HK$659.00"},
    "EMOST6204502QBKX": {"salePrice": "HK$399.00", "origPrice": "HK$499.00"},
    "EMXTE1032580QGYD": {"salePrice": "HK$359.00", "origPrice": "HK$399.00"},
    "B1XTEF0001430GY2": {"salePrice": "HK$89.00", "origPrice": "HK$329.00"},
    "B1XTEF0001780WHX": {"salePrice": "HK$99.00", "origPrice": "HK$359.00"},
    "B1XTEF0002740WHX": {"salePrice": "HK$99.00", "origPrice": "HK$359.00"},
    "B1XTEF0002140BKX": {"salePrice": "HK$79.00", "origPrice": "HK$299.00"},
    "B1XTEF0002340GYD": {"salePrice": "HK$99.00", "origPrice": "HK$359.00"},
    "B1XTEF0003780WHX": {"salePrice": "HK$99.00", "origPrice": "HK$359.00"},
    "B1XTEF0003450BKX": {"salePrice": "HK$79.00", "origPrice": "HK$299.00"},
    "B1XTEF0002400BKX": {"salePrice": "HK$99.00", "origPrice": "HK$359.00"},
    "B1XTEF0003290WHX": {"salePrice": "HK$99.00", "origPrice": "HK$359.00"},
    "B1XTEF0002360GY2": {"salePrice": "HK$89.00", "origPrice": "HK$329.00"},
    "5CXTEF0000060BKX": {"salePrice": "HK$79.00", "origPrice": "HK$299.00"},
    "5CXTEF0000230BKX": {"salePrice": "HK$99.00", "origPrice": "HK$359.00"},
    "5CXTEF0000090GY2": {"salePrice": "HK$79.00", "origPrice": "HK$299.00"},
    "5CXTEF0000020BKX": {"salePrice": "HK$89.00", "origPrice": "HK$329.00"},
    "5CXTEF0000460GY2": {"salePrice": "HK$89.00", "origPrice": "HK$329.00"},
    "B1XTEF0001950GY2": {"salePrice": "HK$79.00", "origPrice": "HK$299.00"},
}

all_live = {**bit_live, **sit_live}

diffs = []
missing_in_existing = []
for code, prices in all_live.items():
    if code not in existing:
        missing_in_existing.append(f"  {code} -> {prices}")
    elif existing[code] != prices:
        diffs.append(f"  {code}: stored={existing[code]} vs live={prices}")

print("=== SALE PRICE COMPARISON ===")
print(f"Existing entries: {len(existing)}")
print(f"Live BIT products: {len(bit_live)}")
print(f"Live SIT products: {len(sit_live)}")
print(f"Live total unique: {len(all_live)}")

if diffs:
    print(f"\nPRICE DIFFERENCES: {len(diffs)}")
    for d in diffs:
        print(d)
else:
    print("\nPRICE DIFFERENCES: 0 (all live prices match existing)")

if missing_in_existing:
    print(f"\nMISSING IN EXISTING: {len(missing_in_existing)}")
    for m in missing_in_existing:
        print(m)
else:
    print("MISSING IN EXISTING: 0 (all live products already recorded)")

extra = set(existing.keys()) - set(all_live.keys())
if extra:
    print(f"\nEXTRA IN EXISTING (not on current sale pages): {len(extra)}")
    for c in sorted(extra):
        print(f"  {c}: {existing[c]}")
else:
    print("EXTRA IN EXISTING: 0")

print("\n=== NO CHANGES NEEDED ===")
