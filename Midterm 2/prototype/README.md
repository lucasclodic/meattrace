# MeatTrace · Beef supply-chain traceability

MeatTrace is a configurable, offline prototype of the permissioned traceability solution proposed in Midterm 1. A network supplies its organizations, input lots, transformations, lab reports and finished-lot shipments. The same workspace serves each network.

## Use the workspace

Open the bundled `MeatTrace_Prototype.html` in a recent browser. The app runs locally without an account, server or API key.

- **FreshMeals · Beef lasagne** opens with the four presentation drills. **Lab mismatch** traces 3,000 of 12,000 packs, including 1,200 on site and 1,800 shipped. **Missing handover** flags 1,800 unresolved packs. **Lab match** and **Unlinked sample** show the remaining checks.
- **North Valley · Boxed beef** uses different organizations, two selectable inputs, multiple transformations and kilograms. Select **NV-110 / R-501** to trace 180.5 kg, of which 40.5 kg remain on site and 140 kg shipped. Select **NV-111** to review a different lot.
- **Import network JSON** loads another chain. Use **Download example JSON** or the included [network example](network_example.json) as a template. Choose an incoming lot and a lab report in **Trace investigation**, inspect the lineage and shipment scope, and export the trace CSV. The app keeps the data and audit state in memory until you close or reload the page. Import changes neither the original file nor any operational system.
- **Suggest queue** uses the English-language neural model to route a note. The output is advisory. QA decides what to hold, release or investigate.

## Configure a network

| Field | Contents |
| --- | --- |
| `schemaVersion`, `name`, `unit` | Version `1`, the network name and a consistent reporting unit such as `packs` or `kg`. |
| `organizations` | Unique `id`, `name` and role. Roles are `supplier`, `processor`, `lab`, `distributor`, `retailer` and `observer`. |
| `validators` | Four distinct organization IDs, including an independent lab. |
| `inputs` | Inventory entry points, each with a lot `id`, organization ID, `recordId` and `declaredSpecies`. |
| `transformations` | Record `id`, processor organization ID, `stage`, upstream lot IDs in `inputs`, an `output` lot ID and a `complete` flag. Multiple inputs and branching outputs are supported. For a known missing link, omit the unknown source and set `complete` to `false`. |
| `finishedLots` | Terminal lots and processor IDs, with `quantity`, `onsite` and `shipments`. Each shipment has an ID, recipient and quantity. An empty recipient flags a gap. |
| `labReports` | Report ID, sample ID, lot ID, registered lab organization ID, `species` and `custodyVerified`. Use the same species vocabulary across the network. |

An incomplete transformation propagates uncertainty to its downstream lots. Stock totals that do not reconcile and missing recipients also keep the scope broad. Only fully reconciled linked lots contribute to the known affected totals. The graph can flag recorded gaps. Detecting missing events that leave no signal requires reconciliation with upstream systems. The prototype models terminal stock and shipments in one declared unit and does not allocate ingredient weight among mixed finished products.

## Try the Midterm 1 controls

1. Choose **Consortium audit**, select **Lab report · LAB-204** and select **GenoLab** as the acting organization. Click **Propose record**. Lab reports can only be proposed by the reporting lab in the simulation.
2. Use **FreshMeals**, **Retailer A**, and **Retailer B** to approve once each. The third approval commits the record with its SHA-256 hash and previous-block hash. Self-approval, duplicate approvals and approvals by organizations outside the validator list are rejected.
3. Click **Verify ledger**, then **Test an altered copy**. The modified copy fails verification and the original remains intact.

A trace preview can use imported evidence before local audit approval. A production version would need authenticated organizations, digital signatures, authenticated lab and custody records, replicated nodes, durable storage and ERP or lab integration. This prototype simulates roles and quorum within one browser session. It neither deploys a network nor sends operational instructions.

## Reproduce

Node.js 20 or later is needed only for source commands. No package installs are required.

```sh
node verify.js
node train_model.js
node build.js
```

Run `node build.js ../MeatTrace_Prototype.html` to replace the app next to the presentation when building from the GitHub source directory. The test script covers both chains, trace reconciliations, schema checks, authorization, quorum and detection of altered records.

The neural model uses binary character 3–5-grams, 12 tanh units and three softmax outputs. It trained on 48 synthetic notes and correctly routed 23 of 24 separate synthetic test notes. A fixed keyword baseline got 12 right. The confidence scores are uncalibrated, and a separate challenge routed an unrelated note as routine. The weights, test notes and per-note outputs are included to reproduce the comparison.

The [Midterm 1 deck](https://github.com/lucasclodic/meattrace/blob/main/slides/IS511E_Midterm1_v5.pdf) and [saved Python demo](https://github.com/lucasclodic/meattrace/blob/main/prototype/demo_output.txt) describe the original governance proposal and control checks.
