import { IGetLastUserActivitySearchParam, IGetUserActivities, IUserActivity, IUserConnected, IUserDisconnected } from "../interfaces/user-activities.interface";
import { client } from "../utils/pg";

export class UserActivitiesService {
    static async connected ( param: IUserConnected ): Promise<IUserActivity> {
        const { user_id, user_agent, IP, socket_ID } = param;
        const newActivity = (await client.query(`
            INSERT INTO user_activities (USER_ID, USER_AGENT, IP, SOCKET_ID) VALUES ($1, $2, $3, $4) RETURNING *;
        `, [user_id, user_agent, IP, socket_ID])).rows[0] as IUserActivity;

        return newActivity
    }

    static async getLastActivity ( searchParam: IGetLastUserActivitySearchParam ): Promise<IUserActivity | null> {
        const { user_id } = searchParam;
        const foundActivity = (await client.query(`
            SELECT * FROM user_activities 
            WHERE 
                USER_ID = $1 AND DISCONNECTED_TIMESTAMP IS NULL
            LIMIT 1;
        `, [user_id])).rows[0] as IUserActivity;

        return foundActivity;
    }

    static async getUserActivities ( searchParam: IGetUserActivities ): Promise<IUserActivity[] | []> {
        const { from_date, to_date, user_id } = searchParam;
    
        const foundActivities = (await client.query(`
            SELECT * FROM user_activities
            WHERE
                USER_ID = $1 AND CONNECTED_TIMESTAMP >= '$2'::INTERVAL AND CONNECTED_TIMESTAMP <= '$3'::INTERVAL;
        `, [user_id, from_date, to_date || "NOW()"])).rows as IUserActivity[];

        return foundActivities;
    }

    static async disconnected ( param: IUserDisconnected ): Promise<IUserActivity | null> {
        const { socket_ID } = param;
        const updatedActivity = (await client.query(`
            UPDATE user_activities
            SET
                DISCONNECTED_TIMESTAMP = NOW()
            WHERE
                SOCKET_ID = $1 AND DISCONNECTED_TIMESTAMP IS NULL
            RETURNING *
        `, [socket_ID])).rows[0] as IUserActivity;

        return updatedActivity;
    }
}