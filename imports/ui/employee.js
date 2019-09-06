import {Meteor} from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Data } from '../api/data.js';
import { Users } from '../api/data.js';
import { Hours } from '../api/data.js';
import './employee.html';


Template.employee.onCreated(function bodyOnCreated() {
    Meteor.subscribe('users'),
    Meteor.subscribe('deliveries');
    Meteor.subscribe('hours');
})


Template.employee.helpers({
    user() {
        var param = Router.current().params._id
        var user = Meteor.users.find({_id: param});
        return user
    },
    // get email for certain user
    email(){
      return this.emails[0].address;
    },
    // get truck number for certain user
    truckNumber(){
      return this.truckNumber;
    },
    userIsOnline(userId) {

          var user = Meteor.users.find({_id: userId});
          var userIsOnline = user.isOnline
          return	userIsOnline
    },
    deliveriesCompleted() {
		var userId = Router.current().params._id
        var deliveriesCompleted = Data.find({
                owner: userId,
                pickup: {$exists: true},
                dropoff: {$exists: true},
                delivery: true})
      return deliveriesCompleted
    },
    deliveriesCompletedCount() {
		var userId = Router.current().params._id
        var deliveriesCompletedCount = Data.find({
                owner: userId,
                pickup: {$exists: true},
                dropoff: {$exists: true},
                createdAt: {$exists: true}, 
                acceptedAt: {$exists: true},
                accepted: true,
                pickedUpAt: {$exists: true},
                pickedUp: true,
                droppedOffAt: {$exists: true},
                droppedOff: true,
                completedAt: {$exists: true},
                completed: true,
                delivery: true}).count()
      return deliveriesCompletedCount
  	},
	hasRole(userId, role) {
	  if(! Meteor.userId()) {
	    return false;
	  } else {
	      var user = userId
	      var admin = Meteor.users.findOne(user)
	      return   Roles.userIsInRole(userId, 'verified')
	              
	  }
	},
    userDeliveryProgressTrucksOnline(){
      var userDeliveryProgressTrucksOnline = Data.findOne({
                owner: this._id,
                pickup: {$exists: true},
                dropoff: {$exists: true},
                createdAt: {$exists: true}, 
                acceptedAt: {$exists: true},
                accepted: true,
                delivery: true}, {sort: {createdAt: 1}})
      if(userDeliveryProgressTrucksOnline.completed){
        return "Completed"
      } else if (userDeliveryProgressTrucksOnline.dropoff){
        return "Filling form"
      } else if (userDeliveryProgressTrucksOnline.pickedUp){
        return "Dropping off"
      } else if (userDeliveryProgressTrucksOnline.accepted){
        return "Accepted"
      } 
    },
    userOnlineInfo(){
      var userPickupLocation = Data.findOne({
                owner: this._id,
                pickup: {$exists: true},
                dropoff: {$exists: true},
                createdAt: {$exists: true}, 
                acceptedAt: {$exists: true},
                accepted: true,
                delivery: true}, {sort: {createdAt: 1}})
      if(userPickupLocation){
        return userPickupLocation.pickup
      }
    },
    userHours(){
      var param = Router.current().params._id
      var userHours = Data.findOne({
                owner: param,
                hours: {$exists: true}})
      if(userHours){
        return userHours.hours
      }
    }
});

Template.employee.events({
  'click .changeEmployeeOnlineStatus'(event){
    var param = Router.current().params._id
    Meteor.call('changeEmployeeOnlineStatus.update', param);
      var user = Meteor.users.findOne(param)
    if(user.isOnline == true){
		Bert.alert('User is now online', 'success', 'growl-top-right');
    } else if(Meteor.user().user == false){
		Bert.alert('User is now offline', 'success', 'growl-top-right');
    }
    else if(!user.truckNumber){
		Bert.alert('Please add your truck number before going online', 'danger', 'growl-top-right');	
    }
    return false
  },
  'submit .updateTruckNumber'(event){
    event.preventDefault();
    var target = event.target
    var truckNumber = target.truckNumber.value
	if(isNotEmpty(truckNumber) && isNotGreaterThen(truckNumber, 4)){
	  var param = Router.current().params._id

      Meteor.call('adminUpdateTruckNumber.update', truckNumber, param, function (error, result) {
        if(!error){
			Bert.alert('Truck number updated', 'success', 'growl-top-right');
        	$(".modal").hide();
        	$(".modal-backdrop").hide();

        	event.target.pickup.value='';
        	event.target.dropoff.value='';

        } else {
          Bert.alert('Oops something went wrong', 'danger', 'growl-top-right');
          $(".modal").hide();
          $(".modal-backdrop").hide();
          event.target.truckNumber.value='';
        }
      });

	}
    return false

  },
  'submit .hours'(event){
    event.preventDefault();
    var target = event.target
    var hours = target.hours.value
	if(isNotEmpty(hours) && isNotGreaterThen(hours, 100)){
	  var userId = Router.current().params._id
	  console.log("got in")
      Meteor.call('adminUpdateHours.update', userId, hours, function (error, result) {
        if(!error){
			    Bert.alert('Hours updated', 'success', 'growl-top-right');
        	$(".modal").hide();
        	$(".modal-backdrop").hide();
        	event.target.hours.value='';
        } else {
          Bert.alert('Oops something went wrong', 'danger', 'growl-top-right');
          $(".modal").hide();
          $(".modal-backdrop").hide();
          event.target.hours.value='';
        }
      });

	}
    return false

  },
  'click .verifyUser'(event){
  	var param = Router.current().params._id

  	Meteor.call('verifyUser.update', param , function (error, result) {
  		if(!error){
  		  Bert.alert('User updated', 'success', 'growl-top-right');
  		} else {
  		  Bert.alert('Oops something went wrong', 'danger', 'growl-top-right');
  		}
  	});

      return false
  }
})

// Validator Rules
var isString = function(value){
	if (value.constructor === String){
		return true;
    } else {
        Bert.alert("Error please input text", "danger", "growl-top-right");
        return false;
    }
};

var isNotEmpty = function(value){
	if (value && value !== ''){
        return true;
	} else {
        Bert.alert("Error empty input", "danger", "growl-top-right");
        return false;
    }
};

var isNotGreaterThen = function(value, length){
	if (value.length <= length){
		return true;
	} else {
        Bert.alert("Error truck number can only be 4 characters long", "danger", "growl-top-right");
        return false;
    }
};