import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { GatewaysModule } from './gateways/gateways.module';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [
    GatewaysModule,
    ServicesModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
  ],
  providers: [],
})
export class AppModule {}
