// assets/tracker-config.js — Centralized configuration for the tracker-crm.html
// This file contains static data that defines the structure and content
// of the tracker, such as people, stages, vehicle details, and region categories.

const PEOPLE = ["Unassigned","Kenyon","Sherrie","Doug","Charles","Cynthia","Justin"];
const STAGES = [
  "Not Started","Contacted","Follow-up Scheduled","Appraisal / Photography Done",
  "Offer Received","Negotiating","Contract Sent","Contract Signed",
  "Closing Scheduled","Closed / Sold","Payment Received","Declined / Dead"
];
const STAGE_CLASS = {
  "Not Started":"stat-notstarted","Contacted":"stat-contacted","Follow-up Scheduled":"stat-followup",
  "Appraisal / Photography Done":"stat-appraisal","Offer Received":"stat-offer","Negotiating":"stat-negotiating",
  "Contract Sent":"stat-contract","Contract Signed":"stat-contract","Closing Scheduled":"stat-closing",
  "Closed / Sold":"stat-closed","Payment Received":"stat-payment","Declined / Dead":"stat-dead"
};
const FOLLOWUP_TYPES = [
  "— none yet —",
  "Photography — they dispatch, no charge (Tier 1)",
  "Photography — they dispatch, with fee (Tier 2)",
  "Appraisal — we tow/drive to them",
  "Appraisal — remote from photos/video",
  "BaT listing write-up review",
  "Negotiation call / counter-offer",
  "Consignment agreement / paperwork",
  "Auction submission / lotting",
  "Pre-auction inspection appointment",
  "Pre-contract title review",
  "Direct sale meeting / walkthrough",
  "Transport / logistics coordination",
  "Title & payment coordination",
  "Post-sale payment confirmation",
  "Other / custom"
];

const VEHICLE_CARDS = {
  towncar: {
    label: "1988 Lincoln Town Car Signature",
    color: "#5a2d82",
    fields: [
      ["VIN","1LNBM82FXJY779113"],
      ["Mileage","31,511 actual original miles"],
      ["Engine","5.0L HO V8 (Ford 302) · AOD 4-Speed Auto"],
      ["Exterior","Oxford White · Black Landau Vinyl Roof"],
      ["Interior","Windsor Velour Split-Bench (Navy Blue)"],
      ["Wheels","Styled Wire Spoke · Whitewall Tires"],
      ["Title","Clean North Dakota · Zero Liens"],
      ["Location","Hazen / Beulah ND — by appointment"],
      ["Asking","$10,000–$14,000 BaT target · Reserve $9,500"],
    ],
    tip: "Windsor Velour stays plush — does not crack like leather. Collector premium over leather versions. BaT comp: 34k-mi 1988 sold $8,201 (Jul 2025). With proper presentation $10K–$14K is realistic.",
    condition: "Disclosed: driver door panel dry rot (~$200–300), window module repair (~$80–150), A/C needs R134a recharge (~$120–180), minor trim peeling. Total ~$500–700 factored into ask."
  },
  mkz: {
    label: "2016 Lincoln MKZ Hybrid",
    color: "#1a6b8a",
    fields: [
      ["VIN","3LN6L2LUXGR630397"],
      ["Mileage","~100,000"],
      ["Engine","2.0L Hybrid CVT · 41 MPG city / 39 MPG hwy"],
      ["Exterior","Beige / Champagne"],
      ["Interior","Premium Fabric / Miko Suede · Heated Front Seats"],
      ["Tech","8\" SYNC Touchscreen · Backup Camera · Push-Button Start"],
      ["Title","Rebuilt (Bonded Title in Process — NDCC §39-05-20.3)"],
      ["Location","Lucky's Towing & Repair, 812 2nd St NW, Beulah ND"],
      ["Pricing","$2,500–$6,500 depending on channel"],
    ],
    tip: "Bonded title converts to clean title after 3 years. Complete paper trail: bill of sale, Zelle payment records, seller letters, transport confirmation, active GEICO ND policy. NOT a 'missing title' — title was stolen by transporter.",
    condition: "12V auxiliary battery needs deep-cycle recharge (~$100–$150). Hybrid drivetrain fully unaffected. Battery expected to continue 50k+ more miles. All other systems functional."
  },
  truck: {
    label: "2006 Ford F-350 King Ranch Crew Cab 4x4",
    color: "#1b2b4b",
    fields: [
      ["VIN","1FTWW31Y86EA12357"],
      ["Mileage","47,000 actual"],
      ["Engine","6.8L V10 Gas (no diesel, no DEF)"],
      ["Exterior","Clean, GA-stored, no rust"],
      ["Interior","Castaño Leather (untreated saddle) · pristine"],
      ["Hitch","Factory 5th wheel kingpin hitch installed"],
      ["Title","Clean GA Title · Zero Liens"],
      ["Location","Douglasville GA · On-site: Sherrie & Doug Appleby"],
      ["Target","$28,000–$36,000 BaT range · Reserve $22,000"],
    ],
    tip: "BaT comp: 26k-mi 2000 F-250 V10 gas sold $31,250 Jan 2026. GA storage = rust-free premium. Castaño leather is untreated saddle leather — collector-preferred, does not dry-crack.",
    condition: "No known mechanical issues. V10 gas means no diesel headaches (no DEF, no EGR, no injector risk). Inspection available on-site in Douglasville GA by Sherrie/Doug Appleby."
  },
  camper: {
    label: "2017 Jayco Eagle HT 26.5BHS",
    color: "#c96a00",
    fields: [
      ["VIN","1UJCJ0BPXH1P20237"],
      ["Mileage","~2,400 actual"],
      ["Type","Fifth Wheel · Bunkhouse · Double-over-double bunks"],
      ["GVWR","9,950 lbs · Half-ton towable"],
      ["4-Season","Climate Shield rated to 0°F · Enclosed heated underbelly"],
      ["Systems","All operational: furnace, A/C, water heater, stove, fridge, awning"],
      ["Title","Clean GA Title · Zero Liens"],
      ["Location","Douglasville GA · On-site: Sherrie & Doug Appleby"],
      ["Asking","$30,000 · Floor $22,000+"],
    ],
    tip: "No competing 26.5BHS in ND or within 150 miles. Nearest comp (rear living, no bunks) is $29,995 in Detroit Lakes MN (282 mi away). Climate Shield is a requirement in ND, not a nice-to-have.",
    condition: "4 disclosed items: tires (2017 DOT, full tread — age replacement advised ~$600), underbelly localized insulation damage (~$293 materials), Lippert rear auto-level jacks disengaged (manual override works), one cabinet hinge (~$50). Total ~$1,150–$1,600 — factored into ask."
  },
  both: {
    label: "F-350 King Ranch + Jayco Eagle HT Package",
    color: "#2e7d32",
    fields: [
      ["Package","Turnkey 5th wheel tow rig — truck + camper"],
      ["Truck","2006 F-350 King Ranch · 47k mi · V10 gas · factory kingpin hitch"],
      ["Camper","2017 Jayco Eagle HT 26.5BHS · ~2,400 mi · Climate Shield"],
      ["Titles","Both clean GA · Zero Liens"],
      ["Location","Both in Douglasville GA · Sherrie & Doug on-site"],
      ["Package Target","$55,000–$65,000 combined (sold separately preferred)"],
    ],
    tip: "The V10 truck is factory-matched for the Jayco — kingpin hitch, 18,000 lb GCWR, day-one tow-ready. One owner, two assets, one transaction. Buyer can take the complete rig or either piece separately.",
    condition: "See individual vehicle cards for condition details on each unit."
  }
};

