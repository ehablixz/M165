# KN-M-02: Datenmodellierung für MongoDB

**Thema: Freelance-Projektverwaltung**

---

## A) Konzeptionelles Datenmodell (30%)

### Diagramm

```mermaid
erDiagram
    FREELANCER {
        string name
        string email
        float stundensatz
        date registrierungsdatum
        float bewertung
    }
    PROJEKT {
        string titel
        date startdatum
        date enddatum
        float budget
        string status
    }
    KUNDE {
        string firmenname
        string kontaktperson
        string email
        string branche
        string land
    }
    FAEHIGKEIT {
        string bezeichnung
        string kategorie
        string erfahrungsstufe
        float nachfrage
    }

    FREELANCER }|--|{ PROJEKT : "arbeitet an"
    FREELANCER }|--|{ FAEHIGKEIT : "besitzt"
    KUNDE ||--|{ PROJEKT : "beauftragt"
    PROJEKT }|--|{ FAEHIGKEIT : "erfordert"

```
[Konzeptionelles Datenmodell](conceptual_model.mermaid)

---

### Entitäten

**Freelancer**
Eine Person, die selbstständig für verschiedene Kunden arbeitet. Jeder Freelancer hat einen Namen, eine E-Mail-Adresse, einen Stundensatz (float), ein Registrierungsdatum sowie eine Durchschnittsbewertung (float). Freelancer können an mehreren Projekten gleichzeitig beteiligt sein und besitzen verschiedene Fähigkeiten.

**Projekt**
Ein Auftrag, der von einem Kunden an einen oder mehrere Freelancer vergeben wird. Ein Projekt hat einen Titel, ein Start- und Enddatum, ein Budget (float) sowie einen Status (z.B. "in Bearbeitung", "abgeschlossen", "pausiert"). Für ein Projekt können spezifische Fähigkeiten vorausgesetzt werden.

**Kunde**
Das Unternehmen oder die Person, welche Projekte in Auftrag gibt. Ein Kunde hat einen Firmennamen, eine Kontaktperson, eine E-Mail-Adresse, eine Branche sowie ein Herkunftsland. Ein Kunde kann mehrere Projekte gleichzeitig laufen haben.

**Fähigkeit**
Eine konkrete Kompetenz, die ein Freelancer besitzen oder die ein Projekt erfordern kann (z.B. "React", "UX-Design", "SEO"). Eine Fähigkeit hat eine Bezeichnung, eine Kategorie (z.B. "Webentwicklung"), eine Erfahrungsstufe sowie einen Nachfragewert (float).

---

### Beziehungen

| Von | Nach | Typ | Beschreibung |
|-----|------|-----|-------------|
| Freelancer | Projekt | **N:N** | Ein Freelancer arbeitet an vielen Projekten; ein Projekt kann mehrere Freelancer haben. |
| Freelancer | Fähigkeit | **N:N** | Ein Freelancer besitzt viele Fähigkeiten; eine Fähigkeit kann von vielen Freelancern besessen werden. |
| Kunde | Projekt | **1:N** | Ein Kunde beauftragt viele Projekte; jedes Projekt gehört genau einem Kunden. |
| Projekt | Fähigkeit | **N:N** | Ein Projekt erfordert mehrere Fähigkeiten; eine Fähigkeit kann von vielen Projekten gefordert werden. |

Die zentrale **N:N-Beziehung** ist jene zwischen Freelancer und Projekt: Ein Freelancer kann an mehreren Projekten gleichzeitig arbeiten, und ein Projekt kann von einem Team aus mehreren Freelancern umgesetzt werden.

---

## B) Logisches Modell für MongoDB (60%)

