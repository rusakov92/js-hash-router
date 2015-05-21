var Router = (function() {

    var root = '/',
        routes = [],
        // If True searches /404 rout
        // If False notting happens!
        has404 = false;

    /**
     * Add new route to the routes array.
     *
     * @param  {String}   path       The path you want to register
     * @param  {Function} controller The Function to execute
     * @retrun {Object}              To chaine the methods
     */
    function add(path, func) {
        routes.push(buildPath(path, func));
        return this;
    }

    /**
     * Execute the router function.
     *
     * @param  {String} path If you want to test path
     */
    function execute(path) {

        path = path.slice(2).split('/');

        var route = searchRoute(path),
            properties = [];

        if (!route) {
            if (has404) {
                goTo('/404');
            }
            return;
        }

        if (route.propIndex) {
            route.propIndex.forEach(function(value) {
                properties.push(path[value]);
            });
        }

        route.func.apply({}, properties);
    }

    /**
     * Add event listener to work on hash change.
     *
     * @return {Object} To chaine the methods
     */
    function start() {
        execute(getHash());
        window.addEventListener('hashchange', function() {
            execute(getHash());
        });

        return this;
    }

    /**
     * Go to route.
     *
     * @param  {String} path Path you want to go
     * @return {Object}      To chaine the methods
     */
    function goTo(path) {
        window.location.hash = path || root;
        return this;
    }

    /**
     * Build object from path to execute easier.
     *
     * @param  {String}   path Path to build
     * @param  {Function} func Function to execute
     * @return {Object}        Return object with all the properties
     */
    function buildPath(path, func) {

        path = path.slice(1).split('/');

        var propIndex = [],
            pathInfo = {
                func: func,
                path: path,
                // Position of dynamic parts if any
                propIndex: undefined,
                // Position of static parts
                checkIndex: []
            };


        path.forEach(function(value) {
            if(value.search(/^{+|}$/g) !== -1) {

                if (propIndex.indexOf(path.indexOf(value)) !== -1) {
                    throw 'Identifiers must be unique!';
                }

                propIndex.push(path.indexOf(value));
            }
            else {
                pathInfo.checkIndex.push(path.indexOf(value));
            }
        });

        pathInfo.propIndex = propIndex.length ? propIndex : null;

        return pathInfo;
    }

    /**
     * Search route with given path.
     *
     * @param  {Array}  path The path must be array, cleared and splite on "/" symbol
     * @return {Object}      Returns the route or null
     */
    function searchRoute(path) {

        for (var i = routes.length - 1; i >= 0; i--) {

            var route = routes[i];

            if (route.path.length === path.length) {

                var compare = [],
                    match = [];

                for (var j = 0; j < route.checkIndex.length; j++) {
                    compare.push(path[route.checkIndex[j]]);
                    match.push(route.path[route.checkIndex[j]]);
                }

                if (compare.join('') === match.join('')) {
                    return route;
                }
            }
        }

        return null;
    }

    /**
     * Get the hash from the URL.
     *
     * @return {String}
     */
    function getHash() {
        return window.location.hash || '#' + root;
    }

    return {
        config: function(opt) {
            root = opt.root || '/';
            has404 = opt.has404 || false;
            return this;
        },
        add: add,
        start: start,
        goTo: goTo
    };

})();

Router
.config({
    // Changes the default rout
    root: '/login',
    // Adds 404 page
    has404: true
})
.add('/404', function() {
    console.log('404 page');
})
.add('/login', function() {
    console.log('login page');
})
.add('/register', function() {
    console.log('register page');
})
.add('/user/{id}/page/{number}', function(id, number) {
    console.log('User with' + id + ' on Page ' + number);
})
.start();
