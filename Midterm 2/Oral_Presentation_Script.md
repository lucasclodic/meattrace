# MeatTrace · 7-minute presentation

Open the PDF and load the offline prototype on **FreshMeals · Beef lasagne / Lab mismatch** before you start. Prepare the audit as described under slide 7. The times include transitions and the live demo.

| Elapsed | Slide | Speaker |
| --- | --- | --- |
| 0:00–0:10 | 1. MeatTrace | Elisa |
| 0:10–1:10 | 2. Business problem | Elisa |
| 1:10–2:10 | 3. Feedback addressed | Elisa |
| 2:10–3:20 | 4. Where MeatTrace fits | Julia |
| 3:20–3:55 | 5. Lab evidence and lot lineage | Julia |
| 3:55–4:35 | 6. Neural triage | Julia |
| 4:35–5:55 | 7. Live demo | Lucas |
| 5:55–6:30 | 8. Simulated results | Lucas |
| 6:30–7:00 | 9. FreshMeals pilot | Lucas |

## Slides 1–3 · Elisa · 0:00–2:10

### 1 · MeatTrace

*Show the title briefly, then move straight to slide 2.*

### 2 · Which packs should FreshMeals hold?

The 2013 horsemeat scandal exposed undeclared species in products marketed as beef. We use it as the starting point for FreshMeals, our fictional ready-meal producer.

In our scenario, a lab reports horse in an input lot used for beef lasagne. Some finished packs have already shipped. The quality manager needs to identify the affected lots, the stock still on site and the shipments sent to each retailer.

The lab result, production records and shipments need to link up. Missing links can force a broader hold. A scope that’s too narrow can miss affected packs.

### 3 · What changed since Midterm 1?

In Midterm 1, we chose a permissioned consortium. Our Python demo checked record integrity, access rights and species mismatches.

**The instructor gave us three pieces of feedback.** Make the business problem clearer, look at existing solutions and related projects, and turn the design into a working prototype.

So we looked at what competitors already do and who can approve the records used in an investigation. We built a configurable prototype to show how our consortium would work alongside lot tracing. We also tested whether AI could help staff send incident notes to the right reviewer.

**Julia will start with what the market already covers and where we chose to focus.**

## Slides 4–6 · Julia · 2:10–4:35

### 4 · Where MeatTrace fits

The market confirms that tracing affected lots and managing withdrawals are established needs. Folio3 traces mixed inputs and supports mock recalls. DockLedger also shows what has reached customers and what is still on site. In its documented workflow, release is reserved for an owner or manager. Trustwell supports targeted withdrawals and lab certificates. Its documentation puts approval of supplier documents with the community owner.

**We designed MeatTrace for beef supply chains where separate organizations want a say in which records enter the audit trail.** A lab can submit a report, and three of four consortium validators must approve it before it enters the ledger. That gives the processor, lab and commercial partners a shared approval process. Walmart and IBM are a precedent for blockchain traceability. Our demo shows how our approval rule works alongside a lot trace.

### 5 · Lab evidence and lot lineage

MeatTrace uses a network’s own records. A linked lab result points to an input lot, which the app follows to finished lots, on-site stock and retailer shipments. The audit view shows which organizations approved a record and checks whether it changed after approval. FreshMeals is the dataset we’ll use to show both views.

**AI helps staff with another task. It suggests who should review an incident note.**

### 6 · A neural network routes incident notes

Staff need to send incident notes to the right reviewer. The same problem can be described in different words, so we tested a neural network against fixed keywords. On the same 24 synthetic notes, it got 23 right versus 12 for keywords. It also routed an unrelated office note in a separate challenge, so its suggestion stays advisory.

**Lucas will show the trace, the suggested queue and the shared approval step.**

## Slides 7–9 · Lucas · 4:35–7:00

### 7 · The trace and the consortium approval

*Before presenting, stay in the FreshMeals network. In **Consortium audit**, select **Lab report · LAB-204**. Propose it as **GenoLab**. Approve it as **FreshMeals SA**, then as **Retailer A**. Select **Retailer B** as the acting organization and leave its vote pending. Return to **Trace investigation / Lab mismatch**. Keep the browser open.*

*0:00–0:20. Show **Lab mismatch**, then the two finished lots and shipments.*

The linked sample reports horse, and the lot is declared as beef. QA can see the two finished lots and retailer shipments it needs to investigate.

*0:20–0:40. Click **Missing handover** and point to LAS-02.*

With one production link missing, 1,800 packs remain unresolved. QA keeps them in the wider investigation.

*0:40–0:55. Click **Suggest queue**.*

The app suggests **Traceability gap** so a reviewer can check the missing record.

*0:55–1:20. Open **Consortium audit** and approve as **Retailer B**. Point to the committed record and its approvals. Return to the deck.*

The lab submitted the report. The processor and two retailers approved it. This third vote commits it to the simulated ledger.

**Now let’s look at the numbers when the production links are complete.**

*If the browser is unavailable, use slides 5 and 8 to explain the three-of-four approval rule and both trace scenarios.*

### 8 · 3,000 linked packs in a 12,000-pack line

Of the 12,000 packs on the line, 3,000 are linked to the affected input. Of those, 1,200 are on site and 1,800 have shipped. The 9,000 packs outside the linked scope represent up to €16,200 in potential handling or disposal costs at €1.80 per pack. That’s an estimate for this scenario.

**The pilot would test whether FreshMeals can narrow the scope reliably with real records.**

### 9 · A one-line FreshMeals pilot

We’d run the same mock incidents with the current process, a vendor and MeatTrace. We’d measure time, missed lots, extra packs held and the effort to approve a disputed record. With complete records, the goal is to trace in under an hour and miss zero affected lots. That gives FreshMeals a basis for deciding whether to build or buy.
