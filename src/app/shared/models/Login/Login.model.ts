import { FormControl } from '@angular/forms';

export default interface LoginModel {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}
