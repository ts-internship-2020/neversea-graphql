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

type Attendee {
    id: ID!
    attendeeEmail: String!
    conferenceId: Int!
    statusId: Int!
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
    endDate: DateTime
    organizerEmail: String
}

input AttendeeInput {
    attendeeEmail: String!
    conferenceId: ID!
}

input TypeInput {
    id: ID
    name: String
}

input CategoryInput {
    id: ID
    name: String
}

input SpeakerInput {
    id: ID
    name: String
    isMainSpeaker: Boolean
    nationality: String
    rating: Float
}

input LocationInput {
    id: ID
    name: String
    address: String
    latitude: String
    longitude: String
    cityId: ID!
    countyId: ID!
    countryId: ID!
}

input ConferenceInput {
    id: ID 
    name: String!
    startDate: DateTime!
    endDate: DateTime!
    organizerEmail: String!
    type: TypeInput
    category: CategoryInput 
    location: LocationInput!
    speakers: [SpeakerInput!]!
    deletedSpeakers: [ID]
}

extend type Query {
    conference(id: ID!): Conference!
    conferenceList(pager: PagerInput, filters: ConferenceFilterInput): ConferenceList
    typeList: [Type!]!
    categoryList: [Category!]!
    countryList: [Country!]!
    countyList: [County!]!
    cityList: [City!]!
    attendeeList(conferenceId: Int!): [Attendee!]!
}

extend type Mutation {
    attend(input: AttendeeInput!): String
    withdraw(input: AttendeeInput!): String    
    join(input: AttendeeInput!): String
    saveConference(input: ConferenceInput!): Conference!
}
`;

module.exports = conferenceTypeDefs