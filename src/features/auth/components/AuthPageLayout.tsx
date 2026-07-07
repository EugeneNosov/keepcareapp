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
    <div className="min-h-screen bg-[#080909] px-6 max-[640px]:px-4">
      <header className="mx-auto flex h-20 w-full max-w-[1060px] items-center justify-between">
        <Brand/>
        <Link className="inline-flex items-center gap-2 text-xs text-[#8f948e] transition-colors hover:text-white"
              to={ROUTES.home}>
          <LuArrowLeft aria-hidden="true"/> Home
        </Link>
      </header>

      <main
        className="mx-auto grid min-h-[calc(100vh-80px)] w-full max-w-[1060px] grid-cols-[0.9fr_1.1fr] items-center gap-24 py-16 max-[850px]:grid-cols-1 max-[850px]:gap-12 max-[850px]:py-10">
        <section>
          <p className="mb-5 text-xs font-medium tracking-[0.08em] text-[#f0783c] uppercase">{eyebrow}</p>
          <h1 className="text-[clamp(42px,6vw,68px)] leading-[1] font-medium tracking-[-0.06em] text-[#eeeeea]">
            {title}
          </h1>
          <p className="mt-6 max-w-[430px] text-sm leading-7 text-[#8f948e]">
            {description}
          </p>
          <div className="mt-8 flex items-center gap-2 text-xs text-[#737873]">
            <LuCheck className="text-[#65c99b]" aria-hidden="true"/>
            {note}
          </div>
        </section>

        <Card className="p-[clamp(24px,5vw,52px)]">
          <div>
            <p className="text-xs text-[#777c76]">{cardSubtitle}</p>
            <h2 className="mt-2 text-2xl font-medium tracking-[-0.035em] text-[#e8e9e3]">{cardTitle}</h2>
          </div>

          {children}
        </Card>
      </main>
    </div>
  )
}
