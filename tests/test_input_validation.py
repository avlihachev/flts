from fastapi.testclient import TestClient


def test_prompt_max_length():
    from flts.web.server import app
    client = TestClient(app)
    long_prompt = "a" * 10001
    resp = client.post("/api/chat", json={"prompt": long_prompt})
    assert resp.status_code == 422


def test_days_max_value():
    from flts.web.server import app
    client = TestClient(app)
    resp = client.get("/api/history/HEL/BKK?days=9999")
    assert resp.status_code == 422
