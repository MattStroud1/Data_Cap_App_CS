"""
Generate synthetic item bank with IRT parameters for all scales.
Based on validated psychometric instruments.
"""

import json
import numpy as np
from typing import List, Dict

# Set seed for reproducibility
np.random.seed(42)


def generate_bfi2s_items() -> List[Dict]:
    """
    Generate BFI-2-S (Short Big Five Inventory-2) items.
    30 items total: 6 per trait (Extraversion, Agreeableness, Conscientiousness, Neuroticism, Openness)

    Based on Soto & John (2017).
    """
    items = []

    # Extraversion items
    extraversion_items = [
        "I see myself as someone who is outgoing, sociable.",
        "I see myself as someone who is dominant, acts as a leader.",
        "I see myself as someone who is energetic, full of energy.",
        "I see myself as someone who is reserved, quiet.", # reverse
        "I see myself as someone who is less active than other people.", # reverse
        "I see myself as someone who prefers to have others take charge.", # reverse
    ]

    for idx, text in enumerate(extraversion_items):
        is_reverse = idx >= 3
        a = np.random.uniform(1.2, 2.0)  # High discrimination for Big Five
        b = sorted(np.random.uniform(-2.5, 2.5, 4))

        items.append({
            "item_id": f"BFI2S_E{idx+1}",
            "attribute_id": "big5_extraversion",
            "domain": "BigFive",
            "text": text,
            "response_scale": "Likert5",
            "response_options": ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"],
            "reverse_scored": is_reverse,
            "irt_params": {"a": round(a, 3), "b": [round(x, 3) for x in b]},
            "source": "BFI-2-S (Soto & John, 2017)"
        })

    # Agreeableness items
    agreeableness_items = [
        "I see myself as someone who is compassionate, has a soft heart.",
        "I see myself as someone who is respectful, treats others with respect.",
        "I see myself as someone who is trusting, assumes the best about people.",
        "I see myself as someone who is critical, tends to find fault with others.", # reverse
        "I see myself as someone who is cold, uncaring.", # reverse
        "I see myself as someone who is suspicious of others' intentions.", # reverse
    ]

    for idx, text in enumerate(agreeableness_items):
        is_reverse = idx >= 3
        a = np.random.uniform(1.2, 2.0)
        b = sorted(np.random.uniform(-2.5, 2.5, 4))

        items.append({
            "item_id": f"BFI2S_A{idx+1}",
            "attribute_id": "big5_agreeableness",
            "domain": "BigFive",
            "text": text,
            "response_scale": "Likert5",
            "response_options": ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"],
            "reverse_scored": is_reverse,
            "irt_params": {"a": round(a, 3), "b": [round(x, 3) for x in b]},
            "source": "BFI-2-S (Soto & John, 2017)"
        })

    # Conscientiousness items
    conscientiousness_items = [
        "I see myself as someone who is organized, orderly.",
        "I see myself as someone who is reliable, can always be counted on.",
        "I see myself as someone who is persistent, works until the task is finished.",
        "I see myself as someone who is messy, tends to be disorganized.", # reverse
        "I see myself as someone who is inefficient, wastes time.", # reverse
        "I see myself as someone who is lazy, lacks ambition.", # reverse
    ]

    for idx, text in enumerate(conscientiousness_items):
        is_reverse = idx >= 3
        a = np.random.uniform(1.3, 2.1)
        b = sorted(np.random.uniform(-2.5, 2.5, 4))

        items.append({
            "item_id": f"BFI2S_C{idx+1}",
            "attribute_id": "big5_conscientiousness",
            "domain": "BigFive",
            "text": text,
            "response_scale": "Likert5",
            "response_options": ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"],
            "reverse_scored": is_reverse,
            "irt_params": {"a": round(a, 3), "b": [round(x, 3) for x in b]},
            "source": "BFI-2-S (Soto & John, 2017)"
        })

    # Neuroticism items
    neuroticism_items = [
        "I see myself as someone who is anxious, tends to worry.",
        "I see myself as someone who is emotionally unstable, moody.",
        "I see myself as someone who is tense, high-strung.",
        "I see myself as someone who is relaxed, handles stress well.", # reverse
        "I see myself as someone who is emotionally stable, not easily upset.", # reverse
        "I see myself as someone who stays calm in tense situations.", # reverse
    ]

    for idx, text in enumerate(neuroticism_items):
        is_reverse = idx >= 3
        a = np.random.uniform(1.4, 2.2)
        b = sorted(np.random.uniform(-2.5, 2.5, 4))

        items.append({
            "item_id": f"BFI2S_N{idx+1}",
            "attribute_id": "big5_neuroticism",
            "domain": "BigFive",
            "text": text,
            "response_scale": "Likert5",
            "response_options": ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"],
            "reverse_scored": is_reverse,
            "irt_params": {"a": round(a, 3), "b": [round(x, 3) for x in b]},
            "source": "BFI-2-S (Soto & John, 2017)"
        })

    # Openness items
    openness_items = [
        "I see myself as someone who is curious about many different things.",
        "I see myself as someone who is inventive, finds clever ways to do things.",
        "I see myself as someone who values art and beauty.",
        "I see myself as someone who has few artistic or creative interests.", # reverse
        "I see myself as someone who is conventional, uncreative.", # reverse
        "I see myself as someone who avoids intellectual or philosophical discussions.", # reverse
    ]

    for idx, text in enumerate(openness_items):
        is_reverse = idx >= 3
        a = np.random.uniform(1.3, 2.0)
        b = sorted(np.random.uniform(-2.5, 2.5, 4))

        items.append({
            "item_id": f"BFI2S_O{idx+1}",
            "attribute_id": "big5_openness",
            "domain": "BigFive",
            "text": text,
            "response_scale": "Likert5",
            "response_options": ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"],
            "reverse_scored": is_reverse,
            "irt_params": {"a": round(a, 3), "b": [round(x, 3) for x in b]},
            "source": "BFI-2-S (Soto & John, 2017)"
        })

    return items


