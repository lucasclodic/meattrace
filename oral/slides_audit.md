# Audit des slides MeatTrace, vues par le prof (16/10/2026)

> **Statut au 16/10/2026, après l'audit** : corrections appliquées dans les slides, le code, le notebook, le script et le kit Q&A : M1, M2, M3, M4, M5, S1, S2, S3, S4, S6, S7, S9, S10, N5, N7.
> Restent à décider : S8 (date de l'oral), N1, N3, N4, N6, N8, N9.


Fichiers audités :
- `slides/meattrace_slides.html` et son PDF (14 pages)
- `prototype/meattrace_demo.py` et `demo_output.txt`
- le sujet `IS511E_Midterm1_Project_Overleaf_100.pdf` et `consignes_teams.md`

Les textes de remplacement sont en anglais, prêts à coller dans le HTML.

## Verdict

**Note estimée : 84/100** (fourchette 80–88). Le deck couvre presque tout le sujet, les chiffres sont cohérents et les sources tiennent. On perd des points sur quatre choses :
- une phrase fausse sur la séparation des rôles (slide 9) ;
- un scénario de fraude que le prototype ne couvre pas exactement (slide 10) ;
- le consensus, qui n'est pas nommé ;
- quelques formulations de sources trop fortes.

Le notebook exécutable, exigé pour les questions, n'existe pas encore.

---

## 1. Ce que le sujet demande : présent ou non ?

| Exigence du sujet | État | Slide |
|---|---|---|
| 1.2 Q1 : organisation, secteur et processus actuel | ✅ Présent | 3, 4 |
| 1.2 Q2 : au moins 3 parties prenantes et leurs intérêts | ✅ Présent (6) | 3 |
| 1.2 Q3 : problème concret et mesurable | ✅ Présent | 2, 3 |
| 1.2 Q4 : gestion actuelle (papier, e-mail, ERP) | ✅ Présent | 3 |
| 1.2 Q5 : au moins 2 sources avec URL fonctionnelle | ⚠️ Partiel : 8 sources, mais URL en texte, pas cliquables, et sans `https://` | Annexe A |
| 1.2 Q6 : objectif mesurable | ✅ Présent (< 1 h, 100 % signés) | 3 |
| 2 : utilisateurs, et qui paie | ✅ Présent | 4, 5 |
| 2 : proposition de valeur, et pourquoi les partenaires adoptent | ✅ Présent | 4 |
| 2 : marché et adoption (qui rejoint en premier, combien d'organisations) | ✅ Présent (Y1/Y2/Y3) | 5 |
| 2 : modèle de financement | ✅ Présent | 5 |
| 2 : ressources | ⚠️ Partiel : seulement dans le pied de page | 5 |
| 2 : coûts (mise en place, annuels, frais de réseau) | ✅ Présent | 6, annexe B |
| 2 : bénéfices | ⚠️ Partiel : le rappel produit à 2 M€ est une hypothèse sans repère | 5 |
| 2 : 2 ou 3 KPI | ✅ Présent (3) | 5 |
| 2.1 : comparaison sur 3 ans, base de données incluse, devise, hypothèses | ✅ Présent | 6, annexe B |
| 2.1 : bénéfice qui justifie le surcoût de la blockchain | ✅ Présent | 6 (pied de page), 12 |
| 3 S1 : registre actuel, et pourquoi un registre partagé | ✅ Présent | 3, 7 |
| 3 S2 : 3 transactions, 1 bloc, lien vers le hash précédent | ✅ Présent | 8 |
| 3 S3 : champs hashés, qui signe, ce que prouve la signature | ✅ Présent | 8 |
| 3 S4 : **qui fixe l'ordre accepté** des enregistrements | ⚠️ Partiel : on parle du vote, pas de l'ordre ni du proposeur, et le mécanisme n'est pas nommé | 9 |
| 3 S5 : public, privé, consortium ou base de données | ✅ Présent | 7 |
| 3.1 : workflow Create → Authorize → Verify → Agree → Audit | ❌ Absent tel quel (slide 4 a un autre processus en 4 étapes) | 8 conseillé |
| 3.2 Q1 : au moins 3 champs par transaction | ✅ Présent | 8 |
| 3.2 Q2 : ce qui reste confidentiel ou hors chaîne | ✅ Présent | 8, 9 |
| 3.2 Q3 : qui soumet, approuve et valide | ⚠️ Présent, mais la phrase de conclusion est fausse (voir M1) | 9 |
| 3.2 Q4 : détection d'une modification non autorisée | ✅ Présent | 8, 10 |
| 3.2 Q5 : partenaire qui signe une fausse déclaration | ✅ Présent | 8 |
| 3.2 Q6 : pourquoi ce réseau et ce consensus | ✅ Présent | 7, 9 |
| 4 : matrice des droits | ✅ Présent | 9 |
| 4.1 : identité, autorisation, séparation des tâches, confidentialité, révocation, gouvernance | ✅ Présent (6 sur 6) | 9 |
| 4.2 : comparaison des architectures et décision | ✅ Présent | 7 |
| 5.1 : dictionnaire, texte stable, SHA-256, modification, explication | ✅ Présent | 10 |
| 5.2 : au moins 4 utilisateurs, 3 rôles, une fonction, 1 autorisé et 2 refusés, risque business | ✅ Présent (6 utilisateurs, 5 rôles, 2 autorisés, 3 refusés) | 11 |
| 5.3 : code court, tableau de résultats, interprétation | ✅ Présent | 10, 11 |
| 5.3 et 7.2 : **notebook exécutable prêt pour les questions** | ❌ Absent (seulement un script `.py`) | — |
| 6 : étapes de mise en œuvre | ✅ Présent (4) | 12 |
| 6 : **coûts** par étape | ⚠️ Partiel : seul le total est donné | 12 |
| 6.1 : les 5 risques et leurs parades | ✅ Présent (5 sur 5) | 12 |
| Recommandation : quoi, pour qui, coût, valeur, limites | ✅ Présent | 12 |
| Recommandation : **premier objectif mesurable du pilote** | ⚠️ Seulement dans le pied de page | 12 |
| Recommandation : ce que montre le prototype et ce qui reste à construire | ✅ Présent | 12 |
| 7.1 : structure en 12 slides | ✅ Présent, les 12 slides correspondent | 1–12 |
| 7.1 : annexe de 3 pages maximum | ✅ Présent (2 pages) | A, B |
| 7.2 : noms complets sur la slide 1 | ✅ Présent | 1 |
| 7.2 : hypothèses signalées | ✅ Présent | 4, 5, 6 |

---

## 2. Barème estimé (section 8 du sujet)

| Critère | Points | Estimation | Ce qui ferait monter la note |
|---|---|---|---|
| Problème et preuves | 15 | **13** | URL cliquables. Attribuer clairement les affirmations (abattoirs, Spanghero). Corriger les formulations OLAF et art. 18 (S4–S6). |
| Business plan et faisabilité | 15 | **12** | Coûts par étape sur la slide 12 (S2). Un repère sourcé pour le coût d'un rappel produit (N1). Ressources sorties du pied de page. |
| Raisonnement blockchain | 25 | **21** | Corriger la slide 9 (M1). Nommer le consensus et expliquer l'ordre des blocs (M3). Ajouter le workflow 3.1 (S1). Couvrir le vrai scénario de fraude (M2). |
| Droits d'accès et gouvernance | 15 | **13** | Aligner la matrice et le code (S3). Ajouter le rôle d'opérateur ou de conseil du consortium (N4). |
| Prototype Python | 15 | **13** | Notebook exécutable (M5). Règle « espèce déclarée = espèce signée » (M2). Optionnel : signature RSA comme en séance 3. |
| Présentation et questions | 15 | **12** | Les slides 9 et 12 sont denses à l'oral. Préparer les questions pièges listées en section 5. |
| **Total** | **100** | **≈ 84** | |

---

## 3. Cohérence des chiffres

Les calculs sont tous justes :
- 193 / 4 144 = 4,66 %
- 305 / 4 / 3 = 25,4 k€ par membre et par an
- 140 / 4 = 35 k€ ; 55 / 4 = 13,75 k€ ; 35 + 3 × 13,75 = 76,25 k€
- 305 − 116 = 189 k€, soit 9,45 % de 2 M€
- Les sommes de l'annexe B tombent juste (50 / 22 / 140 / 55), comme les jours (12 000 / 500 = 24 ; 25 000 / 500 = 50).

Les hash affichés correspondent tous à `demo_output.txt`, préfixes et suffixes compris :
- slide 1 : `b2d7a81a…72e6`, `b2c60303…bc52` ;
- slide 8 : blocs 40 et 41, T1 à T3 et hash du bloc ;
- slide 10 : hash complets et hash du bloc après modification.

Les 6 utilisateurs et 5 rôles de la slide 11 sont bien ceux du code.

**Écarts relevés :**

| Où | Écart | Gravité |
|---|---|---|
| Slide 9 contre le code | La matrice donne à l'abattoir « Read : own batches » et au négociant « Read : batches it held », mais le code ne leur donne aucun droit de lecture | Should-fix (S3) |
| Slide 9, note | « held by different organizations » est faux. Dans la matrice, FreshMeals crée, approuve et valide, et le labo aussi | **Must-fix (M1)** |
| Slide 9 contre slide 12 | La slide 9 dit « Suppliers can run a node in phase 3 », mais l'étape 3 de la slide 12 n'en parle pas | Should-fix (S7) |
| Slide 8, bloc 41 | Horodatage affiché `2026-10-06T09:14Z` contre `…09:14:00Z` dans le code. La ligne « validators 3 of 4 signed » ne fait pas partie du hash calculé : elle est illustrative | Nice-to-have (N5) |
| Slide 8, T3 | `report_sha256` hashe un dictionnaire qui contient le *nom* du fichier, pas son contenu | Nice-to-have (N6, à corriger dans le notebook) |
| Slide 1 | Date « 22 October 2026 » non confirmée | Should-fix (S8) |

---

## 4. Vérification des faits

| Affirmation sur les slides | Vérification | Verdict |
|---|---|---|
| ≈ 750 t sur environ 6 mois, selon le gouvernement français | AFP via IOL, 14/02/2013 : « knowingly sold around 750 tonnes… over six months » | ✅ Ajouter que Spanghero a **nié** (N7) |
| ≈ 4,5 millions de produits | Conclusions de la DGCCRF reprises par l'AFP : 4,5 millions de produits vendus par Comigel à 28 entreprises dans 13 pays | ✅ |
| 28 entreprises, 13 pays | Al Jazeera, 15/02/2013 | ✅ |
| Chaîne Roumanie → Chypre → Pays-Bas → Spanghero → Comigel → Findus | Al Jazeera | ✅ |
| « clearly labelled as horse » | Al Jazeera : ce sont les abattoirs eux-mêmes qui le disent | ⚠️ À attribuer : « say they… » (S4) |
| 4,66 % = 193 / 4 144 | Page de la Commission européenne (DG SANTE) | ✅ |
| « In a 2023 EU action, 46 % of 320 imported honey samples were suspected of fraud » | OLAF : « analysis of 320 samples… 46 % was adulterated », opération **2022** « From the Hives », publiée dans le rapport OLAF 2023, avec « forging of traceability information » | ⚠️ Année et formulation à corriger (S5) |
| Walmart : environ 7 jours → 2,2 s | Étude de cas LF Decentralized Trust | ✅ C'était une démonstration de 2016 |
| TradeLens « closed in 2022 despite 300+ members » | Fermeture **annoncée** fin novembre 2022, arrêt fin du 1er trimestre 2023, plus de 300 membres | ⚠️ Écrire « announced its closure in 2022 » (S6) |
| « Carrefour reported better sales for blockchain-tracked products » | ESM, 04/06/2019 : pomelos « sold faster », « positive impact on the chicken ». **Aucun chiffre** | ⚠️ Trop général, à préciser (S6) |
| Art. 18 entre guillemets : « one step back, one step forward » | Le texte de l'art. 18 dit « identify any person from whom they have been supplied » et « identify the other businesses to which their products have been supplied ». **La formule n'est pas dans le texte** : c'est le nom courant du principe | ⚠️ Ne pas la présenter comme une citation (S5) |

---

## 5. Raisonnement technique : ce que le prof peut attaquer

1. **Slide 9, « held by different organizations »** : faux, voir M1. Le prof peut le démonter en lisant votre propre matrice.
2. **Le scénario de 2013 ne revient pas à modifier l'enregistrement de l'abattoir** (slide 10). Spanghero n'aurait pas réécrit le registre de l'abattoir. Il aurait créé un **nouveau** transfert déclarant « BEEF ». Le test de hash ne détecte pas ça. C'est une règle métier qui le détecte : l'espèce déclarée doit être égale à l'espèce signée dans l'historique. À dire sur la slide et à coder dans le notebook (M2).
3. **Consensus non nommé, ordre non expliqué** (slide 9) : 3 sur 4 est correct pour une tolérance aux pannes byzantines (n = 3f + 1, f = 1, quorum 2f + 1 = 3). Mais il faut dire qui propose le bloc et comment l'ordre est fixé (M3). Question probable : « avec 2 validateurs en panne ? » Réponse : plus de bloc tant qu'ils ne sont pas revenus. Les données ne sont ni perdues ni falsifiées, c'est un choix de sécurité plutôt que de disponibilité.
4. **Signatures** : les slides 4 et 8 affirment que tout est signé, mais le prototype ne signe rien. Le sujet ne l'exige pas pour le Python, mais le prof peut demander « où est la signature dans votre code ? ». Réponse : démontrée en séance 3 avec `rsa`, à ajouter en extension dans le notebook (N2).
5. **Public blockchain rejetée** (slide 7) : on peut objecter qu'il suffirait d'ancrer seulement les hash sur une chaîne publique (solution hybride). Préparer la réponse : coût et frais variables, aucune gouvernance des droits, ça ne règle pas qui a le droit d'écrire. Possible en phase 4 pour un audit public (N3).
6. **Point bien traité** : intégrité, accord et vérité sont distingués (slides 8 et 10), exactement le message du sujet.

---

## 6. Rendu

- Nom de fichier : le message Teams l'emporte sur le PDF du sujet → `IS511E_Midterm1_Lucas_Clodic.pdf` ✅. Elisa et Julia doivent déposer **la même copie** sous `IS511E_Midterm1_Elisa_Ouillet.pdf` et `IS511E_Midterm1_Julia_Kozhina.pdf`.
- Noms complets des 3 membres sur la slide 1 ✅
- 14 pages = 12 slides + 2 pages d'annexe, sous la limite de 3 ✅
- Polices intégrées au PDF (Archivo, JetBrains Mono) ✅
- Références non cliquables dans le PDF ⚠️ (S9)

---

## 7. Corrections, par priorité

### MUST-FIX

**M1, slide 9, note sous la matrice (énoncé faux)**
Remplacer :
`Submit, approve and validate are separate duties held by different organizations.`
par :
`Separate duties: nobody approves their own record, the approver is never the submitter, and no single member can accept a block alone (3 of 4 votes).`

**M2, slide 10, 1re puce de « What it means for the business »** (le vrai scénario de 2013)
Remplacer :
`Every validator stores the approved fingerprint. A relabelled batch no longer matches, so the next partner or an auditor sees it at once.`
par :
`Every validator stores the approved fingerprint: editing the abattoir's record no longer matches. In 2013 the fraud was a new document saying "beef"; MeatTrace flags it because the declared species must equal the signed history.`
Dans le notebook (pour les questions), ajouter le test : un transfert déclarant `species_declared = "BEEF"` sur un lot signé « HORSE » doit afficher `MISMATCH`.

**M3, slide 9, panneau Consensus** (nommer le mécanisme et expliquer l'ordre)
Remplacer le paragraphe par :
`Validators take turns proposing the next block. It is accepted, and its place in the order fixed, when 3 of 4 sign it (Byzantine-fault-tolerant voting, as in PBFT). So one faulty or dishonest member can neither block nor fake a block. Members are known and bound by contract: no mining (PoW) or staking (PoS) needed.`

**M4, slides 2 et 5, formulations de sources trop fortes**
- Slide 2, nœud abattoirs : `“clearly labelled as horse”` → `say it was “clearly labelled as horse”`
- Slide 2, encadré honey : `In a 2023 EU action, <b>46 %</b> of 320 imported honey samples were suspected of fraud, often with falsified traceability documents.` → `In a 2022 EU operation, <b>46 %</b> of 320 imported honey samples were found adulterated, some with forged traceability information.`
- Slide 2, encadré art. 18 : `each firm must know its supplier and its customer (“one step back, one step forward”).` → `each firm must be able to identify its suppliers and its customers, the “one step back, one step forward” principle.`
- Slide 5, Carrefour : `Proof of origin sells: Carrefour reported better sales for blockchain-tracked products` → `Proof of origin sells: Carrefour said its blockchain-tracked chicken and pomelos sold better (no figures published)`

**M5, notebook exécutable** (sujet 5.3 et 7.2, hors slides mais exigé pour les questions)
Convertir `prototype/meattrace_demo.py` en `.ipynb`, exécuté, avec les **mêmes valeurs** pour que les hash des slides 1, 8 et 10 restent identiques. Y ajouter le test M2.

### SHOULD-FIX

**S1, slide 8, workflow 3.1 du sujet** (absent)
Ajouter en bas de la colonne de gauche, sous « Off-chain » :
`Workflow: Create (abattoir records the batch) → Authorize (role check) → Verify (hash + signature) → Agree (3 of 4 validators) → Audit (shared history).`

**S2, slide 12, coûts par étape** (exigés par la section 6)
Remplacer les textes des étapes 2 à 4 par :
- `FreshMeals, 3 suppliers, DNA lab, one product: beef lasagne. ≈ €70k of the €140k setup (assumption).`
- `All 6 suppliers, 2 retailers, authority as observer. Remaining ≈ €70k setup, then €55k a year.`
- `Quarterly KPI review. Extend to chicken and pork, admit new buyers. €55k a year, shared.`

**S3, slide 9 contre le code, droits de lecture**
Dans le code (et dans l'extrait de la slide 11), ajouter `"read_own"` aux rôles abattoir et trader :
```python
"abattoir": {"create_record", "read_own"},
"trader":   {"create_record", "read_own"},
```
Les résultats des 5 tests ne changent pas.

**S4, slide 2, nœud Spanghero**
`sold it as beef` → `sold it as beef (it denied)`

**S5** est couvert par M4 (honey et art. 18).

**S6, slide 12, TradeLens**
`TradeLens closed in 2022 despite 300+ members, for lack of industry collaboration` → `TradeLens (300+ members) announced its closure in 2022 for lack of industry collaboration`

**S7, slide 12, étape 3**
Ajouter `Suppliers may run their own node.` ou supprimer cette phrase sur la slide 9.

**S8, slide 1, date** : confirmer le 22 octobre 2026, sinon corriger.

**S9, annexe A, URL cliquables**
Entourer chaque URL d'un lien complet, par exemple :
`<a href="https://www.aljazeera.com/news/2013/2/15/france-says-horse-meat-tip-offs-ignored">aljazeera.com/news/…</a>`
Chrome garde les liens dans le PDF.

**S10, slide 12, objectif du pilote dans la recommandation**
Ajouter dans le cadre « Our recommendation », avant « Still to build » :
`<p><b>First pilot target:</b> 100 % of pilot batches traced to the abattoir in under one hour.</p>`

### NICE-TO-HAVE

- **N1, slide 5, repère pour le coût d'un rappel** : `One full recall ≈ €2 M (assumption)` → `One full recall ≈ €2 M (assumption; industry surveys cite ≈ $10 M in direct costs on average)`. Source secondaire : Food Safety Magazine, chiffre FMI/GMA. Original non retrouvé, à citer avec prudence.
- **N2, notebook** : extension signature RSA (bibliothèque `rsa`, séance 3). Signer T1, vérifier, puis montrer que la vérification échoue après modification.
- **N3, slide 7** : sous le tableau, une ligne : `A hybrid (consortium + hashes anchored on a public chain) is possible later for public audits.`
- **N4, slide 9** : ajouter le rôle « Consortium board » (Create : accounts only, Approve : no, Read : audit metadata, Validate : no), comme dans l'exemple du sujet.
- **N5, slide 8** : horodatage `2026-10-06T09:14:00Z` exact, et `validators 3 of 4 signed` en gris avec « (illustrative) ».
- **N6, notebook** : calculer `report_sha256` sur le contenu du rapport, pas sur son nom.
- **N7, slide 11, anglais** : `dan, has left the trader, creates a record` → `dan, who left the trading firm, tries to create a record`
- **N8, lisibilité** : les slides 9 et 12 sont denses (texte à 14 px). À l'oral, ne lire que la matrice et la recommandation.
- **N9, contexte RBS** : un équivalent en dirhams des coûts de la slide 6, si le taux est vérifié (environ 10,8 MAD/€, à confirmer).
