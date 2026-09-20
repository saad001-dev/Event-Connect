import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto, UpdateEventDto } from './dto/event.dto';

@Controller('api/v1/events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.eventsService.findAll(query);
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.eventsService.findBySlug(slug);
  }

  @Post()
  create(@Body() data: CreateEventDto) {
    return this.eventsService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateEventDto) {
    return this.eventsService.update(id, data);
  }

  @Get(':eventId/sessions')
  getSessions(@Param('eventId') eventId: string) {
    return this.eventsService.getSessions(eventId);
  }
}