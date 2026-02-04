from app.models import image_url, thumbnail_url


def test_thumbnail_url():
    assert thumbnail_url("a", 1234) == "https://i.4cdn.org/a/1234s.jpg"
    assert thumbnail_url("a", None) is None


def test_image_url():
    assert image_url("b", 5678, ".jpg") == "https://i.4cdn.org/b/5678.jpg"
    assert image_url("b", None, ".jpg") is None
    assert image_url("b", 5678, None) is None
