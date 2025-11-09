import Link from "next/link";
import Image from "next/image";
import ContactForm from "@/components/ContactForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-6xl px-6">
        {/* Hero */}
        <section className="py-20">
          <div className="grid gap-6 md:grid-cols-2 md:items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-brand to-brand-dark bg-clip-text text-transparent">
                Comunidad tech en Misiones: conectar, crear y crecer.
              </h1>
              <p className="mt-2 text-sm uppercase tracking-widest text-muted">Tecnología, experiencia y sinergia</p>
              <p className="mt-4 text-lg text-muted">
                Apasionados por la tecnología, la innovación y las startups. Compartimos experiencias, organizamos encuentros y abrimos oportunidades reales para todos.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="#contacto"
                  className="rounded-full bg-brand text-brand-foreground px-5 py-2 text-sm font-medium shadow-sm hover:brightness-110"
                >
                  Unite a la comunidad
                </Link>
                <Link
                  href="#proyectos"
                  className="rounded-full border border-brand px-5 py-2 text-sm font-medium hover:bg-brand/10"
                >
                  Ver proyectos
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-end">
        <Image src="/assets/logo.jpg" alt="Networking Misiones" width={220} height={220} priority className="rounded-xl" />
            </div>
          </div>
        </section>

        {/* Misión */}
        <section id="mision" className="py-12">
          <h2 className="text-2xl font-semibold">Nuestra misión</h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">
            Unir a la comunidad tecnológica de Misiones para compartir conocimientos, potenciar talentos y crear oportunidades que funcionen como verdaderas escaleras de crecimiento.
          </p>
        </section>

        {/* Visión */}
        <section id="vision" className="py-12">
          <h2 className="text-2xl font-semibold">Nuestra visión</h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">
            Convertir a Misiones en un referente regional de innovación, con una red colaborativa que impulse proyectos de alto impacto y acceso a financiamiento.
          </p>
        </section>

        {/* Contacto */}
        <section id="contacto" className="py-16">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold">Contacto</h2>
              <p className="mt-3 text-zinc-600 dark:text-zinc-400">
                ¿Querés sumarte, colaborar o contarnos tu idea? Escribinos y te respondemos a la brevedad.
              </p>
              <ul className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
                <li>• Reuniones periódicas y networking.</li>
                <li>• Mentoreo y difusión de proyectos.</li>
                <li>• Próximamente: registro y tablero de comunidad.</li>
              </ul>
            </div>
            <div>
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-black/10 dark:border-white/15">
        <div className="mx-auto max-w-6xl px-6 py-6 text-sm text-zinc-600 dark:text-zinc-400">
          © {new Date().getFullYear()} Networking Misiones — Comunidad de tecnología en Misiones, Argentina
        </div>
      </footer>
    </div>
  );
}
