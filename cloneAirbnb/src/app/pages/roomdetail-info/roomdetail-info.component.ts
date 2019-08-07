import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UrlRememberService } from 'src/app/core/service/url-remember.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ReservationInfoService } from 'src/app/core/service/reservation-info.service';
import {
  DatepickerDateCustomClasses,
  BsDatepickerConfig
} from 'ngx-bootstrap/datepicker';
import { RoomDetail } from 'src/app/core/interface/roomDetail.interface';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-roomdetail-info',
  templateUrl: './roomdetail-info.component.html',
  styleUrls: ['./roomdetail-info.component.scss']
})
export class RoomdetailInfoComponent implements OnInit {
  appUrl: string = environment.appUrl;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  title: string;
  address: string;
  description: string;
  capacity: number;
  bathroom: number;
  bedroom: number;
  room_type: any;
  facilities: any;
  facilitiesArray = [];
  strArray;
  id: any;
  datePickerConfig: Partial<BsDatepickerConfig>;
  bsInlineValue = this.reservationInfoService.date;
  bsInlineValue2 = new Date();
  minDate: Date;
  maxDate: Date;
  minDate1: number;
  maxDate1: number;
  inputData: Date;
  dateCustomClasses: DatepickerDateCustomClasses[];
  now = new Date();
  fourDaysAhead = new Date();
  reviews: any;

  // 달력 disable
  disabledDates = [];
  reservationsArray = [];
  dateMove;
  strDate;
  listDate = [];
  initCheckin = new Date(this.reservationInfoService.checkInDate);
  initCheckOut = new Date(this.reservationInfoService.checkOutDate);

  constructor(
    private router: Router,
    private urlRemember: UrlRememberService,
    private http: HttpClient,
    private reservationInfoService: ReservationInfoService
  ) {
    this.datePickerConfig = Object.assign(
      {},
      {
        containerClass: 'theme-red',
        selectFromOtherMonth: true
      }
    );
    this.minDate = new Date();
    this.maxDate = new Date();
    // this.bsInlineValue2.setDate(this.bsInlineValue.getDate() + 32);
    // 다음달 달력만들때 필요한것
  }

  ngOnInit() {
    this.urlRemember.currentUrl = this.router.url;
    this.id = this.router.url.split('/');

    this.bsInlineValue2.setMonth(this.bsInlineValue.getMonth() + 1);

    this.http
      .get(`${this.appUrl}/rooms/${this.id[this.id.length - 1]}/`)
      .subscribe(
        (res: RoomDetail) => {
          this.title = res.title;
          this.reservationInfoService.reservationInfoObj.title = res.title;
          this.address = res.address;
          this.room_type = res.room_type;
          this.reservationInfoService.reservationInfoObj.roomType =
            res.room_type;
          this.capacity = res.capacity;
          this.bedroom = res.bedroom;
          this.bathroom = res.bathroom;
          this.description = res.description;
          this.strArray = this.description.split('\n');
          this.facilitiesArray = res.facilities;
          this.reviews = res.reviews;
          this.reservationInfoService.reservationInfoObj.checkInTime = res.check_in;
          this.reservationInfoService.reservationInfoObj.checkOutTime = res.check_out;
          this.reservationInfoService.reservationInfoObj.rating =
            res.total_rating;
          res.reservations.forEach(element => {
            this.getDateRange(element[0], element[1], this.listDate);
          });
          this.setDisableDate();
        },
        err => {},
        () => {
          this.isLoading$.next(false);
        }
      );
  }
  onValueChange(value: Date): void {
    this.listDate = [];

    const endDate = value.toISOString().slice(0, 10);
    this.getDateRange('2019-01-01', endDate, this.listDate);
    this.setDisableDate();
  }

  setDisableDate() {
    this.listDate.forEach(element => {
      this.disabledDates.push(new Date(element));
    });
  }

  getDateRange(startDate, endDate, listDate) {
    this.dateMove = new Date(startDate);
    this.strDate = startDate;
    if (startDate === endDate) {
      this.strDate = this.dateMove.toISOString().slice(0, 10);
      listDate.push(this.strDate);
    } else {
      while (this.strDate < endDate) {
        this.strDate = this.dateMove.toISOString().slice(0, 10);
        listDate.push(this.strDate);
        this.dateMove.setDate(this.dateMove.getDate() + 1);
      }
    }
    return listDate;
  }
}
