import { Controller, Get, Res, Req, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { join } from 'path';

@Controller() // Captura todas las rutas
export class AppController {
  @Get()
  catchAll(@Req() req: Request, @Res() res: Response) {
    // Excluye rutas de la API u otras rutas específicas si es necesario
    if (req.path.startsWith('/api') && req.path.startsWith('/doc')) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'Not Found' });
    }

    // Envía index.html para manejar rutas de la SPA
    res.sendFile(join(__dirname, '../../', 'front/dist', 'index.html'));
  }
}
