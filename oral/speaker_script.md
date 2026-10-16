# MeatTrace — speaker script (IS511E Midterm 1)

Target: **about 13 minutes** (graded window: 10–15 min), then 5 min of questions.
Speak slowly. Short sentences. Look at the audience, not at the slide.
Words in *[brackets]* are actions, not text to say.

## Timing

| Slide | Topic | Speaker | Seconds | Cumulative |
|---|---|---|---|---|
| 1 | Title | Elisa | 30 | 0:30 |
| 2 | The 2013 horse meat scandal | Elisa | 70 | 1:40 |
| 3 | Stakeholders and today's process | Elisa | 65 | 2:45 |
| 4 | Our solution: MeatTrace | Elisa | 65 | 3:50 |
| 5 | Business model and KPIs | Elisa | 55 | 4:45 |
| 6 | Three-year costs | Julia | 60 | 5:45 |
| 7 | Blockchain or database? | Julia | 70 | 6:55 |
| 8 | Transactions, block, hash, signature | Julia | 80 | 8:15 |
| 9 | Consensus, access rights, governance | Julia | 75 | 9:30 |
| 10 | Python test A: integrity | Lucas | 55 | 10:25 |
| 11 | Python test B: access rights | Lucas | 65 | 11:30 |
| 12 | Roadmap, risks, recommendation | Lucas | 75 | 12:45 |
| — | Closing statement | Lucas | 20 | 13:05 |

**Per person:** Elisa 4:45, Julia 4:45, Lucas 3:35 (Lucas also opens the Q&A).
Times assume about 120 words per minute. Rehearse once with a timer: if you are slower, use the "running late" cuts.

Three ideas the professor wants to hear. Say them clearly when they come:
1. **Integrity is not truth.** A hash and a signature show that a record was not changed and who signed it. They do not show that the meat is really horse or beef (slides 8, 10).
2. **A database is a good answer when one trusted party runs everything.** We chose a consortium only because no such party exists here (slides 6, 7, 12).
3. **Our business figures are our own estimates.** Say it simply when you show them (slides 4, 5, 6).

---

## Part 1 — Elisa (slides 1 to 5, about 4:45)

> **If we are running late:** on slide 2, skip the honey example. On slide 4, skip the list "why partners will join". On slide 5, skip the adoption path (Y1, Y2, Y3).

### Slide 1 — Title (Elisa, 30 s)

> Good morning. We are Elisa, Julia and Lucas.
> Our project is called MeatTrace. It is about the food supply chain, and more exactly processed meat in Europe.
> Our idea is a shared, tamper-evident record. Tamper-evident means: if someone changes the record, everybody can see it.
> Our main question is simple: is a blockchain really worth its cost here, or is a normal database enough?

**Key message:** we test if blockchain is worth it, we don't assume it.
**Transition:** "Let's start with a real story."

### Slide 2 — The 2013 horse meat scandal (Elisa, 70 s)

> In 2013, Europe found horse meat in products sold as beef. For example, in Findus frozen lasagne.
> *[point to the chain at the top]* Two abattoirs in Romania sold horse meat. They say it was clearly labelled as horse. Then the meat went to a trader in Cyprus, a warehouse in the Netherlands, and a French wholesaler, Spanghero. According to the French government, Spanghero sold it as beef. Then Comigel made ready meals for 28 companies in 13 countries.
> *[point to the table]* About 750 tonnes of horse meat. About 4.5 million products. And in official EU tests, 4.66 percent of beef products had horse DNA.
> And it is still happening: in a 2022 EU operation, 46 percent of imported honey samples were found adulterated.
> The law asks each company to identify its suppliers and its customers: one step back, one step forward. But nobody sees the whole chain.

**Key message:** the problem is real and documented, and the fraud was a changed label in a document.
**Transition:** "So why was it so hard to find where the label changed? Let's look at the actors."

### Slide 3 — Stakeholders and today's process (Elisa, 65 s)

> Here are the actors. The abattoir wants to prove it labelled correctly. The trader wants to keep its prices secret.
> FreshMeals is our client. We imagined this company, but in a real industry. It makes ready meals and wants to avoid recalls. A recall means taking products back from the shops.
> Retailers need proof of origin. We also have an independent DNA lab and the food safety authority.
> Today, certificates are on paper or PDF, sent by email. Each company keeps them in its own system. To trace one batch, people call and email, one company at a time. Walmart needed almost 7 days to trace mangoes like this.
> So our objective is measurable: trace any beef batch back to its abattoir in **under one hour**, with 100 percent of handovers signed.

**Key message:** no shared version of the facts, so everyone blames the next company.
**Transition:** "Here is our solution."

### Slide 4 — Our solution: MeatTrace (Elisa, 65 s)

