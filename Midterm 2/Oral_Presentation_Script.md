# MeatTrace · 6:30 presentation

Open the PDF and load the offline prototype on **Lab mismatch** before you start. Use these lines as speaking cues. The times include transitions and the live demo.

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

In Midterm 1, we proposed a four-validator consortium. Our Python demo checked whether records had been altered, tested access rights and blocked a batch when the declared species disagreed with its recorded history.

The feedback was to make the business problem clearer, look at existing solutions and build a usable prototype. Now the app shows which finished lots are affected, how much stock is still on site and where the shipments went. We also compared three commercial alternatives and evaluated a neural model for routing incident notes.

*Hand over to Julia.*

## Slides 4–6 · Julia · 2:10–4:20

### 4 · Commercial alternatives

Trustwell FoodLogiQ supports batch-level tracing and targeted withdrawals. Folio3 is a meat ERP with lot genealogy, mixed-input tracing and mock recalls. DockLedger offers meat lot holds and recall drills. Walmart and IBM also piloted blockchain for pork certificates and mango provenance.

We’d give the vendors the same FreshMeals scenario to see how they handle a linked lab report, mixed inputs and a missing production record. Then we’d compare setup effort and cost.

### 5 · Lab evidence and lot lineage

The app matches the lab sample to the incoming lot and checks the declared species. It follows the input through trimming and mixing to the finished lots, then separates on-site packs from shipped packs. A missing link keeps the scope broad while QA checks the evidence.

### 6 · A neural network routes incident notes

The neural network suggests a species, traceability or routine queue. On 24 synthetic test notes, it got 23 right, compared with 12 for the keyword rules. It also sent an unrelated office note to the routine queue in a separate challenge. That’s why the suggestion stays advisory. QA makes the hold and withdrawal decisions.

*Hand over to Lucas.*

## Slides 7–9 · Lucas · 4:20–6:30

### 7 · The mismatch and the missing link

*0:00–0:25 of the demo. Open **Lab mismatch**. Show the lab result, finished lots and shipments.*

The declaration says beef. The linked sample reports horse. The app traces the input to LAS-01 and LAS-02 and shows the two retailer shipments.

*0:25–0:50. Click **Missing handover** and point to LAS-02.*

Now one production link is missing. LAS-02 accounts for 1,800 unresolved packs, so QA keeps the broader scope.

*0:50–1:05. Click **Suggest queue**. Point to the CSV button, then return to the deck.*

The suggested queue is **Traceability gap**. QA can export the trace for review.

*If the demo is unavailable, explain these two scenarios with slide 8.*

### 8 · 3,000 linked packs in a 12,000-pack line

In the complete simulation, 3,000 of 12,000 packs are linked to the affected input. Of those, 1,200 are on site and 1,800 have shipped. The other 9,000 are outside the linked scope. At an assumed €1.80 per pack, that’s up to €16,200 in illustrative handling or disposal exposure.

### 9 · A one-line FreshMeals pilot

We’d run the same mock incidents with the current process, a vendor and MeatTrace. We’d measure time to a QA-ready scope, missed lots and excess packs held. The target is under an hour, with zero missed planted lots when the records are complete. That gives FreshMeals a basis for the build-or-buy decision.
