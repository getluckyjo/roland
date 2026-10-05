# Takealot basket agent

A ready-to-paste task for a Claude agent that can control **your own browser**, such as Claude in Chrome or a desktop session with browser control. It runs in your logged-in Takealot session, adds Roland's OT kit to your cart, and stops before checkout.

**How to use**

1. Log in to takealot.com in that browser.
2. Open Claude's browser agent.
3. Paste everything in the box below.
4. Change `SCOPE` if you only want the must-haves.

Product IDs (PLIDs) are from research on 5 October 2026. Prices and stock change, so the agent checks each item and reports back before you pay.

---

```text
You are filling my Takealot cart with an occupational-therapy kit for my 5-year-old LEFT-HANDED son.

SCOPE: ALL        (change to MUST-HAVES ONLY to skip section B)

RULES
- I am already logged in to takealot.com in this browser. Never ask for or type a password, OTP or card details.
- Do NOT check out, pay, change my address, or apply vouchers. Stop at the cart.
- For each item, search Takealot for the product name. Open the result whose URL ends in the PLID given. If you can't find that exact PLID, use the closest match that meets the "Must be" line.
- Skip an item and tell me why if:
  - it is out of stock, or
  - no match meets the "Must be" line, or
  - the price is more than 30% above the estimate.
  Don't substitute anything more expensive without listing it.
- Check the cart first and don't add anything that's already there. Set quantities exactly as given.
- Keep a running list as you go.

A. MUST-HAVES
1. Pelikan Griffix scissors, LEFT-handed, rounded tip. PLID93127779. Qty 1. ~R99.
   Must be: TRUE left-handed (blades reversed), NOT "ambidextrous" or right-handed.
2. RGS Group scissors, LEFT hand, 135 mm. PLID95801430. Qty 1. ~R35.
   Must be: left-handed. (Spare pair.)
3. Play-Doh Classic 4-pack. Try PLID100744452. Qty 1. ~R119.
   Must be: genuine Play-Doh, about 4 tubs. If PLID100744452 turns out to be therapy putty (soft/yellow), add that instead and tell me.
4. Learning Resources Helping Hands Fine Motor Tool Set. PLID41399523. Qty 1. ~R319.
   Must be: includes tweezers or tongs.
5. Wooden washing pegs, 100 pcs. PLID71577781. Qty 1. ~R55–R96.
   Must be: spring clothes pegs, wood or bamboo.
6. Geoboard with rubber bands and pattern cards. First try "Smartplay geoboard" (~R95). Otherwise TookyToy Creative Rubber Band Geoboard set, PLID73154574 (~R229). Qty 1.
   Must be: pegboard plus rubber bands; pattern cards preferred.
7. RGS Group threading beads with laces (48 pcs). PLID72178989. Qty 1. ~R75.
8. Treeline Triangular Jumbo Wax Crayons, 9 pc. PLID46880720. Qty 1. ~R48.
9. Staedtler Beginners Pencil, Jumbo HB, 2-pack. PLID40998103. Qty 1. ~R26.
10. Maped triangular jumbo colour pencils, 12. PLID70433772. Qty 1. ~R81.
11. Crayola Ultra-Clean washable markers, broad line, 8. PLID60571466. Qty 1. ~R120.
12. Bantex jumbo sidewalk chalk, 20 pc. PLID94626678. Qty 1. ~R66.
13. Kids rainbow visual timer, 60 minutes. PLID102056458. Qty 1. ~R198.
    Must be: a visual countdown disc timer, not a digital kitchen timer.
14. Deli single-hole punch. PLID96238331. Qty 1. ~R27.
15. Kumon "My First Book of Cutting". PLID91557364. Qty 1. ~R185.
16. Kumon "My First Book of Mazes". PLID69297291. Qty 1. ~R125–R159.
17. A preschool dot-to-dot activity book, ages 4–6, numbers 1–10 or 1–20. Search "dot to dot book kids". Qty 1. ~R100.
    Must be: for ages 4–6.
18. A4 masonite clipboard. PLID41403848. Qty 1. ~R31.
19. 2-in-1 tabletop easel, chalkboard plus whiteboard. PLID100889056. Qty 1. ~R269.
    Must be: tabletop or desk easel with a chalkboard side.
20. Kids' step stool. PLID99420425. Qty 1. ~R159.
    Must be: sturdy, about 20–25 cm high, non-slip. It goes under his feet at the table.

B. NICE-TO-HAVES (skip this section if SCOPE is MUST-HAVES ONLY)
21. Anti-burst gym ball 55 cm with pump. PLID95357846. Qty 1. ~R198.
    Must be: anti-burst. A 45 cm ball is fine if it's offered.
22. ULNSUE balance disc (wobble cushion), about 33 cm. PLID103651986. Qty 1. ~R219.
23. EVA foam balance beam, about 12 pieces. PLID69526685. Qty 1. ~R349.
24. Non-slip stepping stones, about 6 pieces. PLID99681819. Qty 1. ~R309.
25. Kids cones, bean bags and ring toss set (about 28 pieces). PLID102122378. Qty 1. ~R299.
    Must be: includes bean bags.
26. Caterpillar play tunnel. PLID95183640. Qty 1. ~R223.
27. Kids folding foam play mat. PLID101635389. Qty 1. ~R299.

DON'T ADD (I'm buying these elsewhere or need advice first):
- pencil grips
- Stabilo left-handed pencils
- therapy putty from HiTech Therapy
- the scooter board (Tiny Tree Toys)
- sensory swings
- stickers, spray bottle, balloons, storage box

WHEN DONE, reply with:
1. A table: # | what I asked for | exact product added (title + link) | qty | price | delivery estimate.
2. Anything skipped or substituted, and why.
3. The cart subtotal and the number of items.
4. Any marketplace items shipping separately or with long lead times (over 7 days).
Then stop. Do not check out.
```

---

## If you don't have a browser agent

Each item is listed in the app's **Kit** tab with a "Search Takealot" link. In the prompt above, search the product name and match the PLID at the end of the product link.
