const {create_room}=require('../Controllers/CreateRoom');
const {getRoomById}=require('../Controllers/GetRoomById');
const {getWaitingRooms}=require('../Controllers/GetRooms');
const {join}=require('../Controllers/Join');
const {getresult}=require('../Controllers/Getresult');
const ensureAuthenticated=require('../Middlewares/Auth.js');
const router=require('express').Router();

router.post('/create_room',ensureAuthenticated,create_room);
router.post('/join',ensureAuthenticated,join);
router.post('/getresult',ensureAuthenticated,getresult);
router.get('/getrooms',ensureAuthenticated,getWaitingRooms);
router.get('/:roomId',ensureAuthenticated,getRoomById);
module.exports=router;