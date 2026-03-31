import Image from "next/image";
import { PageHeader } from "../components/PageHeader";

export default function AboutPage() {
  return (
    <div className="bg-[color:var(--background)]">
      <PageHeader
        title="About"
        subtitle="A short introduction to the artist and the work."
      />
      <section>
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:items-start">
            <div className="space-y-4 text-sm text-neutral-800 dark:text-neutral-100">
              <p>
                This gallery gathers together photographs, drawings, paintings,
                and mixed media pieces made over many years. It is meant to feel
                like a small, quiet room where each work has space to breathe.
              </p>
              <p>
                The work leans toward everyday subjects: winter light in the
                kitchen, a field at the edge of town, the curve of a shoulder.
                The hope is that, taken together, they suggest a way of looking
                at the world that is attentive and unhurried.
              </p>
              <p>
                For now, this site is a simple place to walk through the work
                and, if something stays with you, to reach out about living with
                it in your own space.
              </p>
            </div>
            <div className="flex flex-col items-start gap-4">
              <div className="relative h-64 w-full overflow-hidden rounded-md border border-[color:var(--secondary)] bg-[color:var(--secondary)]/40 sm:h-80">
                <Image
                  src="/images/artist.svg"
                  alt="Portrait of the artist in the studio."
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-xs text-neutral-600 dark:text-neutral-300">
                <p className="font-medium uppercase tracking-wide">
                  Artist&apos;s note
                </p>
                <p className="mt-2">
                  “I think of these pieces as a way of paying attention — to
                  light, to gesture, to the small corners of a day that might
                  otherwise slip past.”
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

