import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl,  Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.scss']
})
export class TokenComponent implements OnInit {

  form: any;
  screenShowToken = false;
  codigo = 123;
  constructor(
    public authService: AuthService,
    public fb: FormBuilder
    
    ) { }
    
    ngOnInit(): void {
    this.initForm();

    this.screenShowToken = this.authService.isLoggedIn;
    console.log('esta loagdo', this.screenShowToken);

    // this.codigo = localStorage.getItem('user')
    let codigoToken = localStorage.getItem('user');
    console.log('codigoToken', codigoToken);
  }

  
  initForm() {
    this.form =  this.fb.group({
       email: [ null, Validators.required ],
       password: [ null, Validators.required ],
     })
   }
 
 
   logout() {
     this.authService.SignOut();
   }

}
