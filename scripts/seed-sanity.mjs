/**
 * Sanity Seed Script
 * Imports all existing local fallback data into your Sanity dataset.
 *
 * Usage:
 *   node scripts/seed-sanity.mjs                    # seed everything
 *   node scripts/seed-sanity.mjs chatFaq            # seed only chatbot Q&A
 *   node scripts/seed-sanity.mjs faq stat           # seed a few sections
 *
 * Sections: siteSettings, program, beyondService, blogPost, riderStory,
 * instructor, horse, teamMember, faq, stat, chatFaq.
 * (galleryItem and activity are created by upload-assets.mjs — they are
 *  image-driven, so they live there.)
 *
 * Seeding is `createOrReplace` on fixed IDs, so a full run overwrites anything
 * edited in the Studio. Pass a section name to leave the rest untouched.
 *
 * TEXT ONLY. Images cannot be seeded here because they need an uploaded asset
 * reference — run `node scripts/upload-assets.mjs` for every photo (and for the
 * gallery + activity documents, which are image-driven).
 *
 * Requires:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local
 *   SANITY_WRITE_TOKEN in .env.local  (Editor-level token from sanity.io/manage → API → Tokens)
 */

import { createClient } from "@sanity/client";
import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

config({ path: path.join(root, ".env.local") });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset  = process.env.NEXT_PUBLIC_SANITY_DATASET  || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-10-07";
const token    = process.env.SANITY_WRITE_TOKEN;

if (!projectId || projectId === "your-project-id") {
  console.error("❌  Set NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local first.");
  process.exit(1);
}
if (!token) {
  console.error(
    "❌  SANITY_WRITE_TOKEN is missing from .env.local.\n" +
    "    1. Go to https://www.sanity.io/manage → API → Tokens → Add API Token\n" +
    "    2. Name it 'Seed', set permissions to 'Editor'\n" +
    "    3. Add   SANITY_WRITE_TOKEN=\"<token>\"   to .env.local\n" +
    "    4. Run this script again."
  );
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion, useCdn: false, token });

/* ── helpers ── */
let _keyCounter = 0;
const key = (prefix = "k") => `${prefix}-${++_keyCounter}-${Math.random().toString(36).slice(2, 7)}`;

/** Adds _key to every object in an array (non-recursive) */
const withKeys = (arr) => arr.map(item => ({ _key: key(), ...item }));

/** Sanity stores arrays of primitives as {_key, _type:"string", value} — not bare strings */
const stringArray = (arr) => arr.map((value) => ({ _key: key(), _type: "string", value }));

async function upsert(doc) {
  await client.createOrReplace(doc);
  console.log(`  ✓  ${doc._type}: ${doc._id}`);
}

/* ════════════════════════════════════════════════════════
   DATA
════════════════════════════════════════════════════════ */

const siteSettings = {
  _id: "siteSettings", _type: "siteSettings",
  siteName: "Zippy Equestrian Center",
  tagline: "Real Riding. Real Feeling.",
  phoneNumber: "+91 98453 64281",
  email: "ride@zippyec.com",
  address: "Survey No. 46/1 & 46/2, Chikkanayakanahalli, Off Sarjapur Road, Near Carmelaram Railway Station, Bengaluru, Karnataka 560035",
  googleMapsUrl: "https://maps.google.com/?q=Zippy+Equestrian+Center",
  instagramUrl: "https://www.instagram.com/zippyequestrian",
  footerHeading: "The rider in you is just a ride away.",
  footerSubheading: "Your first ride is 30 minutes away. Call us and let's get you started.",
  footerCtaText: "Book your trial ride",
};

