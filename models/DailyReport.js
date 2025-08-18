import mongoose from 'mongoose';

const dailyReportSchema = new mongoose.Schema({
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    totalSales: { type: Number, required: true },
    totalCustomers: { type: Number, required: true },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        productName: { type: String },
        price: { type: Number },
        quantity: { type: Number, required: true, default: 1 }
    }
    ],
});

const DailyReport = mongoose.model('DailyReport', dailyReportSchema);

export default DailyReport;
