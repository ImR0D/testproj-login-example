import { Component, ElementRef, model, signal, viewChild } from '@angular/core';

@Component({
  selector: 'app-form-login',
  imports: [],
  templateUrl: './form-login.html',
  styleUrl: './form-login.scss',
})
export class FormLogin {
  controlTransition = model(false);
  sideTransitionRef = viewChild.required<ElementRef<HTMLDivElement>>('transitionContainer');

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
    console.log('Creating account...');
  }
  login() {
    console.log('Login...');
  }
}
