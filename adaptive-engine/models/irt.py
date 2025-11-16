"""
Item Response Theory (IRT) algorithms for adaptive testing.
Uses 2-parameter logistic (2PL) graded response model for Likert items.
"""

import numpy as np
from scipy.stats import norm
from scipy.optimize import minimize_scalar
from typing import List, Tuple, Dict


class GradedResponseModel:
    """
    Graded Response Model (GRM) for polytomous items (e.g., Likert 1-5).

    For an item with K response categories, we model K-1 cumulative probabilities.
    P*(theta) = probability of scoring in category k or higher.

    P*(theta) = 1 / (1 + exp(-a*(theta - b_k)))

    where:
    - a = discrimination parameter (how well item separates high/low theta)
    - b_k = difficulty/threshold for category k
    - theta = latent trait level
    """

    def __init__(self, a: float, b: List[float]):
        """
        Args:
            a: Discrimination parameter (typically 0.5 to 2.5)
            b: Threshold parameters, length = K-1 where K is number of categories
               For 5-point Likert: 4 thresholds
        """
        self.a = a
        self.b = np.array(b)
        self.n_categories = len(b) + 1

    def cumulative_prob(self, theta: float, k: int) -> float:
        """Probability of scoring in category k or higher."""
        if k >= self.n_categories:
            return 0.0
        if k <= 0:
            return 1.0
        return 1.0 / (1.0 + np.exp(-self.a * (theta - self.b[k - 1])))

    def category_prob(self, theta: float, k: int) -> float:
        """Probability of scoring exactly in category k (1-indexed)."""
        p_k_or_higher = self.cumulative_prob(theta, k)
        p_k_plus_1_or_higher = self.cumulative_prob(theta, k + 1)
        return p_k_or_higher - p_k_plus_1_or_higher

    def response_prob(self, theta: float, response: int) -> float:
        """Probability of a specific response (1 to K)."""
        return self.category_prob(theta, response)

    def information(self, theta: float) -> float:
        """
        Fisher information at theta.
        I(theta) = sum over categories of: [P'(theta)]^2 / P(theta)

        For practical use, we approximate using numerical derivatives.
        """
        delta = 0.01
        info = 0.0

        for k in range(1, self.n_categories + 1):
            p = self.category_prob(theta, k)
            if p > 1e-10:  # Avoid division by zero
                # Numerical derivative
                p_plus = self.category_prob(theta + delta, k)
                p_minus = self.category_prob(theta - delta, k)
                p_prime = (p_plus - p_minus) / (2 * delta)
                info += (p_prime ** 2) / p

        return info


class AdaptiveIRT:
    """Adaptive testing engine using IRT."""

    def __init__(self, prior_mean: float = 0.0, prior_sd: float = 1.0):
        """
        Args:
            prior_mean: Prior mean for theta (standardized: 0)
            prior_sd: Prior SD for theta (standardized: 1)
        """
        self.prior_mean = prior_mean
        self.prior_sd = prior_sd
        self.theta_grid = np.linspace(-4, 4, 200)  # Grid for numerical integration

    def eap_estimate(
        self,
        responses: List[Tuple[GradedResponseModel, int]],
        prior_mean: float = None,
        prior_sd: float = None
    ) -> Tuple[float, float]:
        """
        Expected A Posteriori (EAP) estimation of theta and its standard error.

        Args:
            responses: List of (item_model, response) tuples
            prior_mean: Override prior mean
            prior_sd: Override prior SD

        Returns:
            (theta_hat, se): EAP estimate and posterior standard error
        """
        if prior_mean is None:
            prior_mean = self.prior_mean
        if prior_sd is None:
            prior_sd = self.prior_sd

        # Prior distribution
        prior = norm.pdf(self.theta_grid, prior_mean, prior_sd)

        # Likelihood given responses
        likelihood = np.ones_like(self.theta_grid)
        for item_model, response in responses:
            for i, theta in enumerate(self.theta_grid):
                likelihood[i] *= item_model.response_prob(theta, response)

        # Posterior = likelihood * prior
        posterior = likelihood * prior
        posterior /= np.trapz(posterior, self.theta_grid)  # Normalize

        # EAP estimate (mean of posterior)
        theta_hat = np.trapz(self.theta_grid * posterior, self.theta_grid)

        # Posterior variance
        posterior_var = np.trapz((self.theta_grid - theta_hat) ** 2 * posterior, self.theta_grid)
        se = np.sqrt(posterior_var)

        return theta_hat, se

    def select_next_item(
        self,
        available_items: List[GradedResponseModel],
        current_theta: float,
        already_asked_indices: List[int]
    ) -> int:
        """
        Select the next item to maximize information at current theta estimate.

        Args:
            available_items: List of all item models
            current_theta: Current theta estimate
            already_asked_indices: Indices of items already asked

        Returns:
            Index of the next item to ask
        """
        max_info = -1
        best_idx = None

        for idx, item in enumerate(available_items):
            if idx in already_asked_indices:
                continue

            info = item.information(current_theta)
            if info > max_info:
                max_info = info
                best_idx = idx

        return best_idx if best_idx is not None else 0


def create_synthetic_item(
    mean_discrimination: float = 1.5,
    difficulty_range: Tuple[float, float] = (-2, 2),
    n_categories: int = 5
) -> GradedResponseModel:
    """
    Create a synthetic item with plausible IRT parameters.

    Args:
        mean_discrimination: Mean discrimination (typical: 1.0-2.0)
        difficulty_range: Range for threshold parameters
        n_categories: Number of response categories (e.g., 5 for Likert 1-5)

    Returns:
        GradedResponseModel instance
    """
    # Discrimination from a reasonable distribution
    a = np.random.gamma(4, mean_discrimination / 4)  # Gamma dist, mean ~1.5
    a = np.clip(a, 0.5, 3.0)

    # Thresholds: sorted difficulties across the trait continuum
    b = np.sort(np.random.uniform(difficulty_range[0], difficulty_range[1], n_categories - 1))

    return GradedResponseModel(a, b.tolist())
