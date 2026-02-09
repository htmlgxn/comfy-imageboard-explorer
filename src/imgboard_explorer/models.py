from typing import Optional

from pydantic import BaseModel


class Board(BaseModel):
    board: str
    title: str
    ws_board: int
    pages: int
    per_page: int
    meta_description: Optional[str] = None


class CatalogThread(BaseModel):
    no: int
    now: Optional[str] = None
    time: Optional[int] = None
    name: Optional[str] = None
    sub: Optional[str] = None
    com: Optional[str] = None
    replies: Optional[int] = None
    images: Optional[int] = None
    tim: Optional[int] = None
    ext: Optional[str] = None
    country: Optional[str] = None
    country_name: Optional[str] = None


class ThreadPost(BaseModel):
    no: int
    resto: int = 0
    now: Optional[str] = None
    time: Optional[int] = None
    name: Optional[str] = None
    com: Optional[str] = None
    tim: Optional[int] = None
    ext: Optional[str] = None
    filename: Optional[str] = None
    fsize: Optional[int] = None
    country: Optional[str] = None
    country_name: Optional[str] = None


class Thread(BaseModel):
    posts: list[ThreadPost]


def thumbnail_url(board: str, tim: Optional[int]) -> Optional[str]:
    if not tim:
        return None
    return f"https://i.4cdn.org/{board}/{tim}s.jpg"


def image_url(board: str, tim: Optional[int], ext: Optional[str]) -> Optional[str]:
    if not tim or not ext:
        return None
    return f"https://i.4cdn.org/{board}/{tim}{ext}"


IMAGE_EXTS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".avif",
    ".svg",
    ".bmp",
    ".tif",
    ".tiff",
}
VIDEO_EXTS = {".webm", ".mp4", ".m4v", ".ogv"}


def media_kind(ext: Optional[str]) -> str:
    if not ext:
        return "file"
    ext_lower = ext.lower()
    if ext_lower in IMAGE_EXTS:
        return "image"
    if ext_lower in VIDEO_EXTS:
        return "video"
    return "file"


def format_bytes(value: Optional[int]) -> Optional[str]:
    if value is None:
        return None
    size = float(value)
    units = ["B", "KB", "MB", "GB", "TB"]
    for unit in units:
        if size < 1024.0 or unit == units[-1]:
            if unit == "B":
                return f"{int(size)} {unit}"
            return f"{size:.1f} {unit}"
        size /= 1024.0
    return None


def country_flag_url(country_code: Optional[str]) -> Optional[str]:
    """Generate country flag URL from country code."""
    if not country_code:
        return None
    return f"https://s.4cdn.org/image/country/{country_code.lower()}.gif"
