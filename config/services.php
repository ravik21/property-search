<?php

if(isset($_SERVER['SERVER_NAME']))
{
    $SERVER_NAME = $_SERVER['SERVER_NAME'];
    $redirects = [
        'facebook' => 'https://' . $SERVER_NAME .'/auth/facebook/callback',
        'google'   => 'https://' . $SERVER_NAME .'/auth/google/callback'
    ];
}

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Stripe, Mailgun, SparkPost and others. This file provides a sane
    | default location for this type of information, allowing packages
    | to have a conventional place to find your various credentials.
    |
    */

    'facebook' => [
      'client_id' => env('FB_CLIENT_ID'),
      'client_secret' => env('FB_CLIENT_SECRET'),
      'redirect' => isset($redirects['facebook']) ? $redirects['facebook'] : env('FB_REDIRECT'),
    ],

    'google' => [
      'client_id' => env('GOOGLE_CLIENT_ID'),
      'client_secret' => env('GOOGLE_CLIENT_SECRET'),
      'redirect' => isset($redirects['google']) ? $redirects['google'] : env('GOOGLE_REDIRECT'),
    ],

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_CLIENT_SECRET_KEY'),
    ],

    'ses' => [
        'key' => env('SES_KEY'),
        'secret' => env('SES_SECRET'),
        'region' => 'us-east-1',
    ],

    'sparkpost' => [
        'secret' => env('SPARKPOST_SECRET'),
    ],

    'stripe' => [
        'model' => App\User::class,
        'key' => env('STRIPE_KEY'),
        'secret' => env('STRIPE_SECRET'),
    ],
];
