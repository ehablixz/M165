// KN-M-03 D) Daten verändern
// Voraussetzung: B1_drop_all.js und danach A_insert.js ausführen.
// Alle drei Befehle (updateOne, updateMany, replaceOne) auf unterschiedlichen Collections.

use("projektverwaltung");

// ─── updateOne: auf Collection "projekte" (Filterung auf _id) ───────────────
// Ändert den Status und das Enddatum des Projekts "E-Commerce Relaunch"

const eCommerceRelaunch = db.projekte.findOne({ titel: "E-Commerce Relaunch" });

db.projekte.updateOne(
    { _id: eCommerceRelaunch._id },
    {
        $set: {
            status: "archiviert",
            enddatum: new Date("2024-07-15")
        }
    }
);

// ─── updateMany: auf Collection "freelancer" (ODER-Verknüpfung, OHNE _id) ───
// Erhöht den Stundensatz aller Freelancer aus der Schweiz ODER mit Bewertung < 4.0
// Trifft tatsächlich mehr als einen Datensatz (Marc Dubois + Ajan Zuberi)

db.freelancer.updateMany(
    {
        $or: [
            { land: "Schweiz" },
            { bewertung: { $lt: 4.0 } }
        ]
    },
    {
        $inc: { stundensatz: 5.0 }
    }
);

// ─── replaceOne: auf Collection "kunden" ────────────────────────────────────
// Ersetzt das gesamte Dokument von "MediaFlow GmbH" mit aktualisierten Angaben

db.kunden.replaceOne(
    { firmenname: "MediaFlow GmbH" },
    {
        firmenname: "MediaFlow GmbH",
        kontaktperson: "Julia Wagner",
        email: "j.wagner@mediaflow.de",
        branche: "Digital Marketing",
        land: "Deutschland",
        notiz: "Kontaktperson geändert nach Umstrukturierung"
    }
);
