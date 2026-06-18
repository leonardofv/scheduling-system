<?php

use Illuminate\Auth\AuthenticationException;
use Illuminate\Auth\Middleware\Authenticate;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (): void {
        //mostrar erro personalizado ao testar rotas
        Authenticate::redirectUsing(fn (Request $request) => null); 
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*'),
        );
        $exceptions->render(function (AuthenticationException $e, Request $request) {
            if($request->is('api/*')) {
                return response()->json([
                    'message' => 'Você precisa estar autenticado para acessar esse recurso.',
                    'detalhe' => $e->getMessage()
                ], 401);
            }
        });
    })->create();
