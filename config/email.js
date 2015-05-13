/**
 *
 * http://www.nodemailer.com/
 */
module.exports.email = {
  
  //transporterSettings: {
  //  service: 'Gmail',
  //  auth: {
  //    user: 'gmail.user@gmail.com',
  //    pass: 'password'
  //  }
  //}
  transporterSettings: {
    service: 'smtp.live.com',
    host: 'smtp.live.com',
    secure: false,
    port: 587,
    auth: {
      //user: 'outlook.user@outlook.com',
      //pass: 'password'
      user: 'bob.dylaniii@hotmail.com',
      pass: 'Max70well'
    }
  },

  senderAddress: 'bob.dylaniii@hotmail.com'

};