import { Controller, Get, Logger, Query } from '@nestjs/common';
import { EventPattern } from "@nestjs/microservices";
import { MainService } from "./main.service";
import {PositionType} from "./schema/car-position.schema";
import {PrometheusService} from "../prometheus/prometheus.service";

@Controller('')
export class MainController {
    private readonly logger = new Logger(MainController.name);

    private numberOfCarStartGauge = this.prometheusService.registerGauge("number_of_car_start_input_events", "number_of_car_start_input_events")
    private numberOfCarStopGauge = this.prometheusService.registerGauge("number_of_car_stop_input_events", "number_of_car_stop_input_events")
    private numberOfCarPositionGauge = this.prometheusService.registerGauge("number_of_car_position_input_events", "number_of_car_position_input_events")
    private numberOfInputEventGauge = this.prometheusService.registerGauge("number_of_input_events", "number_of_input_events")

    constructor(private readonly appService: MainService, private prometheusService: PrometheusService) { }

    @EventPattern('car-position')
    public async receiveNewPosition(data: any) {
        this.numberOfCarPositionGauge.inc(1);
        this.numberOfInputEventGauge.inc(1);
        this.logger.log('car-position ', data)
        await this.appService.addPosition(data.license_plate, data.location['lon'], data.location['lat'], data.time, PositionType.POSITION);
    }

    @EventPattern('car-start')
    public async receiveStart(data: any) {
        this.numberOfCarStartGauge.inc(1);
        this.numberOfInputEventGauge.inc(1);
        this.logger.log('car-start ', data)
        this.appService.addPosition(data.license_plate, data.location['lon'], data.location['lat'], data.time, PositionType.START);
    }

    @EventPattern('car-stop')
    public async receiveStop(data: any) {
        this.numberOfCarStopGauge.inc(1);
        this.numberOfInputEventGauge.inc(1);
        this.logger.log('car-stop ', data)
        await this.appService.addPosition(data.license_plate, data.location['lon'], data.location['lat'], data.time, PositionType.STOP);
        await this.appService.sendRealCarShutdown(data.license_plate);
    }

}
