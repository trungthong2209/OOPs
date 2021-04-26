import StaffsManager from "../../fwg.pickdy.pos.common/model/manager/StaffsManager";
import Staffs from "../../fwg.pickdy.pos.common/model/Staffs";
import HttpStatus from "../../fwg.pickdy.common/base/HttpStatus";
import Constants from "../../fwg.pickdy.pos.common/base/Constants";
import AppConfig from "../../fwg.pickdy.common/utilities/AppConfig";
import * as bcrypt from 'bcryptjs';
import PickdyLogHelper from "../utilities/helper/PickdyLogHelper";
let jwt = require('jsonwebtoken');
export default class StaffService {
  protected staffsManager: StaffsManager;
  constructor(user: Staffs) {
    this.staffsManager = new StaffsManager(user);
  }
  public insertStaffs(staffs: Staffs): Promise<HttpStatus<Staffs>> {
    let promise = new Promise<HttpStatus<Staffs>>((resolve, reject) => {
      if (staffs.password) {
        if (staffs.password === staffs.confirmPassword) {
          bcrypt.genSalt(10).then((salt) => {
            bcrypt.hash(staffs.password, salt).then((hashedPassword) => {
              staffs.password = hashedPassword;
              staffs.confirmPassword = hashedPassword;
              this.staffsManager.search({ "userName": staffs.userName }).then((httpStatusStaffs: HttpStatus<Array<Staffs>>) => {
                if (httpStatusStaffs != null && httpStatusStaffs.entity != null && httpStatusStaffs.entity.length > 0) {
                  let rejectStatus = new HttpStatus<Staffs>(HttpStatus.BAD_REQUEST, null);
                  rejectStatus.message = Constants.STAFFS.USERNAME_DUPLICATE;
                  reject(rejectStatus);
                } else {
                  this.staffsManager.insert(staffs).then((httpStatus: HttpStatus<Staffs>) => {
                    resolve(httpStatus);
                  }).catch((err) => {
                    PickdyLogHelper.error('SERVICE-StaffService-insertStaffs ' + JSON.stringify(err) + ' --data --' + JSON.stringify(staffs));
                    reject(HttpStatus.getHttpStatus(err));
                  });
                }
              }).catch((err) => {
                reject(HttpStatus.getHttpStatus(err));
              });

            })
          });
        } else {
          let rejectStatus = new HttpStatus<Staffs>(HttpStatus.BAD_REQUEST, null);
          rejectStatus.message = Constants.STAFFS.CONFIRMPASSWORD_COMPARE;
          reject(rejectStatus);
        }
      } else {
        let rejectStatus = new HttpStatus<Staffs>(HttpStatus.BAD_REQUEST, null);
        rejectStatus.message = Constants.STAFFS.PASSWORD_REQUIRE;
        reject(rejectStatus);
      }
    });
    return promise;
  }
  public changePassword(staffs: Staffs): Promise<HttpStatus<Staffs>> {   
    let promise = new Promise<HttpStatus<Staffs>>((resolve, reject) => {
      if (staffs.password) {
        if (staffs.password === staffs.confirmPassword) {
          bcrypt.genSalt(10).then((salt) => {
            bcrypt.hash(staffs.password, salt).then((hashedPassword) => {
              this.staffsManager.get({ _id: this.staffsManager.objectID(staffs._id) }).then((staffsGet: HttpStatus<Staffs>) => {                 // UPDATE ORDER
                let staffUpdate = staffsGet.entity;
                staffUpdate.password = hashedPassword;
                staffUpdate.confirmPassword = hashedPassword;
                staffUpdate.token = '';
                staffUpdate.tokendevice = '';
                this.staffsManager.update({ _id: this.staffsManager.objectID(staffUpdate._id) }, staffUpdate).then((httpStatus: HttpStatus<Staffs>) => {
                  resolve(httpStatus);
                }).catch((err) => {
                  PickdyLogHelper.error('SERVICE-StaffService-changePassword ' + JSON.stringify(err) + ' --data --' + JSON.stringify(staffs));
                  reject(HttpStatus.getHttpStatus(err));
                });
              }).catch((err) => {
                PickdyLogHelper.error('SERVICE-StaffService-changePassword NOT EXIST STAFF ' + JSON.stringify(err) + ' --data --' + JSON.stringify(staffs));
                reject(HttpStatus.getHttpStatus(err));
              });
            });
          });
        } else {
          let rejectStatus = new HttpStatus<Staffs>(HttpStatus.BAD_REQUEST, null);
          rejectStatus.message = Constants.STAFFS.CONFIRMPASSWORD_COMPARE;
          reject(rejectStatus);
        }
      } else {
        let rejectStatus = new HttpStatus<Staffs>(HttpStatus.BAD_REQUEST, null);
        rejectStatus.message = Constants.STAFFS.PASSWORD_REQUIRE;
        reject(rejectStatus);
      }
    });
    return promise;
  }
  public login(staffs: Staffs): Promise<HttpStatus<Staffs>> {
    let promise = new Promise<HttpStatus<Staffs>>((resolve, reject) => {
      if (staffs.tel && staffs.password) {
        let userInfo: Staffs;
        if (staffs.role !== 'ADMIN') {
          this.staffsManager.search({ tel: Number(staffs.tel) }).then((httpStatusTel: HttpStatus<Staffs[]>) => {
            if (httpStatusTel != null && httpStatusTel.entity && httpStatusTel.entity.length > 0) {
              this.staffsManager.search({ userName: staffs.userName }).then((httpStatus: HttpStatus<Staffs[]>) => {
                if (httpStatus != null && httpStatus.entity && httpStatus.entity.length > 0) {
                  userInfo = httpStatus.entity[0];
                  bcrypt.compare(staffs.password, userInfo.password).then((isMatch) => {
                    if (isMatch) {
                      const payload = {
                        _id: userInfo._id, shopId: userInfo.shopId, userName: userInfo.userName, role: userInfo.role
                      };
                      jwt.sign(payload, AppConfig.GetConfiguration(AppConfig.AUTH0_APP_SECRET), (err, token) => {
                        if (!err) {
                          if (staffs.loginMode === 'MOBILE') {
                            userInfo.tokendevice = token;
                          } else {
                            userInfo.token = token;
                          }
                          this.staffsManager.user = userInfo;
                          this.staffsManager.update({ _id: this.staffsManager.objectID(userInfo._id) }, userInfo).then((httpStatus: HttpStatus<Staffs>) => {
                            resolve(httpStatus);
                          }).catch((err) => {
                            let rejectStatus = new HttpStatus<Staffs>(HttpStatus.UNAUTHORISED, null);
                            rejectStatus.message = 'LOGIN AGAIN!';
                            reject(rejectStatus);
                          });
                        } else {
                          let rejectStatus = new HttpStatus<Staffs>(HttpStatus.UNAUTHORISED, null);
                          rejectStatus.message = 'LOGIN AGAIN!';
                          reject(rejectStatus);
                        }
                      });
                    } else {
                      let rejectStatus = new HttpStatus<Staffs>(HttpStatus.UNAUTHORISED, null);
                      rejectStatus.message = 'PASSWORK INCORECT!';
                      reject(rejectStatus);
                    }
                  });
                } else {
                  let rejectStatus = new HttpStatus<Staffs>(HttpStatus.UNAUTHORISED, null);
                  rejectStatus.message = 'LOGIN AGAIN!';
                  reject(rejectStatus);
                }
              }).catch((err) => {
                let rejectStatus = new HttpStatus<Staffs>(HttpStatus.UNAUTHORISED, null);
                rejectStatus.message = 'LOGIN AGAIN!';
                reject(rejectStatus);
              });
            } else {
              let rejectStatus = new HttpStatus<Staffs>(HttpStatus.UNAUTHORISED, null);
              rejectStatus.message = 'LOGIN AGAIN!';
              reject(rejectStatus);
            }
          }).catch((err) => {
            let rejectStatus = new HttpStatus<Staffs>(HttpStatus.UNAUTHORISED, null);
            rejectStatus.message = 'LOGIN AGAIN!';
            reject(rejectStatus);
          });;
        } else {
          this.staffsManager.search({ tel: Number(staffs.tel), role: staffs.role }).then((httpStatus: HttpStatus<Staffs[]>) => {
            if (httpStatus != null && httpStatus.entity && httpStatus.entity.length > 0) {
              userInfo = httpStatus.entity[0];
              bcrypt.compare(staffs.password, userInfo.password).then((isMatch) => {
                if (isMatch) {
                  const payload = {
                    _id: userInfo._id, shopId: userInfo.shopId, userName: userInfo.userName, role: userInfo.role
                  };
                  jwt.sign(payload, AppConfig.GetConfiguration(AppConfig.AUTH0_APP_SECRET), (err, token) => {
                    if (!err) {
                      if (staffs.loginMode === 'MOBILE') {
                        userInfo.tokendevice = token;
                      } else {
                        userInfo.token = token;
                      }
                      this.staffsManager.user = userInfo;
                      this.staffsManager.update({ _id: this.staffsManager.objectID(userInfo._id) }, userInfo).then((httpStatus: HttpStatus<Staffs>) => {
                        resolve(httpStatus);
                      }).catch((err) => {
                        let rejectStatus = new HttpStatus<Staffs>(HttpStatus.UNAUTHORISED, null);
                        rejectStatus.message = 'LOGIN AGAIN!';
                        reject(rejectStatus);
                      });
                    } else {
                      let rejectStatus = new HttpStatus<Staffs>(HttpStatus.UNAUTHORISED, null);
                      rejectStatus.message = 'LOGIN AGAIN!';
                      reject(rejectStatus);
                    }
                  });
                } else {
                  let rejectStatus = new HttpStatus<Staffs>(HttpStatus.UNAUTHORISED, null);
                  rejectStatus.message = 'PASSWORK INCORECT!';
                  reject(rejectStatus);
                }
              });
            } else {
              let rejectStatus = new HttpStatus<Staffs>(HttpStatus.UNAUTHORISED, null);
              rejectStatus.message = 'LOGIN AGAIN!';
              reject(rejectStatus);
            }
          }).catch((err) => {
            let rejectStatus = new HttpStatus<Staffs>(HttpStatus.UNAUTHORISED, null);
            rejectStatus.message = 'LOGIN AGAIN!';
            reject(rejectStatus);
          });
        }

      } else {
        let rejectStatus = new HttpStatus<Staffs>(HttpStatus.UNAUTHORISED, null);
        rejectStatus.message = 'Please Input tel/pass';
        reject(rejectStatus);
      }
    });
    return promise;
  }
}