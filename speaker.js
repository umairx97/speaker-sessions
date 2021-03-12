const { checkFields, getSpeakerRegistrationFee, isSpeakerEligible } = require('./utils')
const { DOMAINS, OT } = require('./constants')

const WebBrowser = {
  BrowserName: {
    Unknown: 'Unknown',
    InternetExplorer: 'InternetExplorer',
    Firefox: 'Firefox',
    Chrome: 'Chrome',
    Opera: 'Opera',
    Safari: 'Safari',
    Dolphin: 'Dolphin',
    Konqueror: 'Konqueror',
    Linx: 'Linx'
  }
}

Object.freeze(WebBrowser)

const IsIE = (browser) => browser.name === WebBrowser.BrowserName.InternetExplorer

function Speaker () {
  const Speaker = this

  // Register a speaker and return speakerID
  this.register = function (repository) {
    // let's init some variables
    let speakerId = null
    let speakerEligible = false
    let appr = false
    // Check if user has all the fields required
    checkFields(Speaker)

    // We're now requiring 3 certificatons so I changes the hard coded number
    speakerEligible = isSpeakerEligible(Speaker)

    if (!speakerEligible) {
      // need to get just the domain from the email
      const emailParts = Speaker.email.split('@')
      const emailDomain = emailParts[emailParts.length - 1]

      if (
        !DOMAINS.includes(emailDomain) &&
        !(IsIE(Speaker.browser) &&
        Speaker.browser.majorVersion < 9)
      ) {
        speakerEligible = true
      }
    }

    if (!speakerEligible) throw new Error("Speaker doesn't meet our abitrary and capricious standards.")

    if (!Speaker.sessions.length) throw new Error("Can't register speaker with no sessions to present.")

    for (const session of Speaker.sessions) {
      for (const tech of OT) {
        const { title, description } = session

        if (title.includes(tech) || description.includes(tech)) {
          session.approved = false
          break
        } else {
          session.aprroved = true
          appr = true
        }
      }
    }

    if (!appr) throw new Error('No sessions approved.')

    // if we got this far, the speaker is approved
    // let's go ahead and register him/her now.
    // First, let's calculate the registration fee.
    // More experienced speakers pay a lower fee.
    Speaker.registrationFee = getSpeakerRegistrationFee(Speaker.exp)

    speakerId = repository.saveSpeaker(this)
    return speakerId
  }
}

module.exports = {
  Speaker,
  WebBrowser
}
