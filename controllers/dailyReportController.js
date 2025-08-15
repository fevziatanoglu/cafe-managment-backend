import DailyReport from '../models/DailyReport.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

// Helper function to update daily report
export const updateDailyReport = async (adminId, orderTotal, orderItems) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to start of day

        // Find or create today's report
        let dailyReport = await DailyReport.findOne({
            date: today,
            adminId
        });

        if (!dailyReport) {
            // Create new daily report
            dailyReport = new DailyReport({
                adminId,
                date: today,
                totalSales: orderTotal,
                totalCustomers: 1,
                items: orderItems.map(item => ({
                    item: item.productName, // Map productName to item
                    quantity: item.quantity,
                    price: item.price
                }))
            });
        } else {
            // Update existing report
            dailyReport.totalSales += orderTotal;
            dailyReport.totalCustomers += 1;

            // Update items sold
            orderItems.forEach(orderItem => {
                const existingItem = dailyReport.items.find(
                    item => item.productName === orderItem.productName // Compare by product name
                );

                if (existingItem) {
                    existingItem.quantity += orderItem.quantity;
                } else {
                    dailyReport.items.push({
                        productName: orderItem.productName, // Map productName to item
                        quantity: orderItem.quantity,
                        price: orderItem.price
                    });
                }
            });
        }

        await dailyReport.save();
        return dailyReport;
    } catch (error) {
        throw error;
    }
};

// Get daily reports
export const getDailyReports = async (req, res) => {
  try {
    const adminId = req.user.role === 'admin' ? req.user._id : req.user.adminId;
    const { startDate, endDate } = req.query;

    const filter = { adminId };
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const reports = await DailyReport.find(filter)
      .populate('items.productId', 'name category')
      .sort({ date: -1 });

    return sendSuccess(res, 'Daily reports fetched successfully', reports, 200);
  } catch (error) {
    return sendError(res, 'Error fetching daily reports', error, 500);
  }
};

// Get today's report
export const getTodayReport = async (req, res) => {
  try {
    const adminId = req.user.role === 'admin' ? req.user._id : req.user.adminId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const report = await DailyReport.findOne({
      date: today,
      adminId
    }).populate('items.productId', 'name category');

    if (!report) {
      return sendSuccess(res, 'No report found for today', null, 200);
    }

    return sendSuccess(res, 'Today\'s report fetched successfully', report, 200);
  } catch (error) {
    return sendError(res, 'Error fetching today\'s report', error, 500);
  }
};

// Get this week's daily reports
export const getWeeklyReports = async (req, res) => {
  try {
    const adminId = req.user.role === 'admin' ? req.user._id : req.user.adminId;
    
    // Calculate the start of this week (Monday)
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const startOfWeek = new Date(today);
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // If Sunday, go back 6 days to Monday
    startOfWeek.setDate(today.getDate() - daysToMonday);
    startOfWeek.setHours(0, 0, 0, 0);
    
    // Calculate the end of this week (Sunday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const reports = await DailyReport.find({
      adminId,
      date: {
        $gte: startOfWeek,
        $lte: endOfWeek
      }
    })
      .populate('items.productId', 'name category')
      .sort({ date: 1 }); // Sort ascending by date

    // Calculate weekly summary
    const weeklyTotalSales = reports.reduce((sum, report) => sum + report.totalSales, 0);
    const weeklyTotalCustomers = reports.reduce((sum, report) => sum + report.totalCustomers, 0);
    const averageDailySales = reports.length > 0 ? weeklyTotalSales / reports.length : 0;

    const summary = {
      weeklyTotalSales,
      weeklyTotalCustomers,
      averageDailySales,
      daysWithData: reports.length,
      startOfWeek: startOfWeek.toISOString().split('T')[0],
      endOfWeek: endOfWeek.toISOString().split('T')[0]
    };

    return sendSuccess(res, 'Weekly reports fetched successfully', {
      reports,
      summary
    }, 200);
  } catch (error) {
    return sendError(res, 'Error fetching weekly reports', error, 500);
  }
};
