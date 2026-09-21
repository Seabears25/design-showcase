const BOOK_ORDER = Object.keys(window.KJV_BOOK_META);

const state = {
  screen: 'home',
  book: localStorage.getItem('kjv_book') || 'Genesis',
  chapter: Number(localStorage.getItem('kjv_chapter') || 1),
  query: '',
  searchBook: 'all'
};

let renderedDate = DailyPrayer.todayKey();
const icon = (symbol, label) => Span({ class: 'icon', 'aria-hidden': 'true', title: label }, symbol);
const saveReadingPosition = () => {
  localStorage.setItem('kjv_book', state.book);
  localStorage.setItem('kjv_chapter', String(state.chapter));
};
const go = screen => { state.screen = screen; rerender(); window.scrollTo({ top: 0, behavior: 'smooth' }); };
const setPassage = (book, chapter) => { state.book = book; state.chapter = chapter; state.screen = 'reader'; saveReadingPosition(); rerender(); window.scrollTo({ top: 0, behavior: 'smooth' }); };
const chapterCount = (book = state.book) => window.KJV_BOOK_META[book] || 1;
const currentBookData = () => window.KJV_BOOKS[state.book] || {};

function openReference(reference) {
  const match = reference.match(/^(.*)\s(\d+):\d+$/);
  if (!match) return go('reader');
  const rawBook = match[1] === 'Psalm' ? 'Psalms' : match[1];
  const book = BOOK_ORDER.find(candidate => candidate === rawBook) || rawBook;
  setPassage(book, Number(match[2]));
}

function moveChapter(delta) {
  let bookIndex = BOOK_ORDER.indexOf(state.book);
  let chapter = state.chapter + delta;
  if (chapter < 1 && bookIndex > 0) { bookIndex -= 1; state.book = BOOK_ORDER[bookIndex]; chapter = chapterCount(); }
  if (chapter > chapterCount() && bookIndex < BOOK_ORDER.length - 1) { bookIndex += 1; state.book = BOOK_ORDER[bookIndex]; chapter = 1; }
  state.chapter = Math.max(1, Math.min(chapter, chapterCount()));
  saveReadingPosition();
  rerender();
}

function SiteHeader() {
  return Header({ class: 'site-header' },
    Div({ class: 'header-shell' },
      Button({ class: 'brand-button', 'aria-label': 'Go to home' }, icon('✦', 'Scripture'), Span({ class: 'brand-wordmark' }, 'Lumen Scripture'), Span({ class: 'brand-chip' }, 'KJV'))(() => go('home')),
      Nav({ class: 'primary-nav', 'aria-label': 'Main navigation' },
        ...[['home', 'Home', '⌂'], ['reader', 'Read', '▤'], ['search', 'Search', '⌕'], ['prayer', 'Daily Prayer', '✦']].map(([id, label, symbol]) => Button({ class: `nav-link ${state.screen === id ? 'active' : ''}` }, Span({ class: 'nav-symbol' }, symbol), Span({ class: 'nav-label' }, label))(() => go(id)))
      )
    )
  );
}

