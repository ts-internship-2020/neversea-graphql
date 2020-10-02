const randomCharacters = require('../../utils/functions').randomCharacters;

const conferenceResolvers = {
    Query: {
        conference: async (_parent, { id }, { dataLoaders }, _info) => {
            const data = await dataLoaders.conferenceById.load(id);
            return data
        },
        conferenceList: async (_parent, { pager, filters }, { dataSources }, _info) => {
            const data = await dataSources.conferenceDb.getConferenceList(pager, filters);
            return data
        }, 
        typeList: async (_parent, _args, { dataSources }, _info) => {
            const data = await dataSources.conferenceDb.getTypeList();
            return data
        },
        categoryList: async (_parent, _args, { dataSources }, _info) => {
            const data = await dataSources.conferenceDb.getCategoryList();
            return data
        },
        countryList: async (_parent, _args, { dataSources }, _info) => {
            const data = await dataSources.conferenceDb.getCountryList();
            return data
        },
        countyList: async (_parent, _args, { dataSources }, _info) => {
            const data = await dataSources.conferenceDb.getCountyList();
            return data
        },
        cityList: async (_parent, _args, { dataSources }, _info) => {
            const data = await dataSources.conferenceDb.getCityList();
            return data
        }, 
        attendeeList: async (_parent, { conferenceId }, { dataSources }, _info) => {
            const data = await dataSources.conferenceDb.getAttendeeList(conferenceId);
            return data
        }
      },

      Mutation: {
        attend: async (_parent, { input }, { dataSources }, _info) => {
            const updateInput = {...input, statusId: 3}
            const statusId = await dataSources.conferenceDb.updateConferenceXAttendee(updateInput);
            return statusId ? randomCharacters(10) : null
        },
        withdraw: async (_parent, { input }, { dataSources }, _info) => {
            const updateInput = {...input, statusId: 2}
            const statusId = await dataSources.conferenceDb.updateConferenceXAttendee(updateInput);
            return statusId
        }, 
        join: async (_parent, { input }, { dataSources }, _info) => {
            const updateInput = {...input, statusId: 1}
            const statusId = await dataSources.conferenceDb.updateConferenceXAttendee(updateInput);
            return statusId
        }, 
        saveConference: async (_parent, { input }, { dataSources }, _info) => {
            const location = await dataSources.conferenceDb.updateLocation(input.location);

            const updatedConference = await dataSources.conferenceDb.updateConference(input);

            //Promise.all takes an iterable of promises and returns a single promise 
            const speakers = await Promise.all(input.speakers.map(async speaker => {
                const updatedSpeaker = await dataSources.conferenceDb.updateSpeaker(speaker);
                const isMainSpeaker = await dataSources.conferenceDb.updateConferenceXSpeaker({
                    conferenceId: updatedConference.id,
                    speakerId: updatedSpeaker.id,
                    isMainSpeaker: speaker.isMainSpeaker
                })
                return {...updatedSpeaker, isMainSpeaker}
            }));

            input.deletedSpeakers && input.deletedSpeakers.length > 0 && await dataSources.conferenceDb.deleteSpeaker(input.deletedSpeakers);
            return { ...updatedConference, location, speakers }
      }},

      ConferenceList: {
        pagination: async (_parent, { pager, filters }, { dataSources }, _info) => {
            const { totalCount } = await dataSources.conferenceDb.getConferenceListTotalCount(filters);
            return { currentPage: pager, totalCount };
        }
      },

      Conference: {
        type: async ({ conferenceTypeId }, _params, { dataLoaders }, _info) => {
            const conferenceType = await dataLoaders.conferenceTypeById.load(conferenceTypeId);
            return conferenceType;
        },
        category: async ({ categoryId }, _params, { dataLoaders }, _info) => {
            const category = await dataLoaders.categoryById.load(categoryId);
            return category;
        },
        location: async ({ locationId }, _params, { dataLoaders }, _info) => {
            const location = await dataLoaders.locationById.load(locationId);
            return location;
        },
        speakers: async ({ id }, _arguments, { dataLoaders }, _info) => {
            const speakers = await dataLoaders.speakersByConferenceId.load(id);
            return speakers;
        },
        status: async ({ id }, { userEmail }, { dataLoaders }, _info) => {
            const status = await dataLoaders.statusByConferenceId.load({ id, userEmail })
            return status
        }        
      },
      
      Location: {
        city: async ({ cityId }, _params, { dataLoaders }, _info) => {
            const city = await dataLoaders.cityById.load(cityId);
            return city;
        },
        county: async ({ countyId }, _params, { dataLoaders }, _info) => {
            const county = await dataLoaders.countyById.load(countyId);
            return county;
        },
        country: async ({ countryId }, _params, { dataLoaders }) => {
            const country = await dataLoaders.countryById.load(countryId);
            return country;
        }
      }

}

module.exports = conferenceResolvers;