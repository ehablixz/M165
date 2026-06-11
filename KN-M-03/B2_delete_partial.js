// KN-M-03 B) Daten löschen – Skript 2: Einzelne Einträge löschen
// Voraussetzung: A_insert.js wurde zuvor ausgeführt.
// Da ObjectId-Variablen nicht zwischen Skripts persistiert werden, werden
// die betroffenen Dokumente zuerst per Name gesucht und die _id dann verwendet.

use("projektverwaltung");

// ─── deleteOne: einen Datensatz löschen (Filterung auf _id) ─────────────────
// Löscht den Kunden "HealthPlus SA"

const zuLoeschenderKunde = db.kunden.findOne({ firmenname: "HealthPlus SA" });

db.kunden.deleteOne({
    _id: zuLoeschenderKunde._id
});

// ─── deleteMany: mehrere Datensätze löschen (ODER-Verknüpfung auf _ids) ──────
// Löscht zwei Projekte (nicht alle!): "Social Media Kampagne" und "SEO-Optimierung Website"

const projekt3 = db.projekte.findOne({ titel: "Social Media Kampagne" });
const projekt5 = db.projekte.findOne({ titel: "SEO-Optimierung Website" });

db.projekte.deleteMany({
    $or: [
        { _id: projekt3._id },
        { _id: projekt5._id }
    ]
});
