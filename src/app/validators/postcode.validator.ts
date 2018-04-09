import { AbstractControl } from '@angular/forms';
import { PostcodeService } from '../services/postcode.service'

export class PostcodeValidator{
    static validatePostcode(postcodeService: PostcodeService) {
        return(control: AbstractControl) => {
            return postcodeService.checkPostCode(control.value).map(res => {
                console.log(res);
                return res.result ? null : { validPostcode: true };
              });
        }
      }
}