const programs = [
  {
    _id: "program-discovery-ride", _type: "program",
    title: "Discovery Ride",
    slug: { _type: "slug", current: "discovery-ride" },
    category: "TRIAL EXPERIENCE", order: 1,
    shortDescription: "Try horse riding in Bangalore with Zippy's Discovery Ride. A 45-minute guided session with certified trainers, safety gear, and complete horse interaction.",
    paragraphs: [
      "At Zippy Equestrian, our Adventure Ride experience offers guests an exhilarating journey—a chance to bond with our spirited horses while traversing diverse and breathtaking terrain.",
      "Whether you're new to riding, our 60-minute complimentary trial ride delivers a taste of the excitement that unfolds when you embark on a Zippy adventure.",
      "Our Adventure Ride program is perfect for thrill-seekers, nature enthusiasts, or anyone looking to experience the countryside from a new perspective.",
    ],
    curriculumList: [
      "A brief introduction to the horse and basic safety",
      "Guided mounting with full instructor support",
      "A 30-minute supervised ride at walking pace, fully guided",
      "A post-ride chat about which program to join next",
    ],
    experiences: withKeys([
      { title: "DYNAMIC TRAIL EXPLORATION", description: "Navigate varied terrain from open meadows to forest paths and gentle streams" },
      { title: "EQUINE INTERACTION & BONDING", description: "Learn to approach, stroke, and understand horse body cues with expert supervision" },
      { title: "SADDLE BALANCE BASICS", description: "Establish comfortable posture and initial confidence in the stirrups" },
      { title: "DEDICATED INSTRUCTOR SUPPORT", description: "Personalized guidance throughout your entire first experience in the saddle" },
      { title: "STABLE HORSEMANSHIP INTRODUCTION", description: "Discover how horses are cared for, groomed, and tacked at our premier riding center" },
    ]),
    ctaText: "Enroll now",
    metaTitle: "Discovery Ride: First Time Horse Riding Trial in Bangalore | Zippy Equestrian",
    metaDescription: "Try horse riding in Bangalore with Zippy's Discovery Ride. A 45-minute guided session with certified trainers, safety gear, and complete horse interaction.",
  },
  {
    _id: "program-foundation", _type: "program",
    title: "Foundation Program",
    slug: { _type: "slug", current: "foundation-program" },
    category: "BEGINNER LEVEL", order: 2,
    shortDescription: "Learn horse riding in Bangalore with our 50-session Foundation Program covering walk, trot, canter, posture, grooming, and horse psychology.",
    paragraphs: [
      "The Foundation Program is our signature pathway designed to build unshakeable fundamentals in equestrian technique and horse psychology.",
      "Spread over 50 structured sessions, you transition from walk to rising trot and controlled canter while mastering correct posture, balance, and independent rein contact.",
      "Under the gentle guidance of certified trainers in our Olympic-grade arena, students develop the muscle memory and instincts required to ride safely, confidently, and independently.",
    ],
    curriculumList: [
      "Walk, trot, and canter development with balance and posture control",
      "Correct riding posture, stirrup length, and independent rein handling",
      "Understanding equine behavior, vocal cues, and responsive communication",
      "Introduction to grooming, saddling, and unmounted stable management",
    ],
    experiences: withKeys([
      { title: "GAIT PROGRESSION & CONTROL", description: "Master rising trot diagonals, sitting trot, and introductory canter with confidence" },
      { title: "INDEPENDENT SEAT & POSTURE", description: "Build core equilibrium and supple hips to move fluidly with your horse's strides" },
      { title: "EQUINE PSYCHOLOGY & CUES", description: "Understand subtle herd body language and use light, responsive aids without force" },
      { title: "HANDS-ON TACK & GROOMING", description: "Learn essential stable routines, hoof picking, and bridle and saddle fitting" },
      { title: "ARENA NAVIGATION & SPATIAL AWARENESS", description: "Steer accurately through arena figures, circles, and changes of rein with ease" },
    ]),
    ctaText: "Enroll now",
    metaTitle: "Foundation Horse Riding Program Bangalore | Beginner Riding Classes | Zippy",
    metaDescription: "Learn horse riding in Bangalore with our 50-session Foundation Program. Covers walk, trot, canter, posture, grooming, and horse psychology with certified coaches.",
  },
  {
    _id: "program-development", _type: "program",
    title: "Development Program",
    slug: { _type: "slug", current: "development-program" },
    category: "INTERMEDIATE", order: 3,
    shortDescription: "Advance your equestrian skills with Zippy's Intermediate Development Program in Bangalore.",
    paragraphs: [
      "Tailored for riders who have completed the Foundation level and are eager to elevate their performance.",
      "Over 50 performance-focused sessions, riders refine contact elasticity, balance through complex gaits, and learn gymnastic pole work and cavaletti grids.",
      "This program bridges recreational riding and competitive equestrian sports.",
    ],
    curriculumList: [
      "Improved contact, balance, and riding technique across all gaits",
      "Introduction to jumping positions, two-point seat, and pole grids",
      "Structured, performance-focused progression and stride regulation",
      "Introduction to advanced grooming and competition stable practices",
    ],
    experiences: withKeys([
      { title: "STRIDE REGULATION & RHYTHM", description: "Lengthen and collect strides while maintaining smooth cadence and upright balance" },
      { title: "POLE WORK & CAVALETTI GRIDS", description: "Develop horse impulsion, agility, and straightness over measured ground poles" },
      { title: "TWO-POINT JUMPING POSITION", description: "Master the forward jumping seat, crest release, and secure lower leg security" },
      { title: "MULTI-HORSE ADAPTABILITY", description: "Ride horses of varying strides and temperaments to sharpen your equestrian versatility" },
      { title: "DISCIPLINE SPECIALIZATION PREPARATION", description: "Prepare physical strength and technical foundation for showjumping or dressage tracks" },
    ]),
    ctaText: "Enroll now",
    metaTitle: "Development Horse Riding Program | Intermediate Lessons Bangalore | Zippy",
    metaDescription: "Advance your equestrian skills with Zippy's Intermediate Development Program in Bangalore. Pole work, canter control, two-point jumping seat, and performance agility.",
  },
  {
    _id: "program-performance", _type: "program",
    title: "Performance Program",
    slug: { _type: "slug", current: "performance-program" },
    category: "ADVANCED / COMPETITIVE", order: 4,
    shortDescription: "Elite competitive riding coaching in Bangalore. Train for state and national showjumping and dressage championships.",
    paragraphs: [
      "Our premier high-performance curriculum for equestrians dedicated to regional, state, and national competition circuits.",
      "Riders train on competition-grade mounts under the mentorship of seasoned coaches who have competed at international arenas.",
      "Whether targeting national showjumping qualifiers or advanced dressage championships, our structured periodization plans ensure you and your equine partner peak at the highest competitive levels.",
    ],
    curriculumList: [
      "Advanced techniques and discipline specialization in showjumping and dressage",
      "Competition preparation, course walk analysis, and arena strategy",
      "Professional coaching and structured, periodized training plans",
      "Clear pathway to state, national, and international competitions",
    ],
    experiences: withKeys([
      { title: "COURSE ANALYSIS & STRATEGY", description: "Analyze strides, approach angles, rollbacks, and optimum jump lines on competition tracks" },
      { title: "ADVANCED LATERAL MOVEMENTS", description: "Execute precision shoulder-in, half-pass, and collected maneuvers with subtle aids" },
      { title: "ATHLETIC CONDITIONING & RECOVERY", description: "Periodized equine and rider workouts to enhance stamina, core stability, and power" },
      { title: "COMPETITION PSYCHOLOGY", description: "Cultivate ring composure, pressure management, and laser focus under judge scrutiny" },
      { title: "SHOW CIRCUIT REPRESENTATION", description: "Represent Zippy Equestrian Center at sanctioned state and national horse shows" },
    ]),
    ctaText: "Enroll now",
    metaTitle: "Performance Equestrian Training Bangalore | Competitive Horse Riding | Zippy",
    metaDescription: "Elite competitive riding coaching in Bangalore. Train for state and national showjumping and dressage championships with champion horses and veteran coaches.",
  },
  {
    _id: "program-dressage", _type: "program",
    title: "Dressage Program",
    slug: { _type: "slug", current: "dressage-program" },
    category: "SPECIALIZATION", order: 5,
    shortDescription: "Master classical dressage riding in Bangalore. Coaching on seat position, collection, lateral movements, and FEI test patterns.",
    paragraphs: [
      "Dressage is the highest expression of horse training — an art form and Olympic sport celebrated for harmony, symmetry, and invisible communication between rider and horse.",
      "Training in our regulation-sized dressage arena, you progress along the classical training pyramid: rhythm, suppleness, contact, impulsion, straightness, and collection.",
      "Our master dressage instructors help you cultivate a supple, deep seat that follows every equine movement effortlessly.",
    ],
    curriculumList: [
      "Correct dressage seat and refined, deep position in the saddle",
      "Precise micro-aids with seat, leg, and rein without force",
      "Transitions, lateral movements, and rhythm maintenance at all gaits",
      "Building the connection, collection, and elevation that dressage demands",
    ],
    experiences: withKeys([
      { title: "DEEP CLASSICAL SEAT", description: "Develop a weight-centered, relaxed position that absorbs and channels equine movement" },
      { title: "LATERAL WORK & FLEXION", description: "School leg-yield, shoulder-in, travers, and half-pass with exact geometrical accuracy" },
      { title: "CADENCE & COLLECTION", description: "Engage the hindquarters to achieve elevated, springy trot and uphill canter strides" },
      { title: "FEI TEST ACCURACY", description: "Ride standard dressage test patterns, refining arena geometry, halt immobility, and diagonals" },
      { title: "INVISIBLE HARMONY", description: "Communicate seamlessly through microscopic weight shifts and rein breathing" },
    ]),
    ctaText: "Enroll now",
    metaTitle: "Classical Dressage Training Bangalore | Specialized Equestrian Dressage | Zippy",
    metaDescription: "Master classical dressage riding in Bangalore. Individualized coaching on seat position, collection, lateral movements, and FEI test patterns at Zippy Equestrian.",
  },
  {
    _id: "program-showjumping", _type: "program",
    title: "Showjumping Program",
    slug: { _type: "slug", current: "showjumping-program" },
    category: "SPECIALIZATION", order: 6,
    shortDescription: "Train in professional showjumping in Bangalore. Jump courses, stride estimation, gridwork, and two-point technique.",
    paragraphs: [
      "For riders who crave the electrifying fusion of speed, precision, and flight. Our Showjumping Program guides riders into mastering obstacles, fence combinations, and course navigation.",
      "Beginning with ground poles and cavaletti gymnastic lines, riders progressively advance to verticals, oxers, and full competitive courses.",
      "Safety and horse biomechanics remain paramount — our coaches teach you to communicate clearly in the approach, take-off, and landing phases.",
    ],
    curriculumList: [
      "The jumping position, two-point seat, and elastic crest release",
      "Approach line, take-off calculation, bascule, and landing recovery",
      "Gridwork and gymnastic exercises to build agility and confidence",
      "Riding a course of fences with rhythm, control, and optimal time",
    ],
    experiences: withKeys([
      { title: "GYMNASTIC JUMPING GRIDS", description: "Build horse scope and automatic rider release over calibrated bounce and stride grids" },
      { title: "DISTANCE & STRIDE JUDGMENT", description: "Spot take-off spots with precision, adjusting canter strides effortlessly before fences" },
      { title: "COURSE TIME & TRACK PLANNING", description: "Master tight rollbacks, efficient lines, and speed control for clean competition rounds" },
      { title: "BALANCE OVER THE BASCULE", description: "Maintain a steady lower leg and soft hands through the trajectory of every jump" },
      { title: "SIMULATED COMPETITION COURSES", description: "Ride full 8 to 12 fence championship courses under realistic ring conditions" },
    ]),
    ctaText: "Enroll now",
    metaTitle: "Showjumping Classes in Bangalore | Equestrian Show Jumping Academy | Zippy",
    metaDescription: "Train in professional showjumping in Bangalore. Jump courses, develop stride estimation, gridwork, and two-point jumping technique under certified coaches.",
  },
  {
    _id: "program-practice", _type: "program",
    title: "Practice Program",
    slug: { _type: "slug", current: "practice-program" },
    category: "FOR PRACTICE ADD ON", order: 7,
    shortDescription: "Extra arena practice time for enrolled Zippy students. Perfect your gaits, balance, and saddle confidence at your own pace.",
    paragraphs: [
      "Horsemanship is an art where repetition and quiet saddle hours build deep intuition and physical confidence. The Practice Program is an exclusive add-on for enrolled Zippy students.",
      "Whether you wish to practice your rising trot diagonals, perfect your sitting posture, or simply enjoy quiet, meditative riding, these sessions give you complete freedom in our arena.",
      "Each practice ride is overseen by on-duty arena marshals for complete safety.",
    ],
    curriculumList: [
      "Unstructured saddle time dedicated to practicing current curriculum skills",
      "Arena marshal safety supervision and horse tack check before every ride",
      "Freedom to refine rhythm, posture, and gaits at your personal pace",
      "Affordable add-on pricing pegged to your current enrolled program level",
    ],
    experiences: withKeys([
      { title: "ACCELERATED SADDLE TIME", description: "Accumulate valuable hours in the saddle to develop intuitive balance and muscle memory" },
      { title: "FOCUSED INDEPENDENT DRILLS", description: "Work through instructor feedback on specific gaits and figures without lesson pressure" },
      { title: "ON-DUTY SAFETY SUPERVISION", description: "Ride independently with confidence knowing certified arena marshals are present" },
      { title: "FLEXIBLE SCHEDULING", description: "Book practice slots during mornings or evenings to suit your weekly routine" },
      { title: "DEEPER HORSE CONNECTION", description: "Strengthen trust and communication with your horse during relaxed, unhurried rides" },
    ]),
    ctaText: "Enroll now",
    metaTitle: "Horse Riding Practice Sessions Bangalore | Arena Saddle Time | Zippy Equestrian",
    metaDescription: "Extra arena practice time for enrolled Zippy students. Perfect your gaits, balance, and saddle confidence at your own pace with safety supervision in South Bangalore.",
  },
];

