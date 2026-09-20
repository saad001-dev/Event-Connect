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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgendaController = void 0;
const common_1 = require("@nestjs/common");
const agenda_service_1 = require("./agenda.service");
let AgendaController = class AgendaController {
    constructor(agendaService) {
        this.agendaService = agendaService;
    }
    async getAgenda(req, eventId) {
        const userId = req.user?.id || 'temp-user-id';
        return this.agendaService.getUserAgenda(userId, eventId);
    }
    async addToAgenda(req, eventId, sessionId) {
        const userId = req.user?.id || 'temp-user-id';
        return this.agendaService.addToAgenda(userId, eventId, sessionId);
    }
    async removeFromAgenda(req, eventId, sessionId) {
        const userId = req.user?.id || 'temp-user-id';
        return this.agendaService.removeFromAgenda(userId, eventId, sessionId);
    }
    async updateNotes(req, eventId, sessionId, notes) {
        const userId = req.user?.id || 'temp-user-id';
        return this.agendaService.updateAgendaItemNotes(userId, eventId, sessionId, notes);
    }
};
exports.AgendaController = AgendaController;
__decorate([
    (0, common_1.Get)(':eventId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AgendaController.prototype, "getAgenda", null);
__decorate([
    (0, common_1.Post)(':eventId/sessions/:sessionId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __param(2, (0, common_1.Param)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], AgendaController.prototype, "addToAgenda", null);
__decorate([
    (0, common_1.Delete)(':eventId/sessions/:sessionId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __param(2, (0, common_1.Param)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], AgendaController.prototype, "removeFromAgenda", null);
__decorate([
    (0, common_1.Patch)(':eventId/sessions/:sessionId/notes'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __param(2, (0, common_1.Param)('sessionId')),
    __param(3, (0, common_1.Body)('notes')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], AgendaController.prototype, "updateNotes", null);
exports.AgendaController = AgendaController = __decorate([
    (0, common_1.Controller)('api/v1/agenda'),
    __metadata("design:paramtypes", [agenda_service_1.AgendaService])
], AgendaController);
//# sourceMappingURL=agenda.controller.js.map