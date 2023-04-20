import {Component, OnInit} from '@angular/core';
import {IProfile} from "../interface/iprofile";
import {ProfileService} from "../service/profile.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public profileInformation!: IProfile;

  constructor(private profileService: ProfileService) {
  }

  ngOnInit() {
    this.profileService.getProfile().subscribe(res => {
      this.profileInformation = res
    })



  }

}
