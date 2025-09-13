import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

/**
 * Waits for the AuthService to complete its initialization
 */
async function waitForAuthInitialization(authService: AuthService): Promise<void> {
  return new Promise((resolve) => {
    const checkLoading = () => {
      if (authService.loading()) {
        setTimeout(checkLoading, 50);
      } else {
        resolve();
      }
    };
    checkLoading();
  });
}

/**
 * Redirects unauthenticated users to login page
 */
function redirectToLogin(router: Router, returnUrl: string): void {
  router.navigate(['/auth/login'], {
    queryParams: { returnUrl }
  });
}

/**
 * Checks if user is authenticated after auth initialization is complete
 */
function isUserAuthenticated(authService: AuthService): boolean {
  return authService.isAuthenticated();
}

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Wait for auth service to complete initialization
  await waitForAuthInitialization(authService);

  // Check authentication status
  const authenticated = isUserAuthenticated(authService);

  if (!authenticated) {
    redirectToLogin(router, state.url);
    return false;
  }

  return true;
};
