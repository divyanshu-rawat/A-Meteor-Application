

  Router.configure({
    layoutTemplate: 'FormattingApplication'
  });


    Router.route('/', function () {
    this.render('Welcome', {
      to:"Layout"
    });
  });

  Router.route('/images', function () {
    this.render('navigation-bar', {
      to:"navbar"
    });
    this.render('images', {
      to:"Layout"
    });
  });

//   Router.route('/image/:_id', function () {
//   this.render('navigation-bar', {
//     to:"navbar"
//   });
//   this.render('image', {
//     to:"Layout",
//     data:function(){

//     console.log(Images.findOne({"_id":this.params._id}));
//     console.log('I am in !!!')
//     return Images.findOne({"_id":this.params._id});
//   }
//   });
// });


    Session.set("imageLimit", 8);

      lastScrollTop = 0; 
      $(window).scroll(function(event){
        // test if we are near the bottom of the window
        if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
          // where are we in the page? 
          var scrollTop = $(this).scrollTop();
          // test if we are going down
          if (scrollTop > lastScrollTop){
            // yes we are heading down...
           Session.set("imageLimit", Session.get("imageLimit") + 4);
          }

          lastScrollTop = scrollTop;
        }
            
      })

     Template.images.helpers({

      images:function () {

        if(Session.get('filterSession')){
          console.log('Session Set !');
          return Images.find({createdBy:Session.get('filterSession')});
        }
        else{
            return Images.find({}, {sort:{createdOn: -1, rating:-1}, limit:Session.get("imageLimit")});
        }
      },

      getUser:function(user_id){
        var user = Meteor.users.findOne({_id:user_id});
        if (user){
          return user.username;
        }
        else {
          return "Anonymous";
        }
      },

      checkFilter:function () {
        if(Session.get('filterSession')){
          return true
        }
        else{
          return false;
        }

      },

      getFilterUser:function () {

        if(Session.get('filterSession')){
            var user = Meteor.users.findOne({_id:Session.get('filterSession')});
            return user.username;
        }
        else{
          return false;
        }
      }
              
    });

     Template.body.helpers({

        username:function () {
          if(Meteor.user()){
            // console.log(Meteor.user())
            return Meteor.user().username;
          }
          else{
            return 'Anonymous'
          }
        }


     });


    Accounts.ui.config({
        passwordSignupFields: "USERNAME_AND_EMAIL"
    });

   Template.images.events({

    'click .js-set-image-filter':function(event){
        // console.log(this);

        // console.log(Images.find({createdBy:this.createdBy}));

        Session.set('filterSession', this.createdBy);

    },

      'click .js-unset-image-filter':function(event){
        // console.log(this);

        // console.log(Images.find({createdBy:this.createdBy}));

        Session.set('filterSession', undefined);

    },

 
    // 'click .js-display-user':function (event) {
    //   console.log(Meteor.user()._id);
    //   console.log(Meteor.users.findOne({"_id":Meteor.user()._id}).emails[0].address);
    // },

    'click .js-del-image':function(event){

       console.log('Event Fired !');
       var image_id = this._id;
       console.log(image_id);
       // use jquery to hide the image component
       // then remove it at the end of the animation
       $("#"+image_id).hide('slow', function(){
        Images.remove({"_id":image_id});
       })  
    },

    'click .js-rate-image':function(event){
      var rating = $(event.currentTarget).data("userrating");
      console.log(rating);
      var image_id = this.data_id;
      console.log(image_id);

      Images.update({_id:image_id}, 
                    {$set: {rating:rating}});
    }, 
    'click .js-show-image-form':function(event){
      $("#image_add_form").modal('show');
    }

   });

  Template.image_add_form.events({
    'submit .js-add-image':function(event){
      var img_src, img_alt;
      img_src = event.target.img_src.value;
      img_alt = event.target.img_alt.value;
      console.log("src: "+img_src+" alt:"+img_alt);

      Images.insert({
        img_src:img_src, 
        img_alt:img_alt, 
        createdOn:new Date(),
        createdBy:Meteor.user()._id

      });
       $("#image_add_form").modal('show');
      return false;
    }
  });