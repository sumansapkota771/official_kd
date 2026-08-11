"use client";

import { useState, type FormEvent } from "react";
import { CheckmarkCircle02Icon, Loading01Icon, SentIcon } from "hugeicons-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { products } from "@/lib/data/products";

const fieldClasses =
  "focus-ring w-full rounded-xl border-[0.5px] border-border bg-background px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus-visible:border-brand-blue";
const labelClasses = "text-sm font-medium text-text-secondary";

const INTERESTS = ["Live demo", "Pricing & licensing", "White-label / partnership", "Custom build like this"];

export function ProductTalkForm({ defaultProduct }: { defaultProduct?: string }) {
  const [product, setProduct] = useState(defaultProduct ?? "");
  const [status, setStatus] = useState<"idle" | "submitting" | "submitted">("idle");
  const [error, setError] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError(false);
    const data = new FormData(e.currentTarget);
    const value = (key: string) => data.get(key)?.toString() ?? "";
    const payload: Record<string, unknown> = {
      section: "product_talk",
      name: value("name"),
      contact: value("contact"),
      organization: value("organization"),
      product: value("product"),
      interest: value("interest"),
      message: value("message"),
    };
    try {
      const res = await fetch("/api/contact/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("submit failed");
      setStatus("submitted");
    } catch {
      setStatus("idle");
      setError(true);
    }
  }

  if (status === "submitted") {
    return (
      <div className="flex flex-col items-center gap-3 card p-10 text-center">
        <CheckmarkCircle02Icon className="h-8 w-8 text-brand-green-hover" />
        <h3 className="text-xl font-semibold text-text-primary">Talk booked — we&apos;re on it.</h3>
        <p className="max-w-sm text-sm leading-relaxed text-text-muted">
          A confirmation email is on its way, along with a calendar link to book your product
          call. Our team typically responds within one business day.
        </p>
        <Button variant="outline" onClick={() => setStatus("idle")} className="mt-2">
          Book another talk
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 card p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" htmlFor="pt-name">
          <input id="pt-name" name="name" required className={fieldClasses} placeholder="Your full name" />
        </Field>
        <Field label="Work email or phone" htmlFor="pt-contact">
          <input id="pt-contact" name="contact" required className={fieldClasses} placeholder="you@company.com" />
        </Field>
        <Field label="Organization" htmlFor="pt-org">
          <input id="pt-org" name="organization" className={fieldClasses} placeholder="Company / institution" />
        </Field>
        <Field label="Product" htmlFor="pt-product">
          <select
            id="pt-product"
            name="product"
            className={fieldClasses}
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            required
          >
            <option value="" disabled>
              Select a product
            </option>
            {products.map((p) => (
              <option key={p.slug} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="What are you interested in?" htmlFor="pt-interest">
          <select id="pt-interest" name="interest" className={fieldClasses} defaultValue="">
            <option value="" disabled>
              Select an option
            </option>
            {INTERESTS.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Anything else?" htmlFor="pt-message" full>
          <textarea
            id="pt-message"
            name="message"
            rows={3}
            className={fieldClasses}
            placeholder="Team size, current setup, or questions you'd like answered on the call."
          />
        </Field>
      </div>

      {error && (
        <p className="rounded-xl border-[0.5px] border-brand-blue/30 bg-brand-blue/5 px-4 py-3 text-sm text-text-primary">
          Something went wrong booking your call. Please try again.
        </p>
      )}
      <Button type="submit" size="lg" disabled={status === "submitting"} className="w-fit">
        {status === "submitting" ? (
          <>
            <Loading01Icon className="h-4 w-4 animate-spin" /> Sending
          </>
        ) : (
          <>
            Book a Product Talk <SentIcon className="h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
  full,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", full && "sm:col-span-2")}>
      <label htmlFor={htmlFor} className={labelClasses}>
        {label}
      </label>
      {children}
    </div>
  );
}
