"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const logger = new common_1.Logger();
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const listOfConsumersQueues = [];
    if (listOfConsumersQueues.length > 0) {
        for (const queue of listOfConsumersQueues) {
            await app.connectMicroservice({
                transport: microservices_1.Transport.RMQ,
                options: {
                    urls: ['amqp://admin:admin@car-tracker-bus:5672'],
                    queue,
                    queueOptions: {
                        durable: false
                    },
                },
            });
        }
    }
    await app.startAllMicroservices();
    const port = Number(process.env.APP_PORT);
    await app.listen(port | 3000).then(() => {
        logger.verbose(`Listening on port ${port}`);
    });
}
bootstrap();
//# sourceMappingURL=main.js.map