const beyondServices = [
  {
    _id: "beyond-summer-camps", _type: "beyondService",
    title: "SUMMER CAMPS", slug: { _type: "slug", current: "summer-camps" }, order: 1,
    heroDescription: "Give your child a summer they'll actually remember. Our summer camp programs introduce kids to horse riding, stable care, and equestrian life in a safe, supervised, and genuinely fun environment.",
    contentParagraphs: [
      "We introduce horse riding to the kids starting from the age of 5 years and the riding batches are slotted accordingly. The riders get to interact with the horses, feed the horses, bath the horses and most importantly, learn Horse Riding basics under certified equestrian coaches.",
      "We also cater to schools and other sports facilities during the summer. If need be, we can organize a special camp in your facility with our horses and staff.",
    ],
    highlightText: "Includes Medals, Certificates & a Special Zippy Souvenir!",
    ctaText: "Book for next season", contactInterest: "Children's camps",
    metaTitle: "Kids Horse Riding Summer Camps in Bangalore | Zippy Equestrian Center",
    metaDescription: "Engaging summer camp horse riding programs for kids aged 5+ in South Bangalore. Hands-on horsemanship, stable care, medals, certificates, and unforgettable equestrian fun.",
  },
  {
    _id: "beyond-horse-training", _type: "beyondService",
    title: "HORSE TRAINING", slug: { _type: "slug", current: "horse-training" }, order: 2,
    heroDescription: "Professional training services for horses conducted by our experienced instructors. Whether you're looking to train a young horse or work on specific skills, our team brings the same structured, patient approach we use with our riders.",
    contentParagraphs: [
      "Our equine training program focuses on building trust, discipline, and refined athleticism in horses of all breeds and temperaments. From foundational ground manners, lungeing, and desensitization to specialized schooling under saddle.",
      "We offer tailored training regimens designed for young horses requiring backing as well as seasoned mounts needing tune-ups or competition preparation.",
    ],
    highlightText: "Custom Training Regimens, Certified Equine Trainers & Olympic-Spec Arena!",
    ctaText: "Book your slot", contactInterest: "Riding Programs",
    metaTitle: "Professional Horse Training Services in Bangalore | Zippy Equestrian Center",
    metaDescription: "Expert horse schooling and training in South Bangalore. Groundwork, flatwork, jumping conditioning, and behavioural desensitization tailored to your equine partner.",
  },
  {
    _id: "beyond-buy-a-horse", _type: "beyondService",
    title: "BUY A HORSE", slug: { _type: "slug", current: "buy-a-horse" }, order: 3,
    heroDescription: "Looking to own a horse? We have horses available for sale which are well-trained, healthy, and suited to riders at different levels.",
    contentParagraphs: [
      "Our horses for sale come with complete medical history, vaccination records, and detailed temperament assessments. We match buyers with horses that suit their riding level, goals, and lifestyle.",
      "Post-purchase, we offer comprehensive after-sale support including boarding, training continuation, and veterinary tie-ups to ensure a smooth transition into horse ownership.",
    ],
    highlightText: "Every Horse Comes with Full Health Records & Post-Sale Support!",
    ctaText: "Find available horses", contactInterest: "Buy a horse",
    metaTitle: "Horses for Sale in Bangalore | Buy a Horse | Zippy Equestrian Center",
    metaDescription: "Buy trained, healthy horses from Zippy Equestrian in South Bangalore. Full medical records, temperament assessments, and expert guidance for first-time owners.",
  },
  {
    _id: "beyond-parties-and-venues", _type: "beyondService",
    title: "VENUE FOR PARTIES", slug: { _type: "slug", current: "parties-and-venues" }, order: 4,
    heroDescription: "Our grounds are available for private events, birthday parties, and group get-togethers. There's no venue in South Bangalore quite like it.",
    contentParagraphs: [
      "Zippy Equestrian Center offers a uniquely serene and scenic backdrop for events of all sizes. Whether it's a child's birthday party with pony rides or a corporate team outing in nature.",
      "We coordinate catering, horse-interaction activities, guided rides, and photography sessions. Our team handles the full setup so you can enjoy every moment with your guests.",
    ],
    highlightText: "Pony Rides, Grooming Activities & Photography Included for Parties!",
    ctaText: "Book your slot", contactInterest: "Book a venue",
    metaTitle: "Horse Riding Party Venue in Bangalore | Equestrian Events | Zippy",
    metaDescription: "Book Zippy Equestrian Center for birthday parties, corporate events, and private gatherings in South Bangalore. Unique equestrian experiences, pony rides, and open grounds.",
  },
  {
    _id: "beyond-equestrian-consultation", _type: "beyondService",
    title: "EQUESTRIAN CONSULTATION", slug: { _type: "slug", current: "equestrian-consultation" }, order: 5,
    heroDescription: "Planning to start your own equestrian facility? We offer professional consultation services drawing on years of hands-on experience running a successful riding center in Bangalore.",
    contentParagraphs: [
      "Our consultation services cover every aspect of equestrian center development: site selection, stable design, herd management, staff training, program curriculum, pricing strategy, and marketing.",
      "Whether you're starting from scratch or improving an existing facility, our team brings decades of practical knowledge to help you build a sustainable, reputable equestrian business.",
    ],
    highlightText: "Expert Guidance from Experienced Equestrian Center Operators!",
    ctaText: "Book a meeting", contactInterest: "Consultation",
    metaTitle: "Equestrian Center Consultation Bangalore | Stable Setup Guidance | Zippy",
    metaDescription: "Professional equestrian facility consultation in Bangalore. Expert guidance on stable design, horse management, curriculum development, and equestrian business strategy.",
  },
  {
    _id: "beyond-horse-rent-lease", _type: "beyondService",
    title: "HORSE RENT / LEASE", slug: { _type: "slug", current: "horse-rent-lease" }, order: 6,
    heroDescription: "Not ready to own, but want regular access to a specific horse? Our rent and lease arrangements give riders a consistent partnership with a horse.",
    contentParagraphs: [
      "A horse lease at Zippy gives you priority access to a specific horse for training and recreational rides. You build a genuine bond and consistent partnership that accelerates your equestrian development.",
      "Our leasing packages are flexible and affordable, with full boarding, farrier, and veterinary care handled by our professional team. You ride; we take care of everything else.",
    ],
    highlightText: "Build a Genuine Bond — All Care Handled by Our Expert Team!",
    ctaText: "Find available horses", contactInterest: "Horse Rent / Lease",
    metaTitle: "Horse Lease & Rental in Bangalore | Ride Without Ownership | Zippy Equestrian",
    metaDescription: "Lease or rent a horse in South Bangalore without the commitment of ownership. Priority access, consistent training partnerships, and all care handled by Zippy's team.",
  },
  {
    _id: "beyond-photoshoots", _type: "beyondService",
    title: "PHOTOSHOOTS", slug: { _type: "slug", current: "photoshoots" }, order: 7,
    heroDescription: "Our stables at Zippy make for a stunning photoshoot location: natural light, beautiful horses, and an environment that photographs unlike anything in the city.",
    contentParagraphs: [
      "The combination of warm natural light, rustic stable interiors, open grounds, and magnificent horses creates a backdrop that fashion, lifestyle, and equestrian photographers love.",
      "We coordinate access to specific horses for the shoot and provide a dedicated groom for horse handling and guidance on safe horse interaction.",
    ],
    highlightText: "Natural Light, Stunning Horses & an Iconic Stable Setting!",
    ctaText: "Book a meeting", contactInterest: "Photoshoot",
    metaTitle: "Equestrian Photoshoot Location Bangalore | Horse & Stable Photography | Zippy",
    metaDescription: "Book Zippy Equestrian Center for stunning photoshoots in South Bangalore. Natural light, beautiful horses, rustic stables, and professional horse handlers for your shoot.",
  },
  {
    _id: "beyond-franchise", _type: "beyondService",
    title: "FRANCHISE", slug: { _type: "slug", current: "franchise" }, order: 8,
    heroDescription: "Interested in bringing the Zippy Equestrian Center model to your city? We're open to conversations about franchise opportunities.",
    contentParagraphs: [
      "The Zippy franchise model provides you with a proven operational framework, complete brand identity, instructor training programs, curriculum documentation, and ongoing mentorship from our founding team.",
      "We are selective about franchise partnerships — we look for partners who are passionate about horses, committed to quality, and dedicated to growing equestrian culture in their region.",
    ],
    highlightText: "Proven Model, Full Support & a Passionate Equestrian Community!",
    ctaText: "Talk to our manager", contactInterest: "Franchise",
    metaTitle: "Zippy Equestrian Center Franchise India | Equestrian Business Opportunity",
    metaDescription: "Explore Zippy Equestrian Center franchise opportunities across India. Proven operational model, brand support, and expert mentorship for passionate equestrian entrepreneurs.",
  },
  {
    _id: "beyond-horse-boarding", _type: "beyondService",
    title: "HORSE BOARDING", slug: { _type: "slug", current: "horse-boarding" }, order: 9,
    heroDescription: "We provide boarding facilities for privately-owned horses: safe stabling, daily care, feeding, and regular exercise under professional supervision.",
    contentParagraphs: [
      "Our boarding facility offers spacious, well-maintained stables with daily feeding, grooming, and exercise programs tailored to each horse's needs. Horses receive routine veterinary monitoring and farrier visits.",
      "Owners receive regular updates, photographs, and health reports. Your horse is treated as one of our own — with the same professional care and attention we give to every animal in our herd.",
    ],
    highlightText: "Professional Daily Care, Vet Monitoring & Regular Exercise Included!",
    ctaText: "Find your horse a home", contactInterest: "Horse boarding",
    metaTitle: "Horse Boarding Stables in Bangalore | Equine Care & Boarding | Zippy",
    metaDescription: "Professional horse boarding in South Bangalore. Safe stabling, daily care, feeding, exercise, and veterinary monitoring for privately-owned horses at Zippy Equestrian.",
  },
];

