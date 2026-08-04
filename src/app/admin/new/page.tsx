import PoemForm from '@/components/PoemForm';

export default function NewPoemPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 md:px-8 py-16">
      <h1 className="font-display text-3xl text-accent-bright mb-8">Write a new poem</h1>
      <PoemForm />
    </section>
  );
}