### Diagramm
```mermaid
erDiagram
    freelancer {
        ObjectId _id PK
        string name
        string email
        float stundensatz
        date registrierungsdatum
        float bewertung
        ObjectId faehigkeit_ids FK
    }
    kontakt {
        string telefon
        string website
        string linkedin
        string wohnort
    }
    projekte {
        ObjectId _id PK
        string titel
        date startdatum
        date enddatum
        float budget
        string status
        ObjectId kunde_id FK
        ObjectId freelancer_ids FK
    }
    meilensteine {
        string bezeichnung
        date faelligkeitsdatum
        float betrag
        int abgeschlossen
        string kommentar
    }
    kunden {
        ObjectId _id PK
        string firmenname
        string kontaktperson
        string email
        string branche
        string land
    }
    faehigkeiten {
        ObjectId _id PK
        string bezeichnung
        string kategorie
        string erfahrungsstufe
        float nachfrage
    }

    freelancer ||--|| kontakt : "eingebettet"
    freelancer }|--|{ faehigkeiten : "referenz"
    projekte ||--|{ meilensteine : "eingebettet"
    projekte }|--|{ freelancer : "referenz"
    projekte }|--|| kunden : "referenz"

```
[Logisches Datenmodell](logical_model.mermaid)

---

### Collections und Felder

#### Collection: `freelancer`

| Feld | Datentyp | Beschreibung |
|------|----------|-------------|
| `_id` | ObjectId | Primärschlüssel (automatisch) |
| `name` | string | Vollständiger Name |
| `email` | string | E-Mail-Adresse |
| `stundensatz` | float | Stundenlohn in CHF |
| `registrierungsdatum` | date | Datum der Registrierung auf der Plattform |
| `bewertung` | float | Durchschnittliche Kundenbewertung (1–5) |
| `faehigkeit_ids` | [ObjectId] | Referenz-Array auf `faehigkeiten`-Collection |
| `kontakt` | **object** | **Eingebettetes Sub-Dokument** |
| `kontakt.telefon` | string | Telefonnummer |
| `kontakt.website` | string | Persönliche Website |
| `kontakt.linkedin` | string | LinkedIn-Profil-URL |
| `kontakt.wohnort` | string | Wohnort des Freelancers |

#### Collection: `projekte`

| Feld | Datentyp | Beschreibung |
|------|----------|-------------|
| `_id` | ObjectId | Primärschlüssel (automatisch) |
| `titel` | string | Projektbezeichnung |
| `startdatum` | date | Projektbeginn |
| `enddatum` | date | Geplantes Projektende |
| `budget` | float | Gesamtbudget in CHF |
| `status` | string | Status (z.B. "laufend", "abgeschlossen") |
| `kunde_id` | ObjectId | Referenz auf `kunden`-Collection |
| `freelancer_ids` | [ObjectId] | Referenz-Array auf `freelancer`-Collection |
| `meilensteine` | **[object]** | **Eingebettetes Array** von Projektmeilensteinen |
| `meilensteine[].bezeichnung` | string | Name des Meilensteins |
| `meilensteine[].faelligkeitsdatum` | date | Fälligkeitsdatum |
| `meilensteine[].betrag` | float | Teilbetrag in CHF |
| `meilensteine[].abgeschlossen` | int | 0 = offen, 1 = erledigt |
| `meilensteine[].kommentar` | string | Optionaler Kommentar |

#### Collection: `kunden`

| Feld | Datentyp | Beschreibung |
|------|----------|-------------|
| `_id` | ObjectId | Primärschlüssel (automatisch) |
| `firmenname` | string | Name des Unternehmens |
| `kontaktperson` | string | Ansprechperson |
| `email` | string | E-Mail-Adresse |
| `branche` | string | Branche (z.B. "IT", "Marketing") |
| `land` | string | Herkunftsland |

#### Collection: `faehigkeiten`

| Feld | Datentyp | Beschreibung |
|------|----------|-------------|
| `_id` | ObjectId | Primärschlüssel (automatisch) |
| `bezeichnung` | string | Name der Fähigkeit (z.B. "React") |
| `kategorie` | string | Oberkategorie (z.B. "Webentwicklung") |
| `erfahrungsstufe` | string | Stufe (z.B. "Junior", "Senior") |
| `nachfrage` | float | Marktnachfrage-Score (0–10) |

