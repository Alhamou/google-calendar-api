// Require google from googleapis package.
const { google } = require('googleapis')
const tz = require("./timeZone.json")


const googleCalendarController = (function(){

    const obj = {}
    const scopes = ["https://www.googleapis.com/auth/calendar","https://www.googleapis.com/auth/calendar.events"]
    let timeZone = "Europe/Berlin"


    
    // obj.initTimeZone = (function(){
    
    //     const {timezones} = tz.find(data=> data.country_code === "DE")

    //     timeZone = timezones[0]

    // })()

    obj.initOAuth2 = (function(){

        // Require oAuth2 from our google instance.
        const { OAuth2 } = google.auth

        // Create a new instance of oAuth and set our Client ID & Client Secret.
        return new OAuth2(process.env.GOOGLE_CLIENT_ID,process.env.CLIENT_SECRET,process.env.REDIRECT_URL)

    })()


    obj.setAppointment = async function(){


        return new Promise(async (resolve, reject)=>{


            // Create a new calender instance.
            const calendar = google.calendar({ version: 'v3', auth: obj.initOAuth2 })


            const eventObj = obj.createEvent()

            try{

                // Check if we a busy and have an event on our calendar for the same time.
                const {data} = await calendar.freebusy.query({resource: {
                                                                timeMin: eventObj.eventStartTime,
                                                                timeMax: eventObj.eventEndTime,
                                                                timeZone: timeZone,
                                                                items: [{ id: 'primary' }]}
                                                            })
                                                                

                // Check if event array is empty which means we are not busy
                if ((data.calendars.primary.busy).length === 0){

                    // If we are not busy create a new calendar event.
                    calendar.events.insert({ calendarId: 'primary', resource: eventObj }, (err, event) => {

                        if (err) throw err
                        
                        console.log("Send Event, OK 200")
                        resolve(event)
                        
                    })
                    
                } else {
                    
                    throw "Sorry I'm busy..."
                }

            }catch(error){
                console.log(error)
                reject(error)
            }


        })


        

    }

    obj.getUrlAuth = async function(){

        return new Promise((resolve, reject)=>{

            try{

                const url = obj.initOAuth2.generateAuthUrl({ access_type: 'offline', scope: scopes});
                console.log(timeZone)
                resolve(url)

            } catch(error){

                reject(error)
            }


        })



    }

    obj.provideObjectData = async function(data){

        console.log(data)

        try{
            const {tokens} = await obj.initOAuth2.getToken(data.code)
        
            console.log(tokens)


            // refresh_token in the response on the first authorisation
            tokens["refresh_token"] = process.env.REFRESH_TOKEN
    
            // refresh_token in the response on the first authorisation
            // TODO, delete access token just for testing.
            delete tokens["access_token"]
            
            console.log(tokens)

            // Call the setCredentials method on our oauth2Client instance and set our refresh token.
            obj.initOAuth2.setCredentials(tokens);
    
            return await googleCalendarController.setAppointment()

        } catch(error){

            throw error
        }


    }

    obj.sendTest = async function(){

        try{
            const authObj = {
                access_token: 'ya29.a0ARrdaM9A6OZ5fuzib9esgT65Q8LwwzvnkcBPoSjJxzcC3WPvSKroVEFilJpBK0b8VJTROYoj_2CwGzNhlHy6p1HZiZwjAH3OfWCJTOmyXY-dos0cE2-U0XgmmgBjvGbMvBMBylXfWPGcKup1JSONsmZkA3bOGw',
                scope: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events',
                token_type: 'Bearer',
                expiry_date: 1639976683462
            }

            obj.initOAuth2.setCredentials(authObj);

            return await googleCalendarController.setAppointment()

        } catch(error){
            throw error
        }


    }

    obj.createEvent = function(){

        // Create a new event start date instance for temp uses in our calendar.
        const eventStartTime = new Date()

        eventStartTime.setDate(eventStartTime.getDate() + 1)
        eventStartTime.setMinutes(eventStartTime.getMinutes() + 10)


        // Create a new event end date instance for temp uses in our calendar.
        const eventEndTime = new Date()
        eventEndTime.setDate(eventStartTime.getDate())
        eventEndTime.setMinutes(eventStartTime.getMinutes() + 30)

        // Montag, 20. Dezember⋅9:15 bis 9:45PM



        // Create a dummy event for temp uses in our calendar
        return {
                    summary: `Node.js Calendar App`,
                    location: `3595 California St, San Francisco, CA 94118`,
                    description: `Meet with David to talk about the new client project and how to integrate the calendar for booking.`,
                    colorId: 2,
                    start: {
                        dateTime: eventStartTime,
                        timeZone: timeZone,
                    },
                    end: {
                        dateTime: eventEndTime,
                        timeZone: timeZone,
                    },
                    eventStartTime,
                    eventEndTime
                }

    }


    return obj

})()


module.exports = googleCalendarController;
