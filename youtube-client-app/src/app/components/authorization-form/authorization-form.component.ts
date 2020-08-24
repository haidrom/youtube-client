import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
@Component({
  selector: 'app-authorization-form',
  templateUrl: './authorization-form.component.html',
  styleUrls: ['./authorization-form.component.scss']
})
export class AuthorizationFormComponent implements OnInit {

  public authForm: FormGroup;

  public hide: boolean = true;

  constructor(private fb: FormBuilder, private router: Router, private loginService: LoginService) {

    this.authForm = fb.group({
      login: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  public ngOnInit(): void {
    this.loginService.logOut();
  }

  public onSubmit(): void {
    this.loginService.logIn(this.authForm.controls.login.value);
    this.router.navigate(['main']);
  }

}
