# MeatTrace · 10-minute oral presentation

Suggested speaker assignments. Open the nine-slide PDF and the offline HTML prototype before presenting. Leave the browser on **Lab mismatch**. Text in italics is a stage direction.

| Elapsed time | Slide | Speaker |
| --- | --- | --- |
| 0:00–0:20 | 1. MeatTrace | Elisa |
| 0:20–1:25 | 2. Business problem | Elisa |
| 1:25–2:20 | 3. Feedback addressed | Elisa |
| 2:20–3:40 | 4. Market and precedents | Julia |
| 3:40–4:45 | 5. Prototype design | Julia |
| 4:45–6:00 | 6. Neural triage | Lucas |
| 6:00–7:45 | 7. Live demo | Lucas |
| 7:45–8:50 | 8. Simulated results | Elisa |
| 8:50–10:00 | 9. Pilot decision | Julia |

## Slide 1 · Elisa · 0:00–0:20

Good morning. We’re Lucas, Julia and Elisa, and our project is MeatTrace. Imagine you’re the quality manager at FreshMeals. A lab has reported horse in an ingredient sold as beef, and some of your lasagne is already at retailers. Which packs do you hold, and which shipments do you investigate?

## Slide 2 · Elisa · 0:20–1:25

The 2013 horsemeat scandal showed that products marketed as beef could contain undeclared horsemeat. We use that incident as the starting point for FreshMeals, our fictional ready-meal producer.

Here’s the situation in our case. FreshMeals has the incoming lot number from the lab report. But the ingredient lot was trimmed and then mixed with another input. That mix went into more than one finished lot, and some packs from those lots had already left the plant.

The quality manager needs three answers. Which finished lots used this input? How much is still on site? And what did each retailer receive? Those answers sit in different records. If the links between them are incomplete, a broad hold may be the only responsible option while QA investigates. If the scope is too narrow, affected packs can be missed. That decision is the business problem we wanted to make clearer this time.

## Slide 3 · Elisa · 1:25–2:20

In Midterm 1, we proposed a permissioned consortium with four validators. Our Python demo showed that editing a record changed its hash, that a recorded species mismatch blocked a batch, and that permissions could be enforced. The validator vote was illustrative.

Our feedback was to make the business problem more explicit, look at commercial solutions and similar projects, and build a prototype someone could actually use. We turned the original mismatch into a workflow for quality staff. They can now see the finished lots, separate stock from shipments, and export the trace for review. We also compared three products and tested a small model for routing incident notes.

Julia will start with what we found in the market.

## Slide 4 · Julia · 2:20–3:40

There are already products that address much of this workflow. Trustwell’s FoodLogiQ combines lot traceability with targeted withdrawals and tracks acknowledgements from recipients. We’d test how easily FreshMeals could link a lab result to the shipment list used for a withdrawal.

Folio3 takes an ERP approach. Its meat offering includes lot genealogy, mixed-input tracing and mock recalls. The question for FreshMeals is how much of its existing production data could be reused and how much integration would be needed.

DockLedger offers meat lot holds, recall drills and pack tracking. We’d ask it to demonstrate a multi-ingredient ready meal with mixed inputs and split shipments.

Walmart and IBM also ran related blockchain proofs of concept. One covered pork certificates and another traced mango provenance. That shows what a shared trace system can do in a specific setting. The question for FreshMeals is whether shared control would justify the additional governance and cost.

These comparisons use published capabilities. We’d give each vendor the same incident and ask them to show how they handle a missing link.

## Slide 5 · Julia · 3:40–4:45

The prototype takes a structured lab report and checks that its sample is linked to the incoming lot. If we can’t match the sample and its custody record, the team needs to reconcile the evidence first.

For a linked mismatch, the app follows the incoming lot through trimming, mixing and packing. This can lead to more than one finished lot. It then separates packs still at FreshMeals from packs that already shipped, and shows the shipment destinations.

The app also checks the completeness of the recorded scope. A known missing input link or a stock discrepancy keeps the scope broad. We use a local event graph in the demo. GS1’s EPCIS standard gives us a reference for exchanging those events if we connect real systems later.

Lucas will explain where we used AI in that workflow.

