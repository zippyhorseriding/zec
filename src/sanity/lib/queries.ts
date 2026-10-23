import { groq } from "next-sanity";

export const SITE_SETTINGS_QUERY = groq`
  *[_type == "siteSettings"][0]{
    siteName,
    tagline,
    phoneNumber,
    email,
    address,
    googleMapsUrl,
    instagramUrl,
    facebookUrl,
    youtubeUrl,
    footerHeading,
    footerSubheading,
    footerCtaText
  }
`;

export const PROGRAMS_QUERY = groq`
  *[_type == "program"] | order(order asc){
    _id,
    title,
    "slug": slug.current,
    category,
    shortDescription,
    paragraphs,
    "bannerImage": bannerImage.asset->url,
    curriculumList,
    experiences,
    duration,
    sessions,
    ctaText,
    metaTitle,
    metaDescription
  }
`;

export const PROGRAM_BY_SLUG_QUERY = groq`
  *[_type == "program" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    category,
    shortDescription,
    paragraphs,
    "bannerImage": bannerImage.asset->url,
    curriculumList,
    experiences,
    duration,
    sessions,
    ctaText,
    metaTitle,
    metaDescription
  }
`;

export const BEYOND_SERVICES_QUERY = groq`
  *[_type == "beyondService"] | order(order asc){
    _id,
    title,
    "slug": slug.current,
    heroDescription,
    "image": image.asset->url,
    imageAlt,
    contentParagraphs,
    highlightText,
    ctaText,
    contactInterest,
    metaTitle,
    metaDescription
  }
`;

export const BEYOND_SERVICE_BY_SLUG_QUERY = groq`
  *[_type == "beyondService" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    heroDescription,
    "image": image.asset->url,
    imageAlt,
    contentParagraphs,
    highlightText,
    ctaText,
    contactInterest,
    metaTitle,
    metaDescription
  }
`;

export const BLOG_POSTS_QUERY = groq`
  *[_type == "blogPost"] | order(publishedDate desc){
    _id,
    title,
    "slug": slug.current,
    excerpt,
    category,
    readTime,
    publishedDate,
    author,
    "bannerImage": bannerImage.asset->url,
    quoteOverlay,
    contentSections,
    metaTitle,
    metaDescription
  }
`;

export const BLOG_POST_BY_SLUG_QUERY = groq`
  *[_type == "blogPost" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    category,
    readTime,
    publishedDate,
    author,
    "bannerImage": bannerImage.asset->url,
    quoteOverlay,
    contentSections,
    metaTitle,
    metaDescription
  }
`;

export const RIDER_STORIES_QUERY = groq`
  *[_type == "riderStory"] | order(order asc){
    _id,
    name,
    age,
    location,
    joinedDate,
    startingLevel,
    role,
    quote,
    "image": image.asset->url
  }
`;

export const INSTRUCTORS_QUERY = groq`
  *[_type == "instructor"] | order(order asc){
    _id,
    name,
    role,
    bio,
    "image": image.asset->url
  }
`;

export const HORSES_QUERY = groq`
  *[_type == "horse"] | order(order asc){
    _id,
    name,
    breed,
    discipline,
    personality,
    "image": image.asset->url
  }
`;

export const TEAM_MEMBERS_QUERY = groq`
  *[_type == "teamMember"] | order(order asc){
    _id,
    name,
    role,
    bio,
    isFounder,
    "image": image.asset->url
  }
`;

export const CHAT_FAQS_QUERY = groq`
  *[_type == "chatFaq" && defined(question) && defined(answer)] | order(order asc, _createdAt asc){
    _id,
    question,
    answer,
    "keywords": keywords[].value,
    linkLabel,
    linkUrl
  }
`;

export const FAQS_QUERY = groq`
  *[_type == "faq" && defined(question) && defined(answer)] | order(order asc, _createdAt asc){
    _id,
    question,
    answer,
    category,
    order
  }
`;

export const GALLERY_QUERY = groq`
  *[_type == "galleryItem" && defined(image)] | order(order asc, _createdAt asc){
    _id,
    title,
    "image": image.asset->url,
    alt,
    category,
    instagramUrl,
    order
  }
`;

export const STATS_QUERY = groq`
  *[_type == "stat" && defined(number) && defined(label)] | order(order asc, _createdAt asc){
    _id,
    number,
    label,
    order
  }
`;

export const ACTIVITIES_QUERY = groq`
  *[_type == "activity"] | order(order asc, _createdAt asc){
    _id,
    title,
    description,
    "image": image.asset->url,
    overlayColor,
    ctaText,
    ctaHref,
    order
  }
`;

