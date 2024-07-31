import { Injectable } from '@nestjs/common';
// import * as fs from 'fs';
// import * as path from 'path';

@Injectable()
export class PdfService {
  // async uploadPDF(files: Array<Express.Multer.File>, clientId: number) {
  //   const clientFolder = `public/${clientId}`;
  //   if (!fs.existsSync(clientFolder)) {
  //     fs.mkdirSync(clientFolder);
  //   }
  //   const pdfPaths = [];
  //   for (const file of files) {
  //     const filePath = path.join(clientFolder, file.originalname);
  //     fs.writeFileSync(filePath, file.buffer);
  //     pdfPaths.push(filePath);
  //   }
  //   // Guarda las rutas de los archivos PDF en la base de datos para el cliente específico
  //   // Puedes hacer uso de TypeORM aquí para actualizar la entidad ClientEntity con las nuevas rutas de PDF
  //   return { message: 'Archivos subidos correctamente' };
  // }
}
