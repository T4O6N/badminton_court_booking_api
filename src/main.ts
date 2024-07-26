import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger/swagger.config';
import { ResponseInterceptor } from './config/interceptors/response.interceptor';

async function main() {
    const nestApp = await NestFactory.create(AppModule);
    nestApp.enableCors();
    nestApp.useGlobalInterceptors(new ResponseInterceptor());
    setupSwagger(nestApp);
    await nestApp.listen(process.env.PORT);
    console.log(
        ` ############################################################### \n  * 🚀 Application is running on: http://127.0.0.1:${process.env.PORT}/api 🚀 *\n ###############################################################`,
    );
}
main();
