export const TIME_TO_CONSIDER_APP_IDLE = 10000;
export const TIME_BETWEEN_IDLE_ANIMATIONS_LOW_DENSITY = 5000;
export const TIME_BETWEEN_IDLE_ANIMATIONS_MEDIUM_DENSITY = 3000;
export const TIME_BETWEEN_IDLE_ANIMATIONS_HIGH_DENSITY = 2000;
export const UNLOADED_ID = 'unloaded';

// Regex to match parameters (e.g., -S, --starred)
export const PARAMETERS_REGEX = /(?:^|\s)(-s|--starred|-t|--today|-T|--tomorrow|-w|--weekly|-m|--monthly|-y|--yearly|-d|--daily|-D|--date|-ns|--sunday|-nm|--monday|-nt|--tuesday|-nw|--wednesday|-nh|--thursday|-nf|--friday|-na|--saturday)(?=\s|$)/g;

export const DATE_PARAMETERS_REGEX = /(?:^|\s)(-D(?:\s+\d{4}-\d{2}-\d{2})?|--date(?:\s+\d{4}-\d{2}-\d{2})?)(?=\s|$)/g;

