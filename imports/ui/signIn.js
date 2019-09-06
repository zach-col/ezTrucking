import {Meteor} from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Profile } from '../api/data.js';
import './signIn.html';


Template.signIn.onCreated(function bodyOnCreated() {
  Meteor.subscribe('profile');
})

Template.signIn.helpers({

});

Template.signIn.events({
    'submit .signIn'(event) {
        // prevent default submit
        event.preventDefault();

        const target = event.target;
        const email = target.email.value;
        const password = target.password.value;
        // this is a meteor method so its okay to do on client side
        Meteor.loginWithPassword(email, password);
        if(Meteor.user()){
            Bert.alert('You are now logged in', 'success', 'growl-top-right');
            Router.go("home");

        } else {
            Bert.alert('Oops something went wrong', 'danger', 'growl-top-right');
            event.target.email.value='';
            event.target.password.value='';
        }
        return false
    }
})