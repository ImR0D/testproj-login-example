import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormLogin } from './shared/form-login/form-login';
import { A11yModule } from '@angular/cdk/a11y';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormLogin, A11yModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
