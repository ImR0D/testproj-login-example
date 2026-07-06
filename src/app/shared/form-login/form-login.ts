import { Component, ElementRef, inject, model, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import FormCreateAccountModel from '../models/Account/FormCreateAccount.model';
import { A11yModule } from '@angular/cdk/a11y';
import { AuthStrategy } from '../interfaces/AuthStrategy';
import CreateAccountModel from '../models/Account/CreateAccount.model';

@Component({
  selector: 'app-form-login',
  imports: [ReactiveFormsModule, A11yModule],
  templateUrl: './form-login.html',
  styleUrl: './form-login.scss',
})
export class FormLogin {
  authService = inject(AuthStrategy);
  controlTransition = model(false);
  sideTransitionRef = viewChild.required<ElementRef<HTMLDivElement>>('transitionContainer');

  signUpForm = new FormGroup<FormCreateAccountModel>({
    name: new FormControl<string | null>('', Validators.required),
    email: new FormControl<string | null>('', [Validators.required, Validators.email]),
    password: new FormControl<string | null>('', Validators.required),
  });

  signInForm = new FormGroup({
    email: new FormControl<string | null>('', [Validators.required, Validators.email]),
    password: new FormControl<string | null>('', Validators.required),
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

  async createAccount() {
    if (!this.signUpForm.valid) {
      throw new Error('Formulário inválido. Por favor, preencha todos os campos corretamente.');
    }
    const form = this.signUpForm.value;

    const entityMapping: CreateAccountModel = {
      name: form.name!,
      email: form.email!,
      password: form.password!,
    };

    try {
      await this.authService.register(entityMapping);
      alert('Conta criada com sucesso! Faça login para continuar');
      this.signUpForm.reset();
      this.transition();
    } catch {
      alert('Erro ao registrar usuário');
    }
  }

  async login() {
    if (!this.signInForm.valid) {
      throw new Error('Formulário inválido. Por favor, preencha todos os campos corretamente.');
    }
    const form = this.signInForm.value;

    try {
      const isAuthenticated = await this.authService.login(form.email!, form.password!);

      if (isAuthenticated) {
        alert('Login realizado com sucesso');
        this.signInForm.reset();
      } else {
        alert('E-mail ou senha incorretos, usuário não autenticado!');
      }
    } catch (error) {
      console.error('Erro real detectado no processo de login:', error);
      console.warn('Ops!... Ocorreu um erro inesperado ao tentar realizar o login');
    }
  }
}
