const { EMPLOYERS } = require('./constants')

function checkFields (speaker) {
  const { firstName, lastName, email } = speaker || {}

  if (!(firstName !== null && firstName.trim() !== '')) throw new Error('First Name is required')
  if (!(lastName !== null && lastName.trim() !== '')) throw new Error('Last Name is required')
  if (!(email !== null && email.trim() !== '')) throw new Error('Email is required')
}

function getSpeakerRegistrationFee (experience = 0) {
  if (experience <= 1) return 500
  if (experience >= 2 && experience <= 3) return 250
  if (experience >= 4 && experience <= 5) return 100
  if (experience >= 6 && experience <= 9) return 50

  return 0
}

function isSpeakerEligible (speaker) {
  const { exp: experience, hasBlog, certifications, employer } = speaker || {}

  return experience > 10 || hasBlog || certifications.length > 3 || EMPLOYERS.includes(employer)
}

module.exports = {
  checkFields,
  getSpeakerRegistrationFee,
  isSpeakerEligible
}
