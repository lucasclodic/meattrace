# MeatTrace — Q&A defense kit

IS511E Midterm 1 · Lucas Clodic, Elisa Ouillet, Julia Kozhina

**Who answers first** (the others can add a sentence):
- **Elisa**: problem and business plan (slides 1–5)
- **Julia**: costs, architecture, governance (slides 6–9)
- **Lucas**: Python and roadmap (slides 10–12)

**Golden rule for every answer:** answer in one sentence, give one reason, point to the slide. If you don't know, say what we would check during the pilot.

---

## 1. The 6 questions the professor announced (brief, section 8.1)

### Q1. Why is blockchain appropriate in your case? Could a secure database be enough?
**First: Julia · Slide 7**
> A secure database is enough when one trusted party runs the whole process. Here, six or more independent firms in three or more countries, some of them competitors, have to share one history. In 2013 they all blamed each other, so nobody accepts that a rival controls the records. That's why we chose a permissioned consortium. If we can't find three co-funders, we would recommend the secure database instead (slide 6).

### Q2. What information is public, shared with partners, or confidential?
**First: Julia · Slides 8–9**
> Nothing is public: it's a permissioned network. Partners see batch data according to their role: batch ID, species, weight, handovers and DNA test result. Prices, contracts, supplier lists and full lab reports stay confidential, off-chain in each company's own systems. Only their hash goes on the ledger.

### Q3. Who signs, approves and validates transactions? How are these duties separated?
**First: Julia, Lucas adds the Python · Slides 9 and 11**
> The firm that hands over the batch signs the record: the abattoir, the trader or FreshMeals at reception. The lab signs DNA results. An independent party approves: the DNA lab, or FreshMeals' quality manager, but never for a record they created themselves. Four validator nodes (FreshMeals, 2 retailers, the lab) then agree on each block. Our Python test shows it: Claire is denied when she tries to approve her own reception.

### Q4. What happens if the original real-world information is false but its signature is valid?
**First: Julia, Lucas adds the limit · Slides 8 and 10**
> The ledger can't see inside the meat. A signature proves who said it and that it was not changed afterwards, not that it's true. Three things catch it:
> 1. the receiver must confirm species and weight;
> 2. random DNA tests on at least 10 % of batches;
> 3. the false statement is signed, so the liar is identified and liable under the consortium contract (penalty, then exclusion).
>
> In 2013 this was the missing piece: nobody could prove at which link the label changed.

### Q5. What is the most uncertain cost assumption? How does it affect your decision?
**First: Julia · Slide 6**
> The most uncertain assumption is the number of paying members. With four founders, FreshMeals pays €76k over 3 years, less than the €116k of its own database. If FreshMeals had to pay alone, it would be €305k and the database would win. So the first thing we would secure in the pilot is signed commitments from the two retailers and the lab. Our day rates and hosting prices are also estimates; we would replace them with real quotes during the pilot.

### Q6. Which measurable result would convince a partner to join a pilot?
**First: Elisa, Lucas adds the roadmap · Slides 5 and 12**
> Any pilot batch traced from the ready meal back to its abattoir in under one hour, with 100 % of handovers signed. Today it takes days: Walmart needed almost 7 days to trace mangoes before its blockchain pilot, 2.2 seconds after. One number, easy to test in 6 months on one product line (beef lasagne).

---

## 2. The 6 technical questions (brief, section 3.2)

### T1. What data is stored in one transaction? Give at least three fields.
**First: Julia, or Lucas with the code · Slides 8 and 10**
> A slaughter record contains `record_id`, `event`, `batch_id`, `species`, `weight_kg`, `site` and `date`. A transfer adds `from`, `to` and `species_declared`. A DNA test record contains `lab`, `result` and `report_sha256`, which is the fingerprint of the full PDF report kept off-chain.

### T2. Which information remains confidential or outside the shared ledger?
**First: Julia · Slides 8–9**
> These stay off-chain, in each firm's own systems:
> - prices and contract terms;
> - the list of a supplier's other customers;
> - full lab reports (only their hash is on the ledger);
> - employees' personal data.
>
> On the ledger we keep only what is needed to trace a batch.

