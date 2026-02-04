(function () {
  'use strict';

  // Sunday = 0, Monday = 1, ... Saturday = 6 (matches Date.getDay())
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var WORKOUTS = [
    {
      name: 'Active Recovery or Optional',
      summary: 'Walk, swim, or bike 20–40 min easy — or light station practice (wall balls + farmer’s carry) + stretch.',
      purpose: 'Recovery and readiness for Monday'
    },
    {
      name: 'Run + Station Focus',
      summary: 'Easy run 20–30 min (Zone 2) + 2–3 station primers. Example: 1 round of 250m SkiErg, 25m sled push, 20 wall balls (light).',
      purpose: 'Aerobic base, movement prep, low fatigue'
    },
    {
      name: 'Strength + Engine',
      summary: 'Strength: lower body + core (squats, lunges, leg curls, planks, carries). Engine: 15–20 min intervals (1 min hard / 1 min easy on row or SkiErg).',
      purpose: 'Build strength and work capacity for sled, lunges, wall balls'
    },
    {
      name: 'Running Intervals',
      summary: '6–8 × 400m or 4–5 × 800m with 90s–2 min rest (race-pace effort). Optional: short core or hip mobility.',
      purpose: 'Run speed and familiarity with race-pace 1 km efforts'
    },
    {
      name: 'Rest or Easy',
      summary: 'Full rest, or 20–30 min easy run or bike + stretching/mobility.',
      purpose: 'Recovery before weekend load'
    },
    {
      name: 'Station Practice + Short Run',
      summary: '2–3 rounds of 2–3 stations (e.g. sled push + sled pull + burpee broad jump; 50–70% of race). Run: 2–3 × 1 km steady with 2 min rest.',
      purpose: 'Race-specific skills and run–station sequencing'
    },
    {
      name: 'Long Run or Tempo',
      summary: '40–60 min easy, or 25–35 min with 15–20 min at tempo.',
      purpose: 'Aerobic endurance and time on feet'
    }
  ];

  function getTodayIndex() {
    return new Date().getDay();
  }

  function renderToday() {
    var i = getTodayIndex();
    var dayNameEl = document.getElementById('day-name');
    var contentEl = document.getElementById('workout-content');
    if (!dayNameEl || !contentEl) return;

    dayNameEl.textContent = DAYS[i];
    var w = WORKOUTS[i];
    contentEl.innerHTML = '';
    contentEl.appendChild(createElement('h3', { textContent: w.name }));
    contentEl.appendChild(createElement('p', { textContent: w.summary, className: 'summary' }));
    contentEl.appendChild(createElement('p', { textContent: 'Purpose: ' + w.purpose, className: 'purpose' }));
  }

  function createElement(tag, props) {
    var el = document.createElement(tag);
    Object.keys(props).forEach(function (k) {
      if (k === 'className') el.className = props[k];
      else if (k === 'textContent') el.textContent = props[k];
      else el.setAttribute(k, props[k]);
    });
    return el;
  }

  function renderWeek() {
    var list = document.getElementById('week-list');
    if (!list) return;
    list.innerHTML = '';
    var today = getTodayIndex();
    for (var i = 0; i < DAYS.length; i++) {
      var li = document.createElement('li');
      if (i === today) li.className = 'active';
      li.appendChild(createElement('strong', { textContent: DAYS[i] + ': ' }));
      li.appendChild(document.createTextNode(WORKOUTS[i].name));
      list.appendChild(li);
    }
  }

  function sendNotification() {
    if (!('Notification' in window)) {
      setStatus('This browser doesn’t support notifications.');
      return;
    }
    if (Notification.permission === 'denied') {
      setStatus('Notifications are blocked. Enable them in your browser settings.');
      return;
    }
    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then(function (p) {
        if (p === 'granted') doNotify();
        else setStatus('Permission denied. Enable notifications to get reminders.');
      });
      return;
    }
    doNotify();
  }

  function doNotify() {
    var i = getTodayIndex();
    var w = WORKOUTS[i];
    var title = DAYS[i] + ': ' + w.name;
    var body = w.summary.slice(0, 200) + (w.summary.length > 200 ? '…' : '');
    try {
      new Notification(title, { body: body });
      setStatus('Notification sent. Check your system notifications.');
    } catch (e) {
      setStatus('Could not send notification.');
    }
  }

  function setStatus(msg) {
    var el = document.getElementById('notify-status');
    if (el) el.textContent = msg;
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderToday();
    renderWeek();
    var btn = document.getElementById('notify-btn');
    if (btn) btn.addEventListener('click', sendNotification);
  });
})();
