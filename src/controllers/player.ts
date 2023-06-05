import { Request, Response } from 'express';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

import { prisma } from '../lib/prisma';

const bodySchema = z.object(
  {
    name: z
      .string({ required_error: 'Player name is required' })
      .min(3, 'Player name must have at least 3 characters'),
    age: z
      .number({ required_error: 'Player age is required' })
      .min(16, 'Player must be at least 16 years old')
  },
  { required_error: 'Player data are required' }
);

const paramsSchema = z.object({
  id: z.string().cuid({ message: 'Player ID is not a valid CUID' })
});

export const playerController = {
  async listPlayers(req: Request, res: Response) {
    try {
      const players = await prisma.player.findMany();

      return res.status(200).json({ data: players });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getPlayer(req: Request, res: Response) {
    try {
      const { id } = paramsSchema.parse(req.params);

      const player = await prisma.player.findFirst({ where: { id } });

      if (!player) {
        return res.status(404).json({ error: 'Player not found' });
      }

      return res.status(200).json({ data: player });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);

        return res.status(400).json({ error: validationError.details[0].message });
      }

      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  async createPlayer(req: Request, res: Response) {
    try {
      const data = bodySchema.parse(req.body.data);

      const player = await prisma.player.create({ data });

      return res.status(201).json({ data: player, message: 'Player created' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);

        return res.status(400).json({ error: validationError.details[0].message });
      }

      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  async updatePlayer(req: Request, res: Response) {
    try {
      const { id } = paramsSchema.parse(req.params);
      const data = bodySchema.parse(req.body.data);

      const player = await prisma.player.update({ where: { id }, data });

      return res.status(200).json({ data: player, message: 'Player updated' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);

        return res.status(400).json({ error: validationError.details[0].message });
      }

      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  async deletePlayer(req: Request, res: Response) {
    try {
      const { id } = paramsSchema.parse(req.params);

      await prisma.player.delete({ where: { id } });

      return res.status(200).json({ message: 'Player deleted' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);

        return res.status(400).json({ error: validationError.details[0].message });
      }

      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};
