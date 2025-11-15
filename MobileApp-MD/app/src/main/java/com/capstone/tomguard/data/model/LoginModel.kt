package com.capstone.tomguard.data.model

import com.google.gson.annotations.SerializedName

data class LoginResponse(

	@field:SerializedName("user")
	val user: User,

	@field:SerializedName("token")
	val token: String,

	@field:SerializedName("message")
	val message: String,
)

data class User(

	@field:SerializedName("user_id")
	val userId: String,

	@field:SerializedName("email")
	val email: String
)
