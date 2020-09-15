import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { IResponseItem } from '../../../models/response-item.model';
import { select, Store } from '@ngrx/store';
import { IAppState } from 'src/app/redux/state/app.state';
import { getAllVideoCards } from 'src/app/redux/selectors/video-cards.selector';
import { Subscription } from 'rxjs';
import { ICustomItem } from 'src/app/models/custom-item.model';
@Component({
  selector: 'app-detailed-info',
  templateUrl: './detailed-info.component.html',
  styleUrls: ['./detailed-info.component.scss']
})
export class DetailedInfoComponent implements OnInit {

  public itemStoreSub: Subscription;
  public item: IResponseItem | ICustomItem;
  public publishedAt: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public store: Store<IAppState>,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    matIconRegistry.addSvgIcon('like', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/icons/like-icon.svg'));
    matIconRegistry.addSvgIcon('dislike', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/icons/dislike-icon.svg'));
  }

  public ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.itemStoreSub = this.store.pipe(select(getAllVideoCards)).subscribe(
        items => {
          if (items == null || isNaN(params.id) || params.id > items.length || params.id < 1) {
            this.router.navigate(['not-found']);
          }
          this.item = items[params.id - 1];
          console.log(this.item);
          this.publishedAt = (new Date(this.item.snippet.publishedAt)).toDateString();
        }
      );

    });
  }

}
