import { Injectable } from '@angular/core';
import { Observable, of} from "rxjs";
import {IProfile} from "../interface/iprofile";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor() { }

  //For simulation API
  getProfile():Observable<IProfile> {
    const Profile = {
      id: 123458777,
      email: '12345@gmail.com',
      type: 'User',
      fullName: 'Full Name',
      country: 'Canada',
      owner:'Admin',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
      imgUrl: '../assets/images/img.png',
      phone: 935_121_11_55,
    }
    return of(Profile).pipe()
  }
}
