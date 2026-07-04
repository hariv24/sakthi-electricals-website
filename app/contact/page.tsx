import { getSiteMedia } from "@/lib/siteMedia";
import ContactContent from "./ContactContent";

export const metadata = {
  title: "Contact — Sakthi Electricals",
  description: "Get in touch with Sakthi Electricals — share your ratings, accuracy class, and standard and we'll quote the right instrument transformer or panel for your application.",
};

export default async function ContactPage() {
  const media = await getSiteMedia(['contact_banner']);
  return <ContactContent bannerUrl={media.contact_banner} />;
}
