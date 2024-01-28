export interface IUserActivity {
    id: number;
    user_id: number;
    IP: string;
    socket_ID: string;
    user_agent?: string;
    connected_timestamp: Date;
    disconnected_timestamp?: Date;
}

export interface IUserConnected {
    user_id: number;
    IP: string;
    socket_ID: string;
    user_agent?: string;
    connected_timestamp?: Date;
}

export interface IUserDisconnected {
    socket_ID: string;
    disconnected_timestamp?: Date;
}

export interface IGetLastUserActivitySearchParam {
    user_id: number;
}

export interface IGetUserActivities {
    from_date: Date;
    to_date: Date;
    user_id: number;
}