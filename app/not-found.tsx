import { PageHero } from "@/components/sections/PageHero";

export default function NotFound() {
  return (
    <PageHero
      label="Error 404"
      title="This page does not exist."
      body="The link may be old, or the page may have moved."
      primary={{ href: "/", label: "Back to the homepage" }}
      secondary={{ href: "/#contact", label: "Contact us" }}
    />
  );
}
