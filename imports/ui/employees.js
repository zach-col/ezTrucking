import {Template} from 'meteor/templating';
import './employees.html';
import { Data } from '../api/data.js';
import { Users } from '../api/data.js';
import { Hours } from '../api/data.js';
import { Deliverys } from '../api/data.js';


Template.employees.onCreated(function bodyOnCreated() {
    Meteor.subscribe('users'),
    Meteor.subscribe('deliveries'),
    Meteor.subscribe('data')
})

Template.employees.onRendered(function () {

  Meteor.call('sendData', function (error, response) {
    if (error) {
      console.log('ERROR :', error);
    } else {
      
      console.log('Response :', response);
    }
  });
});

Template.employees.helpers({
    data() {
      var data= Data.find({data: {$exists: true}})

      return data
    },
    pickupsInQueCount() {
      var pickupsInQueCount = Data.find({pickup: {$exists: true}, dropoff: {$exists: true}, owner: null , createdAt: {$exists: true}, acceptedAt: null, accepted: null, pickedUpAt: null, pickedUp: null, droppedOffAt: null, droppedOff: null, completedAt: null, completed: null, delivery: true}).count()

      return pickupsInQueCount
    },
    pickupsInQue() {
      var pickupsInQue = Data.find({pickup: {$exists: true}, dropoff: {$exists: true}, owner: null , createdAt: {$exists: true}, acceptedAt: null, accepted: null, pickedUpAt: null, pickedUp: null, droppedOffAt: null, droppedOff: null, completedAt: null, completed: null, delivery: true})

      return pickupsInQue
    },
    trucksOnlineCount() {
      var trucksOnlineCount = Meteor.users.find({isOnline: true}).count();
      return trucksOnlineCount
    },
    trucksOnline() {
      // var trucksOnline = Data.find({pickup: {$exists: true}, dropoff: {$exists: true}, owner: {$exists: false} }, { sort: {createdAt: -1}});
      var trucksOnline = Meteor.users.find({isOnline: true});
      return trucksOnline
    },
    // get email for certain user
    email(){
      return this.emails[0].address;
    },
    pickupsInRouteCount() {
      var pickupsInRouteCount = Data.find({
                pickup: {$exists: true},
                createdAt: {$exists: true}, 
                acceptedAt: {$exists: true},
                accepted: true,
                pickedUpAt: null,
                pickedUp: null,
                droppedOffAt: null,
                droppedOff: null,
                completedAt: null,
                completed: null,
                delivery: true}).count()
      return pickupsInRouteCount
    },
    pickupsInRoute() {

      var pickupsInRoute = Data.find({
                pickup: {$exists: true},
                createdAt: {$exists: true}, 
                acceptedAt: {$exists: true},
                accepted: true,
                pickedUpAt: null,
                pickedUp: null,
                droppedOffAt: null,
                droppedOff: null,
                completedAt: null,
                completed: null,
                delivery: true})
      return pickupsInRoute
    },
    dropOffsInRouteCount() {

      var dropOffsInRouteCount = Data.find({
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
                delivery: true}).count()
      return dropOffsInRouteCount
    },
    dropOffsInRoute() {
      var dropOffsInRoute = Data.find({
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
                delivery: true})
      return dropOffsInRoute
    },
    trucksAwaitingDeliveryCount() {
      var trucksAwaitingDeliveryCount = Data.find({pickup: {$exists: true}, dropoff: {$exists: true}, owner: {$exists: false} }, { sort: {createdAt: -1}}).count();
      return trucksAwaitingDeliveryCount
    },
    trucksAwaitingSheetInputCount() {
      var trucksAwaitingSheetInputCount = Data.find({
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
                delivery: true}).count()
      return trucksAwaitingSheetInputCount
    },
    trucksAwaitingSheetInput() {
      var trucksAwaitingSheetInput = Data.find({
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
                delivery: true})
      return trucksAwaitingSheetInput
    },
    users() {
      var users = Meteor.users.find({});
      return users
    },
    userIsOnline(userId) {
          var user = Meteor.users.find({_id: userId});
          var userIsOnline = user.isOnline
          return  userIsOnline
    },
    user() {
        return Meteor.users.findOne({_id: this.owner})
    },
    userRecentDeliverySheet(userId){
      var userRecentDeliverySheet = Data.findOne({
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
                completedAt: null,
                completed: null,
                delivery: true}, {sort: {createdAt: 1}})
      return userRecentDeliverySheet
    },
    userRecentlyPickedUp(userId){
      var userRecentlyPickedUp = Data.findOne({
                owner: userId,
                pickup: {$exists: true},
                dropoff: {$exists: true},
                createdAt: {$exists: true}, 
                acceptedAt: {$exists: true},
                accepted: true,
                pickedUpAt: {$exists: true},
                pickedUp: true,
                droppedOffAt: null,
                droppedOff: null,
                completedAt: null,
                completed: null,
                delivery: true}, {sort: {createdAt: 1}})
      return userRecentlyPickedUp
    },
    userRecentlyAccepted(userId){
      var userRecentlyAccepted = Data.findOne({
                owner: userId,
                pickup: {$exists: true},
                dropoff: {$exists: true},
                createdAt: {$exists: true}, 
                acceptedAt: {$exists: true},
                accepted: true,
                pickedUpAt: null,
                pickedUp: null,
                droppedOffAt: null,
                droppedOff: null,
                completedAt: null,
                completed: null,
                delivery: true}, {sort: {createdAt: 1}})
      return userRecentlyAccepted
    },
    userDropOffLocation(){
      var userDropOffLocation = Data.findOne({
                owner: this._id,
                pickup: {$exists: true},
                dropoff: {$exists: true},
                delivery: true}, {sort: {createdAt: -1}})
      if(userDropOffLocation){
        return userDropOffLocation.dropoff
      }
    },
    userPickupLocation(){
      var userPickupLocation = Data.findOne({
                owner: this._id,
                pickup: {$exists: true},
                dropoff: {$exists: true},
                delivery: true}, {sort: {createdAt: -1}})
      if(userPickupLocation){
        return userPickupLocation.pickup
      }
    },
    userDeliveryProgressTrucksOnline(){
      var userDeliveryProgressTrucksOnline = Data.findOne({
                owner: this._id,
                pickup: {$exists: true},
                dropoff: {$exists: true},
                createdAt: {$exists: true}, 
                acceptedAt: {$exists: true},
                accepted: {$exists: true},
                completedAt: {$exists: true},
                completed: {$exists: true},
                droppedOff: {$exists: true},
                delivery: true}, {sort: {createdAt: -1}})
      if(!userDeliveryProgressTrucksOnline){
        return "none"
      } else if(userDeliveryProgressTrucksOnline.completed){
        return "Completed"
      } else if (userDeliveryProgressTrucksOnline.droppedOff){
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
})

Template.employees.events({
  'submit .uploadDelivery'(event){
  	event.preventDefault();
  	var target = event.target
  	var pickup = target.pickup.value
    var dropoff = target.dropoff.value


    if(isString(pickup) && isNotEmpty(pickup) && isNotGreaterThen(pickup, 100) &&
       isString(dropoff) && isNotEmpty(dropoff) && isNotGreaterThen(dropoff, 100)){
      Meteor.call('adminUploadPickup.insert', pickup, dropoff, function (error, result) {
        if(!error){
          Bert.alert('Delivery created', 'success', 'growl-top-right');
        $(".modal").hide();
        $(".modal-backdrop").hide();

        event.target.pickup.value='';
        event.target.dropoff.value='';

        } else {
          Bert.alert('Oops something went wrong', 'danger', 'growl-top-right');
          $(".modal").hide();
          $(".modal-backdrop").hide();

          event.target.pickup.value='';
          event.target.dropoff.value='';
        }
      });
    }


    return false
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
        Bert.alert("Error empty", "danger", "growl-top-right");
        return false;
    }
};

var isNotGreaterThen = function(value, length){
  if (value.length <= length){
    return true;
  } else {
        Bert.alert("Error char to long", "danger", "growl-top-right");
        return false;
    }
};