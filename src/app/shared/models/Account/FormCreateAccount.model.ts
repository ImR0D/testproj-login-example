import { FormControl } from '@angular/forms';

export default interface FormCreateAccountModel {
  name: FormControl<string | null>;
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}
