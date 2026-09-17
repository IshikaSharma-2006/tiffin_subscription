import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/landing/landing')
        .then(m => m.Landing)
  },

  {
    path: 'owner/login',
    loadComponent: () =>
      import('./components/owner/owner-login/owner-login')
        .then(m => m.OwnerLogin)
  },

  {
    path: 'owner/register',
    loadComponent: () =>
      import('./components/owner/owner-register/owner-register')
        .then(m => m.OwnerRegister)
  },

  {
    path: 'owner/dashboard',
    loadComponent: () =>
      import('./components/owner/owner-dashboard/owner-dashboard')
        .then(m => m.OwnerDashboard)
  },
  {
  path: 'owner/customers',
  loadComponent: () =>
    import('./components/customer/customer-list/customer-list')
      .then(m => m.CustomerList)
},

{
  path: 'owner/customers/add',
  loadComponent: () =>
    import('./components/customer/customer-form/customer-form')
      .then(m => m.CustomerForm)
},

{
  path: 'owner/customers/pause',
  loadComponent: () =>
    import('./components/customer/pause-resume/pause-resume')
      .then(m => m.PauseResume)
},

{
  path: 'owner/customers/bill',
  loadComponent: () =>
    import('./components/customer/customer-bill/customer-bill')
      .then(m => m.CustomerBill)
},

  {
    path: '**',
    redirectTo: ''
  }
];