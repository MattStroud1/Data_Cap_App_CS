/**
 * Adaptive Testing Engine API Client
 * Connects mobile app to the FastAPI adaptive testing service
 */

// Change to your adaptive engine URL
const ADAPTIVE_API_BASE_URL = __DEV__
  ? 'http://localhost:4000'  // Update with your computer's IP for physical devices
  : 'https://your-adaptive-engine-url.com';

export interface AdaptiveSessionConfig {
  se_threshold?: number;
  max_items_per_trait?: number;
}

export interface AdaptiveItem {
  item_id: string;
  attribute_id: string;
  domain: string;
  text: string;
  response_scale: string;
  response_options: string[];
  reverse_scored: boolean;
  irt_params: {
    a: number;
    b: number[];
  };
  source: string;
}

export interface ProgressInfo {
  items_asked: number;
  current_se: number;
  target_se: number;
  is_done: boolean;
}

export interface NextItemResponse {
  item: AdaptiveItem | null;
  is_done: boolean;
  progress: Record<string, ProgressInfo>;
}

export interface ProfileAttribute {
  theta: number;
  se: number;
  percentile: number;
  items_asked: number;
}

export interface ProfileResponse {
  profile: Record<string, ProfileAttribute>;
  narrative: string;
}

/**
 * Start a new adaptive testing session
 */
export const startAdaptiveSession = async (
  config: AdaptiveSessionConfig = {}
): Promise<{ session_id: string; attributes: string[] }> => {
  const response = await fetch(`${ADAPTIVE_API_BASE_URL}/session/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      se_threshold: config.se_threshold || 0.35,
      max_items_per_trait: config.max_items_per_trait || 10,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to start session: ${response.status}`);
  }

  return await response.json();
};

/**
 * Get the next question to ask
 */
export const getNextItem = async (sessionId: string): Promise<NextItemResponse> => {
  const response = await fetch(`${ADAPTIVE_API_BASE_URL}/session/${sessionId}/next`);

  if (!response.ok) {
    throw new Error(`Failed to get next item: ${response.status}`);
  }

  return await response.json();
};

/**
 * Record a response to an item
 */
export const recordResponse = async (
  sessionId: string,
  itemId: string,
  response: number
): Promise<{ success: boolean; updated_estimates: any }> => {
  const res = await fetch(`${ADAPTIVE_API_BASE_URL}/session/respond`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      session_id: sessionId,
      item_id: itemId,
      response,
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed to record response: ${res.status}`);
  }

  return await res.json();
};

/**
 * Get the final profile with percentiles and narrative
 */
export const getProfile = async (sessionId: string): Promise<ProfileResponse> => {
  const response = await fetch(`${ADAPTIVE_API_BASE_URL}/session/${sessionId}/profile`);

  if (!response.ok) {
    throw new Error(`Failed to get profile: ${response.status}`);
  }

  return await response.json();
};

/**
 * Get current session state (for debugging)
 */
export const getSessionState = async (sessionId: string): Promise<any> => {
  const response = await fetch(`${ADAPTIVE_API_BASE_URL}/session/${sessionId}/state`);

  if (!response.ok) {
    throw new Error(`Failed to get session state: ${response.status}`);
  }

  return await response.json();
};
