import React from 'react';

export interface FactGroup {
  title: string;
  items: { label: string; value: string }[];
}

interface Props {
  groups: FactGroup[];
}

// Zillow-style "Facts & features" block: a heading per category, each a
// 2-column label/value grid. Populated only from facts Kyle has actually
// confirmed (frontmatter), never invented MLS-style attributes for a
// listing that isn't in MLS yet.
export const FactsAndFeatures: React.FC<Props> = ({ groups }) => {
  if (groups.length === 0) return null;
  return (
    <div className="mb-10">
      <h2 className="font-serif text-2xl font-bold text-[#0D2226] mb-6">Facts &amp; Features</h2>
      <div className="space-y-6">
        {groups.map((group) => (
          <div key={group.title} className="border-t border-[#0D2226]/10 pt-5">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#0F5C63] mb-3">{group.title}</p>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
              {group.items.map((item, i) => (
                <div key={`${item.label}-${i}`} className="flex justify-between sm:justify-start gap-4 text-[15px]">
                  <dt className="text-[#1C2B2E]/60">{item.label}</dt>
                  <dd className="font-semibold text-[#0D2226] text-right sm:text-left">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
};
