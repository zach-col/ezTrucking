import {Meteor} from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Profile } from '../api/data.js';
import { Hours } from '../api/data.js';
import { Data } from '../api/data.js';
import { Users } from '../api/data.js';
import './profile.html';

Template.profile.onCreated(function bodyOnCreated() {
  Meteor.subscribe('profile'),
    Meteor.subscribe('users'),
    Meteor.subscribe('hours')
})

Template.profile.helpers({
    // return param
    signupEmail() {
        var signupEmail = Meteor.user().emails[0].address
        return signupEmail
    },
    userHours(){
      var param = Meteor.userId()
      var userHours = Data.findOne({
                owner: param,
                hours: {$exists: true}})
      if(userHours){
        return userHours.hours
      }
    },
    hasRole() {
      if(! Meteor.userId()) {
        return false;
      } else {
          var user = Meteor.userId()
          return   Roles.userIsInRole(user, 'verified')
                  
      }
    },

});

Template.profile.events({

  'submit .uploadTruckNumber'(event){
    event.preventDefault();
    var target = event.target
    var truckNumber = target.truckNumber.value

  if(isNotEmpty(truckNumber) && isNotGreaterThen(truckNumber, 4)){
    if(Meteor.user().truckNumber){
      Bert.alert('Only admins can update truck numbers', 'danger', 'growl-top-right');
    } else {

      Meteor.call('updateTruckNumber.update', truckNumber, function (error, result) {
        if(!error){
          Bert.alert('Truck number is being used', 'danger', 'growl-top-right');
        } else {
          Bert.alert('Truck number in use', 'success', 'growl-top-right');
        }
      });

    }
  }
    return false

  },
  'click .changeOnlineStatus'(event){
       console.log(Meteor.user().imagesURL)
       Meteor.call('changeOnlineStatus.update')
       if(Meteor.user().isOnline == true){
        Bert.alert('You are now online', 'success', 'growl-top-right');
       } else if(Meteor.user().isOnline == false){
          Bert.alert('You are now offline', 'success', 'growl-top-right');

       } else if(!Roles.userIsInRole(Meteor.userId(), 'verified')){
          Bert.alert('You must be verified to go online please contact an admin', 'success', 'growl-top-right');
       } else{
          Bert.alert('oops someting went wrong', 'success', 'growl-top-right');
       }
  }
});

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
        Bert.alert("Error input is empty", "danger", "growl-top-right");
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