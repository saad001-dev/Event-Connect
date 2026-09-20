"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgendaService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
let AgendaService = class AgendaService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getUserAgenda(userId, eventId) {
        const agenda = await this.prisma.agenda.findUnique({
            where: {
                userId_eventId: {
                    userId,
                    eventId,
                },
            },
            include: {
                items: {
                    include: {
                        session: {
                            include: {
                                speakers: {
                                    include: {
                                        speaker: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!agenda) {
            return {
                id: null,
                userId,
                eventId,
                items: [],
            };
        }
        return agenda;
    }
    async addToAgenda(userId, eventId, sessionId) {
        const session = await this.prisma.session.findFirst({
            where: {
                id: sessionId,
                eventId,
            },
        });
        if (!session) {
            throw new common_1.NotFoundException('Session not found');
        }
        let agenda = await this.prisma.agenda.findUnique({
            where: {
                userId_eventId: {
                    userId,
                    eventId,
                },
            },
        });
        if (!agenda) {
            agenda = await this.prisma.agenda.create({
                data: {
                    userId,
                    eventId,
                },
            });
        }
        const existingItem = await this.prisma.agendaItem.findUnique({
            where: {
                agendaId_sessionId: {
                    agendaId: agenda.id,
                    sessionId,
                },
            },
        });
        if (existingItem) {
            throw new common_1.ConflictException('Session already in agenda');
        }
        const conflicts = await this.prisma.agendaItem.findMany({
            where: {
                agendaId: agenda.id,
                session: {
                    startTime: {
                        lt: session.endTime,
                    },
                    endTime: {
                        gt: session.startTime,
                    },
                },
            },
            include: {
                session: true,
            },
        });
        if (conflicts.length > 0) {
            throw new common_1.ConflictException('Time conflict with existing agenda item');
        }
        return this.prisma.agendaItem.create({
            data: {
                agendaId: agenda.id,
                sessionId,
            },
            include: {
                session: {
                    include: {
                        speakers: {
                            include: {
                                speaker: true,
                            },
                        },
                    },
                },
            },
        });
    }
    async removeFromAgenda(userId, eventId, sessionId) {
        const agenda = await this.prisma.agenda.findUnique({
            where: {
                userId_eventId: {
                    userId,
                    eventId,
                },
            },
        });
        if (!agenda) {
            throw new common_1.NotFoundException('Agenda not found');
        }
        const item = await this.prisma.agendaItem.findUnique({
            where: {
                agendaId_sessionId: {
                    agendaId: agenda.id,
                    sessionId,
                },
            },
        });
        if (!item) {
            throw new common_1.NotFoundException('Session not in agenda');
        }
        return this.prisma.agendaItem.delete({
            where: {
                agendaId_sessionId: {
                    agendaId: agenda.id,
                    sessionId,
                },
            },
        });
    }
    async updateAgendaItemNotes(userId, eventId, sessionId, notes) {
        const agenda = await this.prisma.agenda.findUnique({
            where: {
                userId_eventId: {
                    userId,
                    eventId,
                },
            },
        });
        if (!agenda) {
            throw new common_1.NotFoundException('Agenda not found');
        }
        return this.prisma.agendaItem.update({
            where: {
                agendaId_sessionId: {
                    agendaId: agenda.id,
                    sessionId,
                },
            },
            data: { notes },
        });
    }
};
exports.AgendaService = AgendaService;
exports.AgendaService = AgendaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AgendaService);
//# sourceMappingURL=agenda.service.js.map