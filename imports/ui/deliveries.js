import {Template} from 'meteor/templating';
import './deliveries.html';
import { Data } from '../api/data.js';
import { Profile } from '../api/data.js';
import { Deliverys } from '../api/data.js';
import { Users } from '../api/data.js';


Template.deliveries.onCreated(function bodyOnCreated() {
  Meteor.subscribe('profile'),
  Meteor.subscribe('deliveries'),
  Meteor.subscribe('users'),
  Meteor.subscribe('mydeliveries')
})

Template.deliveries.helpers({
    pickups() {
      var pickups = Data.find({accepted: null, pickedUp: null, droppedOff: null,completed: null, delivery: true}).count()

      return pickups
    },
    user() {
        var param = Router.current().params._id
        var user = Meteor.user()
        return user
    },
    hasRole() {
      if(! Meteor.userId()) {
        return false;
      } else {
          var user = user = Meteor.user()
          return   Roles.userIsInRole(user, 'verified')       
      }
    },
    currentDelivery() {
      var currentDelivery = Data.findOne({accepted: true, owner: Meteor.userId(), completed:null, delivery: true});

      return currentDelivery
    },
    // return param
    signupEmail() {
        var signupEmail = Meteor.user().emails[0].address
        return signupEmail
    },
    pickupsInQue() {
      var pickupsInQue = Data.find({accepted: null, pickedUp: null, droppedOff: null,completed: null, delivery: true}).count()
      return pickupsInQue
    },
    googleMapsPickup() {
      // get delivery pickup
      var googleMapsPickup = Data.findOne({
                owner: Meteor.userId(),
                pickup: {$exists: true},
                createdAt: {$exists: true}, 
                acceptedAt: {$exists: true},
                accepted: true,
                pickedUpAt: {$exists: true},
                pickedUp: {$exists: true},
                droppedOffAt: {$exists: true},
                droppedOff: {$exists: true},
                completedAt: {$exists: true},
                completed: {$exists: true},
                delivery: true})

      // encode delivery
      var delivery = encodeURI(googleMapsPickup.pickup);

      // create google link
      var googleMapsPickup = "https://www.google.com/maps/search/?api=1&query=" + delivery

      return googleMapsPickup
    },
    googleMapsDropoff() {
      // get delivery pickup
      var deliveryDropoff = Data.findOne({
                owner: Meteor.userId(),
                pickup: {$exists: true},
                dropoff: {$exists: true},
                createdAt: {$exists: true}, 
                acceptedAt: {$exists: true},
                accepted: {$exists: true},
                pickedUpAt: {$exists: true},
                pickedUp: true,
                droppedOffAt: {$exists: true},
                droppedOff: {$exists: true},
                completedAt: {$exists: true},
                completed: {$exists: true},
                delivery: true})

      // encode delivery
      var delivery = encodeURI(deliveryDropoff.dropoff);

      // create google link
      var googleMapsDropoff = "https://www.google.com/maps/search/?api=1&query=" + delivery

      return googleMapsDropoff
    },
    deliveryAccepted() {
      var deliveryAccepted = Data.findOne({
                owner: Meteor.userId(),
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
      return deliveryAccepted
    },
    deliveryPickedUp() {
      var deliveryPickedUp = Data.findOne({
                owner: Meteor.userId(),
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
                delivery: true})
      return deliveryPickedUp
    },
    deliveryDroppedOff() {
      var deliveryDroppedOff = Data.findOne({
                owner: Meteor.userId(),
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
                delivery: true})
      return deliveryDroppedOff
    },
    deliveriesCompletedToday() {
      var deliveryDroppedOff = Data.findOne({
                owner: Meteor.userId(),
                completedAt: null,
                completed: null,
                delivery: true})
      return deliveryDroppedOff
    },
})
Template.deliveries.events({
  'click .acceptDelivery'(event){
  	event.preventDefault();

    Meteor.call('updateDelivery.update');
    $(".modal").hide();
    $(".modal-backdrop").hide();
          var data = Data.find({accepted: null, completed: null, delivery: true}).fetch()
      console.log(data)
    Bert.alert('Delivery accepted', 'success', 'growl-top-right');
    return false
  },
  'click .pickUp'(event){
    event.preventDefault();

    Meteor.call('updateDeliveryPickedUp.update');
    $(".modal").hide();
    $(".modal-backdrop").hide();
          var data = Data.find({accepted: null, completed: null, delivery: true}).fetch()
      console.log(data)
    Bert.alert('Delivery picked up', 'success', 'growl-top-right');
    return false
  },
  'click .dropOff'(event){
    event.preventDefault();

    Meteor.call('updateDeliveryDropOff.update');
      $(".modal").hide();
      $(".modal-backdrop").hide();
            var data = Data.find({accepted: null, completed: null, delivery: true}).fetch()
      console.log(data)
      Bert.alert('Delivery dropped off', 'success', 'growl-top-right');
      return false
  },
  'click .uploadData'(event){
    event.preventDefault();
      var data = Data.find({accepted: null, completed: null, delivery: true}).fetch()
      console.log(data)
    Meteor.call('updateDeliveryCompleted.update');
    Bert.alert('Delivery completed', 'success', 'growl-top-right');
    return false
  }
});