export interface ICourse {
    id: number;
    user_id: number;
    name: string;
    price?: number;
}

export interface IGetCourse {
    id?: number;
}