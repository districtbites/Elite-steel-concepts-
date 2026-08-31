const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/db.json');
const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));

const STATE_CONFIG = {
  VA: {
    dept: "Virginia Department of Health (VDH)",
    codes: "VDH Mobile Food Establishment Regulations (12VAC5-421)",
    region: "Virginia & Mid-Atlantic",
  },
  DC: {
    dept: "District of Columbia Department of Health (DC Health)",
    codes: "DC Health Food Safety & FEMS Mobile Food Vehicle Regulations",
    region: "Washington DC Metro Area",
  },
  MD: {
    dept: "Maryland Department of Health (MDH)",
    codes: "MDH Office of Food Protection & County Health Department Codes (COMAR 10.15.03)",
    region: "Maryland & Chesapeake Region",
  },
  WV: {
    dept: "West Virginia Department of Health and Human Resources (DHHR)",
    codes: "WV DHHR Bureau for Public Health & State Fire Commission Standards",
    region: "West Virginia & Mountain State Corridor",
  },
  PA: {
    dept: "Pennsylvania Department of Agriculture (PDA)",
    codes: "PDA Bureau of Food Safety (Title 7, Chapter 46) & NFPA Standards",
    region: "Pennsylvania & Mid-Atlantic Region",
  },
  DE: {
    dept: "Delaware Division of Public Health (DPH)",
    codes: "Delaware DPH Office of Food Protection & State Fire Marshal Codes",
    region: "Delaware & Coastal Mid-Atlantic",
  },
  NC: {
    dept: "North Carolina Department of Health and Human Services (NCDHHS)",
    codes: "NCDHHS Environmental Health Section (.2600 Rules)",
    region: "North Carolina & Southeast Corridor",
  },
  TN: {
    dept: "Tennessee Department of Health (TDH)",
    codes: "TDH Environmental Health Mobile Food Service Rules & Fire Codes",
    region: "Tennessee & Appalachian Corridor",
  },
  SC: {
    dept: "South Carolina Department of Public Health (SCDPH)",
    codes: "SCDPH Bureau of Environmental Health Services (Regulation 61-25)",
    region: "South Carolina & Southeast Corridor",
  },
  KY: {
    dept: "Kentucky Cabinet for Health and Family Services (CHFS)",
    codes: "Kentucky Department for Public Health Mobile Food Code (902 KAR 45:005)",
    region: "Kentucky & Ohio River Valley",
  },
  NJ: {
    dept: "New Jersey Department of Health (NJDOH)",
    codes: "NJDOH Public Health Sanitation & Mobile Food Chapter 24 (N.J.A.C. 8:24)",
    region: "New Jersey & Mid-Atlantic Corridor",
  },
  OH: {
    dept: "Ohio Department of Health (ODH) & Ohio Department of Agriculture",
    codes: "Ohio Uniform Food Safety Code (OAC Chapter 3717-1)",
    region: "Ohio & Midwest Corridor",
  },
};