### T3. Who submits, approves and validates records? Are these different responsibilities?
**First: Julia · Slide 9**
> Yes, they are three different duties. One organization can hold two of them (FreshMeals both receives and approves), but never on the same record, and no member can accept a block alone:
> - **Submit:** the firm handing over the batch (abattoir, trader, FreshMeals at reception) or the lab for tests.
> - **Approve:** an independent party (the lab or FreshMeals' quality manager), never the creator of the record.
> - **Validate blocks:** four nodes (FreshMeals, retailer A, retailer B, the DNA lab), with 3 of 4 votes needed. The food authority observes but does not vote.

### T4. How will the system detect unauthorized changes to an approved record?
**First: Lucas · Slides 8 and 10**
> Every validator stores the SHA-256 fingerprint of the approved record. If someone changes "HORSE" to "BEEF", the recomputed fingerprint no longer matches: our test shows `b2d7a81a…` becomes `b2c60303…`. Because the block stores that fingerprint and the next block stores the block's hash, the change also breaks the chain (block 41 changes from `9c2833fa…` to `b992d559…`). On top of that, no role has an "edit" right: a mistake is corrected by a new, signed record, never by editing an old one. And for the real 2013 scenario (a *new* document saying "beef"), a business rule compares the declared species with the signed history: our test prints `MISMATCH, batch blocked`.

### T5. What happens if a partner signs an incorrect statement about a real-world event?
**First: Julia · Slide 8**
> Same answer as Q4: integrity is not truth. The wrong statement stays in the history, signed by its author, so we know exactly who said what and when. It is caught by the receiver's check or a random DNA test, then corrected with a new record, and the signer faces contract penalties or exclusion.

### T6. Why does your choice of network and consensus fit the number of participants and their trust relationships?
**First: Julia · Slides 7 and 9**
> About ten known companies take part: 6 suppliers, FreshMeals, 2 retailers, one lab, plus the authority as observer. They are identified and bound by contract, but they don't fully trust each other.
> - A **public** network would expose batches and partners to the world.
> - **PoW or PoS** are designed for anonymous participants, and cost energy or require a token.
> - With **4 known validators and a 3-of-4 vote** (BFT style), blocks are confirmed in seconds and one faulty or dishonest validator can neither block nor fake a block.

---

## 3. Likely trap and follow-up questions

### F1. Why not use an existing EU system like TRACES, or one central EU database?
**Julia**
> For official health certificates, a central system run by the European Commission works, because the Commission is a neutral, trusted operator. But as far as we know, TRACES mainly handles official certificates (imports, live animals). It does not record every private handover of a meat batch between traders inside the EU, and the 2013 meat travelled with ordinary commercial documents. MeatTrace could connect to official systems later.
>
> ⚠️ Our knowledge of the exact scope of TRACES is not verified; don't go into details.

### F2. Suppliers don't run validator nodes. Don't the buyers control the ledger?
**Julia**
> The four validators are three independent buyers, two of them competing retailers, plus an independent lab. No single one of them can add or change a block, because it takes 3 of 4. Suppliers keep a signed receipt of every record they submit, so they can always prove what they declared. The authority watches everything as an observer node. In phase 3, a supplier association can get its own node. We started without supplier nodes because small abattoirs don't have the IT resources, not to exclude them.

### F3. What happens if 2 validators collude?
**Julia**
> Two validators alone cannot add a fake block: they need 3 votes out of 4. They could block the network by refusing to sign; that's the honest limit of a 4-node network, which tolerates only 1 faulty member. Governance handles it: the board can exclude a member, and we plan to add nodes later. With 7 nodes, 2 faulty members are tolerated.

### F4. Why 3 out of 4, and not a simple majority of 2 out of 4?
**Julia**
> With 2 of 4, two conflicting blocks could each get 2 votes, and two colluding members could approve a fake block. With 3 of 4, any two groups of 3 voters share at least 2 members, and at least one of them is honest, so two conflicting blocks can never both be accepted. It's the classic BFT rule: 4 nodes tolerate 1 faulty node.

### F5. Where do your cost numbers come from?
**Julia**
> They are team estimates, clearly marked as assumptions (appendix B):
> - a developer day at €500;
> - about 80 days for the database and 180 days for the ledger and portal;
> - €6k a year of cloud hosting for the database, and €5k a year per node.
>
> We didn't get real quotes; that would be done during the pilot. What matters for the decision is the comparison and the sensitivity: with fewer than 3 co-funders, the database wins.

### F6. Is the 2013 case still relevant today?
**Elisa**
> Yes. Food fraud is still about falsified documents: in a 2022 EU operation (OLAF report 2023), 46 % of 320 imported honey samples were found adulterated, some with forged traceability information. The law still only requires each firm to identify its suppliers and customers ("one step back, one step forward"), so nobody sees the whole chain. Controls did improve after 2013: the European Commission reported far fewer positive horse-DNA tests in 2014.
>
> ⚠️ Check the 2014 figure before quoting it (about 0.6 %).

### F7. What is the difference between hashing and encryption?
**Lucas**
> Hashing is one-way: it turns data into a fixed fingerprint. You can't get the data back, and there is no key. We use it for integrity: has anything changed? Encryption is two-way: data is locked with a key and can be unlocked with the right key. It is used for confidentiality, for example to protect off-chain lab reports and network traffic.

### F8. What is a Merkle root? Did you use one?
**Lucas**
> A Merkle root is a single hash made by hashing transaction hashes two by two up to the top. A partner can then check one transaction without downloading the whole block. Our prototype simply lists the three transaction hashes in the block, which is a simplification. The principle is the same: change one transaction and the block hash changes. A production platform like Hyperledger Fabric handles this for us.

### F9. Why not Proof of Work or Proof of Stake?
**Julia**
> PoW makes anonymous miners solve a costly puzzle (energy). PoS asks validators to lock tokens, so it needs a cryptocurrency. Both exist because, in public networks, nobody knows who the participants are. Our validators are known companies, bound by a contract and identified by certificates, so a simple vote (3 of 4) is enough, faster and free.

### F10. What about GDPR and personal data?
**Julia**
> The ledger holds company data, not personal data: batch IDs, species, weights, company names, hashes. Employees are identified in each company's own login system. The company's certificate signs the records, and we don't write people's names on the chain. That matters because a blockchain cannot delete data, and GDPR gives a right to erasure. Keeping personal data off-chain avoids the conflict.

### F11. TradeLens failed. Why wouldn't you?
**Lucas**
> TradeLens announced its closure in late 2022 (offline in early 2023) despite more than 300 members, for lack of industry collaboration: it was largely led by Maersk and IBM, and many competitors didn't want to join. We reduce that risk in four ways:
> 1. **neutral governance:** 4 founders with one vote each, and no single owner;
> 2. **free for suppliers;**
> 3. **a small start:** one product line, 6 months;
> 4. **a real business need**, pushed by retailers and EU traceability rules.
>
> But we could fail the same way. That's why we have a pilot and a database fallback.

### F12. What does your Python prototype NOT prove?
**Lucas**
> It proves two pieces of logic:
> - **tamper detection:** a changed record gives a different hash and breaks the block;
> - **permission rules:** 2 actions allowed and 3 denied, with separation of duties and revocation.
>
> It does **not** provide real security: anyone running the notebook can edit a Python dictionary. It also does not implement real digital signatures, a network of nodes, consensus, real identities, or proof that the meat is really horse or beef. All of that needs production engineering (slide 12, "Still to build").

### Bonus questions if there is time

- **Why not just anchor hashes on a public blockchain?** (Julia)
  > Good idea as an add-on: publishing one daily hash of our ledger on a public chain costs almost nothing and gives independent proof. But it doesn't replace access rights and shared governance between partners.
- **Why would competing retailers share a network?** (Elisa)
  > They share only proof of origin, not prices or volumes. They have the same interest: no scandal in their meat aisle.
- **What if a supplier refuses to join?** (Elisa)
  > For the pilot product line, FreshMeals buys only from suppliers on the network. Being "verified" becomes a sales argument for honest suppliers.
- **What if a validator's private key is stolen?** (Julia)
  > The board revokes its certificate. The other 3 validators still protect the ledger, and keys are stored in secure hardware.

---

## 4. Concept cheat sheet (applied to MeatTrace)

| Concept | In one or two sentences, for MeatTrace |
|---|---|
| **Ledger** | The shared, append-only history of every batch event. Every validator keeps an identical copy, so nobody owns "the" truth alone. |
| **Transaction** | One business event about a batch: slaughter, transfer, DNA test or reception. It is signed by the organization that performs it. |
| **Block** | A group of validated transactions with a header: block number, timestamp, previous hash, transaction hashes. Our block 41 contains T1, T2 and T3. |
| **Previous hash** | Each block stores the hash of the block before it (block 41 stores `29726fad…`). Changing an old block breaks every later link. |
| **SHA-256** | A function that turns any data into a 64-character fingerprint. One changed letter (HORSE to BEEF) gives a completely different fingerprint. It is one-way. |
| **Digital signature** | The sender signs the record's hash with its **private key** (kept secret); anyone checks it with its **public key**. It proves who issued the record and that it was not changed, not that it's true. |
| **Consensus** | How validators agree on the accepted order of blocks. **PoW:** miners solve a costly puzzle (Bitcoin). **PoS:** validators lock tokens. **Voting/BFT:** known members vote, which is our choice (3 of 4). |
| **Public / private / permissioned** | **Public:** anyone can join and read (Bitcoin). **Private:** one organization controls it. **Permissioned consortium:** several known organizations govern it together, which is ours. |
| **RBAC** | Role-based access control: rights come from the role (abattoir, trader, quality manager, lab, auditor), not from the person. Our `can_do()` checks the role on every request. |
| **Separation of duties** | The person who creates a record cannot approve it. In the test, Claire is denied approval of her own reception REC-007. |
| **Revocation** | When someone leaves or a partner is excluded, access stops. Dan left Delta Trading, so `active = False` and his request is denied. The board can revoke a company's certificate. |
| **Integrity vs agreement vs truth** | The hash protects integrity (not changed), consensus gives agreement (same history for all), and only DNA tests and inspections give truth about the meat. |

---

## 5. Numbers to know by heart

| Figure | What it is | Source |
|---|---|---|
| **≈ 750 t** | Horse meat sold as beef by Spanghero, over about 6 months | French government / anti-fraud office (DGCCRF), via AFP [2] |
| **≈ 4.5 million** | Products made with it | [2] |
| **28 companies, 13 countries** | Reach of the scandal | Al Jazeera [1] |
| **4.66 %** (193 of 4,144) | EU official tests on beef products positive for horse DNA, 2013 | European Commission [3] |
| **46 %** of 320 | Imported honey samples found adulterated, 2022 operation (OLAF report 2023) | OLAF [4] |
| **Art. 18, Reg. 178/2002** | Identify suppliers and customers (the "one step back, one step forward" principle, not a quote) | EU law [5] |
| **~7 days → 2.2 s** | Walmart mango trace, before and after blockchain | LF Decentralized Trust [6] |
| **2022, 300+ members** | TradeLens closure announced, lack of industry collaboration | Container Magazine [7] |
| Carrefour | Blockchain-tracked chicken and pomelos "sold better", **no figure published** | ESM Magazine [8] |
| **€120 M, 6 suppliers, 3 countries, ≈ 1,500 batches a year** | FreshMeals profile | assumption (fictional company) |
| **€50k + 3 × €22k = €116k** | Secure database, 3 years | assumption |
| **€140k + 3 × €55k = €305k** | Consortium, whole network, 3 years | assumption |
| **€76k** (€76,250) | FreshMeals' share, 1 of 4 founders | assumption |
| **≈ €25k** | Per member per year (305 ÷ 4 ÷ 3) | assumption |
| **€189k** | Extra cost of the network over the database | assumption |
| **≈ €2 M** | One full product-line recall (€189k is less than 10 % of it) | assumption |
| **€500/day; 80 days; 180 days** | Day rate; database build; ledger and portal build | assumption |
| **€6k/yr; 4 × €5k/yr** | Hosting: database; network nodes | assumption |
| **< 1 hour; 100 %; ≥ 10 %** | KPI targets: trace time; signed handovers; DNA sample | targets (DNA rate is an assumption) |
| **4 validators, 3 of 4** | Consensus rule, tolerates 1 faulty node | our design |
| **6 users, 5 roles; 2 allowed, 3 denied** | Python test B | our prototype |
| `b2d7a81a…` → `b2c60303…` | Record hash, HORSE vs BEEF | our prototype |
| `9c2833fa…` → `b992d559…` | Block 41 hash, before and after relabelling | our prototype |
| **Oct 2026 / Jan–Jun 2027 / Jul 2027–2028 / 2028+** | Proof of concept / pilot / deployment / improvement | roadmap |

---

## Slide issues found, and status after the audit

1. **Slide 9 vs the code**: fixed. `read_own` added for abattoir and trader in the script, the notebook and slide 11.
2. **Signatures**: the notebook now has an optional RSA signature cell (session 3 style). The "3 of 4 signed" line on slide 8 is marked *illustrative*.
3. **Slide 2, Spanghero**: fixed, the slide now says "(it denied)". Say "according to French investigators" out loud.
4. **Slide 7, private blockchain cost "close to the consortium"**: still a qualitative judgment (same technology, one owner). Say so if asked.
5. **Slides 3 and 5, "today: several days"**: an order of magnitude based on the Walmart example, not a meat-specific study.
6. **Slide 1, date "22 October 2026"**: still to be confirmed by the team.
