package com.capstone.tomguard.data.network

import com.capstone.tomguard.data.model.LoginResponse
import com.capstone.tomguard.data.model.ProfileResponse
import retrofit2.http.Field
import retrofit2.http.FormUrlEncoded
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.POST

interface ApiService {

    @FormUrlEncoded
    @POST("users/login")
    suspend fun login(
        @Field("email") email: String,
        @Field("password") password: String,
    ): LoginResponse

    @GET("profiles")
    suspend fun getProfile(
        @Header("Authorization") token: String
    ): ProfileResponse
}