function loc(city, state, slug, distance, customData = {}) {
  const cfg = STATE_CONFIG[state] || STATE_CONFIG.VA;
  const isHomeBase = distance.startsWith("0 miles");
  
  const intro = customData.intro || (isHomeBase
    ? `Elite Steel Concepts is headquartered in Manassas, VA, building top-tier custom food trucks, concession trailers, and mobile kitchens for entrepreneurs right here in ${city}, ${state}. With 12+ years of fabrication expertise and 350+ completed builds, we deliver 100% health-code-compliant units directly from our local workshop. From concept and blueprint drafting to final inspection, we handle every stage.`
    : `Elite Steel Concepts builds premium custom food trucks and concession trailers for entrepreneurs in ${city}, ${state}. Based in Manassas, VA — ${distance} away — we deliver 100% health-code-compliant mobile kitchens with 12+ years of master fabrication expertise. From initial CAD design to turnkey handover, we handle your entire build.`);

  const whyEsc = customData.whyEsc || (isHomeBase
    ? `${city} entrepreneurs choose Elite Steel Concepts because our primary fabrication facility is right in your backyard. You can visit our workshop, inspect your build in-person during fabrication, and receive direct on-site support. Every truck and trailer we build meets 100% of ${cfg.dept} requirements and local fire marshal codes.`
    : `${city} entrepreneurs trust Elite Steel Concepts because we understand regional health codes, fire marshal requirements, and the competitive mobile food landscape in ${state}. Our regional proximity means faster turnaround, reliable delivery, easier inspection approvals, and long-term support after handover. Every vehicle we engineer is 100% compliant with ${cfg.dept} standards.`);

  const ctaText = customData.ctaText || `We're proud to serve ${city}, ${state}. Whether you need a custom food truck, high-capacity concession trailer, or mobile kitchen upgrade, our master fabricators are ready to build your vision. Contact Elite Steel Concepts today for a free consultation and let's launch your mobile food business.`;

  const localDetails = customData.localDetails || [
    `All builds engineered to comply with ${cfg.dept} mobile food unit requirements`,
    isHomeBase ? `Built directly at our Manassas fabrication facility — visit anytime` : `Direct, coordinated delivery to ${city} with comprehensive pre-inspection check`,
    `Ansul R-102 fire suppression systems and commercial hoods installed to NFPA standards`,
    `NSF-certified commercial cooking and refrigeration equipment throughout`,
    `3-compartment stainless steel wash sinks with dedicated splash-guarded hand sink`,
    `Heavy-duty fresh and grey water tanks sized to meet or exceed ${state} health minimums`,
  ];

  const faq = customData.faq || [
    {
      question: `Do you build custom food trucks for clients in ${city}, ${state}?`,
      answer: `Yes! Elite Steel Concepts serves ${city}, ${state} from our Manassas, VA fabrication facility. We build custom food trucks, concession trailers, and mobile kitchens for culinary entrepreneurs across ${cfg.region}. Call (571) 651-0337 for a free consultation.`,
    },
    {
      question: `How long does a custom food truck build take for ${city} delivery?`,
      answer: `Most custom food truck and trailer builds take 8–12 weeks from signed blueprint approval to delivery. We manage all logistics to ensure your vehicle arrives in ${city} fully ready for its local health and fire inspections.`,
    },
    {
      question: `Will my food truck pass the ${state} health and fire inspection?`,
      answer: `Guaranteed. Every Elite Steel Concepts build is engineered specifically to satisfy ${cfg.codes}. If your local inspector requires any adjustment to pass health inspection, we correct it free of charge.`,
    },
    {
      question: `What is the cost of a custom food truck in ${city}?`,
      answer: `Custom food trucks generally range from $55,000 to $150,000+ depending on chassis, size, and commercial cooking equipment. Custom concession trailers typically start around $30,000 to $75,000+. Contact us for an exact itemized quote tailored to your menu.`,
    },
  ];

  return {
    id: customData.id || (Date.now().toString() + Math.random().toString(36).slice(2, 9)),
    slug,
    city,
    state,
    h1: customData.h1 || `Custom Food Trucks & Concession Trailers in ${city}, ${state}`,
    intro,
    ctaText,
    distance,
    whyEsc,
    localDetails,
    faq,
    sections: {
      design: {
        heading: `Custom Mobile Kitchen Design for ${city}`,
        content: `We collaborate directly with your team to design an ergonomic mobile kitchen tailored to your ${city} menu, workflow, and volume requirements. Our engineering accounts for local ${state} health codes, electrical load calculations, and peak-volume service efficiency.`,
      },
      fabrication: {
        heading: `Commercial-Grade Fabrication Standards`,
        content: `Inside our Virginia shop, master fabricators use precision TIG/MIG welding, heavy-duty stainless steel wall paneling, and diamond-plate aluminum flooring. Every component is rigorously pressure-tested and inspected for structural longevity and strict compliance with ${cfg.dept} guidelines.`,
      },
      delivery: {
        heading: isHomeBase ? `Local Workshop Pickup & Support` : `Direct Logistics & Delivery to ${city}`,
        content: isHomeBase
          ? `Because our fabrication facility is in Manassas, you have direct local access to our technicians for walk-throughs, orientation, and ongoing support for your food truck in ${city}.`
          : `We coordinate professional, insured delivery of your completed food truck or concession trailer directly to ${city}, ${state}. We align with your launch timeline so you're ready for health and fire inspections immediately upon arrival.`,
      },
    },
    titleTag: `Food Truck Builder in ${city}, ${state} | Elite Steel Concepts`,
    metaDescription: `Custom food truck and concession trailer builder serving ${city}, ${state}. 12+ years experience, 350+ builds, 100% code compliant. Free quote. Call (571) 651-0337.`,
    published: true,
  };
}