const blogPosts = [
  {
    _id: "blog-myths", _type: "blogPost",
    title: "Common Horse Riding Myths Beginners Should Stop Believing",
    slug: { _type: "slug", current: "common-horse-riding-myths-beginners-should-stop-believing" },
    excerpt: "There's something almost meditative about being around horses. Discover the truth about learning to ride in Bangalore.",
    category: "BEGINNER'S GUIDE", readTime: "6 min read",
    publishedDate: "2026-10-01", author: "Zippy Equestrian Team",
    quoteOverlay: { _type: "object", text: "Nobody gets it right the first time" },
    contentSections: withKeys([
      {
        paragraphs: [
          "There's something almost meditative about being around horses. The moment you step into a stable, the smell of the dry hay, and all that's left is the rhythm of hooves, the creak of leather, and the quiet trust that builds between horse and rider.",
          "Whether you're a curious beginner who has never sat on a horse before, or someone chasing a competitive dream in Showjumping or Dressage, one thing is for sure: finding the right stable is your first real hurdle.",
        ],
      },
      {
        heading: "What to Expect from Good Horse Riding Schools",
        paragraphs: [
          "Not every stable is created equal, and it's worth being a little picky about where you train. The best horse riding schools in Bangalore share a few things in common: certified instructors, well-maintained horses, organized safety gear, and a structured curriculum.",
          "A trial session is usually the best way to judge a school. Notice how the horses are handled, whether the instructor corrects your posture patiently, and whether the environment feels safe for you and your family.",
        ],
      },
    ]),
    metaTitle: "Horse Riding Myths Debunked | Beginner's Guide | Zippy Equestrian Bangalore",
    metaDescription: "Debunking the most common horse riding myths for beginners in Bangalore. Find out what it really takes to learn horse riding and what to look for in an equestrian center.",
  },
  {
    _id: "blog-what-to-wear", _type: "blogPost",
    title: "What to Wear to Your First Horse Riding Lesson",
    slug: { _type: "slug", current: "what-to-wear-to-your-first-horse-riding-lesson" },
    excerpt: "First lesson coming up? Don't overthink the gear. Here's a practical, honest guide to what to wear and bring.",
    category: "TIPS & GEAR", readTime: "4 min read",
    publishedDate: "2026-09-15", author: "Zippy Equestrian Team",
    quoteOverlay: { _type: "object", text: "Comfort and safety over style, every time" },
    contentSections: withKeys([
      {
        paragraphs: [
          "The good news: you don't need expensive gear for your first lesson. Most good riding schools provide helmets and will let you start in regular clothes as long as they're practical.",
          "What you do need is a pair of close-toed shoes with a small heel — this prevents your foot sliding through the stirrup. Trainers or sneakers will usually work fine.",
        ],
      },
      {
        heading: "Clothes That Work",
        paragraphs: [
          "Long trousers are the best option for your first ride. Jeans work, though they can chafe on longer rides. Leggings or fitted joggers are ideal. Avoid shorts — your inner legs will rub against the saddle.",
          "On top, wear something comfortable and fitted. Loose clothing can catch on equipment. A fitted t-shirt or polo is perfect.",
        ],
      },
    ]),
    metaTitle: "What to Wear Horse Riding | Beginner's Gear Guide | Zippy Equestrian",
    metaDescription: "Practical guide on what to wear to your first horse riding lesson in Bangalore. From footwear to clothing, what you need and what to avoid on your first day.",
  },
  {
    _id: "blog-health-benefits", _type: "blogPost",
    title: "Physical and Mental Health Benefits of Horse Riding",
    slug: { _type: "slug", current: "physical-and-mental-health-benefits-of-horse-riding" },
    excerpt: "Horse riding is a full-body workout, a mindfulness practice, and a confidence builder all in one.",
    category: "HEALTH & WELLNESS", readTime: "5 min read",
    publishedDate: "2026-09-01", author: "Zippy Equestrian Team",
    quoteOverlay: { _type: "object", text: "The outside of a horse is good for the inside of a person" },
    contentSections: withKeys([
      {
        paragraphs: [
          "Horse riding engages almost every major muscle group simultaneously. Maintaining your position in the saddle requires constant, subtle adjustments from your core, hips, lower back, thighs, and calves.",
          "Riders often report that an hour in the saddle leaves them more tired than they expect — not from exertion, but from the constant low-level muscular engagement.",
        ],
      },
      {
        heading: "The Mental Health Dimension",
        paragraphs: [
          "Spending time with horses is genuinely calming. Research has shown that equine interaction reduces cortisol levels — the body's primary stress hormone. When you're grooming or riding a horse, your nervous system downregulates.",
          "Riding also demands complete present-moment attention. You cannot check your phone or zone out when you're responsible for communicating with a live animal beneath you.",
        ],
      },
    ]),
    metaTitle: "Health Benefits of Horse Riding | Physical & Mental Wellness | Zippy Equestrian",
    metaDescription: "Discover the physical and mental health benefits of horse riding. From core strength and balance to stress relief and mindfulness.",
  },
];

