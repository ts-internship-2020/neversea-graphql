const DataLoader = require("dataloader");
const getConferenceLoaders = dbInstance => {
  return {
    conferenceById: new DataLoader(ids =>
        dbInstance
            .select(
                "Id",
                "Name",
                "ConferenceTypeId",
                "LocationId",
                "CategoryId", 
                "StartDate", 
                "EndDate", 
                "OrganizerEmail"
            )
            .from("Conference")
            .whereIn("Id", ids)
            .then(rows => ids.map(id => rows.find(x => x.id === parseInt(id))))
    ), 
    locationById: new DataLoader(ids =>
        dbInstance
            .select(
                "Id",
                "Name",
                "Address",
                "Longitude", 
                "Latitude",
                "CityId",
                "CountyId",
                "CountryId"
            )
            .from("Location")
            .whereIn("Id", ids)
            .then(rows => ids.map(id => rows.find(x => x.id === id)))
    ), 
    conferenceTypeById: new DataLoader(ids => 
        dbInstance
            .select("Id", "Name")
            .from("DictionaryConferenceType")
            .whereIn("Id", ids)
            .then(rows => ids.map(id => rows.find(x => x.id === id)))
    ), 
    categoryById: new DataLoader(ids =>
        dbInstance
            .select("Id", "Name")
            .from("DictionaryCategory")
            .whereIn("Id", ids)
            .then(rows => ids.map(id => rows.find(x => x.id === id)))
    ), 
    speakersByConferenceId: new DataLoader(ids =>
        dbInstance
            .select("c.IsMainSpeaker", "c.ConferenceId", "s.Id", "s.Name", "s.Nationality", "s.Rating")
            .from("ConferenceXSpeaker AS c")
            .innerJoin("Speaker AS s", "c.SpeakerId", "=", "s.Id")
            .whereIn("c.ConferenceId", ids)
            .then(rows => ids.map(id => rows.filter(x => x.conferenceId === parseInt(id))))
    ), 
    statusByConferenceId: new DataLoader(ids =>
        dbInstance
            .select(
                "dS.Id",
                "dS.Name",
                "c.ConferenceId",
                "c.AttendeeEmail"
            )
            .from("ConferenceXAttendee AS c")
            .innerJoin("DictionaryStatus AS dS", "c.StatusId", "=", "dS.Id")
            .whereIn("c.ConferenceId", ids.map(x => x.id))
            .whereIn("c.AttendeeEmail", ids.map(x => x.userEmail))
            .then(rows => ids.map(i => rows.find(x => x.conferenceId === i.id && x.attendeeEmail === i.userEmail)))
    ),
    countyById: new DataLoader(ids =>
        dbInstance
            .select("Id", "Name")
            .from("DictionaryCounty")
            .whereIn("Id", ids)
            .then(rows => ids.map(id => rows.find(x => x.id === id)))
    ), 
    countryById: new DataLoader(ids =>
        dbInstance
            .select("Id", "Name")
            .from("DictionaryCountry")
            .whereIn("Id", ids)
            .then(rows => ids.map(id => rows.find(x => x.id === id)))
    ), 
    cityById: new DataLoader(ids =>
        dbInstance
            .select("Id", "Name")
            .from("DictionaryCity")
            .whereIn("Id", ids)
            .then(rows => ids.map(id => rows.find(x => x.id === id)))
    )
  }
};
module.exports = { getConferenceLoaders };