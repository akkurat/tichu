import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { catchError, throwError } from "rxjs";
import { SnackService } from "../services/snack.service";

@Injectable()
export class XhrInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const xhr = req.clone({
            headers: req.headers.set('X-Requested-With', 'XMLHttpRequest')
        });
        return next.handle(xhr).pipe(
            catchError((error: HttpErrorResponse) => {
                // Handle the error here
                inject(SnackService).push(JSON.stringify(error))
                console.error('error occurred:', error);
                //throw error as per requirement
                return throwError(() => error);
            })
        );
    }
}