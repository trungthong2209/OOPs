import * as express from 'express';
export default class SecurityConfig {
    public static routes: Array<any> = [
        //public/restaurant
        { "baseUrl": "/public/restaurants", "method": "GET", "path": "/", "key": "BBC_PUBLIC_RESTAURANTS_GET_ALL" },
        { "baseUrl": "/public/restaurants", "method": "PUT", "path": "/updateRegion", "key": "BBC_PUBLIC_RESTAURANTS_UPDATE_LOCATIONS" },
        //public/orders
        { "baseUrl": "/public/orders", "method": "GET", "path": "/getBookingAvailableByRestaurant", "key": "BBC_PUBLIC_BOOKING_GET_BOOKING_AVAILABLE_BY_RESTAURANT" },
        { "baseUrl": "/public/orders", "method": "POST", "path": "/getBookingAvailableByRegion", "key": "BBC_PUBLIC_BOOKING_GET_BOOKING_AVAILABLE_BY_LOCATION" },
        { "baseUrl": "/public/orders", "method": "POST", "path": "/", "key": "BBC_PUBLIC_BOOKING_ADD_BOOKING" },
        { "baseUrl": "/public/orders", "method": "GET", "path": "/:id", "key": "BBC_PUBLIC_BOOKING_GET_BOOKING_BY_ID" },
        { "baseUrl": "/public/orders", "method": "PUT", "path": "/cancel/:id", "key": "BBC_PUBLIC_BOOKING_CHANGE_BOOKING_TO_CANCEL" },
        { "baseUrl": "/public/orders", "method": "PUT", "path": "/confirm/:id", "key": "BBC_PUBLIC_BOOKING_CHANGE_BOOKING_TO_CONFIRM" },
        { "baseUrl": "/public/orders", "method": "PUT", "path": "/discount/:id", "key": "BBC_PUBLIC_BOOKING_CHANGE_DISCOUNT_BOOKING" },

        //orders
        { "baseUrl": "/orders", "method": "POST", "path": "/", "key": "BBC_BOOKING_ADD_BOOKING" },
        { "baseUrl": "/orders", "method": "POST", "path": "/all", "key": "BBC_BOOKING_GET_ALL_BOOKING" },
        { "baseUrl": "/orders", "method": "POST", "path": "/search", "key": "BBC_BOOKING_SEARCH_BOOKING" },
        { "baseUrl": "/orders", "method": "POST", "path": "/aggregate", "key": "BBC_BOOKING_GET_AVAILABLE_BOOKING" },
        { "baseUrl": "/orders", "method": "PUT", "path": "/", "key": "BBC_BOOKING_UPDATE_BOOKING" },
        { "baseUrl": "/orders", "method": "GET", "path": "/:id", "key": "BBC_BOOKING_GET_BOOKING_BY_ID" },
        { "baseUrl": "/orders", "method": "POST", "path": "/searchAggregate", "key": "BBC_BOOKING_CHECK_MEAL_PERIOD" },

        //guests
        { "baseUrl": "/guests", "method": "POST", "path": "/", "key": "BBC_GUEST_ADD_GUEST" },
        { "baseUrl": "/guests", "method": "POST", "path": "/search", "key": "BBC_GUEST_SEARCH_GUEST" },

        //restaurantConfigurations
        { "baseUrl": "/restaurantConfigurations", "method": "POST", "path": "/", "key": "BBC_RESTAURANT_CONFIGURATION_ADD_RESTAURANT_CONFIGURATION" },
        { "baseUrl": "/restaurantConfigurations", "method": "GET", "path": "/:id", "key": "BBC_RESTAURANT_CONFIGURATION_GET_RESTAURANT_CONFIGURATION_BY_ID" },
        { "baseUrl": "/restaurantConfigurations", "method": "DELETE", "path": "/:id", "key": "BBC_RESTAURANT_CONFIGURATION_DELETE_RESTAURANT_CONFIGURATION" },
        { "baseUrl": "/restaurantConfigurations", "method": "PUT", "path": "/", "key": "BBC_RESTAURANT_CONFIGURATION_UPDATE_RESTAURANT_CONFIGURATION" },

        //restaurantMealPeriods
        { "baseUrl": "/restaurantMealPeriods", "method": "POST", "path": "/insertMany", "key": "BBC_RESTAURANT_MEAL_PERIOD_INSERT_MANY_RESTAURANT_MEAL_PERIOD" },
        { "baseUrl": "/restaurantMealPeriods", "method": "GET", "path": "/:id", "key": "BBC_RESTAURANT_MEAL_PERIOD_GET_RESTAURANT_MEAL_PERIOD_BY_ID" },
        { "baseUrl": "/restaurantMealPeriods", "method": "DELETE", "path": "/:id", "key": "BBC_RESTAURANT_MEAL_PERIOD_DELETE_RESTAURANT_MEAL_PERIOD" },
        { "baseUrl": "/restaurantMealPeriods", "method": "PUT", "path": "/", "key": "BBC_RESTAURANT_MEAL_PERIOD_UPDATE_RESTAURANT_MEAL_PERIOD" },

        //restaurants
        { "baseUrl": "/restaurants", "method": "GET", "path": "/:id", "key": "BBC_RESTAURANT_GET_RESTAURANT_BY_ID" },        
        { "baseUrl": "/restaurants", "method": "PUT", "path": "/", "key": "BBC_RESTAURANT_UPDATE_RESTAURANT" },

        //stripe Customer
        { "baseUrl": "/stripeCustomers", "method": "POST", "path": "/", "key": "BBC_STRIPE_CUSTOMER_INSERT_STRIPE_CUSTOMER" },        
        
        //stripe Subscription
        { "baseUrl": "/stripeSubscriptions", "method": "POST", "path": "/", "key": "BBC_STRIPE_SUBSCRIPTION_INSERT_STRIPE_SUBSCRIPTION" },        
        { "baseUrl": "/stripeSubscriptions", "method": "POST", "path": "/activeSubscription", "key": "BBC_STRIPE_SUBSCRIPTION_GET_ACTIVE_STRIPE_SUBSCRIPTION" },        

    ]
    public static GetDataAccessCode(req: express.Request): string {
        let baseUrl = req.baseUrl, method = req.method, path = req.route.path;
        let items: Array<any> = this.routes.filter(x => x.baseUrl == baseUrl && x.method == method && x.path == path);
        if (items && items.length > 0) {
            return items[0].key;
        }
        else {
            return '';
        }
    }
}








