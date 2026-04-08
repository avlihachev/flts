import tempfile
from pathlib import Path

from flts.db.models import (
    create_watch,
    get_connection,
    get_price_history,
    list_watches,
    log_price,
    remove_watch,
    update_watch_checked,
)


def _tmp_conn():
    tmp = tempfile.NamedTemporaryFile(suffix=".db", delete=False)
    return get_connection(Path(tmp.name))


def test_create_and_list_watches():
    conn = _tmp_conn()
    wid = create_watch(conn, "HEL", "BKK", "2026-06-01", "2026-06-30", 300.0)
    assert wid is not None
    watches = list_watches(conn)
    assert len(watches) == 1
    assert watches[0]["origin"] == "HEL"
    assert watches[0]["destination"] == "BKK"
    assert watches[0]["max_price"] == 300.0


def test_remove_watch():
    conn = _tmp_conn()
    wid = create_watch(conn, "HEL", "ATH", "2026-07-01", "2026-07-31", 100.0)
    assert remove_watch(conn, wid)
    assert len(list_watches(conn)) == 0
    assert not remove_watch(conn, wid)


def test_update_watch_checked():
    conn = _tmp_conn()
    wid = create_watch(conn, "HEL", "BCN", "2026-05-01", "2026-05-31", 150.0)
    update_watch_checked(conn, wid, last_price=120.0)
    watches = list_watches(conn)
    assert watches[0]["last_price"] == 120.0
    assert watches[0]["last_checked"] is not None


def test_log_and_get_price_history():
    conn = _tmp_conn()
    log_price(conn, "HEL", "BKK", "2026-06-15", 350.0)
    log_price(conn, "HEL", "BKK", "2026-06-15", 320.0)
    log_price(conn, "HEL", "BKK", "2026-06-20", 400.0)

    history = get_price_history(conn, "HEL", "BKK")
    assert len(history) == 3

    history_date = get_price_history(conn, "HEL", "BKK", travel_date="2026-06-15")
    assert len(history_date) == 2


def test_empty_history():
    conn = _tmp_conn()
    history = get_price_history(conn, "HEL", "NRT")
    assert history == []
