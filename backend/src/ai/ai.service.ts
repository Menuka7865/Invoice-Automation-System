import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Invoice } from '../invoices/invoice.schema';
import { Customer } from '../customers/customer.schema';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiService {
  private readonly logger = new Logger('AiService');
  private client: any;

  constructor(private config: ConfigService, @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>, @InjectModel(Customer.name) private customerModel: Model<Customer>) {
    const apiKey = this.config.get('GOOGLE_API_KEY');
    if (apiKey) {
      this.client = new GoogleGenerativeAI(apiKey);
    }
  }

  async summarize() {
    // collect basic stats
    const totalRevenueAgg = await this.invoiceModel.aggregate([{ $match: { status: 'Paid' } }, { $group: { _id: null, total: { $sum: '$total' } } }]);
    const totalRevenue = totalRevenueAgg[0]?.total || 0;
    const overdueAgg = await this.invoiceModel.aggregate([{ $match: { status: 'Overdue' } }, { $group: { _id: null, total: { $sum: '$total' } } }]);
    const overdue = overdueAgg[0]?.total || 0;
    const customers = await this.customerModel.countDocuments({ active: true });

    const prompt = `Provide short insights and a 3-point recommendation based on the following stats: totalRevenue=${totalRevenue}, overdue=${overdue}, activeCustomers=${customers}`;

    if (!this.client) {
      return { totalRevenue, overdue, customers, insights: 'Google API key not configured. Install key to enable AI insights.', recommendations: [] };
    }

    // Try multiple models in fallback order
    const modelsToTry = ['gemini-2.5-flash', 'gemini-2.5-flash-lit', 'gemini-2.5-pro'];

    for (const modelName of modelsToTry) {
      try {
        const model = this.client.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text() || 'No response';
        this.logger.log(`Successfully used model: ${modelName}`);
        return { totalRevenue, overdue, customers, insights: text, recommendations: [] };
      } catch (err) {
        this.logger.warn(`Model ${modelName} failed, trying next...`, (err as any).message);
        continue;
      }
    }

    // If all models fail, return stats without AI insights
    this.logger.error('All AI models failed. Returning stats only.');
    return {
      totalRevenue,
      overdue,
      customers,
      insights: 'AI insights temporarily unavailable. Check API key and model availability.',
      recommendations: []
    };
  }
}
