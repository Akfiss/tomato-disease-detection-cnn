package com.capstone.tomguard.ui

import android.app.Application
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import com.capstone.tomguard.ui.dashboard.DashboardViewModel
import com.capstone.tomguard.ui.main.MainViewModel
import com.capstone.tomguard.ui.result.ResultViewModel

class PredictionViewModelFactory (
    private val mApplication: Application
) : ViewModelProvider.NewInstanceFactory() {

    companion object {
        @Volatile
        private var INSTANCE: PredictionViewModelFactory? = null

        @JvmStatic
        fun getInstance(application: Application): PredictionViewModelFactory {
            if (INSTANCE == null) {
                synchronized(PredictionViewModelFactory::class.java) {
                    INSTANCE = PredictionViewModelFactory(application)
                }
            }
            return INSTANCE as PredictionViewModelFactory
        }
    }

    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        return when {
            modelClass.isAssignableFrom(ResultViewModel::class.java) -> {
                ResultViewModel(mApplication) as T
            }
            modelClass.isAssignableFrom(DashboardViewModel::class.java) -> {
                DashboardViewModel(mApplication) as T
            }
            else -> throw IllegalArgumentException("Unknown ViewModel class: ${modelClass.name}")
        }
    }
}