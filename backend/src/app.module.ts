import { Module } from '@nestjs/common';
import { GatewaysModule } from './gateways/gateways.module';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [GatewaysModule, ServicesModule],
  providers: [],
})
export class AppModule {}
