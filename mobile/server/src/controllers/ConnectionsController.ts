import { Request, Response } from "express";
import db from "../database/connection";

export default class ConnectionController {
  async index(request: Request, response: Response){
    const totalConnections = await db('connections').count('* as total');

    
  }

  async create(request: Request, response: Response){
    const { coach_id } = request.body;

    await db('connections').insert({
      coach_id,
    });

    return response.status(201).send();
  }
}