import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ReactiveFormsModule, FormGroup, FormControl,  Validators, FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  registerForm: any;
  loginForm: any;
  screenShowToken = false;
  openT1 = false;
  openT2 = false;
  constructor(
    public authService: AuthService, // Inject
    public fb: FormBuilder
    
    ) { }
    
    ngOnInit(): void {
    this.initRegisterForm();
    this.initLoginForm();

    this.screenShowToken = this.authService.isLoggedIn;
    console.log('esta LOGADO', this.screenShowToken);
  }



  initRegisterForm() {
   this.registerForm =  this.fb.group({
      name: [ null, Validators.required ],
      email: [ null, Validators.required ],
      phone: [ null, Validators.required ],
      password: [ null, Validators.required ],
      t1: [ true, Validators.requiredTrue ],
      t2: [ true, Validators.requiredTrue ],
    })
  }

  initLoginForm() {
    this.loginForm =  this.fb.group({
       email: [ null, Validators.required ],
       password: [ null, Validators.required ],
     })
   }

  register(registerForm: any) {
    let name = registerForm.value.name;
    let email = registerForm.value.email;
    let phone = registerForm.value.phone;
    let password = registerForm.value.password;
    this.authService.SignUp(name, email, phone, password)
  }


  login(form: any) {
    let email = form.value.email;
    let password = form.value.password;
    this.authService.SignIn(email, password)
  }

  setScreenShowToken() {
    this.screenShowToken = !this.screenShowToken;
  }


  showOpenT1() {
    this.openT1 = !this.openT1;
  }
  showOpenT2() {
    this.openT2 = !this.openT2;

  }



}
