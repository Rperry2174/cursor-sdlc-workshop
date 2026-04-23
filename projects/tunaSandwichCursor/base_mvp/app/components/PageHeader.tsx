type Props = {
  title: string;
  subtitle?: string;
};

export function PageHeader({ title, subtitle }: Props) {
  return (
    <header className="border-b border-[color:var(--secondary)] bg-[color:var(--background)]/80">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="font-serif text-2xl tracking-[0.2em] uppercase">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-3 max-w-2xl text-sm text-neutral-700 dark:text-neutral-200">
            {subtitle}
          </p>
        ) : null}
      </div>
    </header>
  );
}

