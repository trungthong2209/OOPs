﻿export default class Constants{
    public static QUERY_SEARCH_STRING: string = 'QUERY_SEARCH_STRING';
    public static METHOD_NOT_IMPLMENTED: string = 'This method has not been implmented.';

    public static PERSISTANCE_MONGO: string = 'MONGO'; //If it is not Mongo it is REST
    public static PERSISTANCE_POSTGRES: string = "POSTGRES";
    public static PERSISTANCE_REST: string = "REST";
    public static PERSISTANCE_SYNC: string = "SYNC_SERVICE";

    public static CACHE_REDIS: string = 'REDIS';
    public static CACHE_BROWSER: string = 'BROWSER';

    public static UNAUTHORISED_MESSAGE: string = 'You don\'t have permission to access this functionality.';
    public static ERROR_MESSAGE: string = 'An error has occurred while running.';
    public static ERROR_NOT_IMPLMENTED: string = 'Abstract method has been called but is not implmented.';
    public static USER_MUST_AUTHENTICATE = 'User must authenticate!';
    public static USER_ALREADY_EXIST = 'The user already exists.';
	public static USER_DOES_NOT_EXIST = 'User doesn\'t exists.';
    public static INVALID_TOKEN = 'Invalid Token!';
    public static NOT_FOUND_IN_DB = "Not found in database."
    public static CONFIRMATION: string = 'Confirmation';
    public static THERE_ARE_ERROR_ON_PAGE = 'There are some errors on this page.';
    public static USER_CREATE_FAILURE: string = 'User was created failure.';

    public static TOKEN_ID = "id_token";
	public static SOCKET_CONNECTION_ID: string = 'socket-connection-id';

    public static COUNTRY_CODE: string = '+61';

	static ERROR_MONGO = class {
        public static DUPLICATE: number = 11000;
    }

	public static DATE_TIME = class {
        public static DATE_FORMAT: string = 'dd MM yy';
        public static DATE_SHORT_FORMAT: string = 'dd MMM yyyy'
        public static TIME_FORMAT: string = 'hh:mm a';
        public static LANGUAGE_CULTURE = 'en-us';
        public static DATE_WITH_DAY_ORDINAL_FORMAT = '%s, %s %s %d';
        public static DATE_LONG_FORMAT: string = 'yyyy/MM/dd hh:mm';
		public static FULL_DATE_FORMAT_WITH_TWO_LINE = '%s | %s/%s, %d';
    }

    static DAY_OF_WEEK = class {
        public static MONDAY: number = 1;
        public static TUESDAY: number = 2;
        public static WEDNESDAY: number = 3;
        public static THURSDAY: number = 4;
        public static FRIDAY: number = 5;
        public static SATURDAY: number = 6;
        public static SUNDAY: number = 0;
    }

	static VALIDATORDECORATOR = class {
        public static VALIDATOR_REQUIRED_NAME = 'required';
        public static VALIDATOR_INTEGER_NAME = 'integer';
        public static VALIDATOR_EMAIL_NAME = 'email';
        public static VALIDATOR_MOBILE_NAME = 'mobile';
        public static VALIDATOR_MIN_NAME = 'min';
		public static VALIDATOR_MIN_MAX_NAME = 'minMax';
        public static VALIDATOR_LESS_THAN_NUMBER_NAME = 'lessThanNumber'
        public static VALIDATOR_MIN_LESS_EQUAL_MAX_NAME = 'minLessEqualMax';
        public static VALIDATOR_MAX_GREATER_EQUAL_MIN_NAME = 'maxGreaterEqualMin';
        public static VALIDATOR_MIN_DATE = 'minDate';
        public static VALIDATOR_MIN_LENGTH_NAME = 'minLength';
        public static VALIDATOR_MIN_ARRAY_LENGTH_NAME = 'minArrayLength';
        public static VALIDATOR_MAX_NAME = 'max';
        public static VALIDATOR_MAX_LENGTH_NAME = 'maxLength';
        public static VALIDATOR_MAX_ARRAY_LENGTH_NAME = 'maxArrayLength';
        public static VALIDATOR_GREATER_THAN_NAME = 'greater';
        public static VALIDATOR_GREATER_THAN_OR_EQUAL_NAME = 'greaterOrEqual';
        public static VALIDATOR_LESS_THAN_NAME = 'less';
        public static VALIDATOR_LESS_THAN_OR_EQUAL_NAME = 'lessOrEqual';
        public static VALIDATOR_COMPARE_STRING = 'compare';
        public static VALIDATOR_COMPARE_NOT_SAME_STRING = 'compareNotSame';
        public static VALIDATOR_PHONE_NAME = 'phone';
        public static IGNORE_VALIDATION = 'ignore';
        public static REQUIRED_AT_LEAST_ONE_DAY_OF_WEEK = 'oneDayOfWeek';
        public static DAY_IN_WEEK: number = 6;
        public static PERIOD_OVERLAP_TIME = 'overlapTime';
        public static VALIDATOR_NUMERIC_VALUE = 'numeric';
		public static VALIDATOR_FLOAT_NAME = 'float';
        public static VALIDATOR_MIN_CURRENT_TIME = 'minCurrentTime';
		public static VALIDATOR_MIN_CURRENT_MINUTES = 'minCurrentMinutes';
        public static VALIDATOR_MAX_OR_EQUAL_NAME = 'maxOrEqual';
        public static VALIDATOR_MIN_OR_EQUAL_NAME = 'minOrEqual';
        public static VALIDATOR_MAX_MEAL_PERIODS_NAME = 'maxMealPeriods';
        public static VALIDATOR_DUPLICATE_MEAL_PERIODS_NAME = 'duplicateMealPeriodName';
    }

	static USER = class {
        static USER_SEARCH_ACTION = class {
            public static LOGIN = 'LOGIN';
            public static FORGOT_PASSWORD = 'FORGOT_PASSWORD';
            public static RESET_PASSWORD = 'RESET_PASSWORD';
            public static DECODE_TOKEN = 'DECODE_TOKEN';
            public static CHECK_TOKEN = 'CHECK_TOKEN';
            public static GET_USER_BY_LIST_ID = 'GET_USER_BY_LIST_ID';
            public static GET_USER_ON_LOCATION = 'GET_USER_ON_LOCATION';
            public static SEND_EMAIL_INVITE = 'SEND_EMAIL_INVITE';
            public static GET_LIST_ROLE = 'GET_LIST_ROLE';
        }
        public static DELETE_USER: string = 'Are you sure you want to delete this user?'
        public static FIRSTNAME_REQUIRE: string = 'First Name is required.';
        public static FIRSTNAME_MAXLENGTH: string = 'Max length of First Name is %d characters.';
        public static FIRSTNAME_MAXLENGTH_VALUE: number = 200;

        public static LASTNAME_REQUIRE: string = 'Last Name is required.';
        public static LASTNAME_MAXLENGTH: string = 'Max length of Last Name is %d characters.';
        public static LASTNAME_MAXLENGTH_VALUE: number = 200;

        public static EMAIL_REQUIRE: string = 'Email is required.';
        public static EMAIL_INCORRECT: string = 'Email is incorrect.';
        public static EMAIL_MAXLENGTH: string = 'Max length of Email is %d characters.';
        public static EMAIL_MAXLENGTH_VALUE: number = 200;

        public static MOBILE_REQUIRE: string = 'Mobile is required.';
        public static MOBILE_INCORRECT: string = 'Mobile number is incorrect.';
        public static MOBILE_MINLENGTH: string = 'Min length of Mobile Number is %d characters.';
        public static MOBILE_MAXLENGTH: string = 'Max length of Mobile is %d characters.';
        public static MOBILE_MAXLENGTH_VALUE: number = 12;
        public static MOBILE_MINLENGTH_VALUE: number = 8;

        public static PASSWORD_REQUIRE: string = 'Password is required.';
        public static PASSWORD_MINLENGTH: string = 'Min length of Password is %d characters.';
        public static PASSWORD_MINLENGTH_VALUE: number = 6;
        public static PASSWORD_MAXLENGTH: string = 'Max length of Password is %d characters.';
        public static PASSWORD_MAXLENGTH_VALUE: number = 200;
        public static NEWPASSWORD_SAME_WITH: string = 'New Password is same with Current Password.';
        public static CONFIRMPASSWORD_REQUIRE: string = 'Confirm Password is required.';
        public static CONFIRMPASSWORD_COMPARE: string = 'Password is not match.';

        public static USER_UPDATE_SUCCESS: string = 'The User was updated successfully.';
        public static USER_UPDATE_NOCHANGE: string = 'The User was not changed.';
        public static USER_CREATE_SUCCESS: string = 'Register successed.';
        public static USER_CREATE_FAILURE: string = 'Register failed.';
    }

    static DB_TYPES = {
        MONGO: Constants.PERSISTANCE_MONGO,
        POSTGRES: Constants.PERSISTANCE_POSTGRES,
        REST: Constants.PERSISTANCE_REST,
        SYNC: Constants.PERSISTANCE_SYNC,
        NONE: 'NO PERSISTANCE'
    }

    static LOCATIONS = class {
        //not here like this error messages from valition routine to include this. 
        //i.e generic messague subsitutaing name.
        ///  public static NAME_REQUIRE: string = 'Restaurant Name is required.';
        ///  public static NAME_MAXLENGTH: string = 'Max length of restaurant name is %d characters.';
        public static NAME_MAXLENGTH: number = 200;
    }

	/*  TODO REVIEW.  */
	static SUBSCRIPTION = class {
        public static DEFAULT_PLAN = 'defaultPlan';
        public static MESSAGE_SORRY: string = 'We are sorry but your subscription is %s.';
        public static MESSAGE_CONTACT_SUPPORT: string = 'Please contact H&L for further assistance 1300 797 638';
        public static ARE_YOU_SURE_YOU_WANT_TO_CANCEL_SUBCRIPTION: string = 'Are you sure you want to cancel this subscription?';
        public static YOUR_SUBSCRIPTION_WAS_UPDATED_SUCCESSFULY: string = 'Your subscription was updated successfuly!';
        public static YOUR_SUBSCRIPTION_HAS_BEEN_SET_TO_CANCEL: string = 'Your subscription has been set to cancel at the end of the billing period.';
        public static CURRENT_PERIOD: string = 'Current period';
        public static STATUS = class {
            public static TRIALLING: string = 'trialing';
            public static ACTIVE: string = 'active';
            public static PAST_DUE: string = 'past_due';
            public static CANCELED: string = 'canceled';
            public static UNPAID: string = 'unpaid';
        }
    }
	
}