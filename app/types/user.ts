import {UserDetails} from "@/app/types/auth";


export interface UpdateUserDetailsResponse{
    message:string;
    user: UserDetails;
}