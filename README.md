# js-hash-router
This router is for people who want to create there own JS freamwork and see how a very basic router is created.

## Install
Just add this script to your main html file.

## Using the router
The router behaves like singleton class so you can just call it by it's name.

### Set configuration setings:

```
Router.config({
    root: '/login',
    has404: true
});
```

The config method accepts only object with root and has404 property.
* root: is the default path to your freamwork, if there is no hash or you load your page for the first time, it will load the root path.
* has404: is a boolean and if it's set to true, the Router will look for 404 page when there is no path in the routes array. The page must exist and added to the array!

### To add new paths:

```
Router.add('/404', function() {
    console.log('404 page');
});

// You can also chain this method.
Router
.add('/login', function() {
    console.log('login page');
})
.add('/register', function() {
    console.log('register page');
});
```

The first argument is the route path and must be a string. The second argument is what to execute, it must be anonymous function.

### To start the Router:

```
Router.start();
```

This must be at the bottom after all added paths and coonfig settings. Now on hash change event the router will response with a page.

### To add variables:

```
Router.add('/user/{id}/page/{number}', function(id, number) {
    console.log('User with' + id + ' on Page ' + number);
});
```

They must be in curly brackets and the names must be unique.

### To call a route:

```
<a href="#/user/1/page/3">Link</a>
```

Just add a link that changes the hash in the browser.
