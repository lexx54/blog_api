import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response, Request, CookieOptions } from 'express';
import { CookieEntity } from './cookies.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CookiesService {
  constructor(
    @InjectRepository(CookieEntity)
    private readonly cookieRepository: Repository<CookieEntity>,
  ) {}

  async saveCookie(cookieLog: CookieEntity): Promise<CookieEntity> {
    return await this.cookieRepository.save(cookieLog);
  }

  setCookie(
    res: Response,
    name: string,
    value: string,
    options?: CookieOptions,
  ) {
    res.cookie(name, value, options); // Utiliza res.cookie para establecer la cookie
  }

  getCookie(req: Request, name: string) {
    return (req.cookies && req.cookies[name]) || undefined; // Usa req.cookies para obtener el valor de la cookie
  }

  clearCookie(res: Response, name: string) {
    res.clearCookie(name); // Usa res.clearCookie para borrar la cookie
  }
}
