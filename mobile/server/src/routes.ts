import express from 'express';
import ClassesController from './controllers/ClassesController';
import ConnectionsController from  './controllers/ConnectionsController';

const routers = express.Router();
const classesController = new ClassesController();
const connectionsController = new ConnectionsController();

routers.get('/classes', classesController.index);
routers.post('/classes', classesController.create);

routers.get('/connections', connectionsController.index);
routers.post('/connections', connectionsController.create);

export default routers;