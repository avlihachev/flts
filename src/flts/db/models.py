import sqlite3
from datetime import datetime, timezone
from pathlib import Path

DB_DIR = Path.home() / ".flts"
DB_PATH = DB_DIR / "flts.db"


def get_connection(db_path: Path | None = None) -> sqlite3.Connection:
    path = db_path or DB_PATH
    path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(path))
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    _init_schema(conn)
    return conn


def _init_schema(conn: sqlite3.Connection) -> None:
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS watches (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            origin TEXT NOT NULL,
            destination TEXT NOT NULL,
            from_date TEXT NOT NULL,
            to_date TEXT NOT NULL,
            trip_type TEXT NOT NULL DEFAULT 'one_way',
            duration_days INTEGER,
            max_price REAL NOT NULL,
            currency TEXT NOT NULL DEFAULT 'EUR',
            check_interval_hours INTEGER NOT NULL DEFAULT 6,
            last_checked TEXT,
            last_price REAL,
            active INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS price_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            origin TEXT NOT NULL,
            destination TEXT NOT NULL,
            travel_date TEXT NOT NULL,
            price REAL NOT NULL,
            currency TEXT NOT NULL DEFAULT 'EUR',
            checked_at TEXT NOT NULL,
            source TEXT NOT NULL DEFAULT 'agent'
        );

        CREATE INDEX IF NOT EXISTS idx_price_history_route
            ON price_history(origin, destination);
        CREATE INDEX IF NOT EXISTS idx_price_history_checked
            ON price_history(checked_at);
    """)


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


# --- watches ---

def create_watch(
    conn: sqlite3.Connection,
    origin: str,
    destination: str,
    from_date: str,
    to_date: str,
    max_price: float,
    currency: str = "EUR",
    trip_type: str = "one_way",
    duration_days: int | None = None,
    check_interval_hours: int = 6,
) -> int:
    cur = conn.execute(
        """INSERT INTO watches
           (origin, destination, from_date, to_date, trip_type, duration_days,
            max_price, currency, check_interval_hours, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (origin, destination, from_date, to_date, trip_type, duration_days,
         max_price, currency, check_interval_hours, _now()),
    )
    conn.commit()
    return cur.lastrowid


def list_watches(conn: sqlite3.Connection, active_only: bool = True) -> list[dict]:
    query = "SELECT * FROM watches"
    if active_only:
        query += " WHERE active = 1"
    query += " ORDER BY created_at DESC"
    return [dict(row) for row in conn.execute(query).fetchall()]


def remove_watch(conn: sqlite3.Connection, watch_id: int) -> bool:
    cur = conn.execute(
        "UPDATE watches SET active = 0 WHERE id = ? AND active = 1",
        (watch_id,),
    )
    conn.commit()
    return cur.rowcount > 0


def update_watch_checked(
    conn: sqlite3.Connection,
    watch_id: int,
    last_price: float | None = None,
) -> None:
    conn.execute(
        "UPDATE watches SET last_checked = ?, last_price = ? WHERE id = ?",
        (_now(), last_price, watch_id),
    )
    conn.commit()


# --- price_history ---

def log_price(
    conn: sqlite3.Connection,
    origin: str,
    destination: str,
    travel_date: str,
    price: float,
    currency: str = "EUR",
    source: str = "agent",
) -> None:
    conn.execute(
        """INSERT INTO price_history
           (origin, destination, travel_date, price, currency, checked_at, source)
           VALUES (?, ?, ?, ?, ?, ?, ?)""",
        (origin, destination, travel_date, price, currency, _now(), source),
    )
    conn.commit()


def get_price_history(
    conn: sqlite3.Connection,
    origin: str,
    destination: str,
    travel_date: str | None = None,
    days_back: int = 30,
) -> list[dict]:
    cutoff = datetime.now(timezone.utc).isoformat()
    query = """
        SELECT * FROM price_history
        WHERE origin = ? AND destination = ?
          AND checked_at >= datetime(?, '-' || ? || ' days')
    """
    params: list = [origin, destination, cutoff, days_back]

    if travel_date:
        query += " AND travel_date = ?"
        params.append(travel_date)

    query += " ORDER BY checked_at DESC"
    return [dict(row) for row in conn.execute(query, params).fetchall()]
