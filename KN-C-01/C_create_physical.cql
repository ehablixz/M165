-- KN-C-01 C) Physisches Modell für Cassandra
-- Thema: Freelance-Projektverwaltung
-- Eine Tabelle pro Abfrage / Screen

-- ─── Keyspace neu erstellen ──────────────────────────────────────────────────────

DROP KEYSPACE IF EXISTS projektverwaltung;

CREATE KEYSPACE IF NOT EXISTS projektverwaltung
    WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};

USE projektverwaltung;

-- ─── Screen 1: Freelancer-Profil ─────────────────────────────────────────────
-- Abfrage: Alle Details eines Freelancers anzeigen (by ID)
-- Partition Key: freelancer_id  →  ein Freelancer pro Partition

CREATE TABLE IF NOT EXISTS freelancer_by_id (
    freelancer_id   UUID,
    name            TEXT,
    email           TEXT,
    stundensatz     DOUBLE,
    registrierung   DATE,
    bewertung       DOUBLE,
    faehigkeiten    LIST<TEXT>,
    PRIMARY KEY (freelancer_id)
);

-- ─── Screen 2: Meine Projekte (Freelancer-Sicht) ─────────────────────────────
-- Abfrage: Alle Projekte eines Freelancers, sortiert nach Startdatum (neuste zuerst)
-- Partition Key: freelancer_id  →  alle Projekte eines Freelancers in einer Partition
-- Cluster Key: startdatum DESC, projekt_id  →  Sortierung + Eindeutigkeit

CREATE TABLE IF NOT EXISTS projekte_by_freelancer (
    freelancer_id   UUID,
    startdatum      DATE,
    projekt_id      UUID,
    titel           TEXT,
    enddatum        DATE,
    budget          DOUBLE,
    status          TEXT,
    kunde_id        UUID,
    PRIMARY KEY ((freelancer_id), startdatum, projekt_id)
) WITH CLUSTERING ORDER BY (startdatum DESC, projekt_id ASC);

-- ─── Screen 3: Top-Freelancer einer Kategorie ────────────────────────────────
-- Abfrage: Alle Freelancer einer Kategorie, sortiert nach Bewertung (beste zuerst)
-- Partition Key: kategorie  →  alle Freelancer einer Kategorie in einer Partition
-- Cluster Key: bewertung DESC, freelancer_id  →  Sortierung nach Rating + Eindeutigkeit

CREATE TABLE IF NOT EXISTS freelancer_by_kategorie (
    kategorie       TEXT,
    bewertung       DOUBLE,
    freelancer_id   UUID,
    name            TEXT,
    email           TEXT,
    stundensatz     DOUBLE,
    faehigkeiten    LIST<TEXT>,
    PRIMARY KEY ((kategorie), bewertung, freelancer_id)
) WITH CLUSTERING ORDER BY (bewertung DESC, freelancer_id ASC);

-- ─── Screen 4: Freelancer nach Fähigkeit ─────────────────────────────────────
-- Abfrage: Alle Freelancer mit einer bestimmten Fähigkeit (z.B. "React")
-- Partition Key: faehigkeit  →  alle Freelancer mit gleicher Fähigkeit in einer Partition
-- Cluster Key: freelancer_id  →  Eindeutigkeit innerhalb der Partition

CREATE TABLE IF NOT EXISTS freelancer_by_faehigkeit (
    faehigkeit      TEXT,
    freelancer_id   UUID,
    name            TEXT,
    email           TEXT,
    stundensatz     DOUBLE,
    bewertung       DOUBLE,
    PRIMARY KEY ((faehigkeit), freelancer_id)
);
