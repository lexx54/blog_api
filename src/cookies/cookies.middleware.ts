import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { CookiesService } from './cookies.service';
import { CookieEntity } from './cookies.entity';

@Injectable()
export class CookiesMiddleware implements NestMiddleware {
  constructor(private readonly cookiesService: CookiesService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const cookieConsent = this.cookiesService.getCookie(req, 'accept-cookies');

    if (cookieConsent) {
      this.cookiesService.setCookie(res, 'accept-cookies', 'true', {});

      const cookieLog = new CookieEntity(); // Crea una instancia de la entidad CookieLogEntity
      cookieLog.ipAddress = req.ip; // Puedes almacenar la dirección IP del usuario
      cookieLog.userAgent = req.get('User-Agent'); // Almacena el User-Agent del cliente
      cookieLog.acceptedAt = new Date();
      await this.cookiesService.saveCookie(cookieLog); // Método para guardar en la base de datos

      res.locals.showCookieBanner = true; // Establece la bandera para mostrar el banner en el frontend
    } else {
      res.locals.showCookieBanner = false; // No es necesario mostrar el banner
    }

    next();
  }
}
