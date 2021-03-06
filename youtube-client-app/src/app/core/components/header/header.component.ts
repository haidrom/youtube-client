import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { Subscription, fromEvent, from } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginService } from '@core/services/login.service';
import { Store } from '@ngrx/store';
import { IAppState } from '@redux/state/app.state';
import { VideoCardsActionTypes } from '@redux/actions/video-cards.action';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public filterIsShown: boolean = false;
  public logoutIsShown: boolean = false;
  public userName: string;

  public searchInputSub: Subscription;

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private loginService: LoginService,
    private router: Router,
    private store: Store<IAppState>
  ) {
    matIconRegistry.addSvgIcon('filter', this.domSanitizer.bypassSecurityTrustResourceUrl('../../assets/icons/filter-icon.svg'));
    matIconRegistry.addSvgIcon('logout', this.domSanitizer.bypassSecurityTrustResourceUrl('../../assets/icons/logout-icon.svg'));
  }

  public ngOnInit(): void {
    this.searchInputSub = fromEvent(document.getElementById('search-input'), 'input')
    .pipe(
      debounceTime(500),
      map((event: KeyboardEvent) => (event.target as HTMLInputElement).value),
      filter((value: string) => value.length > 2),
      distinctUntilChanged())
    .subscribe(inputValue => {
      this.store.dispatch({type: VideoCardsActionTypes.getAPICards, payload: inputValue});
      if (this.router.url === '/not-found' || this.router.url.startsWith('/main/')) {
        this.router.navigate(['main']);
      }
    });

    this.loginService.subject.subscribe(name => {
      if (name !== null) {
        this.userName = name;
        this.logoutIsShown = true;
      } else {
        this.userName = null;
        this.logoutIsShown = false;
      }
    });
  }

  public showFilter(): void {
    this.filterIsShown = !this.filterIsShown;
  }

  public logOut(): void {
    this.loginService.logOut();
    this.router.navigate(['login']);
  }

}
