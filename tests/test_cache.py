import time

from app.clients.chan_api import TTLCache


def test_cache_expires():
    cache = TTLCache()
    cache.set("key", {"ok": True}, ttl_seconds=0.01, last_modified=None)
    assert cache.get("key") is not None
    time.sleep(0.02)
    assert cache.get("key") is None
