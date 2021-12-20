// Require google from googleapis package.
const { google } = require('googleapis')


const googleCalendarController = (function(){

    const obj = {}
    const scopes = ["https://www.googleapis.com/auth/calendar","https://www.googleapis.com/auth/calendar.events"]


    obj.init = (function(){

        // Require oAuth2 from our google instance.
        const { OAuth2 } = google.auth

        // Create a new instance of oAuth and set our Client ID & Client Secret.
        return new OAuth2(process.env.GOOGLE_CLIENT_ID,process.env.CLIENT_SECRET,process.env.REDIRECT_URL)

    })()


    obj.setAppointment = async function(){


        return new Promise((resolve, reject)=>{


            // Create a new calender instance.
            const calendar = google.calendar({ version: 'v3', auth: obj.init })

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
            const event = {
            summary: `Node.js Calendar App`,
            location: `3595 California St, San Francisco, CA 94118`,
            description: `Meet with David to talk about the new client project and how to integrate the calendar for booking.`,
            colorId: 2,
            start: {
                dateTime: eventStartTime,
                timeZone: 'Europe/Berlin',
            },
            end: {
                dateTime: eventEndTime,
                timeZone: 'Europe/Berlin',
            },
            }

            // Check if we a busy and have an event on our calendar for the same time.
            calendar.freebusy.query(
            {
                resource: {
                timeMin: eventStartTime,
                timeMax: eventEndTime,
                timeZone: 'Europe/Berlin',
                items: [{ id: 'primary' }],
                },
            },
            (err, res) => {
                // Check for errors in our query and log them if they exist.
                if (err) return console.error('Free Busy Query Error: ', err)

                // Create an array of all events on our calendar during that time.
                const eventArr = res.data.calendars.primary.busy

                // Check if event array is empty which means we are not busy
                if (eventArr.length === 0)
                // If we are not busy create a new calendar event.
                return calendar.events.insert({ calendarId: 'primary', resource: event }, (err, event) => {
                        // Check for errors and log them if they exist.
                        if (err) {
                            return reject(err)
                        }
                        
                        // Else log that the event was created.
                        resolve(event)
                    }
                )

                // If event array is not empty log that we are busy.
                reject("Sorry I'm busy...")
            }
            )

        })


        

    }

    obj.getUrlAuth = async function(){

        return new Promise((resolve, reject)=>{

            try{

                const url = obj.init.generateAuthUrl({ access_type: 'offline', scope: scopes});

                resolve(url)

            } catch(error){

                reject(error)
            }


        })



    }

    obj.provideObjectData = async function(data){

        console.log(data)

        try{
            const {tokens} = await obj.init.getToken(data.code)
        
            console.log(tokens)


            // refresh_token in the response on the first authorisation
            tokens["refresh_token"] = process.env.REFRESH_TOKEN
    
            // refresh_token in the response on the first authorisation
            // TODO, delete access token just for testing.
            delete tokens["access_token"]
            
            console.log(tokens)

            // Call the setCredentials method on our oauth2Client instance and set our refresh token.
            obj.init.setCredentials(tokens);
    
            return await googleCalendarController.setAppointment()

        } catch(error){

            throw error
        }


    }


    return obj

})()

module.exports = googleCalendarController;
