import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';

// rxjs
import { Observable } from 'rxjs/Observable';

/**
 * this class intercepts each HTTP request, clones it,
 * and adds criteria before actually performing the
 * AJAX request
 */
@Injectable()
export class SpringInterceptor implements HttpInterceptor {

    constructor() { }

    /*
    * intercept each HTTP rquest and return a modified request
    */
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const modifiedRequest = request.clone({
            withCredentials: true,
            setHeaders: {
                'Content-Type': 'application/json',
            },
        });

        return next.handle(modifiedRequest);
    }
}
