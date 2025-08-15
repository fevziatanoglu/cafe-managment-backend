import express from 'express';
import { 
  getDailyReports, 
  getTodayReport, 
  getWeeklyReports 
} from '../controllers/dailyReportController.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authorizeRole } from '../middlewares/authorizeRole.js';

const router = express.Router();

// Get all daily reports (with optional date range)
router.get('/', authenticate, authorizeRole('admin'), getDailyReports);

// Get today's report
router.get('/today', authenticate, authorizeRole('admin'), getTodayReport);

// Get this week's reports
router.get('/weekly', authenticate, authorizeRole('admin'), getWeeklyReports);

export default router;
