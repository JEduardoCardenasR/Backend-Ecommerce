🛒 Backend eCommerce - NestJS API

Este proyecto es un sistema de backend completo para una aplicación de comercio electrónico, desarrollado de forma individual durante el módulo de especialización Backend en Henry, con un enfoque profesional y orientado a producción.
Construido con NestJS, el sistema implementa una arquitectura modular basada en controladores, servicios y repositorios, integrando prácticas modernas de desarrollo, seguridad y escalabilidad.

🚀 Tecnologías utilizadas

NestJS (framework principal)
TypeScript
TypeORM (ORM para PostgreSQL)
PostgreSQL (base de datos relacional)
JWT (autenticación y control de acceso)
Swagger (documentación interactiva de la API)
Jest + Supertest (pruebas e2e)
Dockerfile (para despliegue containerizado)
Middlewares, filtros, pipes y validadores personalizados

🔧 Arquitectura del proyecto

El proyecto utiliza una estructura modular y escalable, con los siguientes módulos principales:
UsersModule: Gestión de usuarios y roles.
AuthModule: Registro, login, autenticación JWT.
ProductsModule: ABM de productos, control de stock y categorías.
CategoriesModule: Asociaciones con productos.
OrdersModule: Creación y visualización de órdenes.
FileUploadModule: Módulo preparado para futuras extensiones como carga de imágenes.

🧩 Funcionalidades principales

🔐 Autenticación y autorización

Registro y login de usuarios.
Tokens JWT con expiración.
Acceso restringido por rol (admin, user).

📦 Gestión de productos

Crear, editar, listar y eliminar productos.
Validaciones estrictas (precio, stock, nombre, etc.).
Asociación a categorías.
Control de stock y disponibilidad.

🧾 Gestión de órdenes

Crear órdenes asociadas a usuarios y productos.
Detalles de orden a través de entidad intermedia.
Relación muchos-a-muchos con integridad referencial.
Visualización y seguimiento de órdenes.

🧪 Pruebas End-to-End (E2E)

Implementadas con Jest y Supertest.
Limpieza de datos entre pruebas sin afectar la DB global.
Cobertura de rutas críticas: login, órdenes, productos.

🛡️ Buenas prácticas y seguridad

Validaciones globales con ValidationPipe.
Manejo de errores con filtros personalizados (GlobalExceptionFilter).
Middleware de logging para monitoreo de solicitudes.
Arquitectura desacoplada entre capas (Controller → Service → Repository).
Variables de entorno y configuración centralizada con @nestjs/config.

📄 Documentación

La API está documentada de forma interactiva con Swagger:
🔗 Acceso: http://localhost:3000/api

Configurado desde el archivo main.ts:
const openApiConfig = new DocumentBuilder()
  .setTitle('NestJS Api - Ecommerce FSPT23')
  .setDescription('Integrative project for the backend specialization of module 4.')
  .setVersion('1.0.0')
  .addBearerAuth()
  .build();

⚙️ Comandos útiles
# Instalar dependencias
npm install

# Levantar el proyecto
npm run start:dev

# Ejecutar pruebas
npm run test:e2e

# Compilar para producción
npm run build

🐳 Docker
Proyecto preparado para ser containerizado:
FROM node:22.11
WORKDIR /app
COPY . ./

🧠 Aptitudes desarrolladas

TypeScript avanzado
Arquitectura NestJS modular
Diseño de base de datos relacional y relaciones complejas
Seguridad con JWT y control de roles
Validaciones personalizadas y manejo de errores
Documentación profesional con Swagger
Testing automatizado e2e
Escalabilidad y buenas prácticas de desarrollo backend

📁 Estructura destacada del código
// app.module.ts
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [typeorm] }),
    TypeOrmModule.forRootAsync({ /* conexión PostgreSQL */ }),
    UsersModule, ProductsModule, AuthModule, OrdersModule, CategoriesModule, FileUploadModule,
    JwtModule.register({ global: true, secret: process.env.JWT_SECRET, signOptions: { expiresIn: '1h' } })
  ],
})
export class AppModule {}

// main.ts
app.useGlobalPipes(new ValidationPipe());
app.useGlobalFilters(new GlobalExceptionFilter());
SwaggerModule.setup('api', app, SwaggerModule.createDocument(app, openApiConfig));

📌 Conclusión
Este backend representa un ejemplo sólido de desarrollo orientado a producción, integrando seguridad, documentación, validaciones, modularidad y pruebas. Está diseñado para escalar fácilmente, incorporando características modernas necesarias en cualquier ecommerce profesional.

Capturas:
![Swagger](https://github.com/user-attachments/assets/0eec4b14-0258-4c9b-80a0-fa7520018af3)
![Swagger1](https://github.com/user-attachments/assets/85c328b0-cf05-4c8a-8b78-a5ae50c56973)
![Swagger2](https://github.com/user-attachments/assets/080dd420-4d0d-423d-92f5-bc7bcd1c20b3)


