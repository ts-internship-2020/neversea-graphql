const { gql } = require('apollo-server');

const conferenceTypeDefs = gql`

type Type {
    id: ID!
    name: String!
}

type Category {
    id: ID!
    name: String!
}

type County {
    id: ID!
    name: String!
}

type Country {
    id: ID!
    name: String!
}

type City {
    id: ID!
    name: String!
}

type Location {
    id: ID!
    name: String
    address: String
    latitude: String 
    longitude: String
    county: County!
    country: Country!
    city: City!
}

type Speaker {
    id: ID!
    name: String!
    nationality: String
    rating: Float
    isMainSpeaker: Boolean
}

type Status {
    id: ID!
    name: String!
}


type Conference {
    id: ID!
    name: String!
    startDate: DateTime!
    endDate: DateTime!
    type: Type!
    category: Category!
    location: Location!
    speakers: [Speaker!]!
    status(userEmail: String!): Status
}

type ConferenceList {
    values: [Conference!]!
    pagination(pager: PagerInput, filters: ConferenceFilterInput): Pagination
}

input ConferenceFilterInput {
    startDate: DateTime
    endDate: DateTime,
    organizerEmail: String
}

extend type Query {
    conference(id: ID!): Conference!
    conferenceList(pager: PagerInput, filters: ConferenceFilterInput): ConferenceList
    typeList: [Type!]!
    categoryList: [Category!]!
    countryList: [Country!]!
    countyList: [County!]!
    cityList: [City!]!
}
`;

module.exports = conferenceTypeDefs