export interface IUserActivity {
    id: number;
    user_id: number;
    user_agent?: string;
    connected_timestamp: Date;
    disconnected_timestamp?: Date;
}

export interface IUserConnected {
    user_id: number;
    user_agent: string;
    connected_timestamp?: Date;
}

export interface IUserDisconnected {
    user_id: number;
    disconnected_timestamp?: Date;
}

export interface IGetLastUserActivitySearchParam {
    user_id: number;
}