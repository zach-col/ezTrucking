import { Meteor } from 'meteor/meteor';
import { Data } from '../imports/api/data.js';

Meteor.startup(() => {
  // code to run on server at startup

	if ( Meteor.users.find().count() === 0 ) {
	    Accounts.createUser({
	        email: 'admin@gmail.com',
	        password: 'adminUserPassword'
	});
	var user = Meteor.users.findOne({});
	Roles.addUsersToRoles(user, 'admin')

	}
});
