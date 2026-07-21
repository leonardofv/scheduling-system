<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse 
    {
        $data = $request->validated();

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'password' => Hash::make($data['password']),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json(['user' => new UserResource($user), 'token' => $token], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $data = $request->validated();

        if (!Auth::attempt($data)) {
            throw ValidationException::withMessages([
                'email' => ['Credenciais inválidas'],
            ]);
        }

        /** @var User $user */
        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json(['user' => new UserResource($user), 'token' => $token]);
    }

    public function me(Request $request): UserResource
    {
        return new UserResource($request->user());
    }

    public function updatePhoto(Request $request): JsonResponse
    {
        $request->validate([
            'photo' => 'required|image|max:2048'
        ]);

        $path = $request->file('photo')->store('avatars', 'public');
        $request->user()->update(['photo_path' => $path]);

        return response()->json(new UserResource($request->user()));
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'message' => 'Logout realizado com sucesso'
        ]);
    }

    public function users()
    {
        return UserResource::collection(User::orderBy('id')->paginate(15));
    }
}