const instructors = [
  { _id: "instructor-barath", _type: "instructor", name: "Barath Manoharan", role: "HEAD OF TRAINING", bio: "Equestrian national champion guiding our riders with confidence for major competitions and leagues.", order: 1 },
  { _id: "instructor-vishwa", _type: "instructor", name: "Vishwa Premalal", role: "TRAINER", bio: "Equestrian and show jumping rider and champion from Sri Lanka, helping new riders find their rhythm in the saddle.", order: 2 },
  { _id: "instructor-chinmay", _type: "instructor", name: "Chinmay Vishwanath Masurkar", role: "TRAINER", bio: "Helping riders refine their technique, build confidence, and progress into competitive levels", order: 3 },
];

const horses = [
  { _id: "horse-chargano", _type: "horse", name: "Chargano fly PS", breed: "Holsteiner", discipline: "10 Years | Gelding", order: 1 },
  { _id: "horse-maharaja", _type: "horse", name: "Maharaja", breed: "Thoroughbred", discipline: "9 Years | Gelding", order: 2 },
  { _id: "horse-arjuna", _type: "horse", name: "Arjuna", breed: "Thoroughbred", discipline: "9 Years | Gelding", order: 3 },
  { _id: "horse-gwen", _type: "horse", name: "Gwen", breed: "Pony", discipline: "12 Years | Mare", order: 4 },
  { _id: "horse-chf", _type: "horse", name: "CHF Party Time", breed: "Irish Sport Horse", discipline: "8 Years | Gelding", order: 5 },
  { _id: "horse-dawn", _type: "horse", name: "Dawn", breed: "Arabian", discipline: "12 Years | Gelding", order: 6 },
  { _id: "horse-vedette", _type: "horse", name: "Vedette Van Splabeek Z", breed: "Zangersheide", discipline: "10 Years | Gelding", order: 7 },
];

