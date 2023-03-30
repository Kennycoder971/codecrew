import prismadb from "../db/prismadb.js";
import { PaginationQueryObj } from "../interfaces/index.js";
interface Pagination {
  next?: {
    page?: number;
    limit?: number;
  };
  prev?: {
    page?: number;
    limit?: number;
  };
}

const advancedResults =
  (model, include = "") =>
  async (req, res, next) => {
    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ["select", "page", "limit", "sort"];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach((param) => delete reqQuery[param]);

    // Create query object
    let queryObj: PaginationQueryObj = { where: reqQuery };

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(",");

      queryObj.select = fields.reduce((acc, field) => {
        acc[field] = true;
        return acc;
      }, {});
    }

    // Sort
    if (req.query.sort) {
      const [key, val] = req.query.sort.split(".");
      queryObj.orderBy = {
        [key?.toLowerCase()]: val?.toLowerCase() || "asc",
      };
    } else {
      queryObj.orderBy = { createdAt: "desc" };
    }

    if (include) {
      queryObj.include = { [include.toLowerCase()]: true };
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    let limit = parseInt(req.query.limit, 10) || 15;
    if (limit > 100) limit = 100;
    const offset = (page - 1) * limit;
    const total = await prismadb[model].count();

    queryObj.skip = offset;

    queryObj.take = limit;

    // Executing query Finding resource
    const results = await prismadb[model].findMany(queryObj);

    // Pagination result
    const pagination: Pagination = {};

    if (offset + limit < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (offset > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.advancedResults = {
      success: true,
      count: results.length,
      pagination,
      data: results,
    };

    next();
  };

export default advancedResults;
