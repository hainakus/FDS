import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UrlRememberService } from 'src/app/core/service/url-remember.service';
import { RoomListService } from 'src/app/core/service/room-list.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { RoomDetail } from 'src/app/core/interface/roomDetail.interface';
import { MenuService } from 'src/app/core/service/menu.service';

@Component({
  selector: 'app-storage-list',
  templateUrl: './storage-list.component.html',
  styleUrls: ['./storage-list.component.scss']
})
export class StorageListComponent implements OnInit {
  appUrl: string = environment.appUrl;
  menuOpen = false;
  likedRoom = [];
  likedRoomDetails = [];

  constructor(
    private router: Router,
    private urlRemember: UrlRememberService,
    private roomListService: RoomListService,
    private http: HttpClient,
    private menuService: MenuService
  ) {}

  ngOnInit() {
    this.roomListService.roomList = [];
    this.urlRemember.currentUrl = this.router.url;

    this.http.get(`${this.appUrl}/rooms/like/`).subscribe(
      (res: any) => {
        this.likedRoom = res;
      },
      err => {},
      () => {
        for (const room of this.likedRoom) {
          this.http
            .get(`${this.appUrl}/rooms/${room.room}/`)
            .subscribe((response: RoomDetail) => {
              this.likedRoomDetails.push(response);
            });
        }
      }
    );
    this.menuService.menuOpen.subscribe((booleanValue: boolean) => {
      this.menuOpen = booleanValue;
    });
  }

  toRoomDetail(roomId: number) {
    this.router.navigate([`roomdetail/${roomId}`]);
  }
}
