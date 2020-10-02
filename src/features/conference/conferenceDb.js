const { SQLDataSource } = require("../../utils/sqlDataSource");

class ConferenceDb extends SQLDataSource {

    generateWhereClause(queryBuilder, filters = {}) {
        const { startDate, endDate, organizerEmail } = filters; 

        if(startDate) queryBuilder.andWhere("StartDate", ">=", startDate)
        if(endDate) queryBuilder.andWhere("EndDate", "<=", endDate)
        if(organizerEmail) queryBuilder.andWhere("OrganizerEmail", organizerEmail)

    } 

    async getConferenceList(pager, filters) {
        const { page, pageSize } = pager;

        const values = await this.knex
                                    .select(
                                        "Id",
                                        "Name",
                                        "ConferenceTypeId",
                                        "LocationId",
                                        "CategoryId", 
                                        "StartDate", 
                                        "EndDate", 
                                        "OrganizerEmail")
                                    .from("Conference")
                                    .modify(this.generateWhereClause, filters)
                                    .orderBy("Id")
                                    .offset(page * pageSize)
                                    .limit(pageSize)

        return { values }
    }

    async getConferenceListTotalCount(filters) {
        return await this.knex("Conference")
                            .count("Id", {as: "TotalCount"})
                            .modify(this.generateWhereClause, filters)
                            .first()
    }

    async getTypeList() {
        return await this.knex
                            .select("Id", "Name")
                            .from("DictionaryConferenceType")
    }

    async getCategoryList() {
        return await this.knex
                            .select("Id", "Name")
                            .from("DictionaryCategory")
    }

    async getCityList() {
        return await this.knex
                            .select("Id", "Name")
                            .from("DictionaryCity")
    }

    async getCountyList() {
        return await this.knex
                            .select("Id", "Name")
                            .from("DictionaryCounty")
    }

    async getCountryList() {
        return await this.knex
                            .select("Id", "Name")
                            .from("DictionaryCountry")
    }

    async getAttendeeList(conferenceId) {
        return await this.knex
                            .select("Id","AttendeeEmail", "ConferenceId", "StatusId")
                            .from("ConferenceXAttendee")
                            .where("ConferenceId", conferenceId)
                            .andWhere(function() {this.where("StatusId", 1).orWhere("StatusId", 3)});
    }

    async updateConferenceXAttendee({attendeeEmail, conferenceId, statusId}) {
        const current = await this.knex
                                     .select("AttendeeEmail","ConferenceId", "Id") 
                                     .from("ConferenceXAttendee")
                                     .where("AttendeeEmail",attendeeEmail)
                                     .andWhere("ConferenceId", conferenceId)
                                     .first();

        const attendee = {
            AttendeeEmail: attendeeEmail, 
            ConferenceId: conferenceId, 
            StatusId: statusId
        }

        let result 
        if (current && current.id) {
            result = await this.knex("ConferenceXAttendee")
                                    .update(attendee, "StatusId")
                                    .where("Id", current.id)
        }

        else {
            result = await this.knex("ConferenceXAttendee")
                                    .returning("StatusId")
                                    .insert(attendee)
        }

        return result[0];
    }

    async updateLocation(location) {
        const content = {
            Name: location.name, 
            Address: location.address, 
            Latitude: location.latitude, 
            Longitude: location.longitude, 
            CityId: location.cityId, 
            CountyId: location.countyId, 
            CountryId: location.countryId       
        }
        const output = [
            "Id",
            "Name", 
            "Address",
            "Latitude",
            "Longitude", 
            "CityId",
            "CountyId", 
            "CountryId"
        ]

        let result; 

        if(location.id) {
            result = this.knex("Location")
                        .update(content, output)
                        .where("Id", location.id)
        } else {
            result = this.knex("Location")
                        .returning(output)
                        .insert(content)
        }

        return result[0];

    }

    async updateConference({ id, name, organizerEmail, startDate, endDate, location, category, type}) {
        const content = {
            Name: name, 
            OrganizerEmail: organizerEmail, 
            StartDate: startDate, 
            EndDate: endDate, 
            LocationId: location.id, 
            ConferenceTypeId: type.id,
            CategoryId: category.id
        };

        const output = [
            "Id", 
            "Name",
            "OrganizerEmail", 
            "StartDate", 
            "EndDate", 
            "LocationId", 
            "ConferenceTypeId", 
            "CategoryId"
        ];

        let result; 

        if (id) {
            result = await this.knex("Conference")
                                .update(content, output)
                                .where("Id", id);
        } else {
            result = await this.knex("Conference")
                                .returning(output)
                                .insert(content);
        }

        return result[0];
    }

    async updateSpeaker({ id, name, nationality, rating }) {
        const content = {
            Name: name, 
            Nationality: nationality, 
            Rating: rating 
        }

        const output = [
            "Id", 
            "Name", 
            "Nationality", 
            "Rating"
        ]

        let result; 

        if (id) {
            result = await this.knex("Speaker")
                                .update(content, output)
                                .where("Id", id); 
        } else {
            result = await this.knex("Speaker")
                                .returning(output)
                                .insert(content);
        }

        return result[0];
    }

    async updateConferenceXSpeaker ({ speakerId, isMainSpeaker, conferenceId}) {
        const current = await this.knex
                                    .select("Id")
                                    .from("ConferenceXSpeaker")
                                    .where("SpeakerId", speakerId)
                                    .andWhere("ConferenceId", conferenceId)
                                    .first();
        
        let result; 
        if (current.id) {
            result = await this.knex("ConferenceXSpeaker")
                                .update({ IsMainSpeaker: Boolean(isMainSpeaker) }, "IsMainSpeaker")
                                .where("Id", current.id);
        } else {
            result = await this.knex("ConferenceXSpeaker")
                                .returning("IsMainSpeaker")
                                .insert({ SpeakerId: speakerId, isMainSpeaker: Boolean(isMainSpeaker), ConferenceId: conferenceId })
        }

        return result[0];
    }

    async deleteSpeaker(speakerIds) {
        await this.knex("ConferenceXSpeaker")
                    .whereIn("SpeakerId", speakerIds)
                    .del(); 
        
        await this.knex("Speaker")
                    .whereIn("Id", speakerIds)
                    .del();
    }


}

module.exports = ConferenceDb;