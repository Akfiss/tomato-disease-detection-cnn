package com.capstone.tomguard.data.model

import com.google.gson.annotations.SerializedName

data class ProfileResponse(

    @field:SerializedName("user_id")
    val userId: String,

    @field:SerializedName("profile_picture_url")
    val profilePictureUrl: String,

    @field:SerializedName("name")
    val name: String,

    @field:SerializedName("email")
    val email: String,

    @field:SerializedName("message")
    val message: String? = null

)