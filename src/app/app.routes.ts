import { Routes } from '@angular/router';
import {Layout} from './layout/layout/layout';
import {Dashboard} from './components/dashboard/dashboard';
import {Analyst} from './components/analyst/analyst';
import { Inventory } from './components/inventory/inventory';
import { Customer } from './components/customer/customer';
import { Transaction } from './components/transaction/transaction';
import { Orders } from './components/orders/orders';
import { LoginSignup } from './components/login-signup/login-signup';
import {authGuard} from './security/guard/auth-guard';
import {Location} from './components/location/location'

export const routes: Routes = [
    
    {
        path:'',
        component:LoginSignup
    },
    {
        path:'',
        component: Layout,
        canActivate: [authGuard], // Apply the authGuard to this route
        children: [
            {
            path:'dashboard',
            component: Dashboard
            },{
                path: 'analyst',
                component: Analyst
            },{
                path:'inventory',
                component: Inventory
            },{
                path:'customer',
                component:Customer
            },{
                path:'transactions',
                component: Transaction
            },{
                path:'orders',
                component: Orders
            },{
                path:'location',
                component:Location
            }]
    }
];
