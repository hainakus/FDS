import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UrlRememberService } from 'src/app/core/service/url-remember.service';
import { HttpClient } from '@angular/common/http';
import { ReservationInfoService } from '../../core/service/reservation-info.service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { RoomListService } from 'src/app/core/service/room-list.service';
import { MenuService } from 'src/app/core/service/menu.service';

@Component({
  selector: 'app-your-trip',
  templateUrl: './your-trip.component.html',
  styleUrls: ['./your-trip.component.scss']
})
export class YourTripComponent implements OnInit {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  appUrl = environment.appUrl;
  menuOpen = false;

  pastReservation = [];
  plannedReservation = [];

  constructor(
    private router: Router,
    private urlRemember: UrlRememberService,
    private http: HttpClient,
    private reservationInfoService: ReservationInfoService,
    private roomListService: RoomListService,
    private menuService: MenuService
  ) {}

  ngOnInit() {
    this.roomListService.roomList = [];
    const id = localStorage.getItem('userId');
    this.urlRemember.currentUrl = this.router.url;

    this.http.get(`${this.appUrl}/accounts/user/${id}/`).subscribe(
      (res: any) => {
        for (const reservation of res.reservations) {
          const roomId = Object.keys(reservation).join('');
          this.parseDate(reservation[roomId].end_date)
            ? this.plannedReservation.push(reservation[roomId])
            : this.pastReservation.push(reservation[roomId]);
        }
      },
      err => {},
      () => {
        this.isLoading$.next(false);
      }
    );
    this.menuService.menuOpen.subscribe((booleanValue: boolean) => {
      this.menuOpen = booleanValue;
    });
  }

  parseDate(str) {
    const mdy = str.split('-');
    return new Date(mdy[0], mdy[1] - 1, mdy[2]) > new Date() ? true : false;
  }

  toRoomDetail(roomId: number) {
    this.reservationInfoService.id = roomId;
    this.router.navigate([`roomdetail/${roomId}`]);
  }
}
