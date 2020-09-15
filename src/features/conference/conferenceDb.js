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


}

module.exports = ConferenceDb;