// Comprehensive location database: Virginia + Surrounding States
const locations = [
  // ==========================================
  // VIRGINIA (VA) - Home State & Comprehensive Coverage
  // ==========================================
  loc('Manassas', 'VA', 'manassas-va', '0 miles (Home Base)'),
  loc('Gainesville', 'VA', 'gainesville-va', '6 miles'),
  loc('Centreville', 'VA', 'centreville-va', '8 miles'),
  loc('Haymarket', 'VA', 'haymarket-va', '9 miles'),
  loc('Chantilly', 'VA', 'chantilly-va', '10 miles'),
  loc('South Riding', 'VA', 'south-riding-va', '10 miles'),
  loc('Woodbridge', 'VA', 'woodbridge-va', '12 miles'),
  loc('Aldie', 'VA', 'aldie-va', '12 miles'),
  loc('Lake Ridge', 'VA', 'lake-ridge-va', '12 miles'),
  loc('Clifton', 'VA', 'clifton-va', '12 miles'),
  loc('Vint Hill', 'VA', 'vint-hill-va', '12 miles'),
  loc('Herndon', 'VA', 'herndon-va', '14 miles'),
  loc('Dale City', 'VA', 'dale-city-va', '14 miles'),
  loc('Montclair', 'VA', 'montclair-va', '14 miles'),
  loc('Fairfax', 'VA', 'fairfax-va', '15 miles'),
  loc('Brambleton', 'VA', 'brambleton-va', '15 miles'),
  loc('Occoquan', 'VA', 'occoquan-va', '15 miles'),
  loc('Ashburn', 'VA', 'ashburn-va', '16 miles'),
  loc('Sterling', 'VA', 'sterling-va', '16 miles'),
  loc('Burke', 'VA', 'burke-va', '16 miles'),
  loc('Dumfries', 'VA', 'dumfries-va', '16 miles'),
  loc('Broadlands', 'VA', 'broadlands-va', '16 miles'),
  loc('Reston', 'VA', 'reston-va', '18 miles'),
  loc('Vienna', 'VA', 'vienna-va', '18 miles'),
  loc('Warrenton', 'VA', 'warrenton-va', '18 miles'),
  loc('Lorton', 'VA', 'lorton-va', '18 miles'),
  loc('Cascades', 'VA', 'cascades-va', '18 miles'),
  loc('Tysons', 'VA', 'tysons-va', '19 miles'),
  loc('Falls Church', 'VA', 'falls-church-va', '20 miles'),
  loc('Springfield', 'VA', 'springfield-va', '20 miles'),
  loc('Middleburg', 'VA', 'middleburg-va', '20 miles'),
  loc('Lansdowne', 'VA', 'lansdowne-va', '20 miles'),
  loc('Alexandria', 'VA', 'alexandria-va', '22 miles'),
  loc('Leesburg', 'VA', 'leesburg-va', '22 miles'),
  loc('McLean', 'VA', 'mclean-va', '22 miles'),
  loc('Bealeton', 'VA', 'bealeton-va', '22 miles'),
  loc('Arlington', 'VA', 'arlington-va', '25 miles'),
  loc('Stafford', 'VA', 'stafford-va', '25 miles'),
  loc('Purcellville', 'VA', 'purcellville-va', '26 miles'),
  loc('Fredericksburg', 'VA', 'fredericksburg-va', '30 miles'),
  loc('Culpeper', 'VA', 'culpeper-va', '35 miles'),
  loc('Spotsylvania', 'VA', 'spotsylvania-va', '35 miles'),
  loc('Lovettsville', 'VA', 'lovettsville-va', '35 miles'),
  loc('King George', 'VA', 'king-george-va', '45 miles'),
  loc('Front Royal', 'VA', 'front-royal-va', '50 miles'),
  loc('Winchester', 'VA', 'winchester-va', '55 miles'),
  loc('Strasburg', 'VA', 'strasburg-va', '60 miles'),
  loc('Luray', 'VA', 'luray-va', '65 miles'),
  loc('Woodstock', 'VA', 'woodstock-va', '70 miles'),
  loc('Ashland', 'VA', 'ashland-va', '80 miles'),
  loc('Charlottesville', 'VA', 'charlottesville-va', '85 miles'),
  loc('Short Pump', 'VA', 'short-pump-va', '85 miles'),
  loc('Glen Allen', 'VA', 'glen-allen-va', '85 miles'),
  loc('Richmond', 'VA', 'richmond-va', '90 miles'),
  loc('Mechanicsville', 'VA', 'mechanicsville-va', '90 miles'),
  loc('Midlothian', 'VA', 'midlothian-va', '95 miles'),
  loc('Harrisonburg', 'VA', 'harrisonburg-va', '95 miles'),
  loc('Waynesboro', 'VA', 'waynesboro-va', '105 miles'),
  loc('Chester', 'VA', 'chester-va', '105 miles'),
  loc('Staunton', 'VA', 'staunton-va', '110 miles'),
  loc('Petersburg', 'VA', 'petersburg-va', '115 miles'),
  loc('Colonial Heights', 'VA', 'colonial-heights-va', '118 miles'),
  loc('Hopewell', 'VA', 'hopewell-va', '120 miles'),
  loc('Farmville', 'VA', 'farmville-va', '130 miles'),
  loc('Williamsburg', 'VA', 'williamsburg-va', '140 miles'),
  loc('Lexington', 'VA', 'lexington-va', '140 miles'),
  loc('Buena Vista', 'VA', 'buena-vista-va', '145 miles'),
  loc('Gloucester', 'VA', 'gloucester-va', '145 miles'),
  loc('Lynchburg', 'VA', 'lynchburg-va', '150 miles'),
  loc('Yorktown', 'VA', 'yorktown-va', '150 miles'),
  loc('Appomattox', 'VA', 'appomattox-va', '160 miles'),
  loc('Bedford', 'VA', 'bedford-va', '165 miles'),
  loc('Poquoson', 'VA', 'poquoson-va', '165 miles'),
  loc('Newport News', 'VA', 'newport-news-va', '170 miles'),
  loc('Hampton', 'VA', 'hampton-va', '175 miles'),
  loc('Roanoke', 'VA', 'roanoke-va', '175 miles'),
  loc('Salem', 'VA', 'salem-va', '180 miles'),
  loc('Smithfield', 'VA', 'smithfield-va', '180 miles'),
  loc('Franklin', 'VA', 'franklin-va', '185 miles'),
  loc('Chincoteague', 'VA', 'chincoteague-va', '190 miles'),
  loc('Suffolk', 'VA', 'suffolk-va', '195 miles'),
  loc('Norfolk', 'VA', 'norfolk-va', '200 miles'),
  loc('Portsmouth', 'VA', 'portsmouth-va', '200 miles'),
  loc('South Boston', 'VA', 'south-boston-va', '200 miles'),
  loc('Chesapeake', 'VA', 'chesapeake-va', '205 miles'),
  loc('Virginia Beach', 'VA', 'virginia-beach-va', '210 miles'),
  loc('Blacksburg', 'VA', 'blacksburg-va', '210 miles'),
  loc('Christiansburg', 'VA', 'christiansburg-va', '210 miles'),
  loc('Cape Charles', 'VA', 'cape-charles-va', '210 miles'),
  loc('Radford', 'VA', 'radford-va', '215 miles'),
  loc('Danville', 'VA', 'danville-va', '220 miles'),
  loc('Martinsville', 'VA', 'martinsville-va', '240 miles'),
  loc('Wytheville', 'VA', 'wytheville-va', '260 miles'),
  loc('Abingdon', 'VA', 'abingdon-va', '325 miles'),
  loc('Bristol', 'VA', 'bristol-va', '340 miles'),

  // ==========================================
  // DISTRICT OF COLUMBIA (DC)
  // ==========================================
  loc('Washington', 'DC', 'washington-dc', '30 miles'),
  loc('Georgetown', 'DC', 'georgetown-dc', '28 miles'),
  loc('Dupont Circle', 'DC', 'dupont-circle-dc', '28 miles'),
  loc('Adams Morgan', 'DC', 'adams-morgan-dc', '28 miles'),
  loc('Capitol Hill', 'DC', 'capitol-hill-dc', '30 miles'),
  loc('Navy Yard', 'DC', 'navy-yard-dc', '30 miles'),

  // ==========================================
  // MARYLAND (MD) - Bordering North & East
  // ==========================================
  loc('Poolesville', 'MD', 'poolesville-md', '22 miles'),
  loc('Gaithersburg', 'MD', 'gaithersburg-md', '24 miles'),
  loc('Potomac', 'MD', 'potomac-md', '25 miles'),
  loc('Rockville', 'MD', 'rockville-md', '28 miles'),
  loc('Germantown', 'MD', 'germantown-md', '28 miles'),
  loc('National Harbor', 'MD', 'national-harbor-md', '30 miles'),
  loc('Bethesda', 'MD', 'bethesda-md', '32 miles'),
  loc('Clarksburg', 'MD', 'clarksburg-md', '32 miles'),
  loc('Olney', 'MD', 'olney-md', '32 miles'),
  loc('Damascus', 'MD', 'damascus-md', '32 miles'),
  loc('Fort Washington', 'MD', 'fort-washington-md', '32 miles'),
  loc('Silver Spring', 'MD', 'silver-spring-md', '35 miles'),
  loc('Wheaton', 'MD', 'wheaton-md', '35 miles'),
  loc('Takoma Park', 'MD', 'takoma-park-md', '36 miles'),
  loc('Hyattsville', 'MD', 'hyattsville-md', '38 miles'),
  loc('Urbana', 'MD', 'urbana-md', '38 miles'),
  loc('Burtonsville', 'MD', 'burtonsville-md', '38 miles'),
  loc('Upper Marlboro', 'MD', 'upper-marlboro-md', '40 miles'),
  loc('Greenbelt', 'MD', 'greenbelt-md', '40 miles'),
  loc('Frederick', 'MD', 'frederick-md', '40 miles'),
  loc('College Park', 'MD', 'college-park-md', '42 miles'),
  loc('Laurel', 'MD', 'laurel-md', '42 miles'),
  loc('Saint Charles', 'MD', 'saint-charles-md', '42 miles'),
  loc('Waldorf', 'MD', 'waldorf-md', '45 miles'),
  loc('Odenton', 'MD', 'odenton-md', '45 miles'),
  loc('Crofton', 'MD', 'crofton-md', '45 miles'),
  loc('Mount Airy', 'MD', 'mount-airy-md', '45 miles'),
  loc('Bowie', 'MD', 'bowie-md', '48 miles'),
  loc('Ellicott City', 'MD', 'ellicott-city-md', '48 miles'),
  loc('La Plata', 'MD', 'la-plata-md', '48 miles'),
  loc('Columbia', 'MD', 'columbia-md', '50 miles'),
  loc('Hanover', 'MD', 'hanover-md', '50 miles'),
  loc('Severn', 'MD', 'severn-md', '50 miles'),
  loc('Glen Burnie', 'MD', 'glen-burnie-md', '55 miles'),
  loc('Eldersburg', 'MD', 'eldersburg-md', '55 miles'),
  loc('Huntingtown', 'MD', 'huntingtown-md', '55 miles'),
  loc('Catonsville', 'MD', 'catonsville-md', '58 miles'),
  loc('Severna Park', 'MD', 'severna-park-md', '58 miles'),
  loc('Annapolis', 'MD', 'annapolis-md', '60 miles'),
  loc('Hagerstown', 'MD', 'hagerstown-md', '60 miles'),
  loc('Pasadena', 'MD', 'pasadena-md', '60 miles'),
  loc('Prince Frederick', 'MD', 'prince-frederick-md', '60 miles'),
  loc('Baltimore', 'MD', 'baltimore-md', '65 miles'),
  loc('Westminster', 'MD', 'westminster-md', '65 miles'),
  loc('Owings Mills', 'MD', 'owings-mills-md', '65 miles'),
  loc('Dundalk', 'MD', 'dundalk-md', '68 miles'),
  loc('Towson', 'MD', 'towson-md', '70 miles'),
  loc('Leonardtown', 'MD', 'leonardtown-md', '70 miles'),
  loc('Essex', 'MD', 'essex-md', '72 miles'),
  loc('White Marsh', 'MD', 'white-marsh-md', '75 miles'),
  loc('Aberdeen', 'MD', 'aberdeen-md', '80 miles'),
  loc('Bel Air', 'MD', 'bel-air-md', '85 miles'),
  loc('Havre de Grace', 'MD', 'havre-de-grace-md', '85 miles'),
  loc('Easton', 'MD', 'easton-md', '90 miles'),
  loc('St. Michaels', 'MD', 'st-michaels-md', '95 miles'),
  loc('Elkton', 'MD', 'elkton-md', '105 miles'),
  loc('Cambridge', 'MD', 'cambridge-md', '110 miles'),
  loc('Cumberland', 'MD', 'cumberland-md', '120 miles'),
  loc('Salisbury', 'MD', 'salisbury-md', '140 miles'),
  loc('Pocomoke City', 'MD', 'pocomoke-city-md', '160 miles'),
  loc('Ocean City', 'MD', 'ocean-city-md', '170 miles'),

  // ==========================================
  // WEST VIRGINIA (WV) - Bordering West
  // ==========================================
  loc('Charles Town', 'WV', 'charles-town-wv', '50 miles'),
  loc('Ranson', 'WV', 'ranson-wv', '50 miles'),
  loc('Harpers Ferry', 'WV', 'harpers-ferry-wv', '52 miles'),
  loc('Shepherdstown', 'WV', 'shepherdstown-wv', '55 miles'),
  loc('Inwood', 'WV', 'inwood-wv', '60 miles'),
  loc('Martinsburg', 'WV', 'martinsburg-wv', '65 miles'),
  loc('Falling Waters', 'WV', 'falling-waters-wv', '70 miles'),
  loc('Berkeley Springs', 'WV', 'berkeley-springs-wv', '85 miles'),
  loc('Elkins', 'WV', 'elkins-wv', '160 miles'),
  loc('Morgantown', 'WV', 'morgantown-wv', '180 miles'),
  loc('Fairmont', 'WV', 'fairmont-wv', '195 miles'),
  loc('Bridgeport', 'WV', 'bridgeport-wv', '200 miles'),
  loc('Clarksburg', 'WV', 'clarksburg-wv', '205 miles'),
  loc('Lewisburg', 'WV', 'lewisburg-wv', '215 miles'),
  loc('Wheeling', 'WV', 'wheeling-wv', '240 miles'),
  loc('Weirton', 'WV', 'weirton-wv', '250 miles'),
  loc('Beckley', 'WV', 'beckley-wv', '270 miles'),
  loc('Parkersburg', 'WV', 'parkersburg-wv', '270 miles'),
  loc('Princeton', 'WV', 'princeton-wv', '275 miles'),
  loc('Bluefield', 'WV', 'bluefield-wv', '280 miles'),
  loc('Charleston', 'WV', 'charleston-wv', '300 miles'),
  loc('Huntington', 'WV', 'huntington-wv', '350 miles'),

  // ==========================================
  // PENNSYLVANIA (PA) - Bordering North
  // ==========================================
  loc('Gettysburg', 'PA', 'gettysburg-pa', '70 miles'),
  loc('Waynesboro', 'PA', 'waynesboro-pa', '70 miles'),
  loc('Hanover', 'PA', 'hanover-pa', '75 miles'),
  loc('Chambersburg', 'PA', 'chambersburg-pa', '75 miles'),
  loc('York', 'PA', 'york-pa', '95 miles'),
  loc('Carlisle', 'PA', 'carlisle-pa', '100 miles'),
  loc('Mechanicsburg', 'PA', 'mechanicsburg-pa', '110 miles'),
  loc('Lancaster', 'PA', 'lancaster-pa', '120 miles'),
  loc('Harrisburg', 'PA', 'harrisburg-pa', '125 miles'),
  loc('Lebanon', 'PA', 'lebanon-pa', '130 miles'),
  loc('West Chester', 'PA', 'west-chester-pa', '140 miles'),
  loc('Downingtown', 'PA', 'downingtown-pa', '140 miles'),
  loc('Chester', 'PA', 'chester-pa', '145 miles'),
  loc('Phoenixville', 'PA', 'phoenixville-pa', '145 miles'),
  loc('Media', 'PA', 'media-pa', '145 miles'),
  loc('Reading', 'PA', 'reading-pa', '150 miles'),
  loc('King of Prussia', 'PA', 'king-of-prussia-pa', '150 miles'),
  loc('Norristown', 'PA', 'norristown-pa', '155 miles'),
  loc('Philadelphia', 'PA', 'philadelphia-pa', '160 miles'),
  loc('State College', 'PA', 'state-college-pa', '160 miles'),
  loc('Altoona', 'PA', 'altoona-pa', '160 miles'),
  loc('Doylestown', 'PA', 'doylestown-pa', '165 miles'),
  loc('Bensalem', 'PA', 'bensalem-pa', '170 miles'),
  loc('Johnstown', 'PA', 'johnstown-pa', '175 miles'),
  loc('Bethlehem', 'PA', 'bethlehem-pa', '180 miles'),
  loc('Allentown', 'PA', 'allentown-pa', '185 miles'),
  loc('Easton', 'PA', 'easton-pa', '185 miles'),
  loc('Greensburg', 'PA', 'greensburg-pa', '190 miles'),
  loc('Pittsburgh', 'PA', 'pittsburgh-pa', '210 miles'),
  loc('Wilkes-Barre', 'PA', 'wilkes-barre-pa', '225 miles'),
  loc('Cranberry Township', 'PA', 'cranberry-township-pa', '225 miles'),
  loc('Scranton', 'PA', 'scranton-pa', '235 miles'),
  loc('Erie', 'PA', 'erie-pa', '330 miles'),

  // ==========================================
  // DELAWARE (DE) - Mid-Atlantic Delmarva Corridor
  // ==========================================
  loc('Middletown', 'DE', 'middletown-de', '105 miles'),
  loc('Bear', 'DE', 'bear-de', '110 miles'),
  loc('Smyrna', 'DE', 'smyrna-de', '110 miles'),
  loc('Newark', 'DE', 'newark-de', '115 miles'),
  loc('Dover', 'DE', 'dover-de', '115 miles'),
  loc('Wilmington', 'DE', 'wilmington-de', '125 miles'),
  loc('Milford', 'DE', 'milford-de', '125 miles'),
  loc('Seaford', 'DE', 'seaford-de', '130 miles'),
  loc('Georgetown', 'DE', 'georgetown-de', '135 miles'),
  loc('Lewes', 'DE', 'lewes-de', '145 miles'),
  loc('Rehoboth Beach', 'DE', 'rehoboth-beach-de', '150 miles'),
  loc('Bethany Beach', 'DE', 'bethany-beach-de', '155 miles'),

  // ==========================================
  // NORTH CAROLINA (NC) - Bordering South
  // ==========================================
  loc('Elizabeth City', 'NC', 'elizabeth-city-nc', '215 miles'),
  loc('Kitty Hawk', 'NC', 'kitty-hawk-nc', '230 miles'),
  loc('Nags Head', 'NC', 'nags-head-nc', '235 miles'),
  loc('Rocky Mount', 'NC', 'rocky-mount-nc', '240 miles'),
  loc('Outer Banks', 'NC', 'outer-banks-nc', '240 miles'),
  loc('Wilson', 'NC', 'wilson-nc', '260 miles'),
  loc('Greenville', 'NC', 'greenville-nc', '280 miles'),
  loc('Fayetteville', 'NC', 'fayetteville-nc', '280 miles'),
  loc('Goldsboro', 'NC', 'goldsboro-nc', '290 miles'),
  loc('Wake Forest', 'NC', 'wake-forest-nc', '300 miles'),
  loc('Raleigh', 'NC', 'raleigh-nc', '310 miles'),
  loc('Cary', 'NC', 'cary-nc', '315 miles'),
  loc('Garner', 'NC', 'garner-nc', '315 miles'),
  loc('New Bern', 'NC', 'new-bern-nc', '315 miles'),
  loc('Morrisville', 'NC', 'morrisville-nc', '318 miles'),
  loc('Durham', 'NC', 'durham-nc', '320 miles'),
  loc('Apex', 'NC', 'apex-nc', '320 miles'),
  loc('Pinehurst', 'NC', 'pinehurst-nc', '320 miles'),
  loc('Chapel Hill', 'NC', 'chapel-hill-nc', '325 miles'),
  loc('Holly Springs', 'NC', 'holly-springs-nc', '325 miles'),
  loc('Burlington', 'NC', 'burlington-nc', '330 miles'),
  loc('Greensboro', 'NC', 'greensboro-nc', '340 miles'),
  loc('Jacksonville', 'NC', 'jacksonville-nc', '340 miles'),
  loc('High Point', 'NC', 'high-point-nc', '345 miles'),
  loc('Lumberton', 'NC', 'lumberton-nc', '350 miles'),
  loc('Morehead City', 'NC', 'morehead-city-nc', '350 miles'),
  loc('Winston-Salem', 'NC', 'winston-salem-nc', '360 miles'),
  loc('Boone', 'NC', 'boone-nc', '360 miles'),
  loc('Surf City', 'NC', 'surf-city-nc', '360 miles'),
  loc('Salisbury', 'NC', 'salisbury-nc', '365 miles'),
  loc('Kannapolis', 'NC', 'kannapolis-nc', '370 miles'),
  loc('Mooresville', 'NC', 'mooresville-nc', '370 miles'),
  loc('Concord', 'NC', 'concord-nc', '375 miles'),
  loc('Huntersville', 'NC', 'huntersville-nc', '380 miles'),
  loc('Wilmington', 'NC', 'wilmington-nc', '380 miles'),
  loc('Hickory', 'NC', 'hickory-nc', '390 miles'),
  loc('Charlotte', 'NC', 'charlotte-nc', '390 miles'),
  loc('Gastonia', 'NC', 'gastonia-nc', '400 miles'),
  loc('Waxhaw', 'NC', 'waxhaw-nc', '400 miles'),
  loc('Asheville', 'NC', 'asheville-nc', '415 miles'),

  // ==========================================
  // TENNESSEE (TN) - Bordering Southwest
  // ==========================================
  loc('Bristol', 'TN', 'bristol-tn', '340 miles'),
  loc('Kingsport', 'TN', 'kingsport-tn', '345 miles'),
  loc('Johnson City', 'TN', 'johnson-city-tn', '355 miles'),
  loc('Greeneville', 'TN', 'greeneville-tn', '370 miles'),
  loc('Morristown', 'TN', 'morristown-tn', '380 miles'),
  loc('Sevierville', 'TN', 'sevierville-tn', '415 miles'),
  loc('Knoxville', 'TN', 'knoxville-tn', '420 miles'),
  loc('Pigeon Forge', 'TN', 'pigeon-forge-tn', '425 miles'),
  loc('Gatlinburg', 'TN', 'gatlinburg-tn', '430 miles'),
  loc('Maryville', 'TN', 'maryville-tn', '430 miles'),
  loc('Oak Ridge', 'TN', 'oak-ridge-tn', '430 miles'),
  loc('Cleveland', 'TN', 'cleveland-tn', '500 miles'),
  loc('Chattanooga', 'TN', 'chattanooga-tn', '530 miles'),
  loc('Murfreesboro', 'TN', 'murfreesboro-tn', '580 miles'),
  loc('Hendersonville', 'TN', 'hendersonville-tn', '590 miles'),
  loc('Nashville', 'TN', 'nashville-tn', '600 miles'),
  loc('Franklin', 'TN', 'franklin-tn', '610 miles'),
  loc('Clarksville', 'TN', 'clarksville-tn', '620 miles'),
  loc('Memphis', 'TN', 'memphis-tn', '780 miles'),

  // ==========================================
  // SOUTH CAROLINA (SC) - Southeast Corridor
  // ==========================================
  loc('Florence', 'SC', 'florence-sc', '390 miles'),
  loc('Fort Mill', 'SC', 'fort-mill-sc', '395 miles'),
  loc('Rock Hill', 'SC', 'rock-hill-sc', '400 miles'),
  loc('Myrtle Beach', 'SC', 'myrtle-beach-sc', '420 miles'),
  loc('Spartanburg', 'SC', 'spartanburg-sc', '440 miles'),
  loc('Sumter', 'SC', 'sumter-sc', '440 miles'),
  loc('Columbia', 'SC', 'columbia-sc', '450 miles'),
  loc('Greenville', 'SC', 'greenville-sc', '450 miles'),
  loc('Aiken', 'SC', 'aiken-sc', '490 miles'),
  loc('Charleston', 'SC', 'charleston-sc', '500 miles'),
  loc('Mount Pleasant', 'SC', 'mount-pleasant-sc', '505 miles'),
  loc('Hilton Head Island', 'SC', 'hilton-head-island-sc', '560 miles'),

  // ==========================================
  // KENTUCKY (KY) - Bordering VA & WV
  // ==========================================
  loc('Richmond', 'KY', 'richmond-ky', '450 miles'),
  loc('Georgetown', 'KY', 'georgetown-ky', '460 miles'),
  loc('Florence', 'KY', 'florence-ky', '465 miles'),
  loc('Covington', 'KY', 'covington-ky', '470 miles'),
  loc('Newport', 'KY', 'newport-ky', '470 miles'),
  loc('Lexington', 'KY', 'lexington-ky', '470 miles'),
  loc('Frankfort', 'KY', 'frankfort-ky', '490 miles'),
  loc('Louisville', 'KY', 'louisville-ky', '530 miles'),
  loc('Bowling Green', 'KY', 'bowling-green-ky', '580 miles'),
  loc('Owensboro', 'KY', 'owensboro-ky', '620 miles'),

  // ==========================================
  // NEW JERSEY (NJ) - Mid-Atlantic Corridor
  // ==========================================
  loc('Cherry Hill', 'NJ', 'cherry-hill-nj', '150 miles'),
  loc('Trenton', 'NJ', 'trenton-nj', '175 miles'),
  loc('Princeton', 'NJ', 'princeton-nj', '185 miles'),
  loc('Atlantic City', 'NJ', 'atlantic-city-nj', '200 miles'),
  loc('Edison', 'NJ', 'edison-nj', '205 miles'),
  loc('Toms River', 'NJ', 'toms-river-nj', '210 miles'),
  loc('Morristown', 'NJ', 'morristown-nj', '215 miles'),
  loc('Newark', 'NJ', 'newark-nj', '220 miles'),
  loc('Jersey City', 'NJ', 'jersey-city-nj', '225 miles'),
  loc('Hoboken', 'NJ', 'hoboken-nj', '228 miles'),

  // ==========================================
  // OHIO (OH) - Bordering WV & PA
  // ==========================================
  loc('Youngstown', 'OH', 'youngstown-oh', '270 miles'),
  loc('Canton', 'OH', 'canton-oh', '300 miles'),
  loc('Akron', 'OH', 'akron-oh', '320 miles'),
  loc('Cleveland', 'OH', 'cleveland-oh', '350 miles'),
  loc('Columbus', 'OH', 'columbus-oh', '380 miles'),
  loc('Dublin', 'OH', 'dublin-oh', '390 miles'),
  loc('Toledo', 'OH', 'toledo-oh', '430 miles'),
  loc('Dayton', 'OH', 'dayton-oh', '440 miles'),
  loc('Mason', 'OH', 'mason-oh', '455 miles'),
  loc('Cincinnati', 'OH', 'cincinnati-oh', '470 miles'),
];

// Verify slugs uniqueness
const slugSet = new Set();
locations.forEach(l => {
  if (slugSet.has(l.slug)) {
    throw new Error(`Duplicate slug found: ${l.slug}`);
  }
  slugSet.add(l.slug);
});

// Preserve existing IDs if slug matches
const existingMap = new Map((db.locations || []).map(l => [l.slug, l]));
const mergedLocations = locations.map(l => {
  const existing = existingMap.get(l.slug);
  if (existing && existing.id) {
    return { ...l, id: existing.id };
  }
  return l;
});

db.locations = mergedLocations;
fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');

console.log(`✅ Seeded ${mergedLocations.length} locations successfully across VA, DC, MD, WV, PA, DE, NC, TN, SC, KY, NJ, OH.`);
const stateCounts = {};
mergedLocations.forEach(l => {
  stateCounts[l.state] = (stateCounts[l.state] || 0) + 1;
});
console.log("State Breakdown:", stateCounts);
