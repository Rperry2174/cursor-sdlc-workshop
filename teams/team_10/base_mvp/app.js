(function () {
  'use strict';

  var URGENCY_ORDER = { urgent: 0, normal: 1, low: 2 };

  var currentFilter = 'all';
  var selectedConversationId = null;

  var mockNotifications = [
    { id: '1', source: 'email', sender: 'team@company.com', preview: 'Meeting at 3pm tomorrow', urgency: 'urgent',
      messages: [
        { text: 'Can we move the project review to Thursday?', fromMe: false },
        { text: 'Sure, I\'ll check the calendar.', fromMe: true },
        { text: 'Meeting at 3pm tomorrow', fromMe: false }
      ] },
    { id: '2', source: 'sms', sender: '+1 555-1234', preview: 'Your code is ready for review', urgency: 'normal',
      messages: [
        { text: 'Hey, I pushed the changes.', fromMe: false },
        { text: 'Your code is ready for review', fromMe: false }
      ] },
    { id: '3', source: 'whatsapp', sender: 'Mom', preview: 'Call me when you can', urgency: 'urgent',
      messages: [
        { text: 'Are you free this weekend?', fromMe: false },
        { text: 'Yes! What\'s up?', fromMe: true },
        { text: 'Call me when you can', fromMe: false }
      ] },
    { id: '4', source: 'instagram', sender: 'jane_doe', preview: 'Liked your photo', urgency: 'low',
      messages: [
        { text: 'Liked your photo', fromMe: false }
      ] },
    { id: '5', source: 'email', sender: 'newsletter@blog.com', preview: 'Weekly digest is here', urgency: 'low',
      messages: [
        { text: 'Weekly digest is here', fromMe: false }
      ] },
    { id: '6', source: 'whatsapp', sender: 'Dev Group', preview: 'PR merged to main', urgency: 'normal',
      messages: [
        { text: 'PR merged to main', fromMe: false }
      ] },
    { id: '7', source: 'sms', sender: 'Bank', preview: 'Your balance alert', urgency: 'urgent',
      messages: [
        { text: 'Your balance alert', fromMe: false }
      ] },
    { id: '8', source: 'instagram', sender: 'friend_amy', preview: 'Replied to your story', urgency: 'low',
      messages: [
        { text: 'Replied to your story', fromMe: false }
      ] }
  ];

  function getConversationById(id) {
    for (var i = 0; i < mockNotifications.length; i++) {
      if (mockNotifications[i].id === id) return mockNotifications[i];
    }
    return null;
  }

  function getFilteredList() {
    if (currentFilter === 'all') return mockNotifications;
    return mockNotifications.filter(function (n) { return n.urgency === currentFilter; });
  }

  function sortByUrgency(list) {
    return list.slice().sort(function (a, b) {
      return (URGENCY_ORDER[a.urgency] ?? 1) - (URGENCY_ORDER[b.urgency] ?? 1);
    });
  }

  function showInboxView() {
    var inboxView = document.getElementById('inbox-view');
    var replyPanel = document.getElementById('reply-panel');
    var threadView = document.getElementById('thread-view');
    if (inboxView) inboxView.style.display = '';
    if (replyPanel) replyPanel.style.display = '';
    if (threadView) { threadView.hidden = true; threadView.style.display = 'none'; }
  }

  function showThreadView() {
    var inboxView = document.getElementById('inbox-view');
    var replyPanel = document.getElementById('reply-panel');
    var threadView = document.getElementById('thread-view');
    if (inboxView) inboxView.style.display = 'none';
    if (replyPanel) replyPanel.style.display = 'none';
    if (threadView) { threadView.hidden = false; threadView.style.display = 'flex'; }
  }

  function openThread(id) {
    selectedConversationId = id;
    showThreadView();
    renderThreadView();
  }

  function closeThread() {
    selectedConversationId = null;
    showInboxView();
  }

  function renderThreadView() {
    if (!selectedConversationId) return;
    var conv = getConversationById(selectedConversationId);
    if (!conv || !conv.messages) return;

    var titleEl = document.getElementById('thread-title');
    var channelEl = document.getElementById('thread-channel');
    var messagesEl = document.getElementById('thread-messages');
    if (titleEl) titleEl.textContent = conv.sender;
    if (channelEl) channelEl.textContent = conv.source.charAt(0).toUpperCase() + conv.source.slice(1);
    if (!messagesEl) return;

    messagesEl.textContent = '';
    conv.messages.forEach(function (msg) {
      var div = document.createElement('div');
      div.className = 'thread-message ' + (msg.fromMe ? 'thread-message-from-me' : 'thread-message-from-them');
      div.textContent = msg.text;
      messagesEl.appendChild(div);
    });
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function handleThreadSend() {
    if (!selectedConversationId) return;
    var input = document.getElementById('thread-reply-input');
    var text = input && input.value ? input.value.trim() : '';
    if (!text) return;

    var conv = getConversationById(selectedConversationId);
    if (!conv) return;
    if (!conv.messages) conv.messages = [];
    conv.messages.push({ text: text, fromMe: true });
    conv.preview = text;
    if (input) input.value = '';

    renderThreadView();
  }

  function renderNotifications(list) {
    var container = document.getElementById('notification-list');
    if (!container) return;
    container.textContent = '';
    var sorted = sortByUrgency(list);
    sorted.forEach(function (n) {
      var card = document.createElement('div');
      card.className = 'notification-card urgency-' + n.urgency;
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('data-id', n.id);
      card.addEventListener('click', function () { openThread(n.id); });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openThread(n.id); }
      });
      var item = document.createElement('div');
      item.className = 'notification-item';
      item.setAttribute('role', 'listitem');
      item.setAttribute('data-id', n.id);
      var avatar = document.createElement('div');
      avatar.className = 'notification-avatar';
      avatar.setAttribute('aria-hidden', 'true');
      avatar.textContent = (n.sender && n.sender.charAt(0)) ? n.sender.charAt(0).toUpperCase() : '?';
      var bubble = document.createElement('div');
      bubble.className = 'notification-bubble';
      var body = document.createElement('div');
      body.className = 'notification-body';
      var badge = document.createElement('span');
      badge.className = 'channel-badge channel-badge-' + n.source;
      badge.textContent = n.source.charAt(0).toUpperCase() + n.source.slice(1);
      var sender = document.createElement('span');
      sender.className = 'sender';
      sender.textContent = n.sender;
      var preview = document.createElement('span');
      preview.className = 'preview';
      preview.textContent = n.preview;
      var urgency = document.createElement('span');
      urgency.className = 'urgency';
      urgency.textContent = n.urgency;
      body.appendChild(badge);
      body.appendChild(sender);
      body.appendChild(preview);
      body.appendChild(urgency);
      bubble.appendChild(body);
      item.appendChild(avatar);
      item.appendChild(bubble);
      card.appendChild(item);
      container.appendChild(card);
    });
  }

  function setFilter(filter) {
    currentFilter = filter;
    renderNotifications(getFilteredList());
    renderFilterTabs();
  }

  function renderFilterTabs() {
    var container = document.getElementById('filter-tabs');
    if (!container) return;
    container.textContent = '';
    var labels = [
      { value: 'all', label: 'All' },
      { value: 'urgent', label: 'Urgent' },
      { value: 'normal', label: 'Normal' },
      { value: 'low', label: 'Low' }
    ];
    labels.forEach(function (opt) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'filter-tab' + (currentFilter === opt.value ? ' filter-tab-active' : '');
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', currentFilter === opt.value ? 'true' : 'false');
      btn.textContent = opt.label;
      btn.addEventListener('click', function () { setFilter(opt.value); });
      container.appendChild(btn);
    });
  }

  function handleSend() {
    var input = document.getElementById('reply-input');
    var confirmation = document.getElementById('reply-confirmation');
    var msg = input && input.value ? input.value.trim() : '';
    if (msg) {
      var list = document.getElementById('notification-list');
      if (list) {
        var line = document.createElement('div');
        line.className = 'reply-sent-message';
        line.textContent = 'Reply sent: ' + msg;
        list.appendChild(line);
      }
      if (input) input.value = '';
      if (confirmation) {
        confirmation.textContent = 'Reply sent!';
        confirmation.hidden = false;
        setTimeout(function () {
          confirmation.textContent = '';
          confirmation.hidden = true;
        }, 2500);
      }
    } else {
      if (confirmation) {
        confirmation.textContent = 'Reply sent!';
        confirmation.hidden = false;
        setTimeout(function () {
          confirmation.textContent = '';
          confirmation.hidden = true;
        }, 1500);
      }
    }
  }

  function init() {
    renderFilterTabs();
    renderNotifications(getFilteredList());

    var btn = document.getElementById('reply-send');
    if (btn) btn.addEventListener('click', handleSend);

    var backBtn = document.getElementById('thread-back');
    if (backBtn) backBtn.addEventListener('click', closeThread);

    var threadSendBtn = document.getElementById('thread-send');
    if (threadSendBtn) threadSendBtn.addEventListener('click', handleThreadSend);

    var threadInput = document.getElementById('thread-reply-input');
    if (threadInput) {
      threadInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); handleThreadSend(); }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
