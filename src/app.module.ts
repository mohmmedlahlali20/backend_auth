import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGO_DB || 'mongodb://localhost:27017/nestjs-auth',
    ),
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
