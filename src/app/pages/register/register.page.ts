import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  schule: string;
  email: string;
  vorname: string;
  nachname: string;
  password1: string;
  password2: string;

  allschooldata: Array<any> = [];

  constructor(private auth: AuthService) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.email = '';
    this.vorname = '';
    this.nachname = '';
    this.schule = '';
    this.password1 = '';
    this.password2 = '';
  }

  register() {
    this.auth.register(this.schule, this.email, this.vorname, this.nachname, this.password1, this.password2);
  }

}
