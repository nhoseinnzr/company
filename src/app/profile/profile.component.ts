import {Component, OnDestroy, OnInit} from '@angular/core';
import {IProfile} from "../interface/iprofile";
import {ProfileService} from "../service/profile.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit,OnDestroy  {
  public profileInformation!: IProfile;
  subscription!: Subscription;
  constructor(private profileService: ProfileService) {
  }

  ngOnInit() {
   this.subscription = this.profileService.getProfile().subscribe(res => {
      this.profileInformation = res
    })

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
