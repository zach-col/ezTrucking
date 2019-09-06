import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles'
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter'

export const Data = new Mongo.Collection('data');


// Deny all client-side updates on the collection
Data.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Meteor.users.deny({
  update() { return true; }
});

if (Meteor.isServer) {
Meteor.publish("Images", function(){ return Images.find(); });

	Meteor.publish('profile', function profilePublication() {
	    // make sure user is logged
		if(!this.userId){
			return false;
			throw new Meteor.Error('not authorized');
		} else {
	        return Meteor.users.find({_id: this.userId}, {
	            fields: {
	                truckNumber: 1,
	                isOnline: 1
	            }
	        })
		}
	});

    // get users from collection
    Meteor.publish('users', function usersPublication() {
        // make sure user is logged
        if(!this.userId){
            return false;
            throw new Meteor.Error('not authorized');
        } else {

            // get current user
            var loggedInUser = Meteor.user()
            // check if user is admin
            if (Roles.userIsInRole(loggedInUser, 'admin')) {
                return Meteor.users.find();

            }
          }
    });

    // get users from collection
    Meteor.publish('data', function dataPublication() {
        // make sure user is logged
        if(!this.userId){
            return false;
            throw new Meteor.Error('not authorized');
        } else {

            // get current user
            var loggedInUser = Meteor.user()
            // check if user is admin
            if (Roles.userIsInRole(loggedInUser, 'admin')) {
                return Data.find({data: {$exists: true}})

            }
          }
    });

    // get users from collection
    Meteor.publish('mydeliveries', function mydeliveriesPublication() {
        // make sure user is logged
        if(!this.userId){
            return false;
            throw new Meteor.Error('not authorized');
        } else {

            // get current user
            var loggedInUser = Meteor.user()
            // check if user is admin
            if (Roles.userIsInRole(loggedInUser, 'admin')) {

            // only return if these fields exist && only return the 1/specific fields if the user is admin show all challenges
	        return Data.find({pickup: {$exists: true},
	        	dropoff: {$exists: true},
	        	owner: {$exists: true},
	        	createdAt: {$exists: true},
	        	acceptedAt: {$exists: true},
	        	accepted: {$exists: true},
	        	pickedUpAt: {$exists: true},
	        	pickedUp: {$exists: true},
	        	droppedOffAt: {$exists: true},
	        	droppedOff: {$exists: true},
	        	completedAt: {$exists: true},
	        	completed: {$exists: true},
	        	delivery: true}, {
	        	sort: {createdAt: -1},
	            fields: {
	                _id: 1,
					pickup: 1,
		        	dropoff: 1,
		        	owner: 1,
		        	createdAt: 1,
		        	acceptedAt: 1,
		        	accepted: 1,
		        	pickedUpAt: 1,
		        	pickedUp: 1,
		        	droppedOffAt: 1,
		        	droppedOff: 1,
		        	completedAt: 1,
		        	completed: 1,
		        	delivery: 1
	            }
	        })

            } else {
			   	var loggedInUser = Meteor.user();
			    if(Roles.userIsInRole(loggedInUser, 'verified')){
			        return Data.find({pickup: {$exists: true},
			        	dropoff: {$exists: true},
			        	owner: Meteor.userId(),
			        	accepted: {$exists: true},
			        	pickedUpAt: {$exists: true},
			        	pickedUp: {$exists: true},
			        	droppedOffAt: {$exists: true},
			        	droppedOff: {$exists: true},
			        	completed: {$exists: true},
			        	delivery: true}, {
			        	sort: {createdAt: -1},
			            fields: {
			                _id: 1,
							pickup: 1,
				        	dropoff: 1,
				        	owner: 1,
				        	createdAt: 1,
				        	acceptedAt: 1,
				        	accepted: 1,
				        	pickedUpAt: 1,
				        	pickedUp: 1,
				        	droppedOffAt: 1,
				        	droppedOff: 1,
				        	completedAt: 1,
				        	completed: 1,
				        	delivery: 1
			            }
			        })
	        	}
            }
          }
    });

    // show that there are orders needing to be picked up but dont show all data to user until
    // they are the owner of delivery
    Meteor.publish('deliveries', function deliveriesPublication() {
        // make sure user is logged
        if(!this.userId){
            return false;
            throw new Meteor.Error('not authorized');
        } else {

            // get current user
            var loggedInUser = Meteor.user()
            // check if user is admin
            if (Roles.userIsInRole(loggedInUser, 'admin')) {

            // only return if these fields exist && only return the 1/specific fields if the user is admin show all challenges
	        return Data.find({pickup: {$exists: true},
	        	dropoff: {$exists: true},
	        	owner: {$exists: true},
	        	createdAt: {$exists: true},
	        	acceptedAt: {$exists: true},
	        	accepted: {$exists: true},
	        	pickedUpAt: {$exists: true},
	        	pickedUp: {$exists: true},
	        	droppedOffAt: {$exists: true},
	        	droppedOff: {$exists: true},
	        	completedAt: {$exists: true},
	        	completed: {$exists: true},
	        	delivery: true}, {
	        	sort: {createdAt: -1},
	            fields: {
	                _id: 1,
					pickup: 1,
		        	dropoff: 1,
		        	owner: 1,
		        	createdAt: 1,
		        	acceptedAt: 1,
		        	accepted: 1,
		        	pickedUpAt: 1,
		        	pickedUp: 1,
		        	droppedOffAt: 1,
		        	droppedOff: 1,
		        	completedAt: 1,
		        	completed: 1,
		        	delivery: 1
	            }
	        })

            } else {
			   	var loggedInUser = Meteor.user();
			    if(Roles.userIsInRole(loggedInUser, 'verified')){
			        return Data.find({pickup: {$exists: true},
			        	dropoff: {$exists: true},
			        	owner: null,
			        	accepted: null,		
			        	completed: null,
			        	delivery: true}, {
			        	sort: {createdAt: -1},
			            fields: {
			                _id: 1,
				        	owner: 1,
				        	delivery: 1
			            }
			        })
	        	}
            }
          }
    });


    Meteor.publish('hours', function hoursPublication() {
        // make sure user is logged
        if(!this.userId){
            return false;
            throw new Meteor.Error('not authorized');
        } else {

            // get current user
            var loggedInUser = Meteor.user()
            // check if user is admin
            if (Roles.userIsInRole(loggedInUser, 'admin')) {

            // only return if these fields exist && only return the 1/specific fields if the user is admin show all challenges
	        return Data.find({hours: {$exists: true},
	        	owner: {$exists: true}}, {
	        	sort: {createdAt: -1},
	            fields: {
		        	hours: 1,
		        	owner: 1
	            }
	        })

            } else {
			   	var loggedInUser = Meteor.user();
			    if(Roles.userIsInRole(loggedInUser, 'verified')){
		            // only return if these fields exist && only return the 1/specific fields if the user is admin show all challenges
			        return Data.find({hours: {$exists: true},
			        	owner: Meteor.userId()}, {
			        	sort: {createdAt: -1},
			            fields: {
				        	hours: 1,
				        	owner: 1
			            }
			        })


			    }
            }
          }
    });


}

