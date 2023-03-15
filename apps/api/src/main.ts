import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as session from "express-session";
import * as passport from "passport";
import { urlencoded, json } from "express";

import { AppModule } from "./app.module";
import { loginSecret } from "./auth/constants";
import { memoryStore } from "./memory-store";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.use(
    session({
      secret: loginSecret,
      resave: false,
      saveUninitialized: false,
      unset: "destroy",
      store: memoryStore,
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());
  app.useGlobalPipes(new ValidationPipe());

  app.use(json({ limit: "50mb" }));

  const config = new DocumentBuilder()
    .setTitle("PEPSI Machine")
    .setDescription("PEPSI API docs")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
  });
  SwaggerModule.setup("/docs", app, document);

  await app.listen(3000);
}
bootstrap();
