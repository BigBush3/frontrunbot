import { Module } from '@nestjs/common';
import { ServicesModule } from 'src/services/services.module';
import { MainGateway } from './main.gateway';

@Module({
  imports: [ServicesModule],
  providers: [MainGateway],
})
export class GatewaysModule {}
