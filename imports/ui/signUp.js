import {Meteor} from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Profile } from '../api/data.js';
import './signUp.html';


Template.signUp.onCreated(function bodyOnCreated() {
  Meteor.subscribe('profile');
})

Template.signUp.helpers({

});

Template.signUp.events({
    'submit .signUp'(event) {
        // prevent default submit
        event.preventDefault();

        const target = event.target;
        const email = target.email.value;
        const password = target.password.value;
        const password2 = target.password2.value;
        if(password == password2){
            // this is a meteor method so its okay to do on client side
            // create user and login
            Accounts.createUser({
                email: email,
                password: password
            });
        } else {
            Bert.alert('Oops your passwords are not the same', 'danger', 'growl-top-right');
        }

        return false
    }
})