---

### Erklärung der Verschachtelungen

#### Verschachtelung 1: `freelancer.kontakt` (eingebettetes Sub-Dokument)

**Gewählte Variante:** Embedding (Einbettung)

**Begründung:** Kontaktdaten (Telefon, Website, LinkedIn, Wohnort) sind direkt dem Freelancer zugeordnet und werden fast ausschliesslich zusammen mit dem Freelancer-Profil abgerufen. Es gibt keinen Anwendungsfall, bei dem man die Kontaktdaten ohne den zugehörigen Freelancer benötigt. Eine eigene `kontakt`-Collection würde für jede Profilabfrage einen zusätzlichen Datenbank-Roundtrip erzeugen, ohne irgendeinen Vorteil zu bieten.

**Vorteile:** Atomare Lese- und Schreiboperationen, keine zusätzlichen Abfragen, klare Kapselung aller Freelancer-Daten in einem Dokument.

---

#### Verschachtelung 2: `projekte.meilensteine` (eingebettetes Array)

**Gewählte Variante:** Embedding als Array

**Begründung:** Meilensteine existieren nur im Kontext eines Projekts — ohne Projekt sind sie bedeutungslos. Die Anzahl Meilensteine pro Projekt ist typischerweise klein und wächst nicht unbeschränkt (meist 3–10 Meilensteine). In der Praxis werden Meilensteine fast immer zusammen mit dem Projekt geladen (z.B. Projektübersicht mit Fortschrittsanzeige). Eine separate `meilensteine`-Collection würde die Komplexität erhöhen, ohne einen inhaltlichen Mehrwert zu bringen.

**Vorteile:** Alle Projektinformationen inklusive Fortschritt in einem Dokument, geeignet für atomare Updates (z.B. Meilenstein als abgeschlossen markieren).

---

#### Referenzen (keine Einbettung)

`freelancer.faehigkeit_ids` und `projekte.freelancer_ids` verwenden **Referenzen** statt Einbettung, weil:
- Freelancer und Fähigkeiten sind **eigenständige Entitäten** mit unabhängigem Lebenszyklus
- Die N:N-Beziehung würde bei Einbettung zu massiver Datenverdopplung führen
- Ein Freelancer muss auch unabhängig von einem Projekt abfragbar sein (z.B. bei der Suche nach verfügbaren Freelancern)

`projekte.kunde_id` ist eine **Referenz**, weil ein Kunde in vielen Projekten vorkommt und seine Stammdaten zentral geändert werden müssen (Änderung würde sonst alle Projektkopien betreffen).

---

## C) Anwendung des Schemas in MongoDB (10%)

### Script

```javascript
db.createCollection("freelancer");
db.createCollection("projekte");
db.createCollection("kunden");
db.createCollection("faehigkeiten");
```

[create_collections.js](create_collections.js)

---

### Anleitung (copy-paste in mongosh)

**Schritt 1:** Mit der MongoDB-Instanz verbinden (Connection String aus KN-M-01):
```
mongodb://admin:VerySecurePassword@13.219.159.150:27017/?authSource=admin
```

**Schritt 2:** Datenbank wechseln — diesen Befehl **separat** ausführen:
```javascript
use projektverwaltung;
```

**Schritt 3:** Collections erstellen — diese Befehle nacheinander ausführen:
```javascript
db.createCollection("freelancer");
db.createCollection("projekte");
db.createCollection("kunden");
db.createCollection("faehigkeiten");
```

**Schritt 4:** Überprüfen:
```javascript
show collections;
```

**Schritt 5:** Screenshot von der Ausgabe machen und als `img/screenshot_collections.png` speichern.

---

### Screenshot

![Collections erstellt](img/screenshot_collections.png)
