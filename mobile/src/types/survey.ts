// Phase 1 Survey Types

// Demographic Enums
export type AgeBand = '16-24' | '25-34' | '35-44' | '45-54' | '55-64' | '65+';

export type GenderIdentity = 'woman' | 'man' | 'non-binary' | 'self-describe' | 'prefer-not-to-say';

export type CurrentSituation =
  | 'at-school'
  | 'at-university'
  | 'working-full-time'
  | 'working-part-time'
  | 'shift-work'
  | 'home-family'
  | 'retired'
  | 'other';

export type HouseholdType =
  | 'alone'
  | 'with-partner'
  | 'with-partner-and-children'
  | 'with-children-no-partner'
  | 'with-housemates'
  | 'with-parents-family'
  | 'other';

export type ChildrenAge = 'none' | 'under-5' | '5-12' | '13-18';

export type TransportMode =
  | 'walk'
  | 'cycle'
  | 'e-scooter'
  | 'bus'
  | 'metro'
  | 'train'
  | 'car-driver'
  | 'car-passenger'
  | 'ride-hailing'
  | 'other';

export type TravelTime = '0-10' | '10-20' | '20-35' | '35-50' | '50+';

export type BudgetBand = 0 | 1 | 2 | 3 | 4; // 0=free, 1=£, 2=££, 3=£££, 4=££££

// Activity Preference Enums
export type InterestDomain =
  | 'live-music'
  | 'nightlife-bars'
  | 'cafes'
  | 'theatre-dance-performance'
  | 'museums-galleries'
  | 'sports-watch'
  | 'sports-play'
  | 'outdoor-nature'
  | 'gaming-esports-boardgames'
  | 'learning-talks-classes'
  | 'volunteering-community'
  | 'faith-spiritual'
  | 'activism-causes'
  | 'making-diy-craft-tech'
  | 'food-drink'
  | 'other';

export type ABChoice = 'A' | 'B';

export type LikertScore = 1 | 2 | 3 | 4 | 5;

// Social Style Enums
export type GroupSize = 'solo' | 'small-2-3' | 'medium-4-8' | 'large-crowd';

export type IdentityCluster =
  | 'live-music-crowd'
  | 'nightlife-people'
  | 'sporty-fitness'
  | 'gamers-geeks'
  | 'bookish-artsy'
  | 'makers-diy-hackers'
  | 'faith-community'
  | 'activists-social-causes'
  | 'parenting-family'
  | 'none-fit'
  | 'other';

// Choice Experiment Types
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export type CrowdSize = 'small' | 'medium' | 'large';

export type NoiseLevel = 'low' | 'medium' | 'high';

export interface EventOption {
  option_id: string;
  title: string;
  distance_minutes: number;
  travel_mode: TransportMode;
  price_band: BudgetBand;
  day: DayOfWeek;
  time: string;
  crowd_size: CrowdSize;
  noise_level: NoiseLevel;
}

export interface ChoiceExperiment {
  choice_id: number;
  options_presented: EventOption[];
  selected_most_appealing?: string;
  selected_least_appealing?: string;
}

// Main Data Structures
export interface Demographics {
  age_band?: AgeBand;
  gender_identity?: GenderIdentity;
  gender_self_describe?: string;
  current_situation?: CurrentSituation;
  household_type?: HouseholdType;
  children_in_household?: ChildrenAge[];
  home_area?: string;
  transport_modes?: TransportMode[];
  willing_travel_time?: TravelTime;
  typical_budget_band?: BudgetBand;
}

export interface TimeSlot {
  morning: boolean;
  afternoon: boolean;
  evening: boolean;
}

export interface TimeAvailability {
  monday: TimeSlot;
  tuesday: TimeSlot;
  wednesday: TimeSlot;
  thursday: TimeSlot;
  friday: TimeSlot;
  saturday: TimeSlot;
  sunday: TimeSlot;
}

export interface ActivityPreferences {
  interest_domains?: InterestDomain[];
  interest_other?: string;
  novelty_q1?: ABChoice;
  novelty_q2?: ABChoice;
  structure_like_regular?: LikertScore;
  structure_prefer_dropin?: LikertScore;
  noise_enjoy_loud_busy?: LikertScore;
  noise_prefer_calm_quiet?: LikertScore;
  goal_relax_switch_off?: LikertScore;
  goal_learn_stretch?: LikertScore;
  goal_feel_connected?: LikertScore;
  goal_do_things_good_at?: LikertScore;
  goal_meaningful_difference?: LikertScore;
}

export interface SocialStyle {
  preferred_group_size?: GroupSize[];
  enjoy_more_with_others?: LikertScore;
  alone_as_good_as_together?: LikertScore;
  want_others_accept_me?: LikertScore;
  dont_like_alone_long?: LikertScore;
  happy_with_group_i_know?: LikertScore;
  identity_clusters?: IdentityCluster[];
  identity_other?: string;
}

export interface SurveyResponse {
  user_id?: string;
  session_id?: string;
  completed_at?: string;
  version: string;
  demographics: Demographics;
  time_availability: TimeAvailability;
  activity_preferences: ActivityPreferences;
  social_style: SocialStyle;
  choice_experiments: ChoiceExperiment[];
}