> Our client, FreshMeals, has 120 million euros of sales and 6 beef suppliers in 3 countries. These numbers are our own estimates.
> MeatTrace works in four steps for each batch. *[point to the steps]*
> One: the sender records the species, the weight and the batch number, and signs it with the company's digital key.
> Two: the receiver confirms. What arrived must match what was signed. If not, the batch is blocked.
> Three: an independent lab tests a sample, and the DNA result is linked to the batch.
> Four: anyone with the right access can trace the batch, from the meal back to the abattoir, in minutes.
> Partners have reasons to join: retailers get proof of origin, and honest suppliers get a free portal and proof that they did nothing wrong.

**Key message:** every partner signs what it hands over, on one shared record.
**Transition:** "Now, who pays for this?"

### Slide 5 — Business model and KPIs (Elisa, 55 s)

> Four founding members pay: FreshMeals, two retailers and the DNA lab. They share all costs equally, about 25 thousand euros each per year. This is our estimate.
> Suppliers and the authority pay nothing. This is a choice: in this kind of network, getting people to join matters more than fees.
> We follow three KPIs. A KPI is a number that shows if the project works. Trace-back time: from several days to less than one hour. Signed history: from zero to 100 percent of batches. DNA tests: at least 10 percent of batches.
> The biggest benefit: if there is a problem, the recall stays limited to the guilty batches, not the whole product line.

**Key message:** buyers fund it, suppliers join for free, and three numbers show if it works.
**Transition:** "Julia will now show you what it really costs, and why we chose a consortium."

---

## Part 2 — Julia (slides 6 to 9, about 4:45)

> **If we are running late:** on slide 7, skip the public and private rows and go directly to the two boxes at the bottom. On slide 9, say only three rules: separation of duties, revocation, and the board.

### Slide 6 — Three-year costs (Julia, 60 s)

> Thank you, Elisa. Here are the costs over three years. The formula is: setup cost, plus three times the yearly cost. All figures are in euros, and they are our estimates. The details are in appendix B.
> *[point to the bars]* A secure database run by FreshMeals costs 116 thousand euros. The consortium costs 305 thousand euros for the whole network. So yes, the blockchain is more expensive: about 189 thousand euros more.
> But look at the last bar. If four members share the cost, FreshMeals pays only 76 thousand euros. That is less than its own database.
> Our most uncertain assumption is the number of paying members. If FreshMeals has to pay alone, the database wins. We say it clearly.

**Key message:** more expensive in total, cheaper for each member when it is shared.
**Transition:** "So, blockchain or database? Here is our decision."

### Slide 7 — Blockchain or database? (Julia, 70 s)

> We compared four options. *[point to the table]*
> A public blockchain: anyone can verify, but every batch and every partner is visible to the world. Rejected.
> A private blockchain run by FreshMeals: FreshMeals would be judge and party. That means it controls the record and is also part of the dispute. Rejected.
> A secure database is the cheapest and the fastest. And to be honest: when one trusted party runs the whole process, a database is enough, and we would recommend it.
> But here, it is not the case. We have six or more independent firms, in three or more countries. Some are competitors, and in 2013 they all blamed each other. Nobody accepts that a rival controls the history.
> So we choose a permissioned consortium. Permissioned means only approved members can join. Every member keeps a copy, and nobody can rewrite it alone. The database stays our fallback.

**Key message:** we use blockchain because there is no referee that everyone trusts, not because it is fashionable.
**Transition:** "Now, how does it work inside?"

### Slide 8 — Transactions, block, hash, signature (Julia, 80 s)

> Each handover becomes a transaction. We have three: slaughter, transfer and DNA test. *[point to the table]* Here are the fields we protect, for example batch ID, species and weight.
> We protect them with a hash. A hash is like a fingerprint. SHA-256 turns the fields into 64 characters. If you change one letter, the fingerprint changes completely.
> Then the sender signs this fingerprint with its private key. Everybody can check it with the public key. The signature proves who sent the record, and that nobody changed it.
> *[point to the blocks]* This is block 41. It contains the hashes of our three transactions, and the hash of block 40. This link makes the chain. These are real values from our Python code.
> Prices, contracts and full lab reports stay inside each company. Only their hash is shared.
> One important point: **integrity is not truth**. If a partner signs something false, the hash cannot see it. That is why we need random DNA tests, and a contract with penalties.

**Key message:** hash and signature show changes and who signed, but not if the information is true.
**Transition:** "Who decides which blocks are accepted, and who can do what?"

### Slide 9 — Consensus, access rights, governance (Julia, 75 s)

