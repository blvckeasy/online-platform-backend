import Jwt from 'jsonwebtoken';
import { InvalidTokenException } from './errors';
import { ErrorTypes } from './error-handler';

export default class JWT {
    static sign (payload: string | object | Buffer) {
        const token = Jwt.sign(payload, "helloworldhelloworldhelloworld", {
            expiresIn: "7 days"
        });
        return token;
    }

    static verify (token: string) {
        try {
            const payload = Jwt.verify(token, "helloworldhelloworldhelloworld");
            return payload;
        } catch (err) {
            throw new InvalidTokenException("Token has expired!", ErrorTypes.INVALID_TOKEN);
        }
    }
}