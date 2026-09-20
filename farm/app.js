/*
 * Franklin Farm Stands — single-theme Elment app
 * -----------------------------------------------
 * The site intentionally contains one theme only: Cedar & Field.
 * The farm VNode is defined once, placed in `sections`, and mounted below.
 */
const farmSiteLedger = Section({"class": "farm-site site-ledger", "data-site": "ledger"},
  Header({"class": "site-header"},
      A({"class": "farm-brand", "href": "#site-top"}, Img({"class": "logo-mark", "src": "cedar-field-logo.png", "alt": "Cedar & Field pictorial farm logo"}), Span({}, B({}, "Cedar & Field"), Small({}, "Franklin County, MA"))),
      Nav({},
            A({"href": "#story"}, "Our story"),
            A({"href": "#stand"}, "The stand"),
            A({"href": "#season"}, "This season"),
            A({"href": "#neighbors"}, "Neighbors")
          ),
      A({"class": "visit-link", "href": "#visit"}, "Plan a visit →"),
      Button({"class": "mobile-toggle", "aria-label": "Open menu"}, "☰")
    ),
  Section({"class": "hero ledger-hero", "id": "site-top"},
      Div({"class": "hero-copy"},
            Small({}, "Small farm · big table"),
            H2({},
                    "Grown close",
                    Br({}),
                    I({}, "to home.")
                  ),
            P({}, "A little patch of good soil in the Connecticut River Valley, growing the ingredients that make a Wednesday night feel like a celebration."),
            A({"class": "button dark", "href": "#stand"}, "Shop the stand →")
          ),
      Div({"class": "hero-image"}),
      Span({"class": "stamp"},
            "Harvesting",
            Br({}),
            B({},
                    "since",
                    Br({}),
                    "1987"
                  )
          )
    ),
  Div({"class": "ticker"},
      "Fresh-picked ",
      I({}, "✳"),
      " Field-grown ",
      I({}, "✳"),
      " Neighbors first ",
      I({}, "✳"),
      " Franklin County"
    ),
  Section({"class": "two-col paper", "id": "story"},
      Div({}, Small({}, "01 / A field note from the valley"), H2({}, "We believe food tastes better when you know where it started.")),
      Div({},
            P({}, "Our fields sit between old stone walls and the fertile flats of the Connecticut River Valley. We grow with the seasons, leave room for pollinators, and keep the farm stand simple: good food, fair prices, familiar faces."),
            P({}, "That rhythm is part of Franklin County's larger story—family farms, conserved land, and neighbors who still trade recipes at the market."),
            A({"class": "text-link", "href": "#neighbors"}, "Read our community notes →")
          )
    ),
  Section({"class": "paper tan", "id": "stand"},
      Div({"class": "section-head"}, Div({}, Small({}, "Open Thursday–Sunday"), H2({}, "At the stand")), P({}, "Everything on the table is grown here or made by a neighbor we trust.")),
      Div({"class": "card-grid"},
            Article({"class": "photo-card veg"},
                    Small({"class": "badge"}, "early fall"),
                    H3({},
                              "Market",
                              Br({}),
                              "vegetables"
                            ),
                    P({}, "Sweet peppers, greens, roots, and the last sun-warmed tomatoes.")
                  ),
            Article({"class": "photo-card pantry"},
                    Small({"class": "badge"}, "all year"),
                    H3({},
                              "Eggs &",
                              Br({}),
                              "pantry goods"
                            ),
                    P({}, "Maple, local flour, honey, and valley-made staples.")
                  ),
            Article({"class": "photo-card flowers"},
                    Small({"class": "badge"}, "weekends"),
                    H3({},
                              "Flowers",
                              Br({}),
                              "for the table"
                            ),
                    P({}, "Loose, unfussy bunches cut at first light.")
                  )
          ),
    ),
  Section({"class": "split-image paper", "id": "season"},
      Div({"class": "image carrots image-title"},
            H2({}, "Root cellar weather.")
          ),
      Div({"class": "copy"},
            Small({"class": "badge"}, "What is good right now"),
            P({}, "September brings carrots, beets, winter squash, and the first crisp mornings. Bring a basket. Stay for a while."),
            Ul({},
                    Li({}, "✓ Carrots"),
                    Li({}, "✓ Delicata squash"),
                    Li({}, "✓ Kale & chard"),
                    Li({}, "✓ Late dahlias")
                  ),
            A({"class": "button outline", "href": "#visit"}, "See stand hours")
          )
    ),
  Section({"class": "neighbors dark-section", "id": "neighbors"},
      Div({"class": "block"},
            Small({}, "The wider table"),
            H2({}, "Farms are stronger together."),
            P({}, "Look for us at the Greenfield Farmers' Market, alongside growers, bakers, makers, and community farms from across the county.")
          ),
      Div({"class": "block quates"}, 
        Blockquote({}, "“The best part is knowing the person who planted the seed.”", Cite({}, "— a Saturday market regular")),
        Blockquote( {}, "“We come for the vegetables, but we always leave talking to somebody.”", Cite({}, "— a weekend visitor") )),
      ),
      Section({"class": "visit-band blockHeight", "id": "visit"},
      Div({},
            Small({}, "Come by the field"),
            H2({}, "Find the red door."),
            P({},
                    "146 Meadow Road · Deerfield, MA",
                    Br({}),
                    "Thurs–Fri 2–6 · Sat–Sun 10–4"
                  )
          ),
      A({"class": "button dark", "href": "#site-top"}, "Get directions")
    ),
  Footer({"class": "site-footer blockHeight"},
      Div({"class": "footer-brand"},
            Img({"class": "footer-logo", "src": "cedar-field-logo.png", "alt": "Cedar & Field pictorial farm logo"}),
            Div({}, B({}, "Cedar & Field"), Small({}, "Franklin County, Massachusetts"))
          ),
      Div({"class": "footer-message"},
            Span({}, "Grown close to home."),
            Small({}, "A local farmstand for the wider valley")
          ),
      A({"href": "#top"}, "Back to top ↑")
    )
);

// Pre-define one top-level page fragment so it can be reused or reordered.

// The only page content: one VNode, one farm theme.
const sections = [
  farmSiteLedger
];

function App() {
  return Html(...sections);
}

const app = document.querySelector('[is="app"]');

if (!app) {
  throw new Error('Franklin Farm Stands: missing <div is="app"> container.');
}

start(App, app);
