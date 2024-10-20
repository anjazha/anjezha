import { Request, Response, NextFunction } from "express";
import { ISearchService } from "@/Application/interfaces/Search/ISearchService";
import { INTERFACE_TYPE } from "@/helpers/containerConst";
import { inject, injectable } from "inversify";
import { safePromise } from "@/helpers/safePromise";
import { HTTP500Error } from "@/helpers/ApiError";
import { apiResponse } from "@/helpers/apiResponse";
import { threadId } from "worker_threads";

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


  async taskerSearch(req:Request, res:Response, next:NextFunction){

    // let {  
    //   q,
    //   category,
    //   minBudget,
    //   maxBudget,
    //   minRating,
    //   maxRating,
    //   longitude,
    //   latitude,
    //   sortBy,
    //   limit,
    //   page
    // } = req.query;
    
    // Convert to numbers where applicable
     const q = req.query.q;
     const sortBy= req.query.sortBy;
     const category =  Number(req.query.category);
     const minBudget = Number(req.query.minBudget);
     const maxBudget = Number(req.query.maxBudget);
     const minRating = Number(req.query.minRating);
     const maxRating = Number(req.query.maxRating);
     const maxDistance = Number(req.query.maxDistance);
     const longitude = Number(req.query.longitude);
     const latitude =  Number(req.query.latitude);
     const limit =     Number(req.query.limit);
     const page =      Number(req.query.page);

           const limitNum = limit ? limit: 10;
           const pageNum = page? +page : 1;
           // calc offest to skip 
           const offset = (pageNum - 1 ) * limitNum;
          
          //  console.log(offset)

          const [error, result] = await safePromise(
                 () => this.searchService.taskersSearch(String(q), 
                     { 
                        category,
                        minBudget,
                        maxBudget,
                        minRating,
                        maxRating,
                        maxDistance,
                        longitude,
                        latitude,
                        pageNum,
                        offset,
                        limitNum}, String(sortBy)));

            // console.log(values)

          // check if error exist 
          if(error) {
              return next(new HTTP500Error('error in search controller'+ error.message + error.stack));
            }

          res.json(apiResponse(
            result.taskers,
            "taksers fetched successfully",
            result.pagination
          ))
  }


}


