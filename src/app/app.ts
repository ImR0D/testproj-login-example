import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormLogin } from './shared/form-login/form-login';

import '@angular/localize/init';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormLogin],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
