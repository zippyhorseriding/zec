"use client";

import Reveal from "@/components/ui/Reveal";
import { useSiteSettings } from "@/components/SiteSettingsProvider";

const CONTACT_ROLES = [
  {
    role: "FRONT OFFICE",
    name: null,
    description: "For bookings, general enquiries, and program information",
  },
  {
    role: "MOHAMED NOUMAN",
    name: "Operational Head",
    description: "For events, activities, franchise and consultation enquiries",
  },
];

/** Secondary line for the directory; the primary number comes from Site Settings. */
const SECONDARY_PHONE = "+91 98829 88267";

export default function ContactDirectorySection() {
  const settings = useSiteSettings();

  const contacts = CONTACT_ROLES.map((entry, i) => ({
    ...entry,
    phone: i === 0 ? settings.phoneNumber : SECONDARY_PHONE,
    email: i === 0 ? settings.email : undefined,
  }));

  return (
    <section className="contact-directory w-full bg-transparent pt-2 md:pt-4 pb-16 md:pb-20 max-md:pt-6 max-md:pb-12">
      <div className="container mx-auto px-6 md:px-12 max-sm:px-4">

        {/* Heading — sits on top, spanning */}
        <Reveal>
          <h2 className="text-[#85431E] text-2xl md:text-3xl font-light uppercase leading-tight mb-12 lg:mb-16">
            Contact<br />Directory
          </h2>
        </Reveal>

        {/* Contact entries — two columns below the heading */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 max-md:gap-8">
          {contacts.map((contact, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div>
                <p className="text-[#DA7347] text-base font-light mb-2">
                  <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="hover:underline">
                    {contact.phone}
                  </a>
                </p>
                {contact.email && (
                  <p className="text-[#1a1a1a]/55 text-sm font-light mb-2">
                    <a href={`mailto:${contact.email}`} className="hover:underline">
                      {contact.email}
                    </a>
                  </p>
                )}
                <div className="dir-divider w-full h-px mb-3" style={{ backgroundColor: "#85431E33" }} />
                <p className="text-[#DA7347] text-sm uppercase font-medium mb-1">
                  {contact.role}
                </p>
                {contact.name && (
                  <p className="text-[#1a1a1a] text-sm font-medium mb-1">
                    {contact.name}
                  </p>
                )}
                <p className="text-[#1a1a1a]/55 text-sm font-light leading-relaxed">
                  {contact.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}
