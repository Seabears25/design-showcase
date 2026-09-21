const BOOK_ORDER = Object.keys(window.KJV_BOOK_META);
const bookFile = name => name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
const todayKey = () => new Date().toISOString().slice(0, 10);

const state = {
  screen: 'home',
  book: localStorage.getItem('kjv_book') || 'Genesis',
  chapter: Number(localStorage.getItem('kjv_chapter') || 1),
  query: '',
  searchBook: 'all',
  selectedPrayerDate: todayKey(),
  prayers: JSON.parse(localStorage.getItem('kjv_prayers') || '[]'),
  dailyPrayer: JSON.parse(localStorage.getItem('kjv_daily_prayer') || 'null'),
  toast: ''
};

const h = (tag, attrs, ...children) => tag(attrs || {}, ...children);
const icon = (symbol, label) => Span({ class: 'icon', 'aria-hidden': 'true', title: label }, symbol);
const escapeText = value => String(value ?? '');
const saveState = () => {
  localStorage.setItem('kjv_book', state.book);
  localStorage.setItem('kjv_chapter', String(state.chapter));
  localStorage.setItem('kjv_prayers', JSON.stringify(state.prayers));
  localStorage.setItem('kjv_daily_prayer', JSON.stringify(state.dailyPrayer));
};
const notify = message => { state.toast = message; setTimeout(() => { state.toast = ''; rerender(); }, 2200); rerender(); };

function dailyPrayerFor(date = todayKey()) {
  const seed = [...date].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const passages = [
    ['Psalm 23:1', 'The LORD is my shepherd; I shall not want.'],
    ['Isaiah 41:10', 'Fear thou not; for I am with thee: be not dismayed; for I am thy God.'],
    ['Matthew 11:28', 'Come unto me, all ye that labour and are heavy laden, and I will give you rest.'],
    ['Philippians 4:6', 'Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God.'],
    ['Romans 15:13', 'Now the God of hope fill you with all joy and peace in believing.'],
    ['Proverbs 3:5', 'Trust in the LORD with all thine heart; and lean not unto thine own understanding.'],
    ['Psalm 46:1', 'God is our refuge and strength, a very present help in trouble.']
  ];
  const [reference, verse] = passages[seed % passages.length];
  return { date, reference, verse, title: 'A quiet place to begin again', prompt: 'Lord, steady my heart today. Help me to receive Thy word, walk in wisdom, and carry peace into every room I enter.' };
}

function getPrayerFor(date = todayKey()) {
  if (!state.dailyPrayer || state.dailyPrayer.date !== date) {
    state.dailyPrayer = dailyPrayerFor(date);
    saveState();
  }
  return state.dailyPrayer;
}

