// KN-M-03 C) Daten abfragen
// Voraussetzung: B1_drop_all.js und danach A_insert.js ausführen.
// Mindestens eine Abfrage pro Collection. Niemals _id als Filterfeld verwenden.

use("projektverwaltung");

// ─── Collection: kunden ──────────────────────────────────────────────────────

// 1. Alle Kunden aus der Schweiz (einfacher Filter)
db.kunden.find(
    { land: "Schweiz" }
);

// 2. ODER-Verknüpfung: Kunden aus Deutschland ODER Frankreich
//    Projektion MIT _id (Standard – _id wird angezeigt)
db.kunden.find(
    { $or: [{ land: "Deutschland" }, { land: "Frankreich" }] },
    { firmenname: 1, kontaktperson: 1, land: 1 }
);

// ─── Collection: freelancer ──────────────────────────────────────────────────

// 3. DateTime-Filter: Freelancer, die sich vor dem 01.01.2022 registriert haben
db.freelancer.find(
    { registrierungsdatum: { $lt: new Date("2022-01-01") } }
);

// 4. UND-Verknüpfung: Freelancer mit Stundensatz > 80 UND Bewertung >= 4.5
//    (Nicht auf gleicher Collection wie ODER-Verknüpfung)
db.freelancer.find(
    { $and: [{ stundensatz: { $gt: 80 } }, { bewertung: { $gte: 4.5 } }] }
);

// 5. Regex: Freelancer, deren E-Mail auf ".ch" endet
//    Projektion OHNE _id
db.freelancer.find(
    { email: { $regex: /\.ch$/ } },
    { _id: 0, name: 1, email: 1, stundensatz: 1 }
);

// ─── Collection: projekte ────────────────────────────────────────────────────

// 6. DateTime-Filter: Projekte, die nach dem 01.03.2024 gestartet haben
db.projekte.find(
    { startdatum: { $gt: new Date("2024-03-01") } }
);

// 7. Regex: Projekte, deren Titel "Plattform" oder "Portal" enthält (Teilstring)
//    Projektion MIT _id
db.projekte.find(
    { titel: { $regex: /Plattform|Portal/i } },
    { _id: 1, titel: 1, status: 1, budget: 1 }
);

// 8. Alle laufenden Projekte ohne _id in der Ausgabe
db.projekte.find(
    { status: "laufend" },
    { _id: 0, titel: 1, startdatum: 1, enddatum: 1, budget: 1 }
);
