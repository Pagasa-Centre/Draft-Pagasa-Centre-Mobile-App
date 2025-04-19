

export interface GetAllMediaResponse{
    message:string;
    media?:MediaItem[]
}

export type MediaItem = {
    id: number;
    title: string;
    description: string;
    youtube_video_id: string;
    category: string;
    published_at: string;
    thumbnail_url: string;
};