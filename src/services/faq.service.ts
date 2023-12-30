import { IFaq } from "../interfaces/faq.interface";
import { client } from "../utils/pg";

export class FaqService {
    static async getFaqs (): Promise<IFaq[]> {
        const faqs: IFaq[] = (await client.query(`
            SELECT * FROM faq;
        `)).rows;

        return faqs;
    }
}