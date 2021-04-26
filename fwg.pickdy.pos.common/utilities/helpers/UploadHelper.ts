import AppConfiguration from "../../fwg.pickdy.common/utilities/AppConfig";
import UtilHelpers from "./UtilHelper";
import AppConfig from "../../fwg.pickdy.common/utilities/AppConfig";
import * as rp from "request-promise";   
export default class UploadHelper {

    /**
     * Upload file throug API
     * @param imageDatas: Array {dataUrl: any, fileName: string, fileType: string}
     * @param restaurantId
     * @param folder
     */
    public static uploadFile(imageDatas: Array<any>, restaurantId: string, folder: string): Promise<any> {
        try {
            let data = [];
            imageDatas.forEach((imageData: any) => {
                data.push(
                    {
                        'Content-Disposition': 'form-data; name="file"; filename=' + imageData.fileName,
                        'Content-Type': imageData.fileType,
                        'body': UtilHelpers.convertDataURIToBinary(imageData.fileUrl)
                    });
            });

            return new Promise((resolve, reject) => {
                let options = {
                    method: 'POST',
                    uri: AppConfig.GetConfiguration(AppConfiguration.REST_API_HOST) + '/upload',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        "Authorization": "Bearer " + localStorage.getItem('id_token'),
                        'RestaurantId': restaurantId,
                        'Folder': folder
                    },
                    body: { restaurantId: 1 },
                    json: true,
                    multipart: {
                        chunked: false,
                        data: data
                    }
                }

                rp(options)
                    .then((response) => {
                        resolve(response);
                    })
                    .catch(function (err) {
                        reject(err);
                    });
            });

        } catch (err) {
            throw new Promise<Error>((resolve, reject) => {
                reject(err as Error);
            });
        }
    }
}

