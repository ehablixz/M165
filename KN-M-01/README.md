# KN-M-01: Installation und Verwaltung von MongoDB

---

## A) Installation (30%)

### Cloud-Init Datei
[Konfigurationsdatei anzeigen](cloud-init.yml)

### MongoDB Instanzen - Bestehende Datenbanken

![MongoDB Compass - Bestehende Datenbanken](image.png)

---

### Connection String

```
mongodb://admin:VerySecurePassword@13.219.159.150:27017/?authSource=admin
```

#### Erklärung: `authSource=admin` Parameter

Der Parameter `authSource=admin` ist **kritisch wichtig** für die Authentifizierung:

| Aspekt | Beschreibung |
|--------|------------|
| **Wo ist der Benutzer?** | Der Benutzer `admin` wird nur in der `admin`-Datenbank erstellt (siehe `mongodbuser.txt: use admin;`) |
| **Ohne authSource=admin** | Der Treiber versucht sich in der Standarddatenbank zu authentifizieren → **Authentifizierung schlägt fehl**, da `admin` dort nicht existiert |
| **Mit authSource=admin** | Die Authentifizierung wird gegen die **richtige Datenbank** durchgeführt → **Verbindung erfolgreich** |

---

### Konfiguration: sed-Befehle

#### 1. Bindadresse ändern

```bash
sudo sed -i 's/127.0.0.1/0.0.0.0/g' /etc/mongod.conf
```

**Was wird ersetzt:**
- Von: `127.0.0.1` (nur localhost)
- Zu: `0.0.0.0` (alle Netzwerk-Interfaces)

**Auswirkung auf MongoDB:**
- MongoDB hört **standardmäßig nur auf `127.0.0.1`** (lokale Verbindungen)
- Mit `0.0.0.0` akzeptiert MongoDB Verbindungen von **allen externen Interfaces**
- Die Cloud-VM wird dadurch **extern erreichbar** von Clients

**Warum notwendig:**
Die AWS-Instanz braucht externe Zugriffe vom lokalen MongoDB Compass Client

---

#### 2. Authentifizierung aktivieren

```bash
sudo sed -i 's/#security:/security:\n  authorization: enabled/g' /etc/mongod.conf
```

**Was wird ersetzt:**
```yaml
# Vorher (auskommentiert):
#security:

# Nachher (aktiviert):
security:
  authorization: enabled
```

**Auswirkung auf MongoDB:**
- **Authentifizierung wird aktiviert** → Nur autorisierte Benutzer erhalten Zugriff
- Benutzer müssen sich mit Benutzername und Passwort anmelden (z.B. `admin` mit Passwort)

**Warum notwendig:**
Ohne Authentifizierung könnte **jeder** auf die Datenbank zugreifen (kritisches Sicherheitsrisiko)

![MongoDB Konfigurationsdatei - Bearbeitete Werte](image-1.png)

---

## B) Erste Schritte GUI (30%)

### Dokument vor dem Einfügen

Beispielstruktur mit verschiedenen Datentypen:

![MongoDB Compass - Neues Dokument (JSON-Editor)](image-2.png)

![MongoDB Compass - Neues Dokument (Listenansicht)](image-3.png)

### Nach dem Einfügen

![MongoDB Compass - Datenbank, Collection und Dokument sichtbar](image-4.png)

### Exportierte Daten

[EJSON-Export ansehen](zuberi.ajan.json)

#### Erklärung: Datentypen und Datumseingabe

**Problem:** Bei direkter JSON-Eingabe wird ein Datum typischerweise als **String** gespeichert, nicht als ISODate-Objekt.

**Grund:**
- JSON unterstützt von Natur aus keinen Datum-Datentyp
- Nur strings, numbers, booleans, objects, arrays und null
- Daher werden Daten wie `"2000-01-15"` als Text interpretiert

**Lösung: EJSON (Extended JSON)**
- MongoDB erweitert JSON um spezielle Datentypen
- Mit EJSON können Sie ein Datum so einfügen: `{"\$date": "2000-01-15T00:00:00.000Z"}`
- Dies wird als echtes **ISODate-Objekt** in der Datenbank gespeichert

**Auswirkungen:**
- String vs. ISODate: Bei einem String können Sie keine Datums-Vergleiche durchführen (`db.collection.find({birthdate: {\$gt: new Date("2000-01-01")}})` würde nicht funktionieren)
- Mit ISODate können Sie auf Datum filtern, sortieren und Range-Queries durchführen
- Für korrekte Zeitstempel-Handling ist die richtige Datentyp-Wahl essentiell

