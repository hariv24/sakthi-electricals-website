export const revalidate = 60;

import { getSiteMedia } from "@/lib/siteMedia";
import CareersContent from "./CareersContent";

export const metadata = {
  title: "Careers — Sakthi Electricals",
  description: "Join the Sakthi Electricals team — hands-on engineering roles in transformer manufacturing, quality, design, and sales in Pudukkottai, Tamil Nadu.",
};

export default async function CareersPage() {
  const media = await getSiteMedia(['careers_banner']);
  return <CareersContent bannerUrl={media.careers_banner} />;
}
