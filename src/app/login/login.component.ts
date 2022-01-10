import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  submitCreds = 'https://asia-south1-cc-dev-sandbox-20200619.cloudfunctions.net/get_login_token';
  dataApi = 'https://asia-south1-cc-dev-sandbox-20200619.cloudfunctions.net/get_quote_summary';
  orgApi = 'https://asia-south1-cc-dev-sandbox-20200619.cloudfunctions.net/get_quote_summary';
  username: String;
  password: String;
  bearerToken: String;
  orgs = [];
  selectedOrg;
  finalresponse;
  constructor(private _http: HttpClient) { }

  ngOnInit() {
  }

  submit() {
    const creds = btoa(this.username+":"+this.password);
    const header = new HttpHeaders({
      Authorization: 'Basic '+creds,
      'Access-Control-Allow-Origin': '*',
    });
    console.log(atob(creds));
    this._http.post(this.submitCreds, {}, {headers: header}).toPromise().then( token => {
      this.bearerToken = 'Bearer '+token['token'];
      this.getData();
    }).catch(er => {
      console.error(er);
    })
  }

  getData() {
    const header = new HttpHeaders({
      Authorization: this.bearerToken.toString(),
    })
    this._http.get(this.dataApi, {headers: header}).toPromise().then(res => {
      console.log(res);
      this.orgs = res['Listed_Orgnisations'];
    }). catch(er => {
      console.error(er);
    });
  }

  submitOrg() {
    // const body = {orgs: [this.selectedOrg]}
    const header = new HttpHeaders({
      Authorization: this.bearerToken.toString(),
      'Content-Type': 'application/json',
      // 'data-raw': JSON.stringify(body)
    });
    this._http.post(this.orgApi, {'orgs': [this.selectedOrg]},  {headers: header}).toPromise().then(res => {
      this.finalresponse = res;
    }).catch(er => console.error(er));
  }


}
