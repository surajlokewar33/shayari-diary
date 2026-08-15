/**
 * Reusable JSON-LD structured data component.
 * Renders a <script type="application/ld+json"> tag with Schema.org data.
 */

interface JsonLdProps {
  data: Record<string, unknown>;
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** WebSite schema for the homepage */
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'मुरीद शाइर',
    alternateName: 'Mureed Shayar',
    url: 'https://suraurshayari.vercel.app',
    description:
      'मुरीद शाइर — हर शब्द एक एहसास, हर शेर एक कहानी। उर्दू शायरी, हिंदी कविताएँ, मराठी कविता, ग़ज़लें और नज़्में।',
    inLanguage: 'hi',
    author: personSchema(),
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://suraurshayari.vercel.app/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };
}

/** Person schema for the poet */
export function personSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'सुरज लोकेवार',
    alternateName: 'मुरीद शाइर',
    url: 'https://suraurshayari.vercel.app/contact',
    sameAs: [
      'https://www.instagram.com/suru33_',
      'https://youtube.com/channel/UCIxErmM7nod9bM4cB0VhVBw?si=6a_SAL5iV9d87vNz',
    ],
  };
}

/** Article/CreativeWork schema for individual poems */
export function poemSchema(poem: {
  title: string;
  body: string;
  slug: string;
  author?: string;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: poem.title,
    articleBody: poem.body,
    author: personSchema(),
    url: `https://suraurshayari.vercel.app/poems/${poem.slug}`,
    datePublished: poem.createdAt,
    dateModified: poem.updatedAt || poem.createdAt,
    inLanguage: 'hi',
    genre: poem.category,
    publisher: {
      '@type': 'Organization',
      name: 'मुरीद शाइर',
      url: 'https://suraurshayari.vercel.app',
    },
  };
}
