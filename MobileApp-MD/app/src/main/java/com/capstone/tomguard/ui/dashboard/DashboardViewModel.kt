package com.capstone.tomguard.ui.dashboard

import android.app.Application
import androidx.lifecycle.LiveData
import androidx.lifecycle.ViewModel
import com.capstone.tomguard.data.PredictionRepository
import com.capstone.tomguard.data.local.database.Prediction

class DashboardViewModel(application: Application) : ViewModel() {
    private val mPredictionRepository: PredictionRepository = PredictionRepository(application)

    fun getAllPredictions(): LiveData<List<Prediction>> = mPredictionRepository.getAllPredictions()
}