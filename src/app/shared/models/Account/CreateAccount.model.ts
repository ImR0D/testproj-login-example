import { FormControl } from '@angular/forms';

export default interface CreateAccountModel {
  name: FormControl<string | null>;
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}
