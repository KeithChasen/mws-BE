const { UserInputError } = require('apollo-server');
const User = require('../../mongo/User');
const generateToken = require("../../utils/jwt");
const s3 = require('../../utils/s3');

module.exports = {
  Mutation: {
     updateUser: async (_, { bio, age, occupation, nickname, firstname, lastname }, { user }) => {
       if (!user) {
         throw new UserInputError('Auth errors', {
           errors: {
             auth: 'Unauthorized'
           }
         });
       }

       const savedUser = await User.findOne({ email: user._doc.email });

       savedUser.set({
         bio,
         age,
         occupation,
         nickname,
         firstname,
         lastname
       });

       const userResponse = await savedUser.save();

       const token = generateToken(userResponse);

       return {
         ...userResponse._doc,
         id: userResponse._id,
         token
       }
    },
    uploadAvatar: async (_, { file }, { user }) => {
      const { createReadStream, filename, mimetype, encoding } = await file;

      const stream = createReadStream();

      const {Location} = await s3.upload({
        Body: stream,
        Key: `user-${user._doc._id}-Date-${Date.now()}-${filename}`,
        ContentType: mimetype
      }).promise();

      const awsFileSaved = new Promise((resolve, reject) => {
        if (Location) {
          resolve({
            success: true,
            message: 'uploaded',
            mimetype,
            filename,
            location: Location,
            encoding
          })
        } else {
          reject({
            success: false, message: 'Failed'
          })
        }
      });

      return awsFileSaved
        .then(async res => {
          if (res.location) {
            const savedUser = await User.findOne({ email: user._doc.email });

            savedUser.set({
              photo: res.location
            });

            const userResponse = await savedUser.save();

            const token = generateToken(userResponse);

            return {
              ...userResponse._doc,
              id: userResponse._id,
              token
            }
          }
        })
        .catch(err => {
          throw new UserInputError('Photo upload error', {
            errors: {
              avatar: 'Unable to upload photo'
            }
          });
        });
    }
  }
};
