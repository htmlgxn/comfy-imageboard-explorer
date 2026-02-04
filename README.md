# comfy-imageboard-explorer

A TUI-style webapp for browsing imageboard content in a simplified view. Built with FastAPI + Jinja and the [4chan read-only API](https://github.com/4chan/4chan-API/).

## Overview

- Terminal-like UI for browsing boards, catalogs, threads, and posts.
- Keyboard-first navigation with rofi-style board search.
- Simplified rendering of posts, quotes, and media.

## Features

- Board selection with inline search overlay (rofi-inspired).
- Thread catalog and post lists in a fixed-height window with centered selection.
- Post view and full media view for images and webm files.
- Purple-link navigation for quotes and external URLs.
- Country flags on boards that support them.

## Screenshots

Click a thumbnail to view full size.

<table>
  <tr>
    <td><a href="SCREENS.md#screen-1"><img src="screens/1.png" width="220" alt="Home screen"></a></td>
    <td><a href="SCREENS.md#screen-2"><img src="screens/2.png" width="220" alt="Catalog view"></a></td>
    <td><a href="SCREENS.md#screen-3"><img src="screens/3.png" width="220" alt="Thread view"></a></td>
  </tr>
  <tr>
    <td><a href="SCREENS.md#screen-4"><img src="screens/4.png" width="220" alt="Post view"></a></td>
    <td><a href="SCREENS.md#screen-5"><img src="screens/5.png" width="220" alt="Full image view"></a></td>
    <td><a href="SCREENS.md#screen-6"><img src="screens/6.png" width="220" alt="Link navigation"></a></td>
  </tr>
  <tr>
    <td><a href="SCREENS.md#screen-7"><img src="screens/7.png" width="220" alt="Rofi search"></a></td>
  </tr>
</table>

## Controls

Home (board selection):
- `type` search
- `↑/↓` move
- `enter` select
- `esc/backspace` close search

Catalog (thread list):
- `h` home
- `↑/↓` move
- `enter` open thread
- `backspace` back

Thread (post list):
- `h` home
- `↑/↓` move
- `enter` open post / image
- `backspace` back
- `WASD` select link
- `e` open link

Post view:
- `h` home
- `backspace` back
- `WASD` select link
- `e` open link
- `enter` full image

Full image view:
- `h` home
- `backspace` back

## Setup

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Run

```bash
uvicorn app.main:app --reload
```

Open http://127.0.0.1:8000

## Notes

- This project respects 4chan API rules and uses `If-Modified-Since` with in-memory caching.
- The app is not affiliated with or endorsed by 4chan.
