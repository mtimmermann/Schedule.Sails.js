Sails.js Boilerplate
====================

A boiler plate Sails.js MVC application with simple role-based security and a user admin section.
Sails.js 0.10	http://sailsjs.org/
MongoDB
AngularJS
Bootstrap 3

Includes Visual Studio solution and project files to run and debug with VS 2013 and Node.js tools


## Installation ##
Install Node JS, Sails JS, MongoDB

``` bash
npm install
```

## Running ##
``` bash
sails lift
```


## Misc Notes ##

Waterline documentation
https://www.npmjs.com/package/waterline

# Create the sails app
sails new schedule-sails

# Sails Casts #
Deploy to Heroku
http://irlnathan.github.io/sailscasts/blog/2013/11/05/building-a-sails-application-ep26-deploying-a-sails-app-to-heroku/

http://irlnathan.github.io/sailscasts/blog/2015/01/20/building-an-angular-application-in-sails-ep3-understanding-asset-delivery-options-in-our-signup-page/

http://irlnathan.github.io/sailscasts/blog/2015/03/06/building-an-angular-application-in-sails-ep4-implementing-requests-in-angular-to-a-sails-api/

http://irlnathan.github.io/sailscasts/blog/2015/03/06/building-an-angular-application-in-sails-creating-custom-actions-and-an-intro-to-node-machines/

http://irlnathan.github.io/sailscasts/blog/2015/04/04/building-an-angular-application-in-sails-ep6-user-authentication-in-angular-and-sails/


# Create passport authentication
https://www.bearfruit.org/2014/07/21/tutorial-easy-authentication-for-sails-js-apps/

Install sails-generate-auth module #
``` bash
npm install sails-generate-auth --save
```

Generate authentication with this command:
``` bash
sails generate auth
```

Next configure the login strategy. Two common examples are local and Twitter login. Before these can used the module must be installed. Therefore you may need to install passport-local or passport-twitter. Below, use Local.
``` bash
npm install passport-local --save
```

Remove all node packages in bash
``` bash
for package in `ls node_modules`; do npm uninstall $package; done;
```

# Admin Panel #
``` bash
npm i sails-generate-bower --save
sails generate bower
bower install ng-admin --save
```
http://stackoverflow.com/questions/18139290/how-do-i-connect-bower-components-with-sails-js


http://blog.mohammedlakkadshaw.com/introduction_to_sails_js.html#.VS847Y70-7A


Angular JS shared code between controlers using services
http://fdietz.github.io/recipes-with-angular-js/controllers/sharing-code-between-controllers-using-services.html

http://jsfiddle.net/api/post/library/pure/

https://docs.angularjs.org/guide/services



Pagination
http://www.michaelbromley.co.uk/blog/108/paginate-almost-anything-in-angularjs


