package com.capstone.tomguard.ui.profile

import androidx.lifecycle.LiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.asLiveData
import androidx.lifecycle.liveData
import androidx.lifecycle.viewModelScope
import com.capstone.tomguard.data.Result
import com.capstone.tomguard.data.UserRepository
import com.capstone.tomguard.data.model.UserModel
import kotlinx.coroutines.launch

class ProfileViewModel(private val userRepository: UserRepository) : ViewModel() {

    fun getSession(): LiveData<UserModel> {
        return userRepository.getSession().asLiveData()
    }

    fun getProfile(token: String) = liveData {
        emit(Result.Loading)
        val profile = userRepository.getProfile(token)
        emitSource(profile)
    }

    fun logout() {
        viewModelScope.launch {
            userRepository.logout()
        }
    }
}