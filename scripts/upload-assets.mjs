/**
 * Sanity Image Uploader
 * Uploads the site's local images into the dataset as assets, then either
 * attaches them to existing documents or creates gallery/activity documents.
 *
 * Text-only seeding lives in scripts/seed-sanity.mjs — this handles anything
 * that needs a real asset, because image fields can't be set by createOrReplace
 * alone (they need an uploaded asset _ref).
 *
 * Usage:
 *   node scripts/upload-assets.mjs                 # everything
 *   node scripts/upload-assets.mjs gallery         # one section
 *   node scripts/upload-assets.mjs gallery activity
 *   node scripts/upload-assets.mjs --force         # overwrite existing images
 *
 * Safe to re-run: assets are content-addressed by Sanity (so uploads dedupe)
 * and documents that already have an image are skipped unless --force.
 *
 * Requires:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local
 *   SANITY_WRITE_TOKEN in .env.local  (Editor token: sanity.io/manage → API → Tokens)
 */

import { createClient } from "@sanity/client";
import { config } from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

config({ path: path.join(root, ".env.local") });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-10-07";
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || projectId === "your-project-id") {
  console.error("❌  Set NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local first.");
  process.exit(1);
}
if (!token) {
  console.error(
    "❌  SANITY_WRITE_TOKEN is missing from .env.local.\n" +
    "    https://www.sanity.io/manage → API → Tokens → Add API Token (Editor)"
  );
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion, useCdn: false, token });

/* ── CLI ── */
const argv = process.argv.slice(2);
const force = argv.includes("--force");
const only = argv.filter((arg) => !arg.startsWith("-"));
const shouldRun = (section) => only.length === 0 || only.includes(section);

/* ── helpers ── */
const uploaded = new Map();

async function uploadImage(src, alt) {
  if (uploaded.has(src)) return uploaded.get(src);

  const abs = path.join(root, "public", src.replace(/^\/+/, ""));
  if (!fs.existsSync(abs)) throw new Error(`Missing local file: ${abs}`);

  const asset = await client.assets.upload("image", fs.createReadStream(abs), {
    filename: path.basename(abs),
    title: alt,
  });
  uploaded.set(src, asset._id);
  return asset._id;
}

const imageRef = (assetId) => ({
  _type: "image",
  asset: { _type: "reference", _ref: assetId },
});

/** Attaches an uploaded image to an existing document. */
async function attach(docId, field, src, alt, extra = {}) {
  const assetId = await uploadImage(src, alt);
  await client.patch(docId).set({ [field]: imageRef(assetId), ...extra }).commit();
  console.log(`  ✓  ${docId}.${field}`);
}

/** Creates/replaces a document that is image-driven (gallery, activities). */
async function upsertWithImage(doc, field, src, alt) {
  const assetId = await uploadImage(src, alt);
  await client.createOrReplace({ ...doc, [field]: imageRef(assetId) });
  console.log(`  ✓  ${doc._type}: ${doc._id}`);
}

/** Returns the set of doc _ids of a type that already have this image field set. */
async function idsWithImage(type, field = "image") {
  const ids = await client.fetch(
    `*[_type == $type && defined(${field}.asset)]._id`,
    { type }
  );
  return new Set(ids);
}

/* ════════════════════════════════════════════════════════
   DATA
   ════════════════════════════════════════════════════════ */

const INSTA_LINK =
  "https://www.instagram.com/zippy.equestrian?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==";

