/* Daily Prayer generator: deterministic for each local calendar date. */
(function (global) {
  const passages = [
    { reference: 'Psalm 23:1', verse: 'The LORD is my shepherd; I shall not want.', title: 'Be led, not hurried.', prompt: 'Lord, lead me beside still waters today. Teach me to receive Thy care before I try to carry everything myself.' },
    { reference: 'Isaiah 41:10', verse: 'Fear thou not; for I am with thee: be not dismayed; for I am thy God.', title: 'Courage for the next step.', prompt: 'Lord, quiet my fear and make Thy presence more real than the uncertainty in front of me.' },
    { reference: 'Matthew 11:28', verse: 'Come unto me, all ye that labour and are heavy laden, and I will give you rest.', title: 'A place to lay it down.', prompt: 'Jesus, receive the burdens I have been carrying. Give me the humility to rest and the grace to begin again.' },
    { reference: 'Philippians 4:6', verse: 'Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God.', title: 'Turn worry into prayer.', prompt: 'Lord, meet me in the details of this day. Replace anxious thoughts with thankful attention and quiet trust.' },
    { reference: 'Romans 15:13', verse: 'Now the God of hope fill you with all joy and peace in believing.', title: 'Make room for hope.', prompt: 'God of hope, fill the spaces in me that have grown tired. Let joy and peace become visible in the way I move through today.' },
    { reference: 'Proverbs 3:5', verse: 'Trust in the LORD with all thine heart; and lean not unto thine own understanding.', title: 'Trust beyond the map.', prompt: 'Lord, loosen my grip on the need to understand everything. Make my next faithful step clear enough.' },
    { reference: 'Psalm 46:1', verse: 'God is our refuge and strength, a very present help in trouble.', title: 'A present help.', prompt: 'Lord, be my refuge in the places that feel loud. Give me strength for what is mine to do and wisdom for what is not.' }
  ];

  function todayKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function seedFor(dateKey) {
    return [...dateKey].reduce((sum, char, index) => sum + char.charCodeAt(0) * (index + 1), 0);
  }

  function forDate(dateKey = todayKey()) {
    const selected = passages[seedFor(dateKey) % passages.length];
    return { date: dateKey, ...selected };
  }

  function getToday() { return forDate(todayKey()); }

  global.DailyPrayer = { todayKey, forDate, getToday };
})(window);
