import { Request, Response, NextFunction } from "express";
import { ISearchService } from "@/Application/interfaces/Search/ISearchService";
import { INTERFACE_TYPE } from "@/helpers/containerConst";
import { inject, injectable } from "inversify";
import { safePromise } from "@/helpers/safePromise";
import { HTTP500Error } from "@/helpers/ApiError";
import { apiResponse } from "@/helpers/apiResponse";

@injectable()
export class SearchController {
  constructor(
    @inject(INTERFACE_TYPE.SearchService)
    private readonly searchService: ISearchService
  ) {}

  async tasksSearch(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const q = req.query.q as string;
    let { skills, minBudget, maxBudget, government, status, sortBy, fields, category} =
      req.query;
    let filters = {
      skills: skills ? skills.toString().split(",") : [],
      minBudget: minBudget ? +minBudget : 0,
      maxBudget: maxBudget ? +maxBudget : 1000000,
      government,
      category,
      status,
      fields,
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
    };

    sortBy = sortBy ? sortBy.toString() : "relevance";

    const [error, data] = await safePromise(() =>
      this.searchService.tasksSearch(q, filters, sortBy)
    );

    if (error) return next(new HTTP500Error(error.message));

    res.json(
      apiResponse(
        { tasks: data.tasks },
        "Tasks fetched successfully",
        true,
        data.pagination
      )
    );
  }
}
