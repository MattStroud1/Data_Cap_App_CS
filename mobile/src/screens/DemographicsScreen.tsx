import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { ScreenLayout } from '../components/ScreenLayout';
import { SingleChoice, MultiSelect, BudgetSlider } from '../components';
import { useSurvey } from '../utils/SurveyContext';
import {
  AgeBand,
  GenderIdentity,
  CurrentSituation,
  HouseholdType,
  ChildrenAge,
  TransportMode,
  TravelTime,
  BudgetBand,
} from '../types/survey';

type DemographicsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Demographics'
>;

interface Props {
  navigation: DemographicsScreenNavigationProp;
}

const DemographicsScreen: React.FC<Props> = ({ navigation }) => {
  const { surveyData, updateDemographics } = useSurvey();

  const [ageBand, setAgeBand] = useState<AgeBand | undefined>(surveyData.demographics.age_band);
  const [genderIdentity, setGenderIdentity] = useState<GenderIdentity | undefined>(
    surveyData.demographics.gender_identity
  );
  const [genderSelfDescribe, setGenderSelfDescribe] = useState(
    surveyData.demographics.gender_self_describe || ''
  );
  const [currentSituation, setCurrentSituation] = useState<CurrentSituation | undefined>(
    surveyData.demographics.current_situation
  );
  const [householdType, setHouseholdType] = useState<HouseholdType | undefined>(
    surveyData.demographics.household_type
  );
  const [childrenInHousehold, setChildrenInHousehold] = useState<ChildrenAge[]>(
    surveyData.demographics.children_in_household || []
  );
  const [transportModes, setTransportModes] = useState<TransportMode[]>(
    surveyData.demographics.transport_modes || []
  );
  const [travelTime, setTravelTime] = useState<TravelTime | undefined>(
    surveyData.demographics.willing_travel_time
  );
  const [budgetBand, setBudgetBand] = useState<BudgetBand | undefined>(
    surveyData.demographics.typical_budget_band
  );

  const handleNext = () => {
    updateDemographics({
      age_band: ageBand,
      gender_identity: genderIdentity,
      gender_self_describe: genderSelfDescribe,
      current_situation: currentSituation,
      household_type: householdType,
      children_in_household: childrenInHousehold,
      transport_modes: transportModes,
      willing_travel_time: travelTime,
      typical_budget_band: budgetBand,
    });
    navigation.navigate('TimeAvailability');
  };

  const isComplete = ageBand && genderIdentity && currentSituation && householdType && budgetBand;

  return (
    <ScreenLayout
      title="About You"
      subtitle="Help us understand your situation and preferences"
      progress={1 / 7}
      onNext={handleNext}
      nextDisabled={!isComplete}
    >
      <SingleChoice
        question="Age band"
        options={[
          { value: '16-24', label: '16-24' },
          { value: '25-34', label: '25-34' },
          { value: '35-44', label: '35-44' },
          { value: '45-54', label: '45-54' },
          { value: '55-64', label: '55-64' },
          { value: '65+', label: '65+' },
        ]}
        value={ageBand}
        onChange={(value) => setAgeBand(value as AgeBand)}
        layout="grid"
      />

      <SingleChoice
        question="Gender"
        options={[
          { value: 'woman', label: 'Woman' },
          { value: 'man', label: 'Man' },
          { value: 'non-binary', label: 'Non-binary' },
          { value: 'self-describe', label: 'Prefer to self-describe' },
          { value: 'prefer-not-to-say', label: 'Prefer not to say' },
        ]}
        value={genderIdentity}
        onChange={(value) => setGenderIdentity(value as GenderIdentity)}
      />

      {genderIdentity === 'self-describe' && (
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Please describe..."
            value={genderSelfDescribe}
            onChangeText={setGenderSelfDescribe}
          />
        </View>
      )}

      <SingleChoice
        question="Current situation"
        options={[
          { value: 'at-school', label: 'At school' },
          { value: 'at-university', label: 'At university' },
          { value: 'working-full-time', label: 'Working full time' },
          { value: 'working-part-time', label: 'Working part time' },
          { value: 'shift-work', label: 'Shift work' },
          { value: 'home-family', label: 'Looking after home or family' },
          { value: 'retired', label: 'Retired' },
          { value: 'other', label: 'Other' },
        ]}
        value={currentSituation}
        onChange={(value) => setCurrentSituation(value as CurrentSituation)}
      />

      <SingleChoice
        question="Who do you live with most of the time?"
        options={[
          { value: 'alone', label: 'I live alone' },
          { value: 'with-partner', label: 'With partner' },
          { value: 'with-partner-and-children', label: 'With partner and children' },
          { value: 'with-children-no-partner', label: 'With children (no partner)' },
          { value: 'with-housemates', label: 'With housemates / shared flat' },
          { value: 'with-parents-family', label: 'With parents / family' },
          { value: 'other', label: 'Other' },
        ]}
        value={householdType}
        onChange={(value) => setHouseholdType(value as HouseholdType)}
      />

      <MultiSelect
        question="Any children in your household?"
        options={[
          { value: 'none', label: 'None' },
          { value: 'under-5', label: 'Under 5' },
          { value: '5-12', label: '5-12' },
          { value: '13-18', label: '13-18' },
        ]}
        selectedValues={childrenInHousehold}
        onChange={(values) => setChildrenInHousehold(values as ChildrenAge[])}
      />

      <MultiSelect
        question="How do you usually get around your city? (choose up to 2)"
        options={[
          { value: 'walk', label: 'Walk' },
          { value: 'cycle', label: 'Cycle' },
          { value: 'e-scooter', label: 'E-scooter' },
          { value: 'bus', label: 'Bus' },
          { value: 'metro', label: 'Metro' },
          { value: 'train', label: 'Train' },
          { value: 'car-driver', label: 'Car (driver)' },
          { value: 'car-passenger', label: 'Car (passenger)' },
          { value: 'ride-hailing', label: 'Ride-hailing (Uber etc.)' },
          { value: 'other', label: 'Other' },
        ]}
        selectedValues={transportModes}
        onChange={(values) => setTransportModes(values as TransportMode[])}
        maxSelections={2}
      />

      <SingleChoice
        question="How long are you usually willing to travel for something you're really interested in?"
        options={[
          { value: '0-10', label: 'Up to 10 minutes' },
          { value: '10-20', label: '10-20 minutes' },
          { value: '20-35', label: '20-35 minutes' },
          { value: '35-50', label: '35-50 minutes' },
          { value: '50+', label: 'Over 50 minutes' },
        ]}
        value={travelTime}
        onChange={(value) => setTravelTime(value as TravelTime)}
      />

      <BudgetSlider
        question="How much do you prefer to spend on a normal outing (tickets, food, etc.)?"
        value={budgetBand}
        onChange={(value) => setBudgetBand(value)}
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
  },
});

export default DemographicsScreen;
