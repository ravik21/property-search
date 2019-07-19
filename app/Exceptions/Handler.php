<?php

namespace App\Exceptions;

use Exception, Raygun, Response;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;

class Handler extends ExceptionHandler
{
    private $sentryID;
    /**
     * A list of the exception types that should not be reported.
     *
     * @var array
     */
    protected $dontReport = [
        \Illuminate\Auth\AuthenticationException::class,
        \Illuminate\Auth\Access\AuthorizationException::class,
        \Symfony\Component\HttpKernel\Exception\HttpException::class,
        \Illuminate\Database\Eloquent\ModelNotFoundException::class,
        \Illuminate\Session\TokenMismatchException::class,
        \Illuminate\Validation\ValidationException::class,
    ];

    /**
     * Report or log an exception.
     *
     * This is a great spot to send exceptions to Sentry, Bugsnag, etc.
     *
     * @param  \Exception  $exception
     * @return void
     */
    public function report(Exception $exception)
    {
        // if(env('APP_ENV') ==  'production')
        // {
        //     if ($this->shouldReport($exception)) {
        //         app('sentry')->captureException($exception);
        //     }
        // }

        parent::report($exception);
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Exception  $exception
     * @return \Illuminate\Http\Response
     */
    public function render($request, Exception $exception)
    {

        if ($request->segment(1) == 'webkit' && $exception instanceof \ErrorException)
        {
           return Response::json(['error' => 'Invalid API Call']);
        }


        if (env('APP_ENV') ==  'local')
            return parent::render($request, $exception);

        if (env('APP_ENV') ==  'production' && $exception instanceof \ErrorException )
        {
            \Log::info($exception);
            return Response::make(view('errors.400',['message' => 'Bad Request']));

            // return response()->view('errors.500', [
            //     'sentryID' => $this->sentryID,
            // ], 500);
        }

        if ($exception instanceof \ErrorException)
        {
            return Response::make(view('errors.400',['message' => 'Bad Request']));
        }
        elseif ($exception instanceof \Illuminate\Session\TokenMismatchException)
        {
            return Response::make(view('errors.498',['message' => 'Token Mismatch']));
        }
        elseif ($exception instanceof \ModelNotFoundException)
        {
            return Response::make(view('errors.404',['message' => 'Page Not Found']));
        }
        elseif ($this->isHttpException($exception))
        {
            return Response::make(view('errors.404',['message' => 'Page Not Found']));
        }

      return parent::render($request, $exception);
    }

    /**
     * Convert an authentication exception into an unauthenticated response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Illuminate\Auth\AuthenticationException  $exception
     * @return \Illuminate\Http\Response
     */
    protected function unauthenticated($request, AuthenticationException $exception)
    {
        if ($request->expectsJson()) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }

        return redirect()->guest(SITE_LANG.'/login');
    }
}
