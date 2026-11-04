import { bookCallLabel } from "@/content/home";
import { getBookingUrl } from "@/lib/booking";
import { Button } from "./button";

// Every Book a call button on the site is this one, so the label and the link
// (CALENDLY_URL) are set in one place each.
export function BookCallButton({ variant = "primary" }: { variant?: "primary" | "secondary" }) {
  return (
    <Button href={getBookingUrl()} variant={variant}>
      {bookCallLabel}
    </Button>
  );
}
