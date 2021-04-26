export default class Constants {
    public static SHOP_ID_REQUIRE: string = 'Shop Id is required.'
    public static TEL_BOOKING_REQUIRE: string = 'Nhập số điện thoại liên lạc.'
    public static NAME_REQUIRE: string = 'Name is required.'
    public static PARENT_ID_REQUIRE: string = 'Product Parent Id is required.'
    static STAFFS = class { 
        public static DELETE_USER: string = 'Are you sure you want to delete this user?';
        public static FULLNAME_REQUIRE: string = 'FullName is required.';
        public static FULLNAME_MAXLENGTH: string = 'Max length of FullName is %d characters.';
        public static FULLNAMEMAXLENGTH_VALUE: number = 200;

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
        public static USERNAME_DUPLICATE: string = 'User Name is duplicate';

        public static USER_UPDATE_SUCCESS: string = 'The User was updated successfully.';
        public static USER_UPDATE_NOCHANGE: string = 'The User was not changed.';
        public static USER_CREATE_SUCCESS: string = 'Register successed.';

        public static USER_CREATE_FAILURE: string = 'Register failed.';
        public static USERNAME_REQUIRE: string = 'User Name is required.';
        public static USERNAME_MAXLENGTH: string = 'Max length of User Name is %d characters.';
        public static USERNAME_MAXLENGTH_VALUE: number = 200;
        public static USERNAME_MINLENGTH: string = 'Min length of User Name is %d characters.';
        public static USERNAME_MINLENGTH_VALUE: number = 3;
        public static ROLE_REQUIRE: string = 'Role is required.';
    }
    static DISCOUNTEVENTRULES = class { 
        
        public static DISCOUNTTYPE_REQUIRE: string = 'DisCount Type is required.'; 
    }
    static ORDER = class {         
        public static OPEN_ORDER: string = 'OPEN'; 
        public static BILL: string = 'BILL'; 
        public static CANCEL_ORDER: string = 'CANCEL';
        public static BILL_CANCEL: string = 'BILL_CANCEL'; 
        public static TABLE_REQUIRE: string = 'Table is required.';
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
    static RAWMATERIAL = class {         
        public static UNITID_REQUIRE: string = 'Unit Id is required.'; 
        public static RAWMATERIAL_ID_REQUIRE: string = 'Rawmaterial is required.';
    }
    static DATAACCESS = class { 
        
        public static ROLE_REQUIRE: string = 'Role is required.'; 
    }
}