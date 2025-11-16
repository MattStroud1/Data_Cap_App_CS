import { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(__dirname, '../data');
const SURVEYS_FILE = path.join(DATA_DIR, 'surveys.json');

// Ensure data directory exists
const ensureDataDir = async () => {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
};

// Read all surveys from file
const readSurveys = async (): Promise<any[]> => {
  try {
    await ensureDataDir();
    const data = await fs.readFile(SURVEYS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // File doesn't exist yet, return empty array
    return [];
  }
};

// Write surveys to file
const writeSurveys = async (surveys: any[]): Promise<void> => {
  await ensureDataDir();
  await fs.writeFile(SURVEYS_FILE, JSON.stringify(surveys, null, 2), 'utf-8');
};

// Submit survey
export const submitSurvey = async (req: Request, res: Response) => {
  try {
    const surveyData = req.body;

    // Validate required fields
    if (!surveyData.version) {
      return res.status(400).json({ error: 'Missing required field: version' });
    }

    // Read existing surveys
    const surveys = await readSurveys();

    // Add the new survey
    surveys.push(surveyData);

    // Write back to file
    await writeSurveys(surveys);

    console.log(`✅ Survey submitted successfully. Total surveys: ${surveys.length}`);
    console.log(`   User ID: ${surveyData.user_id}`);
    console.log(`   Session ID: ${surveyData.session_id}`);

    res.status(201).json({
      success: true,
      message: 'Survey submitted successfully',
      user_id: surveyData.user_id,
      session_id: surveyData.session_id,
    });
  } catch (error) {
    console.error('Error submitting survey:', error);
    res.status(500).json({ error: 'Failed to submit survey' });
  }
};

// Get all surveys (for admin/testing)
export const getAllSurveys = async (req: Request, res: Response) => {
  try {
    const surveys = await readSurveys();
    res.json({
      total: surveys.length,
      surveys,
    });
  } catch (error) {
    console.error('Error reading surveys:', error);
    res.status(500).json({ error: 'Failed to read surveys' });
  }
};

// Get survey by user_id
export const getSurveyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const surveys = await readSurveys();
    const survey = surveys.find((s) => s.user_id === id || s.session_id === id);

    if (!survey) {
      return res.status(404).json({ error: 'Survey not found' });
    }

    res.json(survey);
  } catch (error) {
    console.error('Error reading survey:', error);
    res.status(500).json({ error: 'Failed to read survey' });
  }
};
