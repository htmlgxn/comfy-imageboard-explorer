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
