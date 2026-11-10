import { Request, Response } from "express";
import ReportService from "../services/ReportService";

class ReportController {
  async create(request: Request, response: Response) {
    try {
      const reporterId = request.userId as string;
      const { targetType, targetId, reason, details } = request.body;
      const result = await ReportService.create(reporterId, {
        targetType,
        targetId,
        reason,
        details,
      });
      return response.status(201).json(result);
    } catch (error: any) {
      return response.status(400).json({ error: error.message });
    }
  }

  async list(request: Request, response: Response) {
    try {
      const reports = await ReportService.listOpen();
      return response.status(200).json(reports);
    } catch (error: any) {
      return response.status(400).json({ error: error.message });
    }
  }

  async count(request: Request, response: Response) {
    try {
      const count = await ReportService.countOpen();
      return response.status(200).json({ count });
    } catch (error: any) {
      return response.status(400).json({ error: error.message });
    }
  }

  async resolve(request: Request, response: Response) {
    try {
      const id = request.params.id as string;
      const { action } = request.body;
      const result = await ReportService.resolve(id, action);
      return response.status(200).json(result);
    } catch (error: any) {
      return response.status(400).json({ error: error.message });
    }
  }
}

export default new ReportController();