> We have four validators: FreshMeals, two retailers and the DNA lab. A block is accepted when 3 of 4 sign it. So one bad member cannot block the network or create a fake block.
> We don't need mining, called Proof of Work, or tokens, called Proof of Stake, because all members are known and bound by a contract. The authority can read everything, but it does not vote.
> *[point to the table]* The table shows who can do what. For example, the abattoir creates slaughter records, but it cannot approve them. The FreshMeals quality manager can approve, but never their own records.
> Our main rules: each company has a digital certificate, and each employee a personal account. Nobody approves a record they created. When someone leaves, the account is closed the same day. And the board of founders votes on new members: 3 votes out of 4. In a dispute about species, the DNA result decides.

**Key message:** being in the network does not give all rights. Roles decide.
**Transition:** "Lucas will now show you our Python prototype."

---

## Part 3 — Lucas (slides 10 to 12, about 3:35, then Q&A)

> **If we are running late:** on slide 10, skip the sentence about block 41. On slide 11, present only one allowed test and the three denied ones. On slide 12, read only the recommendation box.

### Slide 10 — Python test A: integrity (Lucas, 55 s)

> Thank you, Julia. Our first Python test is about integrity.
> We take the slaughter record of batch RO-2026-0412, with species HORSE. Our function `record_hash` turns the record into stable text and computes its SHA-256 hash.
> Then we do the 2013 fraud: a new record, with species BEEF. *[point to the output]* The hash is completely different. Python prints: "Same record? False". The block hash changes too, so block 41 is no longer valid.
> For the business: every validator keeps the approved fingerprint, so nobody can secretly edit an old record.
> But in 2013 the fraud was a new document saying "beef". So we added a business rule: the species declared must equal the species signed in the history. *[point to the last output lines]* Python says: MISMATCH, batch blocked.
> But the hash only proves the record was not changed. It does not prove the abattoir told the truth. That is the DNA test's job.

**Key message:** changing one word changes the whole fingerprint, so changes cannot stay hidden.
**Transition:** "Our second test is about who is allowed to do what."

### Slide 11 — Python test B: access rights (Lucas, 65 s)

> We have 6 users and 5 roles. One function, `can_do`, checks every request. It asks three questions. Is the account still active? Does the role have this right? And for an approval: did this person create the record?
> We ran five tests. *[point to the table]* Two are allowed. Anna, from the DNA lab, approves the abattoir's record: this is an independent check. Claire, from FreshMeals, reads the batch history before cooking.
> Three are denied. Pieter, the trader, tries to edit the record. No role has this right, so the 2013 relabelling is blocked. Claire tries to approve her own reception record: denied, because of separation of duties. And Dan has left the trading company, so his account is revoked: he cannot sign for his old company.
> In a real system, this check runs on every node, not in a notebook.

**Key message:** each denial stops a real business risk: relabelling, self-approval, and ex-employees.
**Transition:** "To finish, how do we go from this prototype to a real service?"

### Slide 12 — Roadmap, risks, recommendation (Lucas, 75 s)

> We see four stages. *[point to the steps]* One: the proof of concept, done this month. Two: a six-month pilot in 2027, with FreshMeals, 3 suppliers and the lab, on one product: beef lasagne. Three: all suppliers and the two retailers join. Four: we check the KPIs every quarter, and we add chicken and pork.
> The biggest risk is that partners do not join. TradeLens, a shipping blockchain by Maersk and IBM with more than 300 members, announced its closure in 2022 for this reason. That is why suppliers join for free, with a simple portal. Against false data, we use random DNA tests.
> Our recommendation: build MeatTrace as a permissioned consortium. 305 thousand euros over three years, 76 thousand for FreshMeals.
> Its limit: it cannot see inside the meat, so DNA tests stay essential. And if we don't find three co-funders, we choose the secure database.
> Our first pilot target: 100 percent of pilot batches traced to the abattoir in under one hour.

**Key message:** start small, measure one number, and scale only if it works.
**Transition:** the closing statement.

### Closing statement (Lucas, 20 s)

> The 2013 fraud was a changed label between companies that did not trust each other.
> MeatTrace makes every change visible and every handover signed, at a fair cost when it is shared.
> Thank you. We are happy to answer your questions.

---

## Opening the Q&A (Lucas)

Lucas takes the first question, then gives it to the right person:

| Question about… | First answer | Backup |
|---|---|---|
| The scandal, stakeholders, solution, KPIs | Elisa | Lucas |
| Costs, blockchain vs database, block, consensus, governance | Julia | Lucas |
| Python code, roadmap, risks | Lucas | Julia |

Everyone must be able to answer any question. If you don't know, say: "Good question. Our assumption here is…" and give the slide number where it is.
Keep the Python code ready to run live (`prototype/meattrace_demo.py`) in case the professor asks to see it.
