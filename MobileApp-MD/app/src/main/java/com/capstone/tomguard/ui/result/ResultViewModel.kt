package com.capstone.tomguard.ui.result

import android.app.Application
import android.content.Context
import android.content.Intent
import android.net.Uri
import androidx.lifecycle.AndroidViewModel
import com.capstone.tomguard.data.PredictionRepository
import com.capstone.tomguard.data.local.database.Prediction
import com.capstone.tomguard.data.DateHelper

class ResultViewModel(application: Application) : AndroidViewModel(application) {
    private val mPredictionRepository: PredictionRepository = PredictionRepository(application)

    private fun insert(prediction: Prediction) {
        mPredictionRepository.insert(prediction)
    }

    fun savePrediction(result: String, inferenceTime: Long, imageUriString: String?) {
        val prediction = Prediction(
            imageUri = imageUriString,
            result = result,
            inferenceTime = inferenceTime,
            date = DateHelper.getCurrentDate()
        )
        imageUriString?.let {
            insert(prediction)
            saveUriPermission(Uri.parse(it))
        }
    }

    private fun saveUriPermission(uri: Uri) {
        val context = getApplication<Application>().applicationContext
        val sharedPref = context.getSharedPreferences("app_prefs", Context.MODE_PRIVATE)
        val editor = sharedPref.edit()
        editor.putString("persisted_uri", uri.toString())
        editor.putInt("persisted_uri_flags", Intent.FLAG_GRANT_READ_URI_PERMISSION)
        editor.apply()
        context.contentResolver.takePersistableUriPermission(
            uri,
            Intent.FLAG_GRANT_READ_URI_PERMISSION
        )
    }

}