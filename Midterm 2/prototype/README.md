# MeatTrace · IS511E Midterm 2

Lucas Clodic, Elisa Ouillet and Julia Kozhina

## Run the demo

Open [`MeatTrace_Prototype.html`](../MeatTrace_Prototype.html) in a recent browser with JavaScript enabled. It is a single self-contained file and can run offline. There is no setup, account, upload, or API key. The app includes fixed demonstration data and processes typed notes in the browser.

1. **Lab mismatch** opens by default. Check sample DNA-204 and the declared BEEF versus reported HORSE. Scroll to the two shipments. LAS-01 and LAS-02 account for 3,000 packs, including 1,200 on site and 1,800 shipped.
2. **Missing handover** removes the production link for LAS-02. The app shows 1,200 known affected packs and 1,800 unresolved packs. The existing full-line reference is 12,000 and QA keeps the broader scope pending reconciliation.
3. Click **Suggest queue** for the prefilled note. It suggests **Traceability gap**. Try “Please call me when you have a minute” to trigger manual review. The note never changes the lot counts, scope or QA recommendation.
4. Click **Download trace CSV** to export linked and unresolved inventory and shipment rows. In the missing-handover case, the intended recipient of LAS-02 appears in the CSV with its unresolved lineage status.
5. **Lab match** sends the case for routine QA review. **Unlinked sample** demonstrates a precautionary hold on the selected intake batch and reconciliation of sample ID.

The app traces all descendant finished lots with recorded links. The local fixtures describe simplified manufacturing, using finished-pack counts rather than assigning a fraction of an input batch to each pack. The dataset includes source data, production edges and shipment records. The simplified gap tests cover an explicit omitted edge, a finished lot with no input link, stock imbalance and a missing recipient. A graph cannot discover every missing event on its own. Real integration needs event completeness checks, reliable identifiers, authenticated lab and custody records, and operational QA sign-off. The browser app uses illustrative evidence and has no write-back to production systems.

## Reproduce the results

Node.js 20 or later is needed only for these commands. There are no package installs.

```sh
node verify.js
node train_model.js
node build.js
```

- `cases.json` and `workflow.js` contain the synthetic incident data, graph traversal, QA suggestions and CSV logic.
- `incident_examples.json` contains 48 training notes, 24 held-out test notes and three challenge prompts. All are authored synthetic English examples. Test texts are held out of training and vocabulary fitting. Similar operational terms recur across the subsets.
- `train_model.js` trains a seeded classifier using stochastic gradient descent and writes `model.json` and `evaluation.json`. `inference.js` is shared by the evaluator and browser UI.
- `build.js` bundles those assets into one browser file. `verify.js` checks scenario decisions, shipment scope, CSV and fallback behavior.
- [`Oral_Presentation_Script.md`](../Oral_Presentation_Script.md) contains the timed talk track and discussion notes.

## AI evaluation

The model uses binary character 3–5-gram features with L2 normalization, 12 tanh hidden units and three softmax outputs. It abstains if fewer than 10 features match, if the top score is below 0.66, or if the top two scores differ by less than 0.18. The thresholds are design choices. Scores are uncalibrated. The keyword comparator checks a fixed species list, then a fixed traceability list, then defaults to routine.

| Method | Correct on 24 notes | Routed |
| --- | ---: | ---: |
| Keyword rules | 12 | 24 |
| Neural triage | 23 | 24 |

The neural model sent a routine delivery acknowledgement to the traceability queue. The three additional prompts illustrate a manual-review result and two routed outputs, including a routine suggestion for an unrelated office printer note. These results measure synthetic queue assignment only. A credible pilot would evaluate QA-labelled notes by source and time, per-class errors, abstention and review burden. QA retains authority for each disposition.

## Midterm 1 baseline

The [submitted deck](https://github.com/lucasclodic/meattrace/blob/main/slides/IS511E_Midterm1_v5.pdf) proposed a permissioned consortium with four validators and an independent DNA lab. The [saved demo](https://github.com/lucasclodic/meattrace/blob/main/prototype/demo_output.txt) shows SHA-256 checks, the species mismatch block and five permission cases. This iteration adds the QA workflow and an incident-notes model. Production identity, permissions and network governance remain engineering work for a pilot.
