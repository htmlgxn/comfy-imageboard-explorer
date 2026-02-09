# comfy-imageboard-explorer

A TUI-style webapp for browsing imageboard content in a simplified view. Built with FastAPI + Jinja and the [4chan read-only API](https://github.com/4chan/4chan-API/).

## Overview

- Terminal-like UI for browsing boards, catalogs, threads, and posts.
- Keyboard-first navigation with rofi-style board search.
- Simplified rendering of posts, quotes, and media.

## Tech Stack

- **Backend:** FastAPI, httpx, Pydantic
- **Frontend:** Vanilla JavaScript, Jinja2 templates
- **API:** 4chan read-only API with If-Modified-Since caching

## Features

- Board selection with search overlay (rofi-inspired).
- Thread catalog and post lists in a fixed-height window with centered view / selection.
- WASD navigation for quotes and external URLs.
- Country flags on boards that support them.

## Screenshots

Click a thumbnail to view full image.

<table>
  <tr>
    <td><a href="SCREENS.md#home-board-selection"><img src="screens/1.png" width="220" alt="Home screen"></a></td>
    <td><a href="SCREENS.md#board-search"><img src="screens/2.png" width="220" alt="Board search"></a></td>
    <td><a href="SCREENS.md#catalog-thread-list"><img src="screens/3.png" width="220" alt="Catalog view"></a></td>
  </tr>
  <tr>
    <td><a href="SCREENS.md#catalog-alt"><img src="screens/4.png" width="220" alt="Catalog alt view"></a></td>
    <td><a href="SCREENS.md#thread-post-list"><img src="screens/5.png" width="220" alt="Thread view"></a></td>
    <td><a href="SCREENS.md#post-view"><img src="screens/6.png" width="220" alt="Post view"></a></td>
  </tr>
  <tr>
    <td><a href="SCREENS.md#full-image-view"><img src="screens/7.png" width="220" alt="Full image view"></a></td>
  </tr>
</table>

## Installation

### End User (No Tests Included)

Install with a single command:

```bash
curl -sSL https://raw.githubusercontent.com/htmlgxn/comfy-imageboard-explorer/main/scripts/install.sh | bash
```

Open http://127.0.0.1:8000 in a web browser.

**Update:**
```bash
imgboard-explorer update
# or re-run the install command
```

**Uninstall:**
```bash
curl -sSL https://raw.githubusercontent.com/htmlgxn/comfy-imageboard-explorer/main/scripts/install.sh | bash -s -- --uninstall
# this will also remove development directory - see below
```

### Development (Full Repository with Tests)

```bash
curl -sSL https://raw.githubusercontent.com/htmlgxn/comfy-imageboard-explorer/main/scripts/install.sh | bash -s -- --dev
```

**Customize install location:**
```bash
# Use environment variable for non-interactive install
DEV_DIR=~/code/imgboard-explorer curl -sSL https://raw.githubusercontent.com/htmlgxn/comfy-imageboard-explorer/main/scripts/install.sh | bash -s -- --dev
```

For development setup, testing, and contribution guidelines, see [DEVELOPMENT.md](DEVELOPMENT.md).

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

## Notes

- This project respects 4chan API rules and uses `If-Modified-Since` with in-memory caching.
- The app is not affiliated with or endorsed by 4chan.

## License

[Unlicense](LICENSE)
