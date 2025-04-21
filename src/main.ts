import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideAuth0 } from '@auth0/auth0-angular';

const USE_AUTH0 = false; // 🔥 Toggle this for dev mode
const auth0Provider = USE_AUTH0 ? provideAuth0({
  domain: 'dev-542njpw2o0b02kdk.us.auth0.com',
  clientId: 'Ztk7D9CDKmlyCPi0dNQZpmZgG4dCqMLi',
  authorizationParams: {
    redirect_uri: window.location.origin,
    audience: 'https://manager',
  }
}) : [];

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),
    provideAuth0({
      domain: 'dev-542njpw2o0b02kdk.us.auth0.com', // your Auth0 domain
      clientId: 'Ztk7D9CDKmlyCPi0dNQZpmZgG4dCqMLi',
      authorizationParams: {
        redirect_uri: window.location.origin,
        audience: 'https://manager', // 👈 match this to your backend audience
      }
    })
  ],
});