import express, {Request, Response}from 'express';
import db from "../database/connection";
import convertHourToMinutes from "../utils/convertHourToMinutes";

const routers = express.Router();

interface ScheduleItem {
  week_day: number;
  from: string;
  to: string;
}

export default class ClassesControler {
  async index(request: Request, response: Response){
    const filters = request.query;

    const week_day = filters.week_day as string;
    const subject  = filters.week_day as string;
    const time = filters.time as string;

    if ((!filters.week_day) || (!filters.subject) || (!filters.time)) {
      return response.status(400).json({
        error: 'Missing filters to search classes'        
      });
    }

    const timeInMinutes = convertHourToMinutes(time);

    const classes = await db('classes')
      .whereExists(function() {
        this.select('class_schedule.*')
          .from('class_schedule')
          .whereRaw('`class_schedule`.`class_id` = `classes`.`i`')
          .whereRaw('`class_schedule`.`week_day` = ??', [Number(week_day)])
          .whereRaw('`class_schedule`.`from`<= ??', [timeInMinutes])
          .whereRaw('`class_schedule`.`to` > ??', [timeInMinutes])
      })
      .where('classes.subject', '=', subject)
      .join('coaches', 'classes.coach_id', '=', 'coaches.id')
      .select(['classes.*', 'coaches.*']);

    return response.json(classes);
  }

  async create(request: Request, response: Response) { 
    const {
      name,
      avatar,
      whatsapp,
      bio,
      subject,
      cost,
      schedule
    } = request.body;
  
    const trx = await db.transaction();
  
    try{
      const insertedCoachesIds = await trx('coaches').insert({
        name,
        avatar,
        whatsapp,
        bio,
      });
    
      const coach_id = 'insertedCoachesIds'[0];
    
      const insertedClassesIds = await trx('classes').insert ({
        subject,
        cost,
        coach_id,
      });
    
      const class_id = 'insertedClassesIds'[0];
    
      const classSchedule = schedule.map((scheduleItem: ScheduleItem) => {
        return {
          class_id,
          week_day: scheduleItem.week_day,
          from: convertHourToMinutes(scheduleItem.from),
          to: convertHourToMinutes(scheduleItem.to),
        };
      });
    
      await trx('class_schedule').insert(classSchedule);
  
      await trx.commit();
    
      return response.send(201).send();
    } catch (error) {
      await trx.rollback();
  
      return response.status(400).json({
        error:'Unexpected error while creating new class'
      });
    }
  }
};
