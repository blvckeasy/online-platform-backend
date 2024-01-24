import { IGetLastUserActivitySearchParam, IUserActivity, IUserConnected, IUserDisconnected } from "../interfaces/user-activities.interface";
import { client } from "../utils/pg";

export class UserActivitiesService {
    static async connected ( param: IUserConnected ): Promise<IUserActivity> {
        const { user_id, user_agent } = param;
        const newActivity = (await client.query(`
            INSERT INTO user_activities (USER_ID, USER_AGENT) VALUES ($1, $2) RETURNING *;
        `, [user_id, user_agent])).rows[0] as IUserActivity;

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

    static async disconnected ( param: IUserDisconnected ): Promise<IUserActivity | null> {
        const { user_id } = param;
        const updatedActivity = (await client.query(`
            UPDATE user_activities
            SET
                DISCONNECTED_TIMESTAMP = NOW()
            WHERE
                USER_ID = $1 AND DISCONNECTED_TIMESTAMP IS NULL
            RETURNING *
            LIMIT 1;
        `, [user_id])).rows[0] as IUserActivity;

        return updatedActivity;
    }
}