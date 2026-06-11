// KN-M-03 A) Daten hinzufügen
// Freelance-Projektverwaltung: freelancer, projekte, kunden
// Alle _id-Werte werden als Variablen gespeichert für spätere Verwendung als Referenzen.

use("projektverwaltung");

// ─── ObjectId Variablen ──────────────────────────────────────────────────────

var freelancer1Id = new ObjectId();
var freelancer2Id = new ObjectId();
var freelancer3Id = new ObjectId();
var freelancer4Id = new ObjectId();

var kunde1Id = new ObjectId();
var kunde2Id = new ObjectId();
var kunde3Id = new ObjectId();

var projekt1Id = new ObjectId();
var projekt2Id = new ObjectId();
var projekt3Id = new ObjectId();
var projekt4Id = new ObjectId();
var projekt5Id = new ObjectId();

// ─── Collection: kunden (insertMany) ────────────────────────────────────────

db.kunden.insertMany([
    {
        _id: kunde1Id,
        firmenname: "TechVision AG",
        kontaktperson: "Sandra Meier",
        email: "s.meier@techvision.ch",
        branche: "IT",
        land: "Schweiz"
    },
    {
        _id: kunde2Id,
        firmenname: "MediaFlow GmbH",
        kontaktperson: "Lukas Bauer",
        email: "l.bauer@mediaflow.de",
        branche: "Marketing",
        land: "Deutschland"
    },
    {
        _id: kunde3Id,
        firmenname: "HealthPlus SA",
        kontaktperson: "Marie Dupont",
        email: "m.dupont@healthplus.fr",
        branche: "Gesundheit",
        land: "Frankreich"
    }
]);

// ─── Collection: freelancer (insertMany) ────────────────────────────────────
// faehigkeiten ist ein eingebettetes Array (keine eigene Collection)

db.freelancer.insertMany([
    {
        _id: freelancer1Id,
        name: "Ajan Zuberi",
        email: "ajan.zuberi@freelance.ch",
        stundensatz: 95.0,
        registrierungsdatum: new Date("2022-03-15"),
        bewertung: 4.8,
        faehigkeiten: [
            { bezeichnung: "React", kategorie: "Webentwicklung", erfahrungsstufe: "Senior", nachfrage: 9.2 },
            { bezeichnung: "Node.js", kategorie: "Backend", erfahrungsstufe: "Senior", nachfrage: 8.7 }
        ]
    },
    {
        _id: freelancer2Id,
        name: "Diego Vignuda",
        email: "diego.vignuda@freelance.it",
        stundensatz: 80.0,
        registrierungsdatum: new Date("2021-07-20"),
        bewertung: 4.5,
        faehigkeiten: [
            { bezeichnung: "UX-Design", kategorie: "Design", erfahrungsstufe: "Mid", nachfrage: 8.1 },
            { bezeichnung: "Figma", kategorie: "Design", erfahrungsstufe: "Senior", nachfrage: 7.9 }
        ]
    },
    {
        _id: freelancer3Id,
        name: "Anna Schreiber",
        email: "anna.schreiber@freelance.at",
        stundensatz: 110.0,
        registrierungsdatum: new Date("2020-01-10"),
        bewertung: 4.9,
        faehigkeiten: [
            { bezeichnung: "Python", kategorie: "Backend", erfahrungsstufe: "Senior", nachfrage: 9.5 },
            { bezeichnung: "Machine Learning", kategorie: "Data Science", erfahrungsstufe: "Senior", nachfrage: 9.8 }
        ]
    },
    {
        _id: freelancer4Id,
        name: "Marc Dubois",
        email: "marc.dubois@freelance.ch",
        stundensatz: 70.0,
        registrierungsdatum: new Date("2023-05-01"),
        bewertung: 3.9,
        faehigkeiten: [
            { bezeichnung: "SEO", kategorie: "Marketing", erfahrungsstufe: "Junior", nachfrage: 6.3 },
            { bezeichnung: "Google Ads", kategorie: "Marketing", erfahrungsstufe: "Mid", nachfrage: 6.8 }
        ]
    }
]);

// ─── Collection: projekte (insertOne + insertMany) ───────────────────────────

// insertOne für das erste Projekt
db.projekte.insertOne({
    _id: projekt1Id,
    titel: "E-Commerce Relaunch",
    startdatum: new Date("2024-01-15"),
    enddatum: new Date("2024-06-30"),
    budget: 45000.0,
    status: "abgeschlossen",
    kunde_id: kunde1Id,
    freelancer_ids: [freelancer1Id, freelancer2Id]
});

// insertMany für die restlichen Projekte
db.projekte.insertMany([
    {
        _id: projekt2Id,
        titel: "KI-Datenanalyse Plattform",
        startdatum: new Date("2024-03-01"),
        enddatum: new Date("2024-12-31"),
        budget: 120000.0,
        status: "laufend",
        kunde_id: kunde1Id,
        freelancer_ids: [freelancer3Id]
    },
    {
        _id: projekt3Id,
        titel: "Social Media Kampagne",
        startdatum: new Date("2024-02-10"),
        enddatum: new Date("2024-04-30"),
        budget: 15000.0,
        status: "abgeschlossen",
        kunde_id: kunde2Id,
        freelancer_ids: [freelancer4Id, freelancer2Id]
    },
    {
        _id: projekt4Id,
        titel: "Patientenportal UX",
        startdatum: new Date("2024-05-01"),
        enddatum: new Date("2025-01-31"),
        budget: 60000.0,
        status: "laufend",
        kunde_id: kunde3Id,
        freelancer_ids: [freelancer2Id, freelancer3Id]
    },
    {
        _id: projekt5Id,
        titel: "SEO-Optimierung Website",
        startdatum: new Date("2024-06-15"),
        enddatum: new Date("2024-09-30"),
        budget: 8000.0,
        status: "pausiert",
        kunde_id: kunde2Id,
        freelancer_ids: [freelancer4Id]
    }
]);