const teamMembers = [
  { _id: "team-narasimha", _type: "teamMember", name: "Narasimha Murthy", role: "Chief Advisor", isFounder: true, order: 1 },
  { _id: "team-dilip",     _type: "teamMember", name: "Dilip Kirani",     role: "Founder & CEO", isFounder: true, order: 2 },
  { _id: "team-nouman",   _type: "teamMember", name: "Mohamed Nouman",   role: "Operational Head", isFounder: false, order: 3 },
  { _id: "team-rounak",   _type: "teamMember", name: "Rounak Murthy",    role: "Director", isFounder: false, order: 4 },
];

const riderStories = [
  {
    _id: "rider-nandana",
    _type: "riderStory",
    name: "Nandana",
    age: "25",
    joinedDate: "2023",
    location: "Bangalore",
    startingLevel: "Started as a complete beginner",
    role: "Rider",
    quote: "I’ve realised that riding teaches you much more than technique. The routine of coming to the stable, preparing the horse, riding, and caring for them has brought a sense of discipline and balance into my life. What I value most is the mutual understanding of me and the horse which is, to listen, communicate, and build trust without words. The calm atmosphere, time with the horses, and the community make Zippy a place I genuinely look forward to every week.",
    order: 1,
  },
  {
    _id: "rider-aazeen",
    _type: "riderStory",
    name: "Aazeen",
    age: "16",
    joinedDate: "2021",
    location: "Bangalore",
    startingLevel: "Started as a complete beginner",
    role: "Rider",
    quote: "My experience at Zippy over the past two and a half years has been truly rewarding. It has become much more than a riding academy—it is a place where I feel comfortable, supported, and inspired. The trainers go beyond teaching riding; they help us understand horses, their behaviour, grooming, saddling, and care. Their patience and dedication have helped me grow in confidence, discipline, and horsemanship. The horses are well-trained, well cared for, and treated with genuine compassion, creating a safe and positive environment for everyone.",
    order: 2,
  },
  {
    _id: "rider-priya",
    _type: "riderStory",
    name: "Priya S",
    age: "28",
    joinedDate: "2024",
    location: "Bangalore",
    startingLevel: "Started as a complete beginner",
    role: "Intermediate Rider",
    quote: "I booked a trial session thinking I'd do it once. That was eight months ago. I'm now in the Intermediate program and I can't imagine my weekends without it.",
    order: 3,
  },
  {
    _id: "rider-anagha",
    _type: "riderStory",
    name: "Anagha",
    age: "15",
    joinedDate: "2023 March",
    location: "Bangalore",
    startingLevel: "Started as a complete beginner",
    role: "Competitive Rider",
    quote: "Being a part of Zippy has been one of the happiest experiences of my life. What I love most about Zippy is the warm, welcoming environment. Every visit feels special, and I always leave feeling more confident, responsible, and connected to the horses. I’m truly grateful to the trainers and team for making my riding journey so memorable.",
    order: 4,
  },
  {
    _id: "rider-aravindh",
    _type: "riderStory",
    name: "AV Aravindh",
    age: "40+",
    joinedDate: "2023 March",
    location: "Bangalore",
    startingLevel: "Started as a complete beginner",
    role: "Dressage Rider",
    quote: "There has always been something about horses and riding that I’ve loved. As a child, I would paint horses, though I never had the opportunity to ride. I finally started riding close to 40, but struggled physically and was almost ready to quit after a difficult experience elsewhere. Finding Zippy about a year ago changed that journey completely. I’ve grown in confidence, learned to understand and care for horses, and even competed in dressage. Most importantly, Zippy has given me a wonderful community and special bonds with my horse friends—Hercules, BlackHawck, and Arjuna Maverick.",
    order: 5,
  },
  {
    _id: "rider-shaurya",
    _type: "riderStory",
    name: "Shaurya Subramanian",
    age: "10",
    joinedDate: "2023 March",
    location: "Bangalore",
    startingLevel: "Started as a complete beginner",
    role: "Rider",
    quote: "Learning to ride here has been an incredible journey. The instructors are supportive and motivating, helping riders progress at their own pace. The horses are well cared for, and the positive atmosphere makes every visit enjoyable. I look forward to every lesson and have gained both confidence and valuable riding skills.",
    order: 6,
  },
  {
    _id: "rider-ira",
    _type: "riderStory",
    name: "Ira Singal",
    age: "14",
    joinedDate: "2023 March",
    location: "Bangalore",
    startingLevel: "Started as a complete beginner",
    role: "Rider",
    quote: "I’ve been riding for a while now, and it has become my favourite place to spend my evening. It feels calm, friendly, and easygoing. It’s not just about riding; I enjoy hanging around after lessons, spending time with the horses, talking with other riders, and just being around the stable. The trainers are supportive and always there when I need help. Every visit feels like a mix of riding, learning, and having a good time. I’ve made some great memories at Zippy. It genuinely feels like a second home.",
    order: 7,
  },
  {
    _id: "rider-salma",
    _type: "riderStory",
    name: "Salma Salim",
    age: "25",
    joinedDate: "2023 March",
    location: "Bangalore",
    startingLevel: "Started as a complete beginner",
    role: "Rider",
    quote: "I love that it doesn’t feel like just another commitment, it’s a space where I can slow down, ride, spend time with the horses, and simply unwind. The atmosphere is relaxed and welcoming, and the trainers are supportive without making the experience feel overly serious. I’ve also really enjoyed getting to know the horses and their different personalities. Riding at Zippy gives me something to look forward to after a busy week.",
    order: 8,
  },
];

