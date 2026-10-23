/**
 * Default site settings.
 *
 * Kept in its own module (free of any Sanity client imports) so client
 * components such as SiteSettingsProvider can import the fallback values
 * without pulling the server-side Sanity client into the browser bundle.
 */

export interface SiteSettings {
  siteName: string;
  tagline: string;
  phoneNumber: string;
  email: string;
  address: string;
  googleMapsUrl?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  footerHeading: string;
  footerSubheading: string;
  footerCtaText: string;
}

export const defaultSiteSettings: SiteSettings = {
  siteName: "Zippy Equestrian Center",
  tagline: "Real Riding. Real Feeling.",
  phoneNumber: "+91 98453 64281",
  email: "ride@zippyec.com",
  address:
    "Survey No. 46/1 & 46/2, Chikkanayakanahalli, Off Sarjapur Road, Near Carmelaram Railway Station, Bengaluru, Karnataka 560035",
  googleMapsUrl: "https://maps.google.com/?q=Zippy+Equestrian+Center",
  instagramUrl: "https://www.instagram.com/zippyequestrian",
  footerHeading: "The rider in you is just a ride away.",
  footerSubheading: "Your first ride is 30 minutes away. Call us and let's get you started.",
  footerCtaText: "Book your trial ride",
};
