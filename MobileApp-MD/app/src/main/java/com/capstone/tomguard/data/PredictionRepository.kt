package com.capstone.tomguard.data

import android.app.Application
import androidx.lifecycle.LiveData
import com.capstone.tomguard.data.local.database.Prediction
import com.capstone.tomguard.data.local.database.PredictionDao
import com.capstone.tomguard.data.local.database.PredictionRoomDatabase
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors

class PredictionRepository(application: Application) {

    private val mPredictionsDao: PredictionDao
    private val executorService: ExecutorService = Executors.newSingleThreadExecutor()

    init {
        val db = PredictionRoomDatabase.getDatabase(application)
        mPredictionsDao = db.predictionsDao()
    }

    fun getAllPredictions(): LiveData<List<Prediction>> = mPredictionsDao.getAllPredictions()

    fun insert(prediction: Prediction) {
        executorService.execute { mPredictionsDao.insert(prediction) }
    }
}