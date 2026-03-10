export type ResearchUsageItem = {
  doc: string;
  score: number;
};

export function dedupeResearchUsage(items: ResearchUsageItem[]): ResearchUsageItem[] {
  const byDoc = new Map<string, ResearchUsageItem>();

  for (const item of items) {
    const existing = byDoc.get(item.doc);
    if (!existing || item.score > existing.score) {
      byDoc.set(item.doc, item);
    }
  }

  return Array.from(byDoc.values());
}
