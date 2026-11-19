/**
 * VisualGuard AI Constants & Configuration
 */

export const SELECTION_MODES = {
  ALL: 'all',
  SELECTED_ONLY: 'selected_only',
  ALL_EXCEPT_SELECTED: 'all_except_selected',
};

export const CONCEALMENT_STYLES = {
  BLUR: 'blur',
  PIXELATE: 'pixelate',
  SOLID_MASK: 'solid_mask',
};

export const TARGET_CATEGORIES = {
  FACES: 'faces',
  NUMBER_PLATES: 'number_plates',
  BOTH: 'both',
};

export const WORKFLOW_STEPS = {
  UPLOAD: 1,
  VALIDATE: 2,
  DETECT: 3,
  SELECT: 4,
  PROTECTION_STYLE: 5,
  PROCESS: 6,
  PREVIEW: 7,
  EXPORT: 8,
};