function Home() {
  const daily = DailyPrayer.getToday();
  const formatted = new Date(daily.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  return Main({ class: 'page home-page' },
    Section({ class: 'hero-grid' },
      Div({ class: 'hero-copy' },
        Div({ class: 'eyebrow' }, 'KJV • Your quiet reading app'),
        H1({}, 'Read slowly.\nReturn often.'),
        P({ class: 'hero-lede' }, 'A focused home for Scripture, search, and a fresh Daily Prayer shaped by the day you are living.'),
        Div({ class: 'hero-actions' }, Button({ class: 'button primary' }, icon('↗', 'Open reader'), ' Open the reader')(() => go('reader')), Button({ class: 'button quiet' }, icon('⌕', 'Search'), ' Find a passage')(() => go('search'))),
        Div({ class: 'hero-note' }, icon('✦', 'Note'), ' “Thy word is a lamp unto my feet, and a light unto my path.”', Span({ class: 'hero-note-ref' }, 'Psalm 119:105'))
      ),
      Div({ class: 'hero-art', 'aria-label': 'Open KJV Bible in morning light', role: 'img' }, Div({ class: 'art-caption' }, 'READ · REFLECT · RETURN'))
    ),
    Section({ class: 'home-section' },
      Div({ class: 'section-heading' }, Div({}, Div({ class: 'eyebrow' }, 'Your starting point'), H2({}, 'A little light for today.')), Button({ class: 'text-button' }, 'Open Daily Prayer →')(() => go('prayer'))),
      Div({ class: 'feature-grid' },
        Article({ class: 'feature-card prayer-card' }, Div({ class: 'card-kicker' }, `DAILY PRAYER · ${formatted.toUpperCase()}`), H3({}, daily.title), Blockquote({}, `“${daily.verse}”`), Div({ class: 'reference' }, daily.reference), Button({ class: 'card-link' }, 'Open prayer →')(() => go('prayer'))),
        Article({ class: 'feature-card reader-card' }, Div({ class: 'card-kicker' }, 'CONTINUE READING'), H3({}, `${state.book} · Chapter ${state.chapter}`), P({}, 'Pick up where you left off with the complete KJV, stored locally for a fast and private read.'), Button({ class: 'card-link' }, 'Continue reading →')(() => go('reader'))),
        Article({ class: 'feature-card search-card' }, Div({ class: 'card-kicker' }, 'FIND A PASSAGE'), H3({}, 'Search the whole KJV'), P({}, 'Find a word or phrase and jump straight into its chapter.'), Button({ class: 'card-link' }, 'Search Scripture →')(() => go('search')))
      )
    )
  );
}

function SelectOptions(items, selected) { return items.map(item => Option({ value: item, selected: item === selected }, item)); }
function Reader() {
  const key = `chapter:${state.book}:${state.chapter}`;
  return Main({ class: 'page reader-page' },
    Div({ class: 'page-intro compact-intro' }, Div({ class: 'eyebrow' }, 'The reader'), H1({}, state.book), P({}, 'One chapter at a time. No noise between you and the text.'),
      Div({ class: 'reader-tools' }, Select({ class: 'select-control', value: state.book, 'aria-label': 'Book' }, ...SelectOptions(BOOK_ORDER, state.book))({ onchange: event => { state.book = event.target.value; state.chapter = 1; saveReadingPosition(); rerender(); } }), Select({ class: 'select-control chapter-select', value: String(state.chapter), 'aria-label': 'Chapter' }, ...SelectOptions(Array.from({ length: chapterCount() }, (_, i) => String(i + 1)), String(state.chapter)))({ onchange: event => { state.chapter = Number(event.target.value); saveReadingPosition(); rerender(); } }))
    ),
    Fetch(key, () => Promise.resolve(currentBookData()[String(state.chapter)] || {}), ({ status, data }) => {
      if (status === 'loading') return Div({ class: 'loading-card' }, Div({ class: 'spinner' }), 'Opening the Scriptures…');
      if (status === 'error') return Div({ class: 'empty-card' }, 'This chapter could not be opened.');
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
  return Main({ class: 'page search-page' },
    Div({ class: 'page-intro compact-intro' }, Div({ class: 'eyebrow' }, 'The concordance'), H1({}, 'Find a word.\nFollow it further.'), P({}, 'Search the complete local KJV corpus without an account or outside API.'), Div({ class: 'search-controls' }, Input({ class: 'search-input', type: 'search', placeholder: 'Try “faith”, “peace”, or “beginning”', value: state.query, autofocus: true })({ oninput: event => { state.query = event.target.value; rerender(); } }), Select({ class: 'select-control', value: state.searchBook }, ...SelectOptions(['all', ...BOOK_ORDER], state.searchBook))({ onchange: event => { state.searchBook = event.target.value; rerender(); } }))),
    query.length < 2 ? Div({ class: 'search-prompt' }, icon('⌕', 'Search'), H2({}, 'Start with two or more letters'), P({}, 'Your results will appear here as you type.')) : results.length ? Div({ class: 'result-list' }, ...results.map(result => Article({ class: 'result-card' }, Div({ class: 'result-meta' }, `${result.book} ${result.chapter}:${result.verse}`), P({}, result.text), Button({ class: 'result-link' }, 'Read in context →')(() => setPassage(result.book, Number(result.chapter)))))) : Div({ class: 'empty-card' }, 'No matching verses found. Try another word or book.')
  );
}

function Prayer() {
  const daily = DailyPrayer.getToday();
  const formatted = new Date(daily.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  return Main({ class: 'page prayer-page' },
    Div({ class: 'page-intro compact-intro' }, Div({ class: 'eyebrow' }, 'A daily pause'), H1({}, 'One prayer for\nthis day.'), P({}, 'A fresh KJV-centered prayer is generated from your local calendar date. Come back tomorrow for a new one.')),
    Section({ class: 'daily-prayer-screen' },
      Div({ class: 'prayer-image', role: 'img', 'aria-label': 'Open Bible on a sunlit hillside' }),
      Article({ class: 'daily-prayer' }, Div({ class: 'card-kicker' }, `DAILY PRAYER · ${formatted.toUpperCase()}`), H2({}, daily.title), Blockquote({}, `“${daily.verse}”`), Div({ class: 'reference' }, daily.reference), P({ class: 'prayer-prompt' }, daily.prompt), Button({ class: 'button primary' }, 'Read this passage →')(() => openReference(daily.reference)))
    )
  );
}

function App() { return Html(SiteHeader(), Case(state.screen, { home: Home, reader: Reader, search: Search, prayer: Prayer, default: Home })()); }
start(App, document.getElementById('app'));
setInterval(() => { const nextDate = DailyPrayer.todayKey(); if (nextDate !== renderedDate) { renderedDate = nextDate; rerender(); } }, 60 * 1000);
