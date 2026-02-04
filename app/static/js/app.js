(function () {
  const items = Array.from(document.querySelectorAll('.selectable'));
  const screen = document.body.dataset.screen || '';
  const descriptionEl = document.getElementById('board-description');
  const rofiOverlay = document.getElementById('board-search');
  const rofiQuery = document.getElementById('rofi-query');
  const rofiResults = document.getElementById('rofi-results');
  const shareContext = document.querySelector('[data-share-base], [data-share-url]');
  const shareBase = shareContext ? shareContext.getAttribute('data-share-base') || '' : '';
  const shareUrl = shareContext ? shareContext.getAttribute('data-share-url') || '' : '';
  const shareButtons = Array.from(document.querySelectorAll('[data-action="share"]'));

  let index = items.findIndex((item) => item.classList.contains('selected'));
  let activeLinkIndex = -1;
  let linkRows = [];
  let activeRowIndex = -1;
  let isRofiOpen = false;
  let rofiText = '';
  let rofiSelection = 0;
  let rofiMatches = [];
  let boardDataset = [];
  let toastTimer;
  if (index < 0 && items.length) {
    index = 0;
    items[0].classList.add('selected');
  }

  function trackEvent(eventName, meta) {
    if (!eventName) {
      return;
    }
    const payload = {
      event: eventName,
      meta: {
        screen,
        ...(meta || {}),
      },
    };
    fetch('/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {});
  }

  function showToast(message) {
    if (!message) {
      return;
    }
    let toast = document.querySelector('.share-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'share-toast';
      const container = document.querySelector('.app') || document.body;
      container.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toast.classList.remove('visible');
    }, 2200);
  }

  function buildShareUrl() {
    if (shareUrl) {
      return new URL(shareUrl, window.location.origin).toString();
    }
    if (shareBase) {
      const selected = items[index] || document.querySelector('.selectable.selected');
      const postId = selected ? selected.getAttribute('data-post-id') : '';
      if (postId) {
        return new URL(`${shareBase}${postId}`, window.location.origin).toString();
      }
    }
    return window.location.href;
  }

  async function handleShare() {
    if (!shareUrl && !shareBase) {
      return;
    }
    const url = buildShareUrl();
    trackEvent('share_clicked', { url });
    if (navigator.share) {
      try {
        await navigator.share({ url });
        trackEvent('share_completed', { url, method: 'native' });
        showToast('Share opened');
        return;
      } catch (err) {
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      trackEvent('share_completed', { url, method: 'clipboard' });
      showToast('Link copied');
    } catch (err) {
      trackEvent('share_completed', { url, method: 'prompt' });
      window.prompt('Copy link', url);
      showToast('Link ready');
    }
  }

  function buildBoardDataset() {
    if (screen !== 'home') {
      return [];
    }
    return items.map((item, idx) => ({
      code: item.getAttribute('data-board') || '',
      title: item.getAttribute('data-title') || '',
      href: item.getAttribute('data-href') || '',
      index: idx,
    }));
  }

  function getLinkElements(item) {
    if (!item) {
      return [];
    }
    return Array.from(item.querySelectorAll('.nav-link'));
  }

  function clearActiveQuotes(item) {
    if (!item) {
      return;
    }
    item.querySelectorAll('.nav-link.active').forEach((el) => {
      el.classList.remove('active');
    });
  }

  function buildLinkRows(item) {
    const links = getLinkElements(item);
    const rows = [];
    const tolerance = 6;
    links.forEach((link) => {
      const rect = link.getBoundingClientRect();
      const row = rows.find((entry) => Math.abs(entry.top - rect.top) <= tolerance);
      if (row) {
        row.links.push(link);
      } else {
        rows.push({ top: rect.top, links: [link] });
      }
    });
    rows.forEach((row) => {
      row.links.sort((a, b) => a.getBoundingClientRect().left - b.getBoundingClientRect().left);
    });
    rows.sort((a, b) => a.top - b.top);
    return rows;
  }

  function updateDescription(item) {
    if (screen !== 'home' || !descriptionEl || !item) {
      return;
    }
    const desc = item.getAttribute('data-desc') || '';
    descriptionEl.textContent = desc;
  }

  function openRofi(initialChar) {
    if (!rofiOverlay || !rofiQuery || !rofiResults) {
      return;
    }
    isRofiOpen = true;
    rofiText = initialChar || '';
    rofiSelection = 0;
    rofiOverlay.classList.remove('hidden');
    rofiOverlay.setAttribute('aria-hidden', 'false');
    updateRofi();
  }

  function closeRofi() {
    if (!rofiOverlay) {
      return;
    }
    isRofiOpen = false;
    rofiText = '';
    rofiSelection = 0;
    rofiMatches = [];
    rofiOverlay.classList.add('hidden');
    rofiOverlay.setAttribute('aria-hidden', 'true');
    if (rofiQuery) {
      rofiQuery.textContent = '';
    }
    if (rofiResults) {
      rofiResults.innerHTML = '';
    }
  }

  function updateRofi() {
    if (!rofiQuery || !rofiResults) {
      return;
    }
    rofiQuery.textContent = rofiText;
    const query = rofiText.trim().toLowerCase();
    rofiMatches = boardDataset.filter((board) => {
      const code = board.code.toLowerCase();
      const title = board.title.toLowerCase();
      if (!query) {
        return true;
      }
      return code.includes(query) || title.includes(query);
    });
    if (query) {
      rofiMatches.sort((a, b) => {
        const aCode = a.code.toLowerCase();
        const bCode = b.code.toLowerCase();
        const aTitle = a.title.toLowerCase();
        const bTitle = b.title.toLowerCase();

        const aScore = aCode.startsWith(query)
          ? 0
          : aCode.includes(query)
            ? 1
            : aTitle.includes(query)
              ? 2
              : 3;
        const bScore = bCode.startsWith(query)
          ? 0
          : bCode.includes(query)
            ? 1
            : bTitle.includes(query)
              ? 2
              : 3;

        if (aScore !== bScore) {
          return aScore - bScore;
        }
        return a.index - b.index;
      });
    }
    rofiMatches = rofiMatches.slice(0, 5);
    if (rofiSelection >= rofiMatches.length) {
      rofiSelection = 0;
    }
    rofiResults.innerHTML = '';
    rofiMatches.forEach((board, idx) => {
      const li = document.createElement('li');
      li.className = `rofi-result${idx === rofiSelection ? ' selected' : ''}`;
      li.innerHTML = `<span class="code">/${board.code}/</span><span class="title">${board.title}</span>`;
      rofiResults.appendChild(li);
    });
  }

  function setSelected(nextIndex, shouldScroll) {
    if (!items.length || nextIndex < 0 || nextIndex >= items.length) {
      return;
    }
    clearActiveQuotes(items[index]);
    items[index].classList.remove('selected');
    index = nextIndex;
    const item = items[index];
    item.classList.add('selected');
    updateDescription(item);
    activeLinkIndex = -1;
    activeRowIndex = -1;
    linkRows = buildLinkRows(item);
    if (shouldScroll) {
      item.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }

  function setSelectedByElement(element, shouldScroll) {
    if (!items.length) {
      return;
    }
    const nextIndex = items.indexOf(element);
    if (nextIndex === -1) {
      return;
    }
    setSelected(nextIndex, shouldScroll);
  }

  function jumpToQuotedPost(quoteId) {
    if (!quoteId) {
      return false;
    }
    const target = items.find((item) => item.getAttribute('data-post-id') === quoteId);
    if (!target) {
      return false;
    }
    setSelectedByElement(target, true);
    return true;
  }

  if (items.length) {
    updateDescription(items[index]);
    linkRows = buildLinkRows(items[index]);
  }
  boardDataset = buildBoardDataset();
  if (shareButtons.length) {
    shareButtons.forEach((button) => {
      button.addEventListener('click', handleShare);
    });
  }

  window.addEventListener('pageshow', () => {
    if (screen === 'home' && sessionStorage.getItem('rofiNavigated')) {
      closeRofi();
      sessionStorage.removeItem('rofiNavigated');
    }
  });

  document.addEventListener('keydown', (event) => {
    const activeTag = document.activeElement ? document.activeElement.tagName : '';
    if (activeTag === 'INPUT' || activeTag === 'TEXTAREA') {
      return;
    }

    if (event.key === 'h' || event.key === 'H') {
      event.preventDefault();
      window.location.href = '/';
      return;
    }

    if (event.key === 'Backspace') {
      if (isRofiOpen) {
        event.preventDefault();
        rofiText = rofiText.slice(0, -1);
        if (!rofiText) {
          closeRofi();
        } else {
          updateRofi();
        }
        return;
      }
      if (screen !== 'home') {
        event.preventDefault();
        window.history.back();
      }
      return;
    }

    if ((event.key === 'c' || event.key === 'C') && (shareUrl || shareBase)) {
      event.preventDefault();
      handleShare();
      return;
    }

    if (screen === 'home' && rofiOverlay) {
      const isPrintable =
        event.key.length === 1 &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey;
      if (isPrintable && !isRofiOpen) {
        event.preventDefault();
        openRofi(event.key);
        return;
      }
      if (isRofiOpen) {
        if (event.key === 'Escape') {
          event.preventDefault();
          closeRofi();
          return;
        }
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault();
          if (!rofiMatches.length) {
            return;
          }
          const delta = event.key === 'ArrowDown' ? 1 : -1;
          rofiSelection = (rofiSelection + delta + rofiMatches.length) % rofiMatches.length;
          updateRofi();
          return;
        }
        if (event.key === 'Enter') {
          event.preventDefault();
          const target = rofiMatches[rofiSelection];
          if (target && target.href) {
            sessionStorage.setItem('rofiNavigated', '1');
            window.location.href = target.href;
          }
          return;
        }
        if (isPrintable) {
          event.preventDefault();
          rofiText += event.key;
          updateRofi();
          return;
        }
        return;
      }
    }

    if (!items.length) {
      return;
    }

    if (event.key === 'ArrowDown' || event.key === 'j') {
      event.preventDefault();
      setSelected(index + 1, true);
      return;
    }

    if (event.key === 'ArrowUp' || event.key === 'k') {
      event.preventDefault();
      setSelected(index - 1, true);
      return;
    }

    if (event.key === 'Enter') {
      const item = items[index];
      const href = item.getAttribute('data-href');
      if (href) {
        window.location.href = href;
      }
    }

    if (event.key === 'w' || event.key === 'W' || event.key === 's' || event.key === 'S') {
      const item = items[index];
      if (!linkRows.length) {
        return;
      }
      event.preventDefault();
      if (activeRowIndex === -1) {
        activeRowIndex = event.key.toLowerCase() === 'w' ? 0 : 0;
        activeLinkIndex = 0;
      } else {
        const delta = event.key.toLowerCase() === 'w' ? -1 : 1;
        const nextRowIndex =
          (activeRowIndex + delta + linkRows.length) % linkRows.length;
        const currentLink =
          linkRows[activeRowIndex] &&
          linkRows[activeRowIndex].links[activeLinkIndex];
        const currentLeft = currentLink ? currentLink.getBoundingClientRect().left : 0;
        const targetRow = linkRows[nextRowIndex];
        let closestIndex = 0;
        let closestDistance = Infinity;
        targetRow.links.forEach((link, idx) => {
          const distance = Math.abs(link.getBoundingClientRect().left - currentLeft);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = idx;
          }
        });
        activeRowIndex = nextRowIndex;
        activeLinkIndex = closestIndex;
      }
      clearActiveQuotes(item);
      linkRows[activeRowIndex].links[activeLinkIndex].classList.add('active');
      return;
    }

    if (event.key === 'a' || event.key === 'A' || event.key === 'd' || event.key === 'D') {
      const item = items[index];
      if (!linkRows.length) {
        return;
      }
      event.preventDefault();
      if (activeRowIndex === -1) {
        activeRowIndex = 0;
        activeLinkIndex = 0;
      } else {
        const delta = event.key.toLowerCase() === 'a' ? -1 : 1;
        const rowLinks = linkRows[activeRowIndex].links;
        let nextIndex = activeLinkIndex + delta;
        if (nextIndex < 0) {
          activeRowIndex = (activeRowIndex - 1 + linkRows.length) % linkRows.length;
          activeLinkIndex = linkRows[activeRowIndex].links.length - 1;
        } else if (nextIndex >= rowLinks.length) {
          activeRowIndex = (activeRowIndex + 1) % linkRows.length;
          activeLinkIndex = 0;
        } else {
          activeLinkIndex = nextIndex;
        }
      }
      clearActiveQuotes(item);
      linkRows[activeRowIndex].links[activeLinkIndex].classList.add('active');
      return;
    }

    if (event.key === 'e' || event.key === 'E') {
      const item = items[index];
      if (activeRowIndex === -1 || !linkRows.length) {
        return;
      }
      event.preventDefault();
      const activeLink = linkRows[activeRowIndex].links[activeLinkIndex];
      if (!activeLink) {
        return;
      }
      const quoteId = activeLink.getAttribute('data-quote-id');
      const externalUrl = activeLink.getAttribute('data-url');
      if (quoteId) {
        jumpToQuotedPost(quoteId);
        return;
      }
      if (externalUrl) {
        window.open(externalUrl, '_blank');
      }
    }
  });
})();
