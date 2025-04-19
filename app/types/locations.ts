

export type Outreach = {
    id: number;
    name: string;
    image?: string; // Optional for now
    address_line_1: string;
    address_line_2?: string;
    post_code?: string;
    city: string;
    country: string;
    phone?: string;
    coordinates?: { lat: number; lng: number };
    thumbnail_url:string;
    services?:Services
};

interface Services{
    start_time:string;
    end_time:string;
    day:string;
}

export interface GetAllOutreachesResponse{
    message:string;
    outreaches?: Outreach[];
}