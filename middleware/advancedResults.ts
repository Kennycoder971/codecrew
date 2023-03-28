import prismadb from '../db/prismadb'
import {Request, Response, NextFunction } from "express";

interface Pagination {
    next ?:{
        page?:number;
        limit?:number;
    },
    prev ?:{
        page?:number;
        limit?:number;
    }
}


const advancedResults = (model ) => async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ["select", "sort", "page", "limit"];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // Create query object
  let queryObj = { where: {} };

  // Finding resource
  query = prismadb[model].findMany(queryObj);

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(",");
    query = query.select({
      include: fields.reduce((acc, field) => {
        acc[field] = true;
        return acc;
      }, {})
    });
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.orderBy(sortBy);
  } else {
    query = query.orderBy({ createdAt: 'desc' });
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  let limit = parseInt(req.query.limit, 10) || 15;
  if (limit > 100) limit = 100;
  const offset = (page - 1) * limit;
  const total = await prismadb[model].count({ where: queryObj.where });

  query = query.skip(offset).take(limit);

  // Executing query
  const results = await query;

  // Pagination result
  const pagination:Pagination = {};

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

module.exports = advancedResults;
