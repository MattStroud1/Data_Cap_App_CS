"""
Adaptive testing session management.
"""

from typing import List, Dict, Optional, Tuple
import json
from pathlib import Path
from .irt import GradedResponseModel, AdaptiveIRT


class AdaptiveSession:
    """
    Manages an adaptive testing session for a single user.
    """

    def __init__(
        self,
        item_bank_path: str,
        norms_path: str,
        se_threshold: float = 0.35,
        max_items_per_trait: int = 10,
        seed_items_per_trait: int = 1
    ):
        """
        Args:
            item_bank_path: Path to item_bank.json
            norms_path: Path to norms.json
            se_threshold: Stop asking when SE drops below this (0.35 is reasonable)
            max_items_per_trait: Maximum items to ask per trait
            seed_items_per_trait: Number of seed items to ask first
        """
        self.se_threshold = se_threshold
        self.max_items_per_trait = max_items_per_trait
        self.seed_items_per_trait = seed_items_per_trait

        # Load item bank
        with open(item_bank_path) as f:
            self.item_bank_raw = json.load(f)

        # Load norms
        with open(norms_path) as f:
            self.norms = json.load(f)

        # Organize items by attribute
        self.items_by_attribute: Dict[str, List[Dict]] = {}
        for item in self.item_bank_raw:
            attr = item["attribute_id"]
            if attr not in self.items_by_attribute:
                self.items_by_attribute[attr] = []
            self.items_by_attribute[attr].append(item)

        # Create IRT models for each item
        self.irt_models: Dict[str, GradedResponseModel] = {}
        for item in self.item_bank_raw:
            params = item["irt_params"]
            self.irt_models[item["item_id"]] = GradedResponseModel(
                a=params["a"],
                b=params["b"]
            )

        # Initialize IRT engine
        self.irt_engine = AdaptiveIRT(prior_mean=0.0, prior_sd=1.0)

        # Session state (per attribute)
        self.responses_by_attribute: Dict[str, List[Tuple[str, int]]] = {}
        self.theta_estimates: Dict[str, float] = {}
        self.se_estimates: Dict[str, float] = {}
        self.items_asked: Dict[str, List[str]] = {}

        # Init for all attributes
        for attr in self.items_by_attribute.keys():
            self.responses_by_attribute[attr] = []
            self.theta_estimates[attr] = 0.0  # Prior mean
            self.se_estimates[attr] = 1.0  # Prior SD
            self.items_asked[attr] = []

    def get_attribute_list(self) -> List[str]:
        """Get all attributes being measured."""
        return list(self.items_by_attribute.keys())

    def get_next_item(self, exclude_attributes: Optional[List[str]] = None) -> Optional[Dict]:
        """
        Select the next item to ask adaptively.

        Priority:
        1. Seed items (one per attribute if not asked yet)
        2. Attribute with highest uncertainty gap
        3. Within attribute, item with highest information

        Args:
            exclude_attributes: List of attributes to skip (e.g., already finished)

        Returns:
            Item dict, or None if all done
        """
        if exclude_attributes is None:
            exclude_attributes = []

        # Check if we need seed items
        for attr in self.items_by_attribute.keys():
            if attr in exclude_attributes:
                continue

            if len(self.items_asked[attr]) < self.seed_items_per_trait:
                # Ask seed item (first item with highest discrimination)
                available_items = [
                    item for item in self.items_by_attribute[attr]
                    if item["item_id"] not in self.items_asked[attr]
                ]
                if available_items:
                    # Pick item with highest discrimination
                    best_item = max(available_items, key=lambda x: x["irt_params"]["a"])
                    return best_item

        # Find attribute with largest uncertainty gap
        max_gap = -1
        target_attr = None

        for attr in self.items_by_attribute.keys():
            if attr in exclude_attributes:
                continue

            # Check if maxed out
            if len(self.items_asked[attr]) >= self.max_items_per_trait:
                continue

            gap = max(0, self.se_estimates[attr] - self.se_threshold)
            if gap > max_gap:
                max_gap = gap
                target_attr = attr

        if target_attr is None or max_gap <= 0:
            # All done
            return None

        # Within target_attr, select item with highest information
        available_items = [
            item for item in self.items_by_attribute[target_attr]
            if item["item_id"] not in self.items_asked[target_attr]
        ]

        if not available_items:
            return None

        # Compute information for each available item at current theta
        current_theta = self.theta_estimates[target_attr]
        best_item = None
        max_info = -1

        for item in available_items:
            model = self.irt_models[item["item_id"]]
            info = model.information(current_theta)
            if info > max_info:
                max_info = info
                best_item = item

        return best_item

    def record_response(self, item_id: str, response: int):
        """
        Record a response and update theta estimates.

        Args:
            item_id: The item ID
            response: The response value (1-5 for Likert)
        """
        # Find the item
        item = None
        for i in self.item_bank_raw:
            if i["item_id"] == item_id:
                item = i
                break

        if item is None:
            raise ValueError(f"Item {item_id} not found")

        attr = item["attribute_id"]

        # Reverse scoring if needed
        if item.get("reverse_scored", False):
            # For 5-point Likert, reverse: 1->5, 2->4, 3->3, 4->2, 5->1
            response = 6 - response

        # Store response
        self.responses_by_attribute[attr].append((item_id, response))
        self.items_asked[attr].append(item_id)

        # Build response list for EAP estimation
        responses_for_eap = []
        for item_id_r, resp in self.responses_by_attribute[attr]:
            model = self.irt_models[item_id_r]
            responses_for_eap.append((model, resp))

        # Update theta and SE using EAP
        norm = self.norms[attr]
        theta_hat, se = self.irt_engine.eap_estimate(
            responses_for_eap,
            prior_mean=norm["mean"],
            prior_sd=norm["sd"]
        )

        self.theta_estimates[attr] = theta_hat
        self.se_estimates[attr] = se

    def get_current_state(self) -> Dict:
        """Get current session state."""
        return {
            "theta_estimates": self.theta_estimates.copy(),
            "se_estimates": self.se_estimates.copy(),
            "items_asked_count": {k: len(v) for k, v in self.items_asked.items()},
            "total_items_asked": sum(len(v) for v in self.items_asked.values())
        }

    def is_attribute_done(self, attribute_id: str) -> bool:
        """Check if an attribute has reached stopping criteria."""
        return (
            self.se_estimates[attribute_id] <= self.se_threshold or
            len(self.items_asked[attribute_id]) >= self.max_items_per_trait
        )

    def is_session_done(self) -> bool:
        """Check if all attributes are done."""
        return all(self.is_attribute_done(attr) for attr in self.items_by_attribute.keys())

    def get_profile(self) -> Dict:
        """
        Generate final profile with percentiles.

        Returns:
            Dict with theta, SE, percentile for each attribute
        """
        from scipy.stats import norm as scipy_norm

        profile = {}
        for attr in self.items_by_attribute.keys():
            theta = self.theta_estimates[attr]
            se = self.se_estimates[attr]
            norm_mean = self.norms[attr]["mean"]
            norm_sd = self.norms[attr]["sd"]

            # Standardize
            z_score = (theta - norm_mean) / norm_sd

            # Percentile
            percentile = int(scipy_norm.cdf(z_score) * 100)

            profile[attr] = {
                "theta": round(theta, 3),
                "se": round(se, 3),
                "percentile": percentile,
                "items_asked": len(self.items_asked[attr])
            }

        return profile
