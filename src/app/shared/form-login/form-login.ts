import { Component, ElementRef, model, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import CreateAccountModel from '../models/Account/CreateAccount.model';
import { A11yModule } from '@angular/cdk/a11y';

@Component({
  selector: 'app-form-login',
  imports: [ReactiveFormsModule, A11yModule],
  templateUrl: './form-login.html',
  styleUrl: './form-login.scss',
})
export class FormLogin {
  controlTransition = model(false);
  sideTransitionRef = viewChild.required<ElementRef<HTMLDivElement>>('transitionContainer');

  signUpForm = new FormGroup<CreateAccountModel>({
    name: new FormControl<string | null>('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl<string | null>('', [Validators.required, Validators.email]),
    password: new FormControl<string | null>('', [Validators.required, Validators.minLength(6)]),
  });

  signInForm = new FormGroup({
    email: new FormControl<string | null>('', [Validators.required, Validators.email]),
    password: new FormControl<string | null>('', [Validators.required, Validators.minLength(6)]),
  });

  transition() {
    if (!this.controlTransition()) {
      this.controlTransition.set(!this.controlTransition());
      this.sideTransitionRef().nativeElement.classList.add('right-panel-active');
      return;
    }
    this.sideTransitionRef().nativeElement.classList.remove('right-panel-active');
    this.controlTransition.set(!this.controlTransition());
  }

  createAccount() {
    if (!this.signUpForm.valid) {
      throw new Error('Formulário inválido. Por favor, preencha todos os campos corretamente.');
    }

    console.log(this.signUpForm.value);
    this.signUpForm.reset();
  }
  login() {
    if (!this.signInForm.valid) {
      throw new Error('Formulário inválido. Por favor, preencha todos os campos corretamente.');
    }

    console.log(this.signInForm.value);
    this.signInForm.reset();
  }
}
