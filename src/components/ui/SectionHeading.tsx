import type { ReactNode } from 'react'
import { Reveal, SplitWords } from './Reveal'

type Props = { index: string; eyebrow: string; title: string; accent?: string; children?: ReactNode; align?: 'left' | 'center' }

export function SectionHeading({ index, eyebrow, title, accent, children, align = 'left' }: Props) {
  const centered = align === 'center'
  return (
    <div className={`mb-14 sm:mb-20 ${centered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}`}>
      <Reveal y={16}>
        <p className={`eyebrow mb-5 ${centered ? 'justify-center' : ''}`}>
          <span className="text-slate-500">{index}</span>
          <span className="h-px w-10 bg-accent/50" />
          {eyebrow}
        </p>
      </Reveal>
      <h2 className="h-section">
        <SplitWords text={title} />
        {accent && (
          <>
            {' '}
            <SplitWords text={accent} className="text-gradient" delay={title.split(' ').length * 0.06} />
          </>
        )}
      </h2>
      {children && (
        <Reveal delay={0.2} y={20}>
          <p className={`mt-6 text-base leading-relaxed text-slate-400 sm:text-lg ${centered ? 'mx-auto max-w-2xl' : 'max-w-2xl'}`}>{children}</p>
        </Reveal>
      )}
    </div>
  )
}
