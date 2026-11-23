# MeatTrace · 6:30 presentation

Open the PDF and load the offline prototype on **FreshMeals · Beef lasagne / Lab mismatch** before you start. Use these lines as speaking cues. The times include transitions and the live demo.

| Elapsed | Slide | Speaker |
| --- | --- | --- |
| 0:00–0:10 | 1. MeatTrace | Elisa |
| 0:10–1:10 | 2. Business problem | Elisa |
| 1:10–2:10 | 3. Feedback addressed | Elisa |
| 2:10–3:05 | 4. Commercial alternatives | Julia |
| 3:05–3:40 | 5. Lab evidence and lot lineage | Julia |
| 3:40–4:20 | 6. Neural triage | Julia |
| 4:20–5:25 | 7. Live demo | Lucas |
| 5:25–6:00 | 8. Simulated results | Lucas |
| 6:00–6:30 | 9. FreshMeals pilot | Lucas |

## Slides 1–3 · Elisa · 0:00–2:10

### 1 · MeatTrace

*Show the title briefly, then move straight to slide 2.*

### 2 · Which packs should FreshMeals hold?

The 2013 horsemeat scandal exposed undeclared species in products marketed as beef. We use it as the starting point for FreshMeals, our fictional ready-meal producer.

In our scenario, a lab reports horse in an input lot used for beef lasagne. Some finished packs have already shipped. The quality manager needs to identify the affected lots, the stock still on site and the shipments sent to each retailer.

The lab result, production records and shipments need to link up. Missing links can force a broader hold. A scope that’s too narrow can miss affected packs.

### 3 · What changed since Midterm 1?

In Midterm 1, we chose a permissioned consortium and demonstrated record integrity, access rights and species checks. This time we focused on what FreshMeals needs to do once a mismatch is found.

**We worked on three things.** First, we compared existing tools to see what FreshMeals could already buy. Second, we built a configurable interface for that solution so quality teams can see what to hold and which shipments to investigate. Third, we tested whether AI could help staff send incident notes to the right review queue.

**Julia will start with the market.**

## Slides 4–6 · Julia · 2:10–4:20

### 4 · Commercial alternatives

We looked at existing solutions because FreshMeals needs to decide whether to build a tool or buy one. Trustwell offers lot tracing and targeted withdrawals. Folio3 traces mixed inputs in meat production. DockLedger supports lot holds and recall drills. We also looked at Walmart and IBM’s blockchain pilot for pork certificates and mango provenance.

We’d give each vendor the same FreshMeals case so we can compare how they handle a missing record, as well as how much setup costs.

**Our prototype shows how the consortium approach would support a trace from a lab result to stock and shipments.**

### 5 · Lab evidence and lot lineage

A network loads its own organizations, lots, lab reports and shipments. The app links a sample to the incoming lot, follows it through production and separates on-site stock from shipments. The local audit simulates role checks, three of four approvals and SHA-256 hashes. We’ll use FreshMeals as the demo dataset.

**The trace uses recorded links. AI helps staff route the notes they write about an incident.**

### 6 · A neural network routes incident notes

Staff need to send incident notes to the right reviewer. The same problem can be described in different words, so we tested a neural network against fixed keywords. On the same 24 synthetic notes, it got 23 right versus 12 for keywords. It also routed an unrelated office note in a separate challenge, so its suggestion stays advisory.

**Lucas will show how the trace responds to a missing link, then how the note gets routed.**

## Slides 7–9 · Lucas · 4:20–6:30

### 7 · The mismatch and the missing link

*0:00–0:25. Open **Lab mismatch**. Point to the result, then the finished lots and shipments.*

The declaration says beef. The linked sample reports horse. The app shows LAS-01 and LAS-02 and the two retailer shipments QA needs to investigate.

*0:25–0:50. Click **Missing handover** and point to LAS-02.*

We removed one production link to see what happens with incomplete records. The app flags 1,800 packs as unresolved so QA keeps them in the wider investigation.

*0:50–1:05. Click **Suggest queue**, point to the CSV export and return to the deck.*

The note goes to **Traceability gap** so someone can check the missing record.

**Now let’s quantify the scope when the record is complete.**

*If the demo is unavailable, describe both cases using slide 8.*

### 8 · 3,000 linked packs in a 12,000-pack line

Of the 12,000 packs on the line, 3,000 are linked to the affected input. Of those, 1,200 are on site and 1,800 have shipped. The 9,000 packs outside the linked scope represent up to €16,200 in potential handling or disposal costs at €1.80 per pack. That’s an estimate for this scenario.

**The pilot would test whether FreshMeals can narrow the scope reliably with real records.**

### 9 · A one-line FreshMeals pilot

We’d run the same mock incidents with the current process, a vendor and MeatTrace. We’d measure time, missed lots and extra packs held. With complete records, the goal is to trace in under an hour and miss zero affected lots. That gives FreshMeals a basis for deciding whether to build or buy.
