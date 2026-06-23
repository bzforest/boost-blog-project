import { Request, Response } from 'express';
import * as dashboardService from './dashboard.service';

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = await dashboardService.getDashboardStats();
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

export const getDashboardChart = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await dashboardService.getDashboardChart();
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching dashboard chart data:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};
