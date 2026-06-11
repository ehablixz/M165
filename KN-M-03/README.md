# KN-M-03: Datenmanipulation und Abfragen I

**Datenbank:** `projektverwaltung`  
**Collections:** `freelancer`, `projekte`, `kunden`

---

## A) Daten hinzufügen – `A_insert.js`

- **3 Kunden** via `insertMany()`
- **4 Freelancer** via `insertMany()` (mit eingebetteten `faehigkeiten`-Arrays)
- **5 Projekte**: 1× `insertOne()` + 4× `insertMany()`
- Alle `_id`-Felder via `new ObjectId()` als Variablen gesetzt
- Referenzen (`kunde_id`, `freelancer_ids`) nutzen die Variablen

![A insert](img/A_insert.png)

## B) Daten löschen

**B1_drop_all.js** – Löscht alle 3 Collections mit `drop()`

![B1 drop all](img/B1_drop_all.png)

**B2_delete_partial.js**:
- `deleteOne()` auf `kunden` (Filterung auf `_id`)
- `deleteMany()` auf `projekte` mit `$or` auf 2 `_id`s (löscht nicht alle)

![B2 delete partial](img/B2_delete_partial.png)

## C) Daten abfragen – `C_queries.js`

| Abfrage | Collection | Besonderheit |
|---------|------------|-------------|
| Land = "Schweiz" | kunden | einfach |
| Land = DE ODER FR | kunden | `$or`, Projektion **mit** `_id` |
| Registrierung < 2022 | freelancer | **DateTime-Filter** |
| Stundensatz > 80 UND Bewertung ≥ 4.5 | freelancer | `$and` |
| E-Mail endet auf ".ch" | freelancer | **Regex**, Projektion **ohne** `_id` |
| Startdatum > 01.03.2024 | projekte | DateTime-Filter |
| Titel enthält "Plattform" oder "Portal" | projekte | **Regex**, Projektion **mit** `_id` |
| Status = "laufend" | projekte | Projektion **ohne** `_id` |

![C query 1 – kunden Schweiz](img/C_query_1_kunden_schweiz.png)
![C query 2 – kunden ODER](img/C_query_2_kunden_oder.png)
![C query 3 – freelancer DateTime](img/C_query_3_freelancer_datetime.png)
![C query 4 – freelancer AND](img/C_query_4_freelancer_and.png)
![C query 5 – freelancer Regex](img/C_query_5_freelancer_regex.png)
![C query 6 – projekte DateTime](img/C_query_6_projekte_datetime.png)
![C query 7 – projekte Regex](img/C_query_7_projekte_regex.png)
![C query 8 – projekte laufend](img/C_query_8_projekte_laufend.png)

## D) Daten verändern – `D_updates.js`

| Befehl | Collection | Beschreibung |
|--------|------------|-------------|
| `updateOne()` | projekte | Status + Enddatum ändern (Filter: `_id`) |
| `updateMany()` | freelancer | Stundensatz +5 für CH-Freelancer ODER Bewertung < 4.0 (kein `_id`) |
| `replaceOne()` | kunden | Gesamtes Dokument von MediaFlow GmbH ersetzen |

![D updateOne projekte](img/D_update_one_projekte.png)
![D updateMany freelancer](img/D_update_many_freelancer.png)
![D replaceOne kunden](img/D_replace_one_kunden.png)

---