**Warum ist dieser Weg kompliziert?**
- Benutzer müssen die EJSON-Syntax kennen
- Im GUI von Compass ist es einfacher, den Datentyp manuell zu ändern als EJSON zu schreiben
- Programmatisch (via Skripte/APIs) ist EJSON die Standard-Lösung

---

## C) Erste Schritte Shell (10%)

### MongoDB Shell in Compass

```
1. show dbs;
2. show databases;
3. use Ihre-Datenbank;
4. show collections;
5. show tables;
6. var test="hallo";
7. test;
```

![MongoDB Compass - Shell mit Befehlen](image-5.png)

---

### MongoDB Shell über SSH auf dem Server

Verbindung zum Server:
```bash
sudo mongosh --authenticationDatabase "admin" -u "uname" -p "password"
```

![MongoDB Shell - Befehle auf dem Server](image-6.png)

#### Erklärung der Shell-Befehle

| Befehl | Beschreibung | Ausgabe |
|--------|-------------|--------|
| `show dbs` | Zeigt alle Datenbanken an (Alias für `show databases`) | Liste der DB-Namen |
| `show databases` | Zeigt alle Datenbanken an (vollständiger Befehl) | Liste der DB-Namen |
| `use Datenbank` | Wechselt zur angegebenen Datenbank (oder erstellt sie) | Bestätigung oder Fehler |
| `show collections` | Zeigt alle Collections in der aktuellen Datenbank an | Liste der Collection-Namen |
| `show tables` | Zeigt alle Collections an (Alias, aus SQL gewohnt) | Liste der Collection-Namen |
| `var test="hallo"` | Erstellt eine JavaScript-Variable mit dem Wert "hallo" | Keine Ausgabe |
| `test` | Gibt den Wert der Variable aus | `hallo` |

#### Collections vs. Tables

**Tables (Relational Databases wie SQL):**
- Struktur ist **starr** und vordefiniert (Schema)
- Alle Zeilen haben die gleiche Spalten-Struktur
- Daten müssen normalisiert sein
- Beispiel: Employee-Tabelle hat immer Spalten: ID, Name, Alter, Email

**Collections (MongoDB - NoSQL):**
- Struktur ist **flexibel** (schemalos)
- Dokumente in einer Collection können verschiedene Strukturen haben
- Keine Normalisierung notwendig - verschachtelte Daten möglich
- Beispiel: Eine Collection kann Dokumente mit unterschiedlichen Feldern haben - manche mit "Adresse", andere ohne

**Wichtiger Unterschied:**
- **SQL**: Rigides Schema → weniger Flexibilität, aber bessere Datenintegrität
- **MongoDB**: Flexible Dokumente → mehr Flexibilität, ideal für semi-strukturierte Daten

---

## D) Rechte und Rollen (30%)

### Test: Falsche Authentifizierungsquelle

Versuch mit `authSource=zuberi` statt `admin`:

![MongoDB Compass - Fehler bei falscher authSource](image-7.png)

---

### Benutzer erstellen

#### Skript zur Benutzer-Erstellung:

```javascript
/* ========================================
   BENUTZER 1: Nur-Lesen Benutzer
   Authentifizierungsdatenbank: zuberi
   ======================================== */
use zuberi
db.createUser({
  user: "read",
  pwd: "ReadOnly",
  roles: [
    { role: "read", db: "zuberi" }
  ]
})

/* ========================================
   BENUTZER 2: Lesen & Schreiben Benutzer
   Authentifizierungsdatenbank: admin
   ======================================== */
use admin
db.createUser({
  user: "write",
  pwd: "ReadWrite",
  roles: [
    { role: "readWrite", db: "zuberi" }
  ]
})
```

---

### Benutzer 1: Nur-Lesen (read-only)

**Verbindungstext:**
```
mongodb://read:ReadOnly@13.219.159.150:27017/?authSource=zuberi
```

**Anmeldung:**
```bash
sudo mongosh --authenticationDatabase "zuberi" -u "read" -p "ReadOnly"
```

![MongoDB Compass - Benutzer "read" erfolgreich angemeldet](image-8.png)

**Daten lesen:** Erfolgreich

![MongoDB - Benutzer "read" kann lesen](image-10.png)

**Daten schreiben:** Fehler (wie erwartet)

---

### Benutzer 2: Lesen & Schreiben (read-write)

**Verbindungstext:**
```
mongodb://write:ReadWrite@13.219.159.150:27017/?authSource=admin
```

**Anmeldung:**
```bash
sudo mongosh --authenticationDatabase "admin" -u "write" -p "ReadWrite"
```

![MongoDB Compass - Benutzer "write" erfolgreich angemeldet](image-9.png)

**Daten lesen:** Erfolgreich

**Daten schreiben:** Erfolgreich

![MongoDB - Benutzer "write" kann lesen und schreiben](image-11.png)
