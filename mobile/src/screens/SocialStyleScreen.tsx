import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { ScreenLayout } from '../components/ScreenLayout';
import { GroupSizeSelector, LikertScale, MultiSelect } from '../components';
import { useSurvey } from '../utils/SurveyContext';
import { GroupSize, LikertScore, IdentityCluster } from '../types/survey';

type SocialStyleScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SocialStyle'
>;

interface Props {
  navigation: SocialStyleScreenNavigationProp;
}

const SocialStyleScreen: React.FC<Props> = ({ navigation }) => {
  const { surveyData, updateSocialStyle } = useSurvey();

  const [preferredGroupSize, setPreferredGroupSize] = useState<GroupSize[]>(
    surveyData.social_style.preferred_group_size || []
  );
  const [enjoyMoreWithOthers, setEnjoyMoreWithOthers] = useState<LikertScore | undefined>(
    surveyData.social_style.enjoy_more_with_others
  );
  const [aloneAsGoodAsTogether, setAloneAsGoodAsTogether] = useState<LikertScore | undefined>(
    surveyData.social_style.alone_as_good_as_together
  );
  const [wantOthersAcceptMe, setWantOthersAcceptMe] = useState<LikertScore | undefined>(
    surveyData.social_style.want_others_accept_me
  );
  const [dontLikeAloneLong, setDontLikeAloneLong] = useState<LikertScore | undefined>(
    surveyData.social_style.dont_like_alone_long
  );
  const [happyWithGroupIKnow, setHappyWithGroupIKnow] = useState<LikertScore | undefined>(
    surveyData.social_style.happy_with_group_i_know
  );
  const [identityClusters, setIdentityClusters] = useState<IdentityCluster[]>(
    surveyData.social_style.identity_clusters || []
  );
  const [identityOther, setIdentityOther] = useState(
    surveyData.social_style.identity_other || ''
  );

  const handleNext = () => {
    updateSocialStyle({
      preferred_group_size: preferredGroupSize,
      enjoy_more_with_others: enjoyMoreWithOthers,
      alone_as_good_as_together: aloneAsGoodAsTogether,
      want_others_accept_me: wantOthersAcceptMe,
      dont_like_alone_long: dontLikeAloneLong,
      happy_with_group_i_know: happyWithGroupIKnow,
      identity_clusters: identityClusters,
      identity_other: identityOther,
    });
    navigation.navigate('ChoiceExperiments');
  };

  const isComplete =
    preferredGroupSize.length >= 1 &&
    enjoyMoreWithOthers &&
    aloneAsGoodAsTogether &&
    wantOthersAcceptMe &&
    dontLikeAloneLong &&
    happyWithGroupIKnow;

  return (
    <ScreenLayout
      title="Social Style"
      subtitle="How do you like to experience activities?"
      progress={4 / 7}
      onNext={handleNext}
      nextDisabled={!isComplete}
    >
      <GroupSizeSelector
        question="If you had to pick, which group size do you enjoy most for activities?"
        selectedSizes={preferredGroupSize}
        onChange={setPreferredGroupSize}
        maxSelections={2}
      />

      <LikertScale
        question="I usually enjoy activities more when I share them with other people."
        value={enjoyMoreWithOthers}
        onChange={setEnjoyMoreWithOthers}
      />

      <LikertScale
        question="Spending time on my own is just as good as going out with others."
        value={aloneAsGoodAsTogether}
        onChange={setAloneAsGoodAsTogether}
      />

      <LikertScale
        question="I want other people to accept me."
        value={wantOthersAcceptMe}
        onChange={setWantOthersAcceptMe}
      />

      <LikertScale
        question="I do not like being alone for long periods."
        value={dontLikeAloneLong}
        onChange={setDontLikeAloneLong}
      />

      <LikertScale
        question="I feel happy when I am with a group of people I know well."
        value={happyWithGroupIKnow}
        onChange={setHappyWithGroupIKnow}
      />

      <MultiSelect
        question="Which of these feel like 'your crowd' right now? (optional)"
        options={[
          { value: 'live-music-crowd', label: 'Live-music / gig crowd' },
          { value: 'nightlife-people', label: 'Nightlife people' },
          { value: 'sporty-fitness', label: 'Sporty / fitness' },
          { value: 'gamers-geeks', label: 'Gamers / geeks' },
          { value: 'bookish-artsy', label: 'Bookish / artsy' },
          { value: 'makers-diy-hackers', label: 'Makers / DIY / hackers' },
          { value: 'faith-community', label: 'Faith community' },
          { value: 'activists-social-causes', label: 'Activists / social causes' },
          { value: 'parenting-family', label: 'Parenting / family-focused' },
          { value: 'none-fit', label: 'None of these really fit me' },
          { value: 'other', label: 'Other' },
        ]}
        selectedValues={identityClusters}
        onChange={(values) => setIdentityClusters(values as IdentityCluster[])}
      />

      {identityClusters.includes('other') && (
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Describe your crowd..."
            value={identityOther}
            onChangeText={setIdentityOther}
          />
        </View>
      )}
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
  },
});

export default SocialStyleScreen;
