import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { ScreenLayout } from '../components/ScreenLayout';
import { EventCard } from '../components/EventCard';
import { useSurvey } from '../utils/SurveyContext';
import { choiceExperimentSets } from '../data/choiceExperiments';

type ChoiceExperimentsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ChoiceExperiments'
>;

interface Props {
  navigation: ChoiceExperimentsScreenNavigationProp;
}

const ChoiceExperimentsScreen: React.FC<Props> = ({ navigation }) => {
  const { addChoiceExperiment } = useSurvey();
  const [currentChoiceIndex, setCurrentChoiceIndex] = useState(0);
  const [selectedMost, setSelectedMost] = useState<string | null>(null);
  const [selectedLeast, setSelectedLeast] = useState<string | null>(null);

  const currentChoice = choiceExperimentSets[currentChoiceIndex];
  const totalChoices = choiceExperimentSets.length;
  const isLastChoice = currentChoiceIndex === totalChoices - 1;

  const handleNext = () => {
    if (selectedMost) {
      // Save the current choice
      addChoiceExperiment({
        choice_id: currentChoice.choice_id,
        options_presented: currentChoice.options,
        selected_most_appealing: selectedMost,
        selected_least_appealing: selectedLeast || undefined,
      });

      if (isLastChoice) {
        // Move to completion screen
        navigation.navigate('Completion');
      } else {
        // Move to next choice
        setCurrentChoiceIndex(currentChoiceIndex + 1);
        setSelectedMost(null);
        setSelectedLeast(null);
      }
    }
  };

  const handleCardPress = (optionId: string) => {
    if (selectedMost === optionId) {
      // Deselect most
      setSelectedMost(null);
    } else if (selectedLeast === optionId) {
      // Switch from least to most
      setSelectedLeast(null);
      setSelectedMost(optionId);
    } else if (!selectedMost) {
      // Select as most
      setSelectedMost(optionId);
    } else if (!selectedLeast) {
      // Select as least
      setSelectedLeast(optionId);
    } else {
      // Replace least
      setSelectedLeast(optionId);
    }
  };

  const getSelectionType = (optionId: string): 'most' | 'least' | null => {
    if (selectedMost === optionId) return 'most';
    if (selectedLeast === optionId) return 'least';
    return null;
  };

  const progress = (currentChoiceIndex + 1) / totalChoices;

  return (
    <ScreenLayout
      title="Quick Choices"
      subtitle={currentChoice.question}
      progress={5 / 7 + (progress * 2) / 7}
      onNext={handleNext}
      nextLabel={isLastChoice ? 'Complete Survey' : 'Next Choice'}
      nextDisabled={!selectedMost}
    >
      <View style={styles.instructionContainer}>
        <Text style={styles.instruction}>
          Tap to select <Text style={styles.highlightGreen}>most appealing</Text>
        </Text>
        <Text style={styles.instruction}>
          Tap again for <Text style={styles.highlightRed}>least appealing</Text> (optional)
        </Text>
      </View>

      <View style={styles.counterContainer}>
        <Text style={styles.counter}>
          Choice {currentChoiceIndex + 1} of {totalChoices}
        </Text>
      </View>

      {currentChoice.options.map((option) => (
        <EventCard
          key={option.option_id}
          event={option}
          selected={selectedMost === option.option_id || selectedLeast === option.option_id}
          selectionType={getSelectionType(option.option_id)}
          onPress={() => handleCardPress(option.option_id)}
        />
      ))}
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  instructionContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  instruction: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  highlightGreen: {
    color: '#34C759',
    fontWeight: '600',
  },
  highlightRed: {
    color: '#FF3B30',
    fontWeight: '600',
  },
  counterContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  counter: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
});

export default ChoiceExperimentsScreen;
