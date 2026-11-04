// Every Book a call button links to the Calendly booking page.
// The URL is not supplied yet, so it comes from one config value, CALENDLY_URL.
// While it is unset the buttons link to "#". That is a stand-in, never a made up address.
// Next.js reads the value at build time for static pages, so set it before `pnpm build`.
export function getBookingUrl(): string {
  const url = process.env.CALENDLY_URL?.trim();
  return url ? url : "#";
}
