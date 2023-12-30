import { BaseContext } from "@apollo/server";
import { FaqService } from "../../../services/faq.service";

export const FaqResolver: BaseContext = {
    Query: {
        getFaqs: async function () {
            const faqs = await FaqService.getFaqs();
            return faqs;
        }
    },
    Mutation: {},
}