function go(screen) { state.screen = screen; rerender(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
function setPassage(book, chapter) {
  state.book = book; state.chapter = chapter; state.screen = 'reader'; saveState(); rerender(); window.scrollTo({ top: 0, behavior: 'smooth' });
}
function currentBookData() { return window.KJV_BOOKS[state.book] || {}; }
function chapterCount(book = state.book) { return window.KJV_BOOK_META[book] || 1; }
function moveChapter(delta) {
  let bookIndex = BOOK_ORDER.indexOf(state.book);
  let chapter = state.chapter + delta;
  if (chapter < 1 && bookIndex > 0) { bookIndex--; state.book = BOOK_ORDER[bookIndex]; chapter = chapterCount(); }
  if (chapter > chapterCount() && bookIndex < BOOK_ORDER.length - 1) { bookIndex++; state.book = BOOK_ORDER[bookIndex]; chapter = 1; }
  state.chapter = Math.max(1, Math.min(chapter, chapterCount())); saveState(); rerender();
}

function Header() {
  return HeaderTag({ class: 'site-header' },
    Div({ class: 'header-shell' },
      Button({ class: 'brand-button', 'aria-label': 'Go to home' }, icon('✦', 'Scripture'), Span({ class: 'brand-wordmark' }, 'Lumen Scripture'))(() => go('home')),
      Nav({ class: 'primary-nav', 'aria-label': 'Main navigation' },
        ...[['home','Home'], ['reader','Read'], ['search','Search'], ['prayer','Daily Prayer']].map(([id, label]) => Button({ class: `nav-link ${state.screen === id ? 'active' : ''}` }, label)(() => go(id)))
      )
    )
  );
}

function Home() {
  const daily = getPrayerFor();
  return Main({ class: 'page home-page' },
    Section({ class: 'hero-grid' },
      Div({ class: 'hero-copy' },
        Div({ class: 'eyebrow' }, 'KJV • A slower way to read'),
        H1({}, 'Let the word dwell\nrichly in you.'),
        P({ class: 'hero-lede' }, 'A quiet, beautifully organized place for Scripture, reflection, and a daily rhythm of prayer.'),
        Div({ class: 'hero-actions' }, Button({ class: 'button primary' }, icon('↗', 'Open reader'), ' Open the reader')(() => go('reader')), Button({ class: 'button quiet' }, 'Search Scripture')(() => go('search'))),
        Div({ class: 'hero-note' }, icon('✦', 'Note'), ' “Thy word is a lamp unto my feet, and a light unto my path.”', Span({ class: 'hero-note-ref' }, 'Psalm 119:105'))
      ),
      Div({ class: 'hero-art', 'aria-hidden': 'true' }, Div({ class: 'halo' }), Div({ class: 'sun-disc' }), Div({ class: 'hill hill-one' }), Div({ class: 'hill hill-two' }), Div({ class: 'art-caption' }, 'READ · REFLECT · RETURN'))
    ),
    Section({ class: 'home-section' },
      Div({ class: 'section-heading' }, Div({}, Div({ class: 'eyebrow' }, 'Your rhythm'), H2({}, 'A little light for today.')), Button({ class: 'text-button' }, 'View Daily Prayer →')(() => go('prayer'))),
      Div({ class: 'feature-grid' },
        Article({ class: 'feature-card prayer-card' }, Div({ class: 'card-kicker' }, 'DAILY PRAYER'), H3({}, daily.title), Blockquote({}, `“${daily.verse}”`), Div({ class: 'reference' }, daily.reference), Button({ class: 'card-link' }, 'Open prayer →')(() => go('prayer'))),
        Article({ class: 'feature-card reader-card' }, Div({ class: 'card-kicker' }, 'CONTINUE READING'), H3({}, `${state.book} · Chapter ${state.chapter}`), P({}, 'Pick up where you left off, with every verse kept close and distraction kept out.'), Button({ class: 'card-link' }, 'Continue reading →')(() => go('reader'))),
        Article({ class: 'feature-card search-card' }, Div({ class: 'card-kicker' }, 'FIND A PASSAGE'), H3({}, 'Search the whole KJV'), P({}, 'Look for a word, phrase, or familiar line and jump straight into its chapter.'), Button({ class: 'card-link' }, 'Search Scripture →')(() => go('search')))
      )
    )
  );
}

function SelectOptions(items, selected) { return items.map(item => Option({ value: item, selected: item === selected }, item)); }
function Reader() {
  const key = `chapter:${state.book}:${state.chapter}`;
  return Main({ class: 'page reader-page' },
    Div({ class: 'page-intro' }, Div({ class: 'eyebrow' }, 'The reader'), H1({}, state.book), P({}, 'Read one chapter at a time. Let the page stay simple.'),
      Div({ class: 'reader-tools' }, Select({ class: 'select-control', value: state.book, 'aria-label': 'Book' }, ...SelectOptions(BOOK_ORDER, state.book))(({ onchange: event }) => { state.book = event.target.value; state.chapter = 1; saveState(); rerender(); }), Select({ class: 'select-control chapter-select', value: String(state.chapter), 'aria-label': 'Chapter' }, ...SelectOptions(Array.from({ length: chapterCount() }, (_, i) => String(i + 1)), String(state.chapter)))(({ onchange: event }) => { state.chapter = Number(event.target.value); saveState(); rerender(); }))
    ),
    Fetch(key, () => Promise.resolve(currentBookData()[String(state.chapter)] || {}), ({ status, data, error }) => {
      if (status === 'loading') return Div({ class: 'loading-card' }, Div({ class: 'spinner' }), 'Opening the Scriptures…');
      if (status === 'error') return Div({ class: 'empty-card' }, 'This chapter could not be opened. ', Button({ class: 'button quiet' }, 'Try again')(() => rerender()));
      const verses = Object.entries(data);
      return Section({ class: 'reading-layout' },
        Div({ class: 'chapter-bar' }, Div({ class: 'chapter-label' }, `${state.book} / ${state.chapter}`), Div({ class: 'chapter-count' }, `${verses.length} verses`)),
        Article({ class: 'scripture-sheet' }, H2({}, `${state.book} ${state.chapter}`), ...verses.map(([number, text], index) => Div({ class: `verse ${index === 0 ? 'first-verse' : ''}` }, Sup({}, number), Span({}, text)))),
        Div({ class: 'reader-footer' }, Button({ class: 'button quiet' }, '← Previous')(() => moveChapter(-1)), Button({ class: 'button primary' }, 'Next chapter →')(() => moveChapter(1)))
      );
    })
  );
}

function Search() {
  const query = state.query.trim().toLowerCase();
  const results = query.length < 2 ? [] : BOOK_ORDER.flatMap(book => {
    if (state.searchBook !== 'all' && state.searchBook !== book) return [];
    const bookData = window.KJV_BOOKS[book] || {};
    return Object.entries(bookData).flatMap(([chapter, verses]) => Object.entries(verses).filter(([, text]) => text.toLowerCase().includes(query)).slice(0, 6).map(([verse, text]) => ({ book, chapter, verse, text })));
  }).slice(0, 40);
  return Main({ class: 'page search-page' }, Div({ class: 'page-intro' }, Div({ class: 'eyebrow' }, 'The concordance'), H1({}, 'Find a word.\nFollow it further.'), P({}, 'Search the complete local KJV corpus. No account, no waiting, no outside API.'), Div({ class: 'search-controls' }, Input({ class: 'search-input', type: 'search', placeholder: 'Try “faith”, “peace”, or “beginning”', value: state.query, autofocus: true })(({ oninput: event }) => { state.query = event.target.value; rerender(); }), Select({ class: 'select-control', value: state.searchBook }, ...SelectOptions(['all', ...BOOK_ORDER], state.searchBook))(({ onchange: event }) => { state.searchBook = event.target.value; rerender(); }))),
    query.length < 2 ? Div({ class: 'search-prompt' }, icon('⌕', 'Search'), H2({}, 'Start with two or more letters'), P({}, 'Your results will appear here as you type.')) : results.length ? Div({ class: 'result-list' }, ...results.map(result => Article({ class: 'result-card' }, Div({ class: 'result-meta' }, `${result.book} ${result.chapter}:${result.verse}`), P({}, result.text), Button({ class: 'result-link' }, 'Read in context →')(() => setPassage(result.book, Number(result.chapter)))))) : Div({ class: 'empty-card' }, 'No matching verses found. Try another word or book.')
  );
}

function Prayer() {
  const daily = getPrayerFor();
  const date = new Date(daily.date + 'T00:00:00');
  const formatted = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const entries = state.prayers.filter(item => item.date === state.selectedPrayerDate);
  const addPrayer = event => { event.preventDefault(); const form = event.target; const title = form.elements.title.value.trim(); const text = form.elements.text.value.trim(); if (!title || !text) return notify('Add a title and a prayer first.'); state.prayers.unshift({ id: Date.now(), date: todayKey(), title, text, answered: false }); saveState(); form.reset(); notify('Prayer added to your board.'); };
  return Main({ class: 'page prayer-page' }, Div({ class: 'page-intro' }, Div({ class: 'eyebrow' }, 'The prayer room'), H1({}, 'Bring the day\ninto the light.'), P({}, 'A simple place to return to your prayers and notice the ways you have been carried.')),
    Section({ class: 'prayer-layout' }, Article({ class: 'daily-prayer' }, Div({ class: 'card-kicker' }, 'DAILY PRAYER · ' + formatted.toUpperCase()), H2({}, daily.title), Blockquote({}, `“${daily.verse}”`), Div({ class: 'reference' }, daily.reference), P({ class: 'prayer-prompt' }, daily.prompt), Button({ class: 'button primary' }, 'Read this passage →')(() => { const [book, chapter] = daily.reference.split(' '); go('reader'); })),
      Article({ class: 'prayer-form-card' }, Div({ class: 'card-kicker' }, 'ADD TO YOUR BOARD'), H2({}, 'Name what is on your heart.'), Form({}, Label({}, 'Title', Input({ name: 'title', placeholder: 'A person, hope, or need' })), Label({}, 'Prayer', Textarea({ name: 'text', rows: 5, placeholder: 'Write honestly. There is room here.' })), Button({ class: 'button dark', type: 'submit' }, 'Save prayer'))(({ onsubmit: addPrayer })))),
    Section({ class: 'prayer-history' }, Div({ class: 'section-heading' }, Div({}, Div({ class: 'eyebrow' }, 'Your board'), H2({}, entries.length ? `Prayers for ${state.selectedPrayerDate}` : 'A faithful record')), entries.length ? Div({ class: 'prayer-list' }, ...entries.map(item => Article({ class: 'saved-prayer' }, Div({ class: 'saved-prayer-top' }, Div({ class: 'result-meta' }, item.date), !item.answered ? Button({ class: 'mark-button' }, 'Mark answered')(() => { item.answered = true; saveState(); rerender(); }) : Span({ class: 'answered' }, 'Answered')), H3({}, item.title), P({}, item.text)))) : Div({ class: 'empty-card' }, 'Your saved prayers will gather here.')))
  );
}

function App() { return Html(Header(), Case(state.screen, { home: Home, reader: Reader, search: Search, prayer: Prayer, default: Home })(), state.toast ? Div({ class: 'toast', role: 'status' }, state.toast) : null); }

start(App, document.getElementById('app'));