const GALLERY = [
  {
    _id: "gallery-1", _type: "galleryItem", order: 1,
    title: "Morning Arena Warm-up",
    src: "/assets/images/Contact/Webp/g1.webp",
    alt: "Morning arena riding lesson at Zippy Equestrian Center",
    category: "stables",
  },
  {
    _id: "gallery-2", _type: "galleryItem", order: 2,
    title: "Paddock Connection",
    src: "/assets/images/Contact/Webp/g2.webp",
    alt: "Gentle horse grooming and bonding at the stables",
    category: "horses",
  },
  {
    _id: "gallery-3", _type: "galleryItem", order: 3,
    title: "Canter Stride Focus",
    src: "/assets/images/Contact/Webp/g3.webp",
    alt: "Young rider training canter stride in outdoor arena",
    category: "riders",
  },
  {
    _id: "gallery-4", _type: "galleryItem", order: 4,
    title: "Showjumping Clear Round",
    src: "/assets/images/Contact/Webp/g4.webp",
    alt: "Equestrian jumping obstacle during training session",
    category: "competitions",
  },
  {
    _id: "gallery-5", _type: "galleryItem", order: 5,
    title: "Golden Hour Trail",
    src: "/assets/images/Contact/Webp/g5.webp",
    alt: "Sunset horse riding experience in South Bangalore",
    category: "stables",
  },
  {
    _id: "gallery-6", _type: "galleryItem", order: 6,
    title: "Stable Grounds & Courtyard",
    src: "/assets/images/Contact/Webp/g6.webp",
    alt: "Stable walkways and equine facilities at ZEC",
    category: "stables",
  },
  {
    _id: "gallery-7", _type: "galleryItem", order: 7,
    title: "Cadence & Trot Rhythm",
    src: "/assets/images/Contact/Webp/g7.webp",
    alt: "Rider practicing trot rhythm in the morning light",
    category: "riders",
  },
];

const ACTIVITIES = [
  {
    _id: "activity-summer-camps", _type: "activity", order: 1,
    title: "Summer camps",
    description: "For kids who want more than a screen this summer.",
    src: "/assets/images/HomePage/Webp/summercamp.webp",
    alt: "Children at a Zippy summer horse riding camp",
    overlayColor: "rgba(135, 28, 7, 0.90)",
    ctaText: "Know more",
    ctaHref: "/beyond/summer-camps",
  },
  {
    _id: "activity-parties-venues", _type: "activity", order: 2,
    title: "Parties and Venues",
    description: "Host your next get-together at the stables.",
    src: "/assets/images/HomePage/Webp/party.webp",
    alt: "Outdoor party gathering at Zippy Equestrian Center",
    overlayColor: "#2658C4",
    ctaText: "Know more",
    ctaHref: "/beyond/parties-and-venues",
  },
  {
    _id: "activity-photoshoots", _type: "activity", order: 3,
    title: "Photoshoots",
    description: "The most beautiful backdrop in South Bangalore.",
    src: "/assets/images/HomePage/Webp/photoshoot.webp",
    alt: "Photoshoot with horses at Zippy Equestrian Center",
    overlayColor: "#DA7347",
    ctaText: "Know more",
    ctaHref: "/beyond/photoshoots",
  },
];

const HORSES = [
  ["horse-chargano", "/assets/images/About/Webp/herd0.webp", "Chargano fly PS, Holsteiner gelding at Zippy Equestrian Center"],
  ["horse-maharaja", "/assets/images/About/Webp/herd1.webp", "Maharaja, Thoroughbred gelding at Zippy Equestrian Center"],
  ["horse-arjuna", "/assets/images/About/Webp/herd2.webp", "Arjuna, Thoroughbred gelding at Zippy Equestrian Center"],
  ["horse-gwen", "/assets/images/About/Webp/herd3.webp", "Gwen, pony mare at Zippy Equestrian Center"],
  ["horse-chf", "/assets/images/About/Webp/herd4.webp", "CHF Party Time, Irish Sport Horse gelding at Zippy Equestrian Center"],
  ["horse-dawn", "/assets/images/About/Webp/herd5.webp", "Dawn, Arabian gelding at Zippy Equestrian Center"],
  ["horse-vedette", "/assets/images/About/Webp/herd6.webp", "Vedette Van Splabeek Z, Zangersheide gelding at Zippy Equestrian Center"],
];

const INSTRUCTORS = [
  ["instructor-barath", "/assets/images/About/Webp/people-c.webp", "Barath Manoharan, Head of Training at Zippy Equestrian Center"],
  ["instructor-vishwa", "/assets/images/About/Webp/about-img2.webp", "Vishwa Premalal, trainer at Zippy Equestrian Center"],
  ["instructor-chinmay", "/assets/images/About/Webp/DSC02110.webp", "Chinmay Vishwanath Masurkar, trainer at Zippy Equestrian Center"],
];

