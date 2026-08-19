import Script from "next/script";

type OrganizationLD = {
  type: "Organization";
  name: string;
  url: string;
  logo?: string;
  description?: string;
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressCountry: string;
  };
  contactPoint?: {
    telephone: string;
    contactType: string;
  };
  sameAs?: string[];
};

type CourseLD = {
  type: "Course";
  name: string;
  description: string;
  provider: { name: string; sameAs: string };
  url: string;
  educationalLevel?: string;
  isAccessibleForFree?: boolean;
};

type ArticleLD = {
  type: "Article";
  headline: string;
  description: string;
  author: { name: string; url?: string };
  publisher: { name: string; logo: { url: string } };
  datePublished: string;
  dateModified?: string;
  image?: string;
  url: string;
};

type FAQPageLD = {
  type: "FAQPage";
  mainEntity: {
    type: "Question";
    name: string;
    acceptedAnswer: {
      type: "Answer";
      text: string;
    };
  }[];
};

type BreadcrumbLD = {
  type: "BreadcrumbList";
  itemListElement: {
    position: number;
    name: string;
    item: string;
  }[];
};

type WebSiteLD = {
  type: "WebSite";
  name: string;
  url: string;
  potentialAction?: {
    type: "SearchAction";
    target: string;
    "query-input": string;
  };
};

type Schema = OrganizationLD | CourseLD | ArticleLD | FAQPageLD | BreadcrumbLD | WebSiteLD;

export function JsonLd({ schema }: { schema: Schema | Schema[] }) {
  return (
    <Script
      id="json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(Array.isArray(schema) ? schema : [schema]),
      }}
    />
  );
}

export function OrganizationJsonLd() {
  return (
    <JsonLd
      schema={{
        type: "Organization",
        name: "KodeDristi Software Pvt. Ltd.",
        url: "https://official-kd.vercel.app",
        logo: "https://official-kd.vercel.app/og-default.png",
        description:
          "Software delivery, AI automation, and applied IT courses in Kathmandu, Nepal.",
        address: {
          streetAddress: "Kathmandu",
          addressLocality: "Kathmandu",
          addressCountry: "NP",
        },
        contactPoint: {
          telephone: "+977-9842863398",
          contactType: "customer service",
        },
        sameAs: [],
      }}
    />
  );
}

export function CourseJsonLd({
  name,
  description,
  url,
  level,
}: {
  name: string;
  description: string;
  url: string;
  level?: string;
}) {
  return (
    <JsonLd
      schema={{
        type: "Course",
        name,
        description,
        provider: {
          name: "KodeDristi Software",
          sameAs: "https://official-kd.vercel.app",
        },
        url,
        educationalLevel: level || "Intermediate",
        isAccessibleForFree: false,
      }}
    />
  );
}

export function ArticleJsonLd({
  title,
  description,
  author,
  datePublished,
  dateModified,
  image,
  url,
}: {
  title: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  url: string;
}) {
  return (
    <JsonLd
      schema={{
        type: "Article",
        headline: title,
        description,
        author: { name: author },
        publisher: {
          name: "KodeDristi Software",
          logo: { url: "https://official-kd.vercel.app/og-default.png" },
        },
        datePublished,
        dateModified: dateModified || datePublished,
        image: image || "https://official-kd.vercel.app/og-default.png",
        url,
      }}
    />
  );
}

export function FAQJsonLd({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  return (
    <JsonLd
      schema={{
        type: "FAQPage",
        mainEntity: items.map((item) => ({
          type: "Question" as const,
          name: item.question,
          acceptedAnswer: {
            type: "Answer" as const,
            text: item.answer,
          },
        })),
      }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  return (
    <JsonLd
      schema={{
        type: "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
          position: i + 1,
          name: item.name,
          item: item.url,
        })),
      }}
    />
  );
}

export function WebSiteJsonLd() {
  return (
    <JsonLd
      schema={{
        type: "WebSite",
        name: "KodeDristi Software",
        url: "https://official-kd.vercel.app",
        potentialAction: {
          type: "SearchAction",
          target: "https://official-kd.vercel.app/insights?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      }}
    />
  );
}