def generate_need_to_belong_items() -> List[Dict]:
    """
    Generate Need to Belong Scale items.
    Based on Leary et al. (2013).
    """
    items = []

    ntb_items = [
        "I want other people to accept me.",
        "I do not like being alone for long periods of time.",
        "I feel happy when I am with a group of people I know well.",
        "I need to feel that there are people I can turn to in times of need.",
        "I have a strong need to belong.",
        "I seldom worry about whether other people care about me.", # reverse
    ]

    for idx, text in enumerate(ntb_items):
        is_reverse = idx == 5
        a = np.random.uniform(1.4, 2.3)  # High discrimination
        b = sorted(np.random.uniform(-2.0, 2.0, 4))

        items.append({
            "item_id": f"NTB_{idx+1}",
            "attribute_id": "need_to_belong",
            "domain": "SocialOrientation",
            "text": text,
            "response_scale": "Likert5",
            "response_options": ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"],
            "reverse_scored": is_reverse,
            "irt_params": {"a": round(a, 3), "b": [round(x, 3) for x in b]},
            "source": "Need to Belong Scale (Leary et al., 2013)"
        })

    return items


def generate_sensation_seeking_items() -> List[Dict]:
    """
    Generate Sensation Seeking items.
    Simplified from Zuckerman SSS and Arnett AISS.
    """
    items = []

    ss_items = [
        "I would like to try activities that feel intense or exciting.",
        "I like to do frightening things.",
        "I prefer friends who are exciting and unpredictable.",
        "I would like to try bungee jumping or skydiving.",
        "I avoid activities that feel risky or out of my comfort zone.", # reverse
        "I prefer a safe and predictable routine.", # reverse
    ]

    for idx, text in enumerate(ss_items):
        is_reverse = idx >= 4
        a = np.random.uniform(1.5, 2.5)
        b = sorted(np.random.uniform(-2.0, 2.0, 4))

        items.append({
            "item_id": f"SS_{idx+1}",
            "attribute_id": "sensation_seeking",
            "domain": "SensationSeeking",
            "text": text,
            "response_scale": "Likert5",
            "response_options": ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"],
            "reverse_scored": is_reverse,
            "irt_params": {"a": round(a, 3), "b": [round(x, 3) for x in b]},
            "source": "Adapted from Zuckerman SSS / Arnett AISS"
        })

    return items