const faqs = [
  {
    _id: "faq-1", _type: "faq",
    question: "How difficult is horse riding?",
    answer: "Horse riding requires balance, core stability, and clear communication with the horse, but it is accessible to learners of all ages and fitness levels. Beginners start with gentle walk lessons on calm school horses where you learn balance, posture, and rein control under guided supervision. With structured instruction, most riders feel confident and balanced within just a few sessions.",
    category: "general", order: 1,
  },
  {
    _id: "faq-2", _type: "faq",
    question: "Are horseback riding classes considered exercise?",
    answer: "Yes, absolutely. Riding is an intensive, full-body cardiovascular and isometric workout. It actively engages your core, inner thighs, lower back, and pelvic floor muscles to stay centered in rhythm with the horse's movement. A 45-minute lesson can burn between 300 to 500 calories while improving posture, flexibility, and motor coordination.",
    category: "lessons", order: 2,
  },
  {
    _id: "faq-3", _type: "faq",
    question: "How to safely ride a horse?",
    answer: "Safety begins with proper equipment, respect for animal psychology, and certified coaching. At Zippy, all riders wear certified equestrian helmets, supportive boots with heels, and appropriate gear. Beginners learn how to approach horses calmly, read ear and body cues, maintain balanced posture without pulling the reins, and practice inside safe, cushioned arenas with instructor supervision.",
    category: "safety", order: 3,
  },
  {
    _id: "faq-4", _type: "faq",
    question: "How many lessons (duration of training) will it take to become a good rider?",
    answer: "Becoming a capable, independent rider generally takes around 20 to 30 structured lessons. In your first 5 to 10 lessons (our Foundation Program), you master mounting, balanced walking, steering, and posting trot. By 15 to 25 lessons, riders comfortably canter and navigate arena figures. Advanced disciplines like showjumping and dressage are continuous paths of mastery.",
    category: "lessons", order: 4,
  },
  {
    _id: "faq-5", _type: "faq",
    question: "Is there a weight limit for horse riding?",
    answer: "Yes, equine welfare and back health are our utmost priorities. In accordance with international veterinary standards, a horse should carry no more than 15% to 20% of its body weight. At Zippy, our maximum rider weight limit is generally 85 kg (approx. 187 lbs), depending on the horse assigned. During your discovery ride, trainers match each rider with an appropriately sized and conditioned horse.",
    category: "safety", order: 5,
  },
  {
    _id: "faq-6", _type: "faq",
    question: "Is social distancing and facility hygiene maintained in the academy?",
    answer: "Yes. Our facility features expansive, open-air sand arenas and outdoor paddocks with continuous fresh airflow. Lessons are conducted in private one-on-one sessions or small semi-private groups of 2 to 4 riders, naturally maintaining wide physical separation between horses. All riding helmets, tack, and reins are sanitized between sessions.",
    category: "facilities", order: 6,
  },
  {
    _id: "faq-7", _type: "faq",
    question: "When can I participate in the competition?",
    answer: "Riders can typically begin competing in club-level schooling shows and gymkhana events after 6 to 12 months of consistent training (around 40–50 hours in the saddle). Once you demonstrate a secure, balanced seat across walk, trot, and canter, our trainers guide you into the Performance Program to prepare for regional EFI (Equestrian Federation of India) dressage and showjumping events.",
    category: "competitions", order: 7,
  },
  {
    _id: "faq-8", _type: "faq",
    question: "What are the required skills to train a racehorse?",
    answer: "Training racehorses and high-performance sport horses requires profound understanding of equine biomechanics, behavioral conditioning, and years of hands-on horsemanship. Key skills include ground handling, lunging, interval fitness conditioning, pacing management, and gait evaluation. Professional trainers must also tailor nutritional regimens and spot subtle changes in temperament or soundness.",
    category: "competitions", order: 8,
  },
];

const stats = [
  { _id: "stat-1", _type: "stat", number: "10+", label: "Years of riding in\nBangalore", order: 1 },
  { _id: "stat-2", _type: "stat", number: "1000+", label: "Riders trained and\ncounting", order: 2 },
  { _id: "stat-3", _type: "stat", number: "45", label: "Horses at the\ncenter", order: 3 },
  { _id: "stat-4", _type: "stat", number: "6", label: "Structured riding\nprograms", order: 4 },
];

/* Chatbot Q&A — mirrors src/data/chatFaqs.ts.
   `keywords` drive the free-text matcher in src/components/chat/matcher.ts.
   Keep them in sync with that file, or the chips still work but typed queries won't. */
