export const faqTypeDef = `#graphql
    type Faq {
        id: Int!
        question: String!
        answer: String!
    }

    type Query {
        getFaqs: [Faq]
    }
`