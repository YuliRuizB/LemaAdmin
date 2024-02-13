import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, startWith } from 'rxjs/operators';
import { IBreadcrumb } from '../../shared/interfaces/breadcrumb.type';
import { ThemeConstantService } from '../../shared/services/theme-constant.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';

@Component({
  selector: 'app-common-layout',
  templateUrl: './common-layout.component.html',
})

export class CommonLayoutComponent implements OnInit {

  breadcrumbs$: Observable<IBreadcrumb[]> | undefined;
  contentHeaderDisplay: string | undefined;
  isFolded: boolean | undefined;
  isSideNavDark: boolean | undefined;
  isExpand: boolean | undefined;
  selectedHeaderColor: string | undefined;


  constructor(private router: Router, private activatedRoute: ActivatedRoute, private themeService: ThemeConstantService) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let child = this.activatedRoute.firstChild;
        while (child) {
          if (child.firstChild) {
            child = child.firstChild;
          } else if (child.snapshot.data && child.snapshot.data['headerDisplay']) {
            return child.snapshot.data['headerDisplay'];
          } else {
            return null;
          }
        }
        return null;
      })
    ).subscribe((data: any) => {      
      this.contentHeaderDisplay = data;
     });
  }
  redirectTo(place:string){
    this.router.navigate([`/${place}`]);
  }
  ngOnInit(): void {
    this.breadcrumbs$ = this.router.events.pipe(
      startWith(new NavigationEnd(0, '/', '/')),
      filter(event => event instanceof NavigationEnd), distinctUntilChanged(),
      map(data => this.buildBreadCrumb(this.activatedRoute.root))
    );
    this.themeService.isMenuFoldedChanges.subscribe(isFolded => this.isFolded = isFolded);
    this.themeService.isSideNavDarkChanges.subscribe(isDark => this.isSideNavDark = isDark);
    this.themeService.selectedHeaderColor.subscribe(color => this.selectedHeaderColor = color);
    this.themeService.isExpandChanges.subscribe(isExpand => this.isExpand = isExpand);
  }

  private buildBreadCrumb(route: ActivatedRoute, url: string = '', breadcrumbs: IBreadcrumb[] = []): IBreadcrumb[] {
    let label = '', path = '/', display = null;

    if (route.routeConfig) {
     
     if (route.routeConfig.data) {
        label = route.routeConfig.data['title'];
        path += route.routeConfig.path;
      }
    } else {
      label = 'Menu';
      path += 'menu';
    }

    const nextUrl = path && path !== '/menu' ? `${url}${path}` : url;
    const breadcrumb = <IBreadcrumb>{
      label: label, url: nextUrl
    };

    const newBreadcrumbs = label ? [...breadcrumbs, breadcrumb] : [...breadcrumbs];
    if (route.firstChild) {
      return this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
    }
    return newBreadcrumbs;
  }
}
