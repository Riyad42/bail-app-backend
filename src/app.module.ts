  import { Module } from '@nestjs/common';
  import { join } from 'path';
  import { ConfigModule } from '@nestjs/config';
  import { AuthModule } from './auth/auth.module';
  import { MailerModule } from '@nestjs-modules/mailer';
  import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
  import { PrismaService } from './prisma.service';
  import { BienModule } from './bien/bien.module';
  import { LocataireModule } from './locataire/locataire.module';
  import { BailModule } from './bail/bail.module';
  import { PaiementLoyerModule } from './paiement-loyer/paiement-loyer.module';
  import { DashboardModule } from './dashboard/dashboard.module';
  import { PowensModule } from './powens/powens.module';
  import { ScheduleModule } from '@nestjs/schedule';
  import { PaiementLoyerCron } from './cron/paiement-loyer.cron';
  import { DetectionPaiementCron } from './cron/detection-paiement.cron';
  import { UpdateFiabiliteCron } from './cron/update-fiabilite.cron';

  @Module({
    imports: [
      MailerModule.forRoot({
        transport: {
          host: 'smtp.zoho.eu',
          port: 465,
          secure: true,
          auth: {
            user: 'support@nuvity.net',
            pass: 'Beyblade2001@@',
          },
        },
        defaults: {
          from: '"Nuvity" <support@nuvity.net>',
        },
        template: {
          dir: join(process.cwd(), "templates"),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      ConfigModule.forRoot({
        isGlobal: true,
      }),
      AuthModule, BienModule, LocataireModule, BailModule, PaiementLoyerModule, DashboardModule, PowensModule, ScheduleModule.forRoot()
    ],
    providers: [PrismaService, PaiementLoyerCron, DetectionPaiementCron, UpdateFiabiliteCron]
  })

  export class AppModule { }
