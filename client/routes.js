Router.configure({
	layoutTemplate: 'main_layout',
});
Router.onRun(function(){
  $(".modal-backdrop").remove();
  this.next();
});
Router.map(function(){
	this.route('home', {
		path: '/',
		template: 'home'
	})

	this.route('employees', {
		path: '/employees',
		template: 'employees',
        onBeforeAction: function () {
            // get current user id
            var currentUser = Meteor.userId();
            // get current user
            var loggedInUser = Meteor.user()
            if (currentUser && Roles.userIsInRole(loggedInUser, 'admin')) {
                this.next();
            } else {
                Bert.alert('You do not have permission to view this page', 'danger', 'growl-top-right');
                Router.go("home");
            }
        }
	})

    this.route('employee', {
        path: '/employee/:_id',
        template: 'employee',
        onBeforeAction: function () {
            // get current user id
            var currentUser = Meteor.userId();
            // get current user
            var loggedInUser = Meteor.user()
            if (currentUser && Roles.userIsInRole(loggedInUser, 'admin')) {
                this.next();
            } else {
                Bert.alert('You do not have permission to view this page', 'danger', 'growl-top-right');
                Router.go("home");
            }
        }
    })

    this.route('deliveries', {
        path: '/deliveries',
        template: 'deliveries',
        onBeforeAction: function () {
            var currentUser = Meteor.userId();
            if (currentUser) {
                this.next();

            } else {
                Bert.alert('Please sign in to view profile', 'danger', 'growl-top-right');
                Router.go("home");
            }
        }
    })

    this.route('deliverysheets', {
        path: '/deliverysheets',
        template: 'deliverysheets',
        onBeforeAction: function () {
            var currentUser = Meteor.userId();
            if (currentUser) {
                this.next();
            } else {
                Bert.alert('Please sign in to view delivery sheets', 'danger', 'growl-top-right');
                Router.go("home");
            }
        }
    })

    this.route('profile', {
        path: '/profile',
        template: 'profile',
        onBeforeAction: function () {
            var currentUser = Meteor.userId();
            if (currentUser) {
                this.next();
            } else {
                Bert.alert('Please sign in to view profile', 'danger', 'growl-top-right');
                Router.go("home");
            }
        }
    })

    this.route('signin', {
        path: '/signin',
        template: 'signIn',
        onBeforeAction: function () {
            var currentUser = Meteor.userId();
            if (!currentUser) {
                this.next();
            } else {
                Bert.alert('You are now logged in', 'success', 'growl-top-right');
                Router.go("home");
            }
        }
    })

    this.route('signup', {
        path: '/signup',
        template: 'signUp',
        onBeforeAction: function () {
            var currentUser = Meteor.userId();
            if (!currentUser) {
                this.next();
            } else {
                Bert.alert('Welcome', 'success', 'growl-top-right');
                Router.go("home");
            }
        }
    })
})
