import { Routes } from '@angular/router';

export const CommonLayout_ROUTES: Routes = [
    {
        path: 'default',
        loadChildren: () => import('../../menu/menu.module').then(m => m.MenuModule)
    }
];