## Slide 6 · Lucas · 4:45–6:00

We used a small neural network for one task: suggest a review queue for a short incident note. The queues are species concern, traceability gap and routine update. The model learns from character fragments, which helps it handle notes that use different wording from the keyword list.

We trained on 48 synthetic notes, then evaluated on 24 separate synthetic notes, eight for each queue. The keyword rules got 12 right. The neural classifier got 23 right, and it suggested a queue for all 24. Its one error was a delivery acknowledgement that it routed to the traceability queue.

We also tried three extra prompts. The model sent one to manual review, but it treated an unrelated printer note as routine. That’s a useful example of a limit we’d need to address before using real notes. The app makes lot and scope suggestions from structured evidence. QA owns the operational decision.

## Slide 7 · Lucas · 6:00–7:45

*0:00–0:45 of the demo. Switch to the browser. Show **Lab mismatch**, point to the lab evidence, then scroll to the shipment list.*

This is incoming lot RO-2026-0412. The declaration says beef and the linked lab sample reports horse. The trace shows two finished lots, LAS-01 and LAS-02. Some packs are still on site. Two shipments have gone to different distribution centres. QA can use these shipment records to investigate a withdrawal.

*0:45–1:20. Click **Missing handover**. Point to LAS-02 and the unresolved pack count.*

Now we remove one production link. We still know LAS-01 used the lot. But LAS-02 has 1,800 packs and its recorded lineage is incomplete. The app keeps it in the broader investigation. The list of known affected shipments is now partial, so the team still has work to do before narrowing the scope.

*1:20–1:45. Click **Suggest queue**, then **Download trace CSV**. Return to the PDF.*

The note goes to the traceability queue. The CSV captures the linked and unresolved records so QA can review them. Elisa will put the scope into numbers.

*If the demo is unavailable, go to slide 8. Explain that the complete scenario traces both shipments and that the missing link leaves 1,800 packs unresolved.*

## Slide 8 · Elisa · 7:45–8:50

Across the fictional production line, there are eight lots and 12,000 packs. With complete records in this scenario, 3,000 packs are linked to the affected input. Of those, 1,200 are still on site and 1,800 have shipped. The other 9,000 are outside the linked scope.

To illustrate the business stakes, suppose unnecessary handling or disposal costs up to €1.80 per pack. Across 9,000 packs, that’s up to €16,200 of gross exposure in this scenario. It’s a scenario estimate. Actual savings would depend on how many packs would otherwise be held or disposed of, the exact cost per pack and what it costs to run the system.

The question for a pilot is whether quality staff can reliably make a narrower decision and do it sooner. Julia will explain how we would test that.

## Slide 9 · Julia · 8:50–10:00

We’d start with one beef lasagne line, three suppliers and the independent lab. We’d give the current workflow, a vendor and our prototype the same mock incidents. Then we’d time the quality team from receiving the signal to producing a scope that’s ready for review. We’d compare the result with the lots and shipments planted in each exercise.

We’d keep the original target of tracing in under an hour. With complete data, the drill should miss none of the planted affected lots. Where an event is missing, the team should retain a broader scope until it can explain the gap. We’d also measure extra packs placed on hold and reviewer time.

That gives FreshMeals a basis for a build-or-buy decision. AI triage would need a separate test on real notes labelled by QA. We’d revisit a consortium if partners need shared control and commit to funding it. Thank you.

## Questions to rehearse

- **Why not start with blockchain?** First validate that partners can provide the records and agree on identifiers. The Midterm 1 network estimate was €305,000 over three years, compared with €116,000 for a secure database. Both were illustrative IT estimates with DNA costs separate. Compare vendor quotes, integration effort and governance needs after the first drill.
- **Does a matching sample clear the lot?** The app sends it to QA for routine release review. QA still considers authenticity, custody, sampling coverage and the normal release protocol.
- **How much weight should we give the 23 out of 24 result?** It’s a small synthetic dataset and a simple baseline. Evaluate routing on real notes, track errors by class and measure how much review work it saves or adds.
- **Can the app find every missing production event?** It catches the gaps represented in our demo and checks whether pack counts and shipment destinations reconcile. Detecting a missing event with no visible signal requires validation against separate source records.
