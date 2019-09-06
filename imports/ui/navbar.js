import {Meteor} from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './navbar.html';

Template.navbar.events({

  'click .logout'(event){
      Meteor.logout()
      if(!Meteor.user()){
          Bert.alert('Logged out', 'success', 'growl-top-right');
      } else {
          Bert.alert('Oops something went wrong', 'success', 'growl-top-right');
      }
    return false
  }
});