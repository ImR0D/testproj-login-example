import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormLogin } from './shared/form-login/form-login';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormLogin],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
