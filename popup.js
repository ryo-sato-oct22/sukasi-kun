document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const ruleForm = document.getElementById('ruleForm');
  const domainInput = document.getElementById('domain');
  const textInput = document.getElementById('text');
  
  const fontSizeInput = document.getElementById('fontSize');
  const fontSizeVal = document.getElementById('fontSizeVal');
  
  const textOpacityInput = document.getElementById('textOpacity');
  const textOpacityVal = document.getElementById('textOpacityVal');
  
  const textColorInput = document.getElementById('textColor');
  const textColorCode = document.getElementById('textColorCode');
  
  const bgColorInput = document.getElementById('bgColor');
  const bgColorCode = document.getElementById('bgColorCode');
  
  const posButtons = document.querySelectorAll('.pos-btn');
  const previewArea = document.getElementById('previewArea');
  const watermarkPreview = document.getElementById('watermarkPreview');
  
  const rulesList = document.getElementById('rulesList');
  const ruleCount = document.getElementById('ruleCount');

  // State
  let selectedX = 'right';
  let selectedY = 'top';
  let rules = [];

  // Initialize
  loadRules();
  updatePreview();

  // Position Buttons Toggle
  posButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      posButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedX = btn.dataset.x;
      selectedY = btn.dataset.y;
      updatePreview();
    });
  });

  // Event Listeners for Live Preview & Value Labels
  fontSizeInput.addEventListener('input', () => {
    fontSizeVal.textContent = `${fontSizeInput.value}px`;
    updatePreview();
  });

  textOpacityInput.addEventListener('input', () => {
    textOpacityVal.textContent = `${textOpacityInput.value}%`;
    updatePreview();
  });

  textColorInput.addEventListener('input', () => {
    textColorCode.textContent = textColorInput.value.toUpperCase();
    updatePreview();
  });

  bgColorInput.addEventListener('input', () => {
    bgColorCode.textContent = bgColorInput.value.toUpperCase();
    updatePreview();
  });

  textInput.addEventListener('input', updatePreview);

  // Update Live Preview Styles
  function updatePreview() {
    const text = textInput.value || 'PREVIEW';
    const fontSize = fontSizeInput.value;
    const opacity = textOpacityInput.value / 100;
    const textColor = textColorInput.value;
    const bgColor = bgColorInput.value;

    watermarkPreview.textContent = text;
    watermarkPreview.style.fontSize = `${fontSize}px`;
    watermarkPreview.style.color = textColor;
    watermarkPreview.style.backgroundColor = bgColor;
    watermarkPreview.style.opacity = opacity;

    // Reset positions
    watermarkPreview.style.top = 'auto';
    watermarkPreview.style.bottom = 'auto';
    watermarkPreview.style.left = 'auto';
    watermarkPreview.style.right = 'auto';

    // Apply positioning to preview box
    if (selectedY === 'top') {
      watermarkPreview.style.top = '8px';
    } else {
      watermarkPreview.style.bottom = '8px';
    }

    if (selectedX === 'left') {
      watermarkPreview.style.left = '8px';
    } else {
      watermarkPreview.style.right = '8px';
    }
  }

  // Load rules from chrome.storage.local
  function loadRules() {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get({ rules: [] }, (result) => {
        rules = result.rules;
        renderRules();
      });
    } else {
      // Mock data for development outside of extension context
      rules = [
        {
          id: '1',
          domain: 'localhost',
          text: 'LOCAL-DEV',
          fontSize: 16,
          textOpacity: 80,
          textColor: '#ffffff',
          bgColor: '#10b981',
          positionX: 'right',
          positionY: 'top'
        },
        {
          id: '2',
          domain: 'staging.example.com',
          text: 'STAGING',
          fontSize: 20,
          textOpacity: 70,
          textColor: '#ffffff',
          bgColor: '#f59e0b',
          positionX: 'left',
          positionY: 'bottom'
        }
      ];
      renderRules();
    }
  }

  // Save rules to chrome.storage.local
  function saveRulesToStorage() {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ rules }, () => {
        renderRules();
      });
    } else {
      renderRules();
    }
  }

  // Render Rules List
  function renderRules() {
    ruleCount.textContent = rules.length;

    if (rules.length === 0) {
      rulesList.innerHTML = `
        <div class="empty-state">
          <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <p>登録されたルールはありません。<br>上のフォームから登録してください。</p>
        </div>
      `;
      return;
    }

    rulesList.innerHTML = '';
    rules.forEach(rule => {
      const item = document.createElement('div');
      item.className = 'rule-item';
      
      // Short position description
      const posDesc = `${rule.positionY === 'top' ? '上' : '下'}${rule.positionX === 'left' ? '左' : '右'}`;

      item.innerHTML = `
        <div class="rule-info">
          <div class="rule-domain" title="${escapeHtml(rule.domain)}">${escapeHtml(rule.domain)}</div>
          <div class="rule-badge-container">
            <span class="rule-pos-tag">${posDesc}</span>
            <span class="rule-watermark-text" style="color: ${rule.textColor}; background-color: ${rule.bgColor}; opacity: ${rule.textOpacity / 100}">
              ${escapeHtml(rule.text)}
            </span>
          </div>
        </div>
        <div class="rule-actions">
          <button class="action-btn delete" data-id="${rule.id}" title="削除">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      `;
      rulesList.appendChild(item);
    });

    // Add event listeners for delete buttons
    const deleteButtons = rulesList.querySelectorAll('.action-btn.delete');
    deleteButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.dataset.id;
        rules = rules.filter(r => r.id !== id);
        saveRulesToStorage();
      });
    });
  }

  // Handle Form Submit
  ruleForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const domain = domainInput.value.trim().toLowerCase();
    const text = textInput.value.trim();
    const fontSize = parseInt(fontSizeInput.value, 10);
    const textOpacity = parseInt(textOpacityInput.value, 10);
    const textColor = textColorInput.value;
    const bgColor = bgColorInput.value;

    if (!domain || !text) return;

    // Check if domain rule already exists
    const exists = rules.some(r => r.domain === domain);
    if (exists) {
      alert(`ドメイン「${domain}」のルールは既に存在します。既存のルールを削除してから再登録してください。`);
      return;
    }

    const newRule = {
      id: Date.now().toString(),
      domain,
      text,
      fontSize,
      textOpacity,
      textColor,
      bgColor,
      positionX: selectedX,
      positionY: selectedY
    };

    rules.push(newRule);
    saveRulesToStorage();

    // Reset only domain input to keep other style settings
    domainInput.value = '';
    domainInput.focus();
  });

  // Helper to escape HTML to prevent XSS
  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#039;');
  }
});