const chatFaqs = [
  {
    _id: "chatfaq-beginner",
    _type: "chatFaq",
    question: "I've never ridden before. Can I still join?",
    answer:
      "Absolutely — most of our riders arrive as complete beginners. Your first session is a private assessment where we match you with a calm schoolmaster horse and a coach who works at your pace. No prior experience or fitness level required.",
    keywords: stringArray(["beginner", "new", "first time", "never ridden", "start", "experience"]),
    linkLabel: "See beginner programs",
    linkUrl: "/programs",
    order: 1,
  },
  {
    _id: "chatfaq-book",
    _type: "chatFaq",
    question: "How do I book a trial ride?",
    answer:
      "Message us on WhatsApp or call the centre and we'll slot you into a 30-minute trial ride. It usually runs from 30 minutes away, and there's no obligation to continue afterwards.",
    keywords: stringArray(["book", "trial", "reserve", "appointment", "demo", "session"]),
    linkLabel: "Book via contact page",
    linkUrl: "/contact",
    order: 2,
  },
  {
    _id: "chatfaq-own-horse",
    _type: "chatFaq",
    question: "Do I need my own horse?",
    answer:
      "No. We have a full herd of schoolmasters, sport horses and ponies here, and the horse is included in your lesson. If you do own a horse, we also offer lessons on your own mount once you're riding confidently.",
    keywords: stringArray(["own horse", "horse provided", "buy horse", "lease", "stable", "stall"]),
    order: 3,
  },
  {
    _id: "chatfaq-fees",
    _type: "chatFaq",
    question: "What are the fees?",
    answer:
      "Fees depend on whether you ride in a group or private session, and on the program. Trial rides and monthly plans are the most common starting points. Send us a WhatsApp message with the program you're eyeing and we'll share the exact pricing.",
    keywords: stringArray(["price", "cost", "fee", "fees", "charges", "rate", "pricing", "membership", "how much"]),
    linkLabel: "Browse programs",
    linkUrl: "/programs",
    order: 4,
  },
  {
    _id: "chatfaq-timings",
    _type: "chatFaq",
    question: "What are your timings?",
    answer:
      "We run sessions across the day, with morning and evening slots being the busiest. Weekday slots are usually easier to book, and weekends fill up fastest. Message us for the next available time.",
    keywords: stringArray(["timing", "timings", "hours", "open", "slot", "schedule", "morning", "evening", "when"]),
    order: 5,
  },
  {
    _id: "chatfaq-kids",
    _type: "chatFaq",
    question: "Do you coach children?",
    answer:
      "Yes. We run dedicated junior programs built around correct fundamentals and plenty of fun — ponies, games and confidence-building. Children can typically start from around 5 or 6 years old.",
    keywords: stringArray(["child", "children", "kid", "kids", "junior", "juniors", "young", "age", "son", "daughter"]),
    order: 6,
  },
  {
    _id: "chatfaq-gear",
    _type: "chatFaq",
    question: "What should I wear or bring?",
    answer:
      "Wear trousers or leggings and closed shoes with a small heel — no sandals or trainers. Helmets are provided and are mandatory on the arena. Bring water and a hat if it's a sunny afternoon.",
    keywords: stringArray(["wear", "dress", "clothes", "gear", "helmet", "shoes", "boots", "bring", "kit"]),
    order: 7,
  },
  {
    _id: "chatfaq-location",
    _type: "chatFaq",
    question: "Where exactly are you located?",
    answer:
      "We're on Chikkanayakanahalli, off Sarjapur Road, near Carmelaram Railway Station in Bengaluru. We have ample parking, and the yard is fully shaded.",
    keywords: stringArray(["location", "where", "address", "directions", "map", "far", "distance"]),
    linkLabel: "Get directions",
    linkUrl: "/contact",
    order: 8,
  },
  {
    _id: "chatfaq-competition",
    _type: "chatFaq",
    question: "Can you coach me for competitions?",
    answer:
      "Yes. Our instructors prepare riders for local and national level events, and we also compete on the centre's own horses. Tell us which discipline you're aiming for and we'll talk through a plan.",
    keywords: stringArray(["competition", "compete", "competitive", "events", "showjumping", "dressage", "level", "test"]),
    linkLabel: "Meet the instructors",
    linkUrl: "/about",
    order: 9,
  },
  {
    _id: "chatfaq-other",
    _type: "chatFaq",
    question: "What else do you offer besides lessons?",
    answer:
      "Beyond coaching we run birthday experiences, corporate team sessions, horse photography and content shoots, plus stalls and events from the yard. Tell us what you have in mind and we'll build something around it.",
    keywords: stringArray(["other", "else", "extra", "birthday", "corporate", "events", "photography", "shoot", "party"]),
    linkLabel: "Beyond the ride",
    linkUrl: "/beyond",
    order: 10,
  },
];

/* ════════════════════════════════════════════════════════
   MAIN
════════════════════════════════════════════════════════ */
/** Section names accepted as CLI args, e.g. `node scripts/seed-sanity.mjs chatFaq` */
const only = process.argv.slice(2).filter((arg) => !arg.startsWith("-"));
const shouldSeed = (section) => only.length === 0 || only.includes(section);

async function main() {
  console.log("\n🐴  Zippy Equestrian — Sanity Seed Script");
  console.log(`📦  Project: ${projectId}  |  Dataset: ${dataset}`);
  if (only.length > 0) console.log(`🎯  Only: ${only.join(", ")}`);
  console.log("");

  const seeded = [];
  const step = async (name, title, run) => {
    if (!shouldSeed(name)) return;
    console.log(title);
    await run();
    seeded.push(name);
  };

  await step("siteSettings", "📌  Site Settings", async () => {
    await upsert(siteSettings);
  });

  await step("program", "🎯  Riding Programs", async () => {
    for (const doc of programs) await upsert(doc);
  });

  await step("beyondService", "🌿  Beyond the Ride Services", async () => {
    for (const doc of beyondServices) await upsert(doc);
  });

  await step("blogPost", "📝  Blog Posts", async () => {
    for (const doc of blogPosts) await upsert(doc);
  });

  await step("riderStory", "💬  Rider Stories & Testimonials", async () => {
    for (const doc of riderStories) await upsert(doc);
  });

  await step("instructor", "👨‍🏫  Instructors", async () => {
    for (const doc of instructors) await upsert(doc);
  });

  await step("horse", "🐎  Horses (Herd)", async () => {
    for (const doc of horses) await upsert(doc);
  });

  await step("teamMember", "👥  Team Members", async () => {
    for (const doc of teamMembers) await upsert(doc);
  });

  await step("faq", "❓  Website FAQs", async () => {
    for (const doc of faqs) await upsert(doc);
  });

  await step("stat", "📊  Milestone Stats", async () => {
    for (const doc of stats) await upsert(doc);
  });

  await step("chatFaq", "💭  Chatbot Q&A", async () => {
    for (const doc of chatFaqs) await upsert(doc);
  });

  console.log(`\n✅  Seeded: ${seeded.join(", ") || "nothing (unknown section?)"}`);
  console.log("    Open http://localhost:3000/studio to view and edit your content.\n");
}

main().catch((err) => {
  console.error("❌  Seed failed:", err.message || err);
  process.exit(1);
});