def generate_city_preference_items() -> List[Dict]:
    """
    Generate city-specific preference items (novelty, structure, noise, goals).
    """
    items = []

    # Novelty seeking in city context
    novelty_items = [
        "I love trying new places and events in the city, even if I'm not sure I'll like them.",
        "I'm usually up for something different each week.",
        "I get bored going to the same places repeatedly.",
    ]

    for idx, text in enumerate(novelty_items):
        a = np.random.uniform(1.3, 2.0)
        b = sorted(np.random.uniform(-2.0, 2.0, 4))

        items.append({
            "item_id": f"CITY_NOV_{idx+1}",
            "attribute_id": "activity_novelty",
            "domain": "CityPreferences",
            "text": text,
            "response_scale": "Likert5",
            "response_options": ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"],
            "reverse_scored": False,
            "irt_params": {"a": round(a, 3), "b": [round(x, 3) for x in b]},
            "source": "Custom - City Engagement"
        })

    # Structure preference
    structure_items = [
        "I like signing up for a class, league or group and going every week.",
        "I prefer drop-in things where I can decide on the day.",
    ]

    for idx, text in enumerate(structure_items):
        is_reverse = idx == 1
        a = np.random.uniform(1.2, 1.9)
        b = sorted(np.random.uniform(-2.0, 2.0, 4))

        items.append({
            "item_id": f"CITY_STRUCT_{idx+1}",
            "attribute_id": "structure_preference",
            "domain": "CityPreferences",
            "text": text,
            "response_scale": "Likert5",
            "response_options": ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"],
            "reverse_scored": is_reverse,
            "irt_params": {"a": round(a, 3), "b": [round(x, 3) for x in b]},
            "source": "Custom - City Engagement"
        })

    # Noise tolerance
    noise_items = [
        "I enjoy loud, busy places with lots going on.",
        "I prefer calm, quiet spaces.",
    ]

    for idx, text in enumerate(noise_items):
        is_reverse = idx == 1
        a = np.random.uniform(1.3, 2.1)
        b = sorted(np.random.uniform(-2.0, 2.0, 4))

        items.append({
            "item_id": f"CITY_NOISE_{idx+1}",
            "attribute_id": "noise_tolerance",
            "domain": "CityPreferences",
            "text": text,
            "response_scale": "Likert5",
            "response_options": ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"],
            "reverse_scored": is_reverse,
            "irt_params": {"a": round(a, 3), "b": [round(x, 3) for x in b]},
            "source": "Custom - City Engagement"
        })

    return items


def generate_norms() -> Dict:
    """
    Generate synthetic normative distributions for all attributes.
    Based on typical standardized score distributions.
    """
    norms = {
        "big5_extraversion": {"mean": 0.0, "sd": 1.0},
        "big5_agreeableness": {"mean": 0.0, "sd": 1.0},
        "big5_conscientiousness": {"mean": 0.0, "sd": 1.0},
        "big5_neuroticism": {"mean": 0.0, "sd": 1.0},
        "big5_openness": {"mean": 0.0, "sd": 1.0},
        "need_to_belong": {"mean": 0.2, "sd": 0.9},  # Slightly positive skew
        "sensation_seeking": {"mean": -0.1, "sd": 1.0},  # Slightly negative skew
        "activity_novelty": {"mean": 0.0, "sd": 1.0},
        "structure_preference": {"mean": 0.0, "sd": 1.0},
        "noise_tolerance": {"mean": 0.0, "sd": 1.0},
    }
    return norms


def generate_item_bank():
    """Generate complete item bank JSON."""
    all_items = []

    all_items.extend(generate_bfi2s_items())
    all_items.extend(generate_need_to_belong_items())
    all_items.extend(generate_sensation_seeking_items())
    all_items.extend(generate_city_preference_items())

    return all_items


if __name__ == "__main__":
    import os
    from pathlib import Path

    # Get paths
    script_dir = Path(__file__).parent
    data_dir = script_dir.parent / "data"

    # Generate and save item bank
    items = generate_item_bank()
    with open(data_dir / "item_bank.json", "w") as f:
        json.dump(items, f, indent=2)

    print(f"✅ Generated {len(items)} items")

    # Count by attribute
    from collections import Counter
    attrs = [item["attribute_id"] for item in items]
    print("\nItems per attribute:")
    for attr, count in Counter(attrs).items():
        print(f"  {attr}: {count}")

    # Generate and save norms
    norms = generate_norms()
    with open(data_dir / "norms.json", "w") as f:
        json.dump(norms, f, indent=2)

    print(f"\n✅ Generated norms for {len(norms)} attributes")
