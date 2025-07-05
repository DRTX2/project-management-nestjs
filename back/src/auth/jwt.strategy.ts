import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'defaultSecretKey',
    });
  }

  async validate(payload: any): Promise<any> {
    return { userId: payload.sub, username: payload.username };
  }
}


/*




**Corrección rápida**

* **Original:** “ajajaja, no me importa, vamos a movernos de nuevo al backend con nestjs, vamos a hacer la parte de autentificacion; Ya tengo un servicio para crear usuarios”
* **Corregido:** “Ajajaja, no me importa. Vamos a movernos de nuevo al backend con NestJS y hacer la parte de autenticación. Ya tengo un servicio para crear usuarios.”

---

## Implementación de Autenticación con JWT en NestJS

### 1. Instalar dependencias necesarias

```bash
npm install --save @nestjs/jwt @nestjs/passport passport passport-local passport-jwt bcrypt
npm install --save-dev @types/passport-local @types/passport-jwt @types/bcrypt
```

### 2. Estructura de módulos

```
src/
├── auth/
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── auth.controller.ts
│   ├── jwt.strategy.ts
│   ├── local.strategy.ts
│   └── dto/
│       ├── login.dto.ts
│       └── payload.dto.ts
└── users/
    └── users.service.ts  (ya tienes)
```

### 3. DTOs para login y payload

```typescript
// src/auth/dto/login.dto.ts
export class LoginDto {
  username: string;  // o email
  password: string;
}

// src/auth/dto/payload.dto.ts
export class JwtPayload {
  sub: number;       // userId
  username: string;
}
```

### 4. `AuthModule` y configuración de JWT

```typescript
// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'SECRET_KEY',  // guarda en .env
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
```

### 5. `AuthService`: validación y generación de token

```typescript
// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // Verifica credenciales
  async validateUser(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    if (user && await bcrypt.compare(password, user.passwordHash)) {
      const { passwordHash, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Credenciales inválidas');
  }

  // Crea JWT
  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
```

### 6. Estrategias de Passport

```typescript
// src/auth/local.strategy.ts
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'username' });  // o 'email'
  }

  async validate(username: string, password: string): Promise<any> {
    return this.authService.validateUser(username, password);
  }
}

// src/auth/jwt.strategy.ts
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'SECRET_KEY',
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
```

### 7. `AuthController`: endpoints de login y prueba

```typescript
// src/auth/auth.controller.ts
import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Endpoint de login
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  // Ruta protegida de ejemplo
  @UseGuards(AuthGuard('jwt'))
  @Post('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
```

### 8. Integrar en `AppModule`

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
// ...otros imports

@Module({
  imports: [
    AuthModule,
    UsersModule,
    // ...
  ],
})
export class AppModule {}
```

---

Con esto tendrás un flujo completo de **registro de usuarios**, **inicio de sesión** y **protección de rutas** con JWT en tu backend NestJS. Cuando lo implementes, prueba con Postman:

1. **POST /auth/login** con `{ username, password }` → recibe `access_token`.
2. Añade header `Authorization: Bearer <token>` para acceder a rutas protegidas (`/auth/profile`).

¡Éxitos con la autenticación!



*/