Meteor.methods({
  'updateTruckNumber.update'(truckNumber) {
    // Make sure the user is logged
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
 	if(Meteor.user().truckNumber){
 		return false
 	} else {
        // check if user is admin
		    check(truckNumber, String);
			if(checkIfNumber(truckNumber) && isNotEmpty(truckNumber) && isNotGreaterThen(truckNumber, 4)){
				var user = Meteor.users.findOne({ truckNumber: truckNumber });
				if(user){
					return false
				} else {
						Meteor.users.update(Meteor.userId(), { $set: { truckNumber: truckNumber } });
				}
			}
 	}
  },
  'adminUpdateTruckNumber.update'(truckNumber, userId) {
    // Make sure the user is logged
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    // get current user
    var loggedInUser = Meteor.user()
    // check if user is admin
    if (Roles.userIsInRole(loggedInUser, 'admin')) {
	    check(truckNumber, String);
	    check(userId, String);
	    if(isString(truckNumber) && isNotEmpty(truckNumber) && isNotGreaterThen(truckNumber, 4) &&
		   isString(userId) && isNotEmpty(userId) && isNotGreaterThen(userId, 25)
	    	){
		    var user = Meteor.users.findOne({_id: userId});
			var userTruckNumberSearch = Meteor.users.findOne({ truckNumber: truckNumber });
			if(userTruckNumberSearch){
				return false
			} else {
				Meteor.users.update(user, { $set: { truckNumber: truckNumber } });
			}
	    }
    }

  },
  'updateDelivery.update'() {
    // Make sure the user is logged in
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    if(!Meteor.user().truckNumber ||  Meteor.user().isOnline == false){
	    return false
    }
   	var loggedInUser = Meteor.user();
    if(Roles.userIsInRole(loggedInUser, 'verified')){
	     var userId = Meteor.userId()
	     var nextDelivery = Data.findOne({pickup: {$exists: true}, dropoff: {$exists: true}, createdAt: {$exists: true}, acceptedAt: null, accepted: null, pickedUp: null, pickedUpAt: null, droppedOff: null,droppedOffAt: null, completed: null, delivery: true})
	     var currentDelivery = Data.findOne({owner: userId, pickup: {$exists: true}, dropoff: {$exists: true}, createdAt: {$exists: true}, accepted: {$exists: true}, completed: null, delivery: true})
	     if(currentDelivery){
	     } else if(nextDelivery){
	     	Data.update(nextDelivery, {$set: { owner: userId, acceptedAt: new Date(), accepted: true}})
	     }
    }

  },
  'updateDeliveryPickedUp.update'() {
    // Make sure the user is logged
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
   	var loggedInUser = Meteor.user();
    if(Roles.userIsInRole(loggedInUser, 'verified')){
	    var userId = Meteor.userId()
	    var nextDelivery = Data.findOne({owner: userId,
	     			pickup: {$exists: true},
		        	createdAt: {$exists: true},
		        	acceptedAt: {$exists: true},
		        	accepted: {$exists: true},
		        	pickedUpAt: null,
		        	pickedUp: null,
		        	droppedOffAt: null,
		        	droppedOff: null,
		        	completedAt: null,
		        	completed: null,
		        	delivery: true
	     		})

	     if(nextDelivery){
	     	Data.update(nextDelivery, {$set: {pickedUpAt: new Date(), pickedUp: true}})
	     }
    }

  },
  'updateDeliveryCompleted.update'() {
    // Make sure the user is logged
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
  	var loggedInUser = Meteor.user();
    if(Roles.userIsInRole(loggedInUser, 'verified')){
	    var userId = Meteor.userId()
	    var nextDelivery = Data.findOne({owner: userId,
	     			pickup: {$exists: true},
		        	createdAt: {$exists: true},
		        	acceptedAt: {$exists: true},
		        	accepted: true,
		        	pickedUpAt: {$exists: true},
		        	pickedUp: true,
		        	droppedOffAt: {$exists: true},
		        	droppedOff: true,
		        	completedAt: null,
		        	completed: null,
		        	delivery: true
	     		})

	     if(nextDelivery){
	     	Data.update(nextDelivery, {$set: {completedAt: new Date(), completed: true}})
	     }
    }
  },
  'updateDeliveryDropOff.update'() {
    // Make sure the user is logged
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
  	var loggedInUser = Meteor.user();
    if(Roles.userIsInRole(loggedInUser, 'verified')){
	    var userId = Meteor.userId()
	    var nextDelivery = Data.findOne({owner: userId,
	     			pickup: {$exists: true},
		        	createdAt: {$exists: true},
		        	acceptedAt: {$exists: true},
		        	accepted: true,
		        	pickedUpAt: {$exists: true},
		        	pickedUp: true,
		        	droppedOffAt: null,
		        	droppedOff: null,
		        	completedAt: null,
		        	completed: null,
		        	delivery: true
	     		})

	     if(nextDelivery){
	     	Data.update(nextDelivery, {$set: {droppedOffAt: new Date(), droppedOff: true}})
	     }
    }

  },
  'changeOnlineStatus.update'() {
    // Make sure the user is logged
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
 	var loggedInUser = Meteor.user();

    if(Roles.userIsInRole(loggedInUser, 'verified')){
	    if(Meteor.user().truckNumber){
		    if(Meteor.user().isOnline == true){
				Meteor.users.update(Meteor.userId(), { $set: { isOnline: false } });
		    } else {
				Meteor.users.update(Meteor.userId(), { $set: { isOnline: true } }); 	
		    }
	    }
	} else {
		return false
	}
  },
  'changeEmployeeOnlineStatus.update'(employeeId) {
    // Make sure the user is logged
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    // get current user
    var loggedInUser = Meteor.user()
    // check if user is admin
    if (Roles.userIsInRole(loggedInUser, 'admin')) {
	    check(employeeId, String)
	    if(isString(employeeId) && isNotEmpty(employeeId) && isNotGreaterThen(employeeId, 25)){
		    var user = Meteor.users.findOne({_id: employeeId});
		    if(user.isOnline == true){
				Meteor.users.update(user, { $set: { isOnline: false } });
		    } else {
				Meteor.users.update(user, { $set: { isOnline: true } }); 	
		    }
	    }
    }


  },
  'verifyUser.update'(userId) {
    // Make sure the user is logged
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    } else {
	    // get current user
	    var loggedInUser = Meteor.user()
	    // check if user is admin
	    if (Roles.userIsInRole(loggedInUser, 'admin')) {

		    check(userId, String)
		    if(isString(userId) && isNotEmpty(userId) && isNotGreaterThen(userId, 25)){

			    var userToUpdate = Meteor.users.findOne({_id: userId});
			    if(userToUpdate){
				    if(Roles.userIsInRole(userToUpdate, 'verified')){
	                    Roles.removeUsersFromRoles( userToUpdate, 'verified');
				    } else {
			        	Roles.addUsersToRoles(userToUpdate, 'verified')
				    }
			    }
	    	}
    	}
    }

  },
  'adminUploadPickup.insert'(pickup, dropoff) {
    // Make sure the user is logged
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    } else {
		    // get current user
		    var loggedInUser = Meteor.user()
		    // check if user is admin
		    if (Roles.userIsInRole(loggedInUser, 'admin')) {
			    if(isString(pickup) && isNotEmpty(pickup) && isNotGreaterThen(pickup, 100) &&
			       isString(dropoff) && isNotEmpty(dropoff) && isNotGreaterThen(dropoff, 100)){

			        Data.insert({pickup: pickup, dropoff: dropoff, owner: null , createdAt: new Date(), acceptedAt: null, accepted: null, pickedUpAt: null, pickedUp: null, droppedOffAt: null, droppedOff: null, completedAt: null, completed: null, delivery: true})
				}
		    }
    }

  },

  'adminUpdateHours.update'(userId, time) {
    // Make sure the user is logged
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    } else {

		    // get current user
		    var loggedInUser = Meteor.user()
		    // check if user is admin
		    if (Roles.userIsInRole(loggedInUser, 'admin')) {
			    if(isString(userId) && isNotEmpty(userId) && isNotGreaterThen(userId, 25) &&
			       isString(time) && isNotEmpty(time) && isNotGreaterThen(time, 100)){
				     var userHours = Data.findOne({owner: userId, hours: {$exists: true}})
				     if(userHours){
				     	Data.update(userHours, {$set: { hours: time}})
				    	 var userHours = Data.findOne({owner: userId, hours: {$exists: true}})


				     } else {
				     	Data.insert({ hours: time, owner: userId})
				     }
				}
		    }
    }

  }
});

