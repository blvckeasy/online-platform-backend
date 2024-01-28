import { BaseContext } from "@apollo/server";
import { InvalidTokenException, RequiredParamException } from "../../../utils/errors";
import { ErrorTypes } from "../../../utils/error-handler";
import JWT from "../../../utils/jwt";
import { IParsedAccessToken } from "../../../interfaces/jwt.interface";
import { IGetUserActivitiesInput } from "../../../interfaces/user-activities.interface";
import { UserActivitiesService } from "../../../services/user-activities.service";

export const userActivitiesResolver: BaseContext = {
    Mutation: {
        getMyActivities: async function (parent: any, { getActivitiesInput }: { getActivitiesInput: IGetUserActivitiesInput }, context: any) {
            const token = context.req.headers.token as string;
            if (!token) throw new RequiredParamException("Token is require!", ErrorTypes.REQUIRED_PARAM);

            const user = JWT.verify(token) as IParsedAccessToken;
            if (!user) throw new InvalidTokenException("Token is invalid!", ErrorTypes.INVALID_TOKEN);

            const currentDate = new Date()
            const from_date = getActivitiesInput.from_date || new Date(currentDate.setMonth(currentDate.getMonth() - 1));
            const to_date = getActivitiesInput.to_date

            const activities = await UserActivitiesService.getUserActivities({
                from_date,
                user_id: user.id,
                to_date: to_date || currentDate,
            })

            console.log(activities);

            return "working"
        }
    }
} 