const TEAM = [
  ["team-narasimha", "/assets/images/About/Webp/about-p1.webp", "Narasimha Murthy, Chief Advisor at Zippy Equestrian Center"],
  ["team-dilip", "/assets/images/About/Webp/about-p2.webp", "Dilip Kirani, Founder and CEO of Zippy Equestrian Center"],
  ["team-nouman", "/assets/images/About/Webp/about-p3.webp", "Mohamed Nouman, Operational Head at Zippy Equestrian Center"],
  ["team-rounak", "/assets/images/About/Webp/about-p4.webp", "Rounak Murthy, Director at Zippy Equestrian Center"],
];

const RIDERS = [
  ["rider-nandana", "/assets/images/Rider_stories/Webp/Nandana.webp", "Nandana, rider at Zippy Equestrian Center"],
  ["rider-aazeen", "/assets/images/Rider_stories/Webp/Aazeen.webp", "Aazeen, rider at Zippy Equestrian Center"],
  ["rider-priya", "/assets/images/Rider_stories/Webp/Rectangle 189.webp", "Priya S, rider at Zippy Equestrian Center"],
  ["rider-anagha", "/assets/images/Rider_stories/Webp/Anagha.webp", "Anagha, rider at Zippy Equestrian Center"],
  ["rider-aravindh", "/assets/images/Rider_stories/Webp/Aravindh.webp", "AV Aravindh, dressage rider at Zippy Equestrian Center"],
  ["rider-shaurya", "/assets/images/Rider_stories/Webp/Shaurya.webp", "Shaurya Subramanian, rider at Zippy Equestrian Center"],
  ["rider-ira", "/assets/images/Rider_stories/Webp/Ira.webp", "Ira Singal, rider at Zippy Equestrian Center"],
  ["rider-salma", "/assets/images/Rider_stories/Webp/Salma.webp", "Salma Salim, rider at Zippy Equestrian Center"],
];

const PROGRAMS = [
  ["program-discovery-ride", "/assets/images/Programs/Webp/r1.webp", "Discovery Ride introductory horse riding experience at Zippy Equestrian Center Bangalore"],
  ["program-foundation", "/assets/images/Programs/Webp/r2.webp", "Foundation horse riding classes for beginners at Zippy Equestrian Center"],
  ["program-development", "/assets/images/Programs/Webp/r3.webp", "Development horse riding program for intermediate riders at Zippy Equestrian Center"],
  ["program-performance", "/assets/images/Programs/Webp/r4.webp", "Performance and competitive equestrian training program at Zippy Equestrian Center"],
  ["program-dressage", "/assets/images/Programs/Webp/r5.webp", "Dressage equestrian specialization program at Zippy Equestrian Center Bangalore"],
  ["program-showjumping", "/assets/images/Programs/Webp/r6.webp", "Showjumping lessons and fence jumping training at Zippy Equestrian Center Bangalore"],
  ["program-practice", "/assets/images/Programs/Webp/r7.webp", "Practice horse riding sessions and saddle hours at Zippy Equestrian Center Bangalore"],
];

const BLOGS = [
  ["blog-myths", "/assets/images/Rider_stories/Webp/riders-hero.webp", "Stables and horses at Zippy Equestrian Center Bangalore"],
  ["blog-health-benefits", "/assets/images/HomePage/Webp/Hero.webp", "Rider training in green Bangalore countryside arena"],
  ["blog-what-to-wear", "/assets/images/Programs/Webp/Hero.webp", "Equestrian rider prepared with proper safety helmet and boots"],
];

