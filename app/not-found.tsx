import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-5 py-24 text-center">
      <p className="font-heading text-[7rem] font-black leading-none tracking-tighter text-text-muted opacity-20">
        404
      </p>
      <h1 className="mt-4 font-heading text-3xl font-bold text-text-primary">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-text-muted">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-brand-blue px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-blue-hover"
      >
        Back to home
      </Link>
    </section>
  );
}
