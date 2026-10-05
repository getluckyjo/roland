# Roland's Home OT

A home occupational-therapy programme for Roland (5, left-handed). Chrystal runs it while OT with Simóne Vorster (Success Therapy Centre) is paused for term 4 of 2026. It is built from the OT progress report of 4 October 2026 (`Roland Progress Oct26.pdf`), the session photos in this repo, and current paediatric OT research.

## What's here

| File | What it is | Who it's for |
|---|---|---|
| **Live app** (private link: https://claude.ai/artifact/MEqzBi4HmwSD2ZHSomquFw) | Today's plan, 48 activity cards with OT photos, timers, session log and check-ins, progress charts, shared shopping list, full guide | Chrystal (daily), parents (Progress tab) |
| `app/index.html` + `app/img/` | Source of the live app | |
| `MANUAL.md` | The full manual as text | Everyone |
| `print/Roland-Home-OT-Manual.pdf` | Printable A4 manual with activity cards (21 pages) | A binder for the playroom |
| `print/Roland-Log-Sheets.pdf` | Paper weekly session log and fortnightly check-in sheet | Back-up to the app |
| `SHOPPING_LIST.md` | Kit to buy, with South African shops and rough prices | Parents |
| `RESEARCH.md` | The evidence behind the programme, with sources | Parents, OT |

## The programme in one paragraph

About **20 minutes, 5 days a week, for 9 weeks** (5 Oct – 4 Dec 2026). Each session runs:

1. Warm-up (2 min)
2. Body (6 min): core, balance or two-sided movement
3. Hands (3 min): finger warm-up
4. Table (8 min): cutting, pencil control or colouring
5. Finish: a favourite activity, a sticker and a 2-minute log

Each weekday has a theme: Monday core + scissors, Tuesday midline + pencil control, Wednesday balance + colouring, Thursday two hands + scissors, Friday obstacle course + drawing.

Check-ins happen on Friday of weeks 1, 3, 5, 7 and 9. They measure the OT's goals (one-leg balance, egg hold, sitting tolerance, colouring stamina, hand swapping, grip, cutting and shape copying) and feed the progress charts.

## Setting it up (parents)

1. **Share the app with Chrystal.** Open the link and use **Share** to invite Chrystal's email as an **Editor**. Don't use a public link, or her logs won't save. She signs in to Claude with that email.
   - If the page shows "Saved on this device only" or "View only", she can still use everything and send each log to you with the WhatsApp button.
2. **Buy the must-haves** (about R2,450). True left-handed scissors matter most. Tick items off on the Kit tab.
3. **Ask Simóne four questions:**
   - Which way she meant "rotate the page 45° to the left". Standard left-handed guidance tilts it clockwise; see the Guide.
   - Whether 10 s eyes-closed balance is the target at this age.
   - Which reflex exercises, if any, she wants.
   - When to trial a pencil grip.

   If possible, let Chrystal watch one session.
4. **Weekly:** look at the Progress tab. **Week 5:** send the check-in to Simóne. **Week 9:** send the final check-in and decide on therapy before Grade R.

## Updating

All content (activities, plan, goals, shopping list, sources) lives in the `DATA` block at the top of the script in `app/index.html`.

After editing it, run `node tools/build.mjs` to regenerate `MANUAL.md`, `SHOPPING_LIST.md` and the PDFs. Then republish the app.

The app's logs live in the app's own database, not in this repo.
