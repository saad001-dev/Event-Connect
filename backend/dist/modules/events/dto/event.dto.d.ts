export declare class CreateEventDto {
    name: string;
    slug?: string;
    description?: string;
    startDate: string;
    endDate: string;
    timezone?: string;
    address?: any;
    logo?: string;
    banner?: string;
    website?: string;
    maxAttendees?: number;
    isPublished?: boolean;
}
export declare class UpdateEventDto extends Partial<CreateEventDto> {
}
