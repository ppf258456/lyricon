import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(
  app: INestApplication,
  configService: ConfigService,
) {
  const options = new DocumentBuilder()
    .setTitle(configService.get('SWAGGER_TITLE', 'Default Title'))
    .setDescription(
      configService.get('SWAGGER_DESCRIPTION', 'Default Description'),
    )
    .setVersion(configService.get('SWAGGER_VERSION', '3.0'))
    .build();

  const document = SwaggerModule.createDocument(app, options);
  //   console.log(document);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      // 添加自定义样式
      //   docExpansion: 'list',
      //   tagsSorter: 'status',
      // customCssUrl: customCssFilePath, // 使用绝对路径
      // customSwaggerUiPath: 'http://localhost:3000/custom-swagger.css',
      // customCss: `.swagger-ui .topbar { background-color: #bfa; !important}`, // 示例样式
    },
  });
}
