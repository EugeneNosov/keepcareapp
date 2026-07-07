import type { ReactNode } from 'react';
import { LuArrowLeft, LuCheck } from 'react-icons/lu';
import { Link } from 'react-router';
import { ROUTES } from '@/app.constants.ts';
import Brand from '@/components/Brand/Brand.tsx';
import Card from '@/components/Card/Card.tsx';

type AuthPageLayoutProps = {
  children: ReactNode;
  cardSubtitle: string;
  cardTitle: string;
  description: string;
  eyebrow: string;
  note: string;
  title: string;
};

export default function AuthPageLayout({
                                         children,
                                         cardSubtitle,
                                         cardTitle,
                                         description,
                                         eyebrow,
                                         note,
                                         title,
                                       }: AuthPageLayoutProps) {
  return (
    <div className="min-h-screen bg-app px-6 max-[640px]:px-4">
      <header className="mx-auto flex h-20 w-full max-w-[1060px] items-center justify-between">
        <Brand/>
        <Link className="inline-flex items-center gap-2 text-xs text-text-muted transition-colors hover:text-text-strong"
              to={ROUTES.home}>
          <LuArrowLeft aria-hidden="true"/> Home
        </Link>
      </header>

      <main
        className="mx-auto grid min-h-[calc(100vh-80px)] w-full max-w-[1060px] grid-cols-[0.9fr_1.1fr] items-center gap-24 py-16 max-[850px]:grid-cols-1 max-[850px]:gap-12 max-[850px]:py-10">
        <section>
          <p className="mb-5 text-xs font-medium tracking-[0.08em] text-primary uppercase">{eyebrow}</p>
          <h1 className="text-[clamp(42px,6vw,68px)] leading-[1] font-medium tracking-[-0.06em] text-text-app">
            {title}
          </h1>
          <p className="mt-6 max-w-[430px] text-sm leading-7 text-text-muted">
            {description}
          </p>
          <div className="mt-8 flex items-center gap-2 text-xs text-text-subtle">
            <LuCheck className="text-success" aria-hidden="true"/>
            {note}
          </div>
        </section>

        <Card className="p-[clamp(24px,5vw,52px)]">
          <div>
            <p className="text-xs text-text-subtle">{cardSubtitle}</p>
            <h2 className="mt-2 text-2xl font-medium tracking-[-0.035em] text-text-app">{cardTitle}</h2>
          </div>

          {children}
        </Card>
      </main>
    </div>
  )
}
