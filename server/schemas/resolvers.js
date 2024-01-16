const { User} = require('../models');
const {signToken, AuthenticationError} = require('../utils/auth');

const resolvers = {
    Query:{
    me: async (parent, args, context) => {
        if (context.user) {
          return Profile.findOne({ _id: context.user._id });
        }
        throw AuthenticationError;
    
},
    },
Mutation: {
addUser: async (parent, username, email,password) => {
    const user = await User.create(username, email , password);
    const token = signToken(user);
    return {token, user};
},


login: async (parent, {email, password}) => {
    const user = await User.findOne({ email });

    if (!user) {
      throw AuthenticationError;
    }
    const correctPw = await user.isCorrectPassword(password);
    if (!correctPw) {
      throw AuthenticationError;
    }
    const token = signToken(user);
   return { token, user };
  },

  saveBook: async (parent, {authors,description,title,bookId,image,link}, context) => {
    if (context.user){
       const book= {
        authors,
        description,
        title,
        bookId,
        image,
        link,
       }
       const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $addToSet: { savedBooks: book } },
        { new: true, runValidators: true }
        );  
        return updatedUser;
    }
        throw AuthenticationError;
    }


},








    };
