import type { AlertBrief } from "./contracts";

export function cloneAlertBriefDraft(brief: AlertBrief): AlertBrief {
  return {
    ...brief,
    recommended_actions: [...brief.recommended_actions],
    house_view_citations: brief.house_view_citations.map((citation) => ({
      ...citation,
    })),
  };
}

export function updateAlertBriefAction(
  draft: AlertBrief,
  index: number,
  value: string,
): AlertBrief {
  return {
    ...draft,
    recommended_actions: draft.recommended_actions.map((action, actionIndex) =>
      actionIndex === index ? value : action,
    ),
  };
}

export function hasAlertBriefDraftChanges(
  original: AlertBrief,
  draft: AlertBrief,
): boolean {
  if (original.subject !== draft.subject) {
    return true;
  }

  if (original.brief !== draft.brief) {
    return true;
  }

  if (
    original.recommended_actions.length !== draft.recommended_actions.length
  ) {
    return true;
  }

  return original.recommended_actions.some(
    (action, index) => action !== draft.recommended_actions[index],
  );
}
