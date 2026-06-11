// KN-M-03 B) Daten löschen – Skript 1: Alle Collections löschen
// Dieses Skript kann als "Aufräum-Skript" vor anderen Skripts ausgeführt werden.

use("projektverwaltung");

db.freelancer.drop();
db.projekte.drop();
db.kunden.drop();
