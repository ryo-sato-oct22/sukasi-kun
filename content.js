(function() {
  const HOST_ELEMENT_ID = 'sukasi-kun-watermark-host';

  // Apply watermark based on current hostname and configurations
  function applyWatermark(rules) {
    const hostname = window.location.hostname;
    if (!hostname) return;

    // Filter rules that match the current hostname
    const matches = rules.filter(rule => {
      const target = rule.domain.toLowerCase().trim();
      return hostname.includes(target);
    });

    if (matches.length === 0) return;

    // Sort by domain length descending so the most specific domain matches first
    // E.g., "dev.example.com" wins over "example.com"
    matches.sort((a, b) => b.domain.length - a.domain.length);
    const activeRule = matches[0];

    injectWatermark(activeRule);
  }

  // Inject watermark into the DOM using Shadow DOM
  function injectWatermark(rule) {
    // Remove existing watermark if any
    removeExistingWatermark();

    // Create host element
    const host = document.createElement('div');
    host.id = HOST_ELEMENT_ID;
    
    // Position host at the configured corner
    host.style.position = 'fixed';
    host.style.zIndex = '2147483647'; // Max possible z-index
    host.style.pointerEvents = 'none'; // Pass-through clicks
    host.style.userSelect = 'none'; // Disable text selection

    if (rule.positionY === 'top') {
      host.style.top = '16px';
    } else {
      host.style.bottom = '16px';
    }

    if (rule.positionX === 'left') {
      host.style.left = '16px';
    } else {
      host.style.right = '16px';
    }

    // Attach Shadow DOM for encapsulation
    const shadow = host.attachShadow({ mode: 'open' });

    // Create the watermark badge element
    const badge = document.createElement('div');
    badge.textContent = rule.text;
    
    // Style the badge (premium design: glassmorphism, nice shadows)
    badge.style.fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    badge.style.fontWeight = 'bold';
    badge.style.fontSize = `${rule.fontSize}px`;
    badge.style.color = rule.textColor;
    badge.style.backgroundColor = rule.bgColor;
    badge.style.opacity = rule.textOpacity / 100;
    badge.style.padding = '6px 14px';
    badge.style.borderRadius = '8px';
    badge.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.25), 0 0 1px rgba(0, 0, 0, 0.5)';
    badge.style.border = '1px solid rgba(255, 255, 255, 0.15)';
    badge.style.whiteSpace = 'nowrap';
    badge.style.lineHeight = '1.2';
    badge.style.backdropFilter = 'blur(4px)';
    badge.style.webkitBackdropFilter = 'blur(4px)';

    shadow.appendChild(badge);

    // Append to document element (html tag) to ensure it's loaded even if body isn't fully ready
    document.documentElement.appendChild(host);
  }

  // Remove watermark host element if it exists
  function removeExistingWatermark() {
    const existing = document.getElementById(HOST_ELEMENT_ID);
    if (existing) {
      existing.remove();
    }
  }

  // Initial load
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    chrome.storage.local.get({ rules: [] }, (result) => {
      applyWatermark(result.rules);
    });

    // Listen for storage changes to update watermark dynamically
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === 'local' && changes.rules) {
        removeExistingWatermark();
        applyWatermark(changes.rules.newValue || []);
      }
    });
  }
})();