const BEYOND = [
  ["beyond-summer-camps", "/assets/images/BeyondRide/Webp/summer-camp.webp", "Children horse riding summer camp at Zippy Equestrian Center Bangalore"],
  ["beyond-horse-training", "/assets/images/BeyondRide/Webp/horse-training.webp", "Professional horse training services in Bangalore at Zippy Equestrian Center"],
  ["beyond-buy-a-horse", "/assets/images/BeyondRide/Webp/buy.webp", "Horses for sale in Bangalore at Zippy Equestrian Center"],
  ["beyond-parties-and-venues", "/assets/images/BeyondRide/Webp/venue.webp", "Equestrian birthday party and event venue in South Bangalore"],
  ["beyond-equestrian-consultation", "/assets/images/BeyondRide/Webp/eque.webp", "Equestrian facility design and riding school consultancy Bangalore"],
  ["beyond-horse-rent-lease", "/assets/images/BeyondRide/Webp/horse.webp", "Horse leasing and monthly rental arrangements at Zippy Equestrian Center"],
  ["beyond-photoshoots", "/assets/images/BeyondRide/Webp/photo.webp", "Photoshoot location with horses at Zippy Equestrian Center Bangalore"],
  ["beyond-franchise", "/assets/images/BeyondRide/Webp/franchise.webp", "Zippy Equestrian Center franchise and partnership opportunities in India"],
  ["beyond-horse-boarding", "/assets/images/BeyondRide/Webp/boarding.webp", "Premium horse boarding and full livery stables in Bangalore"],
];

/* ════════════════════════════════════════════════════════
   MAIN
   ════════════════════════════════════════════════════════ */

async function main() {
  console.log("\n🖼️   Zippy Equestrian — Sanity Image Upload");
  console.log(`📦  Project: ${projectId}  |  Dataset: ${dataset}`);
  if (only.length > 0) console.log(`🎯  Only: ${only.join(", ")}`);
  if (force) console.log("🔁  Force: overwriting existing images");
  console.log("");

  const done = [];
  const step = async (name, title, run) => {
    if (!shouldRun(name)) return;
    console.log(title);
    await run();
    done.push(name);
  };

  await step("gallery", "🖼️   Gallery Images", async () => {
    for (const item of GALLERY) {
      await upsertWithImage(
        {
          _id: item._id,
          _type: item._type,
          order: item.order,
          title: item.title,
          alt: item.alt,
          category: item.category,
          instagramUrl: INSTA_LINK,
        },
        "image",
        item.src,
        item.alt
      );
    }
  });

  await step("activity", "🎪  Activities & Amenities", async () => {
    for (const item of ACTIVITIES) {
      await upsertWithImage(
        {
          _id: item._id,
          _type: item._type,
          order: item.order,
          title: item.title,
          description: item.description,
          overlayColor: item.overlayColor,
          ctaText: item.ctaText,
          ctaHref: item.ctaHref,
        },
        "image",
        item.src,
        item.alt
      );
    }
  });

  /** Attach a [docId, src, alt] table to `field`, skipping docs already filled. */
  const attachTable = async (type, field, table, title, extraAltField) => {
    await step(type, title, async () => {
      const existing = force ? new Set() : await idsWithImage(type, field);
      let skipped = 0;
      for (const [docId, src, alt] of table) {
        if (existing.has(docId)) {
          skipped += 1;
          continue;
        }
        await attach(
          docId,
          field,
          src,
          alt,
          extraAltField ? { [extraAltField]: alt } : {}
        );
      }
      if (skipped > 0) console.log(`  ⤼  ${skipped} already had a ${field} — skipped (use --force)`);
    });
  };

  await attachTable("horse", "image", HORSES, "🐎  Horses");
  await attachTable("instructor", "image", INSTRUCTORS, "👨‍🏫  Instructors");
  await attachTable("teamMember", "image", TEAM, "👥  Team Members");
  await attachTable("riderStory", "image", RIDERS, "💬  Rider Stories");
  await attachTable("program", "bannerImage", PROGRAMS, "🎯  Programs (banner)");
  await attachTable("blogPost", "bannerImage", BLOGS, "📝  Blog Posts (banner)");
  await attachTable("beyondService", "image", BEYOND, "🌿  Beyond the Ride", "imageAlt");

  console.log(`\n✅  Done: ${done.join(", ") || "nothing (unknown section?)"}`);
  console.log("    Open http://localhost:3000/studio to review.\n");
}

main().catch((err) => {
  console.error("❌  Upload failed:", err.message || err);
  process.exit(1);
});
