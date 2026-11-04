import { afterEach, describe, expect, it, vi } from "vitest";
import { getBookingUrl } from "./booking";

// Sample address on a reserved domain. It is not a real booking page.
const SAMPLE_URL = "https://calendly.example/sample-booking";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("getBookingUrl", () => {
  it("returns the CALENDLY_URL value when it is set", () => {
    vi.stubEnv("CALENDLY_URL", SAMPLE_URL);
    expect(getBookingUrl()).toBe(SAMPLE_URL);
  });

  it("falls back to # when CALENDLY_URL is unset", () => {
    vi.stubEnv("CALENDLY_URL", undefined);
    expect(getBookingUrl()).toBe("#");
  });

  it("falls back to # when CALENDLY_URL is empty or only spaces", () => {
    vi.stubEnv("CALENDLY_URL", "");
    expect(getBookingUrl()).toBe("#");
    vi.stubEnv("CALENDLY_URL", "   ");
    expect(getBookingUrl()).toBe("#");
  });

  it("trims spaces around a real value", () => {
    vi.stubEnv("CALENDLY_URL", `  ${SAMPLE_URL}  `);
    expect(getBookingUrl()).toBe(SAMPLE_URL);
  });
});
