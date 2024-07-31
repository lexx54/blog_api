import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express'; // Importa los tipos Request y Response de Express
import { CookiesService } from './cookies.service';
import { AcceptCookiesDto } from './cookies.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('cookie')
@Controller('cookies')
export class CookiesController {
  constructor(private readonly cookiesService: CookiesService) {}

  @Get()
  @ApiOperation({ summary: 'OPERATIVO' })
  setCookie(@Res() res: Response) {
    this.cookiesService.setCookie(res, 'accept-cookies', 'true', {});
    return 'Cookie establecida';
  }

  @Get('/get-cookie')
  @ApiOperation({ summary: 'OPERATIVO' })
  getCookie(@Req() req: Request) {
    const cookieValue = this.cookiesService.getCookie(req, 'accept-cookies');
    return cookieValue
      ? `Valor de la cookie: ${cookieValue}`
      : 'Cookie no encontrada';
  }

  @Get('/clear-cookie')
  @ApiOperation({ summary: 'OPERATIVO' })
  clearCookie(@Res() res: Response) {
    this.cookiesService.clearCookie(res, 'accept-cookies');
    return 'Cookie eliminada';
  }

  @Post('accept-cookies')
  @ApiOperation({ summary: 'OPERATIVO' })
  async acceptCookies(@Body() body: AcceptCookiesDto, @Res() res: Response) {
    const { accepted } = body;
    try {
      if (accepted) {
        this.cookiesService.setCookie(res, 'accept-cookies', 'true', {
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 dias
        });
        res.status(200).json({ message: 'Cookies aceptadas correctamente' });
      } else {
        this.cookiesService.setCookie(res, 'accept-cookies', 'false', {});
        res.status(200).json({ message: 'Cookies no fueron aceptadas' });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ error: 'Hubo un error al procesar la solicitud' });
    }
  }

  @Get('/pop-up')
  @ApiOperation({ summary: 'NO FUNCIONA' })
  async Headers(@Res() res: Response) {
    // Al enviar la respuesta, verifica si se debe mostrar el banner de cookies
    if (res.locals.showCookieBanner) {
      res.set('Show-Cookie-Banner', 'true'); // Puedes usar un encabezado para indicar que se debe mostrar el banner
    } else {
      res.set('Show-Cookie-Banner', 'false'); // O puedes enviar un valor en el cuerpo de la respuesta
    }

    return 'Respuesta de tu controlador';
  }

  @Get('/pop-up2')
  @ApiOperation({ summary: 'NO FUNCIONA' })
  async PopUp(@Res() res: Response) {
    // ... lógica de tu controlador ...

    // Al enviar la respuesta, verifica si se debe mostrar el banner de cookies
    if (res.locals.showCookieBanner) {
      // Muestra el banner de cookies
      // Por ejemplo, renderiza una página HTML con el banner
      return res.render('cookie-popup'); // Reemplaza 'cookie-popup' con la vista que muestra el banner
    } else {
      // Si no se debe mostrar el banner, redirige o devuelve la respuesta deseada
      return 'Respuesta de tu controlador cuando no se muestra el banner';
    }
  }
}