const REGION_INTRO = {
  nd: `North Dakota &amp; surrounding region. <strong>Town Car</strong> is in Hazen/Beulah ND — Cynthia Ennis is the authorized on-site rep.
       <strong>MKZ</strong> is at Lucky's Towing &amp; Repair, Beulah ND — bonded title in process. ND auction houses engaged: Resource Auction, Ulmer (both: photos taken, photographer contract signed).
       Steffes and Neumiller: phone calls initiated by Kenyon, not yet at photos stage.
       No wholesale — floor is $1,000 for the MKZ through instant cash channels only, target is rebuilt-lot or private sale at $4,500+.`,
  ga: `Georgia &amp; surrounding region. Both the <strong>F-350 King Ranch</strong> and <strong>Jayco Eagle HT</strong> are stored in Douglasville GA.
       On-site contacts: <strong>Sherrie &amp; Doug Appleby</strong> — available for photos, showings, and pre-purchase inspection.
       Priority: Tier 1 consignment (they dispatch) before Tier 2 (appraisal if you bring it).
       <strong>Never accept Camping World / Blue Compass</strong> for the Jayco — their wholesale floor ($10K–$13K) is off the table entirely.`
};

const ND_CATS = [
  {key:"all",label:"All ND"},
  {key:"towncar",label:"🚗 Town Car"},
  {key:"mkz",label:"🚙 MKZ Hybrid"},
  {key:"consignment",label:"Consignment","type":true},
  {key:"auction",label:"Auction","type":true},
];

const GA_CATS = [
  {key:"all",label:"All GA"},
  {key:"truck",label:"🛻 F-350 Truck"},
  {key:"camper",label:"🏕️ Jayco Camper"},
  {key:"both",label:"🛻🏕️ Package"},
  {key:"consignment",label:"Consignment","type":true},
  {key:"auction",label:"Auction","type":true},
];