if (Meteor.isServer) {

    // limiter
    const changeOnlineStatus = {
        // rate limit by user id
        userId(userId) { return true; },
        type: 'method',
        name: 'changeOnlineStatus.update'
    };
    DDPRateLimiter.addRule(changeOnlineStatus, 1, 1000);
    DDPRateLimiter.setErrorMessage("error")

    // limiter
    const updateDeliveryDropOff = {
        // rate limit by user id
        userId(userId) { return true; },
        type: 'method',
        name: 'updateDeliveryDropOff.update'
    };
    DDPRateLimiter.addRule(updateDeliveryDropOff, 1, 1000);
    DDPRateLimiter.setErrorMessage("error")

    // limiter
    const updateDeliveryCompleted = {
        // rate limit by user id
        userId(userId) { return true; },
        type: 'method',
        name: 'updateDeliveryCompleted.update'
    };
    DDPRateLimiter.addRule(updateDeliveryCompleted, 1, 1000);
    DDPRateLimiter.setErrorMessage("error")

    // limiter
    const updateDeliveryPickedUp = {
        // rate limit by user id
        userId(userId) { return true; },
        type: 'method',
        name: 'updateDeliveryPickedUp.update'
    };
    DDPRateLimiter.addRule(updateDeliveryPickedUp, 1, 1000);
    DDPRateLimiter.setErrorMessage("error")

    // limiter
    const updateDelivery = {
        // rate limit by user id
        userId(userId) { return true; },
        type: 'method',
        name: 'updateDelivery.update'
    };
    DDPRateLimiter.addRule(updateDelivery, 1, 1000);
    DDPRateLimiter.setErrorMessage("error")

    // limiter
    const updateTruckNumber = {
        // rate limit by user id
        userId(userId) { return true; },
        type: 'method',
        name: 'updateTruckNumber.update'
    };
    DDPRateLimiter.addRule(updateTruckNumber, 1, 1000);
    DDPRateLimiter.setErrorMessage("error")
}

// Validator Rules
var isString = function(value){
	if (value.constructor === String){
		return true;
    } else {
        Bert.alert("Error not a string", "danger", "growl-top-right");
        return false;
    }
};

var isNotEmpty = function(value){
	if (value && value !== ''){
        return true;
	} else {
        Bert.alert("Error string empty", "danger", "growl-top-right");
        return false;
    }
};

var isNotGreaterThen = function(value, length){
	if (value.length <= length){
		return true;
	} else {
        Bert.alert("Error exceeds limit", "danger", "growl-top-right");
        return false;
    }
};

var checkIfNumber = function(value){
	if (Number(value)){
		return true;
	} else {
        Bert.alert("Error exceeds character limit", "danger", "growl-top-right");
        return false;
    }
};