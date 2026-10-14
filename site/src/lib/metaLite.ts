import { GROUP_NAMES, RELIEF_META, type ReliefGroup } from '../data/reliefMeta';
import type { MetaLite } from '../components/islands/TaxCalc';
import type { Lang } from './tax/types';

export function metaLite(lang: Lang, filter: (id: string) => boolean = () => true): MetaLite[] {
  return RELIEF_META.filter((m) => filter(m.id)).map((m) => ({
    id: m.id,
    group: m.group,
    name: m.name[lang],
    short: m.short[lang],
    slug: m.slug,
  }));
}

export function groupsLite(lang: Lang) {
  return (Object.keys(GROUP_NAMES) as ReliefGroup[]).map((id) => ({ id, name: GROUP_NAMES[id][lang] }));
}
