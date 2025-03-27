import { z } from 'zod';

export const registerSchema = z.object({
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    birthday: z.string().min(1, 'Birthday is required'),
    outreach_id: z.number().min(1, 'Outreach ID is required'),
    phone_number: z.string().min(1, 'Phone number is required'),
    cell_leader_id: z.number().nullable(),
    is_leader: z.boolean().default(false),
    is_primary: z.boolean().default(false),
    is_pastor: z.boolean().default(false),
    is_ministry_leader: z.boolean().default(false),
    ministry_id: z.number().nullable(),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

export type RegisterRequest = z.infer<typeof registerSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;

export interface UserDetailsResponse {
    first_name?: string;
    last_name?: string;
    email?: string;
    birthday?: string;
    phone_number?: string;
    cell_leader_id?: number | null;
    outreach_id?: number;
}

export interface AuthResponse {
    token: string;
    user: UserDetailsResponse;
}