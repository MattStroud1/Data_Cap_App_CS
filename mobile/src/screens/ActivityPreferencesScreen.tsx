import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { ScreenLayout } from '../components/ScreenLayout';
import { MultiSelect, ABTile, LikertScale } from '../components';
import { useSurvey } from '../utils/SurveyContext';
import { InterestDomain, ABChoice, LikertScore } from '../types/survey';

type ActivityPreferencesScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ActivityPreferences'
>;

interface Props {
  navigation: ActivityPreferencesScreenNavigationProp;
}

const ActivityPreferencesScreen: React.FC<Props> = ({ navigation }) => {
  const { surveyData, updateActivityPreferences } = useSurvey();

  const [interestDomains, setInterestDomains] = useState<InterestDomain[]>(
    surveyData.activity_preferences.interest_domains || []
  );
  const [interestOther, setInterestOther] = useState(
    surveyData.activity_preferences.interest_other || ''
  );
  const [noveltyQ1, setNoveltyQ1] = useState<ABChoice | undefined>(
    surveyData.activity_preferences.novelty_q1
  );
  const [noveltyQ2, setNoveltyQ2] = useState<ABChoice | undefined>(
    surveyData.activity_preferences.novelty_q2
  );
  const [structureLikeRegular, setStructureLikeRegular] = useState<LikertScore | undefined>(
    surveyData.activity_preferences.structure_like_regular
  );
  const [structurePreferDropin, setStructurePreferDropin] = useState<LikertScore | undefined>(
    surveyData.activity_preferences.structure_prefer_dropin
  );
  const [noiseEnjoyLoudBusy, setNoiseEnjoyLoudBusy] = useState<LikertScore | undefined>(
    surveyData.activity_preferences.noise_enjoy_loud_busy
  );
  const [noisePreferCalmQuiet, setNoisePreferCalmQuiet] = useState<LikertScore | undefined>(
    surveyData.activity_preferences.noise_prefer_calm_quiet
  );
  const [goalRelax, setGoalRelax] = useState<LikertScore | undefined>(
    surveyData.activity_preferences.goal_relax_switch_off
  );
  const [goalLearn, setGoalLearn] = useState<LikertScore | undefined>(
    surveyData.activity_preferences.goal_learn_stretch
  );
  const [goalConnected, setGoalConnected] = useState<LikertScore | undefined>(
    surveyData.activity_preferences.goal_feel_connected
  );
  const [goalGoodAt, setGoalGoodAt] = useState<LikertScore | undefined>(
    surveyData.activity_preferences.goal_do_things_good_at
  );
  const [goalMeaningful, setGoalMeaningful] = useState<LikertScore | undefined>(
    surveyData.activity_preferences.goal_meaningful_difference
  );

  const handleNext = () => {
    updateActivityPreferences({
      interest_domains: interestDomains,
      interest_other: interestOther,
      novelty_q1: noveltyQ1,
      novelty_q2: noveltyQ2,
      structure_like_regular: structureLikeRegular,
      structure_prefer_dropin: structurePreferDropin,
      noise_enjoy_loud_busy: noiseEnjoyLoudBusy,
      noise_prefer_calm_quiet: noisePreferCalmQuiet,
      goal_relax_switch_off: goalRelax,
      goal_learn_stretch: goalLearn,
      goal_feel_connected: goalConnected,
      goal_do_things_good_at: goalGoodAt,
      goal_meaningful_difference: goalMeaningful,
    });
    navigation.navigate('SocialStyle');
  };

  const isComplete =
    interestDomains.length > 0 &&
    noveltyQ1 &&
    noveltyQ2 &&
    structureLikeRegular &&
    structurePreferDropin &&
    noiseEnjoyLoudBusy &&
    noisePreferCalmQuiet &&
    goalRelax &&
    goalLearn &&
    goalConnected &&
    goalGoodAt &&
    goalMeaningful;

  return (
    <ScreenLayout
      title="Activity Preferences"
      subtitle="What do you enjoy doing in your city?"
      progress={3 / 7}
      onNext={handleNext}
      nextDisabled={!isComplete}
    >
      <MultiSelect
        question="Which of these sound like things you enjoy or would like to try more often?"
        options={[
          { value: 'live-music', label: 'Live music & gigs' },
          { value: 'nightlife-bars', label: 'Nightlife & bars' },
          { value: 'cafes', label: 'Cafés & hanging out' },
          { value: 'theatre-dance-performance', label: 'Theatre, dance, performance' },
          { value: 'museums-galleries', label: 'Museums, galleries, exhibitions' },
          { value: 'sports-watch', label: 'Sports to watch' },
          { value: 'sports-play', label: 'Sports to play' },
          { value: 'outdoor-nature', label: 'Outdoor & nature' },
          { value: 'gaming-esports-boardgames', label: 'Gaming, e-sports, board games' },
          { value: 'learning-talks-classes', label: 'Learning (talks, classes, workshops)' },
          { value: 'volunteering-community', label: 'Volunteering & community projects' },
          { value: 'faith-spiritual', label: 'Faith / spiritual activities' },
          { value: 'activism-causes', label: 'Activism & causes' },
          { value: 'making-diy-craft-tech', label: 'Making & DIY (craft, tech)' },
          { value: 'food-drink', label: 'Food & drink experiences' },
        ]}
        selectedValues={interestDomains}
        onChange={(values) => setInterestDomains(values as InterestDomain[])}
      />

      {interestDomains.includes('other') && (
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Tell us what else you care about..."
            value={interestOther}
            onChangeText={setInterestOther}
            multiline
          />
        </View>
      )}

      <ABTile
        question="Which sounds more like you?"
        optionA="I love trying new places and events, even if I'm not sure I'll like them."
        optionB="I prefer going to places I already know I like."
        value={noveltyQ1}
        onChange={setNoveltyQ1}
      />

      <ABTile
        question="And again:"
        optionA="I'm usually up for something different each week."
        optionB="I'd rather have a few favourite places I go back to."
        value={noveltyQ2}
        onChange={setNoveltyQ2}
      />

      <LikertScale
        question="I like signing up for a class, league or group and going every week."
        value={structureLikeRegular}
        onChange={setStructureLikeRegular}
      />

      <LikertScale
        question="I prefer drop-in things where I can decide on the day."
        value={structurePreferDropin}
        onChange={setStructurePreferDropin}
      />

      <LikertScale
        question="I enjoy loud, busy places with lots going on."
        value={noiseEnjoyLoudBusy}
        onChange={setNoiseEnjoyLoudBusy}
      />

      <LikertScale
        question="I prefer calm, quiet spaces."
        value={noisePreferCalmQuiet}
        onChange={setNoisePreferCalmQuiet}
      />

      <LikertScale
        question="When I go out, I mainly want to relax and switch off."
        value={goalRelax}
        onChange={setGoalRelax}
      />

      <LikertScale
        question="When I go out, I like to learn something or stretch myself."
        value={goalLearn}
        onChange={setGoalLearn}
      />

      <LikertScale
        question="When I go out, I want to feel connected to other people."
        value={goalConnected}
        onChange={setGoalConnected}
      />

      <LikertScale
        question="When I go out, I like to do things I'm already good at."
        value={goalGoodAt}
        onChange={setGoalGoodAt}
      />

      <LikertScale
        question="When I go out, I like to do things that feel meaningful or make a difference."
        value={goalMeaningful}
        onChange={setGoalMeaningful}
      />
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  textInputContainer: {
    marginVertical: 8,
  },
  textInput: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 15,
    minHeight: 80,
    textAlignVertical: 'top',
  },
});

export default ActivityPreferencesScreen;
