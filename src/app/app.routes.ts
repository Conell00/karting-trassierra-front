import { Routes } from '@angular/router';

export const routes: Routes = [
    //Página principal
{
    path:'body',
    loadComponent:()=>import('./body/body.component').then(c=>c.BodyComponent)
},
    //Página inicio de sesión
{
    path:'login',
    loadComponent:()=>import('./components/login/login.component').then(c=>c.LoginRegisterComponent)
},
    //Página registro
{
    path:'register',
    loadComponent:()=>import('./components/register/register.component').then(c=>c.RegisterComponent)
},
    //Página mostrar todos los circuitos
{
    path:'circuits',
    loadComponent:()=>import('./components/circuits/circuits.component').then(c=>c.TournamentsComponent)
},
    //Página mostrar un circuito específico
{
    path:'circuito/:id',
    loadComponent:()=>import('./components/circuit/circuit.component').then(c=>c.CircuitComponent)
},
    //Página perfil de usuario
{
    path:'profile',
    loadComponent:()=>import('./components/profile/profile.component').then(c=>c.ProfileComponent)
},
    //Página seleccionar crud
{
    path:'cruds',
    loadComponent:()=>import('./components/cruds/cruds.component').then(c=>c.CrudsComponent)
},
    //Página crud circuito
{
    path:'circuitsCrud',
    loadComponent:()=>import('./components/circuit-crud/circuit-crud.component').then(c=>c.CircuitCrudComponent)
},
{
    path:'tournamentsCrud',
    loadComponent:()=>import('./components/circuits/circuits.component').then(c=>c.TournamentsComponent)
},
    //Página formulario circuito para crear
{
    path:'circuitForm',
    loadComponent:()=>import('./components/circuit-form/circuit-form.component').then(c=>c.CircuitFormComponent)
},
    //Página formulario circuito para editar
{
    path:'circuitForm/:id',
    loadComponent:()=>import('./components/circuit-form/circuit-form.component').then(c=>c.CircuitFormComponent)
},
    //Página crud usuarios
{
    path:'usersCrud',
    loadComponent:()=>import('./components/user-crud/user-crud.component').then(c=>c.UserCrudComponent)
},
    //Página formulario usuario para crear
{
    path:'userForm',
    loadComponent:()=>import('./components/user-form/user-form.component').then(c=>c.UserFormComponent)
},
    //Página formulario usuario para editar
{
    path:'userForm/:id',
    loadComponent:()=>import('./components/user-form/user-form.component').then(c=>c.UserFormComponent)
},
    //Página crud torneos
{
    path:'toursCrud',
    loadComponent:()=>import('./components/tours-crud/tours-crud.component').then(c=>c.ToursCrudComponent)
},
    //Página formulario torneo para crear
{
    path:'tourForm',
    loadComponent:()=>import('./components/tours-form/tours-form.component').then(c=>c.ToursFormComponent)
},
    //Página formulario torneo para editar
{
    path:'tourForm/:id',
    loadComponent:()=>import('./components/tours-form/tours-form.component').then(c=>c.ToursFormComponent)
},
    //Página torneos
{
    path:'tours',
    loadComponent:()=>import('./components/tours/tours.component').then(c=>c.ToursComponent)
},
{
    path:'terms',
    loadComponent:()=>import('./components/terms/terms.component').then(c=>c.TermsComponent)
},
{
    path:'about',
    loadComponent:()=>import('./components/about/about.component').then(c=>c.AboutComponent)
},
{
    path:'help',
    loadComponent:()=>import('./components/help/help.component').then(c=>c.HelpComponent)
},
{//localhost:4200
    path:'',
    redirectTo: '/body',
    pathMatch: 'full',
},
{//path es erróneo
    path:'**',
    loadComponent:()=>import('./pagina404/pagina404.component').then(c=>c.Pagina404Component)
}
];
