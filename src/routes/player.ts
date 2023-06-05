import { Router } from 'express';

import { playerController } from '../controllers/player';

export const playerRoutes = Router();

playerRoutes.get('/players', playerController.listPlayers);

playerRoutes.get('/players/:id', playerController.getPlayer);

playerRoutes.post('/players', playerController.createPlayer);

playerRoutes.put('/players/:id', playerController.updatePlayer);

playerRoutes.delete('/players', playerController.deletePlayer);
