import pytest
from unittest.mock import patch
from fastapi.testclient import TestClient


@pytest.fixture
def client():
    from flts.web.server import app
    return TestClient(app)


def test_webhook_rejects_without_secret(client):
    with patch.dict("os.environ", {"TELEGRAM_WEBHOOK_SECRET": "mysecret"}):
        resp = client.post("/api/telegram/webhook", json={"update_id": 1})
        assert resp.status_code == 403


def test_webhook_accepts_with_correct_secret(client):
    with patch.dict("os.environ", {"TELEGRAM_WEBHOOK_SECRET": "mysecret"}):
        resp = client.post(
            "/api/telegram/webhook",
            json={"update_id": 1},
            headers={"X-Telegram-Bot-Api-Secret-Token": "mysecret"},
        )
        assert resp.status_code == 200


def test_webhook_open_when_no_secret_configured(client):
    with patch.dict("os.environ", {}, clear=True):
        resp = client.post("/api/telegram/webhook", json={"update_id": 1})
        assert resp.status_code == 200
