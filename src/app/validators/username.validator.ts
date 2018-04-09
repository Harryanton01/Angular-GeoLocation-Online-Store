import { AbstractControl } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import 'rxjs/add/observable/of';


export class UsernameValidator{
    static validateUsername(authService: AuthenticationService) {
        return(control: AbstractControl) => {
            return authService.checkUsername(control.value).map(res => {
                return (res.length==0) ? null : {validUsername: true};
        }).take(1);
